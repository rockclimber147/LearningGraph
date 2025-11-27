export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
}

export class GraphModel {
  nodes: GraphNode[] = [];

  private _globalXOffset: number = 0;
  private _globalYOffset: number = 0;

  // ---- Node management ----
  addNode(node: GraphNode) {
    this.nodes.push(node);
  }

  removeNode(id: string) {
    this.nodes = this.nodes.filter(n => n.id !== id);
  }

  // ---- Offset properties ----
  get globalXOffset() {
    return this._globalXOffset;
  }

  set globalXOffset(x: number) {
    this._globalXOffset = x;
  }

  get globalYOffset() {
    return this._globalYOffset;
  }

  set globalYOffset(y: number) {
    this._globalYOffset = y;
  }

  // Optional convenience
  adjustOffset(dx: number, dy: number) {
    this._globalXOffset += dx;
    this._globalYOffset += dy;
  }
}