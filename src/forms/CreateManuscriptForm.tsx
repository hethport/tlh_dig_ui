import React from 'react';
import {useTranslation} from "react-i18next";
import {
    ManuscriptIdentifierType,
    ManuscriptMetaDataInput,
    PalaeographicClassification,
    useCreateManuscriptMutation
} from "../generated/graphql";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {manuscriptSchema, palaeoClasses} from './schemas';
import classnames from "classnames";
import {ManuscriptIdInputField} from './ManuscriptIdInputField';
import {authenticationService} from "../_services/authentication.service";
import {loginUrl} from "../urls";
import {Redirect} from 'react-router-dom';
import {BulmaFieldWithLabel, BulmaSelect, SelectOption} from "./BulmaFields";

const palaeoClassOptions: SelectOption[] = palaeoClasses.map((pc) => {
    return {value: pc, description: pc};
})

export function CreateManuscriptForm() {

    const {t} = useTranslation('common');
    const [createManuscript, {data}] = useCreateManuscriptMutation();

    const currentUser = authenticationService.currentUserValue;

    if (!currentUser) {
        return <Redirect to={loginUrl}/>
    }

    const initialValues: ManuscriptMetaDataInput = {
        mainIdentifier: {identifier: '', identifierType: ManuscriptIdentifierType.CollectionNumber},
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

                {({initialValues, errors, touched, isSubmitting, setFieldValue, values}) =>
                    <Form>
                        <ManuscriptIdInputField
                            mainId="mainIdentifier" initialValue={initialValues.mainIdentifier}
                            errors={errors.mainIdentifier} touched={touched.mainIdentifier}/>

                        <div className="field">
                            <label className="label">{t('Paläographische Klassifikation')}:</label>
                            <div className="field has-addons">
                                <div className="control is-expanded">
                                    <BulmaSelect id="palaeographicClassification"
                                                 isFullwidth={true}
                                                 options={palaeoClassOptions}
                                                 errors={errors.palaeographicClassification}
                                                 touched={touched.palaeographicClassification}/>
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

                        {data?.me?.createManuscript &&
                        <div className="notification is-success has-text-centered">
                            {t('Manuskript {{which}} wurde erfolgreich erstellt.', {which: data.me.createManuscript})}
                        </div>
                        }

                        <div className="field">
                            <button type="submit" disabled={isSubmitting || !!data?.me?.createManuscript}
                                    className={classnames("button", "is-link", "is-fullwidth", {'is-loading': isSubmitting})}>
                                {t('Manuskript erstellen')}
                            </button>
                        </div>

                    </Form>
                }
            </Formik>
        </div>
    )
}
