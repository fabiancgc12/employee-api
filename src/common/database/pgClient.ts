import pg from "pg"
import {configVariables} from "../config/configVariables.js";
export const pgClient = new pg.Client({
    user: configVariables.USER,
    host: configVariables.HOST,
    database: configVariables.DATABASE,
    password: configVariables.PASSWORD,
    port: Number(configVariables.DATABASE_PORT),
})
