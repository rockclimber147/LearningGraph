import { type Drawable } from "./GraphView";
import { GraphModel, Coordinate } from "./GraphModel";
import type { FileNode } from "../components/FileTree/FileTree";

export class GraphNode implements Drawable {
  id: number;
  position: Coordinate;
  velocity: Coordinate = new Coordinate(0, 0);
  label: string;
  color: string;
  radius: number = 25;
  neighbors = new Set<number>();
  isHovered: boolean = false;

  constructor(id: number, position: Coordinate, label: string, color: string = "lightblue") {
    this.id = id;
    this.position = position;
    this.label = label;
    this.color = color;
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
    if (this.isHovered) {
        ctx.fillStyle = "darkblue";
    } else {
        ctx.fillStyle = this.color;
    }
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
  private static currId = 0;

  static nextId(): number {
    return this.currId++;
  }

  static getCurrId(): number {
    return this.currId;
  }

  static reset(startAt = 1) {
    this.currId = startAt;
  }
}

export class NodeFactory {
  static fromFileNode(fileNode: FileNode, position: Coordinate): GraphNode {
    return new GraphNode(
            NodeIdGenerator.nextId(),
            position,
            fileNode.name,
            fileNode.type == "folder" ? "lightGreen" : "lightBlue"
        );
  }
}