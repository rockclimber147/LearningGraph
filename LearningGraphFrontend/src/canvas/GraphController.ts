import { GraphModel, Coordinate } from "./GraphModel";
import { MouseState, MouseButtons } from "./MouseState";

export class GraphController {
  private model: GraphModel;
  private mouseState: MouseState;

  constructor(model: GraphModel) {
    this.model = model;
    this.mouseState = new MouseState();
  }

  updateMousePosition(e: MouseEvent) {
    // Update mouse coordinates
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.mouseState.updatePosition(x, y);
  }

  updateMouseState(e: MouseEvent) {
    this.updateMousePosition(e);
    // Update button state
    // MouseEvent.buttons is a bitmask: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    // Left = 1, Right = 2, Middle = 4
    this.mouseState.setButtonDown(MouseButtons.Left,  !!(e.buttons & 1));
    this.mouseState.setButtonDown(MouseButtons.Right, !!(e.buttons & 2));
    this.mouseState.setButtonDown(MouseButtons.Middle,!!(e.buttons & 4));
  }
  
  handleWheel(e: WheelEvent) {
    this.updateMousePosition(e)
    const zoomFactor = 1.1; // how much to zoom per wheel notch
    const model = this.model;
    const deltaY = e.deltaY;
    const mousePos = this.mouseState.lastCoords

    const oldZoom = model.zoomLevel;
    let newZoom = oldZoom;

    if (deltaY < 0) {
      // zoom in
      newZoom *= zoomFactor;
    } else {
      // zoom out
      newZoom /= zoomFactor;
    }

    // clamp zoom to reasonable range
    newZoom = Math.max(0.1, Math.min(10, newZoom));

    // Compute new offset so that the point under mouse stays the same
    // formula: newOffset = mousePos - ((mousePos - oldOffset) * newZoom / oldZoom)
    const offset = model.globalOffset;
    const dx = mousePos.x - ((mousePos.x - offset.x) * newZoom) / oldZoom;
    const dy = mousePos.y - ((mousePos.y - offset.y) * newZoom) / oldZoom;

    model.zoomLevel = newZoom;
    model.globalOffset = new Coordinate(dx, dy);
  }

  handleMouseInteractions(view: { render: () => void }) {
    const m = this.mouseState;

    // ---- Left click adds a node ----
    if (m.leftDown && !m.wasLeftDown) {
      const nodePosition = this.model.screenToModelCoords(m.lastCoords);
      this.model.addNode({
        id: Date.now().toString(),
        position: nodePosition,
        label: "Node",
        radius: 25
      });
    }

    // ---- Middle drag to pan ----
    if (m.middleDown && m.wasMiddleDown) {
      const dx = m.lastCoords.x - m.lastDragCoords.x;
      const dy = m.lastCoords.y - m.lastDragCoords.y;
      this.model.adjustOffset(dx, dy);
    }

    // Save previous states for edge detection
    m.wasLeftDown = m.leftDown;
    m.wasMiddleDown = m.middleDown;
    m.lastDragCoords = m.lastCoords.clone();

    // Always re-render
    view.render();
  }
}
