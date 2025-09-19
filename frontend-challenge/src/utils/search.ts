export const SURFACES = ['Hard', 'Clay', 'Grass', 'Synthetic'];

export function debounce<T extends (...args: any[]) => any>
  (func: T, delay: number = 75):
  (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const STATE_MAP: Record<string, string> = {
  AL: 'alabama', AK: 'alaska', AZ: 'arizona', AR: 'arkansas', CA: 'california', CO: 'colorado',
  CT: 'connecticut', DE: 'delaware', FL: 'florida', GA: 'georgia', HI: 'hawaii', IA: 'iowa',
  ID: 'idaho', IL: 'illinois', IN: 'indiana', KS: 'kansas', KY: 'kentucky', LA: 'louisiana',
  MA: 'massachusetts', MD: 'maryland', ME: 'maine', MI: 'michigan', MN: 'minnesota',
  MO: 'missouri', MS: 'mississippi', MT: 'montana', NC: 'north carolina', ND: 'north dakota',
  NE: 'nebraska', NH: 'new hampshire', NJ: 'new jersey', NM: 'new mexico', NV: 'nevada',
  NY: 'new york', OH: 'ohio', OK: 'oklahoma', OR: 'oregon', PA: 'pennsylvania', RI: 'rhode island',
  SC: 'south carolina', SD: 'south dakota', TN: 'tennessee', TX: 'texas', UT: 'utah', VA: 'virginia',
  VT: 'vermont', WA: 'washington', WI: 'wisconsin', WV: 'west virginia', WY: 'wyoming', DC: 'district of columbia'
};

const cityStateRegex = /,\s*([A-Za-z.\s]{2,})$/;
const stateRegex = /^[A-Z]{2}$/;
export function getFullStateFromLocation(location: string | undefined): string | null {
  if (!location) return null;
  const m = location.match(cityStateRegex);
  if (!m) return null;

  const token = m[1].trim();
  if (stateRegex.test(token)) return STATE_MAP[token] ?? null;

  return token.toLowerCase();
}

function makeMatcher(q: string) {
  const isShort = q.length > 0 && q.length <= 3;
  return (text: string) => {
    if (!q) return true;
    if (!text) return false;
    if (!isShort) return text.includes(q);
    // token-prefix: start of string OR any token starts with q
    if (text.startsWith(q)) return true;
    return text.split(/[\s,/-]+/).some(t => t.startsWith(q));
  };
}

export type FieldSpec<T> = {
  key: keyof T;     // field name on the item
  weight: number;   // how important this field is
  transform?: (value: unknown, item: T) => string; // optional preprocessor
};

export function weightedSearch<T>(
  items: T[],
  fields: FieldSpec<T>[],
  query: string
): T[] {
  const q = query.toLowerCase().trim();
  if (!q) return items;

  const match = makeMatcher(q);

  // score items and keep those with score > 0
  const scored = [];
  for (const item of items) {
    let score = 0;

    for (const f of fields) {
      const raw = f.transform ? f.transform((item as any)[f.key], item) : (item as any)[f.key];
      const text = raw.toLowerCase();
      if (text && match(text)) score += f.weight;
    }

    if (score > 0) scored.push({ item, score });
  }

  // sort high → low
  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.item);
}