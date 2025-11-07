import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchFilter from "@/components/SearchFilter";
import FactoryGrid from "@/components/FactoryGrid";
import Footer from "@/components/Footer";
import foodFactoryImage from "@assets/generated_images/Food_processing_factory_Algeria_948f6d0a.png";
import textileFactoryImage from "@assets/generated_images/Textile_factory_Algeria_9b983e89.png";
import pharmaFactoryImage from "@assets/generated_images/Pharmaceutical_factory_Algeria_853de564.png";
import automotiveFactoryImage from "@assets/generated_images/Automotive_factory_Algeria_61d5bf78.png";
import electronicsFactoryImage from "@assets/generated_images/Electronics_factory_Algeria_81f5e0be.png";

// todo: remove mock functionality
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
  },
];

export default function Home() {
  const { t } = useLanguage();
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedWilaya={selectedWilaya}
        onWilayaChange={setSelectedWilaya}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-foreground">{t.factory.availableFactories}</h2>
          <p className="text-muted-foreground">
            {filteredFactories.length} {t.factory.factoriesCount}
          </p>
        </div>
        <FactoryGrid factories={filteredFactories} />
      </section>

      <Footer />
    </div>
  );
}
