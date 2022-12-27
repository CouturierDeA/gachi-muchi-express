import {Autowire, Created} from "../../framework/component/";
import {
    Controller,
    GetMapping, PostMapping, DeleteMapping,
    PathVariable, RequestBody, QueryParam, PutMapping, PatchMapping,
    Response,
} from "../../framework/controller/controller";

import {TodoService} from "../../components/TodoService";
import {ServerEvents} from "../../components/ServerEvents";
import {TodoDto} from "../../dto/TodoDto";
import {ResponseEntity} from "../../framework/entities/ResponseEntity";
// import { sleep } from '../../framework/core/timeout';

@Controller({
    url: '/api'
})
export class RestTodoController {
    @Created()
    async watchDataSource() {
        // await sleep(5_000, (time: number) => {
        //     console.log(`Ожидаем асинхронную инициализацию RestTodoController... ${time / 1000} s`)
        //     return 1000;
        // })
        this.todoService.watch(this.todoUpdateEvent)
    }

    @Autowire()
    se: ServerEvents

    @Autowire()
    todoService: TodoService

    @GetMapping('/todo')
    async apiGetTodoList(
        @QueryParam() title: string
    ) {
        return await this.todoService.getTodoList(title) || []
    }

    @GetMapping('/get-todo/{todoId}')
    async apiGetTodo(
        @PathVariable() todoId: number,
    ) {
        return await this.todoService.getTodo(todoId)
    }

    @PutMapping('/todo')
    @PostMapping('/todo')
    async apiAddTodo(
        @RequestBody() todo: TodoDto,
    ) {
        return await this.todoService.addTodo(todo)
    }

    @PatchMapping('/todo/{todoId}')
    async apiPatchTodo(
        @PathVariable() todoId: number,
        @RequestBody() todo: TodoDto,
    ) {
        return await this.todoService.editTodo(todoId, todo)
    }

    @DeleteMapping('/todo/{todoId}')
    async apiDeleteTodo(
        @PathVariable() todoId: number
    ) {
        await this.todoService.deleteTodo(todoId);
    }

    @GetMapping('/subscribe-todo-list')
    async apiSubscribeTodoList(
        @Response() response: ResponseEntity
    ) {
        return await this.se.init(response);
    }

    async todoUpdateEvent() {
        return this.se.emitData('todo-list-updated');
    }
}
