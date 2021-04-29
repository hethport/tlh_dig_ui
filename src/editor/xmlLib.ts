// Helper types

export interface Success<T> {
  status: true;
  value: T;
}

export function success<T>(value: T): Success<T> {
  return {status: true, value};
}

function isSuccess<T>(r: Result<T>): r is Success<T> {
  return r.status;
}

export function myTry<T>(f: () => T): Result<T> {
  try {
    return success(f());
  } catch (e) {
    return failure(e.message);
  }
}

export interface Failure {
  status: false;
  message: string;
}

export function failure(message: string): Failure {
  return {status: false, message};
}

export type Result<T> = Success<T> | Failure;

export function zipResult<S, T>(r1: Result<S>, r2: Result<T>): Result<[S, T]> {
  return isSuccess(r1)
    ? (isSuccess(r2) ? success([r1.value, r2.value]) : r2)
    : r1;
}

export function mapResult<T, S>(r: Result<T>, f: (t: T) => S): Result<S> {
  return isSuccess(r) ? success(f(r.value)) : r;
}

export function flatMapResult<T, S>(r: Result<T>, f: (t: T) => Result<S>): Result<S> {
  return isSuccess(r) ? f(r.value) : r;
}

export function flattenResults<T>(rs: Result<T>[]): Result<T[]> {
  return rs.reduce<Result<T[]>>((acc, current) => {
    if (isSuccess(acc)) {
      if (isSuccess(current)) {
        return success([...acc.value, current.value]);
      } else {
        return current;
      }
    } else {
      // Failure already found...
      return acc;
    }
  }, success([]));
}

// Reader and writer

export interface XmlReader<T> {
  read: (el: Element) => Result<T>;
}

export interface XmlWriter<T> {
  write: (t: T) => string[];
}

export interface XmlFormat<T> extends XmlReader<T>, XmlWriter<T> {
}

export function attributeReader<T>(el: Element, name: string, f: (v: string | null) => T): T {
  return f(el.getAttribute(name));
}

export function failableAttributeReader<T>(el: Element, name: string, f: (v: string | null) => Result<T>): Result<T> {
  return f(el.getAttribute(name));
}

export function childElementReader<T>(el: Element, tagName: string, childElementFormat: XmlFormat<T>): Result<T> {
  return childElementFormat.read(el.getElementsByTagName(tagName)[0]);
}

interface UnionElementConfig<T> {
  name: string;
  reader: XmlReader<T>;
}

export function unionElementReader<T>(options: UnionElementConfig<T>[]): XmlReader<T> {
  return {
    read: (el) => {
      const parsedElements: Success<T>[] = options
        .filter(({name}) => name === el.tagName)
        .map(({reader}) => reader.read(el))
        .filter(isSuccess);

      return parsedElements.length > 0 ? parsedElements[0] : failure(`Illegal tag name ${el.tagName} found!`)
    }
  }
}
