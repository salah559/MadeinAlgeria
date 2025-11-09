import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t.contact.title}
          </h1>
          <p className="text-lg text-primary-foreground/90">
            {t.contact.subtitle}
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
              <h3 className="text-lg font-bold mb-2 text-foreground">{t.contact.emailTitle}</h3>
              <p className="text-muted-foreground text-sm mb-2">{t.contact.emailSubtitle}</p>
              <p className="text-foreground font-medium">info@madeinalgeria.dz</p>
              <p className="text-foreground font-medium">support@madeinalgeria.dz</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">{t.contact.phoneTitle}</h3>
              <p className="text-muted-foreground text-sm mb-2">{t.contact.phoneSubtitle}</p>
              <p className="text-foreground font-medium" dir="ltr">+213 123 456 789</p>
              <p className="text-foreground font-medium" dir="ltr">+213 987 654 321</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">{t.contact.addressTitle}</h3>
              <p className="text-muted-foreground text-sm mb-2">{t.contact.addressSubtitle}</p>
              <p className="text-foreground font-medium">{t.contact.addressLine1}</p>
              <p className="text-foreground font-medium">{t.contact.addressLine2}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground">{t.contact.form.title}</h2>
                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  console.log('Contact form submitted');
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        {t.contact.fullName} {t.contact.form.required}
                      </label>
                      <Input 
                        placeholder={t.contact.form.namePlaceholder}
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        {t.contact.email} {t.contact.form.required}
                      </label>
                      <Input 
                        type="email" 
                        placeholder={t.contact.form.emailPlaceholder}
                        required
                        data-testid="input-contact-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        {t.contact.phone} {t.contact.form.required}
                      </label>
                      <Input 
                        type="tel" 
                        placeholder={t.contact.form.phonePlaceholder}
                        required
                        data-testid="input-contact-phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        {t.contact.subject}
                      </label>
                      <Input 
                        placeholder={t.contact.form.subjectPlaceholder}
                        data-testid="input-contact-subject"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      {t.contact.message} {t.contact.form.required}
                    </label>
                    <Textarea 
                      placeholder={t.contact.form.messagePlaceholder}
                      rows={6}
                      required
                      data-testid="textarea-contact-message"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" data-testid="button-contact-send">
                    {t.contact.sendMessage}
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
                    <h3 className="text-lg font-bold mb-2 text-foreground">{t.contact.hours}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">{t.contact.workingDays}</span>
                        <span className="text-foreground font-medium">{t.contact.workingHours}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">{t.contact.weekend}</span>
                        <span className="text-foreground font-medium">{t.contact.closed}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-foreground">{t.contact.faqTitle}</h3>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    {t.contact.questions.registration}
                  </p>
                  <p className="text-muted-foreground">
                    {t.contact.questions.usage}
                  </p>
                  <p className="text-muted-foreground">
                    {t.contact.questions.advertise}
                  </p>
                  <Button variant="outline" className="w-full mt-4" data-testid="button-faq">
                    {t.contact.faqButton}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">{t.contact.quickSupport}</h3>
                <p className="text-sm text-primary-foreground/90 mb-4">
                  {t.contact.quickSupportDesc}
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  data-testid="button-quick-support"
                >
                  <Phone className="w-4 h-4 ml-2" />
                  {t.contact.callNow}
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
