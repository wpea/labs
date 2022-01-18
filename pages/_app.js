import "../styles/globals.css";
import { AppWrapper } from "./../lib/contexts/globalState";

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
