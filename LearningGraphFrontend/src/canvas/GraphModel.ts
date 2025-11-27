import { GraphNode } from "./Node";
import { NodeConnection } from "./Drawables";
import { type Drawable } from "./GraphView";

export class GraphModel {
  nodes: GraphNode[] = [];
  draggedNode: GraphNode | null;
  nodeConnections: NodeConnection[] = [];
  layers: Drawable[][] = [];
  private _globalOffset = new Coordinate(); // combine x/y offsets
  _zoomLevel: number = 1;

  constructor() {
    this.draggedNode = null;
    this.layers[0] = this.nodeConnections;
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
    this.nodes.push(node);
    TempHelper.randomlyConnectNodes(this, node)
  }

  getNode(id: number): GraphNode | undefined {
    return this.nodes.find(n => n.id === id);
  }

  connectNodes(a: number, b: number) {
    const nodeA = this.getNode(a);
    const nodeB = this.getNode(b);
    if (!nodeA || !nodeB) {
      console.log("No nodes")
      return;
    };

    // bidirectional adjacency
    nodeA.addNeighbor(b);
    nodeB.addNeighbor(a);

    this.nodeConnections.push(new NodeConnection(nodeA, nodeB));
  }

  removeConnection(a: number, b: number) {
    const nodeA = this.getNode(a);
    const nodeB = this.getNode(b);
    if (!nodeA || !nodeB) return;

    // remove from adjacency lists
    nodeA.removeNeighbor(b);
    nodeB.removeNeighbor(a);

    // remove drawable line
    this.nodeConnections = this.nodeConnections.filter(l => !l.connects(a, b));
  }

  removeNode(id: number) {
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

  updateHover(mousePosition: Coordinate) {
    this.nodes.forEach(node => {
      if (node.position.clone().sub(this.screenToModelCoords(mousePosition)).length() < node.radius) {
        node.isHovered = true;
      } else {
        node.isHovered = false;
      }
    })
  }

  setClicked(mousePosition: Coordinate) {
    this.nodes.forEach(node => {
      if (node.position.clone().sub(this.screenToModelCoords(mousePosition)).length() < node.radius) {
        this.draggedNode = node;
      } 
    })
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

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize() {
    const length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
  }
}

class TempHelper {
  static randomlyConnectNodes(model: GraphModel, node: GraphNode) {
    for (const other of model.nodes) {
      // skip itself
      if (other.id === node.id) continue;

      // 50% chance
      if (Math.random() < 0.5) {
        // skip if already neighbors
        if (node.neighbors.has(other.id)) continue;

        // create bidirectional graph edge
        model.connectNodes(node.id, other.id);
      }
    }
  }
}