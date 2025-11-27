import { GraphModel } from "./GraphModel";

export class GraphView {
  private ctx: CanvasRenderingContext2D;
  private model: GraphModel;

  constructor(ctx: CanvasRenderingContext2D, model: GraphModel) {
    this.ctx = ctx;
    this.model = model;
  }

  render() {
    const { ctx, model } = this;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    model.nodes.forEach(node => {
      ctx.fillStyle = "lightblue";
      ctx.fillRect(node.x - 25, node.y - 25, 50, 50);

      ctx.fillStyle = "black";
      ctx.fillText(node.label, node.x, node.y);
    });
  }
}
