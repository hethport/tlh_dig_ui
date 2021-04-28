import React from "react";
import {AOWord} from "../../model/sentenceContent/word";

interface IProps {
  word: AOWord;
}

export function WordRender({word}: IProps): JSX.Element {
  return <div>{JSON.stringify(word)}</div>;
}