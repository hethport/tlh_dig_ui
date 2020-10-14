import React from 'react';
import {useTranslation} from "react-i18next";
import {IProps} from "./ManuscriptHelpers";

export function TransliterationInput({manuscript}: IProps): JSX.Element {

    const {t} = useTranslation('common');

    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">
                {t('Manuskript {{mainIdentifier}}', {mainIdentifier: manuscript.mainIdentifier.identifier})}: {t('Eingabe der Transliteration')}
            </h1>
            TODO!
        </div>
    );
}
