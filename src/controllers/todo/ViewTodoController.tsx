import {TodoService} from "../../components/TodoService";
import {Controller, GetMapping} from "../../framework/controller/controller";
import {Autowire} from "../../framework/component/";
import GACHI_SX from '../../framework/gachi-sx';
import { defaultTemplate } from '../../templates/default';

@Controller({
    url: '/todo'
})
export class ViewTodoController {

    @Autowire()
    todoService: TodoService

    @GetMapping('')
    async todoPageView() {
        const todoList = await this.todoService.getTodoList() || [];
        return defaultTemplate(
            <ul>
                {todoList.map(todo => <>
                    <li>
                        <div class={'test-123'}>
                            <h3>Test id {todo.id}</h3>
                            <h4>title {todo.title}</h4>
                            <p>description {todo.description}</p>
                        </div>
                    </li>
                </>)}
            </ul>
        )
    }
}
