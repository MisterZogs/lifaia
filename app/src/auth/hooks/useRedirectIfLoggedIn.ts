import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "wasp/client/auth";

export function useRedirectIfLoggedIn(redirectTo = "/onboarding") {
  const { data: user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);
}
