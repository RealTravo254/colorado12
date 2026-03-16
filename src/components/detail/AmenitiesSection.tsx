import { useState } from "react";
import { ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

interface AmenitiesSectionProps {
  amenities: (string | { name: string })[];
}

export const AmenitiesSection = ({ amenities }: AmenitiesSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  if (!amenities || amenities.length === 0) return null;

  const totalPages = Math.ceil(amenities.length / ITEMS_PER_PAGE);
  const displayedAmenities = showAll
    ? amenities
    : amenities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <section className="bg-background rounded-3xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-black uppercase tracking-widest text-primary">Amenities</h2>
      </div>
      
      <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2">
        {displayedAmenities.map((amenity, idx) => {
          const amenityName = typeof amenity === 'string' ? amenity : amenity.name;
          return (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-foreground font-bold mt-1.5">•</span>
              <span className="text-sm text-foreground font-bold capitalize">{amenityName}</span>
            </li>
          );
        })}
      </ul>

      {amenities.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            {!showAll && totalPages > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground font-bold">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setShowAll(!showAll); setCurrentPage(1); }}
            className="text-xs font-bold h-8"
          >
            {showAll ? "Show Less" : `View All (${amenities.length})`}
          </Button>
        </div>
      )}
    </section>
  );
};
