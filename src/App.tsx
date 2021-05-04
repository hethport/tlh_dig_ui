import React, {Dispatch} from 'react';
import {Link, Route, Switch, useHistory} from 'react-router-dom';
import {createManuscriptUrl, editDocumentUrl, homeUrl, loginUrl, registerUrl} from './urls';
import {Home} from './Home';
import {RegisterForm} from './forms/RegisterForm';
import {LoginForm} from './forms/LoginForm';
import {useTranslation} from "react-i18next";
import i18next from "i18next";
import {CreateManuscriptForm} from "./CreateManuscriptForm";
import {NotFound} from './NotFound';
import {DocumentEditorContainer} from './editor/DocumentEditor';
import {useDispatch, useSelector} from "react-redux";
import {activeUserSelector} from "./store/store";
import {StoreAction, userLoggedOutAction} from "./store/actions";
import {ManuscriptBase} from "./manuscript/ManuscriptBase";

// TODO: solve languages different?
const languages: string[] = ["de", "en"];

export function App(): JSX.Element {

  const {t} = useTranslation('common');
  const history = useHistory();
  const dispatch = useDispatch<Dispatch<StoreAction>>();
  const user = useSelector(activeUserSelector);

  function logout() {
    dispatch(userLoggedOutAction());
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
            {user && <Link className="navbar-item" to={createManuscriptUrl}>{t('createManuscript')}</Link>}
            <Link className="navbar-item" to={editDocumentUrl}>{t('editDocument')}</Link>
          </div>

          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
              <div className="navbar-link">{t('language')}</div>
              <div className="navbar-dropdown">
                {languages.map((lang) =>
                  <div className="navbar-item" key={lang} onClick={() => i18next.changeLanguage(lang)}>{lang}</div>
                )}
              </div>
            </div>
            <div className="navbar-item">
              {user
                ? <div className="buttons">
                  <button className="button is-light" onClick={logout}>{t('logout')} {user.name}</button>
                </div>
                : <div className="buttons">
                  <Link className="button is-light" to={registerUrl}>{t('register')}</Link>
                  <Link className="button is-light" to={loginUrl}>{t('login')}</Link>
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
        <Route path={'/manuscripts/:mainIdentifier'} component={ManuscriptBase}/>
        <Route path={editDocumentUrl} component={DocumentEditorContainer}/>
        <Route component={NotFound}/>
      </Switch>
    </>
  );
}
