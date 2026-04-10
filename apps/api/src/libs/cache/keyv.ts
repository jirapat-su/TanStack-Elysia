import Keyv from "keyv";

type CreateKeyvOptions = {
  namespace?: string;
  ttl?: number;
};

const DEFAULT_TTL = 5 * 60 * 1000;

export const createKeyvInstance = <T = unknown>(
  options?: CreateKeyvOptions,
): Keyv<T> => {
  return new Keyv<T>({
    store: new Map(),
    namespace: options?.namespace ?? "api",
    ttl: options?.ttl ?? DEFAULT_TTL,
  });
};
