import React from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import {createManuscriptUrl, homeUrl, loginUrl, registerUrl} from './urls';
import {Home} from './Home';
import {RegisterForm} from './RegisterForm';
import {LoginForm} from './LoginForm';
import {useTranslation} from "react-i18next";
import i18next from "i18next";

interface User {
    name: string;
}

function getUser(): User | undefined {
    return undefined; //{name: 'user1'};
}

export function App() {

    const {t} = useTranslation('common');

    const user: User | undefined = getUser();

    const languages: string[] = ["de", "en"];

    function logout(): void {
        console.error('TODO: logout!');
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
                                    <div className="navbar-item" key={lang}
                                         onClick={() => i18next.changeLanguage(lang)}>{lang}</div>
                                )}
                            </div>
                        </div>
                        <div className="navbar-item">
                            {user
                                ? <div className="buttons">
                                    <button className="button is-light"
                                            onClick={logout}>{t('Logout')}<code> {user.name}</code></button>
                                </div>
                                : <div className="buttons">
                                    <Link className="button is-light" to={registerUrl}>{t('Registrieren')}</Link>
                                    <Link className="button is-light" to={loginUrl}>{t('Login')}</Link>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </nav>
            <Switch>
                <Route path={homeUrl} exact component={Home}/>
                <Route path={registerUrl} component={RegisterForm}/>
                <Route path={loginUrl} component={LoginForm}/>
            </Switch>
        </>
    );
}
