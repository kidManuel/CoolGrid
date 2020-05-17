export const pyth = (a, b) => Math.sqrt(Math.pow(a, 2), Math.pow(b, 2))
export const distance = (x1, y1, x2, y2) => pyth(x1 - x2, y1 - y2)


// Pretty much ripped straight from p5's math helper.
// https://github.com/processing/p5.js/blob/1.0.0/src/math/calculation.js

export const map = (n, start1, stop1, start2, stop2, withinBounds) => {
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return constrain(newval, start2, stop2);
    } else {
        return constrain(newval, stop2, start2);
    }
};

export const constrain = (n, low, high) => Math.max(Math.min(n, high), low);
