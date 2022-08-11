export default function Spin({w, h}) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
        width={w ?? 24}
        height={h ?? 24}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2V6"
          stroke="#8C8FA3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 18V22"
          stroke="#8C8FA3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.93018 4.93L7.76018 7.76"
          stroke="#8C8FA3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.2402 16.24L19.0702 19.07"
          stroke="#8C8FA3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12H6"
          stroke="#8C8FA3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 12H22"
          stroke="#8C8FA3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.93018 19.07L7.76018 16.24"
          stroke="#8C8FA3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.2402 7.76L19.0702 4.93"
          stroke="#8C8FA3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
}