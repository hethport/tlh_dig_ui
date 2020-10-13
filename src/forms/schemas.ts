import {
    array as yupArray,
    number as yupNumber,
    boolean as yupBoolean,
    mixed as yupMixed,
    object as yupObject,
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

export const palaeoClasses: PalaeographicClassification[] = Object.keys(PalaeographicClassification)
    .map((pc) => PalaeographicClassification[pc as keyof typeof PalaeographicClassification]);

export const manuscriptIdentifierTypes: ManuscriptIdentifierType[] = Object.keys(ManuscriptIdentifierType)
    .map((mi) => ManuscriptIdentifierType[mi as keyof typeof ManuscriptIdentifierType])

export const registerSchema = yupObject<UserInput>().shape({
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
});

const manuscriptIdentifierSchema = yupObject<ManuscriptIdentifierInput>().shape({
    identifier: yupString()
        .required(),
    identifierType: yupMixed<ManuscriptIdentifierType>()
        .oneOf([
            ManuscriptIdentifierType.CollectionNumber,
            ManuscriptIdentifierType.ExcavationNumber,
            ManuscriptIdentifierType.PublicationShortReference
        ])
        .required()
});

export const manuscriptSchema = yupObject<CreateManuscriptMutationVariables>().shape({
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
        ])
        .required(),
    palaeographicClassificationSure: yupBoolean()
        .required(),
    cthClassification: yupNumber()
        .notRequired(),
    provenance: yupString()
        .notRequired(),
    bibliography: yupString()
        .notRequired()
});
