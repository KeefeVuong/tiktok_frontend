import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const {auth} = useAuth();
  if (!auth) {
    return <Navigate to="/login"/>;
  }
  return children;
};

export default ProtectedRoute