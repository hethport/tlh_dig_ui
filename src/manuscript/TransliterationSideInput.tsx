import React, {ChangeEvent, createRef, useState} from "react";
import {
  allManuscriptLanguages,
  getNameForManuscriptSide,
  manuscriptColumnModifiers,
  manuscriptColumns,
  manuscriptSides
} from "../manuscriptSide";
import {ManuscriptColumn, ManuscriptColumnModifier, ManuscriptLanguage, ManuscriptSide} from "../generated/graphql";
import {useTranslation} from "react-i18next";
import {parseTransliterationLine, TransliterationLineParseResult} from "../transliterationParser/parser";
import {TransliterationSideParseResult} from "../model/transliterationSideParseResult";
import {Field, Form, Formik, FormikValues} from "formik";
import {BulmaSelect} from "../forms/BulmaFields";

interface IProps {
  onTransliterationUpdate: (t: TransliterationSideParseResult) => void;
}

interface IState {
  manuscriptSide?: ManuscriptSide;
  manuscriptColumn?: ManuscriptColumn;
  manuscriptColumnModifier?: ManuscriptColumnModifier;
  manuscriptDefaultLanguage?: ManuscriptLanguage;
}

export function TransliterationSideInput({onTransliterationUpdate}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({});
  const textAreaRef = createRef<HTMLTextAreaElement>();
  const formRef = createRef<FormikValues>();

  const initialValues: IState = {};

  function updateManuscriptSide(event: ChangeEvent<HTMLSelectElement>): void {
    const manuscriptSide = manuscriptSides[event.target.selectedIndex];

    setState((state) => {
      return {...state, manuscriptSide};
    });
  }

  function updateManuscriptColumn(event: ChangeEvent<HTMLSelectElement>): void {
    const manuscriptColumn = manuscriptColumns[event.target.selectedIndex];

    setState((state) => {
      return {...state, manuscriptColumn};
    })
  }

  function updateManuscriptColumnModifier(event: ChangeEvent<HTMLSelectElement>): void {
    const manuscriptColumnModifier = manuscriptColumnModifiers[event.target.selectedIndex];

    setState((state) => {
      return {...state, manuscriptColumnModifier};
    })
  }

  function updateDefaultLanguage(event: ChangeEvent<HTMLSelectElement>): void {
    const manuscriptDefaultLanguage = allManuscriptLanguages[event.target.selectedIndex];

    setState((state) => {
      return {...state, manuscriptDefaultLanguage};
    })
  }

  function updateTransliteration(): void {
    if (state.manuscriptSide && state.manuscriptDefaultLanguage) {
      const lineResults: TransliterationLineParseResult[] = textAreaRef.current
        ? textAreaRef.current.value
          .split('\n')
          .map<TransliterationLineParseResult>((line, lineIndex) => {
            return {...parseTransliterationLine(line), lineIndex};
          })
        : [];

      const transliterationSideParseResults: TransliterationSideParseResult = {
        manuscriptSide: state.manuscriptSide,
        manuscriptDefaultLanguage: state.manuscriptDefaultLanguage,
        lineResults,
        ...state
      };

      onTransliterationUpdate(transliterationSideParseResults);
    }
  }

  return (
    <Formik initialValues={initialValues} onSubmit={updateTransliteration} forwardRef={formRef}>
      {() =>

        <Form>
          <div className="field">
            <div className="field-body">
              <Field as="select" name="manuscriptSide" label={t('manuscriptSide')} component={BulmaSelect}>
                {manuscriptSides.map((ms) => <option key={ms}>{getNameForManuscriptSide(ms, t)}</option>)}
              </Field>

              <Field name="manuscriptColumn" label={t('manuscriptColumn')} component={BulmaSelect}>
                {manuscriptColumns.map((mc) => <option key={mc}>{mc}</option>)}
              </Field>

              <Field name="manuscriptColumnModifier" label={t('manuscriptColumnModifier')} component={BulmaSelect}>
                {manuscriptColumnModifiers.map((mcm) => <option key={mcm}>{mcm}</option>)}
              </Field>

              <Field name="manuscriptDefaultLanguage" label={t('defaultLanguage')} component={BulmaSelect}>
                {allManuscriptLanguages.map((l) => <option key={l}>{l}</option>)}
              </Field>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <textarea className="textarea" id="transliteration" placeholder={t('transliteration')} rows={20}
                        onChange={() => {
                         const x: FormikValues = formRef.current!;
                        }} ref={textAreaRef}/>
            </div>
          </div>
        </Form>
      }
    </Formik>
  );
}