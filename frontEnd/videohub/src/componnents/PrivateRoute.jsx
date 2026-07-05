import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  // Wait until authentication has been checked
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // If no authenticated user exists, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated
  return children;
}