// Serves a single uploaded "Up Close" image from Netlify Blobs.
import { getStore } from "@netlify/blobs";

const STORE = "up-close-images";

export default async function handler(req) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });
  try {
    const store = getStore({ name: STORE, consistency: "strong" });
    const res = await store.getWithMetadata(id, { type: "arrayBuffer" });
    if (!res || !res.data) return new Response("Not found", { status: 404 });
    return new Response(res.data, {
      status: 200,
      headers: {
        "Content-Type": res.metadata?.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response("Error", { status: 500 });
  }
}

export const config = { path: "/api/up-close-img" };
