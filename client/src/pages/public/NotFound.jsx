import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NotFound = () => {
  const { user, isAuthenticated, getDashboardPath } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#111622] border border-[#232936] shadow-xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#ffb703]">
          <Wrench size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-gray-200 mb-3">Page Not Found</h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          The garage bay or workshop resource you are looking for does not exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <Link
              to={getDashboardPath(user?.role)}
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              <LayoutDashboard size={16} />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              <LayoutDashboard size={16} />
              <span>Sign In</span>
            </Link>
          )}

          <Link
            to="/"
            className="btn btn-outline flex items-center justify-center gap-2"
          >
            <Home size={16} />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
