import 'dotenv/config';
import { db } from './src/firebase';

async function test() {
  console.log("Fetching seller_listings...");
  const listings = await db.collection('seller_listings').get();
  console.log("Seller Listings Count:", listings.size);
  listings.forEach(doc => console.log(doc.id, doc.data()));

  console.log("\nFetching search_results...");
  const results = await db.collection('search_results').get();
  console.log("Search Results Count:", results.size);
  results.forEach(doc => console.log(doc.id, doc.data()));
}

test().catch(console.error);
