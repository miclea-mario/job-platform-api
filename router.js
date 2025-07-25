import * as routes from '@routes';
import { Router } from 'express';
import middleware from 'express-goodies/middleware';

const router = Router();
export default router;

// Use express context
router.use(middleware.httpContext);

// Apply speed limiter only for public routes
router.use('/public', middleware.speedLimiter);
router.use('/public/*', middleware.speedLimiter);

// Protect all non-public routes
router.all('/admin', middleware.authenticate);
router.all('/admin/*', middleware.authenticate);

// Useful middleware for testing
router.use(middleware.testError);
router.use(middleware.testLoading);

// use the router instances defined
router.use(routes.clientError);
router.use(routes.identity);
router.use(routes.admin);
router.use(routes.company);
router.use(routes.user);
router.use(routes.jobs);
router.use(routes.webhook);

// Matches any other HTTP method and route not matched before
router.all('*', middleware.notFound);

// Finally, an error handler
router.use(middleware.errorHandler);
