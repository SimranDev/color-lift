import { showToast } from '~/components/CustomToast';

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    browser.runtime.onMessage.addListener(async (message) => {
      if (message) {
        showToast(message);
      }
      return Math.random();
    });
  },
});
