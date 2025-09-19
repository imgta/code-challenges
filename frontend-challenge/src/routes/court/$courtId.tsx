import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Star, MapPin, Wifi, Car, Coffee, Users, Phone, Globe, Calendar, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCourtData } from '@/hooks/useCourtData';
import { ReviewSection } from '@/components/ReviewModal';

export const Route = createFileRoute('/court/$courtId')({
  loader: ({ params }) => {
    const { court, reviews } = useCourtData(params.courtId);
    return { court, reviews };
  },
  component: RouteComponent,
});

const amenityMap: Record<string, any> = {
  "Pro Shop": Users,
  "Locker Rooms": Lock,
  Restaurant: Coffee,
  Parking: Car,
  "Equipment Rental": Users,
  Lessons: Users,
  "Ocean View": MapPin,
  Bar: Coffee,
  Pool: Users,
  "Mountain Views": MapPin,
  Spa: Users,
  "Valet Parking": Car,
  "Modern Facilities": Users,
  Cafe: Coffee,
  "Subway Access": MapPin,
  "Shade Structures": Users,
  "Ocean Breeze": MapPin,
  "Historic Venue": Users,
  "River Views": MapPin,
  Coaching: Users,
  "Bike Parking": Car,
  "Resort Amenities": Users,
  "Downtown Location": MapPin,
  Lounge: Coffee,
  "Country Club": Users,
  Dining: Coffee,
  Valet: Car,
  "Fog Lights": Users,
  "Public Transit": MapPin,
  "Large Complex": Users,
  Tournaments: Users,
  "Beach Access": MapPin,
  "High-Speed WiFi": Wifi,
  "EV Charging": Car,
};

function RouteComponent() {
  const { court, reviews } = Route.useLoaderData();

  if (!court) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Court Not Found</h1>
        <Button asChild>
          <Link to="/">
            Back to Courts
          </Link>
        </Button>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="p-4 flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="p-2">
            <Link to="/">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold text-foreground truncate">
            {court.name}
          </h1>
        </div>
      </header>

      <main className="pb-6">
        <div className="w-full h-auto bg-muted">
          <img
            src={court.image || "/placeholder.svg"}
            alt={court.name}
            className="size-full object-cover"
          />
        </div>

        <div className="p-4 space-y-4">
          <div>
            <div className="sm:flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">
                  {court.name}
                </h2>

                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MapPin className="size-4" />
                  <span>
                    {court.location}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{court.rating}</span>
                  <span className="text-muted-foreground">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Badge
                variant={court.surface.toLowerCase() as 'grass' | 'clay' | 'hard' | 'synthetic'}
              >
                {court.surface}
              </Badge>
              <Badge variant={court.indoor ? "default" : "outline"}>
                {court.indoor ? "Indoor" : "Outdoor"}
              </Badge>
              {court.lighting && <Badge variant="outline">Lighting</Badge>}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {court.description}
            </p>
          </div>

          <Card className="gap-4 w-full mx-auto">
            <CardHeader className="gap-0">
              <CardTitle className="text-lg">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 gap-0">
              <div className="flex items-start gap-3 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <a
                  href={`tel:${court.phone}`}
                  className="text-primary hover:underline"
                >
                  {court.phone}
                </a>
              </div>
              {court.website && (
                <div className="flex items-start gap-3 text-sm">
                  <Globe className="size-4 text-muted-foreground" />
                  <a
                    href={court.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              <div className="flex items-start gap-3 text-sm text-muted-foreground text-balance">
                <MapPin className="size-4" />
                <span>
                  {court.address}
                </span>
              </div>
            </CardContent>
          </Card>

          {court.amenities.length > 0 && (
            <Card className="gap-4 w-full">
              <CardHeader className="gap-0">
                <CardTitle className="text-lg">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {court.amenities.map((amenity, index) => {
                    const AmenityIcon = amenityMap[amenity] || Users;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <AmenityIcon className="size-4 text-muted-foreground" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="px-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Ready to Play?</h3>
                  <p className="text-sm text-muted-foreground">
                    Book your court time now
                  </p>
                </div>
                <Calendar className="size-6 text-primary" />
              </div>
              <Button className="w-full bg-brand hover:bg-brand-hover" size="lg">
                Book Court - ${court.hourlyRate}/hr
              </Button>
            </CardContent>
          </Card>

          <ReviewSection court={court} reviews={reviews} />
        </div>
      </main>
    </div>
  );
}
