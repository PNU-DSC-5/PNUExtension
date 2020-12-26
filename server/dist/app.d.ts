import express from "express";
declare class PNUApi {
    app: express.Express;
    constructor();
    private initializeAppSettings;
    private initializeRouters;
}
export default PNUApi;
