# nearest-colors

Find the nearest x number of colors given a predefined list of colors. This has been built using the code from [dtao/nearest-color](https://github.com/dtao/nearest-color). 
Key differences in this package as apposed to nearest-color are:
* Supporting types using Typescript.
* Additional exported functions such as 'rgbaToHex'.
* Allows arrays of custom color objects as the predefined list of colors.
* Returns an array of nearest colors if more than 1 is requested.

## Usage

```javascript
const CUSTOM_COLORS = [{
  "appletonColourCode": "Bright Yellow 3/4",
  "naturalDye": "Weld",
  "mordent": "Alum",
  "Yarn": "White wool",
  "colourProduced": "Strong",
  "hexCode": "#F7EB34",
},
{
  "appletonColourCode": "Heraldic Gold 4",
  "naturalDye": "Weld",
  "mordent": "Alum",
  "Yarn": "White wool",
  "colourProduced": "Dark",
  "hexCode": "#D1BD3D",
}];

import { nearestFrom } from "nearest-colors";

const nearestColor = nearestFrom(CUSTOM_COLORS, "appletonColourCode", "hexCode");

nearestColor('#ff1'); // => { name: 'Bright Yellow 3/4', value: '#F7EB34', rgb: { r: 247, g: 235, b: 52 }, distance: 41.09744517606904 }
```

## How it works

Finding the nearest color is a specific case of the "nearest neighbor search" (or NNS) problem. The predefined colors can be thought of as points in 3D space where the X, Y, and Z axes represent each color's red, green, and blue (RGB) values. So finding the nearest color to any given value amounts to finding the closet neighbor to the point where that color would reside when plotted in such a 3D space.

From [the Wikipedia article on the subject](http://en.wikipedia.org/wiki/Nearest_neighbor_search):

> The simplest solution to the NNS problem is to compute the distance from the query point 
> to every other point in the database, keeping track of the "best so far". This algorithm, 
> sometimes referred to as the naive approach, has a running time of *O(Nd)* where *N* is 
> the cardinality of *S* and *d* is the dimensionality of *M*. There are no search data 
> structures to maintain, so linear search has no space complexity beyond the storage of the 
> database. Naive search can, on average, outperform space partitioning approaches on higher 
> dimensional spaces.

This library uses the naive approach, which is hard to beat. Performance should be totally fine unless there are **many** pre-defined colors to search (and even then, it will probably only matter if you're calling `nearestColor` a ton of times).

The most realistic optimization that could be made here would probably be to cache results so that multiple calls for the same color can return immediately.
