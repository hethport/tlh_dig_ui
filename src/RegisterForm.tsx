import React from 'react';
import {useRegisterMutation, UserInput} from "./generated/graphql";
import {useTranslation} from "react-i18next";
import {Form, Formik} from "formik";
import {registerSchema} from "./schemas";
import {BulmaField} from "./_components/BulmaField";
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

    function onFormSubmit(userInput: UserInput) {
        console.info(JSON.stringify(userInput, null, 2));

        register({variables: {userInput}})
            .catch((e) => console.error(e));
    }

    if (data) {
        console.info(data);
    }

    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">{t('Registrieren')}</h1>

            <Formik initialValues={initialValues}
                    validationSchema={registerSchema}
                    onSubmit={(values, {setSubmitting}) => {
                        onFormSubmit(values);
                        setSubmitting(false);
                    }}>
                {({initialValues, errors, touched, isSubmitting}) =>
                    <Form>
                        <BulmaField id="username" initialValue={initialValues.username} label={t('Nutzername')}
                                    errors={errors.username} touched={touched.username}/>

                        <BulmaField id="password" initialValue={initialValues.password} type="password"
                                    label={t('Password')} touched={touched.password} errors={errors.password}/>

                        <BulmaField id="passwordRepeat" initialValue={initialValues.passwordRepeat} type="password"
                                    label={t('Passwort wiederholen')} errors={errors.passwordRepeat}
                                    touched={touched.passwordRepeat}/>

                        <BulmaField id="name" initialValue={initialValues.name} label={t('Name')} errors={errors.name} touched={touched.name}/>

                        <BulmaField id="email" initialValue={initialValues.email} type="email" label={t('E-Mail')} errors={errors.email}
                                    touched={touched.email}/>

                        <BulmaField id="affiliation" initialValue={initialValues.affiliation} label={t('Affiliation')} errors={errors.affiliation}
                                    touched={touched.affiliation}/>

                        <div className="field">
                            <button type="submit" disabled={isSubmitting}
                                    className={classnames("button", "is-link", {'is-loading': isSubmitting})}>{t('Registrieren')}</button>
                        </div>
                    </Form>
                }
            </Formik>
        </div>
    )
}
