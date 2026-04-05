import { useState, useEffect } from "react";
import { Home, Ticket, Heart, User, Compass } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { AccountSheet } from "@/components/AccountSheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const TEAL = "#008080";

export const MobileBottomBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loginPopoverOpen, setLoginPopoverOpen] = useState(false);

  const navItems = [
    { icon: Home, label: t('nav.home'), path: "/" },
    { icon: Ticket, label: t('nav.bookings'), path: "/bookings" },
    { icon: Compass, label: "Explore", path: "/explore", isCenter: true },
    { icon: Heart, label: t('nav.saved'), path: "/saved" },
  ];

  return (
    <div className={cn(
      "md:hidden fixed bottom-0 left-0 right-0 z-[110] shadow-[0_-4px_20px_rgb(0,0,0,0.08)]"
    )}
      style={{ backgroundColor: TEAL, paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
    >
      <nav className="flex items-center justify-around h-14 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          const NavContent = (
            <>
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200 mb-0.5",
                item.isCenter ? "bg-white/25 scale-110" : "",
                isActive && !item.isCenter ? "bg-white/20" : ""
              )}>
                <item.icon
                  className={cn("h-4 w-4 transition-colors duration-200 text-white")}
                  strokeWidth={isActive || item.isCenter ? 2.5 : 2}
                />
              </div>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider text-white/80",
                (isActive || item.isCenter) && "text-white font-black"
              )}>
                {item.label}
              </span>
            </>
          );

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center group"
            >
              {NavContent}
            </Link>
          );
        })}

        {/* Profile Button */}
        {user ? (
          <AccountSheet>
            <button className="relative flex flex-col items-center justify-center group">
              <div className="p-1.5 rounded-xl transition-all duration-200 mb-0.5">
                <User className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/80">
                {t('nav.profile')}
              </span>
            </button>
          </AccountSheet>
        ) : (
          <Popover open={loginPopoverOpen} onOpenChange={setLoginPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="relative flex flex-col items-center justify-center group">
                <div className="p-1.5 rounded-xl transition-all duration-200 mb-0.5">
                  <User className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/80">
                  {t('nav.profile')}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 mb-2" align="end" side="top">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Welcome!</p>
                <p className="text-xs text-muted-foreground">Log in or sign up to access your profile, bookings, and saved items.</p>
                <div className="flex gap-2">
                  <button onClick={() => { setLoginPopoverOpen(false); navigate('/auth'); }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                    style={{ backgroundColor: TEAL }}>
                    Sign Up
                  </button>
                  <button onClick={() => { setLoginPopoverOpen(false); navigate('/auth'); }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-foreground transition-all active:scale-95 hover:bg-slate-50">
                    Log In
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </nav>
    </div>
  );
};
