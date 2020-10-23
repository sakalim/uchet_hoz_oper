import hapi from "@hapi/hapi";
import path from 'path';
import * as settings from "./settings.json";
import * as stat from './static';
import * as auth from './auth';
import * as routing from "./routing"

process.env.UV_THREADPOOL_SIZE = "10";

const server = new hapi.Server({
    port: settings.server.port,
    host: "localhost",
    routes: {
        files: {
            relativeTo: path.resolve(__dirname, "../public")
        }
    }
});

async function Configure() {

    // Static file server
    stat.Configure(server);

    // Authentication
    auth.Configure(server);

    routing.Configure(server);
}

export async function RunServer() {
    await Configure();
    await server.start();
    console.log('Server running on %s', server.info.uri);
};


export async function ShutdownServer(e?: any) {
    let err = e;
    try {
        console.log('Closing web server module');
        await server.stop();
    } catch (e) {
        console.log('Encountered error', e, err);
        err = err || e;
    }
    return err;
}