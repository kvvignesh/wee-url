import { Router } from 'express';

import * as UrlController from './controllers/url';

export const router = Router();

// Auth routes
router.get('/:shortUrl', UrlController.redirect);
router.post('/create', UrlController.create);
