type OptiFlowMascotProps = {
  compact?: boolean;
  truckOnly?: boolean;
  headOnly?: boolean;
};

export default function OptiFlowMascot({
  compact = false,
  truckOnly = false,
  headOnly = false,
}: OptiFlowMascotProps) {
  const size = compact ? 38 : 58;

  if (headOnly) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 shadow-lg shadow-cyan-500/10">
        <svg
          width="36"
          height="36"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="10"
            y="15"
            width="44"
            height="38"
            rx="15"
            fill="#DFF9FF"
            stroke="#67E8F9"
            strokeWidth="2"
          />

          <rect
            x="16"
            y="22"
            width="32"
            height="23"
            rx="10"
            fill="#0F172A"
          />

          <rect
            x="21"
            y="29"
            width="7"
            height="5"
            rx="2.5"
            fill="#67E8F9"
          />

          <rect
            x="36"
            y="29"
            width="7"
            height="5"
            rx="2.5"
            fill="#67E8F9"
          />

          <path
            d="M24 38C28 42 36 42 40 38"
            stroke="#67E8F9"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          <path
            d="M32 15V8"
            stroke="#E0F2FE"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          <circle
            cx="32"
            cy="6"
            r="3.5"
            fill="#34D399"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 shadow-lg shadow-cyan-500/10"
          : "relative z-10 flex items-center justify-center"
      }
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="optiflowBody"
            x1="18"
            y1="20"
            x2="77"
            y2="75"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#DFF9FF" />
            <stop offset="1" stopColor="#93E9FF" />
          </linearGradient>

          <linearGradient
            id="optiflowCabin"
            x1="61"
            y1="37"
            x2="84"
            y2="65"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#67E8F9" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>

          <linearGradient
            id="optiflowScreen"
            x1="28"
            y1="31"
            x2="59"
            y2="57"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0F172A" />
            <stop offset="1" stopColor="#172554" />
          </linearGradient>

          <filter
            id="optiflowGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id="optiflowShadow"
            x="-30%"
            y="-30%"
            width="160%"
            height="180%"
          >
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="4"
              floodColor="#020617"
              floodOpacity="0.45"
            />
          </filter>
        </defs>

        <ellipse
          cx="48"
          cy="81"
          rx="34"
          ry="6"
          fill="#020617"
          fillOpacity="0.35"
        >
          <animate
            attributeName="rx"
            values="34;29;34"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            values="0.35;0.2;0.35"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>

        <g filter="url(#optiflowShadow)">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;0 -3;0 0"
            dur="3s"
            repeatCount="indefinite"
          />

          <path
            d="M20 31C20 24.3726 25.3726 19 32 19H57C63.6274 19 69 24.3726 69 31V64H20V31Z"
            fill="url(#optiflowBody)"
          />

          <path
            d="M69 37H78.4C80.7177 37 82.8918 38.1207 84.2361 40.0096L91 49.5112V64H69V37Z"
            fill="url(#optiflowCabin)"
          />

          <path
            d="M75 42H79.8C81.146 42 82.4071 42.6544 83.1827 43.7544L87.6 50H75V42Z"
            fill="#DFF9FF"
            fillOpacity="0.92"
          />

          <rect
            opacity={truckOnly ? 0 : 1}
            x="27"
            y="28"
            width="35"
            height="27"
            rx="11"
            fill="url(#optiflowScreen)"
          />

          <rect
            opacity={truckOnly ? 0 : 1}
            x="29"
            y="30"
            width="31"
            height="23"
            rx="9"
            stroke="#22D3EE"
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />

          <g
            opacity={truckOnly ? 0 : 1}
            filter="url(#optiflowGlow)"
          >
            <rect
              x="34"
              y="38"
              width="7"
              height="5"
              rx="2.5"
              fill="#67E8F9"
            >
              <animate
                attributeName="height"
                values="5;5;1;5;5"
                dur="4.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                values="38;38;40;38;38"
                dur="4.5s"
                repeatCount="indefinite"
              />
            </rect>

            <rect
              x="48"
              y="38"
              width="7"
              height="5"
              rx="2.5"
              fill="#67E8F9"
            >
              <animate
                attributeName="height"
                values="5;5;1;5;5"
                dur="4.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                values="38;38;40;38;38"
                dur="4.5s"
                repeatCount="indefinite"
              />
            </rect>
          </g>

          <path
            opacity={truckOnly ? 0 : 1}
            d="M37 47C41.2 50.4 48.8 50.4 53 47"
            stroke="#67E8F9"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          <path
            opacity={truckOnly ? 0 : 1}
            d="M44.5 28V19"
            stroke="#E0F2FE"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          <circle
            opacity={truckOnly ? 0 : 1}
            cx="44.5"
            cy="15"
            r="4"
            fill="#34D399"
            filter="url(#optiflowGlow)"
          >
            <animate
              attributeName="opacity"
              values="1;0.45;1"
              dur="1.7s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="4;4.8;4"
              dur="1.7s"
              repeatCount="indefinite"
            />
          </circle>

          <path
            d="M14 61H91V67C91 70.3137 88.3137 73 85 73H20C16.6863 73 14 70.3137 14 67V61Z"
            fill="#E2E8F0"
          />

          <rect
            x="19"
            y="64"
            width="67"
            height="4"
            rx="2"
            fill="#22D3EE"
            fillOpacity="0.75"
          />

          <circle cx="31" cy="73" r="10" fill="#0F172A" />
          <circle cx="31" cy="73" r="5" fill="#64748B" />
          <circle cx="31" cy="73" r="2" fill="#E2E8F0" />

          <circle cx="75" cy="73" r="10" fill="#0F172A" />
          <circle cx="75" cy="73" r="5" fill="#64748B" />
          <circle cx="75" cy="73" r="2" fill="#E2E8F0" />

          <path
            d="M19 35H15C12.7909 35 11 36.7909 11 39V50"
            stroke="#67E8F9"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <circle
            cx="11"
            cy="53"
            r="3"
            fill="#FBBF24"
            filter="url(#optiflowGlow)"
          >
            <animate
              attributeName="opacity"
              values="1;0.35;1"
              dur="1.3s"
              repeatCount="indefinite"
            />
          </circle>

          <path
            d="M73 56H86"
            stroke="#FFFFFF"
            strokeOpacity="0.8"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M22 58H64"
            stroke="#0891B2"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}