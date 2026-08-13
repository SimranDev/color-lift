/**
 * The popup and the side panel render the exact same UI, but they have opposite
 * lifecycles: the popup is a one-shot surface that should get out of the way
 * after a copy, while the side panel stays docked while you work.
 *
 * WXT emits `entrypoints/sidepanel/index.html` as `sidepanel.html` at the root
 * of the bundle, so the pathname is all it takes to tell them apart — no
 * context plumbing through every component that copies a colour.
 */
export function isSidePanel() {
  return globalThis.location?.pathname.includes('sidepanel') ?? false;
}
