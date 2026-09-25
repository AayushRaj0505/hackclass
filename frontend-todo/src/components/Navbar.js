import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CheckSquare, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/todos" className="brand">
          <div className="brand-icon">
            <CheckSquare size={22} color="#fff" />
          </div>
          <span>TaskMaster</span>
        </Link>

        {isAuthenticated && user && (
          <div className="user-nav">
            <div className="user-badge">
              <User size={15} />
              <span>{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
