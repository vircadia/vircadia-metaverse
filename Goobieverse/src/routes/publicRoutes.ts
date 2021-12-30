import express from 'express';
import { PublicRoutesController } from '../controllers/PublicRoutesController';

const publicRoutes = express.Router();

publicRoutes.get('/metaverse_info',PublicRoutesController().metaverseInfo);

export { publicRoutes};
 