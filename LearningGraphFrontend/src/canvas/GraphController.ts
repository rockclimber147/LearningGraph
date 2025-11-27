import { GraphModel, Coordinate } from "./GraphModel";
import { MouseState, MouseButtons } from "./MouseState";

export class GraphController {
  private model: GraphModel;
  private mouseState: MouseState;

  constructor(model: GraphModel) {
    this.model = model;
    this.mouseState = new MouseState();
  }

  updateMouseState(e: MouseEvent) {
    // Update mouse coordinates
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.mouseState.updatePosition(x, y);

    // Update button state
    // MouseEvent.buttons is a bitmask: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    // Left = 1, Right = 2, Middle = 4
    this.mouseState.setButtonDown(MouseButtons.Left,  !!(e.buttons & 1));
    this.mouseState.setButtonDown(MouseButtons.Right, !!(e.buttons & 2));
    this.mouseState.setButtonDown(MouseButtons.Middle,!!(e.buttons & 4));
  }

  handleLeftClick(x: number, y: number) {
    const m = this.model;
    m.addNode({
      id: Date.now().toString(),
      position: new Coordinate(
        x - m.globalOffset.x,
        y - m.globalOffset.y,
      ),
      label: "Node",
    });
  }

  pan(dx: number, dy: number) {
    this.model.adjustOffset(dx, dy);
  }
  
  handleWheel(deltaY: number) {
    if (deltaY < 0) {
      console.log("Zoom in");
    } else {
      console.log("Zoom out");
    }
  }

    handleMouseInteractions(view: { render: () => void }) {
    const m = this.mouseState;

    // ---- Left click adds a node ----
    if (m.leftDown && !m.wasLeftDown) {
      const clickCoords = m.lastCoords.clone();
      const nodePosition = clickCoords.sub(this.model.globalOffset)
      this.model.addNode({
        id: Date.now().toString(),
        position: nodePosition,
        label: "Node",
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
