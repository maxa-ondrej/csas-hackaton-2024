type AwaitedLoader<T extends object> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K];
};

type AnyLoader = Record<string, unknown>;

export const createLoader = async <T extends AnyLoader>(input: T) =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(input).map(
        async ([key, value]) => [key, await value] as const,
      ),
    ),
  ) as AwaitedLoader<T>;
