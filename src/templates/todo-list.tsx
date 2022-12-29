import GACHI_SX from '../framework/gachi-sx';
import { ITodo } from '../structs/todo/todo';

export function TodoItem({ todo }: { todo: ITodo}, content?: typeof GACHI_SX) {
    return <>
        <h3>{ content || <a href={`/todo/${todo.id}`}>{todo.title}</a>}</h3>
        <p>description {todo.description}</p>
    </>
}

export function TodoList({ todoList, todoSlot }: { todoList: ITodo[], todoSlot?: typeof TodoItem }) {
    return <ul>{todoList.map(todo =>
        <li
            class={'test-123'}
            data-id={todo.id}
        >
            {todoSlot ? todoSlot({ todo }) : <TodoItem todo={todo}/>}
        </li>
    )}</ul>
}
