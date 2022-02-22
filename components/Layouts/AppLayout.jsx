import { useAuth2 } from "./../../lib/hooks/useAuth2";
import Spinner from "./../spinner";

export default function AppLayout({ children }) {
  const { token } = useAuth2({ middleware: "auth" });

  return token ? <div>{children}</div> : <Spinner />;
}
