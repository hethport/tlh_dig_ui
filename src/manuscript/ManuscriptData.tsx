import React from 'react';
import {ManuscriptIdentifierFragment} from "../generated/graphql";
import {authenticationService} from "../_services/authentication.service";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {IProps} from "./ManuscriptHelpers";

function renderOtherIdentifiersBlock(otherIdentifiers: ManuscriptIdentifierFragment[], noFoundMessage: string): JSX.Element {
    if (otherIdentifiers.length > 0) {
        return <>
            {otherIdentifiers.map((otherIdentifier) =>
                <span>{otherIdentifier}</span>
            )}
        </>
    } else {
        return <div className="notification is-info has-text-centered">{noFoundMessage}.</div>;
    }
}

function renderPicturesBlock(pictures: string[], noPicsFoundMessage: string): JSX.Element {
    if (pictures.length > 0) {
        return (
            <div className="content">
                <ul>{pictures.map((pictureUrl) => <li key={pictureUrl}>{pictureUrl}</li>)}</ul>
            </div>
        );
    } else {
        return <div className="notification is-info has-text-centered">{noPicsFoundMessage}.</div>;
    }
}


export function ManuscriptData({manuscript}: IProps): JSX.Element {

    const {t} = useTranslation('common');

    const createdByUser: boolean = !!(authenticationService.currentUserValue) &&
        authenticationService.currentUserValue.username === manuscript.creatorUsername;

    return <>
        <h1 className="title is-3 has-text-centered">
            {t('Manuskript {{which}}', {which: manuscript.mainIdentifier.identifier})}
        </h1>

        <section>
            <h2 className="subtitle is-4">{t('Weitere Identifikatoren')}</h2>

            {renderOtherIdentifiersBlock(manuscript.otherIdentifiers, t('Keine weiteren Identfikatoren gefunden'))}

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
        </section>

        <hr/>

        <section>
            <h2 className="subtitle is-4">{t('Bilder')}</h2>

            {renderPicturesBlock(manuscript.pictureUrls, t('Noch keine Bilder hochgeladen'))}

            {createdByUser && <Link className="button is-link is-fullwidth"
                                    to={`./${manuscript.mainIdentifier.identifier}/uploadPictures`}>
                {t('Bilder hochladen')}
            </Link>}
        </section>

        <hr/>

        <section>
            <h2 className="subtitle is-4">{t('Transliteration')}</h2>

            {createdByUser && <Link className="button is-link is-fullwidth"
                                    to={`./${manuscript.mainIdentifier.identifier}/transliterationInput`}>
                {t('Transliteration erstellen')}
            </Link>}
        </section>
    </>
}
