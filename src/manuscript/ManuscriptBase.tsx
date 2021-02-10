import React from "react";
import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import {ManuscriptData} from "./ManuscriptData";
import {ManuscriptMetaDataFragment, useManuscriptQuery} from "../generated/graphql";
import {WithQuery} from "../WithQuery";
import {homeUrl} from "../urls";
import {UploadPicturesForm} from "./UploadPicturesForm";
import {TransliterationInput} from "./TransliterationInput";
import {NotFound} from "../NotFound";

export const manuscriptBaseUrl = '/manuscripts/:mainIdentifier';

export interface ManuscriptBaseUrlParams {
  mainIdentifier: string;
}

export interface ManuscriptBaseIProps {
  manuscript: ManuscriptMetaDataFragment;
}

export const uploadPicturesUrl = 'uploadPictures';
export const createTransliterationUrl = 'createTransliteration';

// URL: /manuscripts/:mainIdentifier
export function ManuscriptBase(): JSX.Element {

  const {url, params} = useRouteMatch<ManuscriptBaseUrlParams>();

  const mainIdentifier = decodeURIComponent(params.mainIdentifier);

  const manuscriptQuery = useManuscriptQuery({variables: {mainIdentifier}});

  return <WithQuery query={manuscriptQuery}>
    {({manuscript}) => {
      return manuscript
        ? <Switch>
          <Route path={`${url}/data`} render={() => <ManuscriptData manuscript={manuscript}/>}/>
          <Route path={`${url}/${uploadPicturesUrl}`} render={() => <UploadPicturesForm manuscript={manuscript}/>}/>
          <Route path={`${url}/${createTransliterationUrl}`}
                 render={() => <TransliterationInput manuscript={manuscript}/>}/>
          <Route component={NotFound}/>
        </Switch>
        : <Redirect to={homeUrl}/>
    }
    }
  </WithQuery>;
}