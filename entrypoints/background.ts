export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message) => {
    // Grab tabs matching content scripts
    const allTabs = await browser.tabs.query({});
    const contentScriptMatches = new MatchPattern('*://*/*');
    const contentScriptTabs = allTabs.filter(
      (tab) => tab.id != null && tab.url != null && contentScriptMatches.includes(tab.url)
    );

    // Forward message to tabs, collecting the responses
    const responses = await Promise.all(
      contentScriptTabs.map(async (tab) => {
        try {
          const response = await browser.tabs.sendMessage(tab.id!, message);
          return { tab: tab.id, response };
        } catch (error) {
          console.error(`Error sending message to tab ${tab.id}:`, error);
          return { tab: tab.id, error };
        }
      })
    );

    // Return an array of all responses back to popup.
    return responses;
  });
});
