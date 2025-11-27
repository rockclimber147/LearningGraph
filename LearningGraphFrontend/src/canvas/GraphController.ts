import { GraphModel } from "./GraphModel";

export class GraphController {
  private model: GraphModel;

  constructor(model: GraphModel) {
    this.model = model;
  }

  handleLeftClick(x: number, y: number) {
    const m = this.model;
    m.addNode({
      id: Date.now().toString(),
      x: x - m.globalXOffset,
      y: y - m.globalYOffset,
      label: "Node",
    });
  }

  pan(dx: number, dy: number) {
    this.model.adjustOffset(dx, dy);
  }
}
