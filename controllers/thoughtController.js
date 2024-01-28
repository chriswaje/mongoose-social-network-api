const { Thought, User } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thought = await Thought.find();
            res.json(thought);
        } catch (err) {
            res.status(500).json(err)
        }
    },
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({_id: req.params.thoughtId})
            .populate('reactions')

            if (!thought) {
                return res.status(404).json({ message: 'Thought was not found'})
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err)
        }
    },
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            // adds thought to user via matching username in Thought and User model
            await User.findOneAndUpdate({username: thought.username}, {$addToSet: {thoughts: thought._id}}, {new: true});
            res.json(thought)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    async updateThought(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate({_id: req.params.thoughtId}, req.body, {new: true});

            if (!thought) {
                return res.status(404).json({ message: 'Thought was not found'})
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err)
        }
    },
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({_id: req.params.thoughtId});

            if (!thought) {
                res.status(404).json({ message: 'Thought was not found'})
            }

            // update User's thought array when a thought is deleted
            await User.findOneAndUpdate({username: thought.username}, {$pull: {thoughts: req.params.thoughtId}}, {new: true})

            res.json(thought)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    async createReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate({_id: req.params.thoughtId}, {$addToSet: {reactions: req.body}}, {new: true});
            res.json(reaction)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    async removeReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate({_id: req.params.thoughtId}, {$pull: {reactions: {_id: req.params.reactionId}}}, {new: true});
            res.json(reaction)
        } catch (err) {
            res.status(500).json(err)
        }
    }
}
