import { Link } from "wouter";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logoImage from "@assets/1762327857479 (1)_1762540489724.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          </nav>
        </div>
      )}
    </header>
  );
}
