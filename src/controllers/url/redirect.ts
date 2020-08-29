import { RequestHandler } from 'express';
import { ApplicationError, BadRequest } from '../../errors';
import { relogRequestHandler } from '../../middleware/request-middleware';
import { Url } from '../../models/Url';
import { logger } from '../../logger';

const redirectWragger: RequestHandler = async (req, res, next) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOne({ urlCode: shortUrl });
    if (url) {
      let { clickCount } = url;
      clickCount += 1;
      await url.updateOne({ clickCount });
      return res.redirect(url.longUrl);
    }
    logger.log({
      level: 'info',
      message: 'The short url doesn\'t exists in our system'
    });
    return next(new BadRequest('The short url doesn\'t exists in our system'));
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Something went wrong with DB Connection',
      error: err
    });
    return next(new ApplicationError('Something went wrong with DB Connection'));
  }
};

export const redirect = relogRequestHandler(redirectWragger);
