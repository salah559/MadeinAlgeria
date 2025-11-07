import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Globe, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import foodFactoryImage from "@assets/generated_images/Food_processing_factory_Algeria_948f6d0a.png";

// todo: remove mock functionality
const mockFactory = {
  id: "1",
  nameAr: "مصنع زيت الزيتون الجزائري",
  name: "Algerian Olive Oil Factory",
  descriptionAr: "مصنع متخصص في إنتاج وتعبئة زيت الزيتون البكر الممتاز والمنتجات المشتقة منه. نستخدم أحدث التقنيات للحفاظ على جودة المنتج وخصائصه الطبيعية.",
  wilaya: "تيزي وزو",
  addressAr: "المنطقة الصناعية، تيزي وزو 15000",
  categoryAr: "الصناعات الغذائية",
  productsAr: ["زيت الزيتون البكر الممتاز", "الزيتون المعلب", "المخللات", "منتجات عضوية"],
  phone: "+213 26 123 456",
  email: "info@oliveoil-dz.com",
  website: "www.oliveoil-dz.com",
  imageUrl: foodFactoryImage,
};

export default function FactoryDetail() {
  const [, params] = useRoute("/factory/:id");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="relative h-96 overflow-hidden">
          <img 
            src={mockFactory.imageUrl} 
            alt={mockFactory.nameAr}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <Badge variant="secondary" className="mb-4 bg-background/90 backdrop-blur-sm">
                {mockFactory.categoryAr}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {mockFactory.nameAr}
              </h1>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{mockFactory.wilaya}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">عن المصنع</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {mockFactory.descriptionAr}
                  </p>

                  <h3 className="text-xl font-bold mb-4 text-foreground">المنتجات والخدمات</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {mockFactory.productsAr.map((product, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {product}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-foreground">نموذج الاتصال</h3>
                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    console.log('Contact form submitted');
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="الاسم الكامل" data-testid="input-name" />
                      <Input type="email" placeholder="البريد الإلكتروني" data-testid="input-email" />
                    </div>
                    <Input placeholder="رقم الهاتف" data-testid="input-phone" />
                    <Textarea 
                      placeholder="رسالتك..." 
                      rows={5}
                      data-testid="textarea-message"
                    />
                    <Button type="submit" className="w-full" data-testid="button-send">
                      إرسال الرسالة
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-foreground">معلومات الاتصال</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-foreground">العنوان</p>
                        <p className="text-sm text-muted-foreground">{mockFactory.addressAr}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-foreground">الهاتف</p>
                        <p className="text-sm text-muted-foreground" dir="ltr">{mockFactory.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-foreground">البريد الإلكتروني</p>
                        <p className="text-sm text-muted-foreground">{mockFactory.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-foreground">الموقع الإلكتروني</p>
                        <p className="text-sm text-muted-foreground">{mockFactory.website}</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-6" data-testid="button-contact-direct">
                    <Phone className="w-4 h-4 ml-2" />
                    اتصل الآن
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-foreground">الموقع على الخريطة</h3>
                  <div className="bg-muted rounded-md h-48 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">الخريطة التفاعلية</p>
                      <p className="text-xs text-muted-foreground">{mockFactory.wilaya}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
