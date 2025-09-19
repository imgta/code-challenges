import { useState, useMemo, useEffect, memo } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Search, MapPin, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockCourts } from '@/utils/mock-data';
import { getCourtData } from '@/hooks/useCourtData';
import { SURFACES, debounce, weightedSearch, getFullStateFromLocation, type FieldSpec } from '@/utils/search';

export const Route = createFileRoute('/')({ component: Index });

function Index() {
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurface, setSelectedSurface] = useState<string>('all');
  const [selectedIndoor, setSelectedIndoor] = useState<string>('all');

  const { reviewsByCourt } = getCourtData();

  const debouncedSetQuery = useMemo(
    () => debounce((input: string) => setSearchQuery(input), 150),
    []);
  useEffect(() => {
    debouncedSetQuery(input);
  }, [input, debouncedSetQuery]);


  const preFiltered = useMemo(() => {
    return mockCourts.filter(court => {
      const matchesSurface = selectedSurface === 'all' || court.surface === selectedSurface;
      const matchesIndoor =
        selectedIndoor === 'all' ||
        (selectedIndoor === 'indoor' && court.indoor) ||
        (selectedIndoor === 'outdoor' && !court.indoor);
      return matchesSurface && matchesIndoor;
    });
  }, [selectedSurface, selectedIndoor]);

  type Court = (typeof mockCourts)[number];
  const FIELDS: FieldSpec<Court>[] = useMemo(() => [
    { key: 'location', weight: 5 },
    { key: 'address', weight: 4 },
    // expand state name from location so "cal" matches "California" for "..., CA"
    { key: 'location', weight: 5, transform: (_input, item) => getFullStateFromLocation(item.location) ?? '' },
    { key: 'name', weight: 2 },
    { key: 'surface', weight: 1 },
  ], []);

  const filteredCourts = useMemo(() => {
    return weightedSearch(preFiltered, FIELDS, searchQuery);
  }, [preFiltered, FIELDS, searchQuery]);

  function clearFilters() {
    setInput('');
    setSearchQuery('');
    setSelectedSurface('all');
    setSelectedIndoor('all');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-foreground text-center mb-4">Court Finder</h1>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Search courts, locations, or surfaces..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedSurface === 'all' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setSelectedSurface('all')}
              className="whitespace-nowrap"
            >
              All Surfaces
            </Button>
            {SURFACES.map(surface => (
              <Button
                key={surface}
                size="xs"
                className="whitespace-nowrap"
                variant={selectedSurface === surface ? 'default' : 'outline'}
                onClick={() => setSelectedSurface(surface)}
              >
                {surface}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              size="xs"
              className="whitespace-nowrap"
              variant={selectedIndoor === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedIndoor('all')}
            >
              All Courts
            </Button>
            <Button
              size="xs"
              className="whitespace-nowrap"
              variant={selectedIndoor === 'indoor' ? 'default' : 'outline'}
              onClick={() => setSelectedIndoor('indoor')}
            >
              Indoor
            </Button>
            <Button
              size="xs"
              variant={selectedIndoor === 'outdoor' ? 'default' : 'outline'}
              onClick={() => setSelectedIndoor('outdoor')}
              className="whitespace-nowrap"
            >
              Outdoor
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 py-3 bg-muted/75">
        <p className="text-sm text-muted-foreground">{filteredCourts.length} courts found</p>
      </div>

      <main className="py-4 px-0.5 space-y-4">
        {filteredCourts.map(court => (
          <div>
            <Link key={court.id} to="/court/$courtId" params={{ courtId: court.id }}>
              <CourtCard
                name={court.name}
                location={court.location}
                image={court.image}
                rating={court.rating}
                reviewCount={reviewsByCourt[court.id] ?? 0}
                surface={court.surface}
                indoor={court.indoor}
                hourlyRate={court.hourlyRate}
              />
            </Link>
          </div>
        ))}

        {filteredCourts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No courts found matching your criteria.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

const CourtCard = memo(function CourtCard(props: {
  name: string;
  location: string;
  image?: string;
  rating: number;
  reviewCount: number;
  surface: string;
  indoor: boolean;
  hourlyRate: number;
}) {
  const { name, location, image, rating, reviewCount, surface, indoor, hourlyRate } = props;
  return (
    <Card className="hover:shadow-md hover:scale-105 transition-[shadow,transform] cursor-pointer p-0">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-32">
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className="size-full object-cover rounded-l-lg"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground text-sm leading-tight">{name}</h3>
              <div className="flex items-center gap-1 ml-2 text-xs">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating}</span>
                <span className="text-muted-foreground">({reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-2">
              <MapPin className="size-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{location}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <Badge
                  variant={surface.toLowerCase() as 'grass' | 'clay' | 'hard' | 'synthetic'}
                  className="text-xs px-2 py-0">
                  {surface.slice(0, 5)}

                </Badge>
                <Badge variant={indoor ? 'default' : 'outline'} className="text-xs px-2 py-0">
                  {indoor ? 'Indoor' : 'Outdoor'}
                </Badge>
              </div>
              <span className="text-sm font-semibold text-primary">${hourlyRate}/hr</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});