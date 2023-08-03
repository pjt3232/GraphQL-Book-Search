const User = require('../models/User');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const foundUser = await User.findOne({_id: context.user._id});
                return foundUser;
            }
            throw new Error('Not authenticated. Please log in.');
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ 
                $or: [{username: email }, { email }]
            });
            
            if (!user) {
                throw new Error("Can't find this user");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new Error('Wrong password!');
            }

            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            if (!user) {
                throw new Error('Something is wrong!');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { input }, context) => {
            if (!context.user) {
                throw new Error('Not authenticated. Please log in.');
            }

            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input }},
                    { new: true, runValidators: true }
                );

                return updatedUser;
            } catch (err) {
                console.log(err);
                throw new Error('Could not save the book');
            } 
        },
        removeBook: async (parent, { bookId }, context) => {
            if (!context.user) {
                throw new Error('Not authenticated. Please log in.');
            }

            try {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).populate('savedBooks');

                return updatedUser;
            } catch (err) {
                console.error(err);
                throw new Error('Failed to remove the book.');
            }
        },
    },
};

module.exports = resolvers;