import config from "../../../../payload.config";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes";

const payloadGet = REST_GET(config);

export const GET = payloadGet;
export const HEAD: typeof payloadGet = async (request, args) => {
  const getResponse = await payloadGet(
    new Request(request.url, {
      headers: request.headers,
      method: "GET",
    }),
    args,
  );

  await getResponse.body?.cancel().catch(() => undefined);

  return new Response(null, {
    headers: getResponse.headers,
    status: getResponse.status,
    statusText: getResponse.statusText,
  });
};
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);
