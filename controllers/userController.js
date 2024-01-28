const { User, Thought } = require('../models');

module.exports = {
    // gets all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // gets a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .populate('thoughts')
                .populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'User was not found' })
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // creates a user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // updates a user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate({ _id: req.params.userId}, req.body, {new: true});
            res.json(user);
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // deletes a user and all associated thoughts
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({_id: req.params.userId});

            if (!user) {
                return res.status(404).json({ message: 'User was not found' })
            }

            await Thought.deleteMany({_id: {$in: user.thoughts}});
            
            res.json(user);
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // adds a friend to a user
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate({_id: req.params.userId}, {$addToSet: { friends: req.body.friendId}}, {new: true});
            res.json(user);
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // deletes a friend from a user
    async deleteFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate({_id: req.params.userId}, {$pull: {friends: req.body.friendId}}, {new: true});
            res.json(user)
        } catch (err) {
            res.status(500).json(err)
        }
    }
}