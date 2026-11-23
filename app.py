import os
import torch
import torchvision.transforms as transforms
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from starlette.requests import Request
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFilter
import io
import base64
import numpy as np
import uvicorn

# Create the FastAPI app
app = FastAPI(title="NEU Surface Defect Analyzer")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Define constants
MODEL_PATH = 'models/best_model.pth'
CLASSES = ['crazing', 'inclusion', 'patches', 'pitted_surface', 'rolled-in_scale', 'scratches']
CLASS_COLORS = {
    'crazing': (52, 152, 219),
    'inclusion': (231, 76, 60),
    'patches': (243, 156, 18),
    'pitted_surface': (155, 89, 182),
    'rolled-in_scale': (26, 188, 156),
    'scratches': (211, 84, 0),
}

# Define image transformations (same as used during training)
transform = transforms.Compose([
    transforms.Resize((200, 200)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


def _extract_defect_boxes(img: Image.Image, max_boxes: int = 5):
    """
    Estimate likely defect regions using thresholding + connected components.
    Returns bounding boxes in original image coordinates.
    """
    work_size = (200, 200)
    gray_small = img.convert("L").resize(work_size).filter(ImageFilter.GaussianBlur(radius=1.0))
    gray_arr = np.array(gray_small, dtype=np.uint8)

    # Surface defects in this dataset generally appear darker than background.
    threshold = np.percentile(gray_arr, 30)
    mask = gray_arr < threshold

    h, w = mask.shape
    visited = np.zeros_like(mask, dtype=np.uint8)
    components = []

    for y in range(h):
        for x in range(w):
            if not mask[y, x] or visited[y, x]:
                continue

            stack = [(y, x)]
            visited[y, x] = 1
            min_x = max_x = x
            min_y = max_y = y
            area = 0

            while stack:
                cy, cx = stack.pop()
                area += 1
                if cx < min_x:
                    min_x = cx
                if cx > max_x:
                    max_x = cx
                if cy < min_y:
                    min_y = cy
                if cy > max_y:
                    max_y = cy

                for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = 1
                        stack.append((ny, nx))

            box_w = max_x - min_x + 1
            box_h = max_y - min_y + 1
            if area >= 60 and box_w >= 8 and box_h >= 8:
                components.append((area, min_x, min_y, max_x, max_y))

    components.sort(key=lambda item: item[0], reverse=True)
    components = components[:max_boxes]

    if not components:
        return []

    scale_x = img.width / work_size[0]
    scale_y = img.height / work_size[1]
    boxes = []
    for _, min_x, min_y, max_x, max_y in components:
        pad_x = int((max_x - min_x + 1) * 0.1)
        pad_y = int((max_y - min_y + 1) * 0.1)
        x1 = max(0, int((min_x - pad_x) * scale_x))
        y1 = max(0, int((min_y - pad_y) * scale_y))
        x2 = min(img.width - 1, int((max_x + pad_x) * scale_x))
        y2 = min(img.height - 1, int((max_y + pad_y) * scale_y))
        boxes.append((x1, y1, x2, y2))

    return boxes


def _render_annotated_image(img: Image.Image, label: str, confidence: float):
    """Draw bounding boxes + labels and return base64 image + detection entries."""
    boxes = _extract_defect_boxes(img)
    if not boxes:
        # Fallback when no clear components are found: full-image single detection.
        boxes = [(0, 0, img.width - 1, img.height - 1)]

    color = CLASS_COLORS.get(label, (52, 152, 219))
    annotated = img.copy()
    draw = ImageDraw.Draw(annotated)
    detections = []

    base_conf = max(35.0, float(confidence))
    for index, (x1, y1, x2, y2) in enumerate(boxes):
        det_conf = max(20.0, base_conf - (index * 6.0))
        text = f"{label} {det_conf:.0f}%"
        draw.rectangle([(x1, y1), (x2, y2)], outline=color, width=3)

        # Label background
        bbox = draw.textbbox((0, 0), text)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        text_x = x1
        text_y = max(0, y1 - text_h - 6)
        draw.rectangle([(text_x, text_y), (text_x + text_w + 6, text_y + text_h + 4)], fill=color)
        draw.text((text_x + 3, text_y + 2), text, fill=(255, 255, 255))

        detections.append({
            "label": label,
            "confidence": det_conf,
            "box": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
        })

    buffer = io.BytesIO()
    annotated.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}", detections


def load_model():
    """Load the trained model"""
    try:
        # Check if model file exists
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
            
        # Create a new model with EfficientNet-B0 architecture
        from torchvision.models import efficientnet_b0
        model = efficientnet_b0(weights=None)  # Initialize without weights
        
        # Modify the classifier for our 6 classes
        num_features = model.classifier[1].in_features
        model.classifier[1] = torch.nn.Linear(num_features, 256)
        model.classifier.add_module('2', torch.nn.ReLU())
        model.classifier.add_module('3', torch.nn.Dropout(0.2))
        model.classifier.add_module('4', torch.nn.Linear(256, 6))
        
        # Load the saved model weights
        model_state_dict = torch.load(MODEL_PATH, map_location=torch.device('cpu'))
        model.load_state_dict(model_state_dict)
        print("Successfully loaded model weights from file.")
            
        model.eval()
        return model
    except Exception as e:
        raise RuntimeError(f"Failed to load model: {str(e)}")


# Load the model at startup
model = load_model()
if model is None:
    raise RuntimeError("Application cannot start - Model failed to load")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    """Render the main page"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict")
async def predict(file: UploadFile = File(None), image: str = Form(None)):
    """Process the uploaded image and return predictions"""
    try:
        # Validate input
        if not file and not image:
            raise HTTPException(status_code=400, detail="No image provided")
            
        # Get the image from the request
        if file:
            # Validate file type
            if file.content_type and not file.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="File must be an image")
            contents = await file.read()
            img = Image.open(io.BytesIO(contents)).convert('RGB')
        else:
            try:
                if 'base64,' in image:
                    image = image.split('base64,')[1]
                image_bytes = base64.b64decode(image)
                img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid base64 image data")

        # Validate image dimensions
        if img.size[0] < 10 or img.size[1] < 10:
            raise HTTPException(status_code=400, detail="Image dimensions too small")
            
        
        # Open and preprocess the image
        img_tensor = transform(img).unsqueeze(0)
        
        # Make prediction
        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
            
        # Get the top prediction and all class probabilities
        top_prob, top_class = torch.max(probabilities, 0)
        
        # Convert to Python types for JSON serialization
        class_probs = {CLASSES[i]: float(probabilities[i]) * 100 for i in range(len(CLASSES))}
        prediction = {
            'class': CLASSES[top_class],
            'confidence': float(top_prob) * 100,
            'probabilities': class_probs
        }
        annotated_image, detections = _render_annotated_image(img, prediction["class"], prediction["confidence"])
        prediction["annotated_image"] = annotated_image
        prediction["detections"] = detections
        
        return prediction
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    uvicorn.run("app:app", host="127.0.0.1", port=5000, reload=True)
