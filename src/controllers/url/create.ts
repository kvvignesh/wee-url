import { RequestHandler } from 'express';
import validUrl from 'valid-url';
import { ApplicationError, BadRequest } from '../../errors';
import { relogRequestHandler } from '../../middleware/request-middleware';
import { Url } from '../../models/Url';
import { logger } from '../../logger';

const BaseHash = require('base-hash');

const baseHash = new BaseHash();

const randomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const createWrapper: RequestHandler = async (req, res, next) => {
  const { longUrl } = req.body;
  const baseUrl = process.env.BASE_URL;

  logger.log({
    level: 'info',
    message: `base url ${baseUrl}   ${longUrl}`
  });

  if (!validUrl.isUri(baseUrl)) {
    logger.log({
      level: 'info',
      message: `Invalid Base Url ${baseUrl}`
    });
    return next(new BadRequest('Internal error. Please try again'));
  }

  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });

      if (url) {
        logger.log({
          level: 'info',
          message: `URL exists ${JSON.stringify(url)}`
        });
        const { shortUrl } = url;
        return res.status(200).json({ shortUrl, longUrl });
      }

      let urlCode:string = '';

      let isUniqueUrlCode:boolean = false;
      while (!isUniqueUrlCode) {
        const randNum = randomInteger(1, 99999999);
        urlCode = baseHash.encode(randNum);
        // eslint-disable-next-line no-await-in-loop
        const output = await Url.findOne({ longUrl });
        if (!output) {
          isUniqueUrlCode = true;
        }
      }

      const shortUrl = `${baseUrl}/${urlCode}`;

      url = new Url({
        longUrl,
        shortUrl,
        urlCode,
        clickCount: 0
      });

      logger.log({
        level: 'info',
        message: `URL ${JSON.stringify(url)}`
      });

      await url.save();

      return res.status(201).json({ longUrl, shortUrl });
    } catch (err) {
      logger.log({
        level: 'error',
        message: 'Internal Server error',
        error: err
      });
      return next(new ApplicationError('Something went wrong'));
    }
  } else {
    logger.log({
      level: 'info',
      message: 'Invalid URL. Please enter a vlaid url for shortening'
    });
    return next(new BadRequest('Invalid URL. Please enter a vlaid url for shortening'));
  }
};

export const create = relogRequestHandler(createWrapper);
