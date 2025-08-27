import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/custom.scss";
import "../styles/globals.scss";
import "@/styles/layout.scss";
import "@/styles/button.scss"

import DefaultLayout from "@/components/layout/DefaultLayout";
// import Detector from "@/components/utils/Detector";
import { SessionProvider } from "next-auth/react";
import '@/src/i18n';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  

  return (
    <SessionProvider session={session}>
      {/* <Detector> */}
        <main>
          <Component {...pageProps} />
        </main>
      {/* </Detector> */}
    </SessionProvider>
  );
}
