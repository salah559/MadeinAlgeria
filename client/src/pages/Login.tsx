
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiGoogle } from "react-icons/si";
import { Lock, ShieldCheck, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";

export default function Login() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const features = [
    {
      icon: Lock,
      titleAr: "آمن ومحمي",
      titleEn: "Secure & Protected",
      titleFr: "Sécurisé et Protégé",
      descriptionAr: "نحمي بياناتك بأعلى معايير الأمان",
      descriptionEn: "We protect your data with the highest security standards",
      descriptionFr: "Nous protégeons vos données avec les normes de sécurité les plus élevées",
    },
    {
      icon: ShieldCheck,
      titleAr: "موثوق",
      titleEn: "Trusted",
      titleFr: "De Confiance",
      descriptionAr: "نستخدم خدمات Google الموثوقة للمصادقة",
      descriptionEn: "We use trusted Google services for authentication",
      descriptionFr: "Nous utilisons les services Google de confiance pour l'authentification",
    },
    {
      icon: Zap,
      titleAr: "سريع وسهل",
      titleEn: "Fast & Easy",
      titleFr: "Rapide et Facile",
      descriptionAr: "تسجيل دخول بنقرة واحدة فقط",
      descriptionEn: "Login with just one click",
      descriptionFr: "Connexion en un seul clic",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {language === "ar" ? "جاري التحميل..." : language === "fr" ? "Chargement..." : "Loading..."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={language === "ar" ? "تسجيل الدخول" : language === "fr" ? "Connexion" : "Login"}
        description={language === "ar" ? "سجل الدخول إلى دليل المصانع الجزائرية" : language === "fr" ? "Connectez-vous à l'annuaire des usines algériennes" : "Login to Algeria Factory Directory"}
      />
      <Header />

      <div className="bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === "ar" ? "تسجيل الدخول" : language === "fr" ? "Connexion" : "Login"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar" 
                ? "سجل الدخول للوصول إلى جميع ميزات المنصة" 
                : language === "fr" 
                ? "Connectez-vous pour accéder à toutes les fonctionnalités de la plateforme"
                : "Login to access all platform features"}
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Login Card */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">
                    {language === "ar" ? "مرحباً بك" : language === "fr" ? "Bienvenue" : "Welcome Back"}
                  </CardTitle>
                  <CardDescription>
                    {language === "ar" 
                      ? "سجل الدخول باستخدام حساب Google الخاص بك" 
                      : language === "fr"
                      ? "Connectez-vous avec votre compte Google"
                      : "Sign in with your Google account"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full gap-2 text-lg py-6"
                    onClick={handleGoogleLogin}
                    data-testid="button-google-login"
                  >
                    <SiGoogle className="h-5 w-5" />
                    {language === "ar" 
                      ? "تسجيل الدخول بواسطة Google" 
                      : language === "fr"
                      ? "Se connecter avec Google"
                      : "Sign in with Google"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        {language === "ar" ? "آمن وموثوق" : language === "fr" ? "Sûr et fiable" : "Secure & Trusted"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    {language === "ar" 
                      ? "بتسجيل الدخول، أنت توافق على شروط الخدمة وسياسة الخصوصية" 
                      : language === "fr"
                      ? "En vous connectant, vous acceptez les conditions d'utilisation et la politique de confidentialité"
                      : "By signing in, you agree to our Terms of Service and Privacy Policy"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Features Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {language === "ar" ? "لماذا تسجل الدخول؟" : language === "fr" ? "Pourquoi se connecter ?" : "Why Sign In?"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === "ar" 
                    ? "احصل على تجربة مخصصة وإمكانية الوصول إلى ميزات إضافية" 
                    : language === "fr"
                    ? "Obtenez une expérience personnalisée et accédez à des fonctionnalités supplémentaires"
                    : "Get a personalized experience and access to additional features"}
                </p>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <Card key={index} className="hover-elevate">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            {language === "ar" ? feature.titleAr : language === "fr" ? feature.titleFr : feature.titleEn}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {language === "ar" ? feature.descriptionAr : language === "fr" ? feature.descriptionFr : feature.descriptionEn}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <p className="text-sm text-center">
                    {language === "ar" 
                      ? "💡 نصيحة: استخدم نفس حساب Google في كل مرة للحفاظ على تفضيلاتك" 
                      : language === "fr"
                      ? "💡 Astuce : Utilisez le même compte Google à chaque fois pour conserver vos préférences"
                      : "💡 Tip: Use the same Google account each time to keep your preferences"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
