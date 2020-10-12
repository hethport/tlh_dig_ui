import React from 'react';
import {useTranslation} from "react-i18next";
import {useIndexQuery} from './generated/graphql';

export function Home() {
    const {t} = useTranslation('common');
    const {loading, error, data} = useIndexQuery();

    if (loading) {
        return (
            <div className="container">
                <div className="notification is-primary has-text-centered">{t('Lade Daten')}...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="notification is-warning has-text-centered">{error}</div>
            </div>
        );
    }

    return (
        <div className="container">
            {data!.allManuscripts.map((d) => {
                return <div key={d.mainIdentifier.identifier}>{d.mainIdentifier.identifier}</div>;
            })}
        </div>
    );

}
