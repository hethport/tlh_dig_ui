import React, {useEffect, useState} from 'react';
import {Link, Route, Switch, useHistory} from 'react-router-dom';
import {createManuscriptUrl, editXmlUrl, homeUrl, loginUrl, manuscriptBaseUrl, registerUrl} from './urls';
import {Home} from './Home';
import {RegisterForm} from './forms/RegisterForm';
import {LoginForm} from './forms/LoginForm';
import {useTranslation} from "react-i18next";
import i18next from "i18next";
import {LoggedInUserFragment} from "./generated/graphql";
import {authenticationService} from "./_services/authentication.service";
import {CreateManuscriptForm} from "./forms/CreateManuscriptForm";
import {Manuscript} from "./Manuscript";
import {XmlEditor} from './xmlEditor/XmlEditor';
import {NotFound} from './NotFound';

interface State {
  currentUser: LoggedInUserFragment | null;
}

export function App() {

  const [state, setState] = useState<State>({currentUser: null})
  const {t} = useTranslation('common');
  const history = useHistory();

  useEffect(() => {
    authenticationService.currentUser
      .subscribe((currentUser) => setState({currentUser}))
  }, []);

  const user: LoggedInUserFragment | null = state.currentUser;

  const languages: string[] = ["de", "en"];

  function logout() {
    authenticationService.logout();
    history.push(loginUrl);
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
        <Route path={createManuscriptUrl} component={CreateManuscriptForm}/>
        <Route path={manuscriptBaseUrl.buildAbsolutePattern()} component={Manuscript}/>
        <Route path={editXmlUrl} component={XmlEditor}/>
        <Route path="/" component={NotFound}/>
      </Switch>
    </>
  );
}
