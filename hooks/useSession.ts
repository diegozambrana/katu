import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export const useSession = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const pathname = usePathname();
  const checkSession = useRef(false);

  useEffect(() => {
    if (pathname === "/" && checkSession.current) {
      getSession();
    }
    if (pathname === "/sign-in" || pathname === "/sign-up") {
      checkSession.current = true;
    } else {
      checkSession.current = false;
    }
  }, [pathname]);

  const supabase = createClient();

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);
    setLoading(false);
  };

  useEffect(() => {
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          setSession(session);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error SignOut:", error.message);
    } else {
      console.log("SignOut Success");
      setSession(null);
    }
  };

  return {
    session,
    loading,
    signOut,
  };
};
