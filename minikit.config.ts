const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header:
      "eyJmaWQiOjYxNjIsInR5cGUiOiJhdXRoIiwia2V5IjoiMHg1MmE0NTdCZGU1NGZERWFGNzIxOTlBQTZhNjJENUMwMjdiQzhDYmQ4In0",
    payload: "eyJkb21haW4iOiI4MDIxLWd1ZXN0Ym9vay52ZXJjZWwuYXBwIn0",
    signature:
      "xp5dmAKxM2LATUBXGr9JI4w2ac8K3894MHXp033rq/NQst1qiI8frIA/KiIg+/q4YTNl14wudE4uxuVXXHg1Mxw=",
  },
  baseBuilder: {
    ownerAddress: "0xfa6b3df826636eb76e23c1ee38180db3b8f60a86",
  },
  miniapp: {
    version: "1",
    name: "ERC-8021 Guestbook",
    subtitle: "Sign it! Sign it!",
    description: "Demo app to test the ERC-8021 attribution standard",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["ERC-8021", "demo"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
