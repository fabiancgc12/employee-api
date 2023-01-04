import dotenv from "dotenv"
dotenv.config()
export const configVariables = {
    SERVER_PORT:process.env.PORT,
    HOST:process.env.HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE: process.env.DATABASE,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
}