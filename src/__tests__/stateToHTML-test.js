/* @flow */
const {describe, it} = global;
import expect from 'expect';
import {convertFromRaw} from 'draft-js';
import stateToHTML from '../stateToHTML';
import fs from 'fs';
import {join} from 'path';

// This separates the test cases in `data/test-cases.txt`.
const SEP = '\n\n#';

let testCasesRaw = fs.readFileSync(
  join(__dirname, '..', '..', 'test', 'test-cases.txt'),
  'utf8',
);

// These test cases specify custom options also.
let testCasesCustomRaw = fs.readFileSync(
  join(__dirname, '..', '..', 'test', 'test-cases-custom.txt'),
  'utf8',
);

let testCases = testCasesRaw.slice(1).trim().split(SEP).map((text) => {
  let lines = text.split('\n');
  let description = lines.shift().trim();
  let state = JSON.parse(lines.shift());
  let html = lines.join('\n');
  return {description, state, html};
});

let testCasesCustom = testCasesCustomRaw.slice(1).trim().split(SEP).map((text) => {
  let lines = text.split('\n');
  let description = lines.shift().trim();
  let options = JSON.parse(lines.shift());
  let state = JSON.parse(lines.shift());
  let html = lines.join('\n');
  return {description, options, state, html};
});

describe('stateToHTML', () => {
  testCases.forEach((testCase) => {
    let {description, state, html} = testCase;
    it(`should render ${description}`, () => {
      let contentState = convertFromRaw(state);
      expect(stateToHTML(contentState)).toBe(html);
    });
  });

  testCasesCustom.forEach((testCase) => {
    let {description, options, state, html} = testCase;
    it(`should render ${description}`, () => {
      let contentState = convertFromRaw(state);
      expect(stateToHTML(contentState, options)).toBe(html);
    });
  });
});
