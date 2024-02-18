import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/uploadPdf",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Step 1: Store the file
    const noteId = new URL(request.url).searchParams.get("noteId");
    if (!noteId) {
      return new Response(null, { status: 469 });
    }
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    // Step 2: Save the storage ID to the database via a mutation
    await ctx.runMutation(api.noteLatexPdf.insertLatexPdf, {
      latexpdfStorageId: storageId,
      noteId: noteId,
    });

    // Step 3: Return a response with the correct CORS headers
    return new Response(null, {
      status: 200,
      // CORS headers
      headers: new Headers({
        "Access-Control-Allow-Origin": "http://localhost:5173",
        Vary: "origin",
      }),
    });
  }),
});


// Pre-flight request for /sendImage
http.route({
  path: "/uploadPdf",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com, configured on your Convex dashboard
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

export default http;