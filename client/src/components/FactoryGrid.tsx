import FactoryCard from "./FactoryCard";

interface Factory {
  id: string;
  name: string;
  nameAr: string;
  wilaya: string;
  category: string;
  categoryAr: string;
  imageUrl: string;
  products: string[];
}

interface FactoryGridProps {
  factories: Factory[];
}

export default function FactoryGrid({ factories }: FactoryGridProps) {
  if (factories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">لا توجد نتائج</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {factories.map((factory) => (
        <FactoryCard
          key={factory.id}
          id={factory.id}
          name={factory.name}
          nameAr={factory.nameAr}
          wilaya={factory.wilaya}
          category={factory.category}
          categoryAr={factory.categoryAr}
          imageUrl={factory.imageUrl}
          products={factory.products}
        />
      ))}
    </div>
  );
}
