import { Request, ResponseToolkit } from "@hapi/hapi";
import boom from "@hapi/boom";
import { Users, auth_cookie_name } from '../auth';
import * as db from "../services/db";
import { User } from '../models/user';

function find_user(name: string, password: string, branch: string) {
    const userIter = Users.values();
    let user = userIter.next().value as User | undefined;
    while (user) {
        if (user.name === name && user.password === password && user.branch === branch)
            break;
    }
    return user;
}

export async function LogInHandler(request: Request, h: ResponseToolkit) {

    const body = request.payload as any;

    if (find_user(body.UserName, body.Password, body.Branch) !== undefined) {
        return boom.unauthorized();
    }

    let connection;

    try {
        connection = await db.GetConnection(body.UserName, body.Password, body.Branch);

        let seconds = Math.floor(Date.now() / 1000);

        const user: User = {
            name: body.UserName,
            password: body.Password,
            branch: body.Branch,
            address: request.info.remoteAddress,
            deadline: seconds + (10 * 60) // 10 m
        };

        const id = Users.size + 1;

        Users.set(id, user);

        request.cookieAuth.set({
            id: id
        });

        return h.response();

    } catch (err) {
        return boom.unauthorized(String(err))
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

export async function LogOutHandler(request: Request, h: ResponseToolkit) {

    const body = request.payload.valueOf() as any;

    const user = find_user(body.UserName, body.Password, body.Branch);

    if (user) {
        const session = request.state[auth_cookie_name];
        Users.delete(session.id);
    }
}