// tslint:disable: no-empty

import mockAxios from "jest-mock-axios";
import Requester from "../requester";
import loader from "./loader";

const ENDPOINT = "https://example.com/graphql";

describe("graphql-requester/loader", () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it("should call onBefore and onAfter in right order", done => {
    const params: any = ["test", "", { withLoader: true }];
    const expectedData = "test";
    const response = { data: "test" };

    const onBeforeFn = jest.fn();
    const onAfterFn = jest.fn();
    let onBeforeCall: Date;
    let onAfterCall: Date;

    const onBefore = () => {
      onBeforeFn();
      onBeforeCall = new Date();
    };

    const onAfter = () => {
      onAfterFn();
      onAfterCall = new Date();
    };

    const loaderMiddleware = loader({
      onBefore,
      onAfter
    });

    const localRequest = Requester({
      url: ENDPOINT,
      middlewares: [loaderMiddleware]
    });

    localRequest(params[0], params[1], params[2]).then(({ data }) => {
      expect(onBeforeFn).toBeCalled();
      expect(onAfterFn).toBeCalled();
      expect(onBeforeCall.getTime() < onAfterCall.getTime()).toBeTruthy();
      expect(data).toEqual(expectedData);

      done();
    });

    setTimeout(() => {
      mockAxios.mockResponse(response);
    }, 2);
  });

  it("should call onBefore and onAfter in right order if failed", done => {
    const params: any = ["test", "", { withLoader: true }];
    const expectedError = "Error";
    const response = { error: "Error" };

    const onBeforeFn = jest.fn();
    const onAfterFn = jest.fn();
    let onBeforeCall: Date;
    let onAfterCall: Date;

    const onBefore = () => {
      onBeforeFn();
      onBeforeCall = new Date();
    };

    const onAfter = () => {
      onAfterFn();
      onAfterCall = new Date();
    };

    const loaderMiddleware = loader({
      onBefore,
      onAfter
    });

    const localRequest = Requester({
      url: ENDPOINT,
      middlewares: [loaderMiddleware]
    });

    localRequest(params[0], params[1], params[2]).then(
      () => {},
      ({ error }) => {
        expect(onBeforeFn).toBeCalled();
        expect(onAfterFn).toBeCalled();
        expect(onBeforeCall.getTime() < onAfterCall.getTime()).toBeTruthy();
        expect(error).toEqual(expectedError);

        done();
      }
    );

    setTimeout(() => {
      mockAxios.mockError(response);
    }, 2);
  });

  it("should work normally if withLoader is false", done => {
    const params: any = ["test", "", { withLoader: false }];
    const expectedData = "test";
    const response = { data: "test" };

    const onBeforeFn = jest.fn();
    const onAfterFn = jest.fn();

    const onBefore = () => {
      onBeforeFn();
    };

    const onAfter = () => {
      onAfterFn();
    };

    const loaderMiddleware = loader({
      onBefore,
      onAfter
    });

    const localRequest = Requester({
      url: ENDPOINT,
      middlewares: [loaderMiddleware]
    });

    localRequest(params[0], params[1], params[2]).then(({ data }) => {
      expect(onBeforeFn).not.toBeCalled();
      expect(onAfterFn).not.toBeCalled();
      expect(data).toEqual(expectedData);

      done();
    });

    setTimeout(() => {
      mockAxios.mockResponse(response);
    }, 2);
  });

  it("should work normally if no opts passed", done => {
    const params: any = ["test", ""];
    const expectedData = "test";
    const response = { data: "test" };

    const onBeforeFn = jest.fn();
    const onAfterFn = jest.fn();

    const onBefore = () => {
      onBeforeFn();
    };

    const onAfter = () => {
      onAfterFn();
    };

    const loaderMiddleware = loader({
      onBefore,
      onAfter
    });

    const localRequest = Requester({
      url: ENDPOINT,
      middlewares: [loaderMiddleware]
    });

    localRequest(params[0], params[1], params[2]).then(({ data }) => {
      expect(onBeforeFn).not.toBeCalled();
      expect(onAfterFn).not.toBeCalled();
      expect(data).toEqual(expectedData);

      done();
    });

    setTimeout(() => {
      mockAxios.mockResponse(response);
    }, 2);
  });
});
