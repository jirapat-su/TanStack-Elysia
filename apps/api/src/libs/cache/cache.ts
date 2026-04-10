import { Context, Effect, Layer } from "effect";
import type Keyv from "keyv";
import { createKeyvInstance } from "@/libs/cache/keyv";

export type CacheSetOptions = {
  ttl?: number;
  tags?: string[];
};

type CacheService = {
  readonly get: <T>(key: string) => Effect.Effect<T | undefined>;
  readonly set: <T>(
    key: string,
    value: T,
    options?: CacheSetOptions,
  ) => Effect.Effect<void>;
  readonly getOrSet: <T>(
    key: string,
    fetcher: () => Effect.Effect<T>,
    options?: CacheSetOptions,
  ) => Effect.Effect<T>;
  readonly delete: (key: string) => Effect.Effect<void>;
  readonly invalidateByTag: (tag: string) => Effect.Effect<void>;
  readonly clear: () => Effect.Effect<void>;
};

export const CacheService = Context.GenericTag<CacheService>("CacheService");

const logCacheError = (operation: string, error: unknown) =>
  Effect.logWarning(`Cache ${operation} failed`).pipe(
    Effect.annotateLogs("error", String(error)),
  );

const safeCacheGet = <T>(
  store: Keyv,
  key: string,
): Effect.Effect<T | undefined> =>
  Effect.tryPromise({
    try: () => store.get<T>(key),
    catch: (e) => e,
  }).pipe(
    Effect.catchAll((e) =>
      Effect.gen(function* () {
        yield* logCacheError("get", e);
        return undefined;
      }),
    ),
  );

const safeCacheSet = <T>(
  store: Keyv,
  key: string,
  value: T,
  ttl?: number,
): Effect.Effect<void> =>
  Effect.tryPromise({
    try: () => store.set(key, value, ttl),
    catch: (e) => e,
  }).pipe(
    Effect.map(() => undefined),
    Effect.catchAll((e) =>
      logCacheError("set", e).pipe(Effect.map(() => undefined)),
    ),
  );

const safeCacheDelete = (store: Keyv, key: string): Effect.Effect<void> =>
  Effect.tryPromise({
    try: () => store.delete(key),
    catch: (e) => e,
  }).pipe(
    Effect.map(() => undefined),
    Effect.catchAll((e) =>
      logCacheError("delete", e).pipe(Effect.map(() => undefined)),
    ),
  );

const safeCacheClear = (store: Keyv): Effect.Effect<void> =>
  Effect.tryPromise({
    try: () => store.clear(),
    catch: (e) => e,
  }).pipe(
    Effect.catchAll((e) =>
      logCacheError("clear", e).pipe(Effect.map(() => undefined)),
    ),
  );

export const CacheServiceLive = Layer.succeed(
  CacheService,
  (() => {
    const store = createKeyvInstance();
    const tagRegistry = new Map<string, Set<string>>();

    const registerTags = (key: string, tags: string[]) => {
      for (const tag of tags) {
        const keys = tagRegistry.get(tag) ?? new Set();
        keys.add(key);
        tagRegistry.set(tag, keys);
      }
    };

    const unregisterKey = (key: string) => {
      for (const [tag, keys] of [...tagRegistry]) {
        keys.delete(key);
        if (keys.size === 0) {
          tagRegistry.delete(tag);
        }
      }
    };

    return CacheService.of({
      get: <T>(key: string) =>
        Effect.gen(function* () {
          const result = yield* safeCacheGet<T>(store, key);
          if (result === undefined) {
            unregisterKey(key);
          }
          return result;
        }),

      set: <T>(key: string, value: T, options?: CacheSetOptions) =>
        Effect.gen(function* () {
          yield* safeCacheSet(store, key, value, options?.ttl);
          if (options?.tags) {
            registerTags(key, options.tags);
          }
        }),

      getOrSet: <T>(
        key: string,
        fetcher: () => Effect.Effect<T>,
        options?: CacheSetOptions,
      ) =>
        Effect.gen(function* () {
          const cached = yield* safeCacheGet<T>(store, key);
          if (cached !== undefined) {
            return cached;
          }

          unregisterKey(key);
          const fresh = yield* fetcher();
          yield* safeCacheSet(store, key, fresh, options?.ttl);
          if (options?.tags) {
            registerTags(key, options.tags);
          }
          return fresh;
        }),

      delete: (key: string) =>
        Effect.gen(function* () {
          yield* safeCacheDelete(store, key);
          unregisterKey(key);
        }),

      invalidateByTag: (tag: string) =>
        Effect.gen(function* () {
          const keys = tagRegistry.get(tag);
          if (!keys) return;

          yield* Effect.all(
            [...keys].map((key) => safeCacheDelete(store, key)),
            { concurrency: "unbounded" },
          );

          for (const key of [...keys]) {
            unregisterKey(key);
          }
          tagRegistry.delete(tag);
        }),

      clear: () =>
        Effect.gen(function* () {
          yield* safeCacheClear(store);
          tagRegistry.clear();
        }),
    });
  })(),
);
