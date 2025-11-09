
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  keywords?: string;
}

function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  keywords
}: SEOProps) {
  const { language, t } = useLanguage();

  const defaultTitle = language === "ar"
    ? "دليل المصانع الجزائري - Made in Algeria"
    : language === "fr"
    ? "Répertoire des Usines Algériennes - Made in Algeria"
    : "Algerian Factories Directory - Made in Algeria";

  const defaultDescription = language === "ar"
    ? "اكتشف المصانع الجزائرية في جميع الولايات - منصة ربط الأبراج للمصانع الجزائرية في مختلف القطاعات الصناعية"
    : language === "fr"
    ? "Découvrez les usines algériennes dans toutes les wilayas - plateforme de connexion pour les usines algériennes dans divers secteurs industriels"
    : "Discover Algerian factories in all wilayas - connection platform for Algerian factories across various industrial sectors";

  const defaultImage = `${window.location.origin}/og-image.png`;
  const defaultUrl = window.location.href;

  const metaTitle = title || defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image || defaultImage;
  const metaUrl = url || defaultUrl;

  useEffect(() => {
    document.title = metaTitle;

    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement("meta");
        if (property) {
          element.setAttribute("property", name);
        } else {
          element.setAttribute("name", name);
        }
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    updateMetaTag("description", metaDescription);
    if (keywords) updateMetaTag("keywords", keywords);
    updateMetaTag("language", language);

    updateMetaTag("og:title", metaTitle, true);
    updateMetaTag("og:description", metaDescription, true);
    updateMetaTag("og:image", metaImage, true);
    updateMetaTag("og:url", metaUrl, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:locale", language === "ar" ? "ar_DZ" : language === "fr" ? "fr_FR" : "en_US", true);

    updateMetaTag("twitter:card", "summary_large_image", true);
    updateMetaTag("twitter:title", metaTitle, true);
    updateMetaTag("twitter:description", metaDescription, true);
    updateMetaTag("twitter:image", metaImage, true);

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = metaUrl;
    } else {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = metaUrl;
      document.head.appendChild(link);
    }
  }, [metaTitle, metaDescription, metaImage, metaUrl, type, keywords, language]);

  return null;
}

export default SEO;
export { SEO };
