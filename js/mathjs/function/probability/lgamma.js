/* eslint-disable no-loss-of-precision */
// References
// ----------
// [1] Hare, "Computing the Principal Branch of log-Gamma", Journal of Algorithms, 1997.
// [2] https://math.stackexchange.com/questions/1338753/how-do-i-calculate-values-for-gamma-function-with-complex-arguments
import { lgammaNumber, lnSqrt2PI } from '../../plain/number/index.js';
import { factory } from '../../utils/factory.js';
import { copysign } from '../../utils/number.js';
var name = 'lgamma';
var dependencies = ['Complex', 'typed'];
export var createLgamma = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    Complex: _Complex,
    typed
  } = _ref;
  // Stirling series is non-convergent, we need to use the recurrence `lgamma(z) = lgamma(z+1) - log z` to get
  // sufficient accuracy.
  //
  // These two values are copied from Scipy implementation:
  // https://github.com/scipy/scipy/blob/v1.8.0/scipy/special/_loggamma.pxd#L37
  var SMALL_RE = 7;
  var SMALL_IM = 7;
  /**
   * The coefficients are B[2*n]/(2*n*(2*n - 1)) where B[2*n] is the (2*n)th Bernoulli number. See (1.1) in [1].
   *
   * If you cannot access the paper, can also get these values from the formula in [2].
   *
   *    1 /     12 = 0.00833333333333333333333333333333
   *    1 /    360 = 0.00277777777777777777777777777778
   * ...
   * 3617 / 133400 = 0.02955065359477124183006535947712
   */

  var coeffs = [-2.955065359477124183e-2, 6.4102564102564102564e-3, -1.9175269175269175269e-3, 8.4175084175084175084e-4, -5.952380952380952381e-4, 7.9365079365079365079e-4, -2.7777777777777777778e-3, 8.3333333333333333333e-2];
  /**
   * Logarithm of the gamma function for real, positive numbers and complex numbers,
   * using Lanczos approximation for numbers and Stirling series for complex numbers.
   *
   * Syntax:
   *
   *    math.lgamma(n)
   *
   * Examples:
   *
   *    math.lgamma(5)       // returns 3.178053830347945
   *    math.lgamma(0)       // returns Infinity
   *    math.lgamma(-0.5)    // returns NaN
   *    math.lgamma(math.i)  // returns -0.6509231993018536 - 1.8724366472624294i
   *
   * See also:
   *
   *    gamma
   *
   * @param {number | Complex} n   A real or complex number
   * @return {number | Complex}    The log gamma of `n`
   */

  return typed(name, {
    number: lgammaNumber,
    Complex: function Complex(n) {
      var TWOPI = 6.2831853071795864769252842; // 2*pi

      var LOGPI = 1.1447298858494001741434262; // log(pi)

      var REFLECTION = 0.1;

      if (n.isNaN()) {
        return new _Complex(NaN, NaN);
      } else if (n.im === 0) {
        return new _Complex(lgammaNumber(n.re), 0);
      } else if (n.re >= SMALL_RE || Math.abs(n.im) >= SMALL_IM) {
        return lgammaStirling(n);
      } else if (n.re <= REFLECTION) {
        // Reflection formula. see Proposition 3.1 in [1]
        var tmp = copysign(TWOPI, n.im) * Math.floor(0.5 * n.re + 0.25); // TODO: `complex.js sin` doesn't have extremely high precision, so this value `a` may lose a little precision,
        // causing the computation results to be less accurate than the lgamma of real numbers

        var a = n.mul(Math.PI).sin().log();
        var b = this(new _Complex(1 - n.re, -n.im));
        return new _Complex(LOGPI, tmp).sub(a).sub(b);
      } else if (n.im >= 0) {
        return lgammaRecurrence(n);
      } else {
        return lgammaRecurrence(n.conjugate()).conjugate();
      }
    },
    BigNumber: function BigNumber() {
      throw new Error("mathjs doesn't yet provide an implementation of the algorithm lgamma for BigNumber");
    }
  });

  function lgammaStirling(z) {
    // formula ref in [2]
    // computation ref:
    // https://github.com/scipy/scipy/blob/v1.8.0/scipy/special/_loggamma.pxd#L101
    // left part
    // x (log(x) - 1) + 1/2 (log(2PI) - log(x))
    // => (x - 0.5) * log(x) - x + log(2PI) / 2
    var leftPart = z.sub(0.5).mul(z.log()).sub(z).add(lnSqrt2PI); // right part

    var rz = new _Complex(1, 0).div(z);
    var rzz = rz.div(z);
    var a = coeffs[0];
    var b = coeffs[1];
    var r = 2 * rzz.re;
    var s = rzz.re * rzz.re + rzz.im * rzz.im;

    for (var i = 2; i < 8; i++) {
      var tmp = b;
      b = -s * a + coeffs[i];
      a = r * a + tmp;
    }

    var rightPart = rz.mul(rzz.mul(a).add(b)); // plus left and right

    return leftPart.add(rightPart);
  }

  function lgammaRecurrence(z) {
    // computation ref:
    // https://github.com/scipy/scipy/blob/v1.8.0/scipy/special/_loggamma.pxd#L78
    var signflips = 0;
    var sb = 0;
    var shiftprod = z;
    z = z.add(1);

    while (z.re <= SMALL_RE) {
      shiftprod = shiftprod.mul(z);
      var nsb = shiftprod.im < 0 ? 1 : 0;
      if (nsb !== 0 && sb === 0) signflips++;
      sb = nsb;
      z = z.add(1);
    }

    return lgammaStirling(z).sub(shiftprod.log()).sub(new _Complex(0, signflips * 2 * Math.PI * 1));
  }
});