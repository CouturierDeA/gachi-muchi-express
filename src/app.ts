import { createSecureServer, SecureServerOptions } from "http2";
import { getCredentials } from "./cert.read";
import { init } from './app.init'

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';

const run = async (port = 4000) => {
    const secureServerOptions: SecureServerOptions = {
        ...getCredentials(),
        allowHTTP1: true,
    }
    const app = await init();

    const server = createSecureServer(
        secureServerOptions,
        // (req, res) => app.onRequest(req, res)
    )
    server.on('stream', (stream, headers) => {
        app.onStream(stream, headers)
    })
    server.listen(port, () => {
        require('dns').lookup(require('os').hostname(), function (err, add, fam) {
            console.log(`Networking server address https://${add}:${port}`);
        })
        console.log(`Server started on https://localhost:${port}`);
    })

    return {
        app, server,
    }
}

run();


function onExit(log: string) {
    return function exit() {
        console.log(log);
        process.exit(0);
    }
}
process.on('SIGTERM', onExit('SIGTERM'));
process.on('SIGINT', onExit('SIGINT'));
process.on('SIGTERM', onExit('SIGTERM'));
process.on('SIGUSR2', onExit('SIGUSR2'));
process.on('exit', onExit('exit'));
