import Ticket from '../models/ticket.model.js';
import mongoose from 'mongoose';

export const createTicket = async (req, res) => {
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
        return res.status(500).json({
            message: 'Internal server error'
        });
    };
};

export const getTickets = async (req, res) => {

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
        console.error('Error retrieving tickets:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    };
};

export const getTicketById = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket  = await Ticket.findById(id).populate('createdBy', 'name email').populate('assignedTo', 'name email');

        if (!ticket) {
            return res.status(404).json({
                message: 'Ticket not found'
            });
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
        return res.status(500).json({
            message: 'Internal server error'
        });
    };
};

export const updateTicket = async (req, res) => {
    const { id } = req.params;
    const updatedTicketData = req.body;

    try {
        const ticketUpdated = await Ticket.findByIdAndUpdate(id, updatedTicketData, { new: true }).populate('createdBy', 'name email').populate('assignedTo', 'name email');

        if (!ticketUpdated) {
            return res.status(404).json({
                message: 'Ticket not found'
            });
        };

        res.status(200).json({
            message: 'Ticket updated successfully',
            ticket: ticketUpdated
        });

    } catch ( error ) {
        console.error('Error updating ticket:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    };
};

export const cancelTicket = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ticket ID' });
    }

    try {
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                message: 'Ticket not found'
            });
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
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};