import hapi from "@hapi/hapi";
import cookie from "@hapi/cookie";
import { User } from './models/user';

const users = new Map<number, User>();

export const Users = users;

let last_reviz = 0;

function reviz_users(seconds: number) {
    users.forEach((v, k) => {
        if (v.deadline < seconds)
            users.delete(k);
    });
}

async function Validate(request: hapi.Request, session: any) {

    let seconds = Math.floor(Date.now() / 1000);

    if (last_reviz <= seconds) {
        reviz_users(seconds);
        last_reviz = seconds + (6 * 60 * 60); // 6 h
    }

    const result = { valid: false };

    const user = users.get(session.id);

    if (user) {
        if (user.address === request.info.remoteAddress && user.deadline > seconds) {
            result.valid = true;
            user.deadline = seconds + (10 * 60); // 10 m
        }
        else {
            users.delete(session.id);
        }
    }

    return result;
}


export const auth_cookie_name = "{76823459-B40F-479C-B594-36AC4A9F9B7A}";

export async function Configure(server: hapi.Server) {
    await server.register(cookie);

    server.auth.strategy("session", "cookie", {
        cookie: {
            name: auth_cookie_name,
            password: "{B2361093-C895-43A8-B82F-457758EAAD9A}",
            isSecure: false
        },
        validateFunc: Validate
    });

    server.auth.default("session");
}