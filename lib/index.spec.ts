import { rgbaToHex } from './index';
import { expect } from 'chai';
import 'mocha';

describe('rgbaToHex function', () => {

  it('rgbaToHex(rgba"(1,1,1,1)") should return "#111', () => {
    const result = rgbaToHex("rgba(1,1,1,1)");
    expect(result).to.equal('#111');
  });

});