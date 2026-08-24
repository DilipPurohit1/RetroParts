import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'seller' | 'admin' | 'buyer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-retro-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requireRole === 'seller' && user?.role !== 'seller' && user?.role !== 'both' && user?.role !== 'admin') {
    return <Navigate to="/seller" replace />;
  }

  return <>{children}</>;
};
