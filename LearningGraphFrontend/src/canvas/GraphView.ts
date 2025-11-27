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
    const screenPos = this.model.modelToScreenCoords(node.position);
    const x = screenPos.x;
    const y = screenPos.y;

    ctx.beginPath();
    ctx.arc(x, y, node.radius * this.model.zoomLevel, 0, Math.PI * 2);
    ctx.fillStyle = "lightblue";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    // Draw label
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, x, y);
  });
}
}
