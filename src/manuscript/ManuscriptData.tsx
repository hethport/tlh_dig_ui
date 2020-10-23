import React from 'react';
import {authenticationService} from "../_services/authentication.service";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {IProps} from "./ManuscriptHelpers";
import {manuscriptTransliterationInputUrl} from "../urls";

export function ManuscriptData({manuscript}: IProps): JSX.Element {

    const {t} = useTranslation('common');

    const createdByUser: boolean = !!(authenticationService.currentUserValue) &&
        authenticationService.currentUserValue.username === manuscript.creatorUsername;

    const transliterationInputUrl = manuscriptTransliterationInputUrl.buildAbsoluteUrl({mainIdentifier: manuscript.mainIdentifier.identifier});

    return (
        <div className="container">
            <h2 className="subtitle is-3 has-text-centered">{t('Allgemeine Daten')}</h2>

            <div>
                <h2 className="subtitle is-4">{t('Daten')}</h2>

                <table className="table is-fullwidth">
                    <tbody>
                        <tr>
                            <th>Weitere Identifikatoren</th>
                            <td>
                                {manuscript.otherIdentifiers.length === 0
                                    ? <span className="is-italic">{t('Keine weiteren Identfikatoren gefunden')}.</span>
                                    : <div className="content">
                                        <ul>
                                            {manuscript.otherIdentifiers.map((oi) => <li>{oi}</li>)}
                                        </ul>
                                    </div>}
                            </td>
                        </tr>
                        <tr>
                            <th>Bilder</th>
                            <td>
                                {manuscript.pictureUrls.length === 0
                                    ? <span className="is-italic">{t('Es wurden noch keine Bilder hochgeladen')}.</span>
                                    : <div className="content">
                                        <ul>
                                            {manuscript.pictureUrls.map((pu) => <li>{pu}</li>)}
                                        </ul>
                                    </div>}
                            </td>
                        </tr>
                        <tr>
                            <th>{t('Paläographische Klassifikation')}</th>
                            <td>{manuscript.palaeographicClassification}{manuscript.palaeographicClassificationSure ? '' : '?'}</td>
                        </tr>
                        <tr>
                            <th>{t('Vorschlag CTH-Klassifikation')}</th>
                            <td>{manuscript.cthClassification || '--'}</td>
                        </tr>
                        <tr>
                            <th>{t('Provenienz')}</th>
                            <td>{manuscript.provenance || '--'}</td>
                        </tr>
                        <tr>
                            <th>{t('Bibliographie')}</th>
                            <td>{manuscript.bibliography || '--'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <section>
                <h2 className="subtitle is-4">{t('Transliteration')}</h2>

                {createdByUser && <Link className="button is-link is-fullwidth" to={transliterationInputUrl}>
                    {t('Transliteration erstellen')}
                </Link>}
            </section>
        </div>
    );
}
