import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_manufacturing_facility_Algeria_45cb30d8.png";

export default function Hero() {
  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Modern Algerian manufacturing facility" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center justify-center">
        <div className="text-center text-white max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            صنع في الجزائر
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/90">
            اكتشف المصانع الجزائرية في جميع الولايات
          </p>
          <p className="text-lg mb-8 text-white/80">
            منصة وطنية تربط الزبائن بالمصانع الجزائرية في مختلف القطاعات الصناعية
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary text-primary-foreground border-2 border-primary-border px-8"
              data-testid="button-explore-factories"
            >
              <Building2 className="w-5 h-5 ml-2" />
              استكشف المصانع
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-background/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-background/20"
              data-testid="button-register-factory"
            >
              سجل مصنعك
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-white/80">
            <span className="text-sm">🇩🇿</span>
            <span className="text-sm">أكثر من 500+ مصنع جزائري</span>
          </div>
        </div>
      </div>
    </section>
  );
}
