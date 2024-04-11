import { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { success, error } from "../../shared/response-map";
import DB from "../../shared/knex";

export const getAll = async (req: Request, res: Response) => {
    try {
        const { member_uid = '' } = req.query;
        const resp = await DB.select().from('transactions').modify((query) => {
            if (member_uid) {
                query.where('member_uid', member_uid)
            }
        }).orderBy('created_at', 'desc');
        success(res, resp);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const { book_uid, member_uid, user_uid, transaction_type, transaction_date, due_date, return_date, status, created_by } = req.body;
        const transaction_uid = uuidv4();
        if (!return_date) {
            const book = await DB('books').select('*').where('book_uid', book_uid);
            const { quantity_available } = book[0];
            await DB('books').update({ quantity_available: quantity_available - 1 }).where('book_uid', book_uid)
        }
        await DB('transactions').insert({ transaction_uid, book_uid, member_uid, user_uid, transaction_type, transaction_date, due_date, return_date, status, created_by });
        success(res, transaction_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { book_uid, member_uid, user_uid, transaction_type, transaction_date, due_date, return_date, transaction_uid, status, updated_by } = req.body;
        if (return_date) {
            const book = await DB('books').select('*').where('book_uid', book_uid);
            const { quantity_available } = book[0];
            await DB('books').update({ quantity_available: quantity_available + 1 }).where('book_uid', book_uid)
        }
        await DB('transactions').update({ transaction_uid, book_uid, member_uid, user_uid, transaction_type, transaction_date, due_date, return_date, status, updated_by }).where('transaction_uid', transaction_uid);
        success(res, transaction_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
}

export const del = async (req: Request, res: Response) => {
    try {
        const { transaction_uid } = req.body;
        await DB('transactions').delete().where('transaction_uid', transaction_uid);
        success(res, transaction_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
}