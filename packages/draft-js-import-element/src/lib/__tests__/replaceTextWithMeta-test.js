/* @flow */
const {describe, it} = global;
import expect from 'expect';
import replaceTextWithMeta from '../replaceTextWithMeta';
import {Seq} from 'immutable';

describe('replaceTextWithMeta', () => {
  let none = 'NONE';
  let bold = 'BOLD';

  it('should handle empty source', () => {
    let result = replaceTextWithMeta(
      {text: '', characterMeta: Seq.of()},
      'a',
      'b',
    );
    expect(result.text).toBe('');
    expect(result.characterMeta.toArray()).toEqual([]);
  });

  it('should handle not found', () => {
    let result = replaceTextWithMeta(
      {text: 'abc', characterMeta: Seq.of(bold, bold, bold)},
      'd',
      'e',
    );
    expect(result.text).toBe('abc');
    expect(result.characterMeta.toArray()).toEqual([bold, bold, bold]);
  });

  it('should handle one occurance', () => {
    let result = replaceTextWithMeta(
      {text: 'abc', characterMeta: Seq.of(none, bold, none)},
      'b',
      'xx',
    );
    expect(result.text).toBe('axxc');
    expect(result.characterMeta.toArray()).toEqual([none, bold, bold, none]);
  });

  it('should handle multiple occurances', () => {
    let result = replaceTextWithMeta(
      {text: 'abcba', characterMeta: Seq.of(none, bold, none, none, none)},
      'b',
      'xx',
    );
    expect(result.text).toBe('axxcxxa');
    expect(result.characterMeta.toArray()).toEqual([none, bold, bold, none, none, none, none]);
  });

});
