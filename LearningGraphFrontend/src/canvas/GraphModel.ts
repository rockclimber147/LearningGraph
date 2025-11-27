import { GraphNode } from "./Node";
import { Line } from "./Drawables";
import { type Drawable } from "./GraphView";

export class GraphModel {
  nodes: GraphNode[] = [];
  lines: Line[] = [];
  layers: Drawable[][] = [];
  private _globalOffset = new Coordinate(); // combine x/y offsets
  _zoomLevel: number = 1;

  constructor() {
    this.layers[0] = this.lines;
    this.layers[1] = this.nodes;
  }

  screenToModelCoords(screen: Coordinate): Coordinate {
    return screen.clone()
      .sub(this._globalOffset)
      .scale(1 / this._zoomLevel);
  }

  modelToScreenCoords(model: Coordinate): Coordinate {
    return model.clone()
      .scale(this._zoomLevel)
      .add(this._globalOffset);
  }

  addNode(node: GraphNode) {
    this.nodes.forEach(existingNode => this.lines.push(new Line(existingNode.position, node.position)))
    this.nodes.push(node);
  }

  removeNode(id: string) {
    this.nodes = this.nodes.filter(n => n.id !== id);
  }

  get globalOffset() {
    return this._globalOffset.clone();
  }

  set globalOffset(coord: Coordinate) {
    this._globalOffset = coord.clone();
  }

  adjustOffset(dx: number, dy: number) {
    this._globalOffset.add(new Coordinate(dx, dy));
  }

  get zoomLevel() {
    return this._zoomLevel;
  }

  set zoomLevel(z: number) {
    this._zoomLevel = z;
  }
}

export class Coordinate {
  x: number = 0;
  y: number = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(coord: Coordinate) {
    this.x += coord.x;
    this.y += coord.y;
    return this;
  }

  sub(coord: Coordinate) {
    this.x -= coord.x;
    this.y -= coord.y;
    return this;
  }

  scale(factor: number) {
    this.x *= factor;
    this.y *= factor;
    return this;
  }

  clone() {
    return new Coordinate(this.x, this.y);
  }
}