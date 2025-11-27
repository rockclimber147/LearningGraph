export interface GraphNode {
  id: string;
  position: Coordinate;
  label: string;
}

export class GraphModel {
  nodes: GraphNode[] = [];

  private _globalOffset = new Coordinate(); // combine x/y offsets
  public isDragging = false;
  public lastMouse = new Coordinate(); // replaces lastX/lastY

  addNode(node: GraphNode) {
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

  clone() {
    return new Coordinate(this.x, this.y);
  }
}