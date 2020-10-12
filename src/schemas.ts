import {object as yupObject, string as yupString} from "yup";
import {LoginMutationVariables, UserInput} from "./generated/graphql";

export const registerSchema = yupObject<UserInput>().shape({
    username: yupString()
        .min(4)
        .max(50)
        .required(),
    password: yupString()
        .min(4)
        .max(50)
        .required(),
    passwordRepeat: yupString()
        .min(4)
        .max(50)
        .required(),
    email: yupString()
        .email()
        .required(),
    name: yupString()
        .required(),
    affiliation: yupString()
        .notRequired()
});

export const loginSchema = yupObject<LoginMutationVariables>().shape({
    username: yupString()
        .min(4)
        .max(50)
        .required(),
    password: yupString()
        .min(4)
        .max(50)
        .required()
})
