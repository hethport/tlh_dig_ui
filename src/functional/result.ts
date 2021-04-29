interface Success<T> {
  status: true;
  value: T;
}

export function success<T>(value: T): Success<T> {
  return {status: true, value};
}

function isSuccess<T, E = string>(r: Result<T, E>): r is Success<T> {
  return r.status;
}

export function myTry<T, E = string>(f: () => T, ef: (msg: string) => E): Result<T, E> {
  try {
    return success(f());
  } catch (e) {
    return failure(ef(e.message));
  }
}

interface Failure<E = string> {
  status: false;
  message: E;
}

export function failure<E = string>(message: E): Failure<E> {
  return {status: false, message};
}

export type Result<T, E = string> = Success<T> | Failure<E>;

// Helper functions

export function zipResult<S, T, E = string>(r1: Result<S, E>, r2: Result<T, E>): Result<[S, T], E[]> {
  return transformResult(r1,
    (s) => isSuccess(r2) ? success([s, r2.value]) : failure([r2.message]),
    (e) => isSuccess(r2) ? failure([e]) : failure([e, r2.message])
  );
}

export function transformResultTo<T, E, R>(r: Result<T, E>, sf: (t: T) => R, ef: (e: E) => R): R {
  return isSuccess(r) ? sf(r.value) : ef(r.message);
}

function transformResult<T, S, E, F>(r: Result<T, E>, sf: (t: T) => Result<S, F>, ef: (e: E) => Result<S, F>): Result<S, F> {
  return isSuccess(r) ? sf(r.value) : ef(r.message);
}

export function transformResultContent<T, S, E, F>(r: Result<T, E>, sf: (t: T) => S, ef: (e: E) => F): Result<S, F> {
  return isSuccess(r) ? success(sf(r.value)) : failure(ef(r.message));
}

export function mapResult<T, S, E = string>(r: Result<T, E>, f: (t: T) => S): Result<S, E> {
  return isSuccess(r) ? success(f(r.value)) : r;
}

export function mapFailure<T, E, F>(r: Result<T, E>, f: (e: E) => F): Result<T, F> {
  return isSuccess(r) ? r : failure(f(r.message));
}

export function flatMapResult<T, S, E = string>(r: Result<T, E>, f: (t: T) => Result<S, E>): Result<S, E> {
  return isSuccess(r) ? f(r.value) : r;
}

export function flattenResults<T, E = string>(rs: Result<T, E>[]): Result<T[], E[]> {
  const [successes, errors] = rs.reduce<[T[], E[]]>(
    ([ss, es], r) => isSuccess(r) ? [[...ss, r.value], es] : [ss, [...es, r.message]],
    [[], []]
  );

  return errors.length === 0 ? success(successes) : failure(errors);
}
