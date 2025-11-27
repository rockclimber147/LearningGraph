import { GraphModel } from "./GraphModel";

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D, model: GraphModel): void
}

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

    model.layers.forEach(layer => {
      layer.forEach(drawable => drawable.draw(ctx, model))
    })
  }
}
