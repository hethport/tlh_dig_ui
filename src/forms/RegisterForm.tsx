import React from 'react';
import {useRegisterMutation, UserInput} from "../generated/graphql";
import {useTranslation} from "react-i18next";
import {Form, Formik} from "formik";
import {registerSchema} from "./schemas";
import {BulmaFieldWithLabel} from "./BulmaFields";
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

    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">{t('Registrieren')}</h1>

            <Formik initialValues={initialValues}
                    validationSchema={registerSchema}
                    onSubmit={(values, {setSubmitting}) => {
                        register({variables: {userInput: values}}).catch((e) => console.error(e));
                        setSubmitting(false);
                    }}>
                {({initialValues, errors, touched, isSubmitting}) =>
                    <Form>
                        <BulmaFieldWithLabel id="username" initialValue={initialValues.username} label={t('Nutzername')}
                                             errors={errors.username} touched={touched.username}/>

                        <BulmaFieldWithLabel id="password" initialValue={initialValues.password} type="password"
                                             label={t('Passwort')} touched={touched.password} errors={errors.password}/>

                        <BulmaFieldWithLabel id="passwordRepeat" initialValue={initialValues.passwordRepeat}
                                             type="password"
                                             label={t('Passwort wiederholen')} errors={errors.passwordRepeat}
                                             touched={touched.passwordRepeat}/>

                        <BulmaFieldWithLabel id="name" initialValue={initialValues.name} label={t('Name')}
                                             errors={errors.name}
                                             touched={touched.name}/>

                        <BulmaFieldWithLabel id="email" initialValue={initialValues.email} type="email"
                                             label={t('E-Mail')}
                                             errors={errors.email}
                                             touched={touched.email}/>

                        <BulmaFieldWithLabel id="affiliation" initialValue={initialValues.affiliation}
                                             label={t('Affiliation')}
                                             errors={errors.affiliation}
                                             touched={touched.affiliation}/>


                        {data?.register && <div className="notification is-success has-text-centered">
                            {t('Nutzer {{who}} wurde erfolgreich registriert', {who: data.register})}.
                        </div>
                        }

                        <div className="field">
                            <button type="submit" disabled={isSubmitting || !!data?.register}
                                    className={classnames("button", "is-link", "is-fullwidth", {'is-loading': isSubmitting})}>{t('Registrieren')}</button>
                        </div>
                    </Form>
                }
            </Formik>
        </div>
    )
}
