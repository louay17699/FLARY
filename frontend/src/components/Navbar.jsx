import { LogOut, MessageSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 h-16">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group transition-all"
          >
            <div className="size-8 md:size-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg">
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FLARY
            </h1>
          </Link>

          <div className="flex items-center gap-2">
            {authUser && (
              <Link
                to="/profile"
                className="btn btn-sm h-9 md:h-10 px-2 md:px-4 gap-1 md:gap-2 bg-base-200 hover:bg-primary/10 hover:text-primary transition-colors duration-200 shadow-sm normal-case"
              >
                <div className="relative">
                  <img
                    src={authUser.profilePic || '/default-avatar.png'}
                    alt="Profile"
                    className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover border border-white shadow"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full w-2 h-2 md:w-2.5 md:h-2.5 border border-white"></div>
                </div>
                <span className="hidden sm:inline">
                  {authUser.fullName || 'Profile'}
                </span>
              </Link>
            )}

            <Link
              to="/settings"
              className="btn btn-sm h-9 md:h-10 gap-1 md:gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <button 
                className="btn btn-sm h-9 md:h-10 gap-1 md:gap-2 hover:bg-error/10 hover:text-error transition-colors"
                onClick={logout}
              >
                <LogOut className="size-4 md:size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;