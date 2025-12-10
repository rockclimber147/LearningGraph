import type { FileNode } from "../components/FileTree/FileTree";
import { Coordinate, type GraphModel } from "./GraphModel";
import { NodeFactory } from "./Node";

export interface GraphBuilder {
  build(nodes: FileNode[]): void;
}

export class TreeBuilder implements GraphBuilder {
    private readonly BASE_SPACING_DISTANCE = 500; 
    private readonly MIN_SPACING_DISTANCE = 50; 
    private readonly ROOT_NODE_X = 0;
    private readonly ROOT_NODE_Y = 0;
    private readonly model: GraphModel;

    constructor(model: GraphModel) {
        this.model = model;
    }

    private degToRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    private findMaxDepth(fileNode: FileNode): number {
        if (!fileNode.children || fileNode.children.length === 0) {
            return 1;
        }
        const maxChildDepth = fileNode.children.reduce((max, child) => {
            return Math.max(max, this.findMaxDepth(child));
        }, 0);
        return maxChildDepth + 1;
    }

    private getDepthScaledSpacing(currentDepth: number, maxDepth: number): number {
        if (currentDepth === 1) {
            return 0;
        }
        const decayFactor = 1 - ((currentDepth - 2) / (maxDepth - 1));
        
        const scaledDistance = (this.BASE_SPACING_DISTANCE - this.MIN_SPACING_DISTANCE) * decayFactor + this.MIN_SPACING_DISTANCE;
        
        return scaledDistance;
    }

    build(fileNodes: FileNode[]) {
        const nodeMap = new Map<string, number>();

        for (const rootNode of fileNodes) {
            const maxDepth = this.findMaxDepth(rootNode);

            // Start traversal for each root node
            this.traverseAndBuildGraph(
                rootNode,
                null,
                nodeMap,
                new Coordinate(this.ROOT_NODE_X, this.ROOT_NODE_Y), 
                0,
                true,
                maxDepth,
                1
            );
        }
    }

    private traverseAndBuildGraph(
        fileNode: FileNode,
        parentId: number | null,
        nodeMap: Map<string, number>,
        parentPos: Coordinate,
        angleToParent: number,
        isRoot: boolean,
        maxDepth: number,
        currentDepth: number
    ) {
        let position: Coordinate;

        if (isRoot) {
            position = new Coordinate(this.ROOT_NODE_X, this.ROOT_NODE_Y);
        } else {
            const spacing = this.getDepthScaledSpacing(currentDepth, maxDepth);
            const angleRad = this.degToRad(angleToParent);
            const nodeX = parentPos.x + spacing * Math.cos(angleRad);
            const nodeY = parentPos.y + spacing * Math.sin(angleRad);
            position = new Coordinate(nodeX, nodeY);
        }

        // ... (Node creation and connection logic remains the same)
        const newNode = NodeFactory.fromFileNode(fileNode, position);
        this.model.addNode(newNode);

        const key = fileNode.path || fileNode.name;
        nodeMap.set(key, newNode.id);

        if (parentId !== null) {
            this.model.connectNodes(newNode.id, parentId);
        }

        const children = fileNode.children || [];
        const numChildren = children.length;

        if (numChildren > 0) {
            const totalAngleSpread = isRoot ? 360 : 120; 
            const angleStep = totalAngleSpread / numChildren;

            let startAngle: number;

            if (isRoot) {
                startAngle = 0;
            } else {
                startAngle = angleToParent;
            }
            
            // Recurse for each child
            children.forEach((child, index) => {
                const childAngle = startAngle + index * angleStep * (1 - 2 * index % 2);

                this.traverseAndBuildGraph(
                    child,
                    newNode.id,
                    nodeMap,
                    position,
                    childAngle, // The new angle becomes the 'angleToParent' for the child
                    false,
                    maxDepth,
                    currentDepth + 1
                );
            });
        }
    }
}
