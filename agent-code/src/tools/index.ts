import { scanSearchResults } from './scan_search_results';
import { scanSellerListings } from './scan_seller_listings';
import { analyzeMarketTrends } from './analyze_market_trends';
import { draftMessage } from './draft_message';
import { getUserProfile } from './get_user_profile';
import { triggerFrontendAction } from './trigger_frontend_action';

export const tools = [
  scanSearchResults,
  scanSellerListings,
  analyzeMarketTrends,
  draftMessage,
  getUserProfile,
  triggerFrontendAction
];
