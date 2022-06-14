import { useSession } from "next-auth/react";
import Login from "./index.js";

function Auth({ children }) {
  const { data: session, status } = useSession();
  if (status !== "loading") {
    if (status === "authenticated") {
      return <>{children}</>;
    } else {
      return <Login />;
    }
  } else {
    return null;
  }
}

export default Auth;
