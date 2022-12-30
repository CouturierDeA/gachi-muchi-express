import { TodoService } from "../../components/TodoService";
import {
    Controller,
    GetMapping,
    PathVariable,
    PostMapping,
    Request,
    RequestBody,
} from "../../framework/controller/controller";
import { Autowire } from "../../framework/component/";
import GSX from '../../framework/gsx';
import { HtmlPage } from '../../templates/default';
import { TodoItem, TodoList } from '../../templates/todo-list';
import { TodoForm } from '../../templates/todo-form';
import { TodoDto } from '../../dto/TodoDto';
import { RequestEntity } from '../../framework/entities/RequestEntity';

@Controller({
    url: '/todo',
})
export class ViewTodoController {

    @Autowire()
    todoService: TodoService

    @GetMapping('')
    async todoListPageView() {
        const todoList = await this.todoService.getTodoList() || [];
        return <HtmlPage title={'Todo Page'}>
            <TodoList todoList={todoList}/>
        </HtmlPage>
    }

    @GetMapping('{todoId}')
    async getTodoPage(
        @PathVariable() todoId: number,
    ) {
        const todo = await this.todoService.getTodo(todoId);
        return <HtmlPage title={todo?.title || `Not found ${todoId}`}><>
            {todo && <TodoItem todo={todo}>{todo.title}</TodoItem>}
            {!todo && <div>item with id {todoId} not found</div>}
            <div>
                <a href={`/todo`}>Go back</a>
            </div>
        </>
        </HtmlPage>
    }

    @GetMapping('/edit/{todoId}')
    async getEditTodoPage(
        @PathVariable() todoId: number,
    ) {
        return this.getEditTodoForm(todoId);
    }

    @PostMapping('/edit/{todoId}')
    async postEditTodoPage(
        @PathVariable() todoId: number,
        @RequestBody() todo: TodoDto,
        @Request() req: RequestEntity,
    ) {
        try {
            await this.todoService.editTodo({
                id: todoId,
                ...todo,
            });
            return this.getEditTodoForm(todoId, 'Successfully updated')
        } catch (e: unknown) {
            return this.getEditTodoForm(todoId, this.getErrorMessage(e))
        }
    }

    protected getErrorMessage(e: unknown) {
        return (e as Error)?.message || 'Unknown error';
    }

    protected async getEditTodoForm(todoId: number, message?: string) {
        const todo = await this.todoService.getTodo(todoId);
        return <HtmlPage title={todo?.title || `Not found ${todoId}`}><>
            {todo && <TodoForm todo={todo}/>}
            {!todo && <div>item with id {todoId} not found</div>}
            <div>
                {message && <div>{message}</div>}
                <a href={`/todo`}>Go back</a>
            </div>
        </>
        </HtmlPage>
    }
}
