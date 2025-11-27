import { useRef, useEffect } from "react";
import { GraphModel } from "../canvas/GraphModel";
import { GraphView } from "../canvas/GraphView";
import { GraphController } from "../canvas/GraphController";

export default function GraphCanvas({ width = 800, height = 600 }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const model = new GraphModel();
    const view = new GraphView(ctx, model);
    const controller = new GraphController(model);

    const handleMouse = (e: MouseEvent) => {
      controller.updateMouseState(e);
      controller.handleMouseInteractions(view);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      controller.handleWheel(e);
      view.render();
    };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mousedown", handleMouse);
    canvas.addEventListener("mouseup", handleMouse);
    canvas.addEventListener("click", handleMouse);
    canvas.addEventListener("wheel", handleWheel);

  const animate = () => {
    model.layoutStep();
    view.render();
    requestAnimationFrame(animate);
  };

  animate();

    view.render();

    return () => {
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mousedown", handleMouse);
      canvas.removeEventListener("mouseup", handleMouse);
      canvas.removeEventListener("click", handleMouse);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid black", marginTop: 20 }}
    />
  );
}
