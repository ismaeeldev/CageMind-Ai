
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model Fighter
 * 
 */
export type Fighter = $Result.DefaultSelection<Prisma.$FighterPayload>
/**
 * Model Event
 * 
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model Fight
 * 
 */
export type Fight = $Result.DefaultSelection<Prisma.$FightPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fighter`: Exposes CRUD operations for the **Fighter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Fighters
    * const fighters = await prisma.fighter.findMany()
    * ```
    */
  get fighter(): Prisma.FighterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fight`: Exposes CRUD operations for the **Fight** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Fights
    * const fights = await prisma.fight.findMany()
    * ```
    */
  get fight(): Prisma.FightDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Subscription: 'Subscription',
    Fighter: 'Fighter',
    Event: 'Event',
    Fight: 'Fight'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "subscription" | "fighter" | "event" | "fight"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      Fighter: {
        payload: Prisma.$FighterPayload<ExtArgs>
        fields: Prisma.FighterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FighterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FighterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FighterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FighterPayload>
          }
          findFirst: {
            args: Prisma.FighterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FighterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FighterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FighterPayload>
          }
          findMany: {
            args: Prisma.FighterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FighterPayload>[]
          }
          create: {
            args: Prisma.FighterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FighterPayload>
          }
          createMany: {
            args: Prisma.FighterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FighterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FighterPayload>[]
          }
          delete: {
            args: Prisma.FighterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FighterPayload>
          }
          update: {
            args: Prisma.FighterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FighterPayload>
          }
          deleteMany: {
            args: Prisma.FighterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FighterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FighterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FighterPayload>[]
          }
          upsert: {
            args: Prisma.FighterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FighterPayload>
          }
          aggregate: {
            args: Prisma.FighterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFighter>
          }
          groupBy: {
            args: Prisma.FighterGroupByArgs<ExtArgs>
            result: $Utils.Optional<FighterGroupByOutputType>[]
          }
          count: {
            args: Prisma.FighterCountArgs<ExtArgs>
            result: $Utils.Optional<FighterCountAggregateOutputType> | number
          }
        }
      }
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      Fight: {
        payload: Prisma.$FightPayload<ExtArgs>
        fields: Prisma.FightFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FightFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FightPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FightFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FightPayload>
          }
          findFirst: {
            args: Prisma.FightFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FightPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FightFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FightPayload>
          }
          findMany: {
            args: Prisma.FightFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FightPayload>[]
          }
          create: {
            args: Prisma.FightCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FightPayload>
          }
          createMany: {
            args: Prisma.FightCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FightCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FightPayload>[]
          }
          delete: {
            args: Prisma.FightDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FightPayload>
          }
          update: {
            args: Prisma.FightUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FightPayload>
          }
          deleteMany: {
            args: Prisma.FightDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FightUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FightUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FightPayload>[]
          }
          upsert: {
            args: Prisma.FightUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FightPayload>
          }
          aggregate: {
            args: Prisma.FightAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFight>
          }
          groupBy: {
            args: Prisma.FightGroupByArgs<ExtArgs>
            result: $Utils.Optional<FightGroupByOutputType>[]
          }
          count: {
            args: Prisma.FightCountArgs<ExtArgs>
            result: $Utils.Optional<FightCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    subscription?: SubscriptionOmit
    fighter?: FighterOmit
    event?: EventOmit
    fight?: FightOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type FighterCountOutputType
   */

  export type FighterCountOutputType = {
    fightsAsFighter1: number
    fightsAsFighter2: number
    fightsWon: number
  }

  export type FighterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fightsAsFighter1?: boolean | FighterCountOutputTypeCountFightsAsFighter1Args
    fightsAsFighter2?: boolean | FighterCountOutputTypeCountFightsAsFighter2Args
    fightsWon?: boolean | FighterCountOutputTypeCountFightsWonArgs
  }

  // Custom InputTypes
  /**
   * FighterCountOutputType without action
   */
  export type FighterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FighterCountOutputType
     */
    select?: FighterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FighterCountOutputType without action
   */
  export type FighterCountOutputTypeCountFightsAsFighter1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FightWhereInput
  }

  /**
   * FighterCountOutputType without action
   */
  export type FighterCountOutputTypeCountFightsAsFighter2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FightWhereInput
  }

  /**
   * FighterCountOutputType without action
   */
  export type FighterCountOutputTypeCountFightsWonArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FightWhereInput
  }


  /**
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    fights: number
  }

  export type EventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fights?: boolean | EventCountOutputTypeCountFightsArgs
  }

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountFightsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FightWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    passwordHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    passwordHash: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "passwordHash" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscription?: boolean | User$subscriptionArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      subscription: Prisma.$SubscriptionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      passwordHash: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subscription<T extends User$subscriptionArgs<ExtArgs> = {}>(args?: Subset<T, User$subscriptionArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.subscription
   */
  export type User$subscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    status: string | null
    currentPeriodEnd: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    status: string | null
    currentPeriodEnd: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    userId: number
    stripeCustomerId: number
    stripeSubscriptionId: number
    status: number
    currentPeriodEnd: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    id?: true
    userId?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    status?: true
    currentPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    userId?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    status?: true
    currentPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    userId?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    status?: true
    currentPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    userId: string
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    status: string
    currentPeriodEnd: Date | null
    createdAt: Date
    updatedAt: Date
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    status?: boolean
    currentPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    status?: boolean
    currentPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    status?: boolean
    currentPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    userId?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    status?: boolean
    currentPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "stripeCustomerId" | "stripeSubscriptionId" | "status" | "currentPeriodEnd" | "createdAt" | "updatedAt", ExtArgs["result"]["subscription"]>
  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      stripeCustomerId: string | null
      stripeSubscriptionId: string | null
      status: string
      currentPeriodEnd: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions and returns the data updated in the database.
     * @param {SubscriptionUpdateManyAndReturnArgs} args - Arguments to update many Subscriptions.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly userId: FieldRef<"Subscription", 'String'>
    readonly stripeCustomerId: FieldRef<"Subscription", 'String'>
    readonly stripeSubscriptionId: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
    readonly currentPeriodEnd: FieldRef<"Subscription", 'DateTime'>
    readonly createdAt: FieldRef<"Subscription", 'DateTime'>
    readonly updatedAt: FieldRef<"Subscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
  }

  /**
   * Subscription updateManyAndReturn
   */
  export type SubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to delete.
     */
    limit?: number
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model Fighter
   */

  export type AggregateFighter = {
    _count: FighterCountAggregateOutputType | null
    _avg: FighterAvgAggregateOutputType | null
    _sum: FighterSumAggregateOutputType | null
    _min: FighterMinAggregateOutputType | null
    _max: FighterMaxAggregateOutputType | null
  }

  export type FighterAvgAggregateOutputType = {
    age: number | null
    height: number | null
    reach: number | null
    wins: number | null
    losses: number | null
    draws: number | null
    koWins: number | null
    subWins: number | null
    eloRating: number | null
  }

  export type FighterSumAggregateOutputType = {
    age: number | null
    height: number | null
    reach: number | null
    wins: number | null
    losses: number | null
    draws: number | null
    koWins: number | null
    subWins: number | null
    eloRating: number | null
  }

  export type FighterMinAggregateOutputType = {
    id: string | null
    name: string | null
    weightClass: string | null
    age: number | null
    height: number | null
    reach: number | null
    wins: number | null
    losses: number | null
    draws: number | null
    koWins: number | null
    subWins: number | null
    eloRating: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FighterMaxAggregateOutputType = {
    id: string | null
    name: string | null
    weightClass: string | null
    age: number | null
    height: number | null
    reach: number | null
    wins: number | null
    losses: number | null
    draws: number | null
    koWins: number | null
    subWins: number | null
    eloRating: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FighterCountAggregateOutputType = {
    id: number
    name: number
    weightClass: number
    age: number
    height: number
    reach: number
    wins: number
    losses: number
    draws: number
    koWins: number
    subWins: number
    eloRating: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FighterAvgAggregateInputType = {
    age?: true
    height?: true
    reach?: true
    wins?: true
    losses?: true
    draws?: true
    koWins?: true
    subWins?: true
    eloRating?: true
  }

  export type FighterSumAggregateInputType = {
    age?: true
    height?: true
    reach?: true
    wins?: true
    losses?: true
    draws?: true
    koWins?: true
    subWins?: true
    eloRating?: true
  }

  export type FighterMinAggregateInputType = {
    id?: true
    name?: true
    weightClass?: true
    age?: true
    height?: true
    reach?: true
    wins?: true
    losses?: true
    draws?: true
    koWins?: true
    subWins?: true
    eloRating?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FighterMaxAggregateInputType = {
    id?: true
    name?: true
    weightClass?: true
    age?: true
    height?: true
    reach?: true
    wins?: true
    losses?: true
    draws?: true
    koWins?: true
    subWins?: true
    eloRating?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FighterCountAggregateInputType = {
    id?: true
    name?: true
    weightClass?: true
    age?: true
    height?: true
    reach?: true
    wins?: true
    losses?: true
    draws?: true
    koWins?: true
    subWins?: true
    eloRating?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FighterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Fighter to aggregate.
     */
    where?: FighterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fighters to fetch.
     */
    orderBy?: FighterOrderByWithRelationInput | FighterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FighterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fighters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fighters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Fighters
    **/
    _count?: true | FighterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FighterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FighterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FighterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FighterMaxAggregateInputType
  }

  export type GetFighterAggregateType<T extends FighterAggregateArgs> = {
        [P in keyof T & keyof AggregateFighter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFighter[P]>
      : GetScalarType<T[P], AggregateFighter[P]>
  }




  export type FighterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FighterWhereInput
    orderBy?: FighterOrderByWithAggregationInput | FighterOrderByWithAggregationInput[]
    by: FighterScalarFieldEnum[] | FighterScalarFieldEnum
    having?: FighterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FighterCountAggregateInputType | true
    _avg?: FighterAvgAggregateInputType
    _sum?: FighterSumAggregateInputType
    _min?: FighterMinAggregateInputType
    _max?: FighterMaxAggregateInputType
  }

  export type FighterGroupByOutputType = {
    id: string
    name: string
    weightClass: string | null
    age: number | null
    height: number | null
    reach: number | null
    wins: number
    losses: number
    draws: number
    koWins: number
    subWins: number
    eloRating: number
    createdAt: Date
    updatedAt: Date
    _count: FighterCountAggregateOutputType | null
    _avg: FighterAvgAggregateOutputType | null
    _sum: FighterSumAggregateOutputType | null
    _min: FighterMinAggregateOutputType | null
    _max: FighterMaxAggregateOutputType | null
  }

  type GetFighterGroupByPayload<T extends FighterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FighterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FighterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FighterGroupByOutputType[P]>
            : GetScalarType<T[P], FighterGroupByOutputType[P]>
        }
      >
    >


  export type FighterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    weightClass?: boolean
    age?: boolean
    height?: boolean
    reach?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    koWins?: boolean
    subWins?: boolean
    eloRating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fightsAsFighter1?: boolean | Fighter$fightsAsFighter1Args<ExtArgs>
    fightsAsFighter2?: boolean | Fighter$fightsAsFighter2Args<ExtArgs>
    fightsWon?: boolean | Fighter$fightsWonArgs<ExtArgs>
    _count?: boolean | FighterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fighter"]>

  export type FighterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    weightClass?: boolean
    age?: boolean
    height?: boolean
    reach?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    koWins?: boolean
    subWins?: boolean
    eloRating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fighter"]>

  export type FighterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    weightClass?: boolean
    age?: boolean
    height?: boolean
    reach?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    koWins?: boolean
    subWins?: boolean
    eloRating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fighter"]>

  export type FighterSelectScalar = {
    id?: boolean
    name?: boolean
    weightClass?: boolean
    age?: boolean
    height?: boolean
    reach?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    koWins?: boolean
    subWins?: boolean
    eloRating?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FighterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "weightClass" | "age" | "height" | "reach" | "wins" | "losses" | "draws" | "koWins" | "subWins" | "eloRating" | "createdAt" | "updatedAt", ExtArgs["result"]["fighter"]>
  export type FighterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fightsAsFighter1?: boolean | Fighter$fightsAsFighter1Args<ExtArgs>
    fightsAsFighter2?: boolean | Fighter$fightsAsFighter2Args<ExtArgs>
    fightsWon?: boolean | Fighter$fightsWonArgs<ExtArgs>
    _count?: boolean | FighterCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FighterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type FighterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $FighterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Fighter"
    objects: {
      fightsAsFighter1: Prisma.$FightPayload<ExtArgs>[]
      fightsAsFighter2: Prisma.$FightPayload<ExtArgs>[]
      fightsWon: Prisma.$FightPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      weightClass: string | null
      age: number | null
      height: number | null
      reach: number | null
      wins: number
      losses: number
      draws: number
      koWins: number
      subWins: number
      eloRating: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fighter"]>
    composites: {}
  }

  type FighterGetPayload<S extends boolean | null | undefined | FighterDefaultArgs> = $Result.GetResult<Prisma.$FighterPayload, S>

  type FighterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FighterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FighterCountAggregateInputType | true
    }

  export interface FighterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Fighter'], meta: { name: 'Fighter' } }
    /**
     * Find zero or one Fighter that matches the filter.
     * @param {FighterFindUniqueArgs} args - Arguments to find a Fighter
     * @example
     * // Get one Fighter
     * const fighter = await prisma.fighter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FighterFindUniqueArgs>(args: SelectSubset<T, FighterFindUniqueArgs<ExtArgs>>): Prisma__FighterClient<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Fighter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FighterFindUniqueOrThrowArgs} args - Arguments to find a Fighter
     * @example
     * // Get one Fighter
     * const fighter = await prisma.fighter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FighterFindUniqueOrThrowArgs>(args: SelectSubset<T, FighterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FighterClient<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Fighter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FighterFindFirstArgs} args - Arguments to find a Fighter
     * @example
     * // Get one Fighter
     * const fighter = await prisma.fighter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FighterFindFirstArgs>(args?: SelectSubset<T, FighterFindFirstArgs<ExtArgs>>): Prisma__FighterClient<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Fighter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FighterFindFirstOrThrowArgs} args - Arguments to find a Fighter
     * @example
     * // Get one Fighter
     * const fighter = await prisma.fighter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FighterFindFirstOrThrowArgs>(args?: SelectSubset<T, FighterFindFirstOrThrowArgs<ExtArgs>>): Prisma__FighterClient<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Fighters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FighterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Fighters
     * const fighters = await prisma.fighter.findMany()
     * 
     * // Get first 10 Fighters
     * const fighters = await prisma.fighter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fighterWithIdOnly = await prisma.fighter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FighterFindManyArgs>(args?: SelectSubset<T, FighterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Fighter.
     * @param {FighterCreateArgs} args - Arguments to create a Fighter.
     * @example
     * // Create one Fighter
     * const Fighter = await prisma.fighter.create({
     *   data: {
     *     // ... data to create a Fighter
     *   }
     * })
     * 
     */
    create<T extends FighterCreateArgs>(args: SelectSubset<T, FighterCreateArgs<ExtArgs>>): Prisma__FighterClient<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Fighters.
     * @param {FighterCreateManyArgs} args - Arguments to create many Fighters.
     * @example
     * // Create many Fighters
     * const fighter = await prisma.fighter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FighterCreateManyArgs>(args?: SelectSubset<T, FighterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Fighters and returns the data saved in the database.
     * @param {FighterCreateManyAndReturnArgs} args - Arguments to create many Fighters.
     * @example
     * // Create many Fighters
     * const fighter = await prisma.fighter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Fighters and only return the `id`
     * const fighterWithIdOnly = await prisma.fighter.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FighterCreateManyAndReturnArgs>(args?: SelectSubset<T, FighterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Fighter.
     * @param {FighterDeleteArgs} args - Arguments to delete one Fighter.
     * @example
     * // Delete one Fighter
     * const Fighter = await prisma.fighter.delete({
     *   where: {
     *     // ... filter to delete one Fighter
     *   }
     * })
     * 
     */
    delete<T extends FighterDeleteArgs>(args: SelectSubset<T, FighterDeleteArgs<ExtArgs>>): Prisma__FighterClient<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Fighter.
     * @param {FighterUpdateArgs} args - Arguments to update one Fighter.
     * @example
     * // Update one Fighter
     * const fighter = await prisma.fighter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FighterUpdateArgs>(args: SelectSubset<T, FighterUpdateArgs<ExtArgs>>): Prisma__FighterClient<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Fighters.
     * @param {FighterDeleteManyArgs} args - Arguments to filter Fighters to delete.
     * @example
     * // Delete a few Fighters
     * const { count } = await prisma.fighter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FighterDeleteManyArgs>(args?: SelectSubset<T, FighterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Fighters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FighterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Fighters
     * const fighter = await prisma.fighter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FighterUpdateManyArgs>(args: SelectSubset<T, FighterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Fighters and returns the data updated in the database.
     * @param {FighterUpdateManyAndReturnArgs} args - Arguments to update many Fighters.
     * @example
     * // Update many Fighters
     * const fighter = await prisma.fighter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Fighters and only return the `id`
     * const fighterWithIdOnly = await prisma.fighter.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FighterUpdateManyAndReturnArgs>(args: SelectSubset<T, FighterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Fighter.
     * @param {FighterUpsertArgs} args - Arguments to update or create a Fighter.
     * @example
     * // Update or create a Fighter
     * const fighter = await prisma.fighter.upsert({
     *   create: {
     *     // ... data to create a Fighter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Fighter we want to update
     *   }
     * })
     */
    upsert<T extends FighterUpsertArgs>(args: SelectSubset<T, FighterUpsertArgs<ExtArgs>>): Prisma__FighterClient<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Fighters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FighterCountArgs} args - Arguments to filter Fighters to count.
     * @example
     * // Count the number of Fighters
     * const count = await prisma.fighter.count({
     *   where: {
     *     // ... the filter for the Fighters we want to count
     *   }
     * })
    **/
    count<T extends FighterCountArgs>(
      args?: Subset<T, FighterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FighterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Fighter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FighterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FighterAggregateArgs>(args: Subset<T, FighterAggregateArgs>): Prisma.PrismaPromise<GetFighterAggregateType<T>>

    /**
     * Group by Fighter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FighterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FighterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FighterGroupByArgs['orderBy'] }
        : { orderBy?: FighterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FighterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFighterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Fighter model
   */
  readonly fields: FighterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Fighter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FighterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    fightsAsFighter1<T extends Fighter$fightsAsFighter1Args<ExtArgs> = {}>(args?: Subset<T, Fighter$fightsAsFighter1Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    fightsAsFighter2<T extends Fighter$fightsAsFighter2Args<ExtArgs> = {}>(args?: Subset<T, Fighter$fightsAsFighter2Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    fightsWon<T extends Fighter$fightsWonArgs<ExtArgs> = {}>(args?: Subset<T, Fighter$fightsWonArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Fighter model
   */
  interface FighterFieldRefs {
    readonly id: FieldRef<"Fighter", 'String'>
    readonly name: FieldRef<"Fighter", 'String'>
    readonly weightClass: FieldRef<"Fighter", 'String'>
    readonly age: FieldRef<"Fighter", 'Int'>
    readonly height: FieldRef<"Fighter", 'Float'>
    readonly reach: FieldRef<"Fighter", 'Float'>
    readonly wins: FieldRef<"Fighter", 'Int'>
    readonly losses: FieldRef<"Fighter", 'Int'>
    readonly draws: FieldRef<"Fighter", 'Int'>
    readonly koWins: FieldRef<"Fighter", 'Int'>
    readonly subWins: FieldRef<"Fighter", 'Int'>
    readonly eloRating: FieldRef<"Fighter", 'Int'>
    readonly createdAt: FieldRef<"Fighter", 'DateTime'>
    readonly updatedAt: FieldRef<"Fighter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Fighter findUnique
   */
  export type FighterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FighterInclude<ExtArgs> | null
    /**
     * Filter, which Fighter to fetch.
     */
    where: FighterWhereUniqueInput
  }

  /**
   * Fighter findUniqueOrThrow
   */
  export type FighterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FighterInclude<ExtArgs> | null
    /**
     * Filter, which Fighter to fetch.
     */
    where: FighterWhereUniqueInput
  }

  /**
   * Fighter findFirst
   */
  export type FighterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FighterInclude<ExtArgs> | null
    /**
     * Filter, which Fighter to fetch.
     */
    where?: FighterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fighters to fetch.
     */
    orderBy?: FighterOrderByWithRelationInput | FighterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Fighters.
     */
    cursor?: FighterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fighters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fighters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Fighters.
     */
    distinct?: FighterScalarFieldEnum | FighterScalarFieldEnum[]
  }

  /**
   * Fighter findFirstOrThrow
   */
  export type FighterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FighterInclude<ExtArgs> | null
    /**
     * Filter, which Fighter to fetch.
     */
    where?: FighterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fighters to fetch.
     */
    orderBy?: FighterOrderByWithRelationInput | FighterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Fighters.
     */
    cursor?: FighterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fighters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fighters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Fighters.
     */
    distinct?: FighterScalarFieldEnum | FighterScalarFieldEnum[]
  }

  /**
   * Fighter findMany
   */
  export type FighterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FighterInclude<ExtArgs> | null
    /**
     * Filter, which Fighters to fetch.
     */
    where?: FighterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fighters to fetch.
     */
    orderBy?: FighterOrderByWithRelationInput | FighterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Fighters.
     */
    cursor?: FighterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fighters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fighters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Fighters.
     */
    distinct?: FighterScalarFieldEnum | FighterScalarFieldEnum[]
  }

  /**
   * Fighter create
   */
  export type FighterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FighterInclude<ExtArgs> | null
    /**
     * The data needed to create a Fighter.
     */
    data: XOR<FighterCreateInput, FighterUncheckedCreateInput>
  }

  /**
   * Fighter createMany
   */
  export type FighterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Fighters.
     */
    data: FighterCreateManyInput | FighterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Fighter createManyAndReturn
   */
  export type FighterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * The data used to create many Fighters.
     */
    data: FighterCreateManyInput | FighterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Fighter update
   */
  export type FighterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FighterInclude<ExtArgs> | null
    /**
     * The data needed to update a Fighter.
     */
    data: XOR<FighterUpdateInput, FighterUncheckedUpdateInput>
    /**
     * Choose, which Fighter to update.
     */
    where: FighterWhereUniqueInput
  }

  /**
   * Fighter updateMany
   */
  export type FighterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Fighters.
     */
    data: XOR<FighterUpdateManyMutationInput, FighterUncheckedUpdateManyInput>
    /**
     * Filter which Fighters to update
     */
    where?: FighterWhereInput
    /**
     * Limit how many Fighters to update.
     */
    limit?: number
  }

  /**
   * Fighter updateManyAndReturn
   */
  export type FighterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * The data used to update Fighters.
     */
    data: XOR<FighterUpdateManyMutationInput, FighterUncheckedUpdateManyInput>
    /**
     * Filter which Fighters to update
     */
    where?: FighterWhereInput
    /**
     * Limit how many Fighters to update.
     */
    limit?: number
  }

  /**
   * Fighter upsert
   */
  export type FighterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FighterInclude<ExtArgs> | null
    /**
     * The filter to search for the Fighter to update in case it exists.
     */
    where: FighterWhereUniqueInput
    /**
     * In case the Fighter found by the `where` argument doesn't exist, create a new Fighter with this data.
     */
    create: XOR<FighterCreateInput, FighterUncheckedCreateInput>
    /**
     * In case the Fighter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FighterUpdateInput, FighterUncheckedUpdateInput>
  }

  /**
   * Fighter delete
   */
  export type FighterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FighterInclude<ExtArgs> | null
    /**
     * Filter which Fighter to delete.
     */
    where: FighterWhereUniqueInput
  }

  /**
   * Fighter deleteMany
   */
  export type FighterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Fighters to delete
     */
    where?: FighterWhereInput
    /**
     * Limit how many Fighters to delete.
     */
    limit?: number
  }

  /**
   * Fighter.fightsAsFighter1
   */
  export type Fighter$fightsAsFighter1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    where?: FightWhereInput
    orderBy?: FightOrderByWithRelationInput | FightOrderByWithRelationInput[]
    cursor?: FightWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FightScalarFieldEnum | FightScalarFieldEnum[]
  }

  /**
   * Fighter.fightsAsFighter2
   */
  export type Fighter$fightsAsFighter2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    where?: FightWhereInput
    orderBy?: FightOrderByWithRelationInput | FightOrderByWithRelationInput[]
    cursor?: FightWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FightScalarFieldEnum | FightScalarFieldEnum[]
  }

  /**
   * Fighter.fightsWon
   */
  export type Fighter$fightsWonArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    where?: FightWhereInput
    orderBy?: FightOrderByWithRelationInput | FightOrderByWithRelationInput[]
    cursor?: FightWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FightScalarFieldEnum | FightScalarFieldEnum[]
  }

  /**
   * Fighter without action
   */
  export type FighterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FighterInclude<ExtArgs> | null
  }


  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventMinAggregateOutputType = {
    id: string | null
    name: string | null
    date: Date | null
    location: string | null
    isUpcoming: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventMaxAggregateOutputType = {
    id: string | null
    name: string | null
    date: Date | null
    location: string | null
    isUpcoming: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    name: number
    date: number
    location: number
    isUpcoming: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EventMinAggregateInputType = {
    id?: true
    name?: true
    date?: true
    location?: true
    isUpcoming?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    name?: true
    date?: true
    location?: true
    isUpcoming?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    name?: true
    date?: true
    location?: true
    isUpcoming?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
    orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: string
    name: string
    date: Date
    location: string | null
    isUpcoming: boolean
    createdAt: Date
    updatedAt: Date
    _count: EventCountAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    date?: boolean
    location?: boolean
    isUpcoming?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fights?: boolean | Event$fightsArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    date?: boolean
    location?: boolean
    isUpcoming?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["event"]>

  export type EventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    date?: boolean
    location?: boolean
    isUpcoming?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["event"]>

  export type EventSelectScalar = {
    id?: boolean
    name?: boolean
    date?: boolean
    location?: boolean
    isUpcoming?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "date" | "location" | "isUpcoming" | "createdAt" | "updatedAt", ExtArgs["result"]["event"]>
  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fights?: boolean | Event$fightsArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type EventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Event"
    objects: {
      fights: Prisma.$FightPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      date: Date
      location: string | null
      isUpcoming: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<Prisma.$EventPayload, S>

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event'], meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventFindManyArgs>(args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends EventCreateArgs>(args: SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventCreateManyArgs>(args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends EventDeleteArgs>(args: SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventUpdateArgs>(args: SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventDeleteManyArgs>(args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventUpdateManyArgs>(args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {EventUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventUpdateManyAndReturnArgs>(args: SelectSubset<T, EventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(args: SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Event model
   */
  readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    fights<T extends Event$fightsArgs<ExtArgs> = {}>(args?: Subset<T, Event$fightsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Event model
   */
  interface EventFieldRefs {
    readonly id: FieldRef<"Event", 'String'>
    readonly name: FieldRef<"Event", 'String'>
    readonly date: FieldRef<"Event", 'DateTime'>
    readonly location: FieldRef<"Event", 'String'>
    readonly isUpcoming: FieldRef<"Event", 'Boolean'>
    readonly createdAt: FieldRef<"Event", 'DateTime'>
    readonly updatedAt: FieldRef<"Event", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Event updateManyAndReturn
   */
  export type EventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to delete.
     */
    limit?: number
  }

  /**
   * Event.fights
   */
  export type Event$fightsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    where?: FightWhereInput
    orderBy?: FightOrderByWithRelationInput | FightOrderByWithRelationInput[]
    cursor?: FightWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FightScalarFieldEnum | FightScalarFieldEnum[]
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
  }


  /**
   * Model Fight
   */

  export type AggregateFight = {
    _count: FightCountAggregateOutputType | null
    _avg: FightAvgAggregateOutputType | null
    _sum: FightSumAggregateOutputType | null
    _min: FightMinAggregateOutputType | null
    _max: FightMaxAggregateOutputType | null
  }

  export type FightAvgAggregateOutputType = {
    rounds: number | null
    oddsFighter1: number | null
    oddsFighter2: number | null
    aiConfidence: number | null
    endingRound: number | null
  }

  export type FightSumAggregateOutputType = {
    rounds: number | null
    oddsFighter1: number | null
    oddsFighter2: number | null
    aiConfidence: number | null
    endingRound: number | null
  }

  export type FightMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    fighter1Id: string | null
    fighter2Id: string | null
    winnerId: string | null
    weightClass: string | null
    rounds: number | null
    isTitleFight: boolean | null
    oddsFighter1: number | null
    oddsFighter2: number | null
    aiPrediction: string | null
    aiConfidence: number | null
    method: string | null
    endingRound: number | null
    endingTime: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FightMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    fighter1Id: string | null
    fighter2Id: string | null
    winnerId: string | null
    weightClass: string | null
    rounds: number | null
    isTitleFight: boolean | null
    oddsFighter1: number | null
    oddsFighter2: number | null
    aiPrediction: string | null
    aiConfidence: number | null
    method: string | null
    endingRound: number | null
    endingTime: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FightCountAggregateOutputType = {
    id: number
    eventId: number
    fighter1Id: number
    fighter2Id: number
    winnerId: number
    weightClass: number
    rounds: number
    isTitleFight: number
    oddsFighter1: number
    oddsFighter2: number
    aiPrediction: number
    aiConfidence: number
    method: number
    endingRound: number
    endingTime: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FightAvgAggregateInputType = {
    rounds?: true
    oddsFighter1?: true
    oddsFighter2?: true
    aiConfidence?: true
    endingRound?: true
  }

  export type FightSumAggregateInputType = {
    rounds?: true
    oddsFighter1?: true
    oddsFighter2?: true
    aiConfidence?: true
    endingRound?: true
  }

  export type FightMinAggregateInputType = {
    id?: true
    eventId?: true
    fighter1Id?: true
    fighter2Id?: true
    winnerId?: true
    weightClass?: true
    rounds?: true
    isTitleFight?: true
    oddsFighter1?: true
    oddsFighter2?: true
    aiPrediction?: true
    aiConfidence?: true
    method?: true
    endingRound?: true
    endingTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FightMaxAggregateInputType = {
    id?: true
    eventId?: true
    fighter1Id?: true
    fighter2Id?: true
    winnerId?: true
    weightClass?: true
    rounds?: true
    isTitleFight?: true
    oddsFighter1?: true
    oddsFighter2?: true
    aiPrediction?: true
    aiConfidence?: true
    method?: true
    endingRound?: true
    endingTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FightCountAggregateInputType = {
    id?: true
    eventId?: true
    fighter1Id?: true
    fighter2Id?: true
    winnerId?: true
    weightClass?: true
    rounds?: true
    isTitleFight?: true
    oddsFighter1?: true
    oddsFighter2?: true
    aiPrediction?: true
    aiConfidence?: true
    method?: true
    endingRound?: true
    endingTime?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FightAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Fight to aggregate.
     */
    where?: FightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fights to fetch.
     */
    orderBy?: FightOrderByWithRelationInput | FightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Fights
    **/
    _count?: true | FightCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FightAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FightSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FightMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FightMaxAggregateInputType
  }

  export type GetFightAggregateType<T extends FightAggregateArgs> = {
        [P in keyof T & keyof AggregateFight]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFight[P]>
      : GetScalarType<T[P], AggregateFight[P]>
  }




  export type FightGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FightWhereInput
    orderBy?: FightOrderByWithAggregationInput | FightOrderByWithAggregationInput[]
    by: FightScalarFieldEnum[] | FightScalarFieldEnum
    having?: FightScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FightCountAggregateInputType | true
    _avg?: FightAvgAggregateInputType
    _sum?: FightSumAggregateInputType
    _min?: FightMinAggregateInputType
    _max?: FightMaxAggregateInputType
  }

  export type FightGroupByOutputType = {
    id: string
    eventId: string
    fighter1Id: string
    fighter2Id: string
    winnerId: string | null
    weightClass: string | null
    rounds: number
    isTitleFight: boolean
    oddsFighter1: number | null
    oddsFighter2: number | null
    aiPrediction: string | null
    aiConfidence: number | null
    method: string | null
    endingRound: number | null
    endingTime: string | null
    createdAt: Date
    updatedAt: Date
    _count: FightCountAggregateOutputType | null
    _avg: FightAvgAggregateOutputType | null
    _sum: FightSumAggregateOutputType | null
    _min: FightMinAggregateOutputType | null
    _max: FightMaxAggregateOutputType | null
  }

  type GetFightGroupByPayload<T extends FightGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FightGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FightGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FightGroupByOutputType[P]>
            : GetScalarType<T[P], FightGroupByOutputType[P]>
        }
      >
    >


  export type FightSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    fighter1Id?: boolean
    fighter2Id?: boolean
    winnerId?: boolean
    weightClass?: boolean
    rounds?: boolean
    isTitleFight?: boolean
    oddsFighter1?: boolean
    oddsFighter2?: boolean
    aiPrediction?: boolean
    aiConfidence?: boolean
    method?: boolean
    endingRound?: boolean
    endingTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
    fighter1?: boolean | FighterDefaultArgs<ExtArgs>
    fighter2?: boolean | FighterDefaultArgs<ExtArgs>
    winner?: boolean | Fight$winnerArgs<ExtArgs>
  }, ExtArgs["result"]["fight"]>

  export type FightSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    fighter1Id?: boolean
    fighter2Id?: boolean
    winnerId?: boolean
    weightClass?: boolean
    rounds?: boolean
    isTitleFight?: boolean
    oddsFighter1?: boolean
    oddsFighter2?: boolean
    aiPrediction?: boolean
    aiConfidence?: boolean
    method?: boolean
    endingRound?: boolean
    endingTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
    fighter1?: boolean | FighterDefaultArgs<ExtArgs>
    fighter2?: boolean | FighterDefaultArgs<ExtArgs>
    winner?: boolean | Fight$winnerArgs<ExtArgs>
  }, ExtArgs["result"]["fight"]>

  export type FightSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    fighter1Id?: boolean
    fighter2Id?: boolean
    winnerId?: boolean
    weightClass?: boolean
    rounds?: boolean
    isTitleFight?: boolean
    oddsFighter1?: boolean
    oddsFighter2?: boolean
    aiPrediction?: boolean
    aiConfidence?: boolean
    method?: boolean
    endingRound?: boolean
    endingTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    event?: boolean | EventDefaultArgs<ExtArgs>
    fighter1?: boolean | FighterDefaultArgs<ExtArgs>
    fighter2?: boolean | FighterDefaultArgs<ExtArgs>
    winner?: boolean | Fight$winnerArgs<ExtArgs>
  }, ExtArgs["result"]["fight"]>

  export type FightSelectScalar = {
    id?: boolean
    eventId?: boolean
    fighter1Id?: boolean
    fighter2Id?: boolean
    winnerId?: boolean
    weightClass?: boolean
    rounds?: boolean
    isTitleFight?: boolean
    oddsFighter1?: boolean
    oddsFighter2?: boolean
    aiPrediction?: boolean
    aiConfidence?: boolean
    method?: boolean
    endingRound?: boolean
    endingTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FightOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventId" | "fighter1Id" | "fighter2Id" | "winnerId" | "weightClass" | "rounds" | "isTitleFight" | "oddsFighter1" | "oddsFighter2" | "aiPrediction" | "aiConfidence" | "method" | "endingRound" | "endingTime" | "createdAt" | "updatedAt", ExtArgs["result"]["fight"]>
  export type FightInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
    fighter1?: boolean | FighterDefaultArgs<ExtArgs>
    fighter2?: boolean | FighterDefaultArgs<ExtArgs>
    winner?: boolean | Fight$winnerArgs<ExtArgs>
  }
  export type FightIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
    fighter1?: boolean | FighterDefaultArgs<ExtArgs>
    fighter2?: boolean | FighterDefaultArgs<ExtArgs>
    winner?: boolean | Fight$winnerArgs<ExtArgs>
  }
  export type FightIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | EventDefaultArgs<ExtArgs>
    fighter1?: boolean | FighterDefaultArgs<ExtArgs>
    fighter2?: boolean | FighterDefaultArgs<ExtArgs>
    winner?: boolean | Fight$winnerArgs<ExtArgs>
  }

  export type $FightPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Fight"
    objects: {
      event: Prisma.$EventPayload<ExtArgs>
      fighter1: Prisma.$FighterPayload<ExtArgs>
      fighter2: Prisma.$FighterPayload<ExtArgs>
      winner: Prisma.$FighterPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      fighter1Id: string
      fighter2Id: string
      winnerId: string | null
      weightClass: string | null
      rounds: number
      isTitleFight: boolean
      oddsFighter1: number | null
      oddsFighter2: number | null
      aiPrediction: string | null
      aiConfidence: number | null
      method: string | null
      endingRound: number | null
      endingTime: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fight"]>
    composites: {}
  }

  type FightGetPayload<S extends boolean | null | undefined | FightDefaultArgs> = $Result.GetResult<Prisma.$FightPayload, S>

  type FightCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FightFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FightCountAggregateInputType | true
    }

  export interface FightDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Fight'], meta: { name: 'Fight' } }
    /**
     * Find zero or one Fight that matches the filter.
     * @param {FightFindUniqueArgs} args - Arguments to find a Fight
     * @example
     * // Get one Fight
     * const fight = await prisma.fight.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FightFindUniqueArgs>(args: SelectSubset<T, FightFindUniqueArgs<ExtArgs>>): Prisma__FightClient<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Fight that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FightFindUniqueOrThrowArgs} args - Arguments to find a Fight
     * @example
     * // Get one Fight
     * const fight = await prisma.fight.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FightFindUniqueOrThrowArgs>(args: SelectSubset<T, FightFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FightClient<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Fight that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FightFindFirstArgs} args - Arguments to find a Fight
     * @example
     * // Get one Fight
     * const fight = await prisma.fight.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FightFindFirstArgs>(args?: SelectSubset<T, FightFindFirstArgs<ExtArgs>>): Prisma__FightClient<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Fight that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FightFindFirstOrThrowArgs} args - Arguments to find a Fight
     * @example
     * // Get one Fight
     * const fight = await prisma.fight.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FightFindFirstOrThrowArgs>(args?: SelectSubset<T, FightFindFirstOrThrowArgs<ExtArgs>>): Prisma__FightClient<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Fights that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FightFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Fights
     * const fights = await prisma.fight.findMany()
     * 
     * // Get first 10 Fights
     * const fights = await prisma.fight.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fightWithIdOnly = await prisma.fight.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FightFindManyArgs>(args?: SelectSubset<T, FightFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Fight.
     * @param {FightCreateArgs} args - Arguments to create a Fight.
     * @example
     * // Create one Fight
     * const Fight = await prisma.fight.create({
     *   data: {
     *     // ... data to create a Fight
     *   }
     * })
     * 
     */
    create<T extends FightCreateArgs>(args: SelectSubset<T, FightCreateArgs<ExtArgs>>): Prisma__FightClient<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Fights.
     * @param {FightCreateManyArgs} args - Arguments to create many Fights.
     * @example
     * // Create many Fights
     * const fight = await prisma.fight.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FightCreateManyArgs>(args?: SelectSubset<T, FightCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Fights and returns the data saved in the database.
     * @param {FightCreateManyAndReturnArgs} args - Arguments to create many Fights.
     * @example
     * // Create many Fights
     * const fight = await prisma.fight.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Fights and only return the `id`
     * const fightWithIdOnly = await prisma.fight.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FightCreateManyAndReturnArgs>(args?: SelectSubset<T, FightCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Fight.
     * @param {FightDeleteArgs} args - Arguments to delete one Fight.
     * @example
     * // Delete one Fight
     * const Fight = await prisma.fight.delete({
     *   where: {
     *     // ... filter to delete one Fight
     *   }
     * })
     * 
     */
    delete<T extends FightDeleteArgs>(args: SelectSubset<T, FightDeleteArgs<ExtArgs>>): Prisma__FightClient<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Fight.
     * @param {FightUpdateArgs} args - Arguments to update one Fight.
     * @example
     * // Update one Fight
     * const fight = await prisma.fight.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FightUpdateArgs>(args: SelectSubset<T, FightUpdateArgs<ExtArgs>>): Prisma__FightClient<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Fights.
     * @param {FightDeleteManyArgs} args - Arguments to filter Fights to delete.
     * @example
     * // Delete a few Fights
     * const { count } = await prisma.fight.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FightDeleteManyArgs>(args?: SelectSubset<T, FightDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Fights.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FightUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Fights
     * const fight = await prisma.fight.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FightUpdateManyArgs>(args: SelectSubset<T, FightUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Fights and returns the data updated in the database.
     * @param {FightUpdateManyAndReturnArgs} args - Arguments to update many Fights.
     * @example
     * // Update many Fights
     * const fight = await prisma.fight.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Fights and only return the `id`
     * const fightWithIdOnly = await prisma.fight.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FightUpdateManyAndReturnArgs>(args: SelectSubset<T, FightUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Fight.
     * @param {FightUpsertArgs} args - Arguments to update or create a Fight.
     * @example
     * // Update or create a Fight
     * const fight = await prisma.fight.upsert({
     *   create: {
     *     // ... data to create a Fight
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Fight we want to update
     *   }
     * })
     */
    upsert<T extends FightUpsertArgs>(args: SelectSubset<T, FightUpsertArgs<ExtArgs>>): Prisma__FightClient<$Result.GetResult<Prisma.$FightPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Fights.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FightCountArgs} args - Arguments to filter Fights to count.
     * @example
     * // Count the number of Fights
     * const count = await prisma.fight.count({
     *   where: {
     *     // ... the filter for the Fights we want to count
     *   }
     * })
    **/
    count<T extends FightCountArgs>(
      args?: Subset<T, FightCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FightCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Fight.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FightAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FightAggregateArgs>(args: Subset<T, FightAggregateArgs>): Prisma.PrismaPromise<GetFightAggregateType<T>>

    /**
     * Group by Fight.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FightGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FightGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FightGroupByArgs['orderBy'] }
        : { orderBy?: FightGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FightGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFightGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Fight model
   */
  readonly fields: FightFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Fight.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FightClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends EventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventDefaultArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    fighter1<T extends FighterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FighterDefaultArgs<ExtArgs>>): Prisma__FighterClient<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    fighter2<T extends FighterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FighterDefaultArgs<ExtArgs>>): Prisma__FighterClient<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    winner<T extends Fight$winnerArgs<ExtArgs> = {}>(args?: Subset<T, Fight$winnerArgs<ExtArgs>>): Prisma__FighterClient<$Result.GetResult<Prisma.$FighterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Fight model
   */
  interface FightFieldRefs {
    readonly id: FieldRef<"Fight", 'String'>
    readonly eventId: FieldRef<"Fight", 'String'>
    readonly fighter1Id: FieldRef<"Fight", 'String'>
    readonly fighter2Id: FieldRef<"Fight", 'String'>
    readonly winnerId: FieldRef<"Fight", 'String'>
    readonly weightClass: FieldRef<"Fight", 'String'>
    readonly rounds: FieldRef<"Fight", 'Int'>
    readonly isTitleFight: FieldRef<"Fight", 'Boolean'>
    readonly oddsFighter1: FieldRef<"Fight", 'Int'>
    readonly oddsFighter2: FieldRef<"Fight", 'Int'>
    readonly aiPrediction: FieldRef<"Fight", 'String'>
    readonly aiConfidence: FieldRef<"Fight", 'Float'>
    readonly method: FieldRef<"Fight", 'String'>
    readonly endingRound: FieldRef<"Fight", 'Int'>
    readonly endingTime: FieldRef<"Fight", 'String'>
    readonly createdAt: FieldRef<"Fight", 'DateTime'>
    readonly updatedAt: FieldRef<"Fight", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Fight findUnique
   */
  export type FightFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    /**
     * Filter, which Fight to fetch.
     */
    where: FightWhereUniqueInput
  }

  /**
   * Fight findUniqueOrThrow
   */
  export type FightFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    /**
     * Filter, which Fight to fetch.
     */
    where: FightWhereUniqueInput
  }

  /**
   * Fight findFirst
   */
  export type FightFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    /**
     * Filter, which Fight to fetch.
     */
    where?: FightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fights to fetch.
     */
    orderBy?: FightOrderByWithRelationInput | FightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Fights.
     */
    cursor?: FightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Fights.
     */
    distinct?: FightScalarFieldEnum | FightScalarFieldEnum[]
  }

  /**
   * Fight findFirstOrThrow
   */
  export type FightFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    /**
     * Filter, which Fight to fetch.
     */
    where?: FightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fights to fetch.
     */
    orderBy?: FightOrderByWithRelationInput | FightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Fights.
     */
    cursor?: FightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Fights.
     */
    distinct?: FightScalarFieldEnum | FightScalarFieldEnum[]
  }

  /**
   * Fight findMany
   */
  export type FightFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    /**
     * Filter, which Fights to fetch.
     */
    where?: FightWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fights to fetch.
     */
    orderBy?: FightOrderByWithRelationInput | FightOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Fights.
     */
    cursor?: FightWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fights from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fights.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Fights.
     */
    distinct?: FightScalarFieldEnum | FightScalarFieldEnum[]
  }

  /**
   * Fight create
   */
  export type FightCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    /**
     * The data needed to create a Fight.
     */
    data: XOR<FightCreateInput, FightUncheckedCreateInput>
  }

  /**
   * Fight createMany
   */
  export type FightCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Fights.
     */
    data: FightCreateManyInput | FightCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Fight createManyAndReturn
   */
  export type FightCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * The data used to create many Fights.
     */
    data: FightCreateManyInput | FightCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Fight update
   */
  export type FightUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    /**
     * The data needed to update a Fight.
     */
    data: XOR<FightUpdateInput, FightUncheckedUpdateInput>
    /**
     * Choose, which Fight to update.
     */
    where: FightWhereUniqueInput
  }

  /**
   * Fight updateMany
   */
  export type FightUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Fights.
     */
    data: XOR<FightUpdateManyMutationInput, FightUncheckedUpdateManyInput>
    /**
     * Filter which Fights to update
     */
    where?: FightWhereInput
    /**
     * Limit how many Fights to update.
     */
    limit?: number
  }

  /**
   * Fight updateManyAndReturn
   */
  export type FightUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * The data used to update Fights.
     */
    data: XOR<FightUpdateManyMutationInput, FightUncheckedUpdateManyInput>
    /**
     * Filter which Fights to update
     */
    where?: FightWhereInput
    /**
     * Limit how many Fights to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Fight upsert
   */
  export type FightUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    /**
     * The filter to search for the Fight to update in case it exists.
     */
    where: FightWhereUniqueInput
    /**
     * In case the Fight found by the `where` argument doesn't exist, create a new Fight with this data.
     */
    create: XOR<FightCreateInput, FightUncheckedCreateInput>
    /**
     * In case the Fight was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FightUpdateInput, FightUncheckedUpdateInput>
  }

  /**
   * Fight delete
   */
  export type FightDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
    /**
     * Filter which Fight to delete.
     */
    where: FightWhereUniqueInput
  }

  /**
   * Fight deleteMany
   */
  export type FightDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Fights to delete
     */
    where?: FightWhereInput
    /**
     * Limit how many Fights to delete.
     */
    limit?: number
  }

  /**
   * Fight.winner
   */
  export type Fight$winnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fighter
     */
    select?: FighterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fighter
     */
    omit?: FighterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FighterInclude<ExtArgs> | null
    where?: FighterWhereInput
  }

  /**
   * Fight without action
   */
  export type FightDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Fight
     */
    select?: FightSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Fight
     */
    omit?: FightOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FightInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    stripeCustomerId: 'stripeCustomerId',
    stripeSubscriptionId: 'stripeSubscriptionId',
    status: 'status',
    currentPeriodEnd: 'currentPeriodEnd',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const FighterScalarFieldEnum: {
    id: 'id',
    name: 'name',
    weightClass: 'weightClass',
    age: 'age',
    height: 'height',
    reach: 'reach',
    wins: 'wins',
    losses: 'losses',
    draws: 'draws',
    koWins: 'koWins',
    subWins: 'subWins',
    eloRating: 'eloRating',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FighterScalarFieldEnum = (typeof FighterScalarFieldEnum)[keyof typeof FighterScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    name: 'name',
    date: 'date',
    location: 'location',
    isUpcoming: 'isUpcoming',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const FightScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    fighter1Id: 'fighter1Id',
    fighter2Id: 'fighter2Id',
    winnerId: 'winnerId',
    weightClass: 'weightClass',
    rounds: 'rounds',
    isTitleFight: 'isTitleFight',
    oddsFighter1: 'oddsFighter1',
    oddsFighter2: 'oddsFighter2',
    aiPrediction: 'aiPrediction',
    aiConfidence: 'aiConfidence',
    method: 'method',
    endingRound: 'endingRound',
    endingTime: 'endingTime',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FightScalarFieldEnum = (typeof FightScalarFieldEnum)[keyof typeof FightScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    subscription?: XOR<SubscriptionNullableScalarRelationFilter, SubscriptionWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    subscription?: SubscriptionOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    subscription?: XOR<SubscriptionNullableScalarRelationFilter, SubscriptionWhereInput> | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableFilter<"Subscription"> | string | null
    stripeSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    stripeCustomerId?: string
    stripeSubscriptionId?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    status?: StringFilter<"Subscription"> | string
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId" | "stripeCustomerId" | "stripeSubscriptionId">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    userId?: StringWithAggregatesFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    stripeSubscriptionId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    status?: StringWithAggregatesFilter<"Subscription"> | string
    currentPeriodEnd?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
  }

  export type FighterWhereInput = {
    AND?: FighterWhereInput | FighterWhereInput[]
    OR?: FighterWhereInput[]
    NOT?: FighterWhereInput | FighterWhereInput[]
    id?: StringFilter<"Fighter"> | string
    name?: StringFilter<"Fighter"> | string
    weightClass?: StringNullableFilter<"Fighter"> | string | null
    age?: IntNullableFilter<"Fighter"> | number | null
    height?: FloatNullableFilter<"Fighter"> | number | null
    reach?: FloatNullableFilter<"Fighter"> | number | null
    wins?: IntFilter<"Fighter"> | number
    losses?: IntFilter<"Fighter"> | number
    draws?: IntFilter<"Fighter"> | number
    koWins?: IntFilter<"Fighter"> | number
    subWins?: IntFilter<"Fighter"> | number
    eloRating?: IntFilter<"Fighter"> | number
    createdAt?: DateTimeFilter<"Fighter"> | Date | string
    updatedAt?: DateTimeFilter<"Fighter"> | Date | string
    fightsAsFighter1?: FightListRelationFilter
    fightsAsFighter2?: FightListRelationFilter
    fightsWon?: FightListRelationFilter
  }

  export type FighterOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    weightClass?: SortOrderInput | SortOrder
    age?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    reach?: SortOrderInput | SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    koWins?: SortOrder
    subWins?: SortOrder
    eloRating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fightsAsFighter1?: FightOrderByRelationAggregateInput
    fightsAsFighter2?: FightOrderByRelationAggregateInput
    fightsWon?: FightOrderByRelationAggregateInput
  }

  export type FighterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: FighterWhereInput | FighterWhereInput[]
    OR?: FighterWhereInput[]
    NOT?: FighterWhereInput | FighterWhereInput[]
    weightClass?: StringNullableFilter<"Fighter"> | string | null
    age?: IntNullableFilter<"Fighter"> | number | null
    height?: FloatNullableFilter<"Fighter"> | number | null
    reach?: FloatNullableFilter<"Fighter"> | number | null
    wins?: IntFilter<"Fighter"> | number
    losses?: IntFilter<"Fighter"> | number
    draws?: IntFilter<"Fighter"> | number
    koWins?: IntFilter<"Fighter"> | number
    subWins?: IntFilter<"Fighter"> | number
    eloRating?: IntFilter<"Fighter"> | number
    createdAt?: DateTimeFilter<"Fighter"> | Date | string
    updatedAt?: DateTimeFilter<"Fighter"> | Date | string
    fightsAsFighter1?: FightListRelationFilter
    fightsAsFighter2?: FightListRelationFilter
    fightsWon?: FightListRelationFilter
  }, "id" | "name">

  export type FighterOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    weightClass?: SortOrderInput | SortOrder
    age?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    reach?: SortOrderInput | SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    koWins?: SortOrder
    subWins?: SortOrder
    eloRating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FighterCountOrderByAggregateInput
    _avg?: FighterAvgOrderByAggregateInput
    _max?: FighterMaxOrderByAggregateInput
    _min?: FighterMinOrderByAggregateInput
    _sum?: FighterSumOrderByAggregateInput
  }

  export type FighterScalarWhereWithAggregatesInput = {
    AND?: FighterScalarWhereWithAggregatesInput | FighterScalarWhereWithAggregatesInput[]
    OR?: FighterScalarWhereWithAggregatesInput[]
    NOT?: FighterScalarWhereWithAggregatesInput | FighterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Fighter"> | string
    name?: StringWithAggregatesFilter<"Fighter"> | string
    weightClass?: StringNullableWithAggregatesFilter<"Fighter"> | string | null
    age?: IntNullableWithAggregatesFilter<"Fighter"> | number | null
    height?: FloatNullableWithAggregatesFilter<"Fighter"> | number | null
    reach?: FloatNullableWithAggregatesFilter<"Fighter"> | number | null
    wins?: IntWithAggregatesFilter<"Fighter"> | number
    losses?: IntWithAggregatesFilter<"Fighter"> | number
    draws?: IntWithAggregatesFilter<"Fighter"> | number
    koWins?: IntWithAggregatesFilter<"Fighter"> | number
    subWins?: IntWithAggregatesFilter<"Fighter"> | number
    eloRating?: IntWithAggregatesFilter<"Fighter"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Fighter"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Fighter"> | Date | string
  }

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: StringFilter<"Event"> | string
    name?: StringFilter<"Event"> | string
    date?: DateTimeFilter<"Event"> | Date | string
    location?: StringNullableFilter<"Event"> | string | null
    isUpcoming?: BoolFilter<"Event"> | boolean
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    fights?: FightListRelationFilter
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    date?: SortOrder
    location?: SortOrderInput | SortOrder
    isUpcoming?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fights?: FightOrderByRelationAggregateInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    name?: StringFilter<"Event"> | string
    date?: DateTimeFilter<"Event"> | Date | string
    location?: StringNullableFilter<"Event"> | string | null
    isUpcoming?: BoolFilter<"Event"> | boolean
    createdAt?: DateTimeFilter<"Event"> | Date | string
    updatedAt?: DateTimeFilter<"Event"> | Date | string
    fights?: FightListRelationFilter
  }, "id">

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    date?: SortOrder
    location?: SortOrderInput | SortOrder
    isUpcoming?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EventCountOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Event"> | string
    name?: StringWithAggregatesFilter<"Event"> | string
    date?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    location?: StringNullableWithAggregatesFilter<"Event"> | string | null
    isUpcoming?: BoolWithAggregatesFilter<"Event"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Event"> | Date | string
  }

  export type FightWhereInput = {
    AND?: FightWhereInput | FightWhereInput[]
    OR?: FightWhereInput[]
    NOT?: FightWhereInput | FightWhereInput[]
    id?: StringFilter<"Fight"> | string
    eventId?: StringFilter<"Fight"> | string
    fighter1Id?: StringFilter<"Fight"> | string
    fighter2Id?: StringFilter<"Fight"> | string
    winnerId?: StringNullableFilter<"Fight"> | string | null
    weightClass?: StringNullableFilter<"Fight"> | string | null
    rounds?: IntFilter<"Fight"> | number
    isTitleFight?: BoolFilter<"Fight"> | boolean
    oddsFighter1?: IntNullableFilter<"Fight"> | number | null
    oddsFighter2?: IntNullableFilter<"Fight"> | number | null
    aiPrediction?: StringNullableFilter<"Fight"> | string | null
    aiConfidence?: FloatNullableFilter<"Fight"> | number | null
    method?: StringNullableFilter<"Fight"> | string | null
    endingRound?: IntNullableFilter<"Fight"> | number | null
    endingTime?: StringNullableFilter<"Fight"> | string | null
    createdAt?: DateTimeFilter<"Fight"> | Date | string
    updatedAt?: DateTimeFilter<"Fight"> | Date | string
    event?: XOR<EventScalarRelationFilter, EventWhereInput>
    fighter1?: XOR<FighterScalarRelationFilter, FighterWhereInput>
    fighter2?: XOR<FighterScalarRelationFilter, FighterWhereInput>
    winner?: XOR<FighterNullableScalarRelationFilter, FighterWhereInput> | null
  }

  export type FightOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    fighter1Id?: SortOrder
    fighter2Id?: SortOrder
    winnerId?: SortOrderInput | SortOrder
    weightClass?: SortOrderInput | SortOrder
    rounds?: SortOrder
    isTitleFight?: SortOrder
    oddsFighter1?: SortOrderInput | SortOrder
    oddsFighter2?: SortOrderInput | SortOrder
    aiPrediction?: SortOrderInput | SortOrder
    aiConfidence?: SortOrderInput | SortOrder
    method?: SortOrderInput | SortOrder
    endingRound?: SortOrderInput | SortOrder
    endingTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    event?: EventOrderByWithRelationInput
    fighter1?: FighterOrderByWithRelationInput
    fighter2?: FighterOrderByWithRelationInput
    winner?: FighterOrderByWithRelationInput
  }

  export type FightWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    eventId_fighter1Id_fighter2Id?: FightEventIdFighter1IdFighter2IdCompoundUniqueInput
    AND?: FightWhereInput | FightWhereInput[]
    OR?: FightWhereInput[]
    NOT?: FightWhereInput | FightWhereInput[]
    eventId?: StringFilter<"Fight"> | string
    fighter1Id?: StringFilter<"Fight"> | string
    fighter2Id?: StringFilter<"Fight"> | string
    winnerId?: StringNullableFilter<"Fight"> | string | null
    weightClass?: StringNullableFilter<"Fight"> | string | null
    rounds?: IntFilter<"Fight"> | number
    isTitleFight?: BoolFilter<"Fight"> | boolean
    oddsFighter1?: IntNullableFilter<"Fight"> | number | null
    oddsFighter2?: IntNullableFilter<"Fight"> | number | null
    aiPrediction?: StringNullableFilter<"Fight"> | string | null
    aiConfidence?: FloatNullableFilter<"Fight"> | number | null
    method?: StringNullableFilter<"Fight"> | string | null
    endingRound?: IntNullableFilter<"Fight"> | number | null
    endingTime?: StringNullableFilter<"Fight"> | string | null
    createdAt?: DateTimeFilter<"Fight"> | Date | string
    updatedAt?: DateTimeFilter<"Fight"> | Date | string
    event?: XOR<EventScalarRelationFilter, EventWhereInput>
    fighter1?: XOR<FighterScalarRelationFilter, FighterWhereInput>
    fighter2?: XOR<FighterScalarRelationFilter, FighterWhereInput>
    winner?: XOR<FighterNullableScalarRelationFilter, FighterWhereInput> | null
  }, "id" | "eventId_fighter1Id_fighter2Id">

  export type FightOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    fighter1Id?: SortOrder
    fighter2Id?: SortOrder
    winnerId?: SortOrderInput | SortOrder
    weightClass?: SortOrderInput | SortOrder
    rounds?: SortOrder
    isTitleFight?: SortOrder
    oddsFighter1?: SortOrderInput | SortOrder
    oddsFighter2?: SortOrderInput | SortOrder
    aiPrediction?: SortOrderInput | SortOrder
    aiConfidence?: SortOrderInput | SortOrder
    method?: SortOrderInput | SortOrder
    endingRound?: SortOrderInput | SortOrder
    endingTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FightCountOrderByAggregateInput
    _avg?: FightAvgOrderByAggregateInput
    _max?: FightMaxOrderByAggregateInput
    _min?: FightMinOrderByAggregateInput
    _sum?: FightSumOrderByAggregateInput
  }

  export type FightScalarWhereWithAggregatesInput = {
    AND?: FightScalarWhereWithAggregatesInput | FightScalarWhereWithAggregatesInput[]
    OR?: FightScalarWhereWithAggregatesInput[]
    NOT?: FightScalarWhereWithAggregatesInput | FightScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Fight"> | string
    eventId?: StringWithAggregatesFilter<"Fight"> | string
    fighter1Id?: StringWithAggregatesFilter<"Fight"> | string
    fighter2Id?: StringWithAggregatesFilter<"Fight"> | string
    winnerId?: StringNullableWithAggregatesFilter<"Fight"> | string | null
    weightClass?: StringNullableWithAggregatesFilter<"Fight"> | string | null
    rounds?: IntWithAggregatesFilter<"Fight"> | number
    isTitleFight?: BoolWithAggregatesFilter<"Fight"> | boolean
    oddsFighter1?: IntNullableWithAggregatesFilter<"Fight"> | number | null
    oddsFighter2?: IntNullableWithAggregatesFilter<"Fight"> | number | null
    aiPrediction?: StringNullableWithAggregatesFilter<"Fight"> | string | null
    aiConfidence?: FloatNullableWithAggregatesFilter<"Fight"> | number | null
    method?: StringNullableWithAggregatesFilter<"Fight"> | string | null
    endingRound?: IntNullableWithAggregatesFilter<"Fight"> | number | null
    endingTime?: StringNullableWithAggregatesFilter<"Fight"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Fight"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Fight"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscription?: SubscriptionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscription?: SubscriptionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: SubscriptionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: SubscriptionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    status?: string
    currentPeriodEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    userId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    status?: string
    currentPeriodEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    userId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    status?: string
    currentPeriodEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FighterCreateInput = {
    id?: string
    name: string
    weightClass?: string | null
    age?: number | null
    height?: number | null
    reach?: number | null
    wins?: number
    losses?: number
    draws?: number
    koWins?: number
    subWins?: number
    eloRating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    fightsAsFighter1?: FightCreateNestedManyWithoutFighter1Input
    fightsAsFighter2?: FightCreateNestedManyWithoutFighter2Input
    fightsWon?: FightCreateNestedManyWithoutWinnerInput
  }

  export type FighterUncheckedCreateInput = {
    id?: string
    name: string
    weightClass?: string | null
    age?: number | null
    height?: number | null
    reach?: number | null
    wins?: number
    losses?: number
    draws?: number
    koWins?: number
    subWins?: number
    eloRating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    fightsAsFighter1?: FightUncheckedCreateNestedManyWithoutFighter1Input
    fightsAsFighter2?: FightUncheckedCreateNestedManyWithoutFighter2Input
    fightsWon?: FightUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type FighterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableFloatFieldUpdateOperationsInput | number | null
    reach?: NullableFloatFieldUpdateOperationsInput | number | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    koWins?: IntFieldUpdateOperationsInput | number
    subWins?: IntFieldUpdateOperationsInput | number
    eloRating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fightsAsFighter1?: FightUpdateManyWithoutFighter1NestedInput
    fightsAsFighter2?: FightUpdateManyWithoutFighter2NestedInput
    fightsWon?: FightUpdateManyWithoutWinnerNestedInput
  }

  export type FighterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableFloatFieldUpdateOperationsInput | number | null
    reach?: NullableFloatFieldUpdateOperationsInput | number | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    koWins?: IntFieldUpdateOperationsInput | number
    subWins?: IntFieldUpdateOperationsInput | number
    eloRating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fightsAsFighter1?: FightUncheckedUpdateManyWithoutFighter1NestedInput
    fightsAsFighter2?: FightUncheckedUpdateManyWithoutFighter2NestedInput
    fightsWon?: FightUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type FighterCreateManyInput = {
    id?: string
    name: string
    weightClass?: string | null
    age?: number | null
    height?: number | null
    reach?: number | null
    wins?: number
    losses?: number
    draws?: number
    koWins?: number
    subWins?: number
    eloRating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FighterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableFloatFieldUpdateOperationsInput | number | null
    reach?: NullableFloatFieldUpdateOperationsInput | number | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    koWins?: IntFieldUpdateOperationsInput | number
    subWins?: IntFieldUpdateOperationsInput | number
    eloRating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FighterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableFloatFieldUpdateOperationsInput | number | null
    reach?: NullableFloatFieldUpdateOperationsInput | number | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    koWins?: IntFieldUpdateOperationsInput | number
    subWins?: IntFieldUpdateOperationsInput | number
    eloRating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventCreateInput = {
    id?: string
    name: string
    date: Date | string
    location?: string | null
    isUpcoming?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    fights?: FightCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateInput = {
    id?: string
    name: string
    date: Date | string
    location?: string | null
    isUpcoming?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    fights?: FightUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    isUpcoming?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fights?: FightUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    isUpcoming?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fights?: FightUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateManyInput = {
    id?: string
    name: string
    date: Date | string
    location?: string | null
    isUpcoming?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    isUpcoming?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    isUpcoming?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FightCreateInput = {
    id?: string
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    event: EventCreateNestedOneWithoutFightsInput
    fighter1: FighterCreateNestedOneWithoutFightsAsFighter1Input
    fighter2: FighterCreateNestedOneWithoutFightsAsFighter2Input
    winner?: FighterCreateNestedOneWithoutFightsWonInput
  }

  export type FightUncheckedCreateInput = {
    id?: string
    eventId: string
    fighter1Id: string
    fighter2Id: string
    winnerId?: string | null
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FightUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutFightsNestedInput
    fighter1?: FighterUpdateOneRequiredWithoutFightsAsFighter1NestedInput
    fighter2?: FighterUpdateOneRequiredWithoutFightsAsFighter2NestedInput
    winner?: FighterUpdateOneWithoutFightsWonNestedInput
  }

  export type FightUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fighter1Id?: StringFieldUpdateOperationsInput | string
    fighter2Id?: StringFieldUpdateOperationsInput | string
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FightCreateManyInput = {
    id?: string
    eventId: string
    fighter1Id: string
    fighter2Id: string
    winnerId?: string | null
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FightUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FightUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fighter1Id?: StringFieldUpdateOperationsInput | string
    fighter2Id?: StringFieldUpdateOperationsInput | string
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SubscriptionNullableScalarRelationFilter = {
    is?: SubscriptionWhereInput | null
    isNot?: SubscriptionWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FightListRelationFilter = {
    every?: FightWhereInput
    some?: FightWhereInput
    none?: FightWhereInput
  }

  export type FightOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FighterCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    weightClass?: SortOrder
    age?: SortOrder
    height?: SortOrder
    reach?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    koWins?: SortOrder
    subWins?: SortOrder
    eloRating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FighterAvgOrderByAggregateInput = {
    age?: SortOrder
    height?: SortOrder
    reach?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    koWins?: SortOrder
    subWins?: SortOrder
    eloRating?: SortOrder
  }

  export type FighterMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    weightClass?: SortOrder
    age?: SortOrder
    height?: SortOrder
    reach?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    koWins?: SortOrder
    subWins?: SortOrder
    eloRating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FighterMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    weightClass?: SortOrder
    age?: SortOrder
    height?: SortOrder
    reach?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    koWins?: SortOrder
    subWins?: SortOrder
    eloRating?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FighterSumOrderByAggregateInput = {
    age?: SortOrder
    height?: SortOrder
    reach?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    koWins?: SortOrder
    subWins?: SortOrder
    eloRating?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    date?: SortOrder
    location?: SortOrder
    isUpcoming?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    date?: SortOrder
    location?: SortOrder
    isUpcoming?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    date?: SortOrder
    location?: SortOrder
    isUpcoming?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EventScalarRelationFilter = {
    is?: EventWhereInput
    isNot?: EventWhereInput
  }

  export type FighterScalarRelationFilter = {
    is?: FighterWhereInput
    isNot?: FighterWhereInput
  }

  export type FighterNullableScalarRelationFilter = {
    is?: FighterWhereInput | null
    isNot?: FighterWhereInput | null
  }

  export type FightEventIdFighter1IdFighter2IdCompoundUniqueInput = {
    eventId: string
    fighter1Id: string
    fighter2Id: string
  }

  export type FightCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    fighter1Id?: SortOrder
    fighter2Id?: SortOrder
    winnerId?: SortOrder
    weightClass?: SortOrder
    rounds?: SortOrder
    isTitleFight?: SortOrder
    oddsFighter1?: SortOrder
    oddsFighter2?: SortOrder
    aiPrediction?: SortOrder
    aiConfidence?: SortOrder
    method?: SortOrder
    endingRound?: SortOrder
    endingTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FightAvgOrderByAggregateInput = {
    rounds?: SortOrder
    oddsFighter1?: SortOrder
    oddsFighter2?: SortOrder
    aiConfidence?: SortOrder
    endingRound?: SortOrder
  }

  export type FightMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    fighter1Id?: SortOrder
    fighter2Id?: SortOrder
    winnerId?: SortOrder
    weightClass?: SortOrder
    rounds?: SortOrder
    isTitleFight?: SortOrder
    oddsFighter1?: SortOrder
    oddsFighter2?: SortOrder
    aiPrediction?: SortOrder
    aiConfidence?: SortOrder
    method?: SortOrder
    endingRound?: SortOrder
    endingTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FightMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    fighter1Id?: SortOrder
    fighter2Id?: SortOrder
    winnerId?: SortOrder
    weightClass?: SortOrder
    rounds?: SortOrder
    isTitleFight?: SortOrder
    oddsFighter1?: SortOrder
    oddsFighter2?: SortOrder
    aiPrediction?: SortOrder
    aiConfidence?: SortOrder
    method?: SortOrder
    endingRound?: SortOrder
    endingTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FightSumOrderByAggregateInput = {
    rounds?: SortOrder
    oddsFighter1?: SortOrder
    oddsFighter2?: SortOrder
    aiConfidence?: SortOrder
    endingRound?: SortOrder
  }

  export type SubscriptionCreateNestedOneWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type SubscriptionUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SubscriptionUpdateOneWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    upsert?: SubscriptionUpsertWithoutUserInput
    disconnect?: SubscriptionWhereInput | boolean
    delete?: SubscriptionWhereInput | boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutUserInput, SubscriptionUpdateWithoutUserInput>, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput
    upsert?: SubscriptionUpsertWithoutUserInput
    disconnect?: SubscriptionWhereInput | boolean
    delete?: SubscriptionWhereInput | boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutUserInput, SubscriptionUpdateWithoutUserInput>, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutSubscriptionInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutSubscriptionNestedInput = {
    create?: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionInput
    upsert?: UserUpsertWithoutSubscriptionInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubscriptionInput, UserUpdateWithoutSubscriptionInput>, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type FightCreateNestedManyWithoutFighter1Input = {
    create?: XOR<FightCreateWithoutFighter1Input, FightUncheckedCreateWithoutFighter1Input> | FightCreateWithoutFighter1Input[] | FightUncheckedCreateWithoutFighter1Input[]
    connectOrCreate?: FightCreateOrConnectWithoutFighter1Input | FightCreateOrConnectWithoutFighter1Input[]
    createMany?: FightCreateManyFighter1InputEnvelope
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
  }

  export type FightCreateNestedManyWithoutFighter2Input = {
    create?: XOR<FightCreateWithoutFighter2Input, FightUncheckedCreateWithoutFighter2Input> | FightCreateWithoutFighter2Input[] | FightUncheckedCreateWithoutFighter2Input[]
    connectOrCreate?: FightCreateOrConnectWithoutFighter2Input | FightCreateOrConnectWithoutFighter2Input[]
    createMany?: FightCreateManyFighter2InputEnvelope
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
  }

  export type FightCreateNestedManyWithoutWinnerInput = {
    create?: XOR<FightCreateWithoutWinnerInput, FightUncheckedCreateWithoutWinnerInput> | FightCreateWithoutWinnerInput[] | FightUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: FightCreateOrConnectWithoutWinnerInput | FightCreateOrConnectWithoutWinnerInput[]
    createMany?: FightCreateManyWinnerInputEnvelope
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
  }

  export type FightUncheckedCreateNestedManyWithoutFighter1Input = {
    create?: XOR<FightCreateWithoutFighter1Input, FightUncheckedCreateWithoutFighter1Input> | FightCreateWithoutFighter1Input[] | FightUncheckedCreateWithoutFighter1Input[]
    connectOrCreate?: FightCreateOrConnectWithoutFighter1Input | FightCreateOrConnectWithoutFighter1Input[]
    createMany?: FightCreateManyFighter1InputEnvelope
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
  }

  export type FightUncheckedCreateNestedManyWithoutFighter2Input = {
    create?: XOR<FightCreateWithoutFighter2Input, FightUncheckedCreateWithoutFighter2Input> | FightCreateWithoutFighter2Input[] | FightUncheckedCreateWithoutFighter2Input[]
    connectOrCreate?: FightCreateOrConnectWithoutFighter2Input | FightCreateOrConnectWithoutFighter2Input[]
    createMany?: FightCreateManyFighter2InputEnvelope
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
  }

  export type FightUncheckedCreateNestedManyWithoutWinnerInput = {
    create?: XOR<FightCreateWithoutWinnerInput, FightUncheckedCreateWithoutWinnerInput> | FightCreateWithoutWinnerInput[] | FightUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: FightCreateOrConnectWithoutWinnerInput | FightCreateOrConnectWithoutWinnerInput[]
    createMany?: FightCreateManyWinnerInputEnvelope
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FightUpdateManyWithoutFighter1NestedInput = {
    create?: XOR<FightCreateWithoutFighter1Input, FightUncheckedCreateWithoutFighter1Input> | FightCreateWithoutFighter1Input[] | FightUncheckedCreateWithoutFighter1Input[]
    connectOrCreate?: FightCreateOrConnectWithoutFighter1Input | FightCreateOrConnectWithoutFighter1Input[]
    upsert?: FightUpsertWithWhereUniqueWithoutFighter1Input | FightUpsertWithWhereUniqueWithoutFighter1Input[]
    createMany?: FightCreateManyFighter1InputEnvelope
    set?: FightWhereUniqueInput | FightWhereUniqueInput[]
    disconnect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    delete?: FightWhereUniqueInput | FightWhereUniqueInput[]
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    update?: FightUpdateWithWhereUniqueWithoutFighter1Input | FightUpdateWithWhereUniqueWithoutFighter1Input[]
    updateMany?: FightUpdateManyWithWhereWithoutFighter1Input | FightUpdateManyWithWhereWithoutFighter1Input[]
    deleteMany?: FightScalarWhereInput | FightScalarWhereInput[]
  }

  export type FightUpdateManyWithoutFighter2NestedInput = {
    create?: XOR<FightCreateWithoutFighter2Input, FightUncheckedCreateWithoutFighter2Input> | FightCreateWithoutFighter2Input[] | FightUncheckedCreateWithoutFighter2Input[]
    connectOrCreate?: FightCreateOrConnectWithoutFighter2Input | FightCreateOrConnectWithoutFighter2Input[]
    upsert?: FightUpsertWithWhereUniqueWithoutFighter2Input | FightUpsertWithWhereUniqueWithoutFighter2Input[]
    createMany?: FightCreateManyFighter2InputEnvelope
    set?: FightWhereUniqueInput | FightWhereUniqueInput[]
    disconnect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    delete?: FightWhereUniqueInput | FightWhereUniqueInput[]
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    update?: FightUpdateWithWhereUniqueWithoutFighter2Input | FightUpdateWithWhereUniqueWithoutFighter2Input[]
    updateMany?: FightUpdateManyWithWhereWithoutFighter2Input | FightUpdateManyWithWhereWithoutFighter2Input[]
    deleteMany?: FightScalarWhereInput | FightScalarWhereInput[]
  }

  export type FightUpdateManyWithoutWinnerNestedInput = {
    create?: XOR<FightCreateWithoutWinnerInput, FightUncheckedCreateWithoutWinnerInput> | FightCreateWithoutWinnerInput[] | FightUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: FightCreateOrConnectWithoutWinnerInput | FightCreateOrConnectWithoutWinnerInput[]
    upsert?: FightUpsertWithWhereUniqueWithoutWinnerInput | FightUpsertWithWhereUniqueWithoutWinnerInput[]
    createMany?: FightCreateManyWinnerInputEnvelope
    set?: FightWhereUniqueInput | FightWhereUniqueInput[]
    disconnect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    delete?: FightWhereUniqueInput | FightWhereUniqueInput[]
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    update?: FightUpdateWithWhereUniqueWithoutWinnerInput | FightUpdateWithWhereUniqueWithoutWinnerInput[]
    updateMany?: FightUpdateManyWithWhereWithoutWinnerInput | FightUpdateManyWithWhereWithoutWinnerInput[]
    deleteMany?: FightScalarWhereInput | FightScalarWhereInput[]
  }

  export type FightUncheckedUpdateManyWithoutFighter1NestedInput = {
    create?: XOR<FightCreateWithoutFighter1Input, FightUncheckedCreateWithoutFighter1Input> | FightCreateWithoutFighter1Input[] | FightUncheckedCreateWithoutFighter1Input[]
    connectOrCreate?: FightCreateOrConnectWithoutFighter1Input | FightCreateOrConnectWithoutFighter1Input[]
    upsert?: FightUpsertWithWhereUniqueWithoutFighter1Input | FightUpsertWithWhereUniqueWithoutFighter1Input[]
    createMany?: FightCreateManyFighter1InputEnvelope
    set?: FightWhereUniqueInput | FightWhereUniqueInput[]
    disconnect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    delete?: FightWhereUniqueInput | FightWhereUniqueInput[]
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    update?: FightUpdateWithWhereUniqueWithoutFighter1Input | FightUpdateWithWhereUniqueWithoutFighter1Input[]
    updateMany?: FightUpdateManyWithWhereWithoutFighter1Input | FightUpdateManyWithWhereWithoutFighter1Input[]
    deleteMany?: FightScalarWhereInput | FightScalarWhereInput[]
  }

  export type FightUncheckedUpdateManyWithoutFighter2NestedInput = {
    create?: XOR<FightCreateWithoutFighter2Input, FightUncheckedCreateWithoutFighter2Input> | FightCreateWithoutFighter2Input[] | FightUncheckedCreateWithoutFighter2Input[]
    connectOrCreate?: FightCreateOrConnectWithoutFighter2Input | FightCreateOrConnectWithoutFighter2Input[]
    upsert?: FightUpsertWithWhereUniqueWithoutFighter2Input | FightUpsertWithWhereUniqueWithoutFighter2Input[]
    createMany?: FightCreateManyFighter2InputEnvelope
    set?: FightWhereUniqueInput | FightWhereUniqueInput[]
    disconnect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    delete?: FightWhereUniqueInput | FightWhereUniqueInput[]
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    update?: FightUpdateWithWhereUniqueWithoutFighter2Input | FightUpdateWithWhereUniqueWithoutFighter2Input[]
    updateMany?: FightUpdateManyWithWhereWithoutFighter2Input | FightUpdateManyWithWhereWithoutFighter2Input[]
    deleteMany?: FightScalarWhereInput | FightScalarWhereInput[]
  }

  export type FightUncheckedUpdateManyWithoutWinnerNestedInput = {
    create?: XOR<FightCreateWithoutWinnerInput, FightUncheckedCreateWithoutWinnerInput> | FightCreateWithoutWinnerInput[] | FightUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: FightCreateOrConnectWithoutWinnerInput | FightCreateOrConnectWithoutWinnerInput[]
    upsert?: FightUpsertWithWhereUniqueWithoutWinnerInput | FightUpsertWithWhereUniqueWithoutWinnerInput[]
    createMany?: FightCreateManyWinnerInputEnvelope
    set?: FightWhereUniqueInput | FightWhereUniqueInput[]
    disconnect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    delete?: FightWhereUniqueInput | FightWhereUniqueInput[]
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    update?: FightUpdateWithWhereUniqueWithoutWinnerInput | FightUpdateWithWhereUniqueWithoutWinnerInput[]
    updateMany?: FightUpdateManyWithWhereWithoutWinnerInput | FightUpdateManyWithWhereWithoutWinnerInput[]
    deleteMany?: FightScalarWhereInput | FightScalarWhereInput[]
  }

  export type FightCreateNestedManyWithoutEventInput = {
    create?: XOR<FightCreateWithoutEventInput, FightUncheckedCreateWithoutEventInput> | FightCreateWithoutEventInput[] | FightUncheckedCreateWithoutEventInput[]
    connectOrCreate?: FightCreateOrConnectWithoutEventInput | FightCreateOrConnectWithoutEventInput[]
    createMany?: FightCreateManyEventInputEnvelope
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
  }

  export type FightUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<FightCreateWithoutEventInput, FightUncheckedCreateWithoutEventInput> | FightCreateWithoutEventInput[] | FightUncheckedCreateWithoutEventInput[]
    connectOrCreate?: FightCreateOrConnectWithoutEventInput | FightCreateOrConnectWithoutEventInput[]
    createMany?: FightCreateManyEventInputEnvelope
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type FightUpdateManyWithoutEventNestedInput = {
    create?: XOR<FightCreateWithoutEventInput, FightUncheckedCreateWithoutEventInput> | FightCreateWithoutEventInput[] | FightUncheckedCreateWithoutEventInput[]
    connectOrCreate?: FightCreateOrConnectWithoutEventInput | FightCreateOrConnectWithoutEventInput[]
    upsert?: FightUpsertWithWhereUniqueWithoutEventInput | FightUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: FightCreateManyEventInputEnvelope
    set?: FightWhereUniqueInput | FightWhereUniqueInput[]
    disconnect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    delete?: FightWhereUniqueInput | FightWhereUniqueInput[]
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    update?: FightUpdateWithWhereUniqueWithoutEventInput | FightUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: FightUpdateManyWithWhereWithoutEventInput | FightUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: FightScalarWhereInput | FightScalarWhereInput[]
  }

  export type FightUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<FightCreateWithoutEventInput, FightUncheckedCreateWithoutEventInput> | FightCreateWithoutEventInput[] | FightUncheckedCreateWithoutEventInput[]
    connectOrCreate?: FightCreateOrConnectWithoutEventInput | FightCreateOrConnectWithoutEventInput[]
    upsert?: FightUpsertWithWhereUniqueWithoutEventInput | FightUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: FightCreateManyEventInputEnvelope
    set?: FightWhereUniqueInput | FightWhereUniqueInput[]
    disconnect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    delete?: FightWhereUniqueInput | FightWhereUniqueInput[]
    connect?: FightWhereUniqueInput | FightWhereUniqueInput[]
    update?: FightUpdateWithWhereUniqueWithoutEventInput | FightUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: FightUpdateManyWithWhereWithoutEventInput | FightUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: FightScalarWhereInput | FightScalarWhereInput[]
  }

  export type EventCreateNestedOneWithoutFightsInput = {
    create?: XOR<EventCreateWithoutFightsInput, EventUncheckedCreateWithoutFightsInput>
    connectOrCreate?: EventCreateOrConnectWithoutFightsInput
    connect?: EventWhereUniqueInput
  }

  export type FighterCreateNestedOneWithoutFightsAsFighter1Input = {
    create?: XOR<FighterCreateWithoutFightsAsFighter1Input, FighterUncheckedCreateWithoutFightsAsFighter1Input>
    connectOrCreate?: FighterCreateOrConnectWithoutFightsAsFighter1Input
    connect?: FighterWhereUniqueInput
  }

  export type FighterCreateNestedOneWithoutFightsAsFighter2Input = {
    create?: XOR<FighterCreateWithoutFightsAsFighter2Input, FighterUncheckedCreateWithoutFightsAsFighter2Input>
    connectOrCreate?: FighterCreateOrConnectWithoutFightsAsFighter2Input
    connect?: FighterWhereUniqueInput
  }

  export type FighterCreateNestedOneWithoutFightsWonInput = {
    create?: XOR<FighterCreateWithoutFightsWonInput, FighterUncheckedCreateWithoutFightsWonInput>
    connectOrCreate?: FighterCreateOrConnectWithoutFightsWonInput
    connect?: FighterWhereUniqueInput
  }

  export type EventUpdateOneRequiredWithoutFightsNestedInput = {
    create?: XOR<EventCreateWithoutFightsInput, EventUncheckedCreateWithoutFightsInput>
    connectOrCreate?: EventCreateOrConnectWithoutFightsInput
    upsert?: EventUpsertWithoutFightsInput
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutFightsInput, EventUpdateWithoutFightsInput>, EventUncheckedUpdateWithoutFightsInput>
  }

  export type FighterUpdateOneRequiredWithoutFightsAsFighter1NestedInput = {
    create?: XOR<FighterCreateWithoutFightsAsFighter1Input, FighterUncheckedCreateWithoutFightsAsFighter1Input>
    connectOrCreate?: FighterCreateOrConnectWithoutFightsAsFighter1Input
    upsert?: FighterUpsertWithoutFightsAsFighter1Input
    connect?: FighterWhereUniqueInput
    update?: XOR<XOR<FighterUpdateToOneWithWhereWithoutFightsAsFighter1Input, FighterUpdateWithoutFightsAsFighter1Input>, FighterUncheckedUpdateWithoutFightsAsFighter1Input>
  }

  export type FighterUpdateOneRequiredWithoutFightsAsFighter2NestedInput = {
    create?: XOR<FighterCreateWithoutFightsAsFighter2Input, FighterUncheckedCreateWithoutFightsAsFighter2Input>
    connectOrCreate?: FighterCreateOrConnectWithoutFightsAsFighter2Input
    upsert?: FighterUpsertWithoutFightsAsFighter2Input
    connect?: FighterWhereUniqueInput
    update?: XOR<XOR<FighterUpdateToOneWithWhereWithoutFightsAsFighter2Input, FighterUpdateWithoutFightsAsFighter2Input>, FighterUncheckedUpdateWithoutFightsAsFighter2Input>
  }

  export type FighterUpdateOneWithoutFightsWonNestedInput = {
    create?: XOR<FighterCreateWithoutFightsWonInput, FighterUncheckedCreateWithoutFightsWonInput>
    connectOrCreate?: FighterCreateOrConnectWithoutFightsWonInput
    upsert?: FighterUpsertWithoutFightsWonInput
    disconnect?: FighterWhereInput | boolean
    delete?: FighterWhereInput | boolean
    connect?: FighterWhereUniqueInput
    update?: XOR<XOR<FighterUpdateToOneWithWhereWithoutFightsWonInput, FighterUpdateWithoutFightsWonInput>, FighterUncheckedUpdateWithoutFightsWonInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type SubscriptionCreateWithoutUserInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    status?: string
    currentPeriodEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionUncheckedCreateWithoutUserInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    status?: string
    currentPeriodEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionUpsertWithoutUserInput = {
    update: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
    where?: SubscriptionWhereInput
  }

  export type SubscriptionUpdateToOneWithWhereWithoutUserInput = {
    where?: SubscriptionWhereInput
    data: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutSubscriptionInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutSubscriptionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
  }

  export type UserUpsertWithoutSubscriptionInput = {
    update: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<UserCreateWithoutSubscriptionInput, UserUncheckedCreateWithoutSubscriptionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubscriptionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubscriptionInput, UserUncheckedUpdateWithoutSubscriptionInput>
  }

  export type UserUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FightCreateWithoutFighter1Input = {
    id?: string
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    event: EventCreateNestedOneWithoutFightsInput
    fighter2: FighterCreateNestedOneWithoutFightsAsFighter2Input
    winner?: FighterCreateNestedOneWithoutFightsWonInput
  }

  export type FightUncheckedCreateWithoutFighter1Input = {
    id?: string
    eventId: string
    fighter2Id: string
    winnerId?: string | null
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FightCreateOrConnectWithoutFighter1Input = {
    where: FightWhereUniqueInput
    create: XOR<FightCreateWithoutFighter1Input, FightUncheckedCreateWithoutFighter1Input>
  }

  export type FightCreateManyFighter1InputEnvelope = {
    data: FightCreateManyFighter1Input | FightCreateManyFighter1Input[]
    skipDuplicates?: boolean
  }

  export type FightCreateWithoutFighter2Input = {
    id?: string
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    event: EventCreateNestedOneWithoutFightsInput
    fighter1: FighterCreateNestedOneWithoutFightsAsFighter1Input
    winner?: FighterCreateNestedOneWithoutFightsWonInput
  }

  export type FightUncheckedCreateWithoutFighter2Input = {
    id?: string
    eventId: string
    fighter1Id: string
    winnerId?: string | null
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FightCreateOrConnectWithoutFighter2Input = {
    where: FightWhereUniqueInput
    create: XOR<FightCreateWithoutFighter2Input, FightUncheckedCreateWithoutFighter2Input>
  }

  export type FightCreateManyFighter2InputEnvelope = {
    data: FightCreateManyFighter2Input | FightCreateManyFighter2Input[]
    skipDuplicates?: boolean
  }

  export type FightCreateWithoutWinnerInput = {
    id?: string
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    event: EventCreateNestedOneWithoutFightsInput
    fighter1: FighterCreateNestedOneWithoutFightsAsFighter1Input
    fighter2: FighterCreateNestedOneWithoutFightsAsFighter2Input
  }

  export type FightUncheckedCreateWithoutWinnerInput = {
    id?: string
    eventId: string
    fighter1Id: string
    fighter2Id: string
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FightCreateOrConnectWithoutWinnerInput = {
    where: FightWhereUniqueInput
    create: XOR<FightCreateWithoutWinnerInput, FightUncheckedCreateWithoutWinnerInput>
  }

  export type FightCreateManyWinnerInputEnvelope = {
    data: FightCreateManyWinnerInput | FightCreateManyWinnerInput[]
    skipDuplicates?: boolean
  }

  export type FightUpsertWithWhereUniqueWithoutFighter1Input = {
    where: FightWhereUniqueInput
    update: XOR<FightUpdateWithoutFighter1Input, FightUncheckedUpdateWithoutFighter1Input>
    create: XOR<FightCreateWithoutFighter1Input, FightUncheckedCreateWithoutFighter1Input>
  }

  export type FightUpdateWithWhereUniqueWithoutFighter1Input = {
    where: FightWhereUniqueInput
    data: XOR<FightUpdateWithoutFighter1Input, FightUncheckedUpdateWithoutFighter1Input>
  }

  export type FightUpdateManyWithWhereWithoutFighter1Input = {
    where: FightScalarWhereInput
    data: XOR<FightUpdateManyMutationInput, FightUncheckedUpdateManyWithoutFighter1Input>
  }

  export type FightScalarWhereInput = {
    AND?: FightScalarWhereInput | FightScalarWhereInput[]
    OR?: FightScalarWhereInput[]
    NOT?: FightScalarWhereInput | FightScalarWhereInput[]
    id?: StringFilter<"Fight"> | string
    eventId?: StringFilter<"Fight"> | string
    fighter1Id?: StringFilter<"Fight"> | string
    fighter2Id?: StringFilter<"Fight"> | string
    winnerId?: StringNullableFilter<"Fight"> | string | null
    weightClass?: StringNullableFilter<"Fight"> | string | null
    rounds?: IntFilter<"Fight"> | number
    isTitleFight?: BoolFilter<"Fight"> | boolean
    oddsFighter1?: IntNullableFilter<"Fight"> | number | null
    oddsFighter2?: IntNullableFilter<"Fight"> | number | null
    aiPrediction?: StringNullableFilter<"Fight"> | string | null
    aiConfidence?: FloatNullableFilter<"Fight"> | number | null
    method?: StringNullableFilter<"Fight"> | string | null
    endingRound?: IntNullableFilter<"Fight"> | number | null
    endingTime?: StringNullableFilter<"Fight"> | string | null
    createdAt?: DateTimeFilter<"Fight"> | Date | string
    updatedAt?: DateTimeFilter<"Fight"> | Date | string
  }

  export type FightUpsertWithWhereUniqueWithoutFighter2Input = {
    where: FightWhereUniqueInput
    update: XOR<FightUpdateWithoutFighter2Input, FightUncheckedUpdateWithoutFighter2Input>
    create: XOR<FightCreateWithoutFighter2Input, FightUncheckedCreateWithoutFighter2Input>
  }

  export type FightUpdateWithWhereUniqueWithoutFighter2Input = {
    where: FightWhereUniqueInput
    data: XOR<FightUpdateWithoutFighter2Input, FightUncheckedUpdateWithoutFighter2Input>
  }

  export type FightUpdateManyWithWhereWithoutFighter2Input = {
    where: FightScalarWhereInput
    data: XOR<FightUpdateManyMutationInput, FightUncheckedUpdateManyWithoutFighter2Input>
  }

  export type FightUpsertWithWhereUniqueWithoutWinnerInput = {
    where: FightWhereUniqueInput
    update: XOR<FightUpdateWithoutWinnerInput, FightUncheckedUpdateWithoutWinnerInput>
    create: XOR<FightCreateWithoutWinnerInput, FightUncheckedCreateWithoutWinnerInput>
  }

  export type FightUpdateWithWhereUniqueWithoutWinnerInput = {
    where: FightWhereUniqueInput
    data: XOR<FightUpdateWithoutWinnerInput, FightUncheckedUpdateWithoutWinnerInput>
  }

  export type FightUpdateManyWithWhereWithoutWinnerInput = {
    where: FightScalarWhereInput
    data: XOR<FightUpdateManyMutationInput, FightUncheckedUpdateManyWithoutWinnerInput>
  }

  export type FightCreateWithoutEventInput = {
    id?: string
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    fighter1: FighterCreateNestedOneWithoutFightsAsFighter1Input
    fighter2: FighterCreateNestedOneWithoutFightsAsFighter2Input
    winner?: FighterCreateNestedOneWithoutFightsWonInput
  }

  export type FightUncheckedCreateWithoutEventInput = {
    id?: string
    fighter1Id: string
    fighter2Id: string
    winnerId?: string | null
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FightCreateOrConnectWithoutEventInput = {
    where: FightWhereUniqueInput
    create: XOR<FightCreateWithoutEventInput, FightUncheckedCreateWithoutEventInput>
  }

  export type FightCreateManyEventInputEnvelope = {
    data: FightCreateManyEventInput | FightCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type FightUpsertWithWhereUniqueWithoutEventInput = {
    where: FightWhereUniqueInput
    update: XOR<FightUpdateWithoutEventInput, FightUncheckedUpdateWithoutEventInput>
    create: XOR<FightCreateWithoutEventInput, FightUncheckedCreateWithoutEventInput>
  }

  export type FightUpdateWithWhereUniqueWithoutEventInput = {
    where: FightWhereUniqueInput
    data: XOR<FightUpdateWithoutEventInput, FightUncheckedUpdateWithoutEventInput>
  }

  export type FightUpdateManyWithWhereWithoutEventInput = {
    where: FightScalarWhereInput
    data: XOR<FightUpdateManyMutationInput, FightUncheckedUpdateManyWithoutEventInput>
  }

  export type EventCreateWithoutFightsInput = {
    id?: string
    name: string
    date: Date | string
    location?: string | null
    isUpcoming?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventUncheckedCreateWithoutFightsInput = {
    id?: string
    name: string
    date: Date | string
    location?: string | null
    isUpcoming?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventCreateOrConnectWithoutFightsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutFightsInput, EventUncheckedCreateWithoutFightsInput>
  }

  export type FighterCreateWithoutFightsAsFighter1Input = {
    id?: string
    name: string
    weightClass?: string | null
    age?: number | null
    height?: number | null
    reach?: number | null
    wins?: number
    losses?: number
    draws?: number
    koWins?: number
    subWins?: number
    eloRating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    fightsAsFighter2?: FightCreateNestedManyWithoutFighter2Input
    fightsWon?: FightCreateNestedManyWithoutWinnerInput
  }

  export type FighterUncheckedCreateWithoutFightsAsFighter1Input = {
    id?: string
    name: string
    weightClass?: string | null
    age?: number | null
    height?: number | null
    reach?: number | null
    wins?: number
    losses?: number
    draws?: number
    koWins?: number
    subWins?: number
    eloRating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    fightsAsFighter2?: FightUncheckedCreateNestedManyWithoutFighter2Input
    fightsWon?: FightUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type FighterCreateOrConnectWithoutFightsAsFighter1Input = {
    where: FighterWhereUniqueInput
    create: XOR<FighterCreateWithoutFightsAsFighter1Input, FighterUncheckedCreateWithoutFightsAsFighter1Input>
  }

  export type FighterCreateWithoutFightsAsFighter2Input = {
    id?: string
    name: string
    weightClass?: string | null
    age?: number | null
    height?: number | null
    reach?: number | null
    wins?: number
    losses?: number
    draws?: number
    koWins?: number
    subWins?: number
    eloRating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    fightsAsFighter1?: FightCreateNestedManyWithoutFighter1Input
    fightsWon?: FightCreateNestedManyWithoutWinnerInput
  }

  export type FighterUncheckedCreateWithoutFightsAsFighter2Input = {
    id?: string
    name: string
    weightClass?: string | null
    age?: number | null
    height?: number | null
    reach?: number | null
    wins?: number
    losses?: number
    draws?: number
    koWins?: number
    subWins?: number
    eloRating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    fightsAsFighter1?: FightUncheckedCreateNestedManyWithoutFighter1Input
    fightsWon?: FightUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type FighterCreateOrConnectWithoutFightsAsFighter2Input = {
    where: FighterWhereUniqueInput
    create: XOR<FighterCreateWithoutFightsAsFighter2Input, FighterUncheckedCreateWithoutFightsAsFighter2Input>
  }

  export type FighterCreateWithoutFightsWonInput = {
    id?: string
    name: string
    weightClass?: string | null
    age?: number | null
    height?: number | null
    reach?: number | null
    wins?: number
    losses?: number
    draws?: number
    koWins?: number
    subWins?: number
    eloRating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    fightsAsFighter1?: FightCreateNestedManyWithoutFighter1Input
    fightsAsFighter2?: FightCreateNestedManyWithoutFighter2Input
  }

  export type FighterUncheckedCreateWithoutFightsWonInput = {
    id?: string
    name: string
    weightClass?: string | null
    age?: number | null
    height?: number | null
    reach?: number | null
    wins?: number
    losses?: number
    draws?: number
    koWins?: number
    subWins?: number
    eloRating?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    fightsAsFighter1?: FightUncheckedCreateNestedManyWithoutFighter1Input
    fightsAsFighter2?: FightUncheckedCreateNestedManyWithoutFighter2Input
  }

  export type FighterCreateOrConnectWithoutFightsWonInput = {
    where: FighterWhereUniqueInput
    create: XOR<FighterCreateWithoutFightsWonInput, FighterUncheckedCreateWithoutFightsWonInput>
  }

  export type EventUpsertWithoutFightsInput = {
    update: XOR<EventUpdateWithoutFightsInput, EventUncheckedUpdateWithoutFightsInput>
    create: XOR<EventCreateWithoutFightsInput, EventUncheckedCreateWithoutFightsInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutFightsInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutFightsInput, EventUncheckedUpdateWithoutFightsInput>
  }

  export type EventUpdateWithoutFightsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    isUpcoming?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateWithoutFightsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: NullableStringFieldUpdateOperationsInput | string | null
    isUpcoming?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FighterUpsertWithoutFightsAsFighter1Input = {
    update: XOR<FighterUpdateWithoutFightsAsFighter1Input, FighterUncheckedUpdateWithoutFightsAsFighter1Input>
    create: XOR<FighterCreateWithoutFightsAsFighter1Input, FighterUncheckedCreateWithoutFightsAsFighter1Input>
    where?: FighterWhereInput
  }

  export type FighterUpdateToOneWithWhereWithoutFightsAsFighter1Input = {
    where?: FighterWhereInput
    data: XOR<FighterUpdateWithoutFightsAsFighter1Input, FighterUncheckedUpdateWithoutFightsAsFighter1Input>
  }

  export type FighterUpdateWithoutFightsAsFighter1Input = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableFloatFieldUpdateOperationsInput | number | null
    reach?: NullableFloatFieldUpdateOperationsInput | number | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    koWins?: IntFieldUpdateOperationsInput | number
    subWins?: IntFieldUpdateOperationsInput | number
    eloRating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fightsAsFighter2?: FightUpdateManyWithoutFighter2NestedInput
    fightsWon?: FightUpdateManyWithoutWinnerNestedInput
  }

  export type FighterUncheckedUpdateWithoutFightsAsFighter1Input = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableFloatFieldUpdateOperationsInput | number | null
    reach?: NullableFloatFieldUpdateOperationsInput | number | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    koWins?: IntFieldUpdateOperationsInput | number
    subWins?: IntFieldUpdateOperationsInput | number
    eloRating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fightsAsFighter2?: FightUncheckedUpdateManyWithoutFighter2NestedInput
    fightsWon?: FightUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type FighterUpsertWithoutFightsAsFighter2Input = {
    update: XOR<FighterUpdateWithoutFightsAsFighter2Input, FighterUncheckedUpdateWithoutFightsAsFighter2Input>
    create: XOR<FighterCreateWithoutFightsAsFighter2Input, FighterUncheckedCreateWithoutFightsAsFighter2Input>
    where?: FighterWhereInput
  }

  export type FighterUpdateToOneWithWhereWithoutFightsAsFighter2Input = {
    where?: FighterWhereInput
    data: XOR<FighterUpdateWithoutFightsAsFighter2Input, FighterUncheckedUpdateWithoutFightsAsFighter2Input>
  }

  export type FighterUpdateWithoutFightsAsFighter2Input = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableFloatFieldUpdateOperationsInput | number | null
    reach?: NullableFloatFieldUpdateOperationsInput | number | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    koWins?: IntFieldUpdateOperationsInput | number
    subWins?: IntFieldUpdateOperationsInput | number
    eloRating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fightsAsFighter1?: FightUpdateManyWithoutFighter1NestedInput
    fightsWon?: FightUpdateManyWithoutWinnerNestedInput
  }

  export type FighterUncheckedUpdateWithoutFightsAsFighter2Input = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableFloatFieldUpdateOperationsInput | number | null
    reach?: NullableFloatFieldUpdateOperationsInput | number | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    koWins?: IntFieldUpdateOperationsInput | number
    subWins?: IntFieldUpdateOperationsInput | number
    eloRating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fightsAsFighter1?: FightUncheckedUpdateManyWithoutFighter1NestedInput
    fightsWon?: FightUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type FighterUpsertWithoutFightsWonInput = {
    update: XOR<FighterUpdateWithoutFightsWonInput, FighterUncheckedUpdateWithoutFightsWonInput>
    create: XOR<FighterCreateWithoutFightsWonInput, FighterUncheckedCreateWithoutFightsWonInput>
    where?: FighterWhereInput
  }

  export type FighterUpdateToOneWithWhereWithoutFightsWonInput = {
    where?: FighterWhereInput
    data: XOR<FighterUpdateWithoutFightsWonInput, FighterUncheckedUpdateWithoutFightsWonInput>
  }

  export type FighterUpdateWithoutFightsWonInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableFloatFieldUpdateOperationsInput | number | null
    reach?: NullableFloatFieldUpdateOperationsInput | number | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    koWins?: IntFieldUpdateOperationsInput | number
    subWins?: IntFieldUpdateOperationsInput | number
    eloRating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fightsAsFighter1?: FightUpdateManyWithoutFighter1NestedInput
    fightsAsFighter2?: FightUpdateManyWithoutFighter2NestedInput
  }

  export type FighterUncheckedUpdateWithoutFightsWonInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableFloatFieldUpdateOperationsInput | number | null
    reach?: NullableFloatFieldUpdateOperationsInput | number | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    koWins?: IntFieldUpdateOperationsInput | number
    subWins?: IntFieldUpdateOperationsInput | number
    eloRating?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fightsAsFighter1?: FightUncheckedUpdateManyWithoutFighter1NestedInput
    fightsAsFighter2?: FightUncheckedUpdateManyWithoutFighter2NestedInput
  }

  export type FightCreateManyFighter1Input = {
    id?: string
    eventId: string
    fighter2Id: string
    winnerId?: string | null
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FightCreateManyFighter2Input = {
    id?: string
    eventId: string
    fighter1Id: string
    winnerId?: string | null
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FightCreateManyWinnerInput = {
    id?: string
    eventId: string
    fighter1Id: string
    fighter2Id: string
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FightUpdateWithoutFighter1Input = {
    id?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutFightsNestedInput
    fighter2?: FighterUpdateOneRequiredWithoutFightsAsFighter2NestedInput
    winner?: FighterUpdateOneWithoutFightsWonNestedInput
  }

  export type FightUncheckedUpdateWithoutFighter1Input = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fighter2Id?: StringFieldUpdateOperationsInput | string
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FightUncheckedUpdateManyWithoutFighter1Input = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fighter2Id?: StringFieldUpdateOperationsInput | string
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FightUpdateWithoutFighter2Input = {
    id?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutFightsNestedInput
    fighter1?: FighterUpdateOneRequiredWithoutFightsAsFighter1NestedInput
    winner?: FighterUpdateOneWithoutFightsWonNestedInput
  }

  export type FightUncheckedUpdateWithoutFighter2Input = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fighter1Id?: StringFieldUpdateOperationsInput | string
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FightUncheckedUpdateManyWithoutFighter2Input = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fighter1Id?: StringFieldUpdateOperationsInput | string
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FightUpdateWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: EventUpdateOneRequiredWithoutFightsNestedInput
    fighter1?: FighterUpdateOneRequiredWithoutFightsAsFighter1NestedInput
    fighter2?: FighterUpdateOneRequiredWithoutFightsAsFighter2NestedInput
  }

  export type FightUncheckedUpdateWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fighter1Id?: StringFieldUpdateOperationsInput | string
    fighter2Id?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FightUncheckedUpdateManyWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    fighter1Id?: StringFieldUpdateOperationsInput | string
    fighter2Id?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FightCreateManyEventInput = {
    id?: string
    fighter1Id: string
    fighter2Id: string
    winnerId?: string | null
    weightClass?: string | null
    rounds?: number
    isTitleFight?: boolean
    oddsFighter1?: number | null
    oddsFighter2?: number | null
    aiPrediction?: string | null
    aiConfidence?: number | null
    method?: string | null
    endingRound?: number | null
    endingTime?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FightUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fighter1?: FighterUpdateOneRequiredWithoutFightsAsFighter1NestedInput
    fighter2?: FighterUpdateOneRequiredWithoutFightsAsFighter2NestedInput
    winner?: FighterUpdateOneWithoutFightsWonNestedInput
  }

  export type FightUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    fighter1Id?: StringFieldUpdateOperationsInput | string
    fighter2Id?: StringFieldUpdateOperationsInput | string
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FightUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    fighter1Id?: StringFieldUpdateOperationsInput | string
    fighter2Id?: StringFieldUpdateOperationsInput | string
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    weightClass?: NullableStringFieldUpdateOperationsInput | string | null
    rounds?: IntFieldUpdateOperationsInput | number
    isTitleFight?: BoolFieldUpdateOperationsInput | boolean
    oddsFighter1?: NullableIntFieldUpdateOperationsInput | number | null
    oddsFighter2?: NullableIntFieldUpdateOperationsInput | number | null
    aiPrediction?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    method?: NullableStringFieldUpdateOperationsInput | string | null
    endingRound?: NullableIntFieldUpdateOperationsInput | number | null
    endingTime?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}