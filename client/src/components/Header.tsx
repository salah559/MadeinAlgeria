import { Link } from "wouter";
import { Search, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoImage from "@assets/1762327857479 (1)_1762540489724.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer" data-testid="link-home">
            <img src={logoImage} alt="Made in Algeria Logo" className="h-16 w-auto" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-tight">Made in Algeria</span>
              <span className="text-base text-muted-foreground leading-tight">صنع في الجزائر</span>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-nav-home">
              الرئيسية
            </Button>
          </Link>
          <Link href="/factories">
            <Button variant="ghost" size="sm" data-testid="button-nav-factories">
              المصانع
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" size="sm" data-testid="button-nav-about">
              من نحن
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" size="sm" data-testid="button-nav-contact">
              اتصل بنا
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" data-testid="button-search">
            <Search className="w-5 h-5" />
          </Button>

          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">حسابي</p>
                      <p className="text-xs leading-none text-muted-foreground" data-testid="text-user-email">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <div className="flex items-center w-full cursor-pointer" data-testid="link-admin">
                        <User className="ml-2 h-4 w-4" />
                        <span>لوحة التحكم</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} data-testid="button-logout">
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" data-testid="button-login">
                  تسجيل الدخول
                </Button>
              </Link>
            )
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col p-4 gap-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-home">
                الرئيسية
              </Button>
            </Link>
            <Link href="/factories">
              <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-factories">
                المصانع
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-about">
                من نحن
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-contact">
                اتصل بنا
              </Button>
            </Link>
            {!loading && (
              user ? (
                <>
                  <Link href="/admin">
                    <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-admin">
                      لوحة التحكم
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={signOut}
                    data-testid="button-mobile-logout"
                  >
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="default" className="w-full" data-testid="button-mobile-login">
                    تسجيل الدخول
                  </Button>
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
