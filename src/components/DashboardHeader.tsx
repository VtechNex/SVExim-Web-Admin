import { Bell, Search, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { AUTH } from "@/services/authService";

const EBAY_OAUTH_URL = import.meta.env.VITE_EBAY_OAUTH_URL;

export function DashboardHeader() {
  const [isEbayConnected, setIsEbayConnected] = useState(false);
  const [user, setUser] = useState({username: '-', email: '-'});

  useEffect(() => {
    const checkEbayConnection = async () => {
      const response = await AUTH.oauth(null);
      setIsEbayConnected(response && response.status === 201)
    }
    checkEbayConnection();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AUTH.getUser();
      const local = userData?.email?.split('@')[0] || '';
      const username = (local.replace(/\d+/g, '') || 'User').trim();
      userData.username = username;
      setUser(userData);
    };
    fetchUser();
  }, []);

  const handleConnectEbay = () => {
    if (!isEbayConnected) {
      if (EBAY_OAUTH_URL)
        window.location.href = EBAY_OAUTH_URL;
      else
        alert("eBay OAuth URL is not configured.");
    } else {
      window.location.href = '/ebay/oauth';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-16 items-center gap-4 px-6 justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products, brands, RFQs..."
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-foreground" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>

          {/* eBay Connect Button aligned properly */}
          <Button
            className={`h-10 ${
              isEbayConnected ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            onClick={handleConnectEbay}
          >
            {isEbayConnected ? "Connected" : "Connect eBay"}
          </Button>

          {/* Admin Info */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-medium text-primary">{user.username}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
