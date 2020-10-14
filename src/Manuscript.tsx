import React from 'react';
import {useManuscriptQuery} from "./generated/graphql";
import {useTranslation} from "react-i18next";
import classnames from 'classnames';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {ManuscriptUrlParams} from "./urls";
import {ManuscriptData} from "./manuscript/ManuscriptData";
import {UploadPicturesForm} from "./manuscript/UploadPicturesForm";
import {TransliterationInput} from "./manuscript/TransliterationInput";

export function Manuscript(): JSX.Element {

    const match = useRouteMatch<ManuscriptUrlParams>();

    const {t} = useTranslation('common');
    const {loading, error, data} = useManuscriptQuery({variables: {mainIdentifier: match.params.mainIdentifier}});

    let content: JSX.Element;

    if (!data) {
        const classes = classnames("notification", "has-text-centered", {'is-info': loading, 'is-warning': error});

        content = (
            <div className={classes}>
                {loading && <span>{t('Lade Daten')}...</span>}
                {error && <span>{error}</span>}
            </div>
        );
    } else if (!data.manuscript) {
        content = (
            <div className="notification is-danger has-text-centered">
                {t('Konnte Manuskript mit ID {{mainIdentifier}} nicht finden', {mainIdentifier: match.params.mainIdentifier})}!
            </div>
        );
    } else {
        const manuscript = data.manuscript;

        content = <div className="container">
            <Switch>
                <Route exact path={`${match.url}`}>
                    <ManuscriptData manuscript={manuscript}/>
                </Route>
                <Route path={`${match.url}/uploadPictures`}>
                    <UploadPicturesForm manuscript={manuscript}/>
                </Route>
                <Route path={`${match.url}/transliterationInput`}>
                    <TransliterationInput manuscript={manuscript}/>
                </Route>
            </Switch>
        </div>
    }

    return (
        <div className="container">{content}</div>
    );
}
