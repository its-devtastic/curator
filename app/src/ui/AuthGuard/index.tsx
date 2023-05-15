import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useSession from "../../hooks/useSession";

/**
 * Only renders children when user is authenticated (or unauthenticated with the anonOnly flag).
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  anonOnly = false,
}) => {
  const navigate = useNavigate();
  const { token } = useSession();

  useEffect(() => {
    if (!token && !anonOnly) {
      navigate("/login");
    }
    if (token && anonOnly) {
      navigate("/");
    }
  }, [navigate, token]);

  return <>{children}</>;
};

export default AuthGuard;

interface AuthGuardProps {
  children: React.ReactNode;
  // Only allow unauthenticated users.
  anonOnly?: boolean;
}
