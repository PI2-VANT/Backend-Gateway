import express from "express";
import dotenv from "dotenv";
import helmet from 'helmet';
import httpProxy from 'express-http-proxy';
import morgan from 'morgan';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

function selectProxyHost(req) {
  if (req.path.startsWith('/vant'))
    return 'http://backend_vant:8081';
  else if (req.path.startsWith('/users'))
    return 'http://backend_user:8083';
  else if (req.path.startsWith('/monitoring'))
    return 'http://backend_monitoring:8082:8083';
}

app.use((req, res, next) => httpProxy(selectProxyHost(req))(req, res, next));

app.use((req, res, next) => {
  // authentication logic here

  next();
});

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, function () {
  console.log(`App listening on port ${port}.`);
});
