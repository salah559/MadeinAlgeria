import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Building2, TrendingUp } from "lucide-react";

export default function About() {
  const stats = [
    { icon: Building2, value: "500+", label: "مصنع مسجل" },
    { icon: Users, value: "1000+", label: "زبون نشط" },
    { icon: TrendingUp, value: "48", label: "ولاية مغطاة" },
    { icon: Target, value: "8+", label: "قطاع صناعي" },
  ];

  const values = [
    {
      title: "دعم المنتج المحلي",
      description: "نؤمن بقدرات الصناعة الجزائرية ونعمل على تعزيز المنتج الوطني",
    },
    {
      title: "الشفافية والمصداقية",
      description: "نوفر معلومات دقيقة وموثوقة عن جميع المصانع المسجلة",
    },
    {
      title: "التواصل الفعال",
      description: "نسهل التواصل المباشر بين الزبائن والمصانع",
    },
    {
      title: "الجودة والابتكار",
      description: "نشجع المصانع على تبني أعلى معايير الجودة والابتكار",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            من نحن
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            منصة وطنية رائدة لربط الزبائن بالمصانع الجزائرية
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground">رؤيتنا</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Made in Algeria هو جسر رقمي حديث يربط بين الزبائن والمصانع الجزائرية في مختلف القطاعات الصناعية والخدمية. نهدف إلى إبراز القدرات الإنتاجية المحلية وتمكين الأفراد والشركات من اكتشاف والتواصل مع المصانع الجزائرية عبر منصة موحدة وعصرية.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              نسعى لأن نكون المرجع الأول للصناعة الجزائرية، ونساهم في تعزيز الاقتصاد الوطني من خلال تسهيل الوصول إلى المنتجات المحلية عالية الجودة.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">أهدافنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <Target className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">دعم الصناعة الوطنية</h3>
                <p className="text-muted-foreground">
                  تشجيع وتعزيز المنتج الجزائري من خلال توفير منصة شاملة تعرض قدرات المصانع المحلية
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Building2 className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">تسهيل الوصول</h3>
                <p className="text-muted-foreground">
                  تمكين الزبائن من الوصول السهل والسريع إلى المصانع في جميع الولايات والقطاعات
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">بناء شبكة تواصل</h3>
                <p className="text-muted-foreground">
                  خلق شبكة فعالة للتواصل بين الزبائن، الموردين والمستثمرين
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <TrendingUp className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">معلومات دقيقة</h3>
                <p className="text-muted-foreground">
                  توفير معلومات شاملة ومحدثة عن كل مصنع لضمان أفضل تجربة للمستخدمين
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <Card key={idx}>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-bold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
