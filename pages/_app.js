import "../styles/globals.css";
import { AppWrapper } from "./../lib/contexts/globalState";
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
      <Toaster />
    </AppWrapper>
  );
}

export default MyApp;
