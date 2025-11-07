import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building2, Plus, Edit, Trash2, Search, ShieldAlert } from "lucide-react";
import { wilayas, categories } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";

const ALLOWED_ADMIN_EMAILS = [
  "bouazzasalah120120@gmail.com",
  "madimoh44@gmail.com"
];

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.email && ALLOWED_ADMIN_EMAILS.includes(user.email);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <ShieldAlert className="w-16 h-16 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">غير مصرح بالدخول</h2>
                <p className="text-muted-foreground">
                  عذراً، هذه الصفحة مخصصة للمسؤولين فقط. ليس لديك صلاحية للوصول إلى لوحة التحكم.
                </p>
                <div className="pt-4">
                  <Link href="/">
                    <Button data-testid="button-back-home">
                      العودة إلى الصفحة الرئيسية
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // todo: remove mock functionality
  const mockFactories = [
    { id: "1", nameAr: "مصنع زيت الزيتون", wilaya: "تيزي وزو", category: "food" },
    { id: "2", nameAr: "مصنع النسيج", wilaya: "سطيف", category: "textile" },
    { id: "3", nameAr: "مصنع الأدوية", wilaya: "قسنطينة", category: "pharmaceutical" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            لوحة الإدارة
          </h1>
          <p className="text-primary-foreground/90">
            إدارة المصانع والمحتوى
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المصانع</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">500+</div>
              <p className="text-xs text-muted-foreground mt-1">مصنع مسجل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الولايات المغطاة</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground mt-1">ولاية جزائرية</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">القطاعات</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8+</div>
              <p className="text-xs text-muted-foreground mt-1">قطاع صناعي</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl">قائمة المصانع</CardTitle>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-factory">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مصنع جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>إضافة مصنع جديد</DialogTitle>
                    <DialogDescription>
                      أدخل معلومات المصنع بالتفصيل
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    console.log('Factory added');
                    setIsAddDialogOpen(false);
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">الاسم بالعربية</label>
                        <Input placeholder="اسم المصنع" data-testid="input-factory-name-ar" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">الاسم بالإنجليزية</label>
                        <Input placeholder="Factory Name" data-testid="input-factory-name-en" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">الولاية</label>
                        <Select>
                          <SelectTrigger data-testid="select-factory-wilaya">
                            <SelectValue placeholder="اختر الولاية" />
                          </SelectTrigger>
                          <SelectContent>
                            {wilayas.map((wilaya) => (
                              <SelectItem key={wilaya} value={wilaya}>
                                {wilaya}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">القطاع</label>
                        <Select>
                          <SelectTrigger data-testid="select-factory-category">
                            <SelectValue placeholder="اختر القطاع" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.nameAr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">الوصف</label>
                      <Textarea 
                        placeholder="وصف المصنع ونشاطه..." 
                        rows={4}
                        data-testid="textarea-factory-description"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">الهاتف</label>
                        <Input placeholder="+213 123 456 789" data-testid="input-factory-phone" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                        <Input type="email" placeholder="info@factory.dz" data-testid="input-factory-email" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">العنوان</label>
                      <Input placeholder="العنوان الكامل" data-testid="input-factory-address" />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                        data-testid="button-cancel"
                      >
                        إلغاء
                      </Button>
                      <Button type="submit" data-testid="button-save-factory">
                        حفظ المصنع
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن مصنع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                  data-testid="input-admin-search"
                />
              </div>
            </div>

            <div className="border rounded-md">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-right p-4 font-medium">الاسم</th>
                      <th className="text-right p-4 font-medium">الولاية</th>
                      <th className="text-right p-4 font-medium">القطاع</th>
                      <th className="text-center p-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFactories.map((factory) => (
                      <tr key={factory.id} className="border-b hover-elevate">
                        <td className="p-4 text-foreground">{factory.nameAr}</td>
                        <td className="p-4 text-muted-foreground">{factory.wilaya}</td>
                        <td className="p-4 text-muted-foreground">
                          {categories.find(c => c.id === factory.category)?.nameAr}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => console.log('Edit', factory.id)}
                              data-testid={`button-edit-${factory.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => console.log('Delete', factory.id)}
                              data-testid={`button-delete-${factory.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
