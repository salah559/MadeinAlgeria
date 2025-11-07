import FactoryGrid from '../FactoryGrid';
import foodFactoryImage from '@assets/generated_images/Food_processing_factory_Algeria_948f6d0a.png';
import textileFactoryImage from '@assets/generated_images/Textile_factory_Algeria_9b983e89.png';
import pharmaFactoryImage from '@assets/generated_images/Pharmaceutical_factory_Algeria_853de564.png';

export default function FactoryGridExample() {
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
  ];

  return (
    <div className="p-4">
      <FactoryGrid factories={mockFactories} />
    </div>
  );
}
