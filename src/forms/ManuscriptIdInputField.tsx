import React from 'react';
import {ErrorMessage, Field, FormikErrors, FormikTouched} from "formik";
import {ManuscriptIdentifierInput} from "../generated/graphql";
import {useTranslation} from "react-i18next";
import {manuscriptIdentifierTypes} from "./schemas";
import {BulmaField} from "./BulmaFields";

interface IProps {
    mainId: string;
    initialValue?: ManuscriptIdentifierInput | null;
    errors: FormikErrors<ManuscriptIdentifierInput> | undefined;
    touched: FormikTouched<ManuscriptIdentifierInput> | undefined;
}

export function ManuscriptIdInputField({mainId, initialValue, errors, touched}: IProps): JSX.Element {

    const {t} = useTranslation('common');

    return (
        <div className="field">
            <label htmlFor={`${mainId}.identifier`} className="label">{t('Hauptidentifikator')}:</label>
            <div className="field has-addons">
                <div className="control is-expanded">
                    <BulmaField id={`${mainId}.identifier`} initialValue={initialValue?.identifier || undefined}
                                label={t('Identifikator')} touched={touched?.identifier} errors={errors?.identifier}/>
                </div>
                <div className="control">
                    <div className="select">
                        <Field as="select" name={`${mainId}.identifierType`} id={`${mainId}.identifierType`}>
                            {manuscriptIdentifierTypes.map((mi) =>
                                <option key={mi} value={mi}>{t(mi)}</option>
                            )}
                        </Field>
                    </div>
                </div>
            </div>
            <ErrorMessage name={`${mainId}.identifier`}>
                {msg => <p className="help is-danger">{msg}</p>}
            </ErrorMessage>
            <ErrorMessage name={`${mainId}.identifierType`}>
                {msg => <p className="help is-danger">{msg}</p>}
            </ErrorMessage>
        </div>
    )
}

// value={initialValue?.identifierType || undefined}

//  selected={initialValue?.identifierType === mi}
