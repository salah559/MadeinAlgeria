
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Globe, Building2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Factory } from "@shared/schema";

export default function FactoryDetail() {
  const [, params] = useRoute("/factory/:id");
  const { t, language } = useLanguage();
  const factoryId = params?.id;

  const { data: factory, isLoading, error } = useQuery<Factory>({
    queryKey: [`/api/factories/${factoryId}`],
    enabled: !!factoryId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !factory) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">لم يتم العثور على المصنع</h2>
            <p className="text-muted-foreground">المصنع المطلوب غير موجود</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayName = language === 'ar' ? factory.nameAr : factory.name;
  const displayDescription = language === 'ar' ? factory.descriptionAr : factory.description;
  const displayAddress = language === 'ar' ? factory.addressAr : factory.address;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="relative h-96 overflow-hidden">
          <img 
            src={factory.imageUrl || '/placeholder-factory.jpg'} 
            alt={displayName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <Badge variant="secondary" className="mb-4 bg-background/90 backdrop-blur-sm">
                {language === 'ar' ? factory.categoryAr : factory.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {displayName}
              </h1>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{factory.wilaya}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    {language === 'ar' ? 'عن المصنع' : 'About the Factory'}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {displayDescription}
                  </p>

                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {language === 'ar' ? 'المنتجات والخدمات' : 'Products and Services'}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {factory.productsAr?.map((product, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {language === 'ar' ? product : factory.products?.[idx] || product}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {language === 'ar' ? 'نموذج الاتصال' : 'Contact Form'}
                  </h3>
                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    console.log('Contact form submitted');
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'} data-testid="input-name" />
                      <Input type="email" placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'} data-testid="input-email" />
                    </div>
                    <Input placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} data-testid="input-phone" />
                    <Textarea 
                      placeholder={language === 'ar' ? 'رسالتك...' : 'Your message...'}
                      rows={5}
                      data-testid="textarea-message"
                    />
                    <Button type="submit" className="w-full" data-testid="button-send">
                      {language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-foreground">
                          {language === 'ar' ? 'العنوان' : 'Address'}
                        </p>
                        <p className="text-sm text-muted-foreground">{displayAddress}</p>
                      </div>
                    </div>
                    
                    {factory.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-foreground">
                            {language === 'ar' ? 'الهاتف' : 'Phone'}
                          </p>
                          <p className="text-sm text-muted-foreground" dir="ltr">{factory.phone}</p>
                        </div>
                      </div>
                    )}

                    {factory.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-foreground">
                            {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                          </p>
                          <p className="text-sm text-muted-foreground">{factory.email}</p>
                        </div>
                      </div>
                    )}

                    {factory.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium text-foreground">
                            {language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
                          </p>
                          <p className="text-sm text-muted-foreground">{factory.website}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {factory.phone && (
                    <Button className="w-full mt-6" data-testid="button-contact-direct">
                      <Phone className="w-4 h-4 ml-2" />
                      {language === 'ar' ? 'اتصل الآن' : 'Call Now'}
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {language === 'ar' ? 'الموقع على الخريطة' : 'Location on Map'}
                  </h3>
                  <div className="bg-muted rounded-md h-48 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'الخريطة التفاعلية' : 'Interactive Map'}
                      </p>
                      <p className="text-xs text-muted-foreground">{factory.wilaya}</p>
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
