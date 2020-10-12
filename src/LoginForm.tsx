import React from 'react';
import {LoginMutationVariables, useLoginMutation} from "./generated/graphql";
import {useTranslation} from "react-i18next";
import {Form, Formik} from 'formik';
import {BulmaField} from "./_components/BulmaField";
import {loginSchema} from './schemas';
import classnames from "classnames";

export function LoginForm() {

    const {t} = useTranslation('common');
    const [login, {data}] = useLoginMutation();

    const initialValues: LoginMutationVariables = {
        username: '',
        password: ''
    }

    if (data) {
        console.info(JSON.stringify(data, null, 2));
    }

    return (
        <div className="container">

            <h1 className="title is-3 has-text-centered">{t('Login')}</h1>

            <Formik initialValues={initialValues}
                    validationSchema={loginSchema}
                    onSubmit={(values, {setSubmitting}) => {
                        login({variables: values}).catch((e) => console.error(e));
                        setSubmitting(false);
                    }}>
                {({initialValues, errors, touched, isSubmitting}) =>
                    <Form>
                        <BulmaField id="username" initialValue={initialValues.username} label={t('Nutzername')}
                                    errors={errors.username} touched={touched.username} autoFocus/>

                        <BulmaField id="password" initialValue={initialValues.password} type="password"
                                    label={t('Passwort')} errors={errors.password} touched={touched.password}/>

                        <div className="field">
                            <button type="submit" disabled={isSubmitting || !!data?.login}
                                    className={classnames("button", "is-link", "is-fullwidth", {'is-loading': isSubmitting})}>{t('Login')}</button>
                        </div>
                    </Form>
                }
            </Formik>
        </div>
    )
}
