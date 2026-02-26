import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  Headphones,
  LogOut,
  CreditCard,
  Settings,
  Crown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { user, subscription, signOut, openCustomerPortal } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo – links to landing */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <Headphones className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Sales<span className="text-primary">Copilot</span>
          </span>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {subscription.subscribed && (
            <Badge
              variant="secondary"
              className="hidden sm:flex gap-1.5 px-3 py-1 text-xs"
            >
              <Crown className="h-3 w-3 text-primary" />
              Pro aktiv
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                  {user?.email?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <span className="hidden sm:inline max-w-[160px] truncate text-muted-foreground">
                  {user?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {subscription.subscribed ? "Pro-Abo aktiv" : "Kein Abo"}
                </p>
              </div>
              <DropdownMenuSeparator />
              {subscription.subscribed ? (
                <DropdownMenuItem onClick={openCustomerPortal} className="gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Abo verwalten
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/app")} className="gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  Abo abschließen
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-destructive">
                <LogOut className="h-4 w-4" />
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
