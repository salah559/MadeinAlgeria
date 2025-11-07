import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Chrome } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمتا المرور غير متطابقتين',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'خطأ',
        description: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password);

    if (error) {
      toast({
        title: 'خطأ في التسجيل',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم التسجيل بنجاح',
        description: 'تم إنشاء حسابك بنجاح. يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.',
      });
      setLocation('/login');
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();

    if (error) {
      toast({
        title: 'خطأ في التسجيل',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">إنشاء حساب جديد</CardTitle>
          <CardDescription className="text-center">
            سجل الآن للوصول إلى دليل المصانع الجزائري
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  data-testid="input-signup-email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pr-10"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  data-testid="input-signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                  minLength={6}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  data-testid="input-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                  minLength={6}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              data-testid="button-signup-email"
            >
              {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">أو</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignUp}
            disabled={loading}
            data-testid="button-signup-google"
          >
            <Chrome className="ml-2 h-4 w-4" />
            التسجيل بواسطة Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            لديك حساب بالفعل؟{' '}
            <button
              onClick={() => setLocation('/login')}
              className="text-primary hover:underline font-medium"
              data-testid="link-login"
            >
              سجل الدخول
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
