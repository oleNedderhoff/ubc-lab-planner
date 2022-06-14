import "../styles/globals.css";
import Navbar from "../components/Layout/Navbar";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import Auth from "../components/Login/Auth";
import NextNProgress from "nextjs-progressbar";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider refetchInterval={5 * 60} session={pageProps.session}>
      <ChakraProvider>
        <NextNProgress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />
        <Auth>
          <Navbar>
            <Component {...pageProps} />
          </Navbar>
        </Auth>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
