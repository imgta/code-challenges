can you compile 50 tennis courts and a few reviews that i can use as mock data following these interface types:
```
export interface TennisCourt {
  id: string;
  name: string;
  location: string;
  address: string;
  surface: 'Hard' | 'Clay' | 'Grass' | 'Synthetic';
  indoor: boolean;
  lighting: boolean;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  image: string;
  description: string;
  phone: string;
  website?: string;
}

export interface Review {
  id: string;
  courtId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
```

---

can you create a map that points all US state abbreviations to their full state name in lowercase? and then a parsing function that can intake formats like `City, ST` and output the full state name?

---

using both the state map and getFullStateFromLocation() function, can you generate a prefiltering strategy with functions that will allow weighted search that scores user queries based on location, address, court name, and court surface in descending order?

---

can you bring up this mock data to an even 100 courts?
