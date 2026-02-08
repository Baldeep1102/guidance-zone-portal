interface PlanetIconProps {
  className?: string;
  size?: number;
}

export function PlanetIcon({ className = '', size = 64 }: PlanetIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Planet body */}
      <circle
        cx="32"
        cy="32"
        r="20"
        fill="#7B6CFF"
        opacity="0.2"
      />
      <circle
        cx="32"
        cy="32"
        r="18"
        stroke="#7B6CFF"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Planet ring */}
      <ellipse
        cx="32"
        cy="32"
        rx="28"
        ry="10"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
        transform="rotate(-20 32 32)"
      />
      {/* Surface detail */}
      <path
        d="M20 32 Q32 28 44 32"
        stroke="#7B6CFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
