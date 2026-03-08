import { Card } from "@/components/ui/card";
import { CheckCircle2, MapPin, Clock, DollarSign, Phone, Mail, User, Calendar, Building, Users, Ticket, Image as ImageIcon, Globe, Link as LinkIcon } from "lucide-react";

interface FacilityWithImages {
  name: string;
  price: number;
  capacity?: number | null;
  is_free?: boolean;
  booking_link?: string;
  bookingLink?: string;
  amenities?: string[];
  images?: string[];
}

interface ActivityWithImages {
  name: string;
  price: number;
  is_free?: boolean;
  images?: string[];
}

interface ReviewStepProps {
  type: 'hotel' | 'adventure' | 'trip' | 'event';
  data: {
    name: string;
    registrationNumber?: string;
    registrationName?: string;
    location?: string;
    locationName?: string;
    place?: string;
    country?: string;
    description?: string;
    email?: string;
    phoneNumber?: string;
    openingHours?: string;
    closingHours?: string;
    workingDays?: string[];
    // Entry fees (for adventure)
    entranceFeeType?: string;
    adultPrice?: string;
    childPrice?: string;
    // Trip/Event specific
    date?: string;
    isFlexibleDate?: boolean;
    flexibleDurationMonths?: string;
    priceAdult?: string;
    priceChild?: string;
    capacity?: string;
    tripType?: string;
    // Hotel specific
    establishmentType?: string;
    generalBookingLink?: string;
    // Amenities, facilities, activities
    amenities?: Array<{ name: string } | string>;
    generalFacilities?: string[];
    facilities?: FacilityWithImages[];
    activities?: ActivityWithImages[];
    // GPS
    latitude?: number | null;
    longitude?: number | null;
    mapLink?: string;
    // Images count
    imageCount?: number;
    // Gallery preview URLs
    galleryPreviewUrls?: string[];
  };
  creatorName?: string;
  creatorEmail?: string;
  creatorPhone?: string;
  accentColor?: string;
}

export const ReviewStep = ({ type, data, creatorName, creatorEmail, creatorPhone, accentColor = "#008080" }: ReviewStepProps) => {
  const formatPrice = (price: string | number | undefined) => {
    if (!price) return "Free";
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (num === 0) return "Free";
    return `KES ${num.toLocaleString()}`;
  };

  const formatDays = (days?: string[]) => {
    if (!days || days.length === 0) return "Not specified";
    return days.join(", ");
  };

  const Section = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: React.ElementType }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
          <Icon className="h-4 w-4" style={{ color: accentColor }} />
        </div>
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">{title}</h4>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value, fullWidth = false }: { label: string; value: string | undefined; fullWidth?: boolean }) => (
    <div className={fullWidth ? "col-span-2" : ""}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="font-bold text-slate-700 truncate">{value || "—"}</p>
    </div>
  );

  const isHotelOrAdventure = type === 'hotel' || type === 'adventure';
  const isTripOrEvent = type === 'trip' || type === 'event';

  const establishmentLabel = data.establishmentType === 'accommodation_only' ? 'Accommodation Only'
    : data.establishmentType === 'hotel' ? 'Hotel / Resort'
    : data.establishmentType || undefined;

  return (
    <Card className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100 space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2.5 rounded-xl bg-green-50">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: accentColor }}>
            Review Your Listing
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Please verify all details before submitting
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <Section title="Basic Information" icon={Building}>
        <InfoRow label="Name" value={data.name} fullWidth />
        {isHotelOrAdventure && (
          <>
            <InfoRow label="Registration Name" value={data.registrationName} />
            <InfoRow label="Registration Number" value={data.registrationNumber} />
          </>
        )}
        {type === 'hotel' && data.establishmentType && (
          <InfoRow label="Establishment Type" value={establishmentLabel} />
        )}
        {isTripOrEvent && data.tripType && (
          <InfoRow label="Listing Type" value={data.tripType === 'trip' ? 'Trip / Tour' : 'Event / Sport'} />
        )}
        {data.description && (
          <div className="col-span-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</p>
            <p className="font-medium text-slate-600 text-sm line-clamp-3">{data.description}</p>
          </div>
        )}
      </Section>

      {/* Location */}
      <Section title="Location" icon={MapPin}>
        <InfoRow label="Country" value={data.country} />
        <InfoRow label="City/Place" value={data.place} />
        {data.location && <InfoRow label="Specific Location" value={data.location} fullWidth />}
        {data.locationName && <InfoRow label="Location Name" value={data.locationName} fullWidth />}
        {data.latitude && data.longitude && (
          <InfoRow label="GPS Coordinates" value={`${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`} fullWidth />
        )}
      </Section>

      {/* Date & Time for Trip/Event */}
      {isTripOrEvent && (
        <Section title="Date & Schedule" icon={Calendar}>
          {data.isFlexibleDate ? (
            <>
              <InfoRow label="Date Type" value="Flexible / Open Availability" fullWidth />
              {data.flexibleDurationMonths && (
                <InfoRow label="Listing Duration" value={`${data.flexibleDurationMonths} month${data.flexibleDurationMonths === '1' ? '' : 's'}`} />
              )}
              <InfoRow label="Opening Hours" value={data.openingHours} />
              <InfoRow label="Closing Hours" value={data.closingHours} />
              <InfoRow label="Working Days" value={formatDays(data.workingDays)} fullWidth />
            </>
          ) : (
            <>
              <InfoRow label="Fixed Date" value={data.date ? new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined} />
              <InfoRow label="Event/Trip Hours" value={data.openingHours && data.closingHours ? `${data.openingHours} - ${data.closingHours}` : undefined} />
            </>
          )}
        </Section>
      )}

      {/* Operating Hours for Hotel/Adventure */}
      {isHotelOrAdventure && (
        <Section title="Operating Hours" icon={Clock}>
          {data.openingHours === "00:00" && data.closingHours === "23:59" ? (
            <InfoRow label="Hours" value="Open 24 Hours" fullWidth />
          ) : (
            <>
              <InfoRow label="Opening Hours" value={data.openingHours} />
              <InfoRow label="Closing Hours" value={data.closingHours} />
            </>
          )}
          <InfoRow label="Operating Days" value={formatDays(data.workingDays)} fullWidth />
        </Section>
      )}

      {/* Pricing */}
      <Section title="Pricing & Capacity" icon={DollarSign}>
        {isTripOrEvent && (
          <>
            <InfoRow label="Adult Price" value={formatPrice(data.priceAdult)} />
            <InfoRow label="Child Price" value={formatPrice(data.priceChild)} />
            <InfoRow label="Max Capacity" value={data.capacity ? `${data.capacity} slots` : undefined} />
          </>
        )}
        {type === 'adventure' && (
          <>
            <InfoRow label="Entry Fee Type" value={data.entranceFeeType === 'paid' ? 'Paid' : 'Free'} />
            {data.entranceFeeType === 'paid' && (
              <>
                <InfoRow label="Adult Entry Fee" value={formatPrice(data.adultPrice)} />
                <InfoRow label="Child Entry Fee" value={formatPrice(data.childPrice)} />
              </>
            )}
          </>
        )}
        {type === 'hotel' && data.generalBookingLink && (
          <InfoRow label="General Booking Link" value={data.generalBookingLink} fullWidth />
        )}
      </Section>

      {/* General Facilities / Amenities tags */}
      {data.generalFacilities && data.generalFacilities.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
              General Amenities ({data.generalFacilities.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.generalFacilities.map((item, i) => (
              <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Facilities - Enhanced with images */}
      {data.facilities && data.facilities.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50">
              <Building className="h-4 w-4 text-amber-600" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
              Facilities ({data.facilities.length})
            </h4>
          </div>
          <div className="space-y-3">
            {data.facilities.map((facility, i) => (
              <div 
                key={i}
                className="p-3 rounded-xl bg-amber-50/50 border border-amber-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-slate-700">{facility.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        facility.is_free || facility.price === 0
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-amber-100 text-amber-600"
                      }`}>
                        {facility.is_free || facility.price === 0 ? "Free" : `KES ${facility.price.toLocaleString()}/night`}
                      </span>
                      {facility.capacity && (
                        <span className="text-[10px] font-bold text-slate-500">
                          • {facility.capacity} guests
                        </span>
                      )}
                      {(facility.booking_link || facility.bookingLink) && (
                        <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" /> Booking link
                        </span>
                      )}
                    </div>
                    {/* Facility Amenities */}
                    {facility.amenities && facility.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {facility.amenities.map((a, j) => (
                          <span key={j} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Facility Images */}
                {facility.images && facility.images.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {facility.images.map((img, imgIdx) => (
                      <div key={imgIdx} className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        <img src={img} alt={`${facility.name} ${imgIdx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="flex items-center text-[10px] text-slate-400 font-bold ml-1">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      {facility.images.length}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities - Enhanced with images */}
      {data.activities && data.activities.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
              <Users className="h-4 w-4" style={{ color: accentColor }} />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
              Activities ({data.activities.length})
            </h4>
          </div>
          <div className="space-y-3">
            {data.activities.map((activity, i) => (
              <div 
                key={i}
                className="p-3 rounded-xl border border-slate-100"
                style={{ backgroundColor: `${accentColor}08` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-slate-700">{activity.name}</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${
                      activity.is_free || activity.price === 0
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {activity.is_free || activity.price === 0 ? "Free" : `KES ${activity.price.toLocaleString()}/person`}
                    </span>
                  </div>
                </div>
                {/* Activity Images */}
                {activity.images && activity.images.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {activity.images.map((img, imgIdx) => (
                      <div key={imgIdx} className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        <img src={img} alt={`${activity.name} ${imgIdx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="flex items-center text-[10px] text-slate-400 font-bold ml-1">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      {activity.images.length}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amenities */}
      {data.amenities && data.amenities.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
              Amenities ({data.amenities.length})
            </h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
            {data.amenities.map((amenity, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="text-sm text-slate-700 font-medium">
                  {typeof amenity === 'string' ? amenity : amenity.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info - Item Phone/Email */}
      <Section title="Contact Information" icon={Phone}>
        <InfoRow label="Item Email" value={data.email} />
        <InfoRow label="Item Phone" value={data.phoneNumber} />
      </Section>

      {/* Creator Info */}
      <Section title="Creator Profile" icon={User}>
        <InfoRow label="Name" value={creatorName || "Not available"} />
        <InfoRow label="Email" value={creatorEmail || "Not available"} />
        {creatorPhone && <InfoRow label="Phone" value={creatorPhone} />}
      </Section>

      {/* Gallery Preview */}
      {data.galleryPreviewUrls && data.galleryPreviewUrls.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
              <ImageIcon className="h-4 w-4" style={{ color: accentColor }} />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
              Gallery ({data.galleryPreviewUrls.length} images)
            </h4>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {data.galleryPreviewUrls.map((url, i) => (
              <div key={i} className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images count fallback */}
      {(!data.galleryPreviewUrls || data.galleryPreviewUrls.length === 0) && data.imageCount && data.imageCount > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-green-600 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {data.imageCount} {data.imageCount === 1 ? 'image' : 'images'} uploaded
          </p>
        </div>
      )}
    </Card>
  );
};
