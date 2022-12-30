import {ApiException} from "../framework/exceptions/exceptions";
import {Autowire, Component} from "../framework/component/";
import {TodoMapper} from "./TodoMapper";
import {CommonValidator, validations} from "../framework/core/validators/validator";
import {ITodo, ITodoPayload} from "../structs/todo/todo";

@Component()
export class TodoValidationService {
    @Autowire()
    todoMapper: TodoMapper

    constructor() {
        this.validator = this.createValidator();
    }

    validator: CommonValidator<Partial<ITodo>>

    createValidator() {
        const {createRuleList} = this;
        return new CommonValidator<Partial<ITodo>>(
            {
                title: createRuleList('title', 3, 50),
                description: createRuleList('description', 3, 50)
            })
    }

    async checkTodoExist (id: ITodo['id']) {
        const hasTodo = await this.todoMapper.todoExist(id);
        if (!hasTodo) {
            throw ApiException.userError(`Cant Find todo with id ${id}`)
        }
    }

    async validateTodo(todo: ITodo) {
        await this.checkTodoExist(todo?.id);
        await this.validateTodoBody(todo)
    }

    async uniqueTitle(title: string) {
        const exist = await this.todoMapper.findTodoWithTitle(title)
        if (!!exist) {
            throw ApiException.userError(`Todo title is not unique ${title}`)
        }
    }

    async validateTodoBody(todo: ITodoPayload) {
        const err = this.validator.validateAll(todo);
        if (err.length) {
            throw ApiException.userError(err.join(','))
        }
    }

    createRuleList(fieldName: string, minV: number, maxV: number) {
        const {required, min, max} = validations;
        return [
            {
                validator: required, message: `${fieldName} required`
            },
            {
                validator: min(minV), message: `${fieldName} min length is ${minV}`
            },
            {
                validator: max(maxV), message: `${fieldName} max length is ${maxV}`
            },
        ]
    }
}
