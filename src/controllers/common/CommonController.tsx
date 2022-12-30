import {
    Controller,
    GetMapping,
    OptionsMapping,
    PathVariable,
    QueryParams,
    RequestMiddleware,
    Response,
} from "../../framework/controller/controller";

import {ResponseEntity} from "../../framework/entities/ResponseEntity";
import { HtmlPage } from '../../templates/default';
import GSX from '../../framework/gsx';

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

    @GetMapping('/test-multiple-query-params')
    async todoPageView(
        @QueryParams({ serializer: Number }) test: number[],
    ) {
        return <HtmlPage title={'Test multiple query params'}><>
            <a href="/test-multiple-query-params?test=1,2,3,4,5&id=6,7,8,9">test multiple query params</a>
            <div>
                test: {test?.join(', ')}
            </div>
        </></HtmlPage>
    }

    // @GetMapping('/static/**')
    // async getStatic(
    //     @Response() res: ResponseEntity,
    //     @PathVariable() filePath: string
    // ) {
    //     await res.respondWithFile(`/${filePath}`)
    // }
}
