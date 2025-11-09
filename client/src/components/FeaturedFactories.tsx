import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Factory } from "@shared/schema";
import { Star, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FeaturedFactories() {
  const { language, t } = useLanguage();

  const { data: factories, isLoading } = useQuery<Factory[]>({
    queryKey: ["/api/factories"],
  });

  const featuredFactories = factories
    ?.filter((f: Factory) => f.verified || f.rating && f.rating >= 4)
    ?.slice(0, 6) || [];

  if (isLoading || featuredFactories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-transparent" data-testid="section-featured">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            {language === "ar" ? "أبرز المصانع" : language === "fr" ? "Usines en Vedette" : "Featured Factories"}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            {language === "ar" 
              ? "اكتشف أفضل المصانع الجزائرية المعتمدة والموثوقة"
              : language === "fr"
              ? "Découvrez les meilleures usines algériennes certifiées et fiables"
              : "Discover the best certified and trusted Algerian factories"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredFactories.map((factory: Factory) => (
            <Link key={factory.id} href={`/factory/${factory.id}`}>
              <Card className="hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`featured-factory-${factory.id}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                    {factory.logoUrl && (
                      <img
                        src={factory.logoUrl}
                        alt={language === "ar" ? factory.nameAr : factory.name}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-md"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-1">
                        {language === "ar" ? factory.nameAr : factory.name}
                      </h3>
                      {factory.verified && (
                        <Badge variant="default" className="text-xs">
                          {language === "ar" ? "موثّق" : language === "fr" ? "Vérifié" : "Verified"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3 md:mb-4">
                    {language === "ar" ? factory.descriptionAr : factory.description}
                  </p>

                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{factory.wilaya}</span>
                    </div>
                    {factory.rating && factory.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{factory.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/factories">
            <a className="inline-block">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover-elevate active-elevate-2" data-testid="button-view-all-factories">
                {language === "ar" ? "عرض جميع المصانع" : language === "fr" ? "Voir Toutes les Usines" : "View All Factories"}
              </button>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
