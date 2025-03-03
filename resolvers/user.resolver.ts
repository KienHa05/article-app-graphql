import { generateRandomString } from "../helpers/generate";
import User from "../models/user.model";
import md5 from "md5";

export const resolversUser = {
    Mutation: {
        registerUser: async (_, args) => {
            const { user } = args;

            const emailExist = await User.findOne({
                email: user.email,
                deleted: false
            });

            if (emailExist) {
                return {
                    code: 400,
                    message: "Email Đã Tồn Tại !"
                };
            } else {
                user.password = md5(user.password);
                user.token = generateRandomString(30);

                const newUser = new User(user);
                const data = await newUser.save();

                return {
                    code: 200,
                    message: "Thành Công!",
                    id: data.id,
                    fullName: data.fullName,
                    email: data.email,
                    token: data.token
                };
            }
        },
    }
};