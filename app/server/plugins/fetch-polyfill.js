import fetch, { Headers, Request, Response } from 'node-fetch';

export default defineNitroPlugin(() => {
  // polyfill only if missing (Node < 18)
  if (typeof globalThis.fetch === 'undefined') {
    globalThis.fetch = fetch;
    globalThis.Headers = Headers;
    globalThis.Request = Request;
    globalThis.Response = Response;
    console.log('✅ fetch & Headers polyfilled for Node <18');
  }
});
