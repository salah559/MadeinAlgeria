
import { db } from "@db";
import { factories } from "@db/schema";

export async function seedDatabase() {
  // التحقق من وجود مصانع
  const existingFactories = await db.select().from(factories);
  
  if (existingFactories.length === 0) {
    console.log("🌱 Seeding database with initial factory...");
    
    await db.insert(factories).values({
      name: "Olive Oil Factory",
      nameAr: "مصنع زيت الزيتون الجزائري",
      description: "Leading olive oil producer in Algeria, specializing in premium extra virgin olive oil and olive products.",
      descriptionAr: "رائد في إنتاج زيت الزيتون في الجزائر، متخصص في زيت الزيتون البكر الممتاز ومنتجات الزيتون.",
      wilaya: "تيزي وزو",
      category: "food",
      categoryAr: "الصناعات الغذائية",
      products: ["Extra Virgin Olive Oil", "Canned Olives", "Pickles"],
      productsAr: ["زيت الزيتون", "الزيتون المعلب", "المخللات"],
      address: "Industrial Zone, Tizi Ouzou, Algeria",
      addressAr: "المنطقة الصناعية، تيزي وزو، الجزائر",
      phone: "+213 26 12 34 56",
      email: "contact@oliveoil-dz.com",
      website: "https://oliveoil-dz.com",
      imageUrl: "/generated_images/Food_processing_factory_Algeria_948f6d0a.png",
      latitude: "36.7167",
      longitude: "4.0500",
    });
    
    console.log("✅ Database seeded successfully!");
  }
}
