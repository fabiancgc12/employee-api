import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import {HomeController} from './Home/index.js';
import {EmployeeController} from './Employee/index.js';
import {fileURLToPath} from "url";
import {errorMiddleware} from "./common/middlewares/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

const controllers = [new HomeController(),new EmployeeController()];

controllers.forEach(controller => {
  app.use("/", controller.router);
})

app.use(errorMiddleware);

export default app;
