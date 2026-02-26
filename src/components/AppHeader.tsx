import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  Globe,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANG_LABELS: Record<string, string> = { de: "DE", en: "EN" };

export function AppHeader() {
  const { user, subscription, signOut, openCustomerPortal, createCheckout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const toggleLang = () => {
    const next = i18n.language === "de" ? "en" : "de";
    i18n.changeLanguage(next);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <SidebarTrigger />

        <div className="flex items-center gap-3">
          {subscription.subscribed && subscription.tier && (
            <>
              <Badge variant="secondary" className="hidden sm:flex gap-1.5 px-3 py-1 text-xs">
                <Crown className="h-3 w-3 text-primary" />
                {TIERS[subscription.tier].name}
              </Badge>
              <Badge variant="outline" className="hidden sm:flex gap-1.5 px-3 py-1 text-xs">
                <Clock className="h-3 w-3" />
                {Math.round(subscription.minutesUsed)} / {subscription.minutesLimit >= 999999 ? "∞" : subscription.minutesLimit} {t("header.min")}
              </Badge>
            </>
          )}

          {/* Language toggle */}
          <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-1.5 px-2">
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium">{LANG_LABELS[i18n.language] ?? "DE"}</span>
          </Button>

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
                    ? t("header.subscriptionActive", { tier: TIERS[subscription.tier].name })
                    : t("header.noSubscription")}
                </p>
              </div>
              <DropdownMenuSeparator />
              {subscription.tier === "unlimited" ? (
                <DropdownMenuItem onClick={openCustomerPortal} className="gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  {t("header.manageSubscription")}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => createCheckout(TIERS.unlimited.price_id)} className="gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  {t("header.upgradeToUnlimited")}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-destructive">
                <LogOut className="h-4 w-4" />
                {t("header.signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
