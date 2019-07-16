import { Middleware } from "../requester";

const errorExtract: Middleware<never> = ctx => {
  ctx.errorHandlers = ctx.errorHandlers;
  ctx.errorHandlers.push(response => {
    if (response && response.errors) {
      return response.errors;
    }

    return response;
  });
};

export default errorExtract;
