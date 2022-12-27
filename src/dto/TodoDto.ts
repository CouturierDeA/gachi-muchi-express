import {JSONSerializable} from "../framework/dto/Serializable";
import {ITodo} from "../structs/todo/todo";

export class TodoDto<T = ITodo> extends JSONSerializable<ITodo> implements ITodo {
    constructor(stream: string) {
        super(stream)
    }

    id
    title
    description
}
