/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  R2_BUCKET: R2Bucket;
}

const sevenDays = 7 * 24 * 60 * 60 * 1000;

const find_old = async (env: Env, ctx: ExecutionContext) => {
  const listed = await env.R2_BUCKET.list();

  let truncated = listed.truncated;
  let cursor = truncated ? listed.cursor : undefined;

  while (truncated) {
    const next = await env.R2_BUCKET.list({
      cursor,
    });

    listed.objects.push(...next.objects);

    truncated = next.truncated;
    cursor = next.cursor;
  }

  const now = new Date().getTime();

  const old = listed.objects.filter(
    (obj) => now - new Date(obj.uploaded).getTime() >= sevenDays
  );

  return old;
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const old = await find_old(env, ctx);

    return Response.json(old, { status: 200 });
  },
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const old = await find_old(env, ctx);

    old.forEach((obj) => env.R2_BUCKET.delete(obj.key));

    console.log(`Deleted ${old.length} objects`);
  },
};
