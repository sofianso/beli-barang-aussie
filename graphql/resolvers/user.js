const bcrypt = require("bcryptjs");
const User = require("../../models/user");

module.exports = {
    createUser: async(args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error("User exists already.");
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
                firstName: args.userInput.firstName,
                lastName: args.userInput.lastName,
            });

            const result = await user.save();
            // this return statement is necessary to prevent password from being returned in GraphQL Playground
            return {...result._doc, password: null, _id: result.id };
        } catch (err) {
            throw err;
        }
    },
    updateUser: async(args) => {
        try {
            const user = await User.findById(args.userId);
            if (!user) {
                throw new Error("User not found.");
            }
            user.firstName = args.userInput.firstName;
            user.lastName = args.userInput.lastName;
            const result = await user.save();
            return {...result._doc, password: null, _id: result.id };
        } catch (err) {
            throw err;
        }
    },
};