import React from 'react';
import {useManuscriptQuery} from "./generated/graphql";
import {useTranslation} from "react-i18next";
import classNames from 'classnames';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';
import {homeUrl, ManuscriptUrlParams} from "./urls";
import {ManuscriptData} from "./manuscript/ManuscriptData";
import {UploadPicturesForm} from "./manuscript/UploadPicturesForm";
import {TransliterationInput} from "./manuscript/TransliterationInput";

export function Manuscript(): JSX.Element {

  const match = useRouteMatch<ManuscriptUrlParams>();

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
    return <Switch>
      <Route exact path={`${match.url}`}>
        <ManuscriptData manuscript={data.manuscript}/>
      </Route>
      <Route path={`${match.url}/uploadPictures`}>
        <UploadPicturesForm manuscript={data.manuscript}/>
      </Route>
      <Route path={`${match.url}/transliterationInput`}>
        <TransliterationInput manuscript={data.manuscript}/>
      </Route>
    </Switch>;
  }
}
