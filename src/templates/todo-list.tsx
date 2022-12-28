import GACHI_SX from '../framework/gachi-sx';
import { ITodo } from '../structs/todo/todo';

export function TodoList({ todoList }: { todoList: ITodo[] }) {
    return <ul>{todoList.map(todo =>
        <li
            class={'test-123'}
            data-id={todo.id}
        >
            <h3>ID {todo.id}</h3>
            <h4>title {todo.title}</h4>
            <p>description {todo.description}</p>
        </li>
    )}</ul>
}
