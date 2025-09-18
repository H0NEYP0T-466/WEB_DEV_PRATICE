const { todoConnection } = require('../config/database');
const { Schema } = require('mongoose');

// Sub-todo schema for individual tasks within a todo card
const subTodoSchema = new Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Main todo card schema
const todoCardSchema = new Schema({
    title: { type: String, required: true },
    subTodos: [subTodoSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const TodoCard = todoConnection.model('TodoCard', todoCardSchema);

module.exports = TodoCard;