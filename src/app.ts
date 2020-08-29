import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import { ApplicationError } from './errors/application-error';
import { router } from './routes';

export const app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use(express.json({}));
app.use('/', router);

app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err : undefined,
    message: err.message
  });
});
