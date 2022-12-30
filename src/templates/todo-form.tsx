import GSX from '../framework/gsx';
import { ITodo } from '../structs/todo/todo';

export function TodoForm({ todo }: { todo: ITodo}) {
    return <form method={'POST'} action={`/todo/edit/${todo.id}`}>
        <fieldset>
            <input type="text" name={'title'} value={todo.title}/>
        </fieldset>
        <fieldset>
            <input type="text" name={'description'} value={todo.description}/>
        </fieldset>
        <fieldset>
            <button type={'submit'}>Submit</button>
        </fieldset>
    </form>
}
