const { Schema } = require('mongoose');

// this is a subdocument schema for the "reactions" field in the Thought schema, not a model
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function (time) {
                return time.toLocaleString();
            },
        }
    },
    {
        toJSON: {
            getters: true,
        },
        id: false
    }
);

module.exports = reactionSchema;