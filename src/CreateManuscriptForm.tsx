import React from 'react';
import {useTranslation} from "react-i18next";
import {
    LoggedInUserFragment,
    ManuscriptIdentifierInput,
    ManuscriptIdentifierType,
    ManuscriptMetaDataInput,
    PalaeographicClassification,
    useCreateManuscriptMutation
} from "./generated/graphql";
import {
    ErrorMessage,
    Field,
    FieldArray,
    FieldArrayRenderProps,
    Form,
    Formik,
    FormikErrors,
    FormikHelpers
} from "formik";
import {manuscriptSchema} from './forms/schemas';
import classnames from "classnames";
import {ManuscriptIdInputField} from './forms/ManuscriptIdInputField';
import {loginUrl} from "./urls";
import {Redirect} from 'react-router-dom';
import {BulmaField} from "./forms/BulmaFields";
import {useSelector} from "react-redux";
import {activeUserSelector} from "./store/store";
import {allPalaeographicClassifications, getNameForPalaeoClassification} from "./palaeoClassification";
import {allKnownProvenances} from "./provenances";

function newManuscriptIdentifier(): ManuscriptIdentifierInput {
    return {
        identifier: '',
        identifierType: ManuscriptIdentifierType.CollectionNumber
    };
}

export function CreateManuscriptForm() {

    const {t} = useTranslation('common');

    const [createManuscript, {data: manuscriptCreationData}] = useCreateManuscriptMutation();

    const currentUser: LoggedInUserFragment | undefined = useSelector(activeUserSelector);

    const createdManuscript: string | null | undefined = manuscriptCreationData?.me?.createManuscript;

    if (!currentUser) {
        return <Redirect to={loginUrl}/>
    } else if (!!createdManuscript) {
        return <Redirect to={`./manuscripts/${encodeURIComponent(createdManuscript)}/data`}/>
    }

    const initialValues: ManuscriptMetaDataInput = {
        mainIdentifier: newManuscriptIdentifier(),
        otherIdentifiers: [],
        palaeographicClassification: PalaeographicClassification.Unclassified,
        palaeographicClassificationSure: false,
    }

    function handleSubmit(manuscriptMetaData: ManuscriptMetaDataInput, {setSubmitting}: FormikHelpers<ManuscriptMetaDataInput>): void {
        createManuscript({variables: {manuscriptMetaData}})
            .catch((e) => console.error(e));

        setSubmitting(false);
    }

    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">{t('Manuskript erstellen')}</h1>

            <Formik initialValues={initialValues} validationSchema={manuscriptSchema} onSubmit={handleSubmit}>

                {({errors, touched, isSubmitting, setFieldValue, values}) => {

                    const palaeoClassificationClasses = classnames("select", 'is-fullwidth', {
                        'is-success': touched.palaeographicClassification && !errors.palaeographicClassification,
                        'is-danger': touched.palaeographicClassification && errors.palaeographicClassification
                    });

                    return (
                        <Form>
                            <div className="field">
                                <label className="label">{t('Hauptidentifikator')}</label>
                                <div className="control">
                                    <ManuscriptIdInputField mainId="mainIdentifier"
                                                            value={values.mainIdentifier}
                                                            errors={errors.mainIdentifier}
                                                            touched={touched.mainIdentifier}/>
                                </div>
                            </div>

                            <FieldArray name="otherIdentifiers">
                                {(arrayHelpers: FieldArrayRenderProps) =>
                                    <>
                                        <div className="field">
                                            <label className="label">{t('Andere Identifikatoren')}:</label>
                                            <div>
                                                {values.otherIdentifiers!.map((otherIdentifier: ManuscriptIdentifierInput, index: number) =>
                                                    <ManuscriptIdInputField
                                                        mainId={`otherIdentifiers.${index}`} key={index}
                                                        value={otherIdentifier}
                                                        deleteFunc={() => arrayHelpers.remove(index)}
                                                        errors={errors.otherIdentifiers ? errors.otherIdentifiers[index] as FormikErrors<ManuscriptIdentifierInput> : undefined}
                                                        touched={touched.otherIdentifiers ? touched.otherIdentifiers[index] : undefined}/>
                                                )}
                                            </div>
                                        </div>

                                        <div className="field">
                                            <button className="button is-link" type="button"
                                                    onClick={() => arrayHelpers.push(newManuscriptIdentifier())}>+
                                            </button>
                                        </div>
                                    </>

                                }
                            </FieldArray>

                            <div className="field">
                                <label className="label">{t('Paläographische Klassifikation')}:</label>
                                <div className="field has-addons">
                                    <div className="control is-expanded">
                                        <div className={palaeoClassificationClasses}>
                                            <Field as="select" id="palaeographicClassification"
                                                   name="palaeographicClassification">
                                                {allPalaeographicClassifications.map((pc) =>
                                                    <option key={pc}
                                                            value={pc}>{getNameForPalaeoClassification(pc, t)}</option>
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="control">
                                        <button className="button" type="button"
                                                onClick={() => setFieldValue('palaeographicClassificationSure', !values.palaeographicClassificationSure)}>
                                            {values.palaeographicClassificationSure ? t('Gesichert') : t('Nicht gesichert')}
                                        </button>
                                    </div>
                                </div>
                                <ErrorMessage name="palaeographicClassification">
                                    {msg => <p className="help is-danger">{msg}</p>}
                                </ErrorMessage>
                                <ErrorMessage name="palaeographicClassificationSure">
                                    {msg => <p className="help is-danger">{msg}</p>}
                                </ErrorMessage>
                            </div>

                            <Field name="provenance" id="provenance" label={t('provenance')} list="provenances"
                                   component={BulmaField}/>
                            <datalist id="provenances">
                                {allKnownProvenances.map((pro) =>
                                    <option key={pro.englishName} value={pro.englishName}/>)}
                            </datalist>

                            <Field name="cthClassification" id="cthClassification"
                                   label={t('cthClassification')}
                                   component={BulmaField}/>

                            <Field name="bibliography" id="bibliography" label={t('bibliography')}
                                   component={BulmaField} asTextArea={true}/>

                            {!!createdManuscript && <div className="notification is-success has-text-centered">
                                {t('Manuskript {{which}} wurde erfolgreich erstellt.', {which: createdManuscript})}
                            </div>}

                            <div className="field">
                                <button type="submit" disabled={isSubmitting || !!createdManuscript}
                                        className={classnames("button", "is-link", "is-fullwidth", {'is-loading': isSubmitting})}>
                                    {t('Manuskript erstellen')}
                                </button>
                            </div>

                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
