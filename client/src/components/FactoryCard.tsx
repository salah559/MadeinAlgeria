import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

interface FactoryCardProps {
  id: string;
  name: string;
  nameAr: string;
  wilaya: string;
  category: string;
  categoryAr: string;
  imageUrl: string;
  products: string[];
}

export default function FactoryCard({
  id,
  name,
  nameAr,
  wilaya,
  category,
  categoryAr,
  imageUrl,
  products,
}: FactoryCardProps) {
  const { t, language } = useLanguage();

  const displayName = language === 'ar' ? nameAr : name;
  const displayCategory = categoryAr;

  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all" data-testid={`card-factory-${id}`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={displayName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {displayCategory}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2 text-foreground">{displayName}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span>{wilaya}</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {products.slice(0, 3).map((product, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {product}
            </Badge>
          ))}
          {products.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{products.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/factory/${id}`} className="w-full">
          <Button variant="ghost" className="w-full" data-testid={`button-view-${id}`}>
            {t.common.viewDetails}
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
