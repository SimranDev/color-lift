export default defineBackground(() => {
  const contentScriptMatches = new MatchPattern('*://*/*');

  browser.runtime.onMessage.addListener(async (message) => {
    // The toast belongs where the user is working, so it goes to the active tab
    // of the current window rather than every tab running the content script.
    const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });

    if (activeTab?.id == null || activeTab.url == null) return;
    if (!contentScriptMatches.includes(activeTab.url)) return;

    try {
      return await browser.tabs.sendMessage(activeTab.id, message);
    } catch (error) {
      // No content script on the page yet (or it was torn down mid-navigation).
      console.error(`Error sending message to tab ${activeTab.id}:`, error);
    }
  });
});
