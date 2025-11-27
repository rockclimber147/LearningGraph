export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
}

export class GraphModel {
  nodes: GraphNode[] = [];

  addNode(node: GraphNode) {
    this.nodes.push(node);
  }

  removeNode(id: string) {
    this.nodes = this.nodes.filter(n => n.id !== id);
  }
}
