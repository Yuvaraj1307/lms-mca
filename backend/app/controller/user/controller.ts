import { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { success, error } from "../../shared/response-map";
import DB from "../../shared/knex";

export const getAll = async (req: Request, res: Response) => {
    try {
        const { librarian = false, admin = false, member = false } = req.query;
        const resp = await DB.select().from('users').modify((query) => {
            if (librarian) {
                query.where('user_type', 'librarian')
            } else if (admin) {
                query.where('user_type', 'admin')
            } else if (member) {
                query.where('user_type', 'member')
            }
        }).orderBy('created_at', 'desc');
        success(res, resp);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const { username, password, user_type, contact_information, status, created_by } = req.body;
        const user_uid = uuidv4()
        await DB('users').insert({ user_uid, username, password, user_type, contact_information, status, created_by });
        success(res, user_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { username, password, user_type, contact_information, user_uid, status, updated_by } = req.body;
        await DB('users').update({ user_uid, username, password, user_type, contact_information, status, updated_by }).where('user_uid', user_uid);
        success(res, user_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
}

export const del = async (req: Request, res: Response) => {
    try {
        const { user_uid } = req.body;
        await DB('users').delete().where('user_uid', user_uid);
        success(res, user_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
}