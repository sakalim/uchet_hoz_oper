import hapi from "@hapi/hapi";
import Inert from "@hapi/inert";

export async function Configure(server: hapi.Server) {

    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                index: ["index.html"]
            }
        },
        options: {
            cache: false,
            auth: false
        }
    });
}