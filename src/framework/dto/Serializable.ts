export class Serializable<Stream, T> {
    constructor(stream: Stream) {
    }

    serialize() {
        throw 'Unsupported yet'
    }

    deserialize(serialized: Stream): T {
        throw 'Unsupported yet'
    }
}

export interface SerializableConstructor<S, T = any> {
    new (stream: S): Serializable<S, T>;
}

export class JSONSerializable<T> extends Serializable<string, T>{
    constructor(stream: string) {
        super(stream);
        Object.assign(this, this.deserialize(stream))
    }

    deserialize(serialized: string): T {
        return JSON.parse(serialized);
    }

    serialize() {
        return JSON.stringify(this)
    }
}
