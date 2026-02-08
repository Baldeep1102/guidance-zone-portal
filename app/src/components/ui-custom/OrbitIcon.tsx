interface OrbitIconProps {
  className?: string;
  size?: number;
}

export function OrbitIcon({ className = '', size = 120 }: OrbitIconProps) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 120 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer orbit ellipse */}
      <ellipse
        cx="60"
        cy="36"
        rx="55"
        ry="30"
        stroke="#7B6CFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Inner orbit ellipse */}
      <ellipse
        cx="60"
        cy="36"
        rx="35"
        ry="20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      {/* Center planet */}
      <circle
        cx="60"
        cy="36"
        r="6"
        fill="#7B6CFF"
        opacity="0.8"
      />
      {/* Orbiting dot 1 */}
      <circle
        cx="105"
        cy="45"
        r="3"
        fill="white"
        opacity="0.8"
      />
      {/* Orbiting dot 2 */}
      <circle
        cx="25"
        cy="28"
        r="2.5"
        fill="#7B6CFF"
        opacity="0.6"
      />
    </svg>
  );
}
