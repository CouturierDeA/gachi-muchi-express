import {
    Controller,
    GetMapping,
    OptionsMapping,
    PathVariable,
    RequestMiddleware,
    Response,
} from "../../framework/controller/controller";

import {ResponseEntity} from "../../framework/entities/ResponseEntity";

@Controller({
    url: '/'
})
export class CommonController {
    @OptionsMapping('/**')
    serveOptions() {
    }

    @RequestMiddleware('/**', '*')
    serveHeaders(
        @Response() res: ResponseEntity,
    ) {
        res.addHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD, POST, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': '*'
        })
    }

    @GetMapping(/(.*)\.(js|css|html|jpeg|jpg|png|svg|webp|gif)$/g)
    async getMime(
        @Response() res: ResponseEntity,
        @PathVariable() path: string
    ) {
        await res.respondWithFile(path)
    }

    @GetMapping('/')
    async getMain(
        @Response() res: ResponseEntity
    ) {
        await res.respondWithFile('/static/index.html')
    }

    // @GetMapping('/static/**')
    // async getStatic(
    //     @Response() res: ResponseEntity,
    //     @PathVariable() filePath: string
    // ) {
    //     await res.respondWithFile(`/${filePath}`)
    // }
}
