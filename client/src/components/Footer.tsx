import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoImage from "@assets/1762327857479 (1)_1762540489724.png";

export default function Footer() {
  return (
    <footer className="w-full bg-card border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImage} alt="Made in Algeria Logo" className="h-16 w-auto" />
              <div className="flex flex-col">
                <span className="text-base font-bold">Made in Algeria</span>
                <span className="text-sm text-muted-foreground">صنع في الجزائر</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              منصة وطنية لربط الزبائن بالمصانع الجزائرية في جميع الولايات والقطاعات
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground">روابط سريعة</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto text-muted-foreground hover:text-foreground">
                  من نحن
                </Button>
              </Link>
              <Link href="/factories">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto text-muted-foreground hover:text-foreground">
                  المصانع
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="w-full justify-start px-0 h-auto text-muted-foreground hover:text-foreground">
                  اتصل بنا
                </Button>
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground">القطاعات الرئيسية</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>الصناعات الغذائية</span>
              <span>الصناعات النسيجية</span>
              <span>الصناعات الكيميائية</span>
              <span>الصناعات الميكانيكية</span>
              <span>الصناعات الإلكترونية</span>
              <span>مواد البناء</span>
            </nav>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground">النشرة الإخبارية</h3>
            <p className="text-sm text-muted-foreground mb-4">
              اشترك للحصول على آخر الأخبار والتحديثات
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="flex-1"
                data-testid="input-newsletter"
              />
              <Button data-testid="button-subscribe">اشترك</Button>
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
            © 2024 Made in Algeria. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy">
              <Button variant="ghost" className="text-muted-foreground px-0 h-auto">
                سياسة الخصوصية
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="ghost" className="text-muted-foreground px-0 h-auto">
                شروط الاستخدام
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
