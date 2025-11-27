import { useRef, useEffect, useState } from "react";
import { GraphModel } from "../canvas/GraphModel";
import { GraphView } from "../canvas/GraphView";
import { GraphController } from "../canvas/GraphController";
import { PhysicsBasedLayoutManager, FruchtermanReingoldLayoutManager} from "../canvas/LayoutManager";

export default function GraphCanvas({ width = 800, height = 600 }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [animateEnabled, setAnimateEnabled] = useState(true);
  const animateRef = useRef(true);
  
  useEffect(() => {
    animateRef.current = animateEnabled;
  }, [animateEnabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const model = new GraphModel();
    const view = new GraphView(ctx, model);
    const controller = new GraphController(model);
    // const layoutManager = new PhysicsBasedLayoutManager();
    const layoutManager = new FruchtermanReingoldLayoutManager();

    const handleMouse = (e: MouseEvent) => {
      controller.updateMouseState(e);
      controller.handleMouseInteractions(view);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      controller.handleWheel(e);
      view.render();
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mousedown", handleMouse);
    canvas.addEventListener("mouseup", handleMouse);
    canvas.addEventListener("click", handleMouse);
    canvas.addEventListener("wheel", handleWheel);
    canvas.addEventListener("contextmenu", handleContextMenu);

    const animate = () => {
      if (animateRef.current) {
        layoutManager.layoutAnimationStep(model.nodes, model.nodeConnections);
      }

      // Always allow dragging / zoom to update
      controller.handleMouseInteractions(view);

      view.render();
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mousedown", handleMouse);
      canvas.removeEventListener("mouseup", handleMouse);
      canvas.removeEventListener("click", handleMouse);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setAnimateEnabled(a => !a)}
        style={{ marginBottom: 10 }}
      >
        {animateEnabled ? "Stop Animation" : "Start Animation"}
      </button>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: "1px solid black" }}
      />
    </div>
  );
}
