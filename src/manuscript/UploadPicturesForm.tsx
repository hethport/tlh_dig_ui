import React, {createRef, useState} from 'react';
import {useTranslation} from "react-i18next";
import {manuscriptPictureUrl, serverUrl} from "../urls";
import {IProps} from "./ManuscriptHelpers";


interface IState {
  selectedFile: File | null;
  allPictures: string[];
}

interface FileUploadSuccess {
  fileName: string;
}

interface FileUploadFailure {
  error: string;
}

type UploadResponse = FileUploadSuccess | FileUploadFailure;


function renderPicturesBlock(pictures: string[], completePictureUrl: (picName: string) => string): JSX.Element {
  return (
    <div className="columns">
      {pictures.map((pictureUrl) =>
        <div key={pictureUrl} className="column is-one-quarter">
          <div className="card">
            <div className="card-image">
              <figure className="image">
                <img src={completePictureUrl(pictureUrl)} alt={pictureUrl}/>
              </figure>
            </div>
            <div className="card-content">{pictureUrl}</div>
          </div>
        </div>
      )}
    </div>
  );
}


export function UploadPicturesForm({manuscript}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const uploadUrl = `${serverUrl}/uploadPicture.php?id=${manuscript.mainIdentifier.identifier}`;

  const [state, setState] = useState<IState>({
    selectedFile: null,
    allPictures: [...manuscript.pictureUrls]
  });

  const fileUploadRef = createRef<HTMLInputElement>();

  function selectFile(fileList: FileList | null): void {
    if (fileList && fileList.length > 0) {
      setState((currentState) => {
        return {selectedFile: fileList[0], allPictures: currentState.allPictures};
      });
    }
  }

  function performUpload(): void {
    if (state.selectedFile) {
      const file = state.selectedFile;

      const formData = new FormData();
      formData.append('file', file, file.name);

      fetch(uploadUrl, {body: formData, method: 'POST'})
        .then<UploadResponse>((response) => response.json())
        .then((response) => {
          if ('fileName' in response) {
            setState((currentState) => {
              return {
                selectedFile: null,
                allPictures: currentState.allPictures.concat([response.fileName])
              };
            });
          } else {
            console.error(response.error);
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert('No file selected!');
    }
  }


  function pictureUrl(pictureName: string): string {
    return manuscriptPictureUrl.buildAbsoluteUrl({
      mainIdentifier: manuscript.mainIdentifier.identifier,
      pictureUrl: pictureName
    }, true);
  }

  return <div className="container">
    <h2 className="subtitle is-3 has-text-centered">{t('Bilder')}</h2>

    <div className="my-3">
      {manuscript.pictureUrls.length > 0
        ? renderPicturesBlock(state.allPictures, pictureUrl)
        : <div className="notification is-info has-text-centered">{t('Noch keine Bilder hochgeladen')}.</div>
      }
    </div>

    <div className="field has-addons">
      <div className="control is-expanded">
        <input type="file" className="input" onChange={(event) => selectFile(event.target.files)} ref={fileUploadRef}/>
      </div>
      <div className="control">
        <button className="button is-link" onClick={performUpload}>{t('Hochladen')}</button>
      </div>
    </div>

  </div>;
}
