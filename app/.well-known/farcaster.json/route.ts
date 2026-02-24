const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

const manifest = {
  accountAssociation: {
    header:
      "eyJmaWQiOjYxNjIsInR5cGUiOiJhdXRoIiwia2V5IjoiMHg1MmE0NTdCZGU1NGZERWFGNzIxOTlBQTZhNjJENUMwMjdiQzhDYmQ4In0",
    payload: "eyJkb21haW4iOiI4MDIxLWd1ZXN0Ym9vay52ZXJjZWwuYXBwIn0",
    signature:
      "xp5dmAKxM2LATUBXGr9JI4w2ac8K3894MHXp033rq/NQst1qiI8frIA/KiIg+/q4YTNl14wudE4uxuVXXHg1Mxw=",
  },
  miniapp: {
    version: "1",
    name: "ERC-8021 Guestbook",
    subtitle: "Sign it! Sign it!",
    description: "Demo app to test the ERC-8021 attribution standard",
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["ERC-8021", "demo"],
    imageUrl: `${ROOT_URL}/hero.png`,
  },
};

export async function GET() {
  return Response.json(manifest);
}
