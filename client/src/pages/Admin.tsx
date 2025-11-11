
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Search,
  Lock,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  BarChart3,
  TrendingUp,
  Users,
  Package,
  AlertCircle,
  Calendar,
  Globe,
  Image as ImageIcon,
  FileText,
  Settings,
  RefreshCw,
} from "lucide-react";
import { wilayas, categories } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useImageUpload } from "@/hooks/useImageUpload";
import { SiGoogle } from "react-icons/si";
import type { Factory } from "@shared/schema";
import { SEO } from "@/components/SEO";

type FactoryFormData = {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  wilaya: string;
  category: string;
  products: string[];
  productsAr: string[];
  phone: string;
  email: string;
  address: string;
  addressAr: string;
  logoUrl?: string;
  imageUrl?: string;
  latitude?: string;
  longitude?: string;
  verified?: boolean;
};

type FilterOptions = {
  wilaya: string;
  category: string;
  verified: string;
};

type SortOption = "name" | "date" | "rating" | "views";

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [filters, setFilters] = useState<FilterOptions>({
    wilaya: "all",
    category: "all",
    verified: "all",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const { user, isAdmin, isLoading } = useAuth();

  const [formData, setFormData] = useState<FactoryFormData>({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    wilaya: "",
    category: "",
    products: [""],
    productsAr: [""],
    phone: "",
    email: "",
    address: "",
    addressAr: "",
    logoUrl: "",
    imageUrl: "",
    latitude: "",
    longitude: "",
    verified: false,
  });

  const { data: factories = [], isLoading: isLoadingFactories } = useQuery<Factory[]>({
    queryKey: ["/api/factories"],
  });

  // إحصائيات متقدمة
  const stats = useMemo(() => {
    const total = factories.length;
    const verified = factories.filter(f => f.verified).length;
    const pending = total - verified;
    const totalViews = factories.reduce((sum, f) => sum + (f.viewsCount || 0), 0);
    const totalReviews = factories.reduce((sum, f) => sum + (f.reviewsCount || 0), 0);
    const avgRating = factories.length > 0
      ? factories.reduce((sum, f) => sum + (f.rating || 0), 0) / factories.length
      : 0;

    const wilayaDistribution = factories.reduce((acc, f) => {
      acc[f.wilaya] = (acc[f.wilaya] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryDistribution = factories.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      verified,
      pending,
      totalViews,
      totalReviews,
      avgRating: avgRating.toFixed(1),
      wilayaDistribution,
      categoryDistribution,
      topWilayas: Object.entries(wilayaDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
      topCategories: Object.entries(categoryDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
    };
  }, [factories]);

  // فلترة وترتيب المصانع
  const filteredAndSortedFactories = useMemo(() => {
    let filtered = factories.filter(factory => {
      const matchesSearch =
        factory.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        factory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        factory.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesWilaya = filters.wilaya === "all" || factory.wilaya === filters.wilaya;
      const matchesCategory = filters.category === "all" || factory.category === filters.category;
      const matchesVerified =
        filters.verified === "all" ||
        (filters.verified === "verified" && factory.verified) ||
        (filters.verified === "pending" && !factory.verified);

      return matchesSearch && matchesWilaya && matchesCategory && matchesVerified;
    });

    // الترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.nameAr.localeCompare(b.nameAr, "ar");
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "views":
          return (b.viewsCount || 0) - (a.viewsCount || 0);
        case "date":
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    return filtered;
  }, [factories, searchQuery, filters, sortBy]);

  const createMutation = useMutation({
    mutationFn: async (data: FactoryFormData) => {
      const res = await apiRequest("POST", "/api/factories", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/factories"] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "✅ تم بنجاح",
        description: "تم إضافة المصنع بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ خطأ",
        description: error.message || "فشل في إضافة المصنع",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FactoryFormData> }) => {
      const res = await apiRequest("PATCH", `/api/factories/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/factories"] });
      setIsEditDialogOpen(false);
      setSelectedFactory(null);
      resetForm();
      toast({
        title: "✅ تم بنجاح",
        description: "تم تحديث المصنع بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ خطأ",
        description: error.message || "فشل في تحديث المصنع",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/factories/${id}`);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/factories"] });
      setIsDeleteDialogOpen(false);
      setSelectedFactory(null);
      toast({
        title: "✅ تم بنجاح",
        description: "تم حذف المصنع بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ خطأ",
        description: error.message || "فشل في حذف المصنع",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      wilaya: "",
      category: "",
      products: [""],
      productsAr: [""],
      phone: "",
      email: "",
      address: "",
      addressAr: "",
      logoUrl: "",
      imageUrl: "",
      latitude: "",
      longitude: "",
      verified: false,
    });
  };

  const handleEdit = (factory: Factory) => {
    setSelectedFactory(factory);
    setFormData({
      name: factory.name,
      nameAr: factory.nameAr,
      description: factory.description,
      descriptionAr: factory.descriptionAr,
      wilaya: factory.wilaya,
      category: factory.category,
      products: factory.products,
      productsAr: factory.productsAr,
      phone: factory.phone,
      email: factory.email,
      address: factory.address,
      addressAr: factory.addressAr,
      logoUrl: factory.logoUrl || "",
      imageUrl: factory.imageUrl || "",
      latitude: factory.latitude || "",
      longitude: factory.longitude || "",
      verified: factory.verified || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (factory: Factory) => {
    setSelectedFactory(factory);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      products: formData.products.filter(p => p.trim() !== ""),
      productsAr: formData.productsAr.filter(p => p.trim() !== ""),
      logoUrl: formData.logoUrl || undefined,
      imageUrl: formData.imageUrl || undefined,
      latitude: formData.latitude || undefined,
      longitude: formData.longitude || undefined,
    };

    if (selectedFactory) {
      updateMutation.mutate({ id: selectedFactory.id, data: cleanedData });
    } else {
      createMutation.mutate(cleanedData);
    }
  };

  const addProductField = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, ""],
      productsAr: [...prev.productsAr, ""],
    }));
  };

  const removeProductField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
      productsAr: prev.productsAr.filter((_, i) => i !== index),
    }));
  };

  const updateProductField = (index: number, value: string, isArabic: boolean) => {
    setFormData(prev => ({
      ...prev,
      [isArabic ? "productsAr" : "products"]: prev[isArabic ? "productsAr" : "products"].map((p, i) =>
        i === index ? value : p
      ),
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file, formData.name || 'factory');
      if (url) {
        setFormData({ ...formData, imageUrl: url });
        toast({
          title: "✅ نجح",
          description: "تم رفع الصورة بنجاح",
        });
      }
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file, `${formData.name}_logo` || 'factory_logo');
      if (url) {
        setFormData({ ...formData, logoUrl: url });
        toast({
          title: "✅ نجح",
          description: "تم رفع الشعار بنجاح",
        });
      }
    }
  };

  const exportToCSV = () => {
    const csvData = filteredAndSortedFactories.map(f => ({
      الاسم: f.nameAr,
      الولاية: f.wilaya,
      القطاع: f.category,
      الهاتف: f.phone,
      البريد: f.email,
      موثق: f.verified ? "نعم" : "لا",
    }));

    const headers = Object.keys(csvData[0] || {}).join(",");
    const rows = csvData.map(row => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `factories_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "✅ تم التصدير",
      description: "تم تصدير البيانات بنجاح",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 p-8 rounded-xl bg-card/50 backdrop-blur-sm shadow-xl border border-border/50">
            <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        <SEO title="تسجيل الدخول - لوحة التحكم" />
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl border-2 hover:shadow-primary/20 transition-all duration-300">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-4 ring-primary/10 shadow-lg">
                <Lock className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent">
                  تسجيل الدخول مطلوب
                </CardTitle>
                <CardDescription className="text-base">
                  يجب تسجيل الدخول للوصول إلى لوحة التحكم
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-4 pb-8">
              <Button
                variant="default"
                size="lg"
                className="gap-3 w-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6"
                onClick={() => window.location.href = "/api/auth/google"}
                data-testid="button-admin-login"
              >
                <SiGoogle className="h-6 w-6" />
                تسجيل الدخول بواسطة Google
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-destructive/5">
        <SEO title="الوصول مرفوض" />
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl border-2 border-destructive/20">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="mx-auto w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center ring-4 ring-destructive/20 shadow-lg">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-destructive">الوصول مرفوض</CardTitle>
                <CardDescription className="text-base">
                  عذراً، ليس لديك صلاحية الوصول إلى لوحة التحكم
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-6 pb-8">
              <div className="p-5 bg-muted rounded-xl border border-border shadow-inner">
                <p className="text-sm text-muted-foreground">
                  مسجل الدخول: <span className="font-bold text-foreground text-base">{user.email}</span>
                </p>
              </div>
              <Button variant="outline" size="lg" onClick={() => window.location.href = "/"} className="w-full">
                العودة للرئيسية
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const FactoryFormDialog = ({ isOpen, onClose, title }: { isOpen: boolean; onClose: () => void; title: string }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2">
            أدخل معلومات المصنع بالتفصيل. الحقول المميزة بـ * إلزامية
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/50 rounded-lg">
              <TabsTrigger value="basic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">المعلومات الأساسية</TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">التواصل</TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">الوسائط</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">الإعدادات</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-5 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="nameAr" className="text-sm font-semibold">الاسم بالعربية *</Label>
                  <Input
                    id="nameAr"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="اسم المصنع"
                    className="h-11 border-2 focus:border-primary transition-colors"
                    data-testid="input-factory-name-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">الاسم بالإنجليزية *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Factory Name"
                    className="h-11 border-2 focus:border-primary transition-colors"
                    data-testid="input-factory-name-en"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="wilaya" className="text-sm font-semibold">الولاية *</Label>
                  <Select
                    required
                    value={formData.wilaya}
                    onValueChange={(value) => setFormData({ ...formData, wilaya: value })}
                  >
                    <SelectTrigger id="wilaya" className="h-11 border-2" data-testid="select-factory-wilaya">
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
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold">القطاع *</Label>
                  <Select
                    required
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category" className="h-11 border-2" data-testid="select-factory-category">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr" className="text-sm font-semibold">الوصف بالعربية *</Label>
                  <Textarea
                    id="descriptionAr"
                    required
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    placeholder="وصف المصنع ونشاطه..."
                    rows={5}
                    className="border-2 focus:border-primary transition-colors resize-none"
                    data-testid="textarea-factory-description-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">الوصف بالإنجليزية *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Factory description..."
                    rows={5}
                    className="border-2 focus:border-primary transition-colors resize-none"
                    data-testid="textarea-factory-description-en"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold">المنتجات *</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addProductField} className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة منتج
                  </Button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto p-1">
                  {formData.productsAr.map((_, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg border">
                      <Input
                        value={formData.productsAr[index]}
                        onChange={(e) => updateProductField(index, e.target.value, true)}
                        placeholder="المنتج بالعربية"
                        className="border-2"
                        data-testid={`input-product-ar-${index}`}
                      />
                      <div className="flex gap-2">
                        <Input
                          value={formData.products[index]}
                          onChange={(e) => updateProductField(index, e.target.value, false)}
                          placeholder="Product in English"
                          className="flex-1 border-2"
                          data-testid={`input-product-en-${index}`}
                        />
                        {formData.products.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeProductField(index)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-5 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold">
                    <Phone className="w-4 h-4 text-primary" />
                    الهاتف *
                  </Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+213 123 456 789"
                    className="h-11 border-2 focus:border-primary transition-colors"
                    data-testid="input-factory-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold">
                    <Mail className="w-4 h-4 text-primary" />
                    البريد الإلكتروني *
                  </Label>
                  <Input
                    id="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@factory.dz"
                    className="h-11 border-2 focus:border-primary transition-colors"
                    data-testid="input-factory-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="addressAr" className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="w-4 h-4 text-primary" />
                    العنوان بالعربية *
                  </Label>
                  <Input
                    id="addressAr"
                    required
                    value={formData.addressAr}
                    onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
                    placeholder="العنوان الكامل"
                    className="h-11 border-2 focus:border-primary transition-colors"
                    data-testid="input-factory-address-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="w-4 h-4 text-primary" />
                    العنوان بالإنجليزية *
                  </Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address"
                    className="h-11 border-2 focus:border-primary transition-colors"
                    data-testid="input-factory-address-en"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-sm font-semibold">خط العرض (Latitude)</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="36.7538"
                    type="number"
                    step="any"
                    className="h-11 border-2 focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-sm font-semibold">خط الطول (Longitude)</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="3.0588"
                    type="number"
                    step="any"
                    className="h-11 border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-5 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="factoryImage" className="flex items-center gap-2 text-sm font-semibold">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    صورة المصنع
                  </Label>
                  <div className="border-2 border-dashed rounded-xl p-8 text-center space-y-4 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                    <Input
                      id="factoryImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      data-testid="input-factory-image"
                    />
                    <label htmlFor="factoryImage" className="cursor-pointer block">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt="Factory"
                          className="w-full h-48 object-cover rounded-lg mb-3 shadow-md"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground py-8">
                          <div className="p-4 rounded-full bg-primary/10">
                            <Upload className="w-10 h-10 text-primary" />
                          </div>
                          <p className="text-sm font-medium">انقر لرفع صورة المصنع</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG حتى 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="factoryLogo" className="flex items-center gap-2 text-sm font-semibold">
                    <Building2 className="w-4 h-4 text-primary" />
                    شعار المصنع
                  </Label>
                  <div className="border-2 border-dashed rounded-xl p-8 text-center space-y-4 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                    <Input
                      id="factoryLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      data-testid="input-factory-logo"
                    />
                    <label htmlFor="factoryLogo" className="cursor-pointer block">
                      {formData.logoUrl ? (
                        <img
                          src={formData.logoUrl}
                          alt="Logo"
                          className="w-full h-48 object-contain rounded-lg mb-3 shadow-md"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground py-8">
                          <div className="p-4 rounded-full bg-primary/10">
                            <Upload className="w-10 h-10 text-primary" />
                          </div>
                          <p className="text-sm font-medium">انقر لرفع شعار المصنع</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG حتى 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-5 mt-6">
              <Card className="border-2">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    إعدادات المصنع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="flex items-center justify-between p-5 border-2 rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="space-y-1.5">
                      <Label htmlFor="verified" className="flex items-center gap-2 font-semibold text-base">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        مصنع موثق
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        تفعيل هذا الخيار يظهر علامة التوثيق على بطاقة المصنع
                      </p>
                    </div>
                    <Switch
                      id="verified"
                      checked={formData.verified}
                      onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
                      className="scale-110"
                    />
                  </div>

                  <div className="p-5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-900 space-y-2.5">
                    <h4 className="font-semibold flex items-center gap-2 text-blue-900 dark:text-blue-100">
                      <AlertCircle className="w-5 h-5" />
                      ملاحظة هامة
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                      تأكد من صحة جميع المعلومات قبل الحفظ. المعلومات الخاطئة قد تؤثر على مصداقية المنصة.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                onClose();
                resetForm();
                setSelectedFactory(null);
              }}
              data-testid="button-cancel"
              className="px-8"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={createMutation.isPending || updateMutation.isPending || imageUploading}
              data-testid="button-save-factory"
              className="px-8 shadow-lg"
            >
              {(createMutation.isPending || updateMutation.isPending || imageUploading) && (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              )}
              {imageUploading
                ? "جاري الرفع..."
                : selectedFactory
                ? "تحديث المصنع"
                : "إضافة المصنع"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <SEO title="لوحة الإدارة - دليل المصانع الجزائري" />
      <Header />

      {/* Header Banner */}
      <div className="bg-gradient-to-l from-primary via-primary to-primary/90 py-10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground flex items-center gap-4 justify-center md:justify-start">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Building2 className="w-10 h-10" />
                </div>
                لوحة الإدارة المتقدمة
              </h1>
              <p className="text-primary-foreground/95 flex items-center gap-2 text-lg justify-center md:justify-start">
                <Users className="w-5 h-5" />
                مرحباً، <span className="font-bold">{user.email}</span>
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              data-testid="button-add-factory"
              className="gap-3 shadow-2xl hover:shadow-primary/20 text-lg px-8 py-6 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-6 h-6" />
              إضافة مصنع جديد
            </Button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-10 flex-1 space-y-8">
        {/* إحصائيات متقدمة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-elevate border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3 relative">
              <CardTitle className="text-sm font-semibold text-muted-foreground">إجمالي المصانع</CardTitle>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-primary mb-2">{stats.total}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                مصنع مسجل في النظام
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate border-2 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3 relative">
              <CardTitle className="text-sm font-semibold text-muted-foreground">مصانع موثقة</CardTitle>
              <div className="p-3 bg-green-100 dark:bg-green-950 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.verified}</div>
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-green-600">{((stats.verified / stats.total) * 100).toFixed(0)}%</span> من الإجمالي
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate border-2 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3 relative">
              <CardTitle className="text-sm font-semibold text-muted-foreground">قيد المراجعة</CardTitle>
              <div className="p-3 bg-orange-100 dark:bg-orange-950 rounded-xl">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-orange-500 mb-2">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                تحتاج إلى مراجعة وتوثيق
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate border-2 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3 relative">
              <CardTitle className="text-sm font-semibold text-muted-foreground">إجمالي الزيارات</CardTitle>
              <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                متوسط التقييم: <span className="font-bold text-yellow-600">{stats.avgRating}</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs الرئيسية */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 p-1.5 bg-muted rounded-xl h-auto">
            <TabsTrigger value="list" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">قائمة المصانع</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">الإحصائيات</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">قيد المراجعة</span>
              {stats.pending > 0 && (
                <Badge variant="destructive" className="ml-1 px-2 py-0.5 text-xs">
                  {stats.pending}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="verified" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">المصانع الموثقة</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">الإعدادات</span>
            </TabsTrigger>
          </TabsList>

          {/* قائمة المصانع */}
          <TabsContent value="list" className="space-y-6">
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-l from-muted/50 to-muted/30 border-b-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      جميع المصانع ({filteredAndSortedFactories.length})
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                      إدارة شاملة لجميع المصانع المسجلة
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="gap-2 border-2 hover:bg-primary/10"
                    >
                      <Filter className="w-4 h-4" />
                      {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportToCSV}
                      className="gap-2 border-2 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      <Download className="w-4 h-4" />
                      تصدير CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/factories"] })}
                      className="gap-2 border-2 hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                      <RefreshCw className="w-4 h-4" />
                      تحديث
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                {/* البحث والفلاتر */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="ابحث عن مصنع بالاسم، الولاية، أو القطاع..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-12 h-12 border-2 text-base focus:border-primary transition-colors"
                      data-testid="input-admin-search"
                    />
                  </div>

                  {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border-2 shadow-inner">
                      <Select
                        value={filters.wilaya}
                        onValueChange={(value) => setFilters({ ...filters, wilaya: value })}
                      >
                        <SelectTrigger className="h-11 border-2 bg-background">
                          <SelectValue placeholder="كل الولايات" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">كل الولايات</SelectItem>
                          {wilayas.map((wilaya) => (
                            <SelectItem key={wilaya} value={wilaya}>
                              {wilaya}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={filters.category}
                        onValueChange={(value) => setFilters({ ...filters, category: value })}
                      >
                        <SelectTrigger className="h-11 border-2 bg-background">
                          <SelectValue placeholder="كل القطاعات" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">كل القطاعات</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.nameAr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={filters.verified}
                        onValueChange={(value) => setFilters({ ...filters, verified: value })}
                      >
                        <SelectTrigger className="h-11 border-2 bg-background">
                          <SelectValue placeholder="حالة التوثيق" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">الكل</SelectItem>
                          <SelectItem value="verified">موثق</SelectItem>
                          <SelectItem value="pending">قيد المراجعة</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="h-11 border-2 bg-background">
                          <SelectValue placeholder="ترتيب حسب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">الاسم</SelectItem>
                          <SelectItem value="date">التاريخ</SelectItem>
                          <SelectItem value="rating">التقييم</SelectItem>
                          <SelectItem value="views">الزيارات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* الجدول */}
                {isLoadingFactories ? (
                  <div className="text-center py-16">
                    <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-lg text-muted-foreground">جاري تحميل المصانع...</p>
                  </div>
                ) : filteredAndSortedFactories.length === 0 ? (
                  <div className="text-center py-16">
                    <Building2 className="w-20 h-20 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-xl font-medium mb-2">لا توجد نتائج</p>
                    <p className="text-sm text-muted-foreground">جرب تعديل معايير البحث أو الفلتر</p>
                  </div>
                ) : (
                  <div className="border-2 rounded-xl overflow-hidden shadow-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="text-right font-bold">المصنع</TableHead>
                          <TableHead className="text-right font-bold">الولاية</TableHead>
                          <TableHead className="text-right font-bold">القطاع</TableHead>
                          <TableHead className="text-center font-bold">الحالة</TableHead>
                          <TableHead className="text-center font-bold">التقييم</TableHead>
                          <TableHead className="text-center font-bold">الزيارات</TableHead>
                          <TableHead className="text-center font-bold">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedFactories.map((factory) => (
                          <TableRow key={factory.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                {factory.logoUrl && (
                                  <img
                                    src={factory.logoUrl}
                                    alt={factory.nameAr}
                                    className="w-12 h-12 object-contain rounded-lg border-2 p-1"
                                  />
                                )}
                                <div>
                                  <p className="font-bold text-base">{factory.nameAr}</p>
                                  <p className="text-xs text-muted-foreground">{factory.name}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{factory.wilaya}</TableCell>
                            <TableCell className="font-medium">
                              {categories.find(c => c.id === factory.category)?.nameAr}
                            </TableCell>
                            <TableCell className="text-center">
                              {factory.verified ? (
                                <Badge variant="default" className="gap-1.5 px-3 py-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  موثق
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  قيد المراجعة
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold">{factory.rating?.toFixed(1) || "0.0"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <Eye className="w-4 h-4 text-blue-600" />
                                <span className="font-bold">{factory.viewsCount || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-1.5">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleEdit(factory)}
                                  data-testid={`button-edit-${factory.id}`}
                                  title="تعديل"
                                  className="hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-600"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => window.open(`/factory/${factory.id}`, '_blank')}
                                  title="عرض"
                                  className="hover:bg-green-100 dark:hover:bg-green-950 hover:text-green-600"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDelete(factory)}
                                  data-testid={`button-delete-${factory.id}`}
                                  title="حذف"
                                  className="hover:bg-red-100 dark:hover:bg-red-950 hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* الإحصائيات */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 shadow-xl">
                <CardHeader className="bg-gradient-to-l from-muted/50 to-muted/30 border-b-2">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    التوزيع الجغرافي
                  </CardTitle>
                  <CardDescription className="text-base">أعلى 5 ولايات من حيث عدد المصانع</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {stats.topWilayas.map(([wilaya, count], index) => (
                      <div key={wilaya} className="flex items-center justify-between p-4 bg-gradient-to-l from-muted/40 to-muted/20 rounded-xl border-2 hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-base">{wilaya}</p>
                            <p className="text-xs text-muted-foreground">{count} مصنع</p>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-primary">{count}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-xl">
                <CardHeader className="bg-gradient-to-l from-muted/50 to-muted/30 border-b-2">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    التوزيع القطاعي
                  </CardTitle>
                  <CardDescription className="text-base">أعلى 5 قطاعات من حيث عدد المصانع</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {stats.topCategories.map(([category, count], index) => {
                      const cat = categories.find(c => c.id === category);
                      return (
                        <div key={category} className="flex items-center justify-between p-4 bg-gradient-to-l from-muted/40 to-muted/20 rounded-xl border-2 hover:border-primary/50 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-bold text-base">{cat?.nameAr || category}</p>
                              <p className="text-xs text-muted-foreground">{count} مصنع</p>
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-primary">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* قيد المراجعة */}
          <TabsContent value="pending" className="space-y-6">
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-l from-orange-50 dark:from-orange-950/20 to-orange-50/50 dark:to-orange-950/10 border-b-2">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  المصانع قيد المراجعة
                </CardTitle>
                <CardDescription className="text-base">
                  المصانع التي تحتاج إلى مراجعة وتوثيق (<span className="font-bold text-orange-600">{stats.pending}</span>)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {factories.filter(f => !f.verified).length === 0 ? (
                  <div className="text-center py-16">
                    <CheckCircle2 className="w-20 h-20 mx-auto mb-4 text-green-600" />
                    <p className="text-xl font-bold text-green-600">رائع! لا توجد مصانع قيد المراجعة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {factories
                      .filter(f => !f.verified)
                      .map((factory) => (
                        <div key={factory.id} className="flex items-center justify-between p-5 border-2 rounded-xl hover:bg-muted/30 hover:border-primary/50 transition-all">
                          <div className="flex items-center gap-4">
                            {factory.logoUrl && (
                              <img
                                src={factory.logoUrl}
                                alt={factory.nameAr}
                                className="w-14 h-14 object-contain rounded-lg border-2 p-1.5"
                              />
                            )}
                            <div>
                              <p className="font-bold text-base">{factory.nameAr}</p>
                              <p className="text-sm text-muted-foreground">
                                {factory.wilaya} • {categories.find(c => c.id === factory.category)?.nameAr}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleEdit(factory)}
                              className="gap-2 shadow-lg"
                            >
                              <Edit className="w-4 h-4" />
                              مراجعة وتوثيق
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* المصانع الموثقة */}
          <TabsContent value="verified" className="space-y-6">
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-l from-green-50 dark:from-green-950/20 to-green-50/50 dark:to-green-950/10 border-b-2">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  المصانع الموثقة
                </CardTitle>
                <CardDescription className="text-base">
                  المصانع المعتمدة والموثقة (<span className="font-bold text-green-600">{stats.verified}</span>)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {factories
                    .filter(f => f.verified)
                    .map((factory) => (
                      <div key={factory.id} className="flex items-center justify-between p-5 border-2 rounded-xl hover:bg-muted/30 hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-4">
                          {factory.logoUrl && (
                            <img
                              src={factory.logoUrl}
                              alt={factory.nameAr}
                              className="w-14 h-14 object-contain rounded-lg border-2 p-1.5"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-base">{factory.nameAr}</p>
                              <Badge variant="default" className="text-xs px-2 py-0.5">
                                <CheckCircle2 className="w-3 h-3 ml-1" />
                                موثق
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {factory.wilaya} • {categories.find(c => c.id === factory.category)?.nameAr}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-medium">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{factory.rating?.toFixed(1) || "0.0"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="font-bold">{factory.viewsCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الإعدادات */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-l from-muted/50 to-muted/30 border-b-2">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  إعدادات النظام
                </CardTitle>
                <CardDescription className="text-base">إعدادات عامة للوحة التحكم</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="space-y-5">
                  <h3 className="font-bold text-lg">معلومات الحساب</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-5 bg-gradient-to-l from-muted/40 to-muted/20 rounded-xl border-2">
                      <span className="text-sm font-bold">البريد الإلكتروني</span>
                      <span className="text-sm text-muted-foreground font-medium">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between p-5 bg-gradient-to-l from-muted/40 to-muted/20 rounded-xl border-2">
                      <span className="text-sm font-bold">صلاحيات الإدارة</span>
                      <Badge variant="default" className="px-3 py-1">مدير</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="font-bold text-lg">أدوات التصدير</h3>
                  <div className="grid gap-3">
                    <Button variant="outline" onClick={exportToCSV} className="justify-start gap-3 h-12 border-2 hover:bg-green-50 dark:hover:bg-green-950">
                      <Download className="w-5 h-5" />
                      <span className="font-medium">تصدير جميع المصانع (CSV)</span>
                    </Button>
                    <Button variant="outline" className="justify-start gap-3 h-12 border-2" disabled>
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">تصدير تقرير PDF (قريباً)</span>
                    </Button>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-2 border-destructive/30 rounded-xl space-y-4">
                  <h3 className="font-bold text-lg text-destructive flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    منطقة خطرة
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    العمليات هنا لا يمكن التراجع عنها. تأكد من فهمك للعواقب.
                  </p>
                  <Button variant="destructive" size="sm" disabled className="shadow-lg">
                    حذف جميع البيانات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Dialogs */}
      <FactoryFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          resetForm();
        }}
        title="إضافة مصنع جديد"
      />

      <FactoryFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedFactory(null);
          resetForm();
        }}
        title="تعديل المصنع"
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-2 border-destructive/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              هل أنت متأكد تماماً؟
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-base pt-2">
              <p>
                سيتم حذف المصنع <span className="font-bold text-foreground">"{selectedFactory?.nameAr}"</span> نهائياً من النظام.
              </p>
              <p className="text-destructive font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                هذا الإجراء لا يمكن التراجع عنه!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="border-2">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedFactory && deleteMutation.mutate(selectedFactory.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2 shadow-lg"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  نعم، احذف نهائياً
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
