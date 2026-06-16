import { boot } from "https://v2-11-1--edge.netlify.com/bootstrap/index-combined.ts";

const functions = {}; const metadata = { functions: {} };


      try {
        const { default: func } = await import("file:///Users/admin/Desktop/website-roj/rogetjames-website/netlify/edge-functions/chat.js");

        if (typeof func === "function") {
          functions["chat"] = func;
          metadata.functions["chat"] = {"url":"file:///Users/admin/Desktop/website-roj/rogetjames-website/netlify/edge-functions/chat.js"}
        } else {
          console.log("◈ Failed to load Edge Function chat. The file does not seem to have a function as the default export.");
        }
      } catch (error) {
        console.log("◈ Failed to run Edge Function chat:");
        console.error(error);
      }
      

boot(functions, metadata);