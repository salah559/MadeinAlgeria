import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@assets/generated_images/Hero_manufacturing_facility_Algeria_45cb30d8.png";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Modern Algerian manufacturing facility" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        
        {/* Animated decorative elements with Algerian flag colors */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Green circles */}
          <div className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-green-500/20 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-[15%] w-40 h-40 rounded-full bg-green-600/15 blur-3xl animate-float-delayed" />
          <div className="absolute top-1/3 right-[5%] w-24 h-24 rounded-full bg-green-400/25 blur-2xl animate-pulse-slow" />
          
          {/* Red circles */}
          <div className="absolute top-1/4 right-[20%] w-36 h-36 rounded-full bg-red-500/20 blur-3xl animate-float-slow" />
          <div className="absolute bottom-1/4 left-[8%] w-28 h-28 rounded-full bg-red-600/15 blur-3xl animate-float" />
          <div className="absolute top-1/2 left-[25%] w-20 h-20 rounded-full bg-red-400/25 blur-2xl animate-pulse-slow" />
          
          {/* Mixed gradients */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-green-500/10 via-transparent to-transparent animate-gradient-shift" />
          <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-tl from-red-500/10 via-transparent to-transparent animate-gradient-shift-delayed" />
        </div>
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center justify-center">
        <div className="text-center text-white max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6">
            {t.hero.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 text-white/90">
            {t.hero.subtitle}
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-8 text-white/80 px-4">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary text-primary-foreground border-2 border-primary-border px-6 md:px-8 w-full sm:w-auto text-sm md:text-base"
              data-testid="button-explore-factories"
            >
              <Building2 className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              {t.hero.exploreButton}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-background/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-background/20 w-full sm:w-auto text-sm md:text-base"
              data-testid="button-register-factory"
            >
              {t.hero.registerButton}
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            </Button>
          </div>

          <div className="mt-6 md:mt-8 flex items-center justify-center gap-2 text-white/80">
            <span className="text-sm">🇩🇿</span>
            <span className="text-xs md:text-sm">{t.hero.factoryCount}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
