import {ITodo, ITodoPayload} from "../structs/todo/todo";
import {read, write, watch, unwatch} from "../json-db/source";
import {Component} from "../framework/component/";
import {ApiException} from "../framework/exceptions/exceptions";

@Component()
export class TodoMapper {
    src: string = 'todo-list.json'

    async getTodoList(title?: string) {
        const res: ITodo[] = await this.readTodoList()
        return res.filter(todo => {
            if (!title) return true;
            return todo.title?.trim().toLowerCase() === title?.trim().toLowerCase()
        });
    }

    async readTodoList() {
        try {
            const res = await read(this.src)
            return JSON.parse(res)
        } catch (e) {
            console.error('Error reading todoList ', e);
            throw e;
        }
    }

    async writeTodoList(newTodoList: ITodo[]) {
        try {
            await write(this.src, JSON.stringify(newTodoList));
        } catch (e) {
            console.error('Wright newTodoList Error ', e);
            throw e;
        }
    }

    async getTodo(id: number, todoList1?: ITodo[]) {
        const todoList = todoList1 || await this.getTodoList()
        return todoList?.find(todo => todo.id === id)
    }

    async addTodo(todo: ITodoPayload) {
        const todoList = await this.getTodoList()
        const newTodo: ITodo = {
            ...todo,
            id: this.generateId(todoList),
        }
        const newTodoList = [...todoList, newTodo]
        await this.writeTodoList(newTodoList);
        return newTodo
    }

    async editTodo(todo: ITodo) {
        const todoList = await this.getTodoList();
        const newTodoList = [...todoList]
        const index = newTodoList.findIndex(todoI => todoI.id === todo.id)
        newTodoList.splice(index, 1, todo)
        await this.writeTodoList(newTodoList);
        return todo
    }

    async deleteTodo(id: number) {
        const todoList = await this.getTodoList();
        const newTodoList = [...todoList.filter(todo => todo.id !== id)];
        await this.writeTodoList(newTodoList);
        return todoList.length - newTodoList.length;
    }

    async todoExist(id: number) {
        const todo = await this.getTodo(id);
        return !!todo
    }

    async findTodoWithTitle(title?: string, entityId?: number) {
        const todoList = await this.getTodoList();
        return todoList.find(todo => todo.id !== entityId && todo.title === title)
    }

    private generateId(todoList: ITodo[]) {
        let id = todoList.length;
        let guard = 0;
        do {
            id += 1;
            guard += 1;
            if (guard > 1000) {
                throw ApiException.internal('Todo list Id generates to long');
            }
        } while (todoList.some(tI => tI.id === id));
        return id;
    }

    watch(callback: () => void) {
        watch(this.src, callback);
    }

    unwatch(callback: () => void) {
        unwatch(this.src, callback);
    }
}
