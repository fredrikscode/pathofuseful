// High-quality SVG icons for game elements
// Inspired by exile-leveling but with improved visuals

interface IconProps {
  className?: string;
  size?: number;
}

export function WaypointIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glowing blue waypoint */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" filter="url(#glow)" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" filter="url(#glow)" />
      <circle cx="12" cy="12" r="2" fill="currentColor" filter="url(#glow)" />
      <line x1="12" y1="2" x2="12" y2="7" stroke="currentColor" strokeWidth="2" filter="url(#glow)" />
      <line x1="12" y1="17" x2="12" y2="22" stroke="currentColor" strokeWidth="2" filter="url(#glow)" />
      <line x1="2" y1="12" x2="7" y2="12" stroke="currentColor" strokeWidth="2" filter="url(#glow)" />
      <line x1="17" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" filter="url(#glow)" />
    </svg>
  );
}

export function QuestIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Yellow exclamation mark (!) with transparent background */}
      <rect x="10.5" y="6" width="3" height="8" rx="1.5" fill="#facc15" />
      <circle cx="12" cy="17" r="1.5" fill="#facc15" />
    </svg>
  );
}

export function PortalIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vertical portal - tall ellipses */}
      <ellipse cx="12" cy="12" rx="7" ry="11" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <ellipse cx="12" cy="12" rx="4.5" ry="8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
      <ellipse cx="12" cy="12" rx="2.5" ry="5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Swirling paths */}
      <path d="M 12 2 Q 16 12 12 22" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M 12 2 Q 8 12 12 22" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
  );
}

export function TownIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* House/town icon */}
      <path
        d="M3 12L12 3L21 12V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M9 22V12H15V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrialIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Labyrinth/trial icon */}
      <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M7 7H17V17H7V7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M10 10H14V14H10V10Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

export function CraftingIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hammer and anvil */}
      <path
        d="M14 6L18 2L22 6L18 10L14 6Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M14 6L8 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect
        x="2"
        y="18"
        width="12"
        height="4"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

export function BossIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* White skull icon for bosses */}
      <ellipse cx="12" cy="9" rx="6" ry="7" fill="white" stroke="white" strokeWidth="1.5" />
      <circle cx="9.5" cy="8" r="1.5" fill="black" />
      <circle cx="14.5" cy="8" r="1.5" fill="black" />
      <path
        d="M10 11.5C10 11.5 10.5 12.5 12 12.5C13.5 12.5 14 11.5 14 11.5"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Jaw */}
      <path
        d="M9 16L10 20H14L15 16"
        fill="white"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Teeth */}
      <line x1="10" y1="16" x2="10" y2="18" stroke="black" strokeWidth="1" />
      <line x1="12" y1="16" x2="12" y2="18" stroke="black" strokeWidth="1" />
      <line x1="14" y1="16" x2="14" y2="18" stroke="black" strokeWidth="1" />
    </svg>
  );
}

export function ArenaIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Arena/door icon */}
      <rect
        x="4"
        y="2"
        width="16"
        height="20"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M12 8V16M8 12H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function LogoutIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Logout/exit icon */}
      <path
        d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 17L21 12L16 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Directional arrows (compass-style)
interface DirectionIconProps extends IconProps {
  degrees: number;
}

export function DirectionArrow({ degrees, className = '', size = 24 }: DirectionIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ transform: `rotate(${degrees}deg)` }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Compass circle */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Arrow pointing up (will be rotated) */}
      <path
        d="M12 6L16 12H8L12 6Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 12V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EnterAreaIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Arrow entering doorway */}
      <path
        d="M14 3V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 12H11M11 12L7 8M11 12L7 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
