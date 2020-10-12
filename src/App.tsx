import React from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import {createManuscriptUrl, homeUrl, loginUrl, registerUrl} from './urls';
import {Home} from './Home';
import {RegisterForm} from './RegisterForm';
import {useTranslation} from "react-i18next";
import i18next from "i18next";

interface User {
    name: string;
}

export function App() {

    const {t} = useTranslation('common');

    const user: User | undefined = {name: 'user1'};
    const languages: string[] = ["de", "en"];

    function logout(): void {
        console.error('TODO: logout!');
    }

    let loginOutFunctions;

    if (user) {
        loginOutFunctions =
            <div className="buttons">
                <button onClick={logout} className="button is-light">{t('Logout')}<code> {user.name}</code></button>
            </div>;
    } else {
        loginOutFunctions =
            <div className="buttons">
                <Link className="button is-light" to={registerUrl}>{t('Registrieren')}</Link>
                <Link className="button is-light" to={loginUrl}>{t('Login')}</Link>
            </div>;
    }

    return (
        <>
            <nav className="navbar is-dark">
                <div className="navbar-brand">
                    <Link className="navbar-item" to={homeUrl}>TLH<sup>dig</sup></Link>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-start">
                        {user &&
                        <Link className="navbar-item" to={createManuscriptUrl}>{t('Manuskript erstellen')}</Link>}
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item has-dropdown is-hoverable">
                            <div className="navbar-link">{t('Sprache')}</div>
                            <div className="navbar-dropdown">
                                {languages.map((lang) =>
                                    <a className="navbar-item" key={lang} href=""
                                       onClick={() => i18next.changeLanguage(lang)}>{lang}</a>
                                )}
                            </div>
                        </div>
                        <div className="navbar-item">{loginOutFunctions}</div>
                    </div>
                </div>
            </nav>
            <Switch>
                <Route path={homeUrl} exact component={Home}/>
                <Route path={registerUrl} component={RegisterForm}/>
            </Switch>
        </>
    );
}
