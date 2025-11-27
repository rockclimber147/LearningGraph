import { type Drawable } from "./GraphView";
import { GraphNode } from "./Node";
import { GraphModel, Coordinate } from "./GraphModel";

export class Line implements Drawable {
  start: Coordinate;
  end: Coordinate;

  constructor(start: Coordinate, end: Coordinate) {
    this.start = start;
    this.end = end;
  }

  draw(ctx: CanvasRenderingContext2D, model: GraphModel): void {
    const startScreen = model.modelToScreenCoords(this.start);
    const endScreen = model.modelToScreenCoords(this.end);

    ctx.beginPath();
    ctx.moveTo(startScreen.x, startScreen.y);
    ctx.lineTo(endScreen.x, endScreen.y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }
}

export class NodeConnection extends Line {
    startNode: GraphNode;
    endNode: GraphNode;

    constructor(start: GraphNode, end: GraphNode) {
        super(start.position, end.position)
        this.startNode = start;
        this.endNode = end;
    }

    connects(a: number, b: number): boolean {
    return (
        (this.startNode.id === a && this.endNode.id === b) ||
        (this.startNode.id === b && this.endNode.id === a)
        );
    }
}