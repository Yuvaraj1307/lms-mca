import { Response, Request, response } from "express";
import { success, error } from "../../shared/response-map";
import DB from "../../shared/knex";

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            error(res, { message: 'Username and password must be provided' })
            return;
        };
        let response;
        response = await DB.select(['user_type', 'user_uid', 'username']).from('users').where({ username, password, status: 'active' });
        if (!response.length) {
            const resp = await DB.select(['member_uid', 'username']).from('members').where({ username, password, status: 'active' });
            if (!resp.length) {
                success(res, {})
                return;
            }
            const { member_uid, username: name } = resp[0];
            response = [{ user_type: 'member', user_uid: member_uid, username: name }]
        }
        success(res, response[0] || {})
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
};