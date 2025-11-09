import { Factory, MapPin, Building2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface StatsData {
  totalFactories: number;
  totalWilayas: number;
  totalCategories: number;
  growthRate: number;
}

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
}

export default function StatsSection() {
  const { language } = useLanguage();

  const { data: stats } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  const statsData = stats || {
    totalFactories: 500,
    totalWilayas: 48,
    totalCategories: 15,
    growthRate: 25,
  };

  const statsItems = [
    {
      icon: Factory,
      value: statsData.totalFactories,
      label: {
        ar: "مصنع جزائري",
        en: "Algerian Factories",
        fr: "Usines Algériennes"
      },
      suffix: "+"
    },
    {
      icon: MapPin,
      value: statsData.totalWilayas,
      label: {
        ar: "ولاية",
        en: "Wilayas",
        fr: "Wilayas"
      },
      suffix: ""
    },
    {
      icon: Building2,
      value: statsData.totalCategories,
      label: {
        ar: "قطاع صناعي",
        en: "Industrial Sectors",
        fr: "Secteurs Industriels"
      },
      suffix: "+"
    },
    {
      icon: TrendingUp,
      value: statsData.growthRate,
      label: {
        ar: "نمو سنوي",
        en: "Annual Growth",
        fr: "Croissance Annuelle"
      },
      suffix: "%"
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/50" data-testid="section-stats">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {statsItems.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-4 md:p-6 rounded-md bg-background border hover-elevate"
              data-testid={`stat-item-${index}`}
            >
              <stat.icon className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-primary" />
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                <Counter end={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground text-center mt-1 md:mt-2">
                {stat.label[language as keyof typeof stat.label]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
