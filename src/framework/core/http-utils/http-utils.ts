import {extname, join} from "path";

import {
    Http2ServerRequest,
    Http2ServerResponse,
    IncomingHttpHeaders,
    ServerHttp2Stream,
} from "http2";
import {ApiException} from "../../exceptions/exceptions";
import {OutgoingHttpHeaders} from "http";
import {RequestEntity} from "../../entities/RequestEntity";
import {ResponseEntity} from "../../entities/ResponseEntity";
import {promises} from "fs";

export interface RouteController {
    (sandbox: Sandbox, stream?: ServerHttp2Stream): Promise<any> | any
}

export interface Sandbox<T = ServerHttp2Stream> {
    route: string | RegExp
    params: any
    query: any
    getBodySafe?: () => Promise<any>
    respondWithFile?: (reqPath: string) => void
    mixHeaders: (headers: OutgoingHttpHeaders) => OutgoingHttpHeaders
    stream: T,
    commonHeaders: OutgoingHttpHeaders
    request: RequestEntity<T>
    response: ResponseEntity<T>
    incomingHeaders: IncomingHttpHeaders
    method: string
}


export const serializer = {
    'number': (num: number) => num.toString(),
    'string': (str: string) => str,
    'boolean': (bool: boolean) => JSON.stringify(bool),
    'object': (data: object) => JSON.stringify(data),
    'undefined': (data: undefined) => data,
}
export const serialize = (data: any) => {
    const dataType = typeof data;
    const exec = serializer[dataType] || serializer.undefined
    return exec(data)
}

export const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.css': 'text/css',
}

export const mixHeaders = (headers, addHeaders?) => {
    return {
        ...headers,
        ...(addHeaders || {})
    }
}

export const sanitizePath = (rawPath: string | undefined, to: string) => {
    return !rawPath?.startsWith(to) ? undefined : rawPath;
}

export const readStatic = async (path: string) => {
    const sanitizedPath = sanitizePath(path, '/static');
    const mime = extname(sanitizedPath);
    const contentType = mimeTypes[mime];
    const staticFolder = sanitizedPath ? join('dist', sanitizedPath) : undefined
    return {
        contentType,
        sanitizedPath: staticFolder
    }
}

export const getMimeType = (path: string) => {
    const mime = extname(path);
    return mimeTypes[mime]
}

export function handleApiError(
    stream: ServerHttp2Stream,
    req: Http2ServerRequest | undefined,
    res: Http2ServerResponse | undefined,
    reqMethod: string,
    exception: ApiException | NodeJS.ErrnoException,
    path,
    addHeaders?
) {
    const method = Array.isArray(reqMethod) ? reqMethod[0] : reqMethod
    const {message} = exception;
    const isApiCall = path.startsWith('/api')
    let status = (exception as ApiException).status || 500

    if (method === 'GET' && !isApiCall) {
        !stream.headersSent && stream.respond(
            mixHeaders({
                'content-type': 'text/html; charset=utf-8',
                ":status": status
            }, addHeaders)
        );
        stream.end(`<h1>
            <p>${status}</p>
            <p>${message ? message : 'Not Found'}</p>
        </h1>`);
    } else {
        const headers = mixHeaders({
            ":status": status,
        }, addHeaders)
        stream.respond(headers);
        stream.end(serialize({
            message
        }));
    }
}

export function parseBody(stream: ServerHttp2Stream) {
    return new Promise((resolve, reject) => {
        let chunks = [];
        stream.on('data', function (chunk) {
            chunks.push(chunk);
        });
        stream.on('end', function () {
            const body = chunks.toString();
            resolve(body);
        });
        stream.on('error', function (err) {
            reject(err)
        });
    })
}

export async function respondWithFile(
    stream: ServerHttp2Stream,
    req: Http2ServerRequest | undefined,
    res: Http2ServerResponse | undefined,
    reqPath: string,
): Promise<number> {
    reqPath = reqPath.startsWith('/static') ? reqPath : `/static${reqPath}`
    const {contentType, sanitizedPath} = await readStatic(reqPath);
    const notFound = `cant find file ${reqPath}`;
    if (!sanitizedPath) {
        throw ApiException.notFound(notFound)
    }
    return new Promise((resolve, reject) => {
        if (!stream) {
            promises.readFile( sanitizedPath )
                .then(res.end)
                .catch(reject)
            return;
        }

        stream.respondWithFile(sanitizedPath, {
            'content-type': contentType
        }, {
            onError: (err) => {
                return reject(new Error(notFound))
            }
        });
        stream.on('finish', () => {
            resolve(1)
        })
    })
}
