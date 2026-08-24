import { WantedPart, IWantedPart } from '../models/WantedPart.js';
import { IListing } from '../models/Listing.js';
import { Notification } from '../models/Notification.js';
import { emitToUser } from './socketService.js';

// Dice coefficient string similarity helper (no external package needed)
export const calculateStringSimilarity = (str1: string, str2: string): number => {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) {
    return s1.includes(s2) || s2.includes(s1) ? 0.7 : 0;
  }

  const getBigrams = (str: string) => {
    const bigrams = new Map<string, number>();
    for (let i = 0; i < str.length - 1; i++) {
      const bigram = str.substring(i, i + 2);
      bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
    }
    return bigrams;
  };

  const b1 = getBigrams(s1);
  const b2 = getBigrams(s2);
  let intersection = 0;

  b1.forEach((count, bigram) => {
    if (b2.has(bigram)) {
      intersection += Math.min(count, b2.get(bigram)!);
    }
  });

  const total = (s1.length - 1) + (s2.length - 1);
  return total > 0 ? (2.0 * intersection) / total : 0;
};

export interface MatchResult {
  wantedPartId: string;
  score: number;
  tier: 'Strong Match' | 'Possible Match' | 'No Match';
  breakdown: {
    oemMatch: number;
    categoryMatch: number;
    vehicleOverlap: number;
    nameSimilarity: number;
    budgetMet: number;
    locationMatch: number;
  };
}

export const scoreListingAgainstWanted = (listing: IListing, wanted: IWantedPart): MatchResult => {
  let score = 0;
  const breakdown = {
    oemMatch: 0,
    categoryMatch: 0,
    vehicleOverlap: 0,
    nameSimilarity: 0,
    budgetMet: 0,
    locationMatch: 0,
  };

  // 1. OEM Exact Match (40 pts)
  const listingOem = listing.oemNumber?.trim().toLowerCase();
  const wantedOem = (wanted as any).oemNumber?.trim().toLowerCase();
  if (listingOem && wantedOem && listingOem === wantedOem) {
    breakdown.oemMatch = 40;
    score += 40;
  }

  // 2. Category Match (25 pts)
  const listingCat = (listing.categoryName || '').trim().toLowerCase();
  const wantedCat = (wanted.category || '').trim().toLowerCase();
  if (listingCat && wantedCat) {
    if (
      listingCat === wantedCat ||
      listingCat.includes(wantedCat) ||
      wantedCat.includes(listingCat) ||
      (listingCat.includes('exhaust') && wantedCat.includes('exhaust')) ||
      (listingCat.includes('engine') && wantedCat.includes('engine')) ||
      (listingCat.includes('brake') && wantedCat.includes('brake')) ||
      (listingCat.includes('gauge') && wantedCat.includes('gauge')) ||
      (listingCat.includes('light') && wantedCat.includes('light')) ||
      (listingCat.includes('wheel') && wantedCat.includes('wheel')) ||
      (listingCat.includes('body') && wantedCat.includes('body')) ||
      (listingCat.includes('trans') && wantedCat.includes('trans'))
    ) {
      breakdown.categoryMatch = 25;
      score += 25;
    }
  }

  // 3. Vehicle / Variant / Year range overlap (15 pts)
  const isBrandMatch = listing.vehicleBrand.toLowerCase() === wanted.vehicleBrand.toLowerCase();
  const isModelMatch = listing.vehicleModel.toLowerCase() === wanted.vehicleModel.toLowerCase();
  if (isBrandMatch && isModelMatch) {
    breakdown.vehicleOverlap = 15;
    score += 15;
  } else {
    // Check compatibleVehicles
    const compMatch = listing.compatibleVehicles?.some(
      (c) =>
        c.brand.toLowerCase() === wanted.vehicleBrand.toLowerCase() &&
        c.model.toLowerCase() === wanted.vehicleModel.toLowerCase()
    );
    if (compMatch) {
      breakdown.vehicleOverlap = 12;
      score += 12;
    }
  }

  // 4. Part Name String Similarity > 0.6 (10 pts)
  const similarity = calculateStringSimilarity(listing.title, wanted.title || (wanted as any).partName || '');
  if (similarity >= 0.5) {
    breakdown.nameSimilarity = 10;
    score += 10;
  }

  // 5. Price within budget (5 pts)
  const budget = wanted.targetBudget || (wanted as any).budget || 0;
  if (budget > 0 && listing.price <= budget) {
    breakdown.budgetMet = 5;
    score += 5;
  }

  // 6. Location Match: State / City (5 pts)
  const listingCity = listing.location?.city?.toLowerCase();
  const listingState = listing.location?.state?.toLowerCase();
  const wantedCity = wanted.location?.city?.toLowerCase();
  const wantedState = wanted.location?.state?.toLowerCase();

  if (
    (listingCity && wantedCity && listingCity === wantedCity) ||
    (listingState && wantedState && listingState === wantedState)
  ) {
    breakdown.locationMatch = 5;
    score += 5;
  }

  let tier: 'Strong Match' | 'Possible Match' | 'No Match' = 'No Match';
  if (score >= 70) {
    tier = 'Strong Match';
  } else if (score >= 40) {
    tier = 'Possible Match';
  }

  return {
    wantedPartId: wanted._id.toString(),
    score,
    tier,
    breakdown,
  };
};

export const checkAndNotifyWantedMatches = async (listing: IListing): Promise<number> => {
  try {
    const sellerId = listing.seller?.toString() || (listing as any).sellerId?.toString();

    // Look for active open wanted requests
    const openRequests = await WantedPart.find({
      status: { $in: ['searching', 'open', 'matches_found'] },
      $or: [
        { vehicleBrand: new RegExp(listing.vehicleBrand, 'i') },
        { vehicleModel: new RegExp(listing.vehicleModel, 'i') },
        { category: new RegExp(listing.categoryName, 'i') },
      ],
      requester: { $ne: sellerId },
    });

    let matchCount = 0;

    for (const request of openRequests) {
      const result = scoreListingAgainstWanted(listing, request);

      // Spec: score >= 70 -> Strong Match; 40-69 -> Possible Match; below 40 -> no notification
      if (result.tier !== 'No Match') {
        const isAlreadyMatched = request.matchingListings?.some(
          (id) => id.toString() === listing._id.toString()
        );

        if (!isAlreadyMatched) {
          if (!request.matchingListings) request.matchingListings = [];
          request.matchingListings.push(listing._id as any);
          request.status = 'matches_found';
          await request.save();

          const buyerId = (request.requester || (request as any).buyerId)?.toString();
          if (buyerId) {
            // Create notification with tier and score
            const notification = await Notification.create({
              user: buyerId,
              type: 'wanted-match',
              title: `Rare Part Match Found: ${result.tier}!`,
              message: `A seller listed "${listing.title}" for ₹${listing.price.toLocaleString('en-IN')} (${result.tier} • Score ${result.score}/100), matching your request for ${request.vehicleBrand} ${request.vehicleModel}!`,
              link: `/parts/${listing._id}`,
              payload: {
                listingId: listing._id,
                wantedPartId: request._id,
                matchScore: result.score,
                matchTier: result.tier,
                breakdown: result.breakdown,
              },
              data: {
                listingId: listing._id,
                wantedPartId: request._id,
                matchScore: result.score,
                matchTier: result.tier,
              },
              read: false,
            });

            // Emit real-time notification
            emitToUser(buyerId, 'notification:new', notification);
            matchCount++;
          }
        }
      }
    }

    return matchCount;
  } catch (error) {
    console.error('Error in checkAndNotifyWantedMatches:', error);
    return 0;
  }
};
