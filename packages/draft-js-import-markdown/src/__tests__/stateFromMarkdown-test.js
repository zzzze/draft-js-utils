// @flow
const {describe, it} = global;
import expect from 'expect';
import stateFromMarkdown from '../stateFromMarkdown';
import {convertToRaw} from 'draft-js';

describe('stateFromMarkdown', () => {
  let markdown = 'Hello World';
  it('should create content state', () => {
    let contentState = stateFromMarkdown(markdown);
    let rawContentState = convertToRaw(contentState);
    let blocks = removeKeys(rawContentState.blocks);
    expect(blocks).toEqual([
      {
        text: 'Hello World',
        type: 'unstyled',
        data: {},
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
      },
    ]);
  });
  it('should correctly move code blocks', () => {
    let codeMarkdown = "```\nconst a = 'b'\n```";
    let contentState = stateFromMarkdown(codeMarkdown);
    let rawContentState = convertToRaw(contentState);
    let blocks = removeKeys(rawContentState.blocks);
    expect(blocks).toEqual([
      {
        text: "const a = 'b'",
        type: 'code-block',
        data: {},
        depth: 0,
        inlineStyleRanges: [
          {
            length: 13,
            offset: 0,
            style: 'CODE',
          },
        ],
        entityRanges: [],
      },
    ]);
  });
});

function removeKeys(blocks) {
  return blocks.map((block) => {
    // eslint-disable-next-line no-unused-vars
    let {key, ...other} = block;
    return other;
  });
}
