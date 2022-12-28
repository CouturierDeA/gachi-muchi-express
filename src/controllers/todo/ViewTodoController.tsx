import {TodoService} from "../../components/TodoService";
import { Controller, GetMapping } from "../../framework/controller/controller";
import {Autowire} from "../../framework/component/";
import GACHI_SX from '../../framework/gachi-sx';
import { DefaultTemplate } from '../../templates/default';

@Controller({
    url: '/todo'
})
export class ViewTodoController {

    @Autowire()
    todoService: TodoService

    @GetMapping('')
    async todoListPageView() {
        const todoList = await this.todoService.getTodoList() || [];
        return <DefaultTemplate title={'Todo Page'}>
            <ul>{todoList.map(todo =>
                <li
                    class={'test-123'}
                    data-id={todo.id}
                >
                    <h3>ID {todo.id}</h3>
                    <h4>title {todo.title}</h4>
                    <p>description {todo.description}</p>
                </li>
            )}</ul>
        </DefaultTemplate>
    }
}
