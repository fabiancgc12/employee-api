import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import {HomeController} from './Home/index.js';
import {EmployeeController} from './Employee/index.js';
import {errorMiddleware} from "./common/middlewares/errorMiddleware.js";
import {fileURLToPath} from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(__filename);
// const dirname = path.dirname("/public/")
const publicFilePath = path.join(dirname, 'public')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: publicFilePath,
  dest: publicFilePath,
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(publicFilePath));

const controllers = [new HomeController(),new EmployeeController()];

controllers.forEach(controller => {
  app.use("/", controller.router);
})

app.use(errorMiddleware);

export default app;
