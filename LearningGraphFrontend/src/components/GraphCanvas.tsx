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

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      controller.handleClick(e.clientX - rect.left, e.clientY - rect.top);
      view.render();
    };

    canvas.addEventListener("click", handleClick);

    view.render();

    return () => canvas.removeEventListener("click", handleClick);
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
