import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import logoImage from "@assets/1762327857479 (1)_1762540489724.png";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-card border-t mt-12 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <img src={logoImage} alt="Made in Algeria Logo" className="h-14 md:h-20 w-auto" />
              <div className="flex flex-col">
                <span className="text-base md:text-lg font-bold">Made in Algeria</span>
                <span className="text-sm md:text-base text-muted-foreground">صنع في الجزائر</span>
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3 md:mb-4 text-foreground text-sm md:text-base">{t.footer.quickLinks}</h3>
            <nav className="flex flex-col gap-1.5 md:gap-2">
              <Link href="/about">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto text-xs md:text-sm text-muted-foreground hover:text-foreground">
                  {t.nav.about}
                </Button>
              </Link>
              <Link href="/factories">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto text-xs md:text-sm text-muted-foreground hover:text-foreground">
                  {t.nav.factories}
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto text-xs md:text-sm text-muted-foreground hover:text-foreground">
                  {t.nav.contact}
                </Button>
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold mb-3 md:mb-4 text-foreground text-sm md:text-base">{t.footer.mainCategories}</h3>
            <nav className="flex flex-col gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
              <span>{t.categories.food}</span>
              <span>{t.categories.textile}</span>
              <span>{t.categories.chemical}</span>
              <span>{t.categories.mechanical}</span>
              <span>{t.categories.electronic}</span>
              <span>{t.categories.construction}</span>
            </nav>
          </div>

          <div>
            <h3 className="font-bold mb-3 md:mb-4 text-foreground text-sm md:text-base">{t.footer.newsletter}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
              {t.footer.subscribe}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                type="email" 
                placeholder={t.footer.emailPlaceholder}
                className="flex-1 h-9 md:h-10 text-xs md:text-sm"
                data-testid="input-newsletter"
              />
              <Button size="sm" className="text-xs md:text-sm" data-testid="button-subscribe">{t.footer.subscribe}</Button>
            </div>
            
            <div className="mt-4 md:mt-6 flex flex-col gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                <span className="truncate">info@madeinalgeria.dz</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                <span>+213 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                <span>الجزائر العاصمة</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-xs md:text-sm text-muted-foreground text-center md:text-right">
            © 2024 Made in Algeria. {t.footer.privacy}
          </p>
          <div className="flex gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
            <Link href="/privacy">
              <Button variant="ghost" className="text-muted-foreground px-0 h-auto text-xs md:text-sm">
                {t.footer.privacy}
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="ghost" className="text-muted-foreground px-0 h-auto text-xs md:text-sm">
                {t.footer.terms}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
