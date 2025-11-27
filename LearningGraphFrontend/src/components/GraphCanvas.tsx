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

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    // ---- Left click to add node ----
    const handleClick = (e: MouseEvent) => {
      if (e.button !== 0) return; // left button
      const rect = canvas.getBoundingClientRect();
      controller.handleLeftClick(e.clientX - rect.left, e.clientY - rect.top);
      view.render();
    };

    // ---- Middle click drag to pan ----
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        isDragging = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      controller.pan(dx, dy);

      lastX = e.clientX;
      lastY = e.clientY;

      view.render();
    };

    // ---- Scroll wheel for zoom placeholder ----
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        console.log("Scroll Up (zoom in)");
      } else {
        console.log("Scroll Down (zoom out)");
      }
    };

    // Add event listeners
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("wheel", handleWheel);

    // Initial render
    view.render();

    // Cleanup
    return () => {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
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
