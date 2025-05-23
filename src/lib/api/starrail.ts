import { StarRail } from "starrail.js";

// Initialize the StarRail client
// Sets the cache directory to './cache' at the root of the project
// This helps in persisting cache across deployments/restarts if the volume is mapped correctly.
const starRailClient = new StarRail({
  cacheDirectory: "./cache",
  // showFetchCacheLog: true, // This is true by default, good for debugging
  // defaultLanguage: "en" // The library seems to handle language per request, not globally here.
});

// Ensure the cache directory is set up.
// This might create the directory if it doesn't exist.
starRailClient.cachedAssetsManager.cacheDirectorySetup();

// Activate auto cache updater to keep game data fresh
starRailClient.cachedAssetsManager.activateAutoCacheUpdater({
  instant: true, // Run the first update check immediately
  timeout: 60 * 60 * 1000, // Every 1 hour
  onUpdateStart: async () => {
    try {
      console.log("StarRail Auto Cache Updater: Update started.");
    } catch (e) {
      console.error("StarRail Auto Cache Updater: Error in onUpdateStart callback:", e);
    }
  },
  onUpdateEnd: async () => {
    try {
      await starRailClient.cachedAssetsManager.refreshAllData(); // Refresh memory with new data
      console.log("StarRail Auto Cache Updater: Update finished. Memory refreshed.");
    } catch (e) {
      console.error("StarRail Auto Cache Updater: Error in onUpdateEnd callback:", e);
      // Optionally, re-throw or handle if refreshAllData() failing is critical
      // For now, just logging it here is fine.
    }
  },
  onError: async (error: Error) => { // Matched type to Error as per original if it was specific, or unknown if more general
    console.error("StarRail Auto Cache Updater: An error occurred during update:", error);
  }
});

console.log("[StarRail] Client initialized and auto cache updater activated.");

export { starRailClient };
