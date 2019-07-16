import { Middleware } from "../requester";

export type DedupeOpts = {
  multiple?: boolean;
};

const requests = new Map();

const dedupe: Middleware<DedupeOpts> = ctx => {
  const { multiple = false } = ctx.opts || {};

  if (multiple) {
    return;
  }

  const cacheKey = `${ctx.name}.${ctx.query}`;

  if (requests.has(cacheKey)) {
    const call = requests.get(cacheKey);
    ctx.call = call;
    ctx.cancelled = true;

    return;
  }

  ctx.call.finally(() => requests.delete(cacheKey));

  requests.set(cacheKey, ctx.call);
};

export default dedupe;
