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

      <div className="columns">
        <div className="column">
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
        </div>

        <div className="column">
          <h2 className="subtitle is-4">{t('Weitere Identifikatoren')}</h2>

          {manuscript.otherIdentifiers.length > 0
            ? manuscript.otherIdentifiers.map((otherIdentifier) => <span>{otherIdentifier}</span>)
            : <div className="notification is-info has-text-centered">
              {t('Keine weiteren Identfikatoren gefunden')}.
            </div>}

          {createdByUser &&
          <button className="button is-static is-fullwidth" type="button" title="Not yet implemented...">
            {t('Weiteren Identifikator erstellen')}
          </button>}
        </div>
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
