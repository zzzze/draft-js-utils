/* @flow */
const {describe, it} = global;
import expect from 'expect';
import getEntityRanges, {EMPTY_SET} from '../getEntityRanges';
import {List} from 'immutable';

import type {CharacterMetaList} from '../getEntityRanges';

describe('getEntityRanges', () => {
  it('should accept empty input', () => {
    let emptyCharMeta: CharacterMetaList = List();
    let emptyStylePiece = ['', EMPTY_SET];
    let emptyEntityPiece = [null, [emptyStylePiece]];
    expect(getEntityRanges('', emptyCharMeta)).toEqual(
      [emptyEntityPiece]
    );
  });
});
