import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FactoryCardSkeleton() {
  return (
    <Card className="overflow-hidden" data-testid="skeleton-factory-card">
      <div className="relative h-48 overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 right-3">
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>
      </div>

      <CardContent className="p-4">
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
