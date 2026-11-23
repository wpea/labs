import MoneyMovement from "./MoneyMovement";
export default function Withdraw(props) {
  return <MoneyMovement {...props} kind="withdrawal" />;
}
