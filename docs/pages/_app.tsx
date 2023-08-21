import type { AppProps } from "next/app";
import PlausibleProvider from "next-plausible";

import "./global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain="curatorjs.org">
      <Component {...pageProps} />;
    </PlausibleProvider>
  );
}
