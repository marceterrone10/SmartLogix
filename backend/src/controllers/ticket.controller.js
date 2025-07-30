import Ticket from '../models/ticket.model.js';
import mongoose from 'mongoose';
import { ApiError } from '../utils/apiError.js';

export const createTicket = async (req, res, next) => {
    const { title, description, priority, category, assignedTo } = req.body;

    try {
        const newTicket = new Ticket({
            title,
            description,
            priority: priority || 'low',
            category: category || 'other',
            createdBy: req.user.id, // Use the authenticated user's ID
            assignedTo: assignedTo || null
        });

        await newTicket.save();

        res.status(201).json({
            message: 'Ticket created successfully',
            ticket: {
                id: newTicket._id,
                title: newTicket.title,
                description: newTicket.description,
                priority: newTicket.priority,
                category: newTicket.category,
                status: newTicket.status,
                createdBy: newTicket.createdBy,
                assignedTo: newTicket.assignedTo
            }
        });


    } catch (error) {
        console.error('Error creating ticket:', error);
        next(error);
    };
};

export const getTickets = async (req, res, next) => {

    try {
        const tickets = await Ticket.find().populate('createdBy', 'name email').populate('assignedTo', 'name email');

        res.status(200).json({
            message: 'Tickets retrieved succesfully',
            tickets: tickets.map(ticket => ({
                id: ticket._id,
                title: ticket.title,
                description: ticket.description,
                priority: ticket.priority,
                category: ticket.category,
                status: ticket.status,
                createdBy: {
                    id: ticket.createdBy._id,
                    name: ticket.createdBy.name,
                    email: ticket.createdBy.email
                },
                assignedTo: ticket.assignedTo ? {
                    id: ticket.assignedTo._id,
                    name: ticket.assignedTo.name,
                    email: ticket.assignedTo.email
                } : null
            }))
        }
        )
    } catch (error) {
        next(error);
    };
};

export const getTicketById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const ticket  = await Ticket.findById(id).populate('createdBy', 'name email').populate('assignedTo', 'name email');

        if (!ticket) {
            throw new ApiError(404, 'Ticket not found');
        };

        res.status(200).json({
            message: 'Ticket retrieved successfully',
            ticket: {
                id: ticket._id,
                title: ticket.title,
                description: ticket.description,
                priority: ticket.priority,
                category: ticket.category,
                status: ticket.status,
                createdBy: {
                    id: ticket.createdBy._id,
                    name: ticket.createdBy.name,
                    email: ticket.createdBy.email
                },
                assignedTo: ticket.assignedTo ? {
                    id: ticket.assignedTo._id,
                    name: ticket.assignedTo.name,
                    email: ticket.assignedTo.email
                } : null
            }
        });

    } catch ( error ) {
        console.error('Error retrieving ticket by ID:', error);
        next(error);
    };
};

export const updateTicket = async (req, res, next) => {
    const { id } = req.params;
    const updatedTicketData = req.body;

    try {
        const ticketUpdated = await Ticket.findByIdAndUpdate(id, updatedTicketData, { new: true }).populate('createdBy', 'name email').populate('assignedTo', 'name email');

        if (!ticketUpdated) {
            throw new ApiError(404, 'Ticket not found');
        };

        res.status(200).json({
            message: 'Ticket updated successfully',
            ticket: ticketUpdated
        });

    } catch ( error ) {
        console.error('Error updating ticket:', error);
        next(error);
    };
};

export const cancelTicket = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid ticket ID');
    }

    try {
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            throw new ApiError(404, 'Ticket not found');
        }

        ticket.status = 'cancelled';
        await ticket.save();

        res.status(200).json({
            message: 'Ticket cancelled successfully',
            ticket: {
                id: ticket._id,
                title: ticket.title,
                status: ticket.status
            }
        });
    } catch ( error ) {
        console.error('Error cancelling ticket:', error);
        next(error);
    }
};