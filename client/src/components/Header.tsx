import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoImage from "@assets/IMG_20251107_233735_1762555070356.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

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
          <Link href="/admin">
            <Button variant="ghost" size="sm" data-testid="button-nav-admin">
              {t.nav.admin}
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
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-admin">
                {t.nav.admin}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
