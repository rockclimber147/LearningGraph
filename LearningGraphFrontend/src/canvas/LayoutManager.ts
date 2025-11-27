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

export class FruchtermanReingoldLayoutManager implements LayoutManager {
    private temperature = 400;       // how far a node is allowed to move per step
    private cooling = 0.95;          // decay per iteration
    private idealDist = 120;         // ideal spacing between nodes

    layoutAnimationStep(nodes: GraphNode[], connections: NodeConnection[]): void {
        if (nodes.length === 0) return;

        // Initialize force map
        const forces = new Map<GraphNode, Coordinate>();
        for (const n of nodes) {
            forces.set(n, new Coordinate(0, 0));
        }

        const k = this.idealDist;

        function repulsive(dist: number) {
            return (k * k) / dist;
        }

        function attractive(dist: number) {
            return (dist * dist) / k;
        }

        // -----------------------------------------
        // REPULSIVE FORCES (all pairs)
        // -----------------------------------------
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];

                const diff = b.position.clone().sub(a.position);
                let dist = diff.length();

                if (dist === 0) {
                    diff.x = (Math.random() - 0.5) * 0.001;
                    diff.y = (Math.random() - 0.5) * 0.001;
                    dist = diff.length();
                }

                const dir = diff.clone().scale(1 / dist);
                const f = repulsive(dist);

                const forceVec = dir.clone().scale(f);

                forces.get(a)!.sub(forceVec);
                forces.get(b)!.add(forceVec);
            }
        }

        // -----------------------------------------
        // ATTRACTIVE FORCES (edges)
        // -----------------------------------------
        for (const edge of connections) {
            const a = edge.startNode;
            const b = edge.endNode;

            const diff = b.position.clone().sub(a.position);
            const dist = diff.length() || 0.0001;

            const dir = diff.clone().scale(1 / dist);
            const f = attractive(dist);

            const forceVec = dir.clone().scale(f);

            forces.get(a)!.add(forceVec);
            forces.get(b)!.sub(forceVec);
        }

        // -----------------------------------------
        // APPLY FORCES — capped by temperature
        // -----------------------------------------
        for (const node of nodes) {
            const force = forces.get(node)!;

            const m = force.length();
            const capped = Math.min(m, this.temperature);

            const movement = force.clone().scale(capped / (m || 0.0001));

            node.position.add(movement);
        }

        // COOLING
        this.temperature *= this.cooling;
        if (this.temperature < 0.1) this.temperature = 0.1;
    }
}
    
