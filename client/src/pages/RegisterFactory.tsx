
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Plus, X } from "lucide-react";

const wilayas = [
  "الجزائر", "وهران", "قسنطينة", "عنابة", "تيزي وزو", "بجاية", "سطيف", "البليدة",
  "باتنة", "ورقلة", "تلمسان", "بسكرة", "سيدي بلعباس", "مستغانم", "الشلف"
];

const categories = [
  { id: "food", nameAr: "الصناعات الغذائية", nameEn: "Food Processing" },
  { id: "textile", nameAr: "النسيج", nameEn: "Textile" },
  { id: "pharmaceutical", nameAr: "الصناعات الدوائية", nameEn: "Pharmaceutical" },
  { id: "automotive", nameAr: "السيارات", nameEn: "Automotive" },
  { id: "electronics", nameAr: "الإلكترونيات", nameEn: "Electronics" },
  { id: "construction", nameAr: "مواد البناء", nameEn: "Construction Materials" },
  { id: "chemicals", nameAr: "الصناعات الكيميائية", nameEn: "Chemicals" },
];

interface FactoryFormData {
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
  website: string;
  contactPerson: string;
}

export default function RegisterFactory() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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
    website: "",
    contactPerson: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FactoryFormData) => {
      const response = await fetch("/api/factory-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to submit registration");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: language === "ar" ? "تم الإرسال بنجاح" : "Successfully Submitted",
        description: language === "ar" 
          ? "سيتم مراجعة طلبك والتواصل معك قريباً"
          : "Your request will be reviewed and we'll contact you soon",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar"
          ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى"
          : "An error occurred while submitting. Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty products
    const cleanedData = {
      ...formData,
      products: formData.products.filter(p => p.trim() !== ""),
      productsAr: formData.productsAr.filter(p => p.trim() !== ""),
    };

    submitMutation.mutate(cleanedData);
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

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={language === "ar" ? "سجل مصنعك" : "Register Your Factory"}
        description={language === "ar" 
          ? "سجل مصنعك في دليل المصانع الجزائرية"
          : "Register your factory in the Algerian factories directory"}
      />
      <Header />

      <div className="bg-primary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-primary-foreground" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3 md:mb-4">
            {language === "ar" ? "سجل مصنعك" : "Register Your Factory"}
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/90">
            {language === "ar"
              ? "انضم إلى دليل المصانع الجزائرية وزِد من رؤية مصنعك"
              : "Join the Algerian factories directory and increase your factory's visibility"}
          </p>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {language === "ar" ? "معلومات المصنع" : "Factory Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {language === "ar" ? "المعلومات الأساسية" : "Basic Information"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nameAr">
                      {language === "ar" ? "اسم المصنع (بالعربية) *" : "Factory Name (Arabic) *"}
                    </Label>
                    <Input
                      id="nameAr"
                      required
                      value={formData.nameAr}
                      onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                      placeholder="مصنع النسيج الجزائري"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">
                      {language === "ar" ? "اسم المصنع (بالإنجليزية) *" : "Factory Name (English) *"}
                    </Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Algerian Textile Factory"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wilaya">
                      {language === "ar" ? "الولاية *" : "Wilaya *"}
                    </Label>
                    <Select
                      value={formData.wilaya}
                      onValueChange={(value) => setFormData({ ...formData, wilaya: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === "ar" ? "اختر الولاية" : "Select wilaya"} />
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
                    <Label htmlFor="category">
                      {language === "ar" ? "القطاع *" : "Sector *"}
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === "ar" ? "اختر القطاع" : "Select sector"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {language === "ar" ? cat.nameAr : cat.nameEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descriptionAr">
                    {language === "ar" ? "وصف المصنع (بالعربية) *" : "Factory Description (Arabic) *"}
                  </Label>
                  <Textarea
                    id="descriptionAr"
                    required
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    rows={4}
                    placeholder="وصف تفصيلي عن المصنع وأنشطته..."
                  />
                </div>

                <div>
                  <Label htmlFor="description">
                    {language === "ar" ? "وصف المصنع (بالإنجليزية) *" : "Factory Description (English) *"}
                  </Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Detailed description of the factory and its activities..."
                  />
                </div>
              </div>

              {/* Products */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {language === "ar" ? "المنتجات" : "Products"}
                  </h3>
                  <Button type="button" onClick={addProductField} variant="outline" size="sm">
                    <Plus className="w-4 h-4 ml-2" />
                    {language === "ar" ? "إضافة منتج" : "Add Product"}
                  </Button>
                </div>

                {formData.products.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder={language === "ar" ? "اسم المنتج بالعربية" : "Product name in Arabic"}
                        value={formData.productsAr[index]}
                        onChange={(e) => updateProductField(index, e.target.value, true)}
                      />
                      <Input
                        placeholder={language === "ar" ? "اسم المنتج بالإنجليزية" : "Product name in English"}
                        value={formData.products[index]}
                        onChange={(e) => updateProductField(index, e.target.value, false)}
                      />
                    </div>
                    {formData.products.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProductField(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {language === "ar" ? "معلومات الاتصال" : "Contact Information"}
                </h3>

                <div>
                  <Label htmlFor="contactPerson">
                    {language === "ar" ? "اسم الشخص المسؤول *" : "Contact Person Name *"}
                  </Label>
                  <Input
                    id="contactPerson"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder={language === "ar" ? "أحمد محمد" : "Ahmed Mohamed"}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">
                      {language === "ar" ? "رقم الهاتف *" : "Phone Number *"}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+213 555 123 456"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">
                      {language === "ar" ? "البريد الإلكتروني *" : "Email *"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="info@factory.dz"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">
                    {language === "ar" ? "الموقع الإلكتروني" : "Website"}
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.factory.dz"
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label htmlFor="addressAr">
                    {language === "ar" ? "العنوان (بالعربية) *" : "Address (Arabic) *"}
                  </Label>
                  <Input
                    id="addressAr"
                    required
                    value={formData.addressAr}
                    onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
                    placeholder="شارع الاستقلال، حي الزيتون"
                  />
                </div>

                <div>
                  <Label htmlFor="address">
                    {language === "ar" ? "العنوان (بالإنجليزية) *" : "Address (English) *"}
                  </Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Independence Street, Zitoune District"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation("/")}
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending
                    ? (language === "ar" ? "جاري الإرسال..." : "Submitting...")
                    : (language === "ar" ? "إرسال الطلب" : "Submit Request")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
