import React, {Dispatch, useState} from 'react';
import {LoginMutationVariables, useLoginMutation} from "../generated/graphql";
import {useTranslation} from "react-i18next";
import {Field, Form, Formik, FormikHelpers} from 'formik';
import {BulmaField} from "./BulmaFields";
import {loginSchema} from './schemas';
import classnames from "classnames";
import {homeUrl} from "../urls";
import {Redirect} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {StoreAction, userLoggedInAction} from "../store/actions";
import {activeUserSelector} from "../store/store";

export function LoginForm() {

    const {t} = useTranslation('common');
    const [login] = useLoginMutation();
    const dispatch = useDispatch<Dispatch<StoreAction>>();
    const [invalidLoginTry, setInvalidLoginTry] = useState(false);

    const activeUser = useSelector(activeUserSelector);
    if (activeUser) {
        return <Redirect to={homeUrl}/>;
    }

    const initialValues: LoginMutationVariables = {
        username: '',
        password: ''
    }

    function handleSubmit(values: LoginMutationVariables, {setSubmitting}: FormikHelpers<LoginMutationVariables>): void {
        login({variables: values})
            .then(({data}) => {
                setSubmitting(false);

                if (data && data.login) {
                    setInvalidLoginTry(false);
                    dispatch(userLoggedInAction(data.login));
                } else {
                    setInvalidLoginTry(true);
                }
            })
            .catch((e) => {
                setSubmitting(false);
                setInvalidLoginTry(false);

                console.error(e);
            });
    }

    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">{t('Login')}</h1>

            <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
                {({isSubmitting}) =>

                    <Form>
                        <Field name="username" id="username" label={t('username')} component={BulmaField}/>

                        <Field type="password" name="password" id="password" label={t('password')}
                               component={BulmaField}/>

                        {invalidLoginTry && <div className="notification is-warning has-text-centered">
                            {t('invalid_username_password_combination')}
                        </div>}

                        <div className="field">
                            <button type="submit" disabled={isSubmitting}
                                    className={classnames("button", "is-link", "is-fullwidth", {'is-loading': isSubmitting})}>
                                {t('Login')}
                            </button>
                        </div>
                    </Form>
                }
            </Formik>
        </div>
    )
}
