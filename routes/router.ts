import { Router, Request, Response } from 'express';

const router = Router();

router.get('/mensajes', (request: Request, response: Response) => {
    response.json({
        ok: true,
        mensaje: 'Todo está bien!!'
    });
});

export default router;