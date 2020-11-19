export interface JsonInterface {
    type: string;
}

export interface JsonFormat<T extends JsonInterface, U> {
    toJson(u: U): T;

    fromJson(t: T): U;
}
