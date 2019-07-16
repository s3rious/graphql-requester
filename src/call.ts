import { AxiosInstance } from "axios";
import { Context, Name, Query, Url } from "./requester";

type ControllablePromise<T> = { fire: () => Promise<T> } & Promise<T>;

const Call = (
  ctx: Context<{}>,
  fetcher: AxiosInstance,
  url: Url,
  name: Name,
  query: Query
) => {
  let callResolve: (value?: {}) => void;
  let callReject: (reason?: any) => void;

  const promise = new Promise((resolve, reject) => {
    callResolve = resolve;
    callReject = reject;
  }) as ControllablePromise<{}>;

  promise.fire = async () => {
    const post = fetcher.post(`${url}?name=${name}`, { query });

    try {
      let response = await post;
      if (ctx.preprocessors && ctx.preprocessors.length) {
        response = ctx.preprocessors.reduce(
          (val, processor) => processor(val),
          response
        );
      }
      callResolve(response);

      return promise;
    } catch (err) {
      let error = err;
      if (ctx.errorHandlers && ctx.errorHandlers.length) {
        error = ctx.errorHandlers.reduce((val, handler) => handler(val), error);
      }
      callReject(error);

      return promise;
    }
  };

  return promise;
};

export default Call;
