import React from 'react';
import {useManuscriptQuery} from "./generated/graphql";
import {useTranslation} from "react-i18next";
import classnames from 'classnames';
import {useParams} from 'react-router-dom';
import {ManuscriptUrlParams} from "./urls";
import {authenticationService} from "./_services/authentication.service";

export function Manuscript(): JSX.Element {

    const {mainIdentifier} = useParams<ManuscriptUrlParams>();
    const {t} = useTranslation('common');
    const {loading, error, data} = useManuscriptQuery({variables: {mainIdentifier}});

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
                {t('Konnte Manuskript mit ID {{mainIdentifier}} nicht finden', {mainIdentifier})}!
            </div>
        );
    } else {
        const createdByUser: boolean = !!(authenticationService.currentUserValue) &&
            authenticationService.currentUserValue.username === data.manuscript.creatorUsername;

        let otherIdentifiersBlock: JSX.Element;
        if (data.manuscript.otherIdentifiers.length > 0) {
            otherIdentifiersBlock = <>
                {data.manuscript.otherIdentifiers.map((otherIdentifier) =>
                    <span>{otherIdentifier}</span>
                )}
            </>
        } else {
            otherIdentifiersBlock = <div className="notification is-info has-text-centered">
                {t('Keine weiteren Identfikatoren gefunden')}.
            </div>
        }

        let picturesBlock: JSX.Element;
        if (data.manuscript.pictureUrls.length > 0) {
            picturesBlock = <>
                {data.manuscript.pictureUrls.map((pictureUrl) =>
                    <span>{pictureUrl}</span>
                )}
            </>
        } else {
            picturesBlock = <div className="notification is-info has-text-centered">
                {t('Bisher wurden keine Bilder hochgeladen')}.
            </div>
        }

        content = <>
            <h1 className="title is-3 has-text-centered">
                {t('Manuskript {{which}}', {which: data.manuscript.mainIdentifier.identifier})}
            </h1>

            <section>
                <h2 className="subtitle is-4">{t('Weitere Identifikatoren')}</h2>

                {otherIdentifiersBlock}

                {createdByUser && <button className="button is-static is-fullwidth" type="button">
                    {t('Weiteren Identifikator erstellen')}
                </button>}
            </section>

            <hr/>

            <section>
                <h2 className="subtitle is-4">{t('Daten')}</h2>

                <table className="table is-fullwidth">
                    <tbody>
                        <tr>
                            <th>{t('Paläographische Klassifikation')}</th>
                            <td>{data.manuscript.palaeographicClassification}{data.manuscript.palaeographicClassificationSure ? '' : '?'}</td>
                        </tr>
                        <tr>
                            <th>{t('Vorschlag CTH-Klassifikation')}</th>
                            <td>{data.manuscript.cthClassification || '--'}</td>
                        </tr>
                        <tr>
                            <th>{t('Provenienz')}</th>
                            <td>{data.manuscript.provenance || '--'}</td>
                        </tr>
                        <tr>
                            <th>{t('Bibliographie')}</th>
                            <td>{data.manuscript.bibliography || '--'}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <hr/>

            <section>
                <h2 className="subtitle is-4">{t('Bilder')}</h2>

                {picturesBlock}

                {createdByUser && <button className="button is-static is-fullwidth" type="button">
                    {t('Bilder hochladen')}
                </button>}
            </section>
        </>
    }

    return (
        <div className="container">{content}</div>
    );
}
