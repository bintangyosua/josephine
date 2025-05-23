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
    console.log("[StarRail] Starting Star Rail Data update...");
  },
  onUpdateEnd: async () => {
    try {
      await starRailClient.cachedAssetsManager.refreshAllData(); // Refresh memory with new data
      console.log("[StarRail] Star Rail Data update completed and refreshed!");
    } catch (error) {
      console.error("[StarRail] Error refreshing data after update:", error);
    }
  },
  onError: async (error: Error) => {
    console.error("[StarRail] Error during auto cache update:", error);
  }
});

console.log("[StarRail] Client initialized and auto cache updater activated.");

export { starRailClient };
