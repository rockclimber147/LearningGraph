import { type Drawable } from "./GraphView";
import { GraphModel, Coordinate } from "./GraphModel";

export class GraphNode implements Drawable {
  id: string;
  position: Coordinate;
  label: string;
  radius: number = 25;

  constructor(id: string, position: Coordinate, label: string) {
    this.id = id;
    this.position = position;
    this.label = label;
  }

  draw(ctx: CanvasRenderingContext2D, model: GraphModel) {
    const screenPos = model.modelToScreenCoords(this.position);
    const x = screenPos.x;
    const y = screenPos.y;

    // Draw circle
    ctx.beginPath();
    ctx.arc(x, y, this.radius * model.zoomLevel, 0, Math.PI * 2);
    ctx.fillStyle = "lightblue";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    // Draw label
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.label, x, y);
  }
}
