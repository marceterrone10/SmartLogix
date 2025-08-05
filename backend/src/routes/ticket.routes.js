import { Router } from 'express';
import { createTicket, getTickets, getTicketById, updateTicket, cancelTicket } from '../controllers/ticket.controller.js';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware.js';
import { ticketSchema } from '../validators/ticket.validator.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Crear un nuevo ticket de soporte
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: No puedo acceder al sistema
 *               description:
 *                 type: string
 *                 example: El sistema muestra error 500 al iniciar sesión
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: low
 *                 example: medium
 *               status:
 *                 type: string
 *                 enum: [open, in-progress, resolved, cancelled]
 *                 default: open
 *               category:
 *                 type: string
 *                 enum: [software, hardware, network, other]
 *                 default: other
 *     responses:
 *       201:
 *         description: Ticket creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 status:
 *                   type: string
 *                 category:
 *                   type: string
 *                 createdBy:
 *                   type: string
 *                 assignedTo:
 *                   type: string
 *                   nullable: true
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       from:
 *                         type: string
 *                       role:
 *                         type: string
 *                       message:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Error de validación o datos inválidos
 */
router.post('/', authMiddleware, checkRole(['cliente']), validateRequest(ticketSchema), createTicket);
/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Obtener todos los tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los tickets disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   priority:
 *                     type: string
 *                   status:
 *                     type: string
 *                   category:
 *                     type: string
 *                   createdBy:
 *                     type: string
 *                   assignedTo:
 *                     type: string
 *                     nullable: true
 *                   messages:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         from:
 *                           type: string
 *                         role:
 *                           type: string
 *                         message:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: No autorizado (token faltante o inválido)
 */
router.get('/', authMiddleware, checkRole(['admin', 'tecnico']), getTickets);
/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Obtener un ticket por su ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del ticket a consultar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 status:
 *                   type: string
 *                 category:
 *                   type: string
 *                 createdBy:
 *                   type: string
 *                 assignedTo:
 *                   type: string
 *                   nullable: true
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       from:
 *                         type: string
 *                       role:
 *                         type: string
 *                       message:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Ticket no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/:id', authMiddleware, checkRole(['admin', 'tecnico', 'cliente']), getTicketById);
/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Actualizar un ticket existente
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del ticket a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in-progress, resolved, cancelled]
 *                 example: resolved
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               category:
 *                 type: string
 *                 enum: [software, hardware, network, other]
 *                 example: hardware
 *               assignedTo:
 *                 type: string
 *                 example: 64dc96d5ef789b2a1a2be123
 *     responses:
 *       200:
 *         description: Ticket actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket updated successfully
 *                 ticket:
 *                   $ref: 
 *       400:
 *         description: Datos inválidos o ID incorrecto
 *       404:
 *         description: Ticket no encontrado
 *       401:
 *         description: No autorizado
 */
router.put('/:id', authMiddleware, checkRole(['admin', 'tecnico']), updateTicket);
/**
 * @swagger
 * /api/tickets/{id}/:
 *   patch:
 *     summary: Cancelar un ticket (cambia su estado a "cancelled")
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del ticket a cancelar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket cancelado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket cancelled successfully
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: cancelled
 *       400:
 *         description: ID inválido o error al cancelar
 *       404:
 *         description: Ticket no encontrado
 *       401:
 *         description: No autorizado
 */
router.patch('/:id', authMiddleware, checkRole(['admin', 'tecnico']), cancelTicket);

export default router;