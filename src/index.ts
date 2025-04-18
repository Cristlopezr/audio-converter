import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(() => {
    const server = new Server({ port: envs.PORT, routes: AppRoutes.routes });
    server.start();
})();
