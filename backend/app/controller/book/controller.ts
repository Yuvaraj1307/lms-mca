import { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { success, error } from "../../shared/response-map";
import DB from "../../shared/knex";

export const getAll = async (_req: Request, res: Response) => {
    try {
        const resp = await DB.select().from('books').orderBy('created_at', 'desc');
        success(res, resp);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const { title, author, genre, quantity_available, quantity_total, status } = req.body;
        const book_uid = uuidv4()
        await DB('books').insert({ book_uid, title, author, genre, quantity_available, quantity_total, status });
        success(res, book_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { title, author, genre, quantity_available, quantity_total, book_uid, status } = req.body;
        await DB('books').update({ book_uid, title, author, genre, quantity_available, quantity_total, status }).where('book_uid', book_uid);
        success(res, book_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
}

export const del = async (req: Request, res: Response) => {
    try {
        const { book_uid } = req.body;
        await DB('books').delete().where('book_uid', book_uid);
        success(res, book_uid);
    } catch (err) {
        error(res, { error: err, message: "Internal Server Error" })
    }
}