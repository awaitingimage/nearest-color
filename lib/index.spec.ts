import { rgbaToHex, nearestFrom } from './index';
import { expect } from 'chai';
import 'mocha';

const STANDARD_COLORS = {
  aqua: "#0ff",
  black: "#000",
  blue: "#00f",
  fuchsia: "#f0f",
  gray: "#808080",
  green: "#008000",
  lime: "#0f0",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  orange: "#ffa500",
  purple: "#800080",
  red: "#f00",
  silver: "#c0c0c0",
  teal: "#008080",
  white: "#fff",
  yellow: "#ff0",
};

const CUSTOM_COLORS = [{
  "appletonColourCode": "Bright Yellow 3/4",
  "naturalDye": "Weld",
  "mordent": "Alum",
  "Yarn": "White wool",
  "colourProduced": "Strong",
  "regiaCode": "R001",
  "colourSection": "Yellow",
  "hexCode": "#F7EB34",
  "rank": "low"
},
{
  "appletonColourCode": "Heraldic Gold 4",
  "naturalDye": "Weld",
  "mordent": "Alum",
  "Yarn": "White wool",
  "colourProduced": "Dark",
  "regiaCode": "R002",
  "colourSection": "Yellow",
  "hexCode": "#D1BD3D",
  "rank": "middle"
},
{
  "appletonColourCode": "Honeysuckle Yellow 2",
  "naturalDye": "Bearberry leaves",
  "mordent": "Iron, oak galls",
  "Yarn": "White wool",
  "colourProduced": "Apricot beige",
  "regiaCode": "R003",
  "colourSection": "Yellow",
  "hexCode": "#D1C189",
  "rank": "middle"
}];

describe('rgbaToHex function', () => {

  it('rgbaToHex(rgba"(1,1,1,1)") should return "#111', () => {
    const result = rgbaToHex("rgba(1,1,1,1)");
    expect(result).to.equal('#111');
  });

});

describe('nearestFrom function', () => {

  it('expect #ff1 to be nearest to yellow in standard colours', () => {
    const nearestColor = nearestFrom(STANDARD_COLORS);
    const result = nearestColor("#ff1");
    if (result && typeof result == "object")
      expect(result.name).to.equal("yellow");
  });

  it('expect #ff1 to be nearest to Bright Yellow 3/4 in custom colours', () => {
    const expectedResult = { 
      name: 'Bright Yellow 3/4',
      value: '#F7EB34',
      rgb: { r: 247, g: 235, b: 52 },
      distance: 41.09744517606904 };
    const nearestColor = nearestFrom(CUSTOM_COLORS, "appletonColourCode", "hexCode");
    const result = nearestColor("#ff1");
    expect(result).to.deep.equal(expectedResult);
  });

});