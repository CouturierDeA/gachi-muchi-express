import {TodoService} from "../../components/TodoService";
import { Controller, GetMapping } from "../../framework/controller/controller";
import {Autowire} from "../../framework/component/";
import GACHI_SX from '../../framework/gachi-sx';
import { HtmlPage } from '../../templates/default';
import { TodoList } from '../../templates/todo-list';

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
            <TodoList todoList={todoList}/>
        </HtmlPage>
    }
}
