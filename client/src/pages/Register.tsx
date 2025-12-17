import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Eye, EyeOff, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const { user, isLoading, signUpWithEmail } = useAuth();
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const passwordRequirements = [
    { 
      met: password.length >= 6, 
      textAr: "6 أحرف على الأقل",
      textEn: "At least 6 characters",
      textFr: "Au moins 6 caractères"
    },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters",
      });
      return;
    }

    setIsRegistering(true);
    try {
      await signUpWithEmail(email, password, name);
      toast({
        title: language === "ar" ? "تم إنشاء الحساب بنجاح" : "Account created successfully",
        description: language === "ar" ? "جاري تحويلك..." : "Redirecting...",
      });
      setTimeout(() => {
        setLocation("/");
      }, 1000);
    } catch (error: any) {
      console.error("Error during registration:", error);
      let errorMessage = language === "ar" ? "حدث خطأ غير معروف" : "An unknown error occurred";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = language === "ar" ? "البريد الإلكتروني مستخدم بالفعل" : "Email is already in use";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = language === "ar" ? "البريد الإلكتروني غير صالح" : "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = language === "ar" ? "كلمة المرور ضعيفة جداً" : "Password is too weak";
      }
      
      toast({
        variant: "destructive",
        title: language === "ar" ? "فشل إنشاء الحساب" : "Registration failed",
        description: errorMessage,
      });
      setIsRegistering(false);
    }
  };

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
        title={language === "ar" ? "إنشاء حساب" : language === "fr" ? "Créer un compte" : "Create Account"}
        description={language === "ar" ? "أنشئ حساباً جديداً في دليل المصانع الجزائرية" : language === "fr" ? "Créez un nouveau compte sur l'annuaire des usines algériennes" : "Create a new account on Algeria Factory Directory"}
      />
      <Header />

      <div className="bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === "ar" ? "إنشاء حساب جديد" : language === "fr" ? "Créer un compte" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "انضم إلينا للوصول إلى جميع ميزات المنصة"
                : language === "fr"
                ? "Rejoignez-nous pour accéder à toutes les fonctionnalités"
                : "Join us to access all platform features"}
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {language === "ar" ? "حساب جديد" : language === "fr" ? "Nouveau compte" : "New Account"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "أدخل بياناتك لإنشاء حساب جديد"
                  : language === "fr"
                  ? "Entrez vos informations pour créer un compte"
                  : "Enter your details to create an account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {language === "ar" ? "الاسم (اختياري)" : language === "fr" ? "Nom (optionnel)" : "Name (optional)"}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={language === "ar" ? "أدخل اسمك" : "Enter your name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isRegistering}
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {language === "ar" ? "البريد الإلكتروني" : language === "fr" ? "Email" : "Email"} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isRegistering}
                    required
                    data-testid="input-email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {language === "ar" ? "كلمة المرور" : language === "fr" ? "Mot de passe" : "Password"} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isRegistering}
                      required
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
                  
                  {password && (
                    <div className="mt-2 space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <Check className={`h-3 w-3 ${req.met ? "text-green-500" : "text-muted-foreground"}`} />
                          <span className={req.met ? "text-green-500" : "text-muted-foreground"}>
                            {language === "ar" ? req.textAr : language === "fr" ? req.textFr : req.textEn}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {language === "ar" ? "تأكيد كلمة المرور" : language === "fr" ? "Confirmer le mot de passe" : "Confirm Password"} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={language === "ar" ? "أعد إدخال كلمة المرور" : "Re-enter your password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isRegistering}
                      required
                      data-testid="input-confirm-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute left-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      data-testid="button-toggle-confirm-password"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive">
                      {language === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isRegistering}
                  data-testid="button-register"
                >
                  {isRegistering ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {language === "ar" ? "جاري إنشاء الحساب..." : language === "fr" ? "Création..." : "Creating account..."}
                    </>
                  ) : (
                    language === "ar" ? "إنشاء الحساب" : language === "fr" ? "Créer le compte" : "Create Account"
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
                  {language === "ar" ? "لديك حساب بالفعل؟" : language === "fr" ? "Déjà un compte ?" : "Already have an account?"}{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium" data-testid="link-login">
                    {language === "ar" ? "تسجيل الدخول" : language === "fr" ? "Se connecter" : "Sign In"}
                  </Link>
                </p>

                <p className="text-xs text-muted-foreground">
                  {language === "ar"
                    ? "بإنشاء حساب، أنت توافق على شروط الخدمة وسياسة الخصوصية"
                    : language === "fr"
                    ? "En créant un compte, vous acceptez les conditions d'utilisation et la politique de confidentialité"
                    : "By creating an account, you agree to our Terms of Service and Privacy Policy"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
