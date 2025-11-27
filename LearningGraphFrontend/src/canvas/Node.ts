import { type Drawable } from "./GraphView";
import { GraphModel, Coordinate } from "./GraphModel";

export class GraphNode implements Drawable {
  id: number;
  position: Coordinate;
  label: string;
  radius: number = 25;
  neighbors = new Set<number>();

  constructor(id: number, position: Coordinate, label: string) {
    this.id = id;
    this.position = position;
    this.label = label;
  }

  addNeighbor(otherId: number) {
    this.neighbors.add(otherId);
  }

  removeNeighbor(otherId: number) {
    this.neighbors.delete(otherId);
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

export class NodeIdGenerator {
  private static currId = 1;

  static nextId(): number {
    return this.currId++;
  }

  static reset(startAt = 1) {
    this.currId = startAt;
  }
}