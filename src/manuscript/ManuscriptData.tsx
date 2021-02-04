import React from 'react';
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {IProps} from "./ManuscriptHelpers";
import {LoggedInUserFragment} from "../generated/graphql";
import {useSelector} from "react-redux";
import {activeUserSelector} from "../store/store";
import {Transliteration} from "./Transliteration";

export function ManuscriptData({manuscript}: IProps): JSX.Element {

    const {t} = useTranslation('common');

    const activeUser: LoggedInUserFragment | undefined = useSelector(activeUserSelector);

    const createdByUser: boolean = !!activeUser && activeUser.username === manuscript.creatorUsername;

    function renderOtherIdentifiers(): JSX.Element {
        if (manuscript.otherIdentifiers.length === 0) {
            return <span className="is-italic">{t('Keine weiteren Identfikatoren gefunden')}.</span>;
        } else {
            return <div className="content">
                <ul>
                    {manuscript.otherIdentifiers.map(({identifier, type}) =>
                        <li key={identifier}>{identifier} ({type})</li>
                    )}
                </ul>
            </div>
        }
    }

    return (
        <div className="container">
            <h2 className="subtitle is-3 has-text-centered">{t('Allgemeine Daten')}</h2>

            <div className="my-3">
                <h2 className="subtitle is-4">{t('Daten')}</h2>

                <table className="table is-fullwidth">
                    <tbody>
                        <tr>
                            <th>{t('Weitere Identifikatoren')}</th>
                            <td>{renderOtherIdentifiers()}</td>
                        </tr>
                        <tr>
                            <th>{t('Bilder')}</th>
                            <td>
                                {manuscript.pictureUrls.length === 0
                                    ? <span className="is-italic">{t('Es wurden noch keine Bilder hochgeladen')}.</span>
                                    : <div className="content">
                                        <ul>
                                            {manuscript.pictureUrls.map((pu) => <li key={pu}>{pu}</li>)}
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

            <div className="my-3">
                <h2 className="subtitle is-4">{t('Transliteration')}</h2>

                {manuscript.transliterationResult && <Transliteration lines={manuscript.transliterationResult}/>}

                {createdByUser && <Link className="button is-link is-fullwidth" to={'./transliterationInput'}>
                    {t('Transliteration erstellen')}
                </Link>}
            </div>
        </div>
    );
}
