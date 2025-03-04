"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolversUser = void 0;
const generate_1 = require("../helpers/generate");
const user_model_1 = __importDefault(require("../models/user.model"));
const md5_1 = __importDefault(require("md5"));
exports.resolversUser = {
    Query: {
        getUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(context["user"]);
            const infoUser = yield user_model_1.default.findOne({
                token: context["user"].token,
                deleted: false
            });
            if (infoUser) {
                return {
                    code: 200,
                    message: "Thành Công!",
                    id: infoUser.id,
                    fullName: infoUser.fullName,
                    email: infoUser.email,
                    token: infoUser.token
                };
            }
            else {
                return {
                    code: 400,
                    message: "Thất Bại!"
                };
            }
        }),
    },
    Mutation: {
        registerUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { user } = args;
            const emailExist = yield user_model_1.default.findOne({
                email: user.email,
                deleted: false
            });
            if (emailExist) {
                return {
                    code: 400,
                    message: "Email Đã Tồn Tại !"
                };
            }
            else {
                user.password = (0, md5_1.default)(user.password);
                user.token = (0, generate_1.generateRandomString)(30);
                const newUser = new user_model_1.default(user);
                const data = yield newUser.save();
                return {
                    code: 200,
                    message: "Thành Công!",
                    id: data.id,
                    fullName: data.fullName,
                    email: data.email,
                    token: data.token
                };
            }
        }),
        loginUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { email, password } = args.user;
            const infoUser = yield user_model_1.default.findOne({
                email: email,
                deleted: false,
            });
            if (!infoUser) {
                return {
                    code: 400,
                    message: "Email Không Tồn Tại!"
                };
            }
            if ((0, md5_1.default)(password) !== infoUser.password) {
                return {
                    code: 400,
                    message: "Sai Mật Khẩu!"
                };
            }
            return {
                code: 200,
                message: "Thành Công !",
                id: infoUser.id,
                fullName: infoUser.fullName,
                email: infoUser.email,
                token: infoUser.token,
            };
        }),
    }
};
