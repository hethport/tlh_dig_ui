import React from 'react';
import {useRegisterMutation, UserInput} from "../generated/graphql";
import {useTranslation} from "react-i18next";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {registerSchema} from "./schemas";
import {BulmaField} from "./BulmaFields";
import classnames from 'classnames';


export function RegisterForm() {

    const {t} = useTranslation('common');
    const [register, {data}] = useRegisterMutation();

    const initialValues: UserInput = {
        username: '',
        email: '',
        password: '',
        passwordRepeat: '',
        name: '',
    }

    function onSubmit(values: UserInput, {setSubmitting}: FormikHelpers<UserInput>): void {
        register({variables: {userInput: values}}).catch((e) => console.error(e));
        setSubmitting(false);
    }

    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">{t('Registrieren')}</h1>

            <Formik initialValues={initialValues} validationSchema={registerSchema} onSubmit={onSubmit}>
                {({isSubmitting}) =>
                    <Form>
                        <Field name="username" id="username" label={t('username')} component={BulmaField}/>

                        <Field type="password" name="password" id="password" label={t('password')}
                               component={BulmaField}/>

                        <Field type="password" name="passwordRepeat" id="passwordRepeat" label={t('password_repeat')}
                               component={BulmaField}/>

                        <Field name="name" id="name" label={t('name')} component={BulmaField}/>


                        <Field type="email" name="email" label={t('email')} component={BulmaField}/>

                        <Field name="affiliation" id="affiliation" label={t('affiliation')} component={BulmaField}/>

                        {data?.register && <div className="notification is-success has-text-centered">
                            {t('Nutzer {{who}} wurde erfolgreich registriert', {who: data.register})}.
                        </div>}

                        <div className="field">
                            <button type="submit" disabled={isSubmitting || !!data?.register}
                                    className={classnames("button", "is-link", "is-fullwidth", {'is-loading': isSubmitting})}>
                                {t('Registrieren')}
                            </button>
                        </div>
                    </Form>
                }
            </Formik>
        </div>
    )
}
