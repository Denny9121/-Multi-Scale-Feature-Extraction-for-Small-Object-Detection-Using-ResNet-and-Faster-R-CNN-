export const DEFECT_CLASSES = {
  crazing: { color: "#FF6B6B", icon: "⬡", description: "Network of fine surface cracks" },
  inclusion: { color: "#FFD93D", icon: "◈", description: "Foreign material embedded in surface" },
  patches: { color: "#6BCB77", icon: "▦", description: "Irregular surface discoloration areas" },
  pitted_surface: { color: "#4D96FF", icon: "◉", description: "Small cavities or craters on surface" },
  "rolled-in_scale": { color: "#C77DFF", icon: "≋", description: "Oxide scale pressed into surface" },
  scratches: { color: "#FF9A3C", icon: "∕∕", description: "Linear surface damage marks" },
};

export const DEFECT_ORDER = Object.keys(DEFECT_CLASSES);

export const toLabel = (key = "") =>
  key
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
