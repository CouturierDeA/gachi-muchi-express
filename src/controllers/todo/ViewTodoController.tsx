import {TodoService} from "../../components/TodoService";
import { Controller, GetMapping, PathVariable } from "../../framework/controller/controller";
import {Autowire} from "../../framework/component/";
import GACHI_SX from '../../framework/gachi-sx';
import { HtmlPage } from '../../templates/default';
import { TodoItem, TodoList } from '../../templates/todo-list';

@Controller({
    url: '/todo'
})
export class ViewTodoController {

    @Autowire()
    todoService: TodoService

    @GetMapping('')
    async todoListPageView() {
        const todoList = await this.todoService.getTodoList() || [];
        return <HtmlPage title={'Todo Page'}>
            <TodoList
                todoList={todoList}
                // todoSlot={(props) => (<TodoItem {...props}/>)}
            />
        </HtmlPage>
    }

    @GetMapping('{todoId}')
    async todoPageView(
        @PathVariable() todoId: number
    ) {
        const todo = await this.todoService.getTodo(todoId);
        return <HtmlPage title={todo?.title || `Not found ${todoId}`}><>
            { todo && <TodoItem todo={todo}/>}
            { !todo && <div>item with id {todoId} not found</div>}
            <div>
                <a href={`/todo/`}>Go back</a>
            </div>
        </></HtmlPage>
    }
}
