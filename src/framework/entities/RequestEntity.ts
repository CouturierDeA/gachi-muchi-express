import {parseBody, Sandbox} from "../core/http-utils/http-utils";
import {ApiException} from "../exceptions/exceptions";
import {
    ServerHttp2Stream,
    IncomingHttpHeaders,
    Http2ServerRequest,
    Http2ServerResponse
} from "http2";
import {methodType} from "../controller/controller";

export class RequestEntity<T = ServerHttp2Stream> {
    constructor(
        private sandBox: Sandbox,
        private req?: Http2ServerRequest,
        private res?: Http2ServerResponse,
        stream?: ServerHttp2Stream,
        incomingHeaders?: IncomingHttpHeaders,
        path?: string,
        method?: methodType,
    ) {
        this.headers = sandBox.incomingHeaders;
        this.stream = req?.stream || stream;
        this.id = this.stream?.id
        const ip = req?.socket.remoteAddress || stream?.session?.socket.remoteAddress;
        const port = req?.socket.remotePort || stream.session.socket.remotePort;
        this.ip = ip
        this.port = port
        this.headers = incomingHeaders
        this.path = path
        this.method = method
    }

    headers: IncomingHttpHeaders
    id: number
    ip: string
    path: string
    method: methodType
    port: number
    stream: ServerHttp2Stream
    private body: any

    getBody = async () => {
        const body = this.body || await parseBody(this.stream);
        this.body = body;
        if (!body) {
            throw ApiException.userError('Request body is absent');
        }
        return body
    }
}
