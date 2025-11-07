import { Link } from "wouter";
import { Menu, LogOut, User, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { user, signOut, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const languages = [
    { code: 'ar' as const, label: 'العربية', flag: '🇩🇿' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer" data-testid="link-home">
            <img src={logoImage} alt="Made in Algeria Logo" className="h-full w-auto object-contain py-2" />
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
        </nav>

        <div className="flex items-center gap-2">
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
                      <p className="text-sm font-medium leading-none">{t.nav.profile}</p>
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
                        <span>{t.nav.admin}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} data-testid="button-logout">
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>{t.nav.logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" data-testid="button-login">
                  {t.nav.login}
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
            {!loading && (
              user ? (
                <>
                  <Link href="/admin">
                    <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-admin">
                      {t.nav.admin}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={signOut}
                    data-testid="button-mobile-logout"
                  >
                    {t.nav.logout}
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="default" className="w-full" data-testid="button-mobile-login">
                    {t.nav.login}
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
