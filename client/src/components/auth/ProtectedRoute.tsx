import { useState, useEffect } from "react";
import AuthPrompt from "./AuthPrompt";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  message?: string;
}

const ProtectedRoute = ({ children, message }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuthPrompt(true);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              {message || "Please sign in to access this feature."}
            </p>
            <button
              onClick={() => setShowAuthPrompt(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
        
        <AuthPrompt
          isOpen={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
          onSuccess={() => {
            setShowAuthPrompt(false);
            window.location.reload();
          }}
          message={message}
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;