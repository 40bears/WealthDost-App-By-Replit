import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/auth-context";
import { getUsername } from "@/lib/user-utils";
import { useNavigate } from "@tanstack/react-router";
import { useAuth as useAuthHook } from "@/hooks/useAuth";
import { useNotificationCount } from "@/hooks/useNotificationCount";

const Header = () => {
  const { logout } = useAuth();
  const { isAdmin } = useAuthHook();
  const navigate = useNavigate();
  const { count: unreadCount } = useNotificationCount();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const username = getUsername();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side: Logo and Greeting */}
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="WealthDost Logo"
            className="w-10 h-10 object-contain"
          />
          
          {/* Greeting and Username in same line */}
          <div className="flex items-center space-x-1" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            <span className="text-[14px] font-medium leading-5" style={{ color: '#0C0A09' }}>{getGreeting()}</span>
            <span className="text-[14px] font-medium leading-5 capitalize" style={{ color: '#0C0A09' }}>{username}</span>
          </div>

          {/* Owl Icon */}
          <img
            src="/owl.png"
            alt="Owl"
            className="w-6 h-6 object-contain"
          />
        </div>

        {/* Right side: Notification and Avatar */}
        <div className="flex items-center space-x-3">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 hover:bg-gray-100"
            onClick={() => navigate({to: "/notification-list"})}
          >
            <span className="material-icons">notifications_none</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-semibold px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>

          {/* User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-gray-100 hover:ring-primary transition-all">
                <AvatarFallback className="bg-[#E5E7EB] text-gray-700 font-medium">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => navigate({ to: "/my-profile" })}
                className="cursor-pointer"
              >
                <span className="material-icons text-sm mr-2">person</span>
                My Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAdmin && (
                <>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/admin/pending-sebi-approvals" })}
                    className="cursor-pointer"
                  >
                    <span className="material-icons text-sm mr-2">admin_panel_settings</span>
                    Pending Approvals
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={() => navigate({ to: "/feedback" })}
                className="cursor-pointer"
              >
                <span className="material-icons text-sm mr-2">feedback</span>
                Feedback
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <span className="material-icons text-sm mr-2">logout</span>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;