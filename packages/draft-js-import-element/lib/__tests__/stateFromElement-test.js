"use strict";

var _stateFromElement = _interopRequireDefault(require("../stateFromElement"));

var _syntheticDom = require("synthetic-dom");

var _draftJs = require("draft-js");

var _fs = _interopRequireDefault(require("fs"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _global = global,
    describe = _global.describe,
    it = _global.it,
    expect = _global.expect;
// This separates the test cases in `data/test-cases.txt`.
var SEP = '\n\n#';

var testCasesRaw = _fs["default"].readFileSync((0, _path.join)(__dirname, '..', '..', 'test', 'test-cases.txt'), 'utf8');

var testCases = testCasesRaw.slice(1).trim().split(SEP).map(function (text) {
  var lines = text.split('\n');
  var description = lines.shift().trim();
  var state = removeBlockKeys(JSON.parse(lines[0]));
  var html = lines.slice(1).join('\n');
  return {
    description: description,
    state: state,
    html: html
  };
});
describe('stateFromElement', function () {
  it('should create content state', function () {
    var textNode = new _syntheticDom.TextNode('Hello World');
    var element = new _syntheticDom.ElementNode('div', [], [textNode]);
    var contentState = (0, _stateFromElement["default"])(element);
    var rawContentState = removeBlockKeys((0, _draftJs.convertToRaw)(contentState));
    expect(rawContentState).toEqual({
      entityMap: {},
      blocks: [{
        text: 'Hello World',
        type: 'unstyled',
        data: {},
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: []
      }]
    });
  });
  it('should support option customBlockFn (type)', function () {
    var textNode = new _syntheticDom.TextNode('Hello World');
    var element = new _syntheticDom.ElementNode('center', [], [textNode]);
    var options = {
      customBlockFn: function customBlockFn(element) {
        var tagName = element.tagName;

        if (tagName === 'CENTER') {
          return {
            type: 'center-align'
          };
        }
      }
    };
    var contentState = (0, _stateFromElement["default"])(element, options);
    var rawContentState = removeBlockKeys((0, _draftJs.convertToRaw)(contentState));
    expect(rawContentState).toEqual({
      entityMap: {},
      blocks: [{
        text: 'Hello World',
        type: 'center-align',
        data: {},
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: []
      }]
    });
  });
  it('should support option customBlockFn (data)', function () {
    var textNode = new _syntheticDom.TextNode('Hello World');
    var element = new _syntheticDom.ElementNode('p', [{
      name: 'align',
      value: 'right'
    }], [textNode]);
    var options = {
      customBlockFn: function customBlockFn(element) {
        var tagName = element.tagName;

        if (tagName === 'P' && element.getAttribute('align') === 'right') {
          return {
            data: {
              textAlign: 'right'
            }
          };
        }
      }
    };
    var contentState = (0, _stateFromElement["default"])(element, options);
    var rawContentState = removeBlockKeys((0, _draftJs.convertToRaw)(contentState));
    expect(rawContentState).toEqual({
      entityMap: {},
      blocks: [{
        text: 'Hello World',
        type: 'unstyled',
        data: {
          textAlign: 'right'
        },
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: []
      }]
    });
  });
  it('should support option customInlineFn', function () {
    var element = new _syntheticDom.ElementNode('div', [], [new _syntheticDom.ElementNode('span', [{
      name: 'class',
      value: 'bold'
    }], [new _syntheticDom.TextNode('Hello')]), new _syntheticDom.ElementNode('span', [{
      name: 'class',
      value: 'link'
    }], [new _syntheticDom.TextNode('World')])]);
    var options = {
      customInlineFn: function customInlineFn(el, _ref) {
        var Style = _ref.Style,
            Entity = _ref.Entity;

        if (el.tagName === 'SPAN' && el.className === 'bold') {
          return Style('BOLD');
        }

        if (el.tagName === 'SPAN' && el.className === 'link') {
          return Entity('LINK', {
            url: '/abc'
          });
        }
      }
    };
    var contentState = (0, _stateFromElement["default"])(element, options);
    var rawContentState = removeBlockKeys((0, _draftJs.convertToRaw)(contentState));
    expect(rawContentState).toEqual({
      entityMap: _defineProperty({}, 0, {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          url: '/abc'
        }
      }),
      blocks: [{
        text: 'HelloWorld',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [{
          offset: 0,
          length: 5,
          style: 'BOLD'
        }],
        entityRanges: [{
          offset: 5,
          length: 5,
          key: 0
        }],
        data: {}
      }]
    });
  });
  it('should return multiple style from customInlineFn', function () {
    var element = new _syntheticDom.ElementNode('div', [], [new _syntheticDom.ElementNode('span', [{
      style: 'font-family',
      value: 'sans-serif'
    }, {
      style: 'font-size',
      value: '12px'
    }], [new _syntheticDom.TextNode('Hello')])]);
    var options = {
      customInlineFn: function customInlineFn(el, _ref2) {
        var Style = _ref2.Style;

        if (el.tagName === 'SPAN') {
          return Style(['CUSTOM_STYLE_1', 'CUSTOM_STYLE_2']);
        }
      }
    };
    var contentState = (0, _stateFromElement["default"])(element, options);
    var rawContentState = removeBlockKeys((0, _draftJs.convertToRaw)(contentState));
    expect(rawContentState).toEqual({
      entityMap: {},
      blocks: [{
        text: 'Hello',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [{
          offset: 0,
          length: 5,
          style: 'CUSTOM_STYLE_1'
        }, {
          offset: 0,
          length: 5,
          style: 'CUSTOM_STYLE_2'
        }],
        entityRanges: [],
        data: {}
      }]
    });
  });
  it('should support option elementStyles', function () {
    var textNode = new _syntheticDom.TextNode('Superscript');
    var element = new _syntheticDom.ElementNode('sup', [], [textNode]);
    var wrapperElement = new _syntheticDom.ElementNode('div', [], [element]);
    var options = {
      elementStyles: {
        sup: 'SUPERSCRIPT'
      }
    };
    var contentState = (0, _stateFromElement["default"])(wrapperElement, options);
    var rawContentState = removeBlockKeys((0, _draftJs.convertToRaw)(contentState));
    expect(rawContentState).toEqual({
      entityMap: {},
      blocks: [{
        text: 'Superscript',
        type: 'unstyled',
        data: {},
        depth: 0,
        inlineStyleRanges: [{
          offset: 0,
          length: 11,
          style: 'SUPERSCRIPT'
        }],
        entityRanges: []
      }]
    });
  });
  it('should support images', function () {
    var imageNode = new _syntheticDom.ElementNode('img', [{
      name: 'src',
      value: 'imgur.com/asdf.jpg'
    }]);
    var wrapperElement = new _syntheticDom.ElementNode('div', [], [imageNode]);
    var contentState = (0, _stateFromElement["default"])(wrapperElement);
    var rawContentState = removeBlockKeys((0, _draftJs.convertToRaw)(contentState));
    expect(rawContentState).toEqual({
      blocks: [{
        data: {},
        depth: 0,
        entityRanges: [{
          key: 0,
          length: 1,
          offset: 0
        }],
        inlineStyleRanges: [],
        text: ' ',
        type: 'unstyled'
      }],
      entityMap: {
        // This is necessary due to flow not supporting non-string literal property keys
        // eslint-disable-next-line quote-props
        '0': {
          data: {
            src: 'imgur.com/asdf.jpg'
          },
          mutability: 'MUTABLE',
          type: 'IMAGE'
        }
      }
    });
  });
});
describe('stateFromHTML', function () {
  testCases.forEach(function (testCase) {
    var description = testCase.description,
        state = testCase.state,
        html = testCase.html;
    it("should render ".concat(description), function () {
      var element = parseHTML(html);
      var actualState = removeBlockKeys((0, _draftJs.convertToRaw)((0, _stateFromElement["default"])(element)));
      expect(actualState).toEqual(state);
    });
  });
});

function parseHTML(html) {
  if (document.documentElement) {
    document.documentElement.innerHTML = html;
  } // This makes Flow happy


  return document.body || document.createElement('body');
}

function removeBlockKeys(content) {
  var newContent = _objectSpread({}, content);

  newContent.blocks = content.blocks.map(function (block) {
    var key = block.key,
        other = _objectWithoutProperties(block, ["key"]); // eslint-disable-line no-unused-vars


    return other;
  });
  return newContent;
}