import { showToast } from '~/components/CustomToast';

declare global {
  interface Window {
    __colorLiftToastReady?: boolean;
  }
}

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    // The background script injects this into tabs that were already open at
    // install time, which can race with the normal registration on a tab that
    // happens to load right then. Two listeners would render the toast twice.
    if (window.__colorLiftToastReady) return;
    window.__colorLiftToastReady = true;

    browser.runtime.onMessage.addListener(async (message) => {
      if (message) {
        showToast(message);
      }
      return Math.random();
    });
  },
});
