const MarkAsCompleted = ({ onComplete, textColor, color }) => {
  return (
    <div
      onClick={onComplete}
      className={`text-2xs border items-center cursor-pointer hover:bg-${color}-800 hover:border-none space-x-1 flex border-${color}-500 rounded-md px-2 py-1 ${textColor} font-medium uppercase`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <div>Mark as completed</div>
    </div>
  );
};

export default MarkAsCompleted;
