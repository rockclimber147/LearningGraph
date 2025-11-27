import { GraphModel, Coordinate } from "./GraphModel";

export class GraphController {
  private model: GraphModel;

  constructor(model: GraphModel) {
    this.model = model;
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
}
