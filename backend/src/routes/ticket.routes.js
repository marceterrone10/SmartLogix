import { Router } from 'express';
import { createTicket, getTickets, getTicketById, updateTicket, cancelTicket } from '../controllers/ticket.controller.js';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware.js';
import { ticketSchema } from '../validators/ticket.validator.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.post('/', authMiddleware, checkRole(['cliente']), validateRequest(ticketSchema), createTicket);
router.get('/', authMiddleware, checkRole(['admin', 'tecnico']), getTickets);
router.get('/:id', authMiddleware, checkRole(['admin', 'tecnico', 'cliente']), getTicketById);
router.put('/:id', authMiddleware, checkRole(['admin', 'tecnico']), updateTicket);
router.patch('/:id', authMiddleware, checkRole(['admin', 'tecnico']), cancelTicket);

export default router;