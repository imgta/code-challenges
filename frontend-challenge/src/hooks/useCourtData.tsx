import { mockCourts, mockReviews } from '@/utils/mock-data';

// pre-index data and generate reusable composables
type Court = (typeof mockCourts)[number];
type Review = (typeof mockReviews)[number];

let _data:
  | {
    courtsById: Record<string, Court>;
    reviewsByCourt: Record<string, number>;
    reviewsListByCourt: Record<string, Review[]>;
  }
  | null = null;

export function getCourtData() {
  if (_data) return _data;

  const courtsById: Record<string, Court> = {};
  for (const c of mockCourts) courtsById[c.id] = c;

  const reviewsByCourt: Record<string, number> = {};
  const reviewsListByCourt: Record<string, Review[]> = {};

  for (const r of mockReviews) {
    reviewsByCourt[r.courtId] = (reviewsByCourt[r.courtId] ?? 0) + 1;
    (reviewsListByCourt[r.courtId] ??= []).push(r);
  }

  _data = { courtsById, reviewsByCourt, reviewsListByCourt };
  return _data;
}

export function useCourtData(courtId: string) {
  return {
    court: getCourtData().courtsById[courtId],
    reviewCount: getCourtData().reviewsByCourt[courtId] ?? 0,
    reviews: getCourtData().reviewsListByCourt[courtId] ?? [],
  };
}