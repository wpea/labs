export default function Button({ value, styles, handleClick }) {
  return (
    <div>
      <button onClick={handleClick} className={styles}>
        {value}
      </button>
    </div>
  );
}
