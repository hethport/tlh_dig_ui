import React from 'react';
import {LoginMutationVariables, useLoginMutation} from "../generated/graphql";
import {useTranslation} from "react-i18next";
import {Form, Formik} from 'formik';
import {BulmaFieldWithLabel} from "./BulmaFields";
import {loginSchema} from './schemas';
import classnames from "classnames";
import {authenticationService} from "../_services/authentication.service";
import {homeUrl} from "../urls";
import {Redirect} from 'react-router-dom';

export function LoginForm() {

    const {t} = useTranslation('common');
    const [login, {data}] = useLoginMutation();

    const initialValues: LoginMutationVariables = {
        username: '',
        password: ''
    }

    if (authenticationService.currentUserValue) {
        return <Redirect to={homeUrl}/>;
    }

    function handleSubmit(values: LoginMutationVariables, setSubmitting: (isSubmitting: boolean) => void): void {
        login({variables: values})
            .then(({data}) => {
                if (data && data.login) {
                    authenticationService.activateLogin(data.login)
                }
            })
            .catch((e) => console.error(e));

        setSubmitting(false);
    }

    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">{t('Login')}</h1>

            <Formik
                initialValues={initialValues}
                validationSchema={loginSchema}
                onSubmit={(values, {setSubmitting}) => handleSubmit(values, setSubmitting)}>

                {({initialValues, errors, touched, isSubmitting}) =>
                    <Form>
                        <BulmaFieldWithLabel id="username" initialValue={initialValues.username} label={t('Nutzername')}
                                             errors={errors.username} touched={touched.username} autoFocus/>

                        <BulmaFieldWithLabel id="password" initialValue={initialValues.password} type="password"
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
