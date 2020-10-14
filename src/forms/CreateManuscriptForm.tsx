import React from 'react';
import {useTranslation} from "react-i18next";
import {
    ManuscriptIdentifierInput,
    ManuscriptIdentifierType,
    ManuscriptMetaDataInput,
    PalaeographicClassification,
    useCreateManuscriptMutation
} from "../generated/graphql";
import {ErrorMessage, Field, FieldArray, FieldArrayRenderProps, Form, Formik, FormikErrors} from "formik";
import {manuscriptSchema} from './schemas';
import classnames from "classnames";
import {ManuscriptIdInputField} from './ManuscriptIdInputField';
import {authenticationService} from "../_services/authentication.service";
import {loginUrl} from "../urls";
import {Redirect} from 'react-router-dom';
import {BulmaFieldWithLabel} from "./BulmaFields";

function newManuscriptIdentifier(): ManuscriptIdentifierInput {
    return {
        identifier: '',
        identifierType: ManuscriptIdentifierType.CollectionNumber
    };
}

export function CreateManuscriptForm() {

    const {t} = useTranslation('common');
    const [createManuscript, {data}] = useCreateManuscriptMutation();

    const currentUser = authenticationService.currentUserValue;

    if (!currentUser) {
        return <Redirect to={loginUrl}/>
    }

    const initialValues: ManuscriptMetaDataInput = {
        mainIdentifier: newManuscriptIdentifier(),
        otherIdentifiers: [],
        palaeographicClassification: PalaeographicClassification.Unclassified,
        palaeographicClassificationSure: false,
    }

    function handleSubmit(manuscriptMetaData: ManuscriptMetaDataInput, setSubmitting: (isSubmitting: boolean) => void): void {
        createManuscript({variables: {jwt: currentUser!.jwt, manuscriptMetaData}})
            .then(({data}) => console.info(JSON.stringify(data, null, 2)))
            .catch((e) => console.error(e));

        setSubmitting(false);
    }

    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">{t('Manuskript erstellen')}</h1>

            <Formik
                initialValues={initialValues}
                validationSchema={manuscriptSchema}
                onSubmit={(values, {setSubmitting}) => handleSubmit(values, setSubmitting)}>

                {({initialValues, errors, touched, isSubmitting, setFieldValue, values}) => {

                    const palaeoClassificationClasses = classnames("select", 'is-fullwidth', {
                        'is-success': touched.palaeographicClassification && !errors.palaeographicClassification,
                        'is-danger': touched.palaeographicClassification && errors.palaeographicClassification
                    });

                    return (
                        <Form>
                            <div className="field">
                                <label className="label">{t('Hauptidentifikator')}</label>
                                <div className="control">
                                    <ManuscriptIdInputField mainId="mainIdentifier" value={values.mainIdentifier}
                                                            errors={errors.mainIdentifier}
                                                            touched={touched.mainIdentifier}/>
                                </div>
                            </div>

                            <FieldArray name="otherIdentifiers" render={(arrayHelpers: FieldArrayRenderProps) => {
                                return (
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
                                );
                            }
                            }/>

                            <div className="field">
                                <label className="label">{t('Paläographische Klassifikation')}:</label>
                                <div className="field has-addons">
                                    <div className="control is-expanded">
                                        <div className={palaeoClassificationClasses}>
                                            <Field as="select" id="palaeographicClassification"
                                                   name="palaeographicClassification">
                                                <option value={PalaeographicClassification.OldScript}>
                                                    {t('Althethitische Schrift')}
                                                </option>
                                                <option value={PalaeographicClassification.OldAssyrianScript}>
                                                    {t('Altassyrische Schrift')}
                                                </option>
                                                <option value={PalaeographicClassification.NewScript}>
                                                    {t('Junghethitische Schrift')}
                                                </option>
                                                <option value={PalaeographicClassification.MiddleScript}>
                                                    {t('Mittelhethitische Schrift')}
                                                </option>
                                                <option value={PalaeographicClassification.MiddleBabylonianScript}>
                                                    {t('Mittelbabylonische Schrift')}
                                                </option>
                                                <option value={PalaeographicClassification.MiddleAssyrianScript}>
                                                    {t('Mittelassyrische Schrift')}
                                                </option>
                                                <option value={PalaeographicClassification.LateNewScript}>
                                                    {t('Spätjunghethitische Schrift')}
                                                </option>
                                                <option value={PalaeographicClassification.AssyroMittanianScript}>
                                                    {t('Assyro-mittanische Schrift')}
                                                </option>
                                                <option value={PalaeographicClassification.Unclassified}>
                                                    {t('Unklassifiziert')}
                                                </option>
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

                            <BulmaFieldWithLabel id="provenance" initialValue={initialValues.provenance}
                                                 label={t('Provenienz')} errors={errors.provenance}
                                                 touched={touched.provenance}/>

                            <BulmaFieldWithLabel id="cthClassification" initialValue={initialValues.cthClassification}
                                                 type="number" label={t('Vorschlag CTH-Klassifikation')}
                                                 errors={errors.cthClassification} touched={touched.cthClassification}/>

                            <div className="field">
                                <label htmlFor="bibliography" className="label">{t('Bibliographie')}:</label>
                                <div className="control">
                                    <Field as="textarea" className="textarea" id="bibliography" name="bibliography"
                                           value={initialValues.bibliography} placeholder={t('Bibliographie')}/>
                                </div>
                            </div>

                            {data?.me?.createManuscript && <div className="notification is-success has-text-centered">
                                {t('Manuskript {{which}} wurde erfolgreich erstellt.', {which: data.me.createManuscript})}
                            </div>}

                            <div className="field">
                                <button type="submit" disabled={isSubmitting || !!data?.me?.createManuscript}
                                        className={classnames("button", "is-link", "is-fullwidth", {'is-loading': isSubmitting})}>
                                    {t('Manuskript erstellen')}
                                </button>
                            </div>

                        </Form>
                    );
                }}
            </Formik>
        </div>
    )
}
