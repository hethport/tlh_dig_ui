import {
    array as yupArray,
    boolean as yupBoolean,
    mixed as yupMixed,
    number as yupNumber,
    object as yupObject,
    ObjectSchema,
    string as yupString
} from "yup";
import {
    CreateManuscriptMutationVariables,
    LoginMutationVariables,
    ManuscriptIdentifierInput,
    ManuscriptIdentifierType,
    PalaeographicClassification,
    UserInput
} from "../generated/graphql";

export const registerSchema = yupObject<UserInput>()
    .shape({
        // TODO: test password === passwordRepeat
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
    })
    .required();

export const loginSchema: ObjectSchema<LoginMutationVariables> = yupObject<LoginMutationVariables>()
    .shape({
        username: yupString()
            .min(4)
            .max(50)
            .required(),
        password: yupString()
            .min(4)
            .max(50)
            .required()
    })
    .required();

const manuscriptIdentifierSchema: ObjectSchema<ManuscriptIdentifierInput> = yupObject<ManuscriptIdentifierInput>()
    .shape({
        identifier: yupString()
            .required(),
        identifierType: yupMixed<ManuscriptIdentifierType>()
            .oneOf([
                ManuscriptIdentifierType.CollectionNumber,
                ManuscriptIdentifierType.ExcavationNumber,
                ManuscriptIdentifierType.PublicationShortReference
            ] as const)
            .required()
    })
    .required();

export const manuscriptSchema: ObjectSchema<CreateManuscriptMutationVariables> = yupObject<CreateManuscriptMutationVariables>()
    .shape({
        // TODO: other fields!
        mainIdentifier: manuscriptIdentifierSchema
            .required(),
        otherIdentifiers: yupArray(manuscriptIdentifierSchema)
            .notRequired(),
        palaeographicClassification: yupMixed<PalaeographicClassification>()
            .oneOf([
                PalaeographicClassification.Unclassified,
                PalaeographicClassification.AssyroMittanianScript,
                PalaeographicClassification.LateNewScript,
                PalaeographicClassification.MiddleAssyrianScript,
                PalaeographicClassification.MiddleBabylonianScript,
                PalaeographicClassification.MiddleScript,
                PalaeographicClassification.NewScript,
                PalaeographicClassification.OldAssyrianScript,
                PalaeographicClassification.OldScript
            ] as const)
            .required(),
        palaeographicClassificationSure: yupBoolean()
            .required(),
        cthClassification: yupNumber()
            .notRequired(),
        provenance: yupString()
            .notRequired(),
        bibliography: yupString()
            .notRequired()
    })
    .required();
