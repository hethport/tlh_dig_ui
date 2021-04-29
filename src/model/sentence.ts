import {XmlFormat} from "../editor/xmlLib";
import {AOManuscripts, aoManuscriptsFormat} from "./sentenceContent/aoManuscripts";
import {AOGap, aoGapFormat} from "./sentenceContent/gap";
import {AOLineBreak, aoLineBreakFormat} from "./sentenceContent/linebreak";
import {AOWord, aoWordFormat} from "./sentenceContent/word";
import {failure, flattenResults, transformResultContent} from '../functional/result';

export interface AOSentence {
  type: 'AOSentence';
  content: AOSentenceContent[];
}

export const aoSentenceFormat: XmlFormat<AOSentence> = {
  read: (el) => transformResultContent(
    flattenResults<AOSentenceContent, string[]>(
      Array.from(el.children).map((cel) => {
        switch (cel.tagName) {
          case 'AO:Manuscripts' :
            return aoManuscriptsFormat.read(cel);
          case 'gap':
            return aoGapFormat.read(cel);
          case 'lb':
            return aoLineBreakFormat.read(cel);
          case 'w':
            return aoWordFormat.read(cel);
          default:
            return failure([`Found illegal tag name ${cel.tagName}`]);
        }
      })
    ),
    (content) => aoSentence(content),
    (errs) => errs.flat()
  ),
  write: ({content}) => []
}

function aoSentence(content: AOSentenceContent[]): AOSentence {
  return {type: 'AOSentence', content};
}

export type AOSentenceContent = AOManuscripts | AOGap | AOLineBreak | AOWord;
