import { useEffect, useState } from "react";
import "./chat.css";

export default function ChatPage({ task }) {
  const [message, setMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    setIsRunning(true);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    setTimeLeft(30); // reset each start

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

      {/* 🧠 Task Box */}
      <div className="task-box">
        <span className="task-label">Your Task:</span>
        <p className="task-text">{task}</p>
      </div>

      {/* Timer */}
      <div className="header-row">
        <div className={`timer ${timeLeft <= 5 ? "danger" : ""}`}>
          {timeLeft}s
        </div>
      </div>

      {/* Writing box + Send */}
      <div className="input-row">
        <textarea
          className="text-input"
          placeholder="Write your accusation or defense…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isRunning || timeLeft === 0}
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={!isRunning || timeLeft === 0 || !message.trim()}
        >
          Send
        </button>
      </div>

      <p className="hint">
        {isRunning
          ? timeLeft > 0
            ? "You have 30 seconds to write and send."
            : "Time’s up! Start again to write another message."
          : "Press Start Game to begin the 30-second round."}
      </p>
    </div>
  );
}
