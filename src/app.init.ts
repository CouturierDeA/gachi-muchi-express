import {App} from "./framework/app";

import {CommonController} from "./controllers/common/CommonController";
import {RestTodoController} from "./controllers/todo/RestTodoController";
import {ViewTodoController} from "./controllers/todo/ViewTodoController";

import {TodoMapper} from "./components/TodoMapper";
import {TodoService} from "./components/TodoService";
import {ServerEvents} from "./components/ServerEvents";
import {TodoValidationService} from "./components/TodoValidationService";

export const init = async () => {
    const app = new App()
        .useComponents([
            TodoMapper,
            TodoValidationService,
            TodoService,
            ServerEvents
        ])
        .useControllers([
            RestTodoController,
            ViewTodoController,
            CommonController
        ])
    return await app.init()
}
