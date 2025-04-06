import { Router } from 'express';
import { FileRoutes } from './file/routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use('/api/file', FileRoutes.routes);

        return router;
    }
}
