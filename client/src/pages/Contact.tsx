import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            اتصل بنا
          </h1>
          <p className="text-lg text-primary-foreground/90">
            نحن هنا للإجابة على استفساراتكم ومساعدتكم
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">البريد الإلكتروني</h3>
              <p className="text-muted-foreground text-sm mb-2">راسلنا عبر البريد</p>
              <p className="text-foreground font-medium">info@madeinalgeria.dz</p>
              <p className="text-foreground font-medium">support@madeinalgeria.dz</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">الهاتف</h3>
              <p className="text-muted-foreground text-sm mb-2">اتصل بنا مباشرة</p>
              <p className="text-foreground font-medium" dir="ltr">+213 123 456 789</p>
              <p className="text-foreground font-medium" dir="ltr">+213 987 654 321</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">العنوان</h3>
              <p className="text-muted-foreground text-sm mb-2">قم بزيارتنا</p>
              <p className="text-foreground font-medium">الجزائر العاصمة</p>
              <p className="text-foreground font-medium">المنطقة الإدارية</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground">أرسل لنا رسالة</h2>
                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  console.log('Contact form submitted');
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        الاسم الكامل *
                      </label>
                      <Input 
                        placeholder="أدخل اسمك الكامل" 
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        البريد الإلكتروني *
                      </label>
                      <Input 
                        type="email" 
                        placeholder="example@email.com" 
                        required
                        data-testid="input-contact-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        رقم الهاتف *
                      </label>
                      <Input 
                        type="tel" 
                        placeholder="+213 123 456 789" 
                        required
                        data-testid="input-contact-phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        الموضوع
                      </label>
                      <Input 
                        placeholder="موضوع الرسالة" 
                        data-testid="input-contact-subject"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      الرسالة *
                    </label>
                    <Textarea 
                      placeholder="اكتب رسالتك هنا..." 
                      rows={6}
                      required
                      data-testid="textarea-contact-message"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" data-testid="button-contact-send">
                    إرسال الرسالة
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <Clock className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">ساعات العمل</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الأحد - الخميس</span>
                        <span className="text-foreground font-medium">8:00 - 17:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الجمعة - السبت</span>
                        <span className="text-foreground font-medium">مغلق</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-foreground">أسئلة شائعة</h3>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    هل لديك سؤال حول التسجيل؟
                  </p>
                  <p className="text-muted-foreground">
                    هل تحتاج مساعدة في استخدام المنصة؟
                  </p>
                  <p className="text-muted-foreground">
                    هل تريد الإعلان عن مصنعك؟
                  </p>
                  <Button variant="outline" className="w-full mt-4" data-testid="button-faq">
                    اطلع على الأسئلة الشائعة
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">دعم سريع</h3>
                <p className="text-sm text-primary-foreground/90 mb-4">
                  فريقنا جاهز لمساعدتك في أي وقت
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  data-testid="button-quick-support"
                >
                  <Phone className="w-4 h-4 ml-2" />
                  اتصل الآن
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
