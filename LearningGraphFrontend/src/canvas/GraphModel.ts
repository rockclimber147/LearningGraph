import { GraphNode } from "./Node";
import { NodeConnection } from "./Drawables";
import { type Drawable } from "./GraphView";

export class GraphModel {
  nodes: GraphNode[] = [];
  lines: NodeConnection[] = [];
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

    this.lines.push(new NodeConnection(nodeA, nodeB));
  }

  removeConnection(a: number, b: number) {
    const nodeA = this.getNode(a);
    const nodeB = this.getNode(b);
    if (!nodeA || !nodeB) return;

    // remove from adjacency lists
    nodeA.removeNeighbor(b);
    nodeB.removeNeighbor(a);

    // remove drawable line
    this.lines = this.lines.filter(l => !l.connects(a, b));
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
      if (node.position.clone().sub(mousePosition).length() < node.radius) {
        node.isHovered = true;
      } else {
        node.isHovered = false;
      }
    })
  }

  layoutStep() {
    const repulsion = 2000;        // strength of repulsive force
    const damping = 0.55;          // velocity damping
    const minDist = 120;
    // Reset accelerations
    const forces = new Map<GraphNode, Coordinate>();
    for (const n of this.nodes) {
      forces.set(n, new Coordinate(0, 0));
    }

    // --- Repulsive forces (Coulomb-like) ---
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i];
        const b = this.nodes[j];

        const diff = b.position.clone().sub(a.position);
        let dist = diff.length();
        if (dist === 0) {
          // jitter small vector to avoid NaN / zero-length
          diff.x = (Math.random() - 0.5) * 0.01;
          diff.y = (Math.random() - 0.5) * 0.01;
          dist = diff.length();
        }

        const dir = diff.clone().scale(1 / dist); // normalized

        if (dist < minDist) {
          const overlap = minDist - dist;
          const push = dir.clone().scale(overlap * 0.5 + 0.5); // +0.5 to ensure separation
          // move positions directly (instant correction)
          a.position.sub(push);
          b.position.add(push);
          // optionally zero small velocities to avoid jitter
          a.velocity.scale(0.5);
          b.velocity.scale(0.5);
        } else {
          // inverse-square repulsion as before
          const forceMag = repulsion / (dist * dist);
          const force = dir.clone().scale(forceMag);
          forces.get(a)!.sub(force);
          forces.get(b)!.add(force);
        }
      }
    }

    // --- Attractive forces (edges act like springs) ---
    for (const line of this.lines) {
      const a = line.startNode;
      const b = line.endNode;

      const diff = b.position.clone().sub(a.position);
      const dist = diff.length();

      // Only pull when far apart
      const force = diff.normalize().scale(dist * 0.01);

      forces.get(a)!.add(force);
      forces.get(b)!.sub(force);
    }

    // --- Update velocities and positions ---
    for (const node of this.nodes) {
      node.velocity.add(forces.get(node)!);
      node.velocity.scale(damping);
      node.position.add(node.velocity);
    }
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