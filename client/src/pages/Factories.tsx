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
      
      <div className="bg-primary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
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
