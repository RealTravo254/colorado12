import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Ticket, Calendar, MapPin, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Bookings() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, adventure_places(name, location, image_url), trips(name, location, image_url)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
          <Ticket className="h-10 w-10 text-teal-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">{t('nav.bookings')}</h2>
        <p className="text-slate-500 mb-8 max-w-sm">
          {t('bookings.loginPrompt', 'Your bookings will appear here once you log in.')}
        </p>
        <Button onClick={() => navigate("/auth")} className="bg-teal-600 hover:bg-teal-700 rounded-full px-8">
          {t('auth.login', 'Log In')}
        </Button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
          <Ticket className="h-10 w-10 text-teal-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">{t('bookings.noBookings', 'No Bookings Yet')}</h2>
        <p className="text-slate-500 mb-8 max-w-sm">
          {t('bookings.emptyPrompt', 'Explore our adventures and trips to start your journey.')}
        </p>
        <Button onClick={() => navigate("/explore")} className="bg-teal-600 hover:bg-teal-700 rounded-full px-8">
          {t('nav.explore', 'Explore')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-slate-900 mb-6">{t('nav.myBookings')}</h1>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const item = booking.adventure_places || booking.trips;
          return (
            <Card key={booking.id} className="p-4 flex gap-4 rounded-2xl border-slate-100 shadow-sm">
              <img 
                src={item?.image_url || "/placeholder.jpg"} 
                alt={item?.name} 
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{item?.name}</h3>
                <div className="flex items-center text-slate-500 text-xs mt-1 mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {item?.location}
                </div>
                <div className="flex items-center text-teal-600 text-xs font-bold">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(booking.created_at).toLocaleDateString()}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
