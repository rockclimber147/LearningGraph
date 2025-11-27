import { useRef, useEffect } from "react";

interface GraphCanvasProps {
  width?: number;
  height?: number;
}

export default function GraphCanvas({ width = 800, height = 600 }: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Example: fill background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Example: draw something
    ctx.fillStyle = "blue";
    ctx.fillRect(50, 50, 150, 100);

    // Later: replace with your dynamic rendering logic
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid black", display: "block", marginTop: 20 }}
    />
  );
}
