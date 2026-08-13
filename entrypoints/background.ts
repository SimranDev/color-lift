export default defineBackground(() => {
  const contentScriptMatches = new MatchPattern('*://*/*');

  // A content script only reaches pages that load after it is registered, so
  // every tab already open at install time would stay toast-less until it
  // happened to reload. Inject into those up front. An update needs the same
  // treatment: it invalidates the previous content script contexts, leaving
  // open tabs with a dead listener.
  browser.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== 'install' && reason !== 'update') return;

    // Read the file list off the manifest rather than hardcoding it, so this
    // keeps working if the content script is renamed or another one is added.
    // The manifest stores them relative; executeScript wants them rooted.
    const files = (browser.runtime.getManifest().content_scripts ?? [])
      .flatMap((script) => script.js ?? [])
      .map((path) => `/${path}` as ScriptPublicPath);

    if (files.length === 0) return;

    const tabs = await browser.tabs.query({ url: ['https://*/*', 'http://*/*'] });

    await Promise.all(
      tabs.map(async (tab) => {
        if (tab.id == null) return;

        try {
          await browser.scripting.executeScript({ target: { tabId: tab.id }, files });
        } catch {
          // Injection is blocked on the Web Store and other extensions' pages.
          // Those can't show a toast either way, so there is nothing to do.
        }
      })
    );
  });

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
