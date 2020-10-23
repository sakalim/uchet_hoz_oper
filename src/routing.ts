import hapi from "@hapi/hapi";
import { LogInHandler, LogOutHandler } from "./controllers/login";

export async function Configure(server: hapi.Server) {
    server.route({
        method: "POST",
        path: "/login",
        handler: LogInHandler,
        options: {
            auth: false,
            payload: {
                parse: true,
                // allow: "application/x-www-form-urlencoded",
                output: "data"
            }
        }
    });

    // server.route({
    //     method: "POST",
    //     path: "/logout",
    //     handler: LogOutHandler,
    //     options: {
    //         auth: {
    //             mode: "required"
    //         }
    //     }
    // });
}