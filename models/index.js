const User = require('./User');
const Thought = require('./Thought');
// Do not import/export Reaction schema because it is not a model, only a subdocument

module.exports = { User, Thought };