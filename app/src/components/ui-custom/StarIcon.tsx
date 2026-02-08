interface StarIconProps {
  className?: string;
  size?: number;
}

export function StarIcon({ className = '', size = 64 }: StarIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main star */}
      <path
        d="M32 8 L36 24 L52 24 L40 34 L44 50 L32 40 L20 50 L24 34 L12 24 L28 24 Z"
        fill="#7B6CFF"
        opacity="0.3"
      />
      <path
        d="M32 12 L35 24 L47 24 L38 31 L41 43 L32 36 L23 43 L26 31 L17 24 L29 24 Z"
        stroke="#7B6CFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Sparkle rays */}
      <line
        x1="32"
        y1="4"
        x2="32"
        y2="8"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="32"
        y1="56"
        x2="32"
        y2="60"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="4"
        y1="32"
        x2="8"
        y2="32"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="56"
        y1="32"
        x2="60"
        y2="32"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
