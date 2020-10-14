import React from 'react';
import {useTranslation} from "react-i18next";
import {useIndexQuery} from './generated/graphql';
import classnames from 'classnames';
import {manuscriptUrl} from './urls';
import {Link} from 'react-router-dom';

export function Home() {
    const {t} = useTranslation('common');
    const {loading, error, data} = useIndexQuery();

    let content: JSX.Element;

    if (!data) {
        const notificationClassNames = classnames("notification", "has-text-centered", {
            'is-primary': loading,
            'is-warning': error
        });

        content = (
            <div className={notificationClassNames}>
                {loading && <span>{t('Lade Daten')}...</span>}
                {error && <span>{error}</span>}
            </div>
        );
    } else {
        content = (
            <table className="table is-fullwidth">
                <thead>
                    <tr>
                        <th>{t('Hauptidentifikator')}</th>
                        <th>{t('Status')}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.allManuscripts.map((d) =>
                        <tr key={d.mainIdentifier.identifier}>
                            <td>
                                <Link to={manuscriptUrl(d.mainIdentifier.identifier)}>
                                    {d.mainIdentifier.identifier} ({d.mainIdentifier.type})
                                </Link>
                            </td>
                            <td>{d.status}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">{t('Manuskripte')}</h1>
            {content}
        </div>
    );
}
