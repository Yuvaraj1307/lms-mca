import { Response } from "express";
export const success = (res: Response, data: any, code = 200) => {
    res.statusCode = code;
    res.send({ success: true, data })
}

export const error = (res: Response, data: any, code = 200) => {
    res.statusCode = code;
    res.send({ success: false, data })
}