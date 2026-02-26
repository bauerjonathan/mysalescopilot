import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { TIERS } from "@/config/tiers";
import {
  LogOut,
  CreditCard,
  Settings,
  Crown,
  Clock,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Sidebar trigger */}
        <SidebarTrigger />

        {/* Right side */}
        <div className="flex items-center gap-3">
          {subscription.subscribed && subscription.tier && (
            <>
              <Badge
                variant="secondary"
                className="hidden sm:flex gap-1.5 px-3 py-1 text-xs"
              >
                <Crown className="h-3 w-3 text-primary" />
                {TIERS[subscription.tier].name}
              </Badge>
              <Badge
                variant="outline"
                className="hidden sm:flex gap-1.5 px-3 py-1 text-xs"
              >
                <Clock className="h-3 w-3" />
                {Math.round(subscription.minutesUsed)} / {subscription.minutesLimit >= 999999 ? "∞" : subscription.minutesLimit} Min
              </Badge>
            </>
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
                  {subscription.subscribed && subscription.tier
                    ? `${TIERS[subscription.tier].name}-Abo aktiv`
                    : "Kein Abo"}
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
