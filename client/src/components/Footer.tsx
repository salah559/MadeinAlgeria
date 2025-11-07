import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import logoImage from "@assets/1762327857479 (1)_1762540489724.png";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-card border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImage} alt="Made in Algeria Logo" className="h-20 w-auto" />
              <div className="flex flex-col">
                <span className="text-lg font-bold">Made in Algeria</span>
                <span className="text-base text-muted-foreground">صنع في الجزائر</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground">{t.footer.quickLinks}</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto text-muted-foreground hover:text-foreground">
                  {t.nav.about}
                </Button>
              </Link>
              <Link href="/factories">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto text-muted-foreground hover:text-foreground">
                  {t.nav.factories}
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto text-muted-foreground hover:text-foreground">
                  {t.nav.contact}
                </Button>
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground">{t.footer.mainCategories}</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>{t.categories.food}</span>
              <span>{t.categories.textile}</span>
              <span>{t.categories.chemical}</span>
              <span>{t.categories.mechanical}</span>
              <span>{t.categories.electronic}</span>
              <span>{t.categories.construction}</span>
            </nav>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground">{t.footer.newsletter}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t.footer.subscribe}
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder={t.footer.emailPlaceholder}
                className="flex-1"
                data-testid="input-newsletter"
              />
              <Button data-testid="button-subscribe">{t.footer.subscribe}</Button>
            </div>
            
            <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@madeinalgeria.dz</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+213 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>الجزائر العاصمة</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Made in Algeria. {t.footer.privacy}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy">
              <Button variant="ghost" className="text-muted-foreground px-0 h-auto">
                {t.footer.privacy}
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="ghost" className="text-muted-foreground px-0 h-auto">
                {t.footer.terms}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
