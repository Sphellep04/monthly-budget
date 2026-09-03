import type { CategoryRule } from "../types";

/**
 * Built-in merchant-keyword -> category defaults, weighted toward common
 * Namibian and southern African retailers/services. These are a starting
 * point, not a claim of completeness - user-learned rules (from
 * CategoryRule, built by picking a category after a suggestion misses or is
 * absent) always take priority over these defaults, and are checked first
 * in suggestCategory below.
 */
export const DEFAULT_MERCHANT_RULES: Record<string, string> = {
  shoprite: "Groceries",
  checkers: "Groceries",
  "pick n pay": "Groceries",
  spar: "Groceries",
  "fruit & veg": "Groceries",
  "fruit and veg": "Groceries",
  woermann: "Groceries",
  "food lovers": "Groceries",
  shell: "Transportation",
  engen: "Transportation",
  puma: "Transportation",
  total: "Transportation",
  bolt: "Transportation",
  taxi: "Transportation",
  uber: "Transportation",
  intercape: "Transportation",
  mtc: "Utilities",
  "tn mobile": "Utilities",
  telecom: "Utilities",
  nampower: "Utilities",
  namwater: "Utilities",
  electricity: "Utilities",
  kfc: "Dining Out",
  "hungry lion": "Dining Out",
  nandos: "Dining Out",
  "nando's": "Dining Out",
  wimpy: "Dining Out",
  debonairs: "Dining Out",
  steers: "Dining Out",
  starbucks: "Dining Out",
  restaurant: "Dining Out",
  cafe: "Dining Out",
  netflix: "Entertainment",
  showmax: "Entertainment",
  dstv: "Entertainment",
  spotify: "Entertainment",
  multichoice: "Entertainment",
  pharmacy: "Health",
  clicks: "Health",
  dischem: "Health",
  "dis-chem": "Health",
  medipark: "Health",
  hospital: "Health",
  game: "Shopping",
  pep: "Shopping",
  ackermans: "Shopping",
  "mr price": "Shopping",
  edgars: "Shopping",
  woolworths: "Shopping",
  rent: "Housing",
  landlord: "Housing",
  "school fees": "Education",
  tuition: "Education",
  nust: "Education",
  unam: "Education",
};

export interface CategorySuggestion {
  category: string;
  /** "learned" rules (from CategoryRule) always win over "default" ones. */
  source: "learned" | "default";
  matchedKeyword: string;
}

/**
 * Suggests a category for free text (an expense note, a parsed SMS/receipt
 * merchant line) by matching known keywords. User-learned rules are checked
 * first and win over the built-in defaults, so a correction the user makes
 * once keeps applying. Returns null when nothing matches.
 */
export function suggestCategory(
  text: string,
  learnedRules: CategoryRule[] = [],
): CategorySuggestion | null {
  const lower = text.toLowerCase();

  for (const rule of learnedRules) {
    if (lower.includes(rule.keyword.toLowerCase())) {
      return {
        category: rule.category,
        source: "learned",
        matchedKeyword: rule.keyword,
      };
    }
  }

  for (const [keyword, category] of Object.entries(DEFAULT_MERCHANT_RULES)) {
    if (lower.includes(keyword)) {
      return { category, source: "default", matchedKeyword: keyword };
    }
  }

  return null;
}

/**
 * Extracts a short, learnable keyword from free text - e.g. the first
 * "word-like" token, so "SHOPRITE WINDHOEK" learns "shoprite" rather than
 * the whole line (which would never match again verbatim).
 */
export function extractKeyword(text: string): string | null {
  const match = text.trim().match(/[a-zA-Z][a-zA-Z'&-]{2,}/);
  return match ? match[0].toLowerCase() : null;
}
