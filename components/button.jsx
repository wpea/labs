export default function Button({ value, styles, clickEvent }) {
  return (
    <div>
      <button onClick={clickEvent} className={styles}>
        {value}
      </button>
    </div>
  );
}
