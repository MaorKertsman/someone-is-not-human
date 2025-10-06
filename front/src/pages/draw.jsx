import { useEffect, useRef, useState } from "react";
import "./chat.css";

function DrawingBoard() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [color, setColor] = useState("#1f2937");
  const [size, setSize] = useState(6);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);

  // Scale canvas for crisp drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = wrapRef.current;
    if (!canvas || !parent) return;

    const dpi = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    const cssWidth = Math.floor(rect.width);
    const cssHeight = Math.floor(Math.max(240, rect.width * 0.6)); // keep a nice aspect

    canvas.width = cssWidth * dpi;
    canvas.height = cssHeight * dpi;
    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpi, dpi);

    // soft white background for PNG export
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    // light grid (optional, feels like a “table”)
    ctx.strokeStyle = "rgba(15,23,42,0.06)";
    ctx.lineWidth = 1;
    const step = 24;
    for (let x = step; x < cssWidth; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cssHeight); ctx.stroke();
    }
    for (let y = step; y < cssHeight; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cssWidth, y); ctx.stroke();
    }
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = size;
    ctx.strokeStyle = isEraser ? "#ffffff" : color;
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    // wipe
    ctx.clearRect(0, 0, c.width, c.height);
    // re-paint white bg + grid (like first render)
    const dpi = window.devicePixelRatio || 1;
    const cssWidth = parseInt(c.style.width, 10);
    const cssHeight = parseInt(c.style.height, 10);
    ctx.save();
    ctx.scale(dpi, dpi);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    ctx.strokeStyle = "rgba(15,23,42,0.06)";
    ctx.lineWidth = 1;
    const step = 24;
    for (let x = step; x < cssWidth; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cssHeight); ctx.stroke();
    }
    for (let y = step; y < cssHeight; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cssWidth, y); ctx.stroke();
    }
    ctx.restore();
  };

  const downloadPNG = () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="board">
      <div className="board-toolbar">
        <div className="tool-group">
          <label className="tool-label">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-input"
          />
        </div>

        <div className="tool-group">
          <label className="tool-label">Brush</label>
          <input
            type="range"
            min="1"
            max="24"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value, 10))}
          />
          <span className="range-badge">{size}px</span>
        </div>

        <div className="tool-group">
          <button
            className={`chip ${isEraser ? "active" : ""}`}
            onClick={() => setIsEraser((v) => !v)}
            title="Eraser"
          >
            {isEraser ? "Eraser On" : "Eraser Off"}
          </button>
          <button className="chip" onClick={clearCanvas} title="Clear">
            Clear
          </button>
          <button className="chip" onClick={downloadPNG} title="Download PNG">
            Download
          </button>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="canvas-wrap"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default function DrawPage({ task }) {
  const [message, setMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    setIsRunning(true);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    setTimeLeft(30);

    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  const handleSend = () => {
    if (!message.trim() || timeLeft === 0) return;
    console.log("Sent:", message);
    setMessage("");
  };

  return (
    <div className="container">
      <div className="title">SOMEONE IS NOT HUMAN</div>

      {/* Timer */}
      <div className="header-row">
        <div className={`timer ${timeLeft <= 5 ? "danger" : ""}`}>
          {timeLeft}s
        </div>
      </div>

      <div className="task-box">
      <span className="task-label">Your Task</span>
      <p className="task-text">{task}</p>
        </div>

      <p className="hint">
        {isRunning
          ? timeLeft > 0
            ? "You have 30 seconds to write and send."
            : "Time’s up! Start again to write another message."
          : "Press Start Game to begin the 30-second round."}
      </p>

      <DrawingBoard />
    </div>
  );
}
