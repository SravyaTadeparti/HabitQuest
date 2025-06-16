import { useState } from "react";
import "./SpinWheel.css";

const rewards = [
  "5 Tokens", "10 Tokens", "15 Tokens", "Nothing", "20 Tokens",
  "Nothing", "5 Tokens", "25 Tokens", "Nothing", "10 Tokens",
  "Nothing", "15 Tokens", "Nothing", "30 Tokens", "Nothing"
];

const segmentColors = [
  "#8e44ad", "#3498db", "#2ecc71", "#7f8c8d", "#e74c3c",
  "#7f8c8d", "#8e44ad", "#f39c12", "#7f8c8d", "#3498db",
  "#7f8c8d", "#2ecc71", "#7f8c8d", "#9b59b6", "#7f8c8d"
];

export default function SpinWheel({ tokens = 0, setTokens = () => {}, onClose = () => {} }) {
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [rotation, setRotation] = useState(0);

  const spinWheel = async () => {
    if (spinning) return;

    setSpinning(true);

    const selectedIndex = Math.floor(Math.random() * rewards.length);
    const sectorAngle = 360 / rewards.length;
    const selectedSectorStart = selectedIndex * sectorAngle;
    const selectedSectorCenter = selectedSectorStart + sectorAngle / 2;

    const extraSpins = 5 * 360;
    const targetRotation = 0 - selectedSectorCenter;
    const finalRotation = rotation + extraSpins + targetRotation;

    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      const reward = rewards[selectedIndex];
      setPrize(reward);

      if (reward.includes("Tokens")) {
        const earned = parseInt(reward.split(" ")[0], 10);
        const newBalance = tokens + earned;
        setTokens(newBalance);
      }
    }, 3000);
  };

  const center = 110;
  const radius = 100;
  const sectorAngle = 360 / rewards.length;

  const segments = rewards.map((reward, index) => {
    const startAngle = index * sectorAngle;
    const endAngle = (index + 1) * sectorAngle;
    const midAngle = startAngle + sectorAngle / 2;

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const midRad = (midAngle - 90) * Math.PI / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = sectorAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    const outerX = center + radius * 0.88 * Math.cos(midRad);
    const outerY = center + radius * 0.88 * Math.sin(midRad);
    const innerX = center + radius * 0.5 * Math.cos(midRad);
    const innerY = center + radius * 0.5 * Math.sin(midRad);

    return {
      reward,
      pathData,
      radialPath: `M ${outerX} ${outerY} L ${innerX} ${innerY}`,
      color: segmentColors[index],
      id: `radial-line-${index}`,
      isNothing: reward === "Nothing"
    };
  });

  return (
    <div className="wheel-container">
      <button className="wheel-close-button" onClick={onClose}>✖</button>
      <div className="wheel-pointer">▼</div>

      <div className="wheel-wrapper">
        <svg
          width="220"
          height="220"
          className="wheel-svg"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              : 'none',
          }}
        >
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill={segment.color}
                stroke="#fff"
                strokeWidth="1"
                opacity={segment.isNothing ? 0.7 : 1}
              />
              <path
                id={segment.id}
                d={segment.radialPath}
                fill="none"
              />
              <text
                fontSize="6"
                fontWeight="bold"
                fill="white"
                style={{
                  fontFamily: 'Courier New, monospace',
                  pointerEvents: 'none'
                }}
              >
                <textPath href={`#${segment.id}`} startOffset="0%">
                  {segment.reward}
                </textPath>
              </text>
            </g>
          ))}
          <circle
            cx={center}
            cy={center}
            r="8"
            fill="white"
            stroke="#000"
            strokeWidth="2"
          />
        </svg>
      </div>

      <button onClick={spinWheel} disabled={spinning} className="spin-button">
        {spinning ? "Spinning..." : "Spin the Wheel"}
      </button>

      {prize && <p className="wheel-result">You won: {prize}!</p>}
    </div>
  );
}
