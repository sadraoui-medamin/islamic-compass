interface EightPointStarProps {
  className?: string;
  size?: number;
  filled?: boolean;
}

const EightPointStar = ({ className = "", size = 40, filled = true }: EightPointStarProps) => {
  // 8-pointed star path: two overlapping squares rotated 45°
  const s = size;
  const c = s / 2;
  const r = s * 0.45;
  const ri = r * 0.38;

  const points: string[] = [];
  for (let i = 0; i < 8; i++) {
    const outerAngle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 8;
    points.push(`${c + r * Math.cos(outerAngle)},${c + r * Math.sin(outerAngle)}`);
    points.push(`${c + ri * Math.cos(innerAngle)},${c + ri * Math.sin(innerAngle)}`);
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${s} ${s}`} className={className}>
      <polygon
        points={points.join(" ")}
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? 0 : 0.8}
      />
    </svg>
  );
};

export default EightPointStar;
