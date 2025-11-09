import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SearchFilter from "@/components/SearchFilter";
import FactoryGrid from "@/components/FactoryGrid";
import AlgeriaMap from "@/components/AlgeriaMap";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, Map } from "lucide-react";
import { useLocation } from "wouter";
import foodFactoryImage from "@assets/generated_images/Food_processing_factory_Algeria_948f6d0a.png";
import textileFactoryImage from "@assets/generated_images/Textile_factory_Algeria_9b983e89.png";
import pharmaFactoryImage from "@assets/generated_images/Pharmaceutical_factory_Algeria_853de564.png";
import automotiveFactoryImage from "@assets/generated_images/Automotive_factory_Algeria_61d5bf78.png";
import electronicsFactoryImage from "@assets/generated_images/Electronics_factory_Algeria_81f5e0be.png";

const mockFactories = [
  {
    id: "1",
    name: "Olive Oil Factory",
    nameAr: "مصنع زيت الزيتون الجزائري",
    wilaya: "تيزي وزو",
    category: "food",
    categoryAr: "الصناعات الغذائية",
    imageUrl: foodFactoryImage,
    products: ["زيت الزيتون", "الزيتون المعلب", "المخللات"],
    latitude: "36.7167",
    longitude: "4.0500",
  },
  {
    id: "2",
    name: "Textile Factory",
    nameAr: "مصنع النسيج الوطني",
    wilaya: "سطيف",
    category: "textile",
    categoryAr: "الصناعات النسيجية",
    imageUrl: textileFactoryImage,
    products: ["أقمشة قطنية", "ملابس جاهزة", "منسوجات منزلية"],
    latitude: "36.1909",
    longitude: "5.4143",
  },
  {
    id: "3",
    name: "Pharmaceutical Factory",
    nameAr: "مصنع الأدوية الجزائري",
    wilaya: "قسنطينة",
    category: "pharmaceutical",
    categoryAr: "الصناعات الصيدلانية",
    imageUrl: pharmaFactoryImage,
    products: ["أدوية عامة", "مكملات غذائية", "منتجات عناية"],
    latitude: "36.3650",
    longitude: "6.6147",
  },
  {
    id: "4",
    name: "Automotive Parts",
    nameAr: "مصنع قطع غيار السيارات",
    wilaya: "وهران",
    category: "automotive",
    categoryAr: "صناعة السيارات",
    imageUrl: automotiveFactoryImage,
    products: ["قطع غيار", "إطارات", "بطاريات"],
    latitude: "35.6969",
    longitude: "-0.6331",
  },
  {
    id: "5",
    name: "Electronics Factory",
    nameAr: "مصنع الإلكترونيات الحديثة",
    wilaya: "الجزائر",
    category: "electronic",
    categoryAr: "الصناعات الإلكترونية",
    imageUrl: electronicsFactoryImage,
    products: ["أجهزة إلكترونية", "لوحات إلكترونية", "مكونات"],
    latitude: "36.7538",
    longitude: "3.0588",
  },
  {
    id: "6",
    name: "Food Processing",
    nameAr: "مصنع تحويل المواد الغذائية",
    wilaya: "عنابة",
    category: "food",
    categoryAr: "الصناعات الغذائية",
    imageUrl: foodFactoryImage,
    products: ["معجنات", "حلويات", "مواد غذائية معلبة"],
    latitude: "36.9000",
    longitude: "7.7667",
  },
  {
    id: "7",
    name: "Textile Manufacturing",
    nameAr: "مصنع الخياطة والنسيج",
    wilaya: "تلمسان",
    category: "textile",
    categoryAr: "الصناعات النسيجية",
    imageUrl: textileFactoryImage,
    products: ["ملابس تقليدية", "أقمشة حريرية", "منتجات يدوية"],
    latitude: "34.8780",
    longitude: "-1.3150",
  },
  {
    id: "8",
    name: "Medical Equipment",
    nameAr: "مصنع المعدات الطبية",
    wilaya: "باتنة",
    category: "pharmaceutical",
    categoryAr: "الصناعات الصيدلانية",
    imageUrl: pharmaFactoryImage,
    products: ["معدات طبية", "أدوات جراحية", "مستلزمات صحية"],
    latitude: "35.5559",
    longitude: "6.1741",
  },
  {
    id: "9",
    name: "Car Assembly",
    nameAr: "مصنع تجميع السيارات",
    wilaya: "الشلف",
    category: "automotive",
    categoryAr: "صناعة السيارات",
    imageUrl: automotiveFactoryImage,
    products: ["سيارات", "شاحنات", "حافلات"],
    latitude: "36.1648",
    longitude: "1.3347",
  },
];

export default function Factories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFactories = useMemo(() => {
    return mockFactories.filter((factory) => {
      const matchesSearch = 
        searchQuery === "" ||
        factory.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        factory.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesWilaya = selectedWilaya === "all" || factory.wilaya === selectedWilaya;
      const matchesCategory = selectedCategory === "all" || factory.category === selectedCategory;
      
      return matchesSearch && matchesWilaya && matchesCategory;
    });
  }, [searchQuery, selectedWilaya, selectedCategory]);

  const [, setLocation] = useLocation();

  const handleFactoryClick = (factoryId: string) => {
    setLocation(`/factory/${factoryId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="relative bg-primary py-12 md:py-16 overflow-hidden">
        {/* Animated decorative elements with Algerian flag colors */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Green accent lights */}
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-green-500/50 blur-[100px] animate-float" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-green-400/40 blur-[120px] animate-float-delayed" />
          <div className="absolute top-1/3 right-[10%] w-80 h-80 rounded-full bg-green-600/45 blur-[90px] animate-pulse-slow" />
          
          {/* Red accent lights */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-red-500/50 blur-[110px] animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-red-600/45 blur-[100px] animate-float" />
          <div className="absolute top-1/2 left-[20%] w-80 h-80 rounded-full bg-red-400/40 blur-[90px] animate-pulse-slow" />
          
          {/* Corner gradients for more dramatic effect */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-green-500/30 via-green-400/15 to-transparent animate-gradient-shift" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-red-500/30 via-red-400/15 to-transparent animate-gradient-shift-delayed" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-red-500/25 via-transparent to-transparent animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-green-500/25 via-transparent to-transparent animate-float-delayed" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3 md:mb-4">
            دليل المصانع الجزائرية
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/90">
            اكتشف المصانع في جميع الولايات والقطاعات الصناعية
          </p>
        </div>
      </div>

      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedWilaya={selectedWilaya}
        onWilayaChange={setSelectedWilaya}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex-1">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">النتائج</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {filteredFactories.length} مصنع متاح
          </p>
        </div>

        <Tabs defaultValue="grid" className="w-full" dir="rtl">
          <TabsList className="grid w-full max-w-md mb-6 grid-cols-2" data-testid="tabs-view-mode">
            <TabsTrigger value="grid" className="gap-2 text-sm md:text-base" data-testid="tab-grid">
              <Grid3X3 className="w-4 h-4 md:w-5 md:h-5" />
              عرض شبكي
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2 text-sm md:text-base" data-testid="tab-map">
              <Map className="w-4 h-4 md:w-5 md:h-5" />
              عرض الخريطة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-0">
            <FactoryGrid factories={filteredFactories} />
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <AlgeriaMap 
              factories={filteredFactories} 
              onFactoryClick={handleFactoryClick}
            />
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
}
