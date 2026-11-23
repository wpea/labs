import MoneyMovement from "./MoneyMovement";
export default function Deposit(props) {
  return <MoneyMovement {...props} kind="deposit" />;
}
