import { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { success, error } from "../../shared/response-map";
import DB from "../../shared/knex";

export const getAll = async (_req: Request, res: Response) => {
    try {
        const resp = await DB.select().from('members').orderBy('created_at', 'desc');
        success(res, resp);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const { username, password, member_type, contact_information, status, created_by } = req.body;
        const member_uid = uuidv4()
        await DB('members').insert({ member_uid, username, password, member_type, contact_information, status, created_by });
        success(res, member_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { username, password, member_type, contact_information, member_uid, status, updated_by } = req.body;
        await DB('members').update({ member_uid, username, password, member_type, contact_information, status, updated_by }).where('member_uid', member_uid);
        success(res, member_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
}

export const del = async (req: Request, res: Response) => {
    try {
        const { member_uid } = req.body;
        await DB('members').delete().where('member_uid', member_uid);
        success(res, member_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
}