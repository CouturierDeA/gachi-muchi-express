import { Autowire, Component } from "../framework/component/";
import {ITodo, ITodoPayload} from '../structs/todo/todo';
import {TodoValidationService} from './TodoValidationService';
import {TodoMapper} from "./TodoMapper";
// import { sleep } from '../framework/core/timeout';

@Component()
export class TodoService {
    // @Created()
    // async created() {
    //     await sleep(5_000, (time: number) => {
    //         console.log(`Ожидаем асинхронную инициализацию TodoService... ${time / 1000} s`)
    //         return 1000;
    //     })
    // }

    @Autowire()
    validator: TodoValidationService

    @Autowire()
    todoMapper: TodoMapper

    watch(cb: () => void) {
        this.todoMapper.watch(cb)
    }

    unwatch(cb: () => void) {
        this.todoMapper.unwatch(cb)
    }

    async getTodoList(...args: string[]): Promise<ITodo[]> {
        return await this.todoMapper.getTodoList(...args);
    }

    async getTodo(id: number): Promise<ITodo> {
        return await this.todoMapper.getTodo(id)
    }

    async addTodo(todo: ITodoPayload): Promise<ITodo> {
        const {todoMapper, validator} = this;
        await validator.uniqueTitle(todo.title);
        await validator.validateTodoBody(todo);
        return await todoMapper.addTodo(todo)
    }

    async editTodo(todo: ITodo): Promise<ITodo> {
        const {todoMapper, validator} = this;
        await validator.validateTodo(todo);
        return await todoMapper.editTodo(todo)
    }

    async deleteTodo(id: number): Promise<number> {
        const {todoMapper, validator} = this;
        await validator.checkTodoExist(id);
        await todoMapper.deleteTodo(id);
        return id
    }
}
