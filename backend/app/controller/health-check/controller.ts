import { Response, Request } from "express";
import { success } from "../../shared/response-map";

export const HealthCheck = (req: Request, res: Response) => {
    success(res, "Server running successfully");
};