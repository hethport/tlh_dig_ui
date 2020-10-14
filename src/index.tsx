import React from 'react';
import {render} from 'react-dom';
import './index.sass';
import {App} from './App';
import {BrowserRouter as Router} from "react-router-dom";
import * as serviceWorker from './serviceWorker';

import i18n from "i18next";
import {I18nextProvider, initReactI18next} from "react-i18next";

import common_de from './locales/de/common.json';
import common_en from './locales/en/common.json';

import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {serverUrl} from "./urls";

// noinspection JSIgnoredPromiseFromCall
i18n
    .use(initReactI18next)
    .init({
        resources: {
            de: {common: common_de},
            en: {common: common_en}
        },
        lng: 'de',
        fallbackLng: 'de',
        interpolation: {
            escapeValue: false
        }
    });

const apolloClient = new ApolloClient({
    // TODO: remove serverUrl!
    uri: `${serverUrl}/graphql.php`,
    cache: new InMemoryCache()
});

render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <ApolloProvider client={apolloClient}>
                <Router>
                    <App/>
                </Router>
            </ApolloProvider>
        </I18nextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
