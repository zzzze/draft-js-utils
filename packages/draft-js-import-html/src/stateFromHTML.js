// @flow

import {stateFromElement} from 'draft-js-import-element';
import parseHTML from './parseHTML';

import type {ContentState} from 'draft-js';
import type {ElementStyles, CustomBlockFn} from 'draft-js-import-element';

type Options = {
  parser?: (html: string) => Element;
  elementStyles?: ElementStyles;
  blockTypes?: {[key: string]: string};
  customBlockFn?: CustomBlockFn;
};

export default function stateFromHTML(html: string, options?: Options): ContentState {
  let {parser, ...otherOptions} = options || {};
  if (parser == null) {
    parser = parseHTML;
  }
  let element = parser(html);
  return stateFromElement(element, otherOptions);
}
