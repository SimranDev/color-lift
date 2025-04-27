import "~/assets/tailwind.css";

export default defineContentScript({
  matches: ["*://*/*"],
  main() {
    console.log("Hello content.");
  },
});
