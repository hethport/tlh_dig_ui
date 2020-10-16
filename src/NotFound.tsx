import React from 'react';
import {useRouteMatch} from 'react-router-dom';
import {useTranslation} from "react-i18next";

export function NotFound(): JSX.Element {
  const routeMatch = useRouteMatch();
  const {t} = useTranslation('common');

  return <div className="container">
    <div className="notification is-warning has-text-centered">
      {t('Die Url <code>{{url}}</code> konnte nicht gefunden werden', {url: routeMatch.url})}.
    </div>
  </div>

}