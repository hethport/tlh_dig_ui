import React, {Dispatch} from 'react';
import {LoginMutationVariables, useLoginMutation} from "../generated/graphql";
import {useTranslation} from "react-i18next";
import {Form, Formik} from 'formik';
import {BulmaFieldWithLabel} from "./BulmaFields";
import {loginSchema} from './schemas';
import classnames from "classnames";
import {homeUrl} from "../urls";
import {Redirect} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {StoreAction, userLoggedInAction} from "../store/actions";
import {activeUserSelector} from "../store/store";

export function LoginForm() {

    const {t} = useTranslation('common');
    const [login, {data}] = useLoginMutation();
    const dispatch = useDispatch<Dispatch<StoreAction>>();

    const activeUser = useSelector(activeUserSelector);
    if (activeUser) {
        return <Redirect to={homeUrl}/>;
    }

    const initialValues: LoginMutationVariables = {
        username: '',
        password: ''
    }

    function handleSubmit(values: LoginMutationVariables, setSubmitting: (isSubmitting: boolean) => void): void {
        login({variables: values})
            .then(({data}) => {
                if (data && data.login) {
                    dispatch(userLoggedInAction(data.login));
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
