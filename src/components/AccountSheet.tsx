import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronRight, User, Briefcase, CreditCard, Shield,
  LogOut, UserCog, LogIn,
  CalendarCheck, Settings, LayoutDashboard, Users, X
} from "lucide-react";

interface AccountSheetProps {
  children: React.ReactNode;
}

export const AccountSheet = ({ children }: AccountSheetProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [profileRes, rolesRes] = await Promise.all([
          supabase.from("profiles").select("name, profile_picture_url").eq("id", user.id).single(),
          supabase.from("user_roles").select("role").eq("user_id", user.id)
        ]);
        if (profileRes.data) {
          setUserName(profileRes.data.name || "User");
          setUserAvatar(profileRes.data.profile_picture_url || null);
        }
        if (rolesRes.data && rolesRes.data.length > 0) {
          const roleList = rolesRes.data.map(r => r.role);
          setUserRole(roleList.includes("admin") ? "admin" : "user");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => { setIsOpen(false); await signOut(); };
  const handleNavigate = (path: string) => { setIsOpen(false); navigate(path); };

  const menuItems = [
    {
      section: "Creator Tools",
      items: [
        { icon: Briefcase, label: "Become a Host", path: "/become-host", show: true },
        { icon: LayoutDashboard, label: "My Listings", path: "/my-listing", show: true },
        { icon: CalendarCheck, label: "My Host Bookings", path: "/host-bookings", show: true },
      ]
    },
    {
      section: "Personal",
      items: [
        { icon: User, label: "Profile & Security", path: "/profile/edit", show: true },
        { icon: CreditCard, label: "Payments & Earnings", path: "/payment", show: true },
      ]
    },
    {
      section: "Admin Control",
      items: [
        { icon: Shield, label: "Admin Dashboard", path: "/admin", show: userRole === "admin" },
        { icon: UserCog, label: "Host Verification", path: "/admin/verification", show: userRole === "admin" },
        { icon: CreditCard, label: "Payment Verification", path: "/admin/payment-verification", show: userRole === "admin" },
        { icon: Users, label: "Accounts Overview", path: "/admin/accounts", show: userRole === "admin" },
        { icon: Settings, label: "Referral Settings", path: "/admin/referral-settings", show: userRole === "admin" },
        { icon: CalendarCheck, label: "All Bookings", path: "/admin/all-bookings", show: userRole === "admin" },
      ]
    }
  ];

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  // Reusable small menu row
  const MenuRow = ({ item }: { item: { icon: any; label: string; path: string } }) => (
    <button
      onClick={() => handleNavigate(item.path)}
      className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/60 transition-colors group"
    >
      <div className="flex items-center gap-2.5">
        <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <item.icon className="h-3 w-3 text-primary" />
        </div>
        <span className="text-xs font-medium text-foreground">{item.label}</span>
      </div>
      <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
    </button>
  );

  // ── NOT LOGGED IN ──────────────────────────────────────────────
  if (!user) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          className="w-[80vw] max-w-[300px] p-0 border-none flex flex-col [&>button]:hidden"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {/* Header */}
          <div className="bg-primary px-4 pt-4 pb-5 relative flex-shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 right-3.5 h-6 w-6 rounded-full bg-primary-foreground/15 flex items-center justify-center hover:bg-primary-foreground/25 transition-colors"
            >
              <X className="h-3 w-3 text-primary-foreground" />
            </button>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-foreground/40 mb-0.5">Realtravo</p>
            <h2 className="text-lg font-extrabold text-primary-foreground">Welcome</h2>
          </div>

          {/* Body */}
          <div className="flex-1 bg-background flex flex-col items-center justify-center px-5 py-8">
            <div className="relative mb-5">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow">
                <LogIn className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
            </div>
            <h3 className="text-sm font-extrabold text-foreground mb-1 text-center">Join Realtravo</h3>
            <p className="text-xs text-muted-foreground text-center mb-7 max-w-[200px] leading-relaxed">
              Log in to manage bookings, save favourites, and become a host.
            </p>
            <button
              onClick={() => { setIsOpen(false); navigate("/auth"); }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:opacity-90 active:scale-95 transition-all"
            >
              Login / Register
            </button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // ── LOGGED IN ──────────────────────────────────────────────────
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="w-[80vw] max-w-[300px] p-0 border-none flex flex-col [&>button]:hidden"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* ── Header ── */}
        <div className="bg-primary px-4 pt-4 pb-4 relative flex-shrink-0">
          {/* Single close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3.5 right-3.5 h-6 w-6 rounded-full bg-primary-foreground/15 flex items-center justify-center hover:bg-primary-foreground/25 transition-colors"
          >
            <X className="h-3 w-3 text-primary-foreground" />
          </button>

          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-foreground/40 mb-2.5">My Account</p>

          {loading ? (
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-10 w-10 rounded-xl bg-primary-foreground/20" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24 bg-primary-foreground/20 rounded" />
                <Skeleton className="h-2 w-14 bg-primary-foreground/20 rounded" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center overflow-hidden border border-primary-foreground/20">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xs font-black text-primary-foreground">{initials}</span>
                  )}
                </div>
                {/* Online dot */}
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border-[1.5px] border-primary" />
              </div>

              {/* Name + badge */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-primary-foreground truncate leading-tight">{userName}</p>
                <span className={`inline-block mt-0.5 px-1.5 py-px rounded-full text-[9px] font-black uppercase tracking-wider ${
                  userRole === "admin"
                    ? "bg-yellow-400/25 text-yellow-200"
                    : "bg-primary-foreground/15 text-primary-foreground/55"
                }`}>
                  {userRole === "admin" ? "Admin" : "Member"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Scrollable menu ── */}
        <div className="flex-1 overflow-y-auto bg-background py-2.5 px-2.5 space-y-2.5">

          {/* Creator Tools + Personal */}
          {menuItems.filter(s => s.section !== "Admin Control").map((section, idx) => {
            const visibleItems = section.items.filter(i => i.show);
            if (!visibleItems.length) return null;
            return (
              <div key={idx}>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.22em] px-1 mb-1">
                  {section.section}
                </p>
                <div className="rounded-xl overflow-hidden border border-border bg-card divide-y divide-border/50">
                  {visibleItems.map(item => <MenuRow key={item.path} item={item} />)}
                </div>
              </div>
            );
          })}

          {/* Admin */}
          {loading ? (
            <Skeleton className="h-10 w-full rounded-xl" />
          ) : (
            menuItems.filter(s => s.section === "Admin Control").map((section, idx) => {
              const visibleItems = section.items.filter(i => i.show);
              if (!visibleItems.length) return null;
              return (
                <div key={`admin-${idx}`}>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.22em] px-1 mb-1">
                    {section.section}
                  </p>
                  <div className="rounded-xl overflow-hidden border border-amber-200/60 bg-amber-50/30 dark:bg-amber-900/10 dark:border-amber-700/30 divide-y divide-amber-100/60 dark:divide-amber-800/30">
                    {visibleItems.map(item => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-6 w-6 rounded-md bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                          </div>
                          <span className="text-xs font-medium text-foreground">{item.label}</span>
                        </div>
                        <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors group"
          >
            <div className="h-6 w-6 rounded-md bg-destructive/10 group-hover:bg-destructive flex items-center justify-center flex-shrink-0 transition-colors">
              <LogOut className="h-3 w-3 text-destructive group-hover:text-destructive-foreground transition-colors" />
            </div>
            <span className="text-xs font-semibold text-destructive">Log Out</span>
          </button>

          <div className="h-1" />
        </div>
      </SheetContent>
    </Sheet>
  );
};