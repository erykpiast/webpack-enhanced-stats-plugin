const cutOutInlinedModules = require('../cut-out-inlined-modules');

describe('cut out inlined modules', () => {
  it('should return module without inlined in source and add entries to parsed modules map', () => {
    const inlinedModules = [{
      identifier: 'at',
      source: '**@',
      ranges: {
        0: [{
          startIndex: 1,
          endIndex: 3,
        }, {
          startIndex: 4,
          endIndex: 5,
        }],
      },
    }, {
      identifier: 'and',
      source: '&++',
      ranges: {
        1: [{
          startIndex: 1,
          endIndex: 2,
        }, {
          startIndex: 3,
          endIndex: 5,
        }],
      },
    }];
    const parsedModules = new Map([
      ['what', { size: 13, source: 'what the hell' }],
    ]);
    const moduleSourceLines = [
      'f**o@o',
      'b&a++r',
    ];
    const moduleSource = 'f**o@o\nb&a++r';

    const withoutInlinedModules = cutOutInlinedModules({
      inlinedModules,
      parsedModules,
      moduleSourceLines,
      moduleSource,
    });

    expect(withoutInlinedModules).toEqual({
      size: 7,
      source: 'foo\nbar',
    });
    expect(Array.from(parsedModules.entries())).toEqual([
      ['what', { size: 13, source: 'what the hell' }],
      ['at', { source: '**@', size: 3 }],
      ['and', { source: '&++', size: 3 }],
    ]);
  });
});
