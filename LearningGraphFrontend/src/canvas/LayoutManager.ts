import { GraphNode } from "./Node";
import { NodeConnection } from "./Drawables";
import { Coordinate } from "./GraphModel";

export interface LayoutManager {
    layoutAnimationStep(nodes: GraphNode[], connections: NodeConnection[]): void;
}

export class PhysicsBasedLayoutManager implements LayoutManager {
    layoutAnimationStep(nodes: GraphNode[], connections: NodeConnection[]): void {
        const repulsion = 2000;        // strength of repulsive force
        const damping = 0.55;          // velocity damping
        const minDist = 120;
        // Reset accelerations
        const forces = new Map<GraphNode, Coordinate>();
        for (const n of nodes) {
            forces.set(n, new Coordinate(0, 0));
        }
    
        // --- Repulsive forces (Coulomb-like) ---
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
    
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
        for (const line of connections) {
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
        for (const node of nodes) {
            node.velocity.add(forces.get(node)!);
            node.velocity.scale(damping);
            node.position.add(node.velocity);
        } 
    }
}
    
