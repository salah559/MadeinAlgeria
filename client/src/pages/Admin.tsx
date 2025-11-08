import { useState } from "react";
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
import { Building2, Plus, Edit, Trash2, Search } from "lucide-react";
import { wilayas, categories } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Factory } from "@shared/schema";

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
};

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);
  const { toast } = useToast();

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
  });

  const { data: factories = [], isLoading } = useQuery<Factory[]>({
    queryKey: ["/api/factories"],
  });

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
        title: "تم بنجاح",
        description: "تم إضافة المصنع بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
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
        title: "تم بنجاح",
        description: "تم تحديث المصنع بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
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
        title: "تم بنجاح",
        description: "تم حذف المصنع بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
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

  const filteredFactories = factories.filter(factory =>
    factory.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    factory.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const FactoryFormDialog = ({ isOpen, onClose, title }: { isOpen: boolean; onClose: () => void; title: string }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            أدخل معلومات المصنع بالتفصيل
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الاسم بالعربية *</label>
              <Input
                required
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="اسم المصنع"
                data-testid="input-factory-name-ar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الاسم بالإنجليزية *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Factory Name"
                data-testid="input-factory-name-en"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الولاية *</label>
              <Select
                required
                value={formData.wilaya}
                onValueChange={(value) => setFormData({ ...formData, wilaya: value })}
              >
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
              <label className="block text-sm font-medium mb-2">القطاع *</label>
              <Select
                required
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الوصف بالعربية *</label>
              <Textarea
                required
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                placeholder="وصف المصنع ونشاطه..."
                rows={4}
                data-testid="textarea-factory-description-ar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الوصف بالإنجليزية *</label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Factory description..."
                rows={4}
                data-testid="textarea-factory-description-en"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">المنتجات *</label>
              <Button type="button" size="sm" onClick={addProductField}>
                <Plus className="w-4 h-4 ml-1" />
                إضافة منتج
              </Button>
            </div>
            <div className="space-y-2">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الهاتف *</label>
              <Input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+213 123 456 789"
                data-testid="input-factory-phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
              <Input
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
            <div>
              <label className="block text-sm font-medium mb-2">العنوان بالعربية *</label>
              <Input
                required
                value={formData.addressAr}
                onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
                placeholder="العنوان الكامل"
                data-testid="input-factory-address-ar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">العنوان بالإنجليزية *</label>
              <Input
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address"
                data-testid="input-factory-address-en"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-factory"
            >
              {(createMutation.isPending || updateMutation.isPending) ? "جاري الحفظ..." : "حفظ المصنع"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

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
              <div className="text-2xl font-bold">{factories.length}</div>
              <p className="text-xs text-muted-foreground mt-1">مصنع مسجل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الولايات المغطاة</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(factories.map(f => f.wilaya)).size}
              </div>
              <p className="text-xs text-muted-foreground mt-1">ولاية جزائرية</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">القطاعات</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(factories.map(f => f.category)).size}
              </div>
              <p className="text-xs text-muted-foreground mt-1">قطاع صناعي</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl">قائمة المصانع</CardTitle>
              
              <Button onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }} data-testid="button-add-factory">
                <Plus className="w-4 h-4 ml-2" />
                إضافة مصنع جديد
              </Button>
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

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">جاري تحميل المصانع...</p>
              </div>
            ) : filteredFactories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">لا توجد مصانع مسجلة</p>
              </div>
            ) : (
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
                      {filteredFactories.map((factory) => (
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
                                onClick={() => handleEdit(factory)}
                                data-testid={`button-edit-${factory.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(factory)}
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
            )}
          </CardContent>
        </Card>
      </section>

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
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المصنع "{selectedFactory?.nameAr}" نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedFactory && deleteMutation.mutate(selectedFactory.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
