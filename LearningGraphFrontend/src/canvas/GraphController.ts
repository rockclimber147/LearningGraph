import { GraphModel } from "./GraphModel";

export class GraphController {
  private model: GraphModel;

  constructor(model: GraphModel) {
    this.model = model;
  }

  handleClick(x: number, y: number) {
    this.model.addNode({
      id: Date.now().toString(),
      x,
      y,
      label: "Node",
    });
  }
}
