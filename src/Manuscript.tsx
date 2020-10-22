import React from 'react';
import {ManuscriptMetaDataFragment, useManuscriptQuery} from "./generated/graphql";
import {useTranslation} from "react-i18next";
import classNames from 'classnames';
import {Link, Redirect, Route, Switch, useLocation, useRouteMatch} from 'react-router-dom';
import {homeUrl, ManuscriptUrlParams} from "./urls";
import {ManuscriptData} from "./manuscript/ManuscriptData";
import {UploadPicturesForm} from "./manuscript/UploadPicturesForm";
import {TransliterationInput} from "./manuscript/TransliterationInput";

export function Manuscript(): JSX.Element {

  const match = useRouteMatch<ManuscriptUrlParams>();
  const completeUrl = useLocation().pathname;

  if (completeUrl.indexOf(match.url) !== 0) {
    // TODO: this should never happen!
    throw new Error('TODO!')
  }

  const child = completeUrl.slice(match.url.length);

  const {t} = useTranslation('common');
  const {loading, error, data} = useManuscriptQuery({variables: {mainIdentifier: match.params.mainIdentifier}});

  if (!data) {
    // Loading or error
    const classes = classNames("notification", "has-text-centered", {'is-info': loading, 'is-warning': error});

    return <div className="container">
      <div className={classes}>
        {loading && <span>{t('Lade Daten')}...</span>}
        {error && <span>{error}</span>}
      </div>
    </div>;
  } else if (!data.manuscript) {
    // No manuscript found -> redirect to index page
    return <Redirect to={homeUrl}/>
  } else {
    const header = t('Manuskript {{which}}', {which: data.manuscript.mainIdentifier.identifier});

    const childRoutes: [string, string, (m: ManuscriptMetaDataFragment) => JSX.Element][] = [
      ['/data', t('Daten'), (m) => <ManuscriptData manuscript={m}/>],
      ['/uploadPictures', t('Bilder'), (m) => <UploadPicturesForm manuscript={m}/>],
      ['/transliterationInput', t('Transliteration eingeben'), (m) => <TransliterationInput manuscript={m}/>]
    ];

    const fragment: ManuscriptMetaDataFragment = data.manuscript;

    return <>
      <div className="container">
        <div className="tabs is-centered mb-3">
          <ul>
            {childRoutes.map(([childRoute, name, _]) => {
              const isActive = child === childRoute;

              return <li key={childRoute} className={classNames({'is-active': isActive})}>
                <Link to={`${match.url}${childRoute}`}>{isActive ? (header + ': ') : ''}{name}</Link>
              </li>;
            })}
          </ul>
        </div>
      </div>

      <Switch>
        {childRoutes.map(([childRoute, _, renderFunc]) =>
          <Route key={childRoute} path={`${match.url}${childRoute}`}>
            {renderFunc(fragment)}
          </Route>
        )}
      </Switch>
    </>;
  }
}
