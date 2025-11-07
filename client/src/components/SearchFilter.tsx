import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { wilayas, categories } from "@/lib/data";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedWilaya: string;
  onWilayaChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedWilaya,
  onWilayaChange,
  selectedCategory,
  onCategoryChange,
}: SearchFilterProps) {
  return (
    <section className="w-full bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="ابحث عن مصنع أو منتج..."
              className="w-full pr-12 h-12 text-base"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              data-testid="input-search"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedWilaya} onValueChange={onWilayaChange}>
              <SelectTrigger className="h-12" data-testid="select-wilaya">
                <SelectValue placeholder="اختر الولاية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الولايات</SelectItem>
                {wilayas.map((wilaya) => (
                  <SelectItem key={wilaya} value={wilaya}>
                    {wilaya}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-12" data-testid="select-category">
                <SelectValue placeholder="اختر القطاع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل القطاعات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="cursor-pointer hover-elevate active-elevate-2"
                onClick={() => onCategoryChange(category.id)}
                data-testid={`badge-category-${category.id}`}
              >
                {category.nameAr}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
