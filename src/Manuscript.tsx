import React from 'react';
import {ManuscriptMetaDataFragment, useManuscriptQuery} from "./generated/graphql";
import {useTranslation} from "react-i18next";
import classNames from 'classnames';
import {Link, Redirect, Route, Switch, useLocation, useRouteMatch} from 'react-router-dom';
import {homeUrl, ManuscriptUrlParams} from "./urls";
import {ManuscriptData} from "./manuscript/ManuscriptData";
import {UploadPicturesForm} from "./manuscript/UploadPicturesForm";
import {TransliterationInput} from "./manuscript/TransliterationInput";
import {useSelector} from "react-redux";
import {activeUserSelector} from "./store/store";

interface SubRouteConfig {
    childRoute: string;
    name: string;
    hide?: boolean;
    renderFunc: (m: ManuscriptMetaDataFragment) => JSX.Element;
}

export function Manuscript(): JSX.Element {

    const {t} = useTranslation('common');
    const match = useRouteMatch<ManuscriptUrlParams>();
    const child = useLocation().pathname.slice(match.url.length);
    const currentUser = useSelector(activeUserSelector);

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

        const fragment: ManuscriptMetaDataFragment = data.manuscript;

        const childRoutes: SubRouteConfig[] = [
            {childRoute: '/data', name: t('Daten'), renderFunc: m => <ManuscriptData manuscript={m}/>},
            {childRoute: '/uploadPictures', name: t('Bilder'), renderFunc: m => <UploadPicturesForm manuscript={m}/>},
            {
                childRoute: '/transliterationInput',
                name: t('Transliteration eingeben'),
                hide: !currentUser || currentUser.username !== fragment.creatorUsername,
                renderFunc: m => <TransliterationInput manuscript={m}/>
            }
        ];

        return <>
            <div className="container">
                <div className="tabs is-centered mb-3">
                    <ul>
                        {childRoutes
                            .filter((cr) => !cr.hide)
                            .map(({childRoute, name}) => {
                                const isActive = child === childRoute;

                                return <li key={childRoute} className={classNames({'is-active': isActive})}>
                                    <Link
                                        to={`${match.url}${childRoute}`}>{isActive ? (header + ': ') : ''}{name}</Link>
                                </li>;
                            })}
                    </ul>
                </div>
            </div>

            <Switch>
                {childRoutes
                    .filter((cr) => !cr.hide)
                    .map(({childRoute, renderFunc}) =>
                        <Route key={childRoute} path={`${match.url}${childRoute}`}>
                            {renderFunc(fragment)}
                        </Route>
                    )}
            </Switch>
        </>;
    }
}
