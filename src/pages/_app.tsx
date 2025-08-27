import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { env } from "~/env.mjs";
import { useEffect } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const logIn = useBoundStore((s) => s.logIn);
  const logOut = useBoundStore((s) => s.logOut);

  useEffect(() => {
    // Read session cookie
    const cookieStr = typeof document !== 'undefined' ? document.cookie : '';
    const match = cookieStr.match(/(?:^|; )session_id=([^;]+)/);
    const sessionId = match?.[1] ?? null;

    if (sessionId) {
      try {
        localStorage.setItem('session_id', sessionId);
      } catch {}
      logIn();
    } else {
      try {
        localStorage.removeItem('session_id');
      } catch {}
      logOut();
    }
  }, [logIn, logOut]);

  return (
    <>
      <Head>
        <title>React Duolingo Clone</title>
        <meta
          name="description"
          content="Duolingo web app clone written with React"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0A0" />
        <link rel="manifest" href="/app.webmanifest" />
      </Head>
      <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <Component {...pageProps} />
      </GoogleOAuthProvider>
    </>
  );
};

export default MyApp;
