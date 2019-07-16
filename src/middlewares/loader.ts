import { Middleware } from "../requester";

export type LoaderInitialiser = {
  onBefore: () => void;
  onAfter: () => void;
};

export type LoaderOpts = {
  withLoader?: boolean;
};

const loader = (
  initalizer: LoaderInitialiser
): Middleware<LoaderOpts> => ctx => {
  const withLoader =
    ctx.opts && typeof ctx.opts.withLoader === "boolean"
      ? ctx.opts.withLoader
      : false;

  if (withLoader) {
    initalizer.onBefore();

    ctx.call.then(
      (...args) => {
        initalizer.onAfter();
        return args;
      },
      (...args) => {
        initalizer.onAfter();
        return args;
      }
    );
  }
};

export default loader;
