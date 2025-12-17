import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldCheck, Zap, Mail, Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { user, isLoading, signInWithEmail } = useAuth();
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى إدخال البريد الإلكتروني وكلمة المرور" : "Please enter email and password",
      });
      return;
    }

    setIsSigningIn(true);
    try {
      await signInWithEmail(email, password);
      toast({
        title: language === "ar" ? "تم تسجيل الدخول بنجاح" : "Login successful",
        description: language === "ar" ? "جاري تحويلك..." : "Redirecting...",
      });
      setTimeout(() => {
        setLocation("/");
      }, 1000);
    } catch (error: any) {
      console.error("Error during email login:", error);
      let errorMessage = language === "ar" ? "حدث خطأ غير معروف" : "An unknown error occurred";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = language === "ar" ? "لا يوجد حساب بهذا البريد الإلكتروني" : "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = language === "ar" ? "كلمة المرور غير صحيحة" : "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = language === "ar" ? "البريد الإلكتروني غير صالح" : "Invalid email address";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = language === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid credentials";
      }
      
      toast({
        variant: "destructive",
        title: language === "ar" ? "فشل تسجيل الدخول" : "Login failed",
        description: errorMessage,
      });
      setIsSigningIn(false);
    }
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
      descriptionAr: "نظام مصادقة آمن وموثوق",
      descriptionEn: "Secure and trusted authentication system",
      descriptionFr: "Système d'authentification sûr et fiable",
    },
    {
      icon: Zap,
      titleAr: "سريع وسهل",
      titleEn: "Fast & Easy",
      titleFr: "Rapide et Facile",
      descriptionAr: "تسجيل دخول سهل وسريع",
      descriptionEn: "Quick and easy login",
      descriptionFr: "Connexion rapide et facile",
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
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">
                    {language === "ar" ? "مرحباً بك" : language === "fr" ? "Bienvenue" : "Welcome Back"}
                  </CardTitle>
                  <CardDescription>
                    {language === "ar"
                      ? "سجل الدخول باستخدام بريدك الإلكتروني"
                      : language === "fr"
                      ? "Connectez-vous avec votre email"
                      : "Sign in with your email"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {language === "ar" ? "البريد الإلكتروني" : language === "fr" ? "Email" : "Email"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSigningIn}
                        data-testid="input-email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        {language === "ar" ? "كلمة المرور" : language === "fr" ? "Mot de passe" : "Password"}
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter your password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isSigningIn}
                          data-testid="input-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSigningIn}
                      data-testid="button-login"
                    >
                      {isSigningIn ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {language === "ar" ? "جاري تسجيل الدخول..." : language === "fr" ? "Connexion..." : "Signing in..."}
                        </>
                      ) : (
                        language === "ar" ? "تسجيل الدخول" : language === "fr" ? "Se connecter" : "Sign In"
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          {language === "ar" ? "أو" : language === "fr" ? "Ou" : "Or"}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {language === "ar" ? "ليس لديك حساب؟" : language === "fr" ? "Pas de compte ?" : "Don't have an account?"}{" "}
                      <Link href="/register" className="text-primary hover:underline font-medium" data-testid="link-register">
                        {language === "ar" ? "إنشاء حساب جديد" : language === "fr" ? "Créer un compte" : "Create Account"}
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
