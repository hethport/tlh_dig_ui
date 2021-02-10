import React from 'react';
import {useTranslation} from "react-i18next";
import {useIndexQuery} from './generated/graphql';
import {Link} from 'react-router-dom';
import {WithQuery} from "./WithQuery";

export function Home(): JSX.Element {

    const {t} = useTranslation('common');
    const indexQuery = useIndexQuery({fetchPolicy: 'no-cache'});

    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">{t('manuskript_plural')}</h1>

            <WithQuery query={indexQuery}>
                {(data) =>
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>{t('mainIdentifier')}</th>
                                <th>{t('status')}</th>
                                <th>{t('creator')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.allManuscripts.map((d) =>
                                <tr key={d.mainIdentifier.identifier}>
                                    <td>
                                        <Link
                                            to={`manuscripts/${encodeURIComponent(d.mainIdentifier.identifier)}/data`}>
                                            {d.mainIdentifier.identifier} ({d.mainIdentifier.type})
                                        </Link>
                                    </td>
                                    <td>{d.status}</td>
                                    <td>{d.creatorUsername}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                }
            </WithQuery>

        </div>
    );
}
