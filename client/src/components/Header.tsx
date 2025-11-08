import { Link } from "wouter";
import { Menu, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { SiGoogle } from "react-icons/si";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoImage from "@assets/IMG_20251107_233735_1762555070356.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();

  const languages = [
    { code: 'ar' as const, label: 'العربية', flag: '🇩🇿' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-20 md:h-24 lg:h-28 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer" data-testid="link-home">
            <img src={logoImage} alt="Made in Algeria Logo" className="h-12 w-auto object-contain md:h-16 lg:h-20" />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-nav-home">
              {t.nav.home}
            </Button>
          </Link>
          <Link href="/factories">
            <Button variant="ghost" size="sm" data-testid="button-nav-factories">
              {t.nav.factories}
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" size="sm" data-testid="button-nav-about">
              {t.nav.about}
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" size="sm" data-testid="button-nav-contact">
              {t.nav.contact}
            </Button>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" data-testid="button-nav-admin">
                {t.nav.admin}
              </Button>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2" data-testid="button-user-menu">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.picture || undefined} alt={user.name || user.email} />
                    <AvatarFallback>
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user.name || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px]">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{user.name || "User"}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} data-testid="button-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>تسجيل الخروج / Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2"
              onClick={() => window.location.href = "/api/auth/google"}
              data-testid="button-google-login"
            >
              <SiGoogle className="h-4 w-4" />
              <span className="hidden md:inline">تسجيل الدخول / Login</span>
              <span className="md:hidden"><LogIn className="h-4 w-4" /></span>
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 min-w-[120px] justify-start" data-testid="button-language">
                <span className="text-lg">{currentLanguage?.flag}</span>
                <span className="font-medium">{currentLanguage?.label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuLabel>اختر اللغة / Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`gap-2 ${language === lang.code ? 'bg-accent font-semibold' : ''}`}
                  data-testid={`language-${lang.code}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
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
                {t.nav.home}
              </Button>
            </Link>
            <Link href="/factories">
              <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-factories">
                {t.nav.factories}
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-about">
                {t.nav.about}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-contact">
                {t.nav.contact}
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-admin">
                  {t.nav.admin}
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
