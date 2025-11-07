import FactoryCard from '../FactoryCard';
import foodFactoryImage from '@assets/generated_images/Food_processing_factory_Algeria_948f6d0a.png';

export default function FactoryCardExample() {
  return (
    <div className="max-w-sm p-4">
      <FactoryCard
        id="1"
        name="Olive Oil Factory"
        nameAr="مصنع زيت الزيتون الجزائري"
        wilaya="تيزي وزو"
        category="food"
        categoryAr="الصناعات الغذائية"
        imageUrl={foodFactoryImage}
        products={["زيت الزيتون", "الزيتون المعلب", "المخللات"]}
      />
    </div>
  );
}
