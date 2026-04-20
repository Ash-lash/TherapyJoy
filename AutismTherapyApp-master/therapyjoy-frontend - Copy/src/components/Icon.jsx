const ICONS = {
  home: (
    <path
      d="M3 10.5 12 3l9 7.5V21a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 21V10.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  video: (
    <path
      d="M4 7.5A2.5 2.5 0 0 1 6.5 5h8A2.5 2.5 0 0 1 17 7.5v9A2.5 2.5 0 0 1 14.5 19h-8A2.5 2.5 0 0 1 4 16.5v-9Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  ),
  bell: (
    <>
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 19a2 2 0 0 0 4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  userCircle: (
    <>
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8.2 18.2a6.8 6.8 0 0 1 7.6 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 12.3a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </>
  ),
  stethoscope: (
    <>
      <path
        d="M7 3v5a5 5 0 0 0 10 0V3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 13v3a4 4 0 0 0 4 4h.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19 20a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </>
  ),
  shieldCheck: (
    <>
      <path
        d="M12 2l8 4v6c0 5-3.5 9.3-8 10-4.5-.7-8-5-8-10V6l8-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 12l1.7 1.7L15.3 9.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  arrowRight: (
    <>
      <path
        d="M5 12h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </>
  ),
  doctor: (
    <>
      <path
        d="M7 20v-6a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 20h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  login: (
    <>
      <path
        d="M10 17l1 1 9-9-9-9-1 1 8 8-8 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 12H10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  logout: (
    <>
      <path
        d="M14 7l-1-1-9 9 9 9 1-1-8-8 8-8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 12H14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  play: (
    <path
      d="M9 7.5v9l9-4.5-9-4.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  heart: (
    <path
      d="M12 21s-7-4.7-9.2-8.7C1.2 9.2 2.7 6.5 5.5 6.1c1.6-.2 3.1.5 4 1.7.9-1.2 2.4-1.9 4-1.7 2.8.4 4.3 3.1 2.7 6.2C19 16.3 12 21 12 21Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  menu: (
    <path
      d="M4 7h16M4 12h16M4 17h16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  ),
  close: (
    <path
      d="M6 6l12 12M18 6L6 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  ),
};

export default function Icon({ name, size = 20, className = '' }) {
  const icon = ICONS[name] || ICONS.home;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {icon}
    </svg>
  );
}

