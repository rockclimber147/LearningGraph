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

    const xOffset = model.globalOffset.x;
    const yOffset = model.globalOffset.y;

    model.nodes.forEach(node => {
      const x = node.x + xOffset;
      const y = node.y + yOffset;
      const radius = 25;

      // Draw circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "lightblue";
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.closePath();

      // Draw label centered
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, x, y);
    });
  }
}
