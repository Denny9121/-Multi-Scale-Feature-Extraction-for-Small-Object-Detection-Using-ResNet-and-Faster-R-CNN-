# Project Current Status (Simple Document)

## 1) Project Overview

This project is a web app for NEU steel surface defect analysis.  
It uses a trained PyTorch model (EfficientNet-B0 based) and a FastAPI backend.

Current app behavior:
- Accepts image upload (file or base64).
- Classifies image into 1 of 6 classes.
- Returns class confidence + all class probabilities.
- Generates an annotated image with bounding boxes and labels.
- Shows results in browser UI (including detected object count).

---

## 2) Current Run Status

- Backend command: `python app.py`
- URL: `http://127.0.0.1:5000`
- Status: Running and tested successfully.
- `/predict` currently returns:
  - `class`
  - `confidence`
  - `probabilities`
  - `annotated_image` (base64 PNG)
  - `detections` (box list with label + confidence)

---

## 3) Folder / File Status

Main files used by application:
- `app.py` -> FastAPI backend, model loading, prediction, annotation generation.
- `templates/index.html` -> Main UI structure.
- `static/js/main.js` -> Frontend logic and API integration.
- `static/css/style.css` -> UI styling.
- `models/best_model.pth` -> Trained model weights.
- `requirements.txt` -> Python dependencies.
- `README.md` -> Basic setup and usage details.

---

## 4) Backend Function Analysis (`app.py`)

### Constants / Setup
- `MODEL_PATH` -> path to trained model file.
- `CLASSES` -> defect class names:
  - `crazing`, `inclusion`, `patches`, `pitted_surface`, `rolled-in_scale`, `scratches`
- `CLASS_COLORS` -> color mapping used for detection box drawing.
- `transform` -> resize + normalize pipeline for model input.

### Function: `_extract_defect_boxes(img, max_boxes=5)`
Purpose:
- Finds likely defect regions from the image.

How it works:
- Converts image to grayscale and resizes to `200x200`.
- Applies blur to reduce noise.
- Creates binary mask using darker-pixel threshold.
- Runs connected-component search (DFS stack).
- Filters tiny/noisy components.
- Scales selected boxes back to original image size.

Output:
- List of bounding boxes `(x1, y1, x2, y2)`.

### Function: `_render_annotated_image(img, label, confidence)`
Purpose:
- Draws bounding boxes + text labels on image.

How it works:
- Gets boxes from `_extract_defect_boxes`.
- Uses full-image fallback box if no region found.
- Draws rectangle and label background/text for each box.
- Builds `detections` metadata list.
- Encodes final image as base64 PNG.

Output:
- `annotated_image` as `data:image/png;base64,...`
- `detections` list with:
  - `label`
  - `confidence`
  - `box` coordinates

### Function: `load_model()`
Purpose:
- Loads trained EfficientNet model and prepares it for inference.

How it works:
- Verifies model file exists.
- Creates EfficientNet-B0 architecture.
- Replaces classifier head for 6 classes.
- Loads saved state dict from `best_model.pth`.
- Sets model to evaluation mode.

Output:
- Ready-to-use PyTorch model.

### Route: `GET /` (`index`)
Purpose:
- Serves main page (`index.html`).

### Route: `POST /predict` (`predict`)
Purpose:
- Main inference endpoint.

Flow:
- Validates request input (file or base64 image).
- Parses image and checks minimum size.
- Applies transforms and runs model inference.
- Creates class probabilities + top prediction.
- Generates annotated detection image and detection metadata.
- Returns JSON response used by frontend.

Error handling:
- Returns HTTP errors for missing/invalid input.
- Catches unexpected exceptions as server error response.

---

## 5) Frontend Function Analysis (`static/js/main.js`)

### Main Startup
- Uses `DOMContentLoaded` to initialize UI and event listeners.

### Function: `handleFileSelect(e)`
Purpose:
- Reads selected image and shows preview panel.

### Function: `analyzeImage()`
Purpose:
- Sends image to backend for prediction.

How it works:
- Shows loading overlay.
- Builds `FormData`.
- Sends `POST /predict`.
- On success calls `displayResults(data)`.
- On failure shows error alert.

### Function: `displayResults(data)`
Purpose:
- Renders prediction result in UI.

What it updates:
- Defect class label and icon.
- Defect description text.
- Confidence text.
- Annotated detection image.
- Detected objects count (`N objects detected`).
- Probability bars (sorted descending, animated width + color).

### Function: `resetUI()`
Purpose:
- Clears file, preview, results, and detection output.

### Function: `formatDefectName(name)`
Purpose:
- Converts snake/kebab case to user-friendly Title Case.

---

## 6) UI Content Status

### `templates/index.html`
Contains:
- Upload/drop area.
- Image preview section.
- Analyze and Reset buttons.
- Detection preview card (`annotatedImage`, object count).
- Detected defect summary card.
- Probability distribution section.
- Defect reference information cards.

### `static/css/style.css`
Contains:
- Full styling for layout, cards, buttons, preview areas, overlays, responsiveness.
- Defect color classes.
- New detection preview styles:
  - `.detection-preview-card`
  - `.detection-image-wrapper`

---

## 7) Dependencies (`requirements.txt`)

- `fastapi`
- `uvicorn`
- `python-multipart`
- `jinja2`
- `torch`
- `torchvision`
- `pillow`
- `numpy`

---

## 8) Notes / Limitations

- Model is still a classifier (not a trained object detector).
- Bounding boxes are heuristic region estimates from image processing.
- For production-grade detection, a dedicated detection model (YOLO/Faster R-CNN/etc.) with box annotations is recommended.

---

## 9) Quick Usage

1. Run: `python app.py`  
2. Open: `http://127.0.0.1:5000`  
3. Upload image -> click **Analyze Defect**  
4. View:
   - defect class
   - confidence/probabilities
   - annotated image with labeled boxes

