
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO title="تسجيل الدخول - لوحة التحكم" />
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">تسجيل الدخول مطلوب</CardTitle>
              <CardDescription>
                يجب تسجيل الدخول للوصول إلى لوحة التحكم
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button
                variant="default"
                size="lg"
                className="gap-2 w-full"
                onClick={() => window.location.href = "/api/auth/google"}
                data-testid="button-admin-login"
              >
                <SiGoogle className="h-5 w-5" />
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
      <div className="min-h-screen flex flex-col">
        <SEO title="الوصول مرفوض" />
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <CardTitle className="text-2xl">الوصول مرفوض</CardTitle>
              <CardDescription>
                عذراً، ليس لديك صلاحية الوصول إلى لوحة التحكم
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  مسجل الدخول: <span className="font-medium text-foreground">{user.email}</span>
                </p>
              </div>
              <Button variant="outline" onClick={() => window.location.href = "/"}>
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
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            أدخل معلومات المصنع بالتفصيل. الحقول المميزة بـ * إلزامية
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
              <TabsTrigger value="contact">التواصل</TabsTrigger>
              <TabsTrigger value="media">الوسائط</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameAr">الاسم بالعربية *</Label>
                  <Input
                    id="nameAr"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="اسم المصنع"
                    data-testid="input-factory-name-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم بالإنجليزية *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Factory Name"
                    data-testid="input-factory-name-en"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wilaya">الولاية *</Label>
                  <Select
                    required
                    value={formData.wilaya}
                    onValueChange={(value) => setFormData({ ...formData, wilaya: value })}
                  >
                    <SelectTrigger id="wilaya" data-testid="select-factory-wilaya">
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
                  <Label htmlFor="category">القطاع *</Label>
                  <Select
                    required
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category" data-testid="select-factory-category">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">الوصف بالعربية *</Label>
                  <Textarea
                    id="descriptionAr"
                    required
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    placeholder="وصف المصنع ونشاطه..."
                    rows={5}
                    data-testid="textarea-factory-description-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف بالإنجليزية *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Factory description..."
                    rows={5}
                    data-testid="textarea-factory-description-en"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>المنتجات *</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addProductField}>
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة منتج
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formData.productsAr.map((_, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        value={formData.productsAr[index]}
                        onChange={(e) => updateProductField(index, e.target.value, true)}
                        placeholder="المنتج بالعربية"
                        data-testid={`input-product-ar-${index}`}
                      />
                      <div className="flex gap-2">
                        <Input
                          value={formData.products[index]}
                          onChange={(e) => updateProductField(index, e.target.value, false)}
                          placeholder="Product in English"
                          className="flex-1"
                          data-testid={`input-product-en-${index}`}
                        />
                        {formData.products.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeProductField(index)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    الهاتف *
                  </Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+213 123 456 789"
                    data-testid="input-factory-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني *
                  </Label>
                  <Input
                    id="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@factory.dz"
                    data-testid="input-factory-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addressAr" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    العنوان بالعربية *
                  </Label>
                  <Input
                    id="addressAr"
                    required
                    value={formData.addressAr}
                    onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
                    placeholder="العنوان الكامل"
                    data-testid="input-factory-address-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    العنوان بالإنجليزية *
                  </Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address"
                    data-testid="input-factory-address-en"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">خط العرض (Latitude)</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="36.7538"
                    type="number"
                    step="any"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">خط الطول (Longitude)</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="3.0588"
                    type="number"
                    step="any"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="factoryImage" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    صورة المصنع
                  </Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-3 hover:border-primary transition-colors">
                    <Input
                      id="factoryImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      data-testid="input-factory-image"
                    />
                    <label htmlFor="factoryImage" className="cursor-pointer">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt="Factory"
                          className="w-full h-40 object-cover rounded-md mb-2"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Upload className="w-10 h-10" />
                          <p className="text-sm">انقر لرفع صورة المصنع</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="factoryLogo" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    شعار المصنع
                  </Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-3 hover:border-primary transition-colors">
                    <Input
                      id="factoryLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      data-testid="input-factory-logo"
                    />
                    <label htmlFor="factoryLogo" className="cursor-pointer">
                      {formData.logoUrl ? (
                        <img
                          src={formData.logoUrl}
                          alt="Logo"
                          className="w-full h-40 object-contain rounded-md mb-2"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Upload className="w-10 h-10" />
                          <p className="text-sm">انقر لرفع شعار المصنع</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    إعدادات المصنع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="verified" className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
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
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      ملاحظة هامة
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      تأكد من صحة جميع المعلومات قبل الحفظ. المعلومات الخاطئة قد تؤثر على مصداقية المنصة.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                resetForm();
                setSelectedFactory(null);
              }}
              data-testid="button-cancel"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending || imageUploading}
              data-testid="button-save-factory"
            >
              {(createMutation.isPending || updateMutation.isPending || imageUploading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
    <div className="min-h-screen flex flex-col bg-background">
      <SEO title="لوحة الإدارة - دليل المصانع الجزائري" />
      <Header />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/80 py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                لوحة الإدارة المتقدمة
              </h1>
              <p className="text-primary-foreground/90 flex items-center gap-2">
                <Users className="w-4 h-4" />
                مرحباً، {user.email}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              data-testid="button-add-factory"
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة مصنع جديد
            </Button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-8 flex-1 space-y-6">
        {/* إحصائيات متقدمة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المصانع</CardTitle>
              <Building2 className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                مصنع مسجل في النظام
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مصانع موثقة</CardTitle>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.verified}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((stats.verified / stats.total) * 100).toFixed(0)}% من الإجمالي
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">
                تحتاج إلى مراجعة وتوثيق
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الزيارات</CardTitle>
              <Eye className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                متوسط التقييم: {stats.avgRating}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs الرئيسية */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="list" className="gap-2">
              <Building2 className="w-4 h-4" />
              قائمة المصانع
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <AlertCircle className="w-4 h-4" />
              قيد المراجعة
              {stats.pending > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {stats.pending}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="verified" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              المصانع الموثقة
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* قائمة المصانع */}
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      جميع المصانع ({filteredAndSortedFactories.length})
                    </CardTitle>
                    <CardDescription className="mt-1">
                      إدارة شاملة لجميع المصانع المسجلة
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportToCSV}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      تصدير CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/factories"] })}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      تحديث
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* البحث والفلاتر */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث عن مصنع بالاسم، الولاية، أو القطاع..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                      data-testid="input-admin-search"
                    />
                  </div>

                  {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-muted rounded-lg">
                      <Select
                        value={filters.wilaya}
                        onValueChange={(value) => setFilters({ ...filters, wilaya: value })}
                      >
                        <SelectTrigger>
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
                        <SelectTrigger>
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
                        <SelectTrigger>
                          <SelectValue placeholder="حالة التوثيق" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">الكل</SelectItem>
                          <SelectItem value="verified">موثق</SelectItem>
                          <SelectItem value="pending">قيد المراجعة</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger>
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
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">جاري تحميل المصانع...</p>
                  </div>
                ) : filteredAndSortedFactories.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">لا توجد نتائج</p>
                    <p className="text-sm text-muted-foreground">جرب تعديل معايير البحث أو الفلتر</p>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">المصنع</TableHead>
                          <TableHead className="text-right">الولاية</TableHead>
                          <TableHead className="text-right">القطاع</TableHead>
                          <TableHead className="text-center">الحالة</TableHead>
                          <TableHead className="text-center">التقييم</TableHead>
                          <TableHead className="text-center">الزيارات</TableHead>
                          <TableHead className="text-center">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedFactories.map((factory) => (
                          <TableRow key={factory.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                {factory.logoUrl && (
                                  <img
                                    src={factory.logoUrl}
                                    alt={factory.nameAr}
                                    className="w-10 h-10 object-contain rounded"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{factory.nameAr}</p>
                                  <p className="text-xs text-muted-foreground">{factory.name}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{factory.wilaya}</TableCell>
                            <TableCell>
                              {categories.find(c => c.id === factory.category)?.nameAr}
                            </TableCell>
                            <TableCell className="text-center">
                              {factory.verified ? (
                                <Badge variant="default" className="gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  موثق
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  قيد المراجعة
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{factory.rating?.toFixed(1) || "0.0"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Eye className="w-4 h-4 text-muted-foreground" />
                                <span>{factory.viewsCount || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleEdit(factory)}
                                  data-testid={`button-edit-${factory.id}`}
                                  title="تعديل"
                                >
                                  <Edit className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => window.open(`/factory/${factory.id}`, '_blank')}
                                  title="عرض"
                                >
                                  <Eye className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDelete(factory)}
                                  data-testid={`button-delete-${factory.id}`}
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
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
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    التوزيع الجغرافي
                  </CardTitle>
                  <CardDescription>أعلى 5 ولايات من حيث عدد المصانع</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topWilayas.map(([wilaya, count], index) => (
                      <div key={wilaya} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{wilaya}</p>
                            <p className="text-xs text-muted-foreground">{count} مصنع</p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-primary">{count}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    التوزيع القطاعي
                  </CardTitle>
                  <CardDescription>أعلى 5 قطاعات من حيث عدد المصانع</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topCategories.map(([category, count], index) => {
                      const cat = categories.find(c => c.id === category);
                      return (
                        <div key={category} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{cat?.nameAr || category}</p>
                              <p className="text-xs text-muted-foreground">{count} مصنع</p>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-primary">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* قيد المراجعة */}
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  المصانع قيد المراجعة
                </CardTitle>
                <CardDescription>
                  المصانع التي تحتاج إلى مراجعة وتوثيق ({stats.pending})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {factories.filter(f => !f.verified).length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                    <p className="text-lg font-medium">رائع! لا توجد مصانع قيد المراجعة</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {factories
                      .filter(f => !f.verified)
                      .map((factory) => (
                        <div key={factory.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            {factory.logoUrl && (
                              <img
                                src={factory.logoUrl}
                                alt={factory.nameAr}
                                className="w-12 h-12 object-contain rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{factory.nameAr}</p>
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
                            >
                              <Edit className="w-4 h-4 ml-1" />
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
          <TabsContent value="verified" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  المصانع الموثقة
                </CardTitle>
                <CardDescription>
                  المصانع المعتمدة والموثقة ({stats.verified})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {factories
                    .filter(f => f.verified)
                    .map((factory) => (
                      <div key={factory.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          {factory.logoUrl && (
                            <img
                              src={factory.logoUrl}
                              alt={factory.nameAr}
                              className="w-12 h-12 object-contain rounded"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{factory.nameAr}</p>
                              <Badge variant="default" className="text-xs">
                                <CheckCircle2 className="w-3 h-3 ml-1" />
                                موثق
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {factory.wilaya} • {categories.find(c => c.id === factory.category)?.nameAr}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {factory.rating?.toFixed(1) || "0.0"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {factory.viewsCount || 0}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الإعدادات */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  إعدادات النظام
                </CardTitle>
                <CardDescription>إعدادات عامة للوحة التحكم</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">معلومات الحساب</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">البريد الإلكتروني</span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">صلاحيات الإدارة</span>
                      <Badge variant="default">مدير</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">أدوات التصدير</h3>
                  <div className="grid gap-2">
                    <Button variant="outline" onClick={exportToCSV} className="justify-start gap-2">
                      <Download className="w-4 h-4" />
                      تصدير جميع المصانع (CSV)
                    </Button>
                    <Button variant="outline" className="justify-start gap-2" disabled>
                      <FileText className="w-4 h-4" />
                      تصدير تقرير PDF (قريباً)
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-2">
                  <h3 className="font-medium text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    منطقة خطرة
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    العمليات هنا لا يمكن التراجع عنها. تأكد من فهمك للعواقب.
                  </p>
                  <Button variant="destructive" size="sm" disabled>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              هل أنت متأكد تماماً؟
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                سيتم حذف المصنع <span className="font-bold">"{selectedFactory?.nameAr}"</span> نهائياً من النظام.
              </p>
              <p className="text-destructive font-medium">
                ⚠️ هذا الإجراء لا يمكن التراجع عنه!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedFactory && deleteMutation.mutate(selectedFactory.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 ml-2" />
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
