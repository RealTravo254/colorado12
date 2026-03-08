import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Heart, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { AccountSheet } from "@/components/AccountSheet";
import { useAuth } from "@/contexts/AuthContext";

interface DetailNavBarProps {
  scrolled: boolean;
  itemName: string;
  isSaved: boolean;
  onSave: () => void;
  onBack: () => void;
}

export const DetailNavBar = ({ scrolled, itemName, isSaved, onSave, onBack }: DetailNavBarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 py-3 mx-auto max-w-6xl inset-x-0 bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300 md:rounded-b-2xl"
      style={{
        transform: scrolled ? "translateY(0)" : "translateY(-100%)",
        opacity: scrolled ? 1 : 0,
        pointerEvents: scrolled ? "auto" : "none",
      }}
    >
      <div className="flex items-center gap-2">
        <Button onClick={onBack} className="rounded-full w-9 h-9 p-0 border-none bg-muted text-foreground hover:bg-muted/80 shadow-none transition-all flex-shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <Button className="rounded-full w-9 h-9 p-0 border-none bg-muted text-foreground hover:bg-muted/80 shadow-none transition-all flex-shrink-0">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 h-screen border-none">
            <NavigationDrawer onClose={() => setIsDrawerOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <span className="text-sm font-black uppercase tracking-tight text-foreground truncate mx-3 flex-1 text-center">
        {itemName}
      </span>

      <div className="flex items-center gap-2">
        <Button
          onClick={onSave}
          className={`rounded-full w-9 h-9 p-0 border-none shadow-none transition-all flex-shrink-0 ${
            isSaved ? "bg-red-500 hover:bg-red-600" : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-white text-white" : ""}`} />
        </Button>
        {user ? (
          <AccountSheet>
            <Button className="rounded-full w-9 h-9 p-0 border-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-none transition-all flex-shrink-0">
              <User className="h-4 w-4" />
            </Button>
          </AccountSheet>
        ) : (
          <Button
            onClick={() => navigate("/auth")}
            className="rounded-full w-9 h-9 p-0 border-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-none transition-all flex-shrink-0"
          >
            <User className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
