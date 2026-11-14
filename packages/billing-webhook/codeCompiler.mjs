import { createRequire } from 'module'; const require = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/jsqr@1.4.0/node_modules/jsqr/dist/jsQR.js
var require_jsQR = __commonJS({
  "node_modules/.pnpm/jsqr@1.4.0/node_modules/jsqr/dist/jsQR.js"(exports, module) {
    (function webpackUniversalModuleDefinition(root, factory) {
      if (typeof exports === "object" && typeof module === "object")
        module.exports = factory();
      else if (typeof define === "function" && define.amd)
        define([], factory);
      else if (typeof exports === "object")
        exports["jsQR"] = factory();
      else
        root["jsQR"] = factory();
    })(typeof self !== "undefined" ? self : exports, function() {
      return (
        /******/
        (function(modules) {
          var installedModules = {};
          function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
              return installedModules[moduleId].exports;
            }
            var module2 = installedModules[moduleId] = {
              /******/
              i: moduleId,
              /******/
              l: false,
              /******/
              exports: {}
              /******/
            };
            modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
            module2.l = true;
            return module2.exports;
          }
          __webpack_require__.m = modules;
          __webpack_require__.c = installedModules;
          __webpack_require__.d = function(exports2, name, getter) {
            if (!__webpack_require__.o(exports2, name)) {
              Object.defineProperty(exports2, name, {
                /******/
                configurable: false,
                /******/
                enumerable: true,
                /******/
                get: getter
                /******/
              });
            }
          };
          __webpack_require__.n = function(module2) {
            var getter = module2 && module2.__esModule ? (
              /******/
              function getDefault() {
                return module2["default"];
              }
            ) : (
              /******/
              function getModuleExports() {
                return module2;
              }
            );
            __webpack_require__.d(getter, "a", getter);
            return getter;
          };
          __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
          };
          __webpack_require__.p = "";
          return __webpack_require__(__webpack_require__.s = 3);
        })([
          /* 0 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitMatrix = (
              /** @class */
              (function() {
                function BitMatrix2(data, width) {
                  this.width = width;
                  this.height = data.length / width;
                  this.data = data;
                }
                BitMatrix2.createEmpty = function(width, height) {
                  return new BitMatrix2(new Uint8ClampedArray(width * height), width);
                };
                BitMatrix2.prototype.get = function(x, y) {
                  if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                    return false;
                  }
                  return !!this.data[y * this.width + x];
                };
                BitMatrix2.prototype.set = function(x, y, v) {
                  this.data[y * this.width + x] = v ? 1 : 0;
                };
                BitMatrix2.prototype.setRegion = function(left, top, width, height, v) {
                  for (var y = top; y < top + height; y++) {
                    for (var x = left; x < left + width; x++) {
                      this.set(x, y, !!v);
                    }
                  }
                };
                return BitMatrix2;
              })()
            );
            exports2.BitMatrix = BitMatrix;
          }),
          /* 1 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var GenericGFPoly_1 = __webpack_require__(2);
            function addOrSubtractGF(a, b) {
              return a ^ b;
            }
            exports2.addOrSubtractGF = addOrSubtractGF;
            var GenericGF = (
              /** @class */
              (function() {
                function GenericGF2(primitive, size, genBase) {
                  this.primitive = primitive;
                  this.size = size;
                  this.generatorBase = genBase;
                  this.expTable = new Array(this.size);
                  this.logTable = new Array(this.size);
                  var x = 1;
                  for (var i = 0; i < this.size; i++) {
                    this.expTable[i] = x;
                    x = x * 2;
                    if (x >= this.size) {
                      x = (x ^ this.primitive) & this.size - 1;
                    }
                  }
                  for (var i = 0; i < this.size - 1; i++) {
                    this.logTable[this.expTable[i]] = i;
                  }
                  this.zero = new GenericGFPoly_1.default(this, Uint8ClampedArray.from([0]));
                  this.one = new GenericGFPoly_1.default(this, Uint8ClampedArray.from([1]));
                }
                GenericGF2.prototype.multiply = function(a, b) {
                  if (a === 0 || b === 0) {
                    return 0;
                  }
                  return this.expTable[(this.logTable[a] + this.logTable[b]) % (this.size - 1)];
                };
                GenericGF2.prototype.inverse = function(a) {
                  if (a === 0) {
                    throw new Error("Can't invert 0");
                  }
                  return this.expTable[this.size - this.logTable[a] - 1];
                };
                GenericGF2.prototype.buildMonomial = function(degree, coefficient) {
                  if (degree < 0) {
                    throw new Error("Invalid monomial degree less than 0");
                  }
                  if (coefficient === 0) {
                    return this.zero;
                  }
                  var coefficients = new Uint8ClampedArray(degree + 1);
                  coefficients[0] = coefficient;
                  return new GenericGFPoly_1.default(this, coefficients);
                };
                GenericGF2.prototype.log = function(a) {
                  if (a === 0) {
                    throw new Error("Can't take log(0)");
                  }
                  return this.logTable[a];
                };
                GenericGF2.prototype.exp = function(a) {
                  return this.expTable[a];
                };
                return GenericGF2;
              })()
            );
            exports2.default = GenericGF;
          }),
          /* 2 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var GenericGF_1 = __webpack_require__(1);
            var GenericGFPoly = (
              /** @class */
              (function() {
                function GenericGFPoly2(field, coefficients) {
                  if (coefficients.length === 0) {
                    throw new Error("No coefficients.");
                  }
                  this.field = field;
                  var coefficientsLength = coefficients.length;
                  if (coefficientsLength > 1 && coefficients[0] === 0) {
                    var firstNonZero = 1;
                    while (firstNonZero < coefficientsLength && coefficients[firstNonZero] === 0) {
                      firstNonZero++;
                    }
                    if (firstNonZero === coefficientsLength) {
                      this.coefficients = field.zero.coefficients;
                    } else {
                      this.coefficients = new Uint8ClampedArray(coefficientsLength - firstNonZero);
                      for (var i = 0; i < this.coefficients.length; i++) {
                        this.coefficients[i] = coefficients[firstNonZero + i];
                      }
                    }
                  } else {
                    this.coefficients = coefficients;
                  }
                }
                GenericGFPoly2.prototype.degree = function() {
                  return this.coefficients.length - 1;
                };
                GenericGFPoly2.prototype.isZero = function() {
                  return this.coefficients[0] === 0;
                };
                GenericGFPoly2.prototype.getCoefficient = function(degree) {
                  return this.coefficients[this.coefficients.length - 1 - degree];
                };
                GenericGFPoly2.prototype.addOrSubtract = function(other) {
                  var _a;
                  if (this.isZero()) {
                    return other;
                  }
                  if (other.isZero()) {
                    return this;
                  }
                  var smallerCoefficients = this.coefficients;
                  var largerCoefficients = other.coefficients;
                  if (smallerCoefficients.length > largerCoefficients.length) {
                    _a = [largerCoefficients, smallerCoefficients], smallerCoefficients = _a[0], largerCoefficients = _a[1];
                  }
                  var sumDiff = new Uint8ClampedArray(largerCoefficients.length);
                  var lengthDiff = largerCoefficients.length - smallerCoefficients.length;
                  for (var i = 0; i < lengthDiff; i++) {
                    sumDiff[i] = largerCoefficients[i];
                  }
                  for (var i = lengthDiff; i < largerCoefficients.length; i++) {
                    sumDiff[i] = GenericGF_1.addOrSubtractGF(smallerCoefficients[i - lengthDiff], largerCoefficients[i]);
                  }
                  return new GenericGFPoly2(this.field, sumDiff);
                };
                GenericGFPoly2.prototype.multiply = function(scalar) {
                  if (scalar === 0) {
                    return this.field.zero;
                  }
                  if (scalar === 1) {
                    return this;
                  }
                  var size = this.coefficients.length;
                  var product = new Uint8ClampedArray(size);
                  for (var i = 0; i < size; i++) {
                    product[i] = this.field.multiply(this.coefficients[i], scalar);
                  }
                  return new GenericGFPoly2(this.field, product);
                };
                GenericGFPoly2.prototype.multiplyPoly = function(other) {
                  if (this.isZero() || other.isZero()) {
                    return this.field.zero;
                  }
                  var aCoefficients = this.coefficients;
                  var aLength = aCoefficients.length;
                  var bCoefficients = other.coefficients;
                  var bLength = bCoefficients.length;
                  var product = new Uint8ClampedArray(aLength + bLength - 1);
                  for (var i = 0; i < aLength; i++) {
                    var aCoeff = aCoefficients[i];
                    for (var j = 0; j < bLength; j++) {
                      product[i + j] = GenericGF_1.addOrSubtractGF(product[i + j], this.field.multiply(aCoeff, bCoefficients[j]));
                    }
                  }
                  return new GenericGFPoly2(this.field, product);
                };
                GenericGFPoly2.prototype.multiplyByMonomial = function(degree, coefficient) {
                  if (degree < 0) {
                    throw new Error("Invalid degree less than 0");
                  }
                  if (coefficient === 0) {
                    return this.field.zero;
                  }
                  var size = this.coefficients.length;
                  var product = new Uint8ClampedArray(size + degree);
                  for (var i = 0; i < size; i++) {
                    product[i] = this.field.multiply(this.coefficients[i], coefficient);
                  }
                  return new GenericGFPoly2(this.field, product);
                };
                GenericGFPoly2.prototype.evaluateAt = function(a) {
                  var result = 0;
                  if (a === 0) {
                    return this.getCoefficient(0);
                  }
                  var size = this.coefficients.length;
                  if (a === 1) {
                    this.coefficients.forEach(function(coefficient) {
                      result = GenericGF_1.addOrSubtractGF(result, coefficient);
                    });
                    return result;
                  }
                  result = this.coefficients[0];
                  for (var i = 1; i < size; i++) {
                    result = GenericGF_1.addOrSubtractGF(this.field.multiply(a, result), this.coefficients[i]);
                  }
                  return result;
                };
                return GenericGFPoly2;
              })()
            );
            exports2.default = GenericGFPoly;
          }),
          /* 3 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var binarizer_1 = __webpack_require__(4);
            var decoder_1 = __webpack_require__(5);
            var extractor_1 = __webpack_require__(11);
            var locator_1 = __webpack_require__(12);
            function scan(matrix) {
              var locations = locator_1.locate(matrix);
              if (!locations) {
                return null;
              }
              for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
                var location_1 = locations_1[_i];
                var extracted = extractor_1.extract(matrix, location_1);
                var decoded = decoder_1.decode(extracted.matrix);
                if (decoded) {
                  return {
                    binaryData: decoded.bytes,
                    data: decoded.text,
                    chunks: decoded.chunks,
                    version: decoded.version,
                    location: {
                      topRightCorner: extracted.mappingFunction(location_1.dimension, 0),
                      topLeftCorner: extracted.mappingFunction(0, 0),
                      bottomRightCorner: extracted.mappingFunction(location_1.dimension, location_1.dimension),
                      bottomLeftCorner: extracted.mappingFunction(0, location_1.dimension),
                      topRightFinderPattern: location_1.topRight,
                      topLeftFinderPattern: location_1.topLeft,
                      bottomLeftFinderPattern: location_1.bottomLeft,
                      bottomRightAlignmentPattern: location_1.alignmentPattern
                    }
                  };
                }
              }
              return null;
            }
            var defaultOptions = {
              inversionAttempts: "attemptBoth"
            };
            function jsQR3(data, width, height, providedOptions) {
              if (providedOptions === void 0) {
                providedOptions = {};
              }
              var options = defaultOptions;
              Object.keys(options || {}).forEach(function(opt) {
                options[opt] = providedOptions[opt] || options[opt];
              });
              var shouldInvert = options.inversionAttempts === "attemptBoth" || options.inversionAttempts === "invertFirst";
              var tryInvertedFirst = options.inversionAttempts === "onlyInvert" || options.inversionAttempts === "invertFirst";
              var _a = binarizer_1.binarize(data, width, height, shouldInvert), binarized = _a.binarized, inverted = _a.inverted;
              var result = scan(tryInvertedFirst ? inverted : binarized);
              if (!result && (options.inversionAttempts === "attemptBoth" || options.inversionAttempts === "invertFirst")) {
                result = scan(tryInvertedFirst ? binarized : inverted);
              }
              return result;
            }
            jsQR3.default = jsQR3;
            exports2.default = jsQR3;
          }),
          /* 4 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitMatrix_1 = __webpack_require__(0);
            var REGION_SIZE = 8;
            var MIN_DYNAMIC_RANGE = 24;
            function numBetween(value, min, max) {
              return value < min ? min : value > max ? max : value;
            }
            var Matrix = (
              /** @class */
              (function() {
                function Matrix2(width, height) {
                  this.width = width;
                  this.data = new Uint8ClampedArray(width * height);
                }
                Matrix2.prototype.get = function(x, y) {
                  return this.data[y * this.width + x];
                };
                Matrix2.prototype.set = function(x, y, value) {
                  this.data[y * this.width + x] = value;
                };
                return Matrix2;
              })()
            );
            function binarize(data, width, height, returnInverted) {
              if (data.length !== width * height * 4) {
                throw new Error("Malformed data passed to binarizer.");
              }
              var greyscalePixels = new Matrix(width, height);
              for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                  var r = data[(y * width + x) * 4 + 0];
                  var g = data[(y * width + x) * 4 + 1];
                  var b = data[(y * width + x) * 4 + 2];
                  greyscalePixels.set(x, y, 0.2126 * r + 0.7152 * g + 0.0722 * b);
                }
              }
              var horizontalRegionCount = Math.ceil(width / REGION_SIZE);
              var verticalRegionCount = Math.ceil(height / REGION_SIZE);
              var blackPoints = new Matrix(horizontalRegionCount, verticalRegionCount);
              for (var verticalRegion = 0; verticalRegion < verticalRegionCount; verticalRegion++) {
                for (var hortizontalRegion = 0; hortizontalRegion < horizontalRegionCount; hortizontalRegion++) {
                  var sum = 0;
                  var min = Infinity;
                  var max = 0;
                  for (var y = 0; y < REGION_SIZE; y++) {
                    for (var x = 0; x < REGION_SIZE; x++) {
                      var pixelLumosity = greyscalePixels.get(hortizontalRegion * REGION_SIZE + x, verticalRegion * REGION_SIZE + y);
                      sum += pixelLumosity;
                      min = Math.min(min, pixelLumosity);
                      max = Math.max(max, pixelLumosity);
                    }
                  }
                  var average = sum / Math.pow(REGION_SIZE, 2);
                  if (max - min <= MIN_DYNAMIC_RANGE) {
                    average = min / 2;
                    if (verticalRegion > 0 && hortizontalRegion > 0) {
                      var averageNeighborBlackPoint = (blackPoints.get(hortizontalRegion, verticalRegion - 1) + 2 * blackPoints.get(hortizontalRegion - 1, verticalRegion) + blackPoints.get(hortizontalRegion - 1, verticalRegion - 1)) / 4;
                      if (min < averageNeighborBlackPoint) {
                        average = averageNeighborBlackPoint;
                      }
                    }
                  }
                  blackPoints.set(hortizontalRegion, verticalRegion, average);
                }
              }
              var binarized = BitMatrix_1.BitMatrix.createEmpty(width, height);
              var inverted = null;
              if (returnInverted) {
                inverted = BitMatrix_1.BitMatrix.createEmpty(width, height);
              }
              for (var verticalRegion = 0; verticalRegion < verticalRegionCount; verticalRegion++) {
                for (var hortizontalRegion = 0; hortizontalRegion < horizontalRegionCount; hortizontalRegion++) {
                  var left = numBetween(hortizontalRegion, 2, horizontalRegionCount - 3);
                  var top_1 = numBetween(verticalRegion, 2, verticalRegionCount - 3);
                  var sum = 0;
                  for (var xRegion = -2; xRegion <= 2; xRegion++) {
                    for (var yRegion = -2; yRegion <= 2; yRegion++) {
                      sum += blackPoints.get(left + xRegion, top_1 + yRegion);
                    }
                  }
                  var threshold = sum / 25;
                  for (var xRegion = 0; xRegion < REGION_SIZE; xRegion++) {
                    for (var yRegion = 0; yRegion < REGION_SIZE; yRegion++) {
                      var x = hortizontalRegion * REGION_SIZE + xRegion;
                      var y = verticalRegion * REGION_SIZE + yRegion;
                      var lum = greyscalePixels.get(x, y);
                      binarized.set(x, y, lum <= threshold);
                      if (returnInverted) {
                        inverted.set(x, y, !(lum <= threshold));
                      }
                    }
                  }
                }
              }
              if (returnInverted) {
                return { binarized, inverted };
              }
              return { binarized };
            }
            exports2.binarize = binarize;
          }),
          /* 5 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitMatrix_1 = __webpack_require__(0);
            var decodeData_1 = __webpack_require__(6);
            var reedsolomon_1 = __webpack_require__(9);
            var version_1 = __webpack_require__(10);
            function numBitsDiffering(x, y) {
              var z = x ^ y;
              var bitCount = 0;
              while (z) {
                bitCount++;
                z &= z - 1;
              }
              return bitCount;
            }
            function pushBit(bit, byte) {
              return byte << 1 | bit;
            }
            var FORMAT_INFO_TABLE = [
              { bits: 21522, formatInfo: { errorCorrectionLevel: 1, dataMask: 0 } },
              { bits: 20773, formatInfo: { errorCorrectionLevel: 1, dataMask: 1 } },
              { bits: 24188, formatInfo: { errorCorrectionLevel: 1, dataMask: 2 } },
              { bits: 23371, formatInfo: { errorCorrectionLevel: 1, dataMask: 3 } },
              { bits: 17913, formatInfo: { errorCorrectionLevel: 1, dataMask: 4 } },
              { bits: 16590, formatInfo: { errorCorrectionLevel: 1, dataMask: 5 } },
              { bits: 20375, formatInfo: { errorCorrectionLevel: 1, dataMask: 6 } },
              { bits: 19104, formatInfo: { errorCorrectionLevel: 1, dataMask: 7 } },
              { bits: 30660, formatInfo: { errorCorrectionLevel: 0, dataMask: 0 } },
              { bits: 29427, formatInfo: { errorCorrectionLevel: 0, dataMask: 1 } },
              { bits: 32170, formatInfo: { errorCorrectionLevel: 0, dataMask: 2 } },
              { bits: 30877, formatInfo: { errorCorrectionLevel: 0, dataMask: 3 } },
              { bits: 26159, formatInfo: { errorCorrectionLevel: 0, dataMask: 4 } },
              { bits: 25368, formatInfo: { errorCorrectionLevel: 0, dataMask: 5 } },
              { bits: 27713, formatInfo: { errorCorrectionLevel: 0, dataMask: 6 } },
              { bits: 26998, formatInfo: { errorCorrectionLevel: 0, dataMask: 7 } },
              { bits: 5769, formatInfo: { errorCorrectionLevel: 3, dataMask: 0 } },
              { bits: 5054, formatInfo: { errorCorrectionLevel: 3, dataMask: 1 } },
              { bits: 7399, formatInfo: { errorCorrectionLevel: 3, dataMask: 2 } },
              { bits: 6608, formatInfo: { errorCorrectionLevel: 3, dataMask: 3 } },
              { bits: 1890, formatInfo: { errorCorrectionLevel: 3, dataMask: 4 } },
              { bits: 597, formatInfo: { errorCorrectionLevel: 3, dataMask: 5 } },
              { bits: 3340, formatInfo: { errorCorrectionLevel: 3, dataMask: 6 } },
              { bits: 2107, formatInfo: { errorCorrectionLevel: 3, dataMask: 7 } },
              { bits: 13663, formatInfo: { errorCorrectionLevel: 2, dataMask: 0 } },
              { bits: 12392, formatInfo: { errorCorrectionLevel: 2, dataMask: 1 } },
              { bits: 16177, formatInfo: { errorCorrectionLevel: 2, dataMask: 2 } },
              { bits: 14854, formatInfo: { errorCorrectionLevel: 2, dataMask: 3 } },
              { bits: 9396, formatInfo: { errorCorrectionLevel: 2, dataMask: 4 } },
              { bits: 8579, formatInfo: { errorCorrectionLevel: 2, dataMask: 5 } },
              { bits: 11994, formatInfo: { errorCorrectionLevel: 2, dataMask: 6 } },
              { bits: 11245, formatInfo: { errorCorrectionLevel: 2, dataMask: 7 } }
            ];
            var DATA_MASKS = [
              function(p) {
                return (p.y + p.x) % 2 === 0;
              },
              function(p) {
                return p.y % 2 === 0;
              },
              function(p) {
                return p.x % 3 === 0;
              },
              function(p) {
                return (p.y + p.x) % 3 === 0;
              },
              function(p) {
                return (Math.floor(p.y / 2) + Math.floor(p.x / 3)) % 2 === 0;
              },
              function(p) {
                return p.x * p.y % 2 + p.x * p.y % 3 === 0;
              },
              function(p) {
                return (p.y * p.x % 2 + p.y * p.x % 3) % 2 === 0;
              },
              function(p) {
                return ((p.y + p.x) % 2 + p.y * p.x % 3) % 2 === 0;
              }
            ];
            function buildFunctionPatternMask(version) {
              var dimension = 17 + 4 * version.versionNumber;
              var matrix = BitMatrix_1.BitMatrix.createEmpty(dimension, dimension);
              matrix.setRegion(0, 0, 9, 9, true);
              matrix.setRegion(dimension - 8, 0, 8, 9, true);
              matrix.setRegion(0, dimension - 8, 9, 8, true);
              for (var _i = 0, _a = version.alignmentPatternCenters; _i < _a.length; _i++) {
                var x = _a[_i];
                for (var _b = 0, _c = version.alignmentPatternCenters; _b < _c.length; _b++) {
                  var y = _c[_b];
                  if (!(x === 6 && y === 6 || x === 6 && y === dimension - 7 || x === dimension - 7 && y === 6)) {
                    matrix.setRegion(x - 2, y - 2, 5, 5, true);
                  }
                }
              }
              matrix.setRegion(6, 9, 1, dimension - 17, true);
              matrix.setRegion(9, 6, dimension - 17, 1, true);
              if (version.versionNumber > 6) {
                matrix.setRegion(dimension - 11, 0, 3, 6, true);
                matrix.setRegion(0, dimension - 11, 6, 3, true);
              }
              return matrix;
            }
            function readCodewords(matrix, version, formatInfo) {
              var dataMask = DATA_MASKS[formatInfo.dataMask];
              var dimension = matrix.height;
              var functionPatternMask = buildFunctionPatternMask(version);
              var codewords = [];
              var currentByte = 0;
              var bitsRead = 0;
              var readingUp = true;
              for (var columnIndex = dimension - 1; columnIndex > 0; columnIndex -= 2) {
                if (columnIndex === 6) {
                  columnIndex--;
                }
                for (var i = 0; i < dimension; i++) {
                  var y = readingUp ? dimension - 1 - i : i;
                  for (var columnOffset = 0; columnOffset < 2; columnOffset++) {
                    var x = columnIndex - columnOffset;
                    if (!functionPatternMask.get(x, y)) {
                      bitsRead++;
                      var bit = matrix.get(x, y);
                      if (dataMask({ y, x })) {
                        bit = !bit;
                      }
                      currentByte = pushBit(bit, currentByte);
                      if (bitsRead === 8) {
                        codewords.push(currentByte);
                        bitsRead = 0;
                        currentByte = 0;
                      }
                    }
                  }
                }
                readingUp = !readingUp;
              }
              return codewords;
            }
            function readVersion(matrix) {
              var dimension = matrix.height;
              var provisionalVersion = Math.floor((dimension - 17) / 4);
              if (provisionalVersion <= 6) {
                return version_1.VERSIONS[provisionalVersion - 1];
              }
              var topRightVersionBits = 0;
              for (var y = 5; y >= 0; y--) {
                for (var x = dimension - 9; x >= dimension - 11; x--) {
                  topRightVersionBits = pushBit(matrix.get(x, y), topRightVersionBits);
                }
              }
              var bottomLeftVersionBits = 0;
              for (var x = 5; x >= 0; x--) {
                for (var y = dimension - 9; y >= dimension - 11; y--) {
                  bottomLeftVersionBits = pushBit(matrix.get(x, y), bottomLeftVersionBits);
                }
              }
              var bestDifference = Infinity;
              var bestVersion;
              for (var _i = 0, VERSIONS_1 = version_1.VERSIONS; _i < VERSIONS_1.length; _i++) {
                var version = VERSIONS_1[_i];
                if (version.infoBits === topRightVersionBits || version.infoBits === bottomLeftVersionBits) {
                  return version;
                }
                var difference = numBitsDiffering(topRightVersionBits, version.infoBits);
                if (difference < bestDifference) {
                  bestVersion = version;
                  bestDifference = difference;
                }
                difference = numBitsDiffering(bottomLeftVersionBits, version.infoBits);
                if (difference < bestDifference) {
                  bestVersion = version;
                  bestDifference = difference;
                }
              }
              if (bestDifference <= 3) {
                return bestVersion;
              }
            }
            function readFormatInformation(matrix) {
              var topLeftFormatInfoBits = 0;
              for (var x = 0; x <= 8; x++) {
                if (x !== 6) {
                  topLeftFormatInfoBits = pushBit(matrix.get(x, 8), topLeftFormatInfoBits);
                }
              }
              for (var y = 7; y >= 0; y--) {
                if (y !== 6) {
                  topLeftFormatInfoBits = pushBit(matrix.get(8, y), topLeftFormatInfoBits);
                }
              }
              var dimension = matrix.height;
              var topRightBottomRightFormatInfoBits = 0;
              for (var y = dimension - 1; y >= dimension - 7; y--) {
                topRightBottomRightFormatInfoBits = pushBit(matrix.get(8, y), topRightBottomRightFormatInfoBits);
              }
              for (var x = dimension - 8; x < dimension; x++) {
                topRightBottomRightFormatInfoBits = pushBit(matrix.get(x, 8), topRightBottomRightFormatInfoBits);
              }
              var bestDifference = Infinity;
              var bestFormatInfo = null;
              for (var _i = 0, FORMAT_INFO_TABLE_1 = FORMAT_INFO_TABLE; _i < FORMAT_INFO_TABLE_1.length; _i++) {
                var _a = FORMAT_INFO_TABLE_1[_i], bits = _a.bits, formatInfo = _a.formatInfo;
                if (bits === topLeftFormatInfoBits || bits === topRightBottomRightFormatInfoBits) {
                  return formatInfo;
                }
                var difference = numBitsDiffering(topLeftFormatInfoBits, bits);
                if (difference < bestDifference) {
                  bestFormatInfo = formatInfo;
                  bestDifference = difference;
                }
                if (topLeftFormatInfoBits !== topRightBottomRightFormatInfoBits) {
                  difference = numBitsDiffering(topRightBottomRightFormatInfoBits, bits);
                  if (difference < bestDifference) {
                    bestFormatInfo = formatInfo;
                    bestDifference = difference;
                  }
                }
              }
              if (bestDifference <= 3) {
                return bestFormatInfo;
              }
              return null;
            }
            function getDataBlocks(codewords, version, ecLevel) {
              var ecInfo = version.errorCorrectionLevels[ecLevel];
              var dataBlocks = [];
              var totalCodewords = 0;
              ecInfo.ecBlocks.forEach(function(block) {
                for (var i2 = 0; i2 < block.numBlocks; i2++) {
                  dataBlocks.push({ numDataCodewords: block.dataCodewordsPerBlock, codewords: [] });
                  totalCodewords += block.dataCodewordsPerBlock + ecInfo.ecCodewordsPerBlock;
                }
              });
              if (codewords.length < totalCodewords) {
                return null;
              }
              codewords = codewords.slice(0, totalCodewords);
              var shortBlockSize = ecInfo.ecBlocks[0].dataCodewordsPerBlock;
              for (var i = 0; i < shortBlockSize; i++) {
                for (var _i = 0, dataBlocks_1 = dataBlocks; _i < dataBlocks_1.length; _i++) {
                  var dataBlock = dataBlocks_1[_i];
                  dataBlock.codewords.push(codewords.shift());
                }
              }
              if (ecInfo.ecBlocks.length > 1) {
                var smallBlockCount = ecInfo.ecBlocks[0].numBlocks;
                var largeBlockCount = ecInfo.ecBlocks[1].numBlocks;
                for (var i = 0; i < largeBlockCount; i++) {
                  dataBlocks[smallBlockCount + i].codewords.push(codewords.shift());
                }
              }
              while (codewords.length > 0) {
                for (var _a = 0, dataBlocks_2 = dataBlocks; _a < dataBlocks_2.length; _a++) {
                  var dataBlock = dataBlocks_2[_a];
                  dataBlock.codewords.push(codewords.shift());
                }
              }
              return dataBlocks;
            }
            function decodeMatrix(matrix) {
              var version = readVersion(matrix);
              if (!version) {
                return null;
              }
              var formatInfo = readFormatInformation(matrix);
              if (!formatInfo) {
                return null;
              }
              var codewords = readCodewords(matrix, version, formatInfo);
              var dataBlocks = getDataBlocks(codewords, version, formatInfo.errorCorrectionLevel);
              if (!dataBlocks) {
                return null;
              }
              var totalBytes = dataBlocks.reduce(function(a, b) {
                return a + b.numDataCodewords;
              }, 0);
              var resultBytes = new Uint8ClampedArray(totalBytes);
              var resultIndex = 0;
              for (var _i = 0, dataBlocks_3 = dataBlocks; _i < dataBlocks_3.length; _i++) {
                var dataBlock = dataBlocks_3[_i];
                var correctedBytes = reedsolomon_1.decode(dataBlock.codewords, dataBlock.codewords.length - dataBlock.numDataCodewords);
                if (!correctedBytes) {
                  return null;
                }
                for (var i = 0; i < dataBlock.numDataCodewords; i++) {
                  resultBytes[resultIndex++] = correctedBytes[i];
                }
              }
              try {
                return decodeData_1.decode(resultBytes, version.versionNumber);
              } catch (_a) {
                return null;
              }
            }
            function decode(matrix) {
              if (matrix == null) {
                return null;
              }
              var result = decodeMatrix(matrix);
              if (result) {
                return result;
              }
              for (var x = 0; x < matrix.width; x++) {
                for (var y = x + 1; y < matrix.height; y++) {
                  if (matrix.get(x, y) !== matrix.get(y, x)) {
                    matrix.set(x, y, !matrix.get(x, y));
                    matrix.set(y, x, !matrix.get(y, x));
                  }
                }
              }
              return decodeMatrix(matrix);
            }
            exports2.decode = decode;
          }),
          /* 6 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitStream_1 = __webpack_require__(7);
            var shiftJISTable_1 = __webpack_require__(8);
            var Mode;
            (function(Mode2) {
              Mode2["Numeric"] = "numeric";
              Mode2["Alphanumeric"] = "alphanumeric";
              Mode2["Byte"] = "byte";
              Mode2["Kanji"] = "kanji";
              Mode2["ECI"] = "eci";
            })(Mode = exports2.Mode || (exports2.Mode = {}));
            var ModeByte;
            (function(ModeByte2) {
              ModeByte2[ModeByte2["Terminator"] = 0] = "Terminator";
              ModeByte2[ModeByte2["Numeric"] = 1] = "Numeric";
              ModeByte2[ModeByte2["Alphanumeric"] = 2] = "Alphanumeric";
              ModeByte2[ModeByte2["Byte"] = 4] = "Byte";
              ModeByte2[ModeByte2["Kanji"] = 8] = "Kanji";
              ModeByte2[ModeByte2["ECI"] = 7] = "ECI";
            })(ModeByte || (ModeByte = {}));
            function decodeNumeric(stream, size) {
              var bytes = [];
              var text = "";
              var characterCountSize = [10, 12, 14][size];
              var length = stream.readBits(characterCountSize);
              while (length >= 3) {
                var num = stream.readBits(10);
                if (num >= 1e3) {
                  throw new Error("Invalid numeric value above 999");
                }
                var a = Math.floor(num / 100);
                var b = Math.floor(num / 10) % 10;
                var c = num % 10;
                bytes.push(48 + a, 48 + b, 48 + c);
                text += a.toString() + b.toString() + c.toString();
                length -= 3;
              }
              if (length === 2) {
                var num = stream.readBits(7);
                if (num >= 100) {
                  throw new Error("Invalid numeric value above 99");
                }
                var a = Math.floor(num / 10);
                var b = num % 10;
                bytes.push(48 + a, 48 + b);
                text += a.toString() + b.toString();
              } else if (length === 1) {
                var num = stream.readBits(4);
                if (num >= 10) {
                  throw new Error("Invalid numeric value above 9");
                }
                bytes.push(48 + num);
                text += num.toString();
              }
              return { bytes, text };
            }
            var AlphanumericCharacterCodes = [
              "0",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
              "O",
              "P",
              "Q",
              "R",
              "S",
              "T",
              "U",
              "V",
              "W",
              "X",
              "Y",
              "Z",
              " ",
              "$",
              "%",
              "*",
              "+",
              "-",
              ".",
              "/",
              ":"
            ];
            function decodeAlphanumeric(stream, size) {
              var bytes = [];
              var text = "";
              var characterCountSize = [9, 11, 13][size];
              var length = stream.readBits(characterCountSize);
              while (length >= 2) {
                var v = stream.readBits(11);
                var a = Math.floor(v / 45);
                var b = v % 45;
                bytes.push(AlphanumericCharacterCodes[a].charCodeAt(0), AlphanumericCharacterCodes[b].charCodeAt(0));
                text += AlphanumericCharacterCodes[a] + AlphanumericCharacterCodes[b];
                length -= 2;
              }
              if (length === 1) {
                var a = stream.readBits(6);
                bytes.push(AlphanumericCharacterCodes[a].charCodeAt(0));
                text += AlphanumericCharacterCodes[a];
              }
              return { bytes, text };
            }
            function decodeByte(stream, size) {
              var bytes = [];
              var text = "";
              var characterCountSize = [8, 16, 16][size];
              var length = stream.readBits(characterCountSize);
              for (var i = 0; i < length; i++) {
                var b = stream.readBits(8);
                bytes.push(b);
              }
              try {
                text += decodeURIComponent(bytes.map(function(b2) {
                  return "%" + ("0" + b2.toString(16)).substr(-2);
                }).join(""));
              } catch (_a) {
              }
              return { bytes, text };
            }
            function decodeKanji(stream, size) {
              var bytes = [];
              var text = "";
              var characterCountSize = [8, 10, 12][size];
              var length = stream.readBits(characterCountSize);
              for (var i = 0; i < length; i++) {
                var k = stream.readBits(13);
                var c = Math.floor(k / 192) << 8 | k % 192;
                if (c < 7936) {
                  c += 33088;
                } else {
                  c += 49472;
                }
                bytes.push(c >> 8, c & 255);
                text += String.fromCharCode(shiftJISTable_1.shiftJISTable[c]);
              }
              return { bytes, text };
            }
            function decode(data, version) {
              var _a, _b, _c, _d;
              var stream = new BitStream_1.BitStream(data);
              var size = version <= 9 ? 0 : version <= 26 ? 1 : 2;
              var result = {
                text: "",
                bytes: [],
                chunks: [],
                version
              };
              while (stream.available() >= 4) {
                var mode = stream.readBits(4);
                if (mode === ModeByte.Terminator) {
                  return result;
                } else if (mode === ModeByte.ECI) {
                  if (stream.readBits(1) === 0) {
                    result.chunks.push({
                      type: Mode.ECI,
                      assignmentNumber: stream.readBits(7)
                    });
                  } else if (stream.readBits(1) === 0) {
                    result.chunks.push({
                      type: Mode.ECI,
                      assignmentNumber: stream.readBits(14)
                    });
                  } else if (stream.readBits(1) === 0) {
                    result.chunks.push({
                      type: Mode.ECI,
                      assignmentNumber: stream.readBits(21)
                    });
                  } else {
                    result.chunks.push({
                      type: Mode.ECI,
                      assignmentNumber: -1
                    });
                  }
                } else if (mode === ModeByte.Numeric) {
                  var numericResult = decodeNumeric(stream, size);
                  result.text += numericResult.text;
                  (_a = result.bytes).push.apply(_a, numericResult.bytes);
                  result.chunks.push({
                    type: Mode.Numeric,
                    text: numericResult.text
                  });
                } else if (mode === ModeByte.Alphanumeric) {
                  var alphanumericResult = decodeAlphanumeric(stream, size);
                  result.text += alphanumericResult.text;
                  (_b = result.bytes).push.apply(_b, alphanumericResult.bytes);
                  result.chunks.push({
                    type: Mode.Alphanumeric,
                    text: alphanumericResult.text
                  });
                } else if (mode === ModeByte.Byte) {
                  var byteResult = decodeByte(stream, size);
                  result.text += byteResult.text;
                  (_c = result.bytes).push.apply(_c, byteResult.bytes);
                  result.chunks.push({
                    type: Mode.Byte,
                    bytes: byteResult.bytes,
                    text: byteResult.text
                  });
                } else if (mode === ModeByte.Kanji) {
                  var kanjiResult = decodeKanji(stream, size);
                  result.text += kanjiResult.text;
                  (_d = result.bytes).push.apply(_d, kanjiResult.bytes);
                  result.chunks.push({
                    type: Mode.Kanji,
                    bytes: kanjiResult.bytes,
                    text: kanjiResult.text
                  });
                }
              }
              if (stream.available() === 0 || stream.readBits(stream.available()) === 0) {
                return result;
              }
            }
            exports2.decode = decode;
          }),
          /* 7 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitStream = (
              /** @class */
              (function() {
                function BitStream2(bytes) {
                  this.byteOffset = 0;
                  this.bitOffset = 0;
                  this.bytes = bytes;
                }
                BitStream2.prototype.readBits = function(numBits) {
                  if (numBits < 1 || numBits > 32 || numBits > this.available()) {
                    throw new Error("Cannot read " + numBits.toString() + " bits");
                  }
                  var result = 0;
                  if (this.bitOffset > 0) {
                    var bitsLeft = 8 - this.bitOffset;
                    var toRead = numBits < bitsLeft ? numBits : bitsLeft;
                    var bitsToNotRead = bitsLeft - toRead;
                    var mask = 255 >> 8 - toRead << bitsToNotRead;
                    result = (this.bytes[this.byteOffset] & mask) >> bitsToNotRead;
                    numBits -= toRead;
                    this.bitOffset += toRead;
                    if (this.bitOffset === 8) {
                      this.bitOffset = 0;
                      this.byteOffset++;
                    }
                  }
                  if (numBits > 0) {
                    while (numBits >= 8) {
                      result = result << 8 | this.bytes[this.byteOffset] & 255;
                      this.byteOffset++;
                      numBits -= 8;
                    }
                    if (numBits > 0) {
                      var bitsToNotRead = 8 - numBits;
                      var mask = 255 >> bitsToNotRead << bitsToNotRead;
                      result = result << numBits | (this.bytes[this.byteOffset] & mask) >> bitsToNotRead;
                      this.bitOffset += numBits;
                    }
                  }
                  return result;
                };
                BitStream2.prototype.available = function() {
                  return 8 * (this.bytes.length - this.byteOffset) - this.bitOffset;
                };
                return BitStream2;
              })()
            );
            exports2.BitStream = BitStream;
          }),
          /* 8 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            exports2.shiftJISTable = {
              32: 32,
              33: 33,
              34: 34,
              35: 35,
              36: 36,
              37: 37,
              38: 38,
              39: 39,
              40: 40,
              41: 41,
              42: 42,
              43: 43,
              44: 44,
              45: 45,
              46: 46,
              47: 47,
              48: 48,
              49: 49,
              50: 50,
              51: 51,
              52: 52,
              53: 53,
              54: 54,
              55: 55,
              56: 56,
              57: 57,
              58: 58,
              59: 59,
              60: 60,
              61: 61,
              62: 62,
              63: 63,
              64: 64,
              65: 65,
              66: 66,
              67: 67,
              68: 68,
              69: 69,
              70: 70,
              71: 71,
              72: 72,
              73: 73,
              74: 74,
              75: 75,
              76: 76,
              77: 77,
              78: 78,
              79: 79,
              80: 80,
              81: 81,
              82: 82,
              83: 83,
              84: 84,
              85: 85,
              86: 86,
              87: 87,
              88: 88,
              89: 89,
              90: 90,
              91: 91,
              92: 165,
              93: 93,
              94: 94,
              95: 95,
              96: 96,
              97: 97,
              98: 98,
              99: 99,
              100: 100,
              101: 101,
              102: 102,
              103: 103,
              104: 104,
              105: 105,
              106: 106,
              107: 107,
              108: 108,
              109: 109,
              110: 110,
              111: 111,
              112: 112,
              113: 113,
              114: 114,
              115: 115,
              116: 116,
              117: 117,
              118: 118,
              119: 119,
              120: 120,
              121: 121,
              122: 122,
              123: 123,
              124: 124,
              125: 125,
              126: 8254,
              33088: 12288,
              33089: 12289,
              33090: 12290,
              33091: 65292,
              33092: 65294,
              33093: 12539,
              33094: 65306,
              33095: 65307,
              33096: 65311,
              33097: 65281,
              33098: 12443,
              33099: 12444,
              33100: 180,
              33101: 65344,
              33102: 168,
              33103: 65342,
              33104: 65507,
              33105: 65343,
              33106: 12541,
              33107: 12542,
              33108: 12445,
              33109: 12446,
              33110: 12291,
              33111: 20189,
              33112: 12293,
              33113: 12294,
              33114: 12295,
              33115: 12540,
              33116: 8213,
              33117: 8208,
              33118: 65295,
              33119: 92,
              33120: 12316,
              33121: 8214,
              33122: 65372,
              33123: 8230,
              33124: 8229,
              33125: 8216,
              33126: 8217,
              33127: 8220,
              33128: 8221,
              33129: 65288,
              33130: 65289,
              33131: 12308,
              33132: 12309,
              33133: 65339,
              33134: 65341,
              33135: 65371,
              33136: 65373,
              33137: 12296,
              33138: 12297,
              33139: 12298,
              33140: 12299,
              33141: 12300,
              33142: 12301,
              33143: 12302,
              33144: 12303,
              33145: 12304,
              33146: 12305,
              33147: 65291,
              33148: 8722,
              33149: 177,
              33150: 215,
              33152: 247,
              33153: 65309,
              33154: 8800,
              33155: 65308,
              33156: 65310,
              33157: 8806,
              33158: 8807,
              33159: 8734,
              33160: 8756,
              33161: 9794,
              33162: 9792,
              33163: 176,
              33164: 8242,
              33165: 8243,
              33166: 8451,
              33167: 65509,
              33168: 65284,
              33169: 162,
              33170: 163,
              33171: 65285,
              33172: 65283,
              33173: 65286,
              33174: 65290,
              33175: 65312,
              33176: 167,
              33177: 9734,
              33178: 9733,
              33179: 9675,
              33180: 9679,
              33181: 9678,
              33182: 9671,
              33183: 9670,
              33184: 9633,
              33185: 9632,
              33186: 9651,
              33187: 9650,
              33188: 9661,
              33189: 9660,
              33190: 8251,
              33191: 12306,
              33192: 8594,
              33193: 8592,
              33194: 8593,
              33195: 8595,
              33196: 12307,
              33208: 8712,
              33209: 8715,
              33210: 8838,
              33211: 8839,
              33212: 8834,
              33213: 8835,
              33214: 8746,
              33215: 8745,
              33224: 8743,
              33225: 8744,
              33226: 172,
              33227: 8658,
              33228: 8660,
              33229: 8704,
              33230: 8707,
              33242: 8736,
              33243: 8869,
              33244: 8978,
              33245: 8706,
              33246: 8711,
              33247: 8801,
              33248: 8786,
              33249: 8810,
              33250: 8811,
              33251: 8730,
              33252: 8765,
              33253: 8733,
              33254: 8757,
              33255: 8747,
              33256: 8748,
              33264: 8491,
              33265: 8240,
              33266: 9839,
              33267: 9837,
              33268: 9834,
              33269: 8224,
              33270: 8225,
              33271: 182,
              33276: 9711,
              33359: 65296,
              33360: 65297,
              33361: 65298,
              33362: 65299,
              33363: 65300,
              33364: 65301,
              33365: 65302,
              33366: 65303,
              33367: 65304,
              33368: 65305,
              33376: 65313,
              33377: 65314,
              33378: 65315,
              33379: 65316,
              33380: 65317,
              33381: 65318,
              33382: 65319,
              33383: 65320,
              33384: 65321,
              33385: 65322,
              33386: 65323,
              33387: 65324,
              33388: 65325,
              33389: 65326,
              33390: 65327,
              33391: 65328,
              33392: 65329,
              33393: 65330,
              33394: 65331,
              33395: 65332,
              33396: 65333,
              33397: 65334,
              33398: 65335,
              33399: 65336,
              33400: 65337,
              33401: 65338,
              33409: 65345,
              33410: 65346,
              33411: 65347,
              33412: 65348,
              33413: 65349,
              33414: 65350,
              33415: 65351,
              33416: 65352,
              33417: 65353,
              33418: 65354,
              33419: 65355,
              33420: 65356,
              33421: 65357,
              33422: 65358,
              33423: 65359,
              33424: 65360,
              33425: 65361,
              33426: 65362,
              33427: 65363,
              33428: 65364,
              33429: 65365,
              33430: 65366,
              33431: 65367,
              33432: 65368,
              33433: 65369,
              33434: 65370,
              33439: 12353,
              33440: 12354,
              33441: 12355,
              33442: 12356,
              33443: 12357,
              33444: 12358,
              33445: 12359,
              33446: 12360,
              33447: 12361,
              33448: 12362,
              33449: 12363,
              33450: 12364,
              33451: 12365,
              33452: 12366,
              33453: 12367,
              33454: 12368,
              33455: 12369,
              33456: 12370,
              33457: 12371,
              33458: 12372,
              33459: 12373,
              33460: 12374,
              33461: 12375,
              33462: 12376,
              33463: 12377,
              33464: 12378,
              33465: 12379,
              33466: 12380,
              33467: 12381,
              33468: 12382,
              33469: 12383,
              33470: 12384,
              33471: 12385,
              33472: 12386,
              33473: 12387,
              33474: 12388,
              33475: 12389,
              33476: 12390,
              33477: 12391,
              33478: 12392,
              33479: 12393,
              33480: 12394,
              33481: 12395,
              33482: 12396,
              33483: 12397,
              33484: 12398,
              33485: 12399,
              33486: 12400,
              33487: 12401,
              33488: 12402,
              33489: 12403,
              33490: 12404,
              33491: 12405,
              33492: 12406,
              33493: 12407,
              33494: 12408,
              33495: 12409,
              33496: 12410,
              33497: 12411,
              33498: 12412,
              33499: 12413,
              33500: 12414,
              33501: 12415,
              33502: 12416,
              33503: 12417,
              33504: 12418,
              33505: 12419,
              33506: 12420,
              33507: 12421,
              33508: 12422,
              33509: 12423,
              33510: 12424,
              33511: 12425,
              33512: 12426,
              33513: 12427,
              33514: 12428,
              33515: 12429,
              33516: 12430,
              33517: 12431,
              33518: 12432,
              33519: 12433,
              33520: 12434,
              33521: 12435,
              33600: 12449,
              33601: 12450,
              33602: 12451,
              33603: 12452,
              33604: 12453,
              33605: 12454,
              33606: 12455,
              33607: 12456,
              33608: 12457,
              33609: 12458,
              33610: 12459,
              33611: 12460,
              33612: 12461,
              33613: 12462,
              33614: 12463,
              33615: 12464,
              33616: 12465,
              33617: 12466,
              33618: 12467,
              33619: 12468,
              33620: 12469,
              33621: 12470,
              33622: 12471,
              33623: 12472,
              33624: 12473,
              33625: 12474,
              33626: 12475,
              33627: 12476,
              33628: 12477,
              33629: 12478,
              33630: 12479,
              33631: 12480,
              33632: 12481,
              33633: 12482,
              33634: 12483,
              33635: 12484,
              33636: 12485,
              33637: 12486,
              33638: 12487,
              33639: 12488,
              33640: 12489,
              33641: 12490,
              33642: 12491,
              33643: 12492,
              33644: 12493,
              33645: 12494,
              33646: 12495,
              33647: 12496,
              33648: 12497,
              33649: 12498,
              33650: 12499,
              33651: 12500,
              33652: 12501,
              33653: 12502,
              33654: 12503,
              33655: 12504,
              33656: 12505,
              33657: 12506,
              33658: 12507,
              33659: 12508,
              33660: 12509,
              33661: 12510,
              33662: 12511,
              33664: 12512,
              33665: 12513,
              33666: 12514,
              33667: 12515,
              33668: 12516,
              33669: 12517,
              33670: 12518,
              33671: 12519,
              33672: 12520,
              33673: 12521,
              33674: 12522,
              33675: 12523,
              33676: 12524,
              33677: 12525,
              33678: 12526,
              33679: 12527,
              33680: 12528,
              33681: 12529,
              33682: 12530,
              33683: 12531,
              33684: 12532,
              33685: 12533,
              33686: 12534,
              33695: 913,
              33696: 914,
              33697: 915,
              33698: 916,
              33699: 917,
              33700: 918,
              33701: 919,
              33702: 920,
              33703: 921,
              33704: 922,
              33705: 923,
              33706: 924,
              33707: 925,
              33708: 926,
              33709: 927,
              33710: 928,
              33711: 929,
              33712: 931,
              33713: 932,
              33714: 933,
              33715: 934,
              33716: 935,
              33717: 936,
              33718: 937,
              33727: 945,
              33728: 946,
              33729: 947,
              33730: 948,
              33731: 949,
              33732: 950,
              33733: 951,
              33734: 952,
              33735: 953,
              33736: 954,
              33737: 955,
              33738: 956,
              33739: 957,
              33740: 958,
              33741: 959,
              33742: 960,
              33743: 961,
              33744: 963,
              33745: 964,
              33746: 965,
              33747: 966,
              33748: 967,
              33749: 968,
              33750: 969,
              33856: 1040,
              33857: 1041,
              33858: 1042,
              33859: 1043,
              33860: 1044,
              33861: 1045,
              33862: 1025,
              33863: 1046,
              33864: 1047,
              33865: 1048,
              33866: 1049,
              33867: 1050,
              33868: 1051,
              33869: 1052,
              33870: 1053,
              33871: 1054,
              33872: 1055,
              33873: 1056,
              33874: 1057,
              33875: 1058,
              33876: 1059,
              33877: 1060,
              33878: 1061,
              33879: 1062,
              33880: 1063,
              33881: 1064,
              33882: 1065,
              33883: 1066,
              33884: 1067,
              33885: 1068,
              33886: 1069,
              33887: 1070,
              33888: 1071,
              33904: 1072,
              33905: 1073,
              33906: 1074,
              33907: 1075,
              33908: 1076,
              33909: 1077,
              33910: 1105,
              33911: 1078,
              33912: 1079,
              33913: 1080,
              33914: 1081,
              33915: 1082,
              33916: 1083,
              33917: 1084,
              33918: 1085,
              33920: 1086,
              33921: 1087,
              33922: 1088,
              33923: 1089,
              33924: 1090,
              33925: 1091,
              33926: 1092,
              33927: 1093,
              33928: 1094,
              33929: 1095,
              33930: 1096,
              33931: 1097,
              33932: 1098,
              33933: 1099,
              33934: 1100,
              33935: 1101,
              33936: 1102,
              33937: 1103,
              33951: 9472,
              33952: 9474,
              33953: 9484,
              33954: 9488,
              33955: 9496,
              33956: 9492,
              33957: 9500,
              33958: 9516,
              33959: 9508,
              33960: 9524,
              33961: 9532,
              33962: 9473,
              33963: 9475,
              33964: 9487,
              33965: 9491,
              33966: 9499,
              33967: 9495,
              33968: 9507,
              33969: 9523,
              33970: 9515,
              33971: 9531,
              33972: 9547,
              33973: 9504,
              33974: 9519,
              33975: 9512,
              33976: 9527,
              33977: 9535,
              33978: 9501,
              33979: 9520,
              33980: 9509,
              33981: 9528,
              33982: 9538,
              34975: 20124,
              34976: 21782,
              34977: 23043,
              34978: 38463,
              34979: 21696,
              34980: 24859,
              34981: 25384,
              34982: 23030,
              34983: 36898,
              34984: 33909,
              34985: 33564,
              34986: 31312,
              34987: 24746,
              34988: 25569,
              34989: 28197,
              34990: 26093,
              34991: 33894,
              34992: 33446,
              34993: 39925,
              34994: 26771,
              34995: 22311,
              34996: 26017,
              34997: 25201,
              34998: 23451,
              34999: 22992,
              35e3: 34427,
              35001: 39156,
              35002: 32098,
              35003: 32190,
              35004: 39822,
              35005: 25110,
              35006: 31903,
              35007: 34999,
              35008: 23433,
              35009: 24245,
              35010: 25353,
              35011: 26263,
              35012: 26696,
              35013: 38343,
              35014: 38797,
              35015: 26447,
              35016: 20197,
              35017: 20234,
              35018: 20301,
              35019: 20381,
              35020: 20553,
              35021: 22258,
              35022: 22839,
              35023: 22996,
              35024: 23041,
              35025: 23561,
              35026: 24799,
              35027: 24847,
              35028: 24944,
              35029: 26131,
              35030: 26885,
              35031: 28858,
              35032: 30031,
              35033: 30064,
              35034: 31227,
              35035: 32173,
              35036: 32239,
              35037: 32963,
              35038: 33806,
              35039: 34915,
              35040: 35586,
              35041: 36949,
              35042: 36986,
              35043: 21307,
              35044: 20117,
              35045: 20133,
              35046: 22495,
              35047: 32946,
              35048: 37057,
              35049: 30959,
              35050: 19968,
              35051: 22769,
              35052: 28322,
              35053: 36920,
              35054: 31282,
              35055: 33576,
              35056: 33419,
              35057: 39983,
              35058: 20801,
              35059: 21360,
              35060: 21693,
              35061: 21729,
              35062: 22240,
              35063: 23035,
              35064: 24341,
              35065: 39154,
              35066: 28139,
              35067: 32996,
              35068: 34093,
              35136: 38498,
              35137: 38512,
              35138: 38560,
              35139: 38907,
              35140: 21515,
              35141: 21491,
              35142: 23431,
              35143: 28879,
              35144: 32701,
              35145: 36802,
              35146: 38632,
              35147: 21359,
              35148: 40284,
              35149: 31418,
              35150: 19985,
              35151: 30867,
              35152: 33276,
              35153: 28198,
              35154: 22040,
              35155: 21764,
              35156: 27421,
              35157: 34074,
              35158: 39995,
              35159: 23013,
              35160: 21417,
              35161: 28006,
              35162: 29916,
              35163: 38287,
              35164: 22082,
              35165: 20113,
              35166: 36939,
              35167: 38642,
              35168: 33615,
              35169: 39180,
              35170: 21473,
              35171: 21942,
              35172: 23344,
              35173: 24433,
              35174: 26144,
              35175: 26355,
              35176: 26628,
              35177: 27704,
              35178: 27891,
              35179: 27945,
              35180: 29787,
              35181: 30408,
              35182: 31310,
              35183: 38964,
              35184: 33521,
              35185: 34907,
              35186: 35424,
              35187: 37613,
              35188: 28082,
              35189: 30123,
              35190: 30410,
              35191: 39365,
              35192: 24742,
              35193: 35585,
              35194: 36234,
              35195: 38322,
              35196: 27022,
              35197: 21421,
              35198: 20870,
              35200: 22290,
              35201: 22576,
              35202: 22852,
              35203: 23476,
              35204: 24310,
              35205: 24616,
              35206: 25513,
              35207: 25588,
              35208: 27839,
              35209: 28436,
              35210: 28814,
              35211: 28948,
              35212: 29017,
              35213: 29141,
              35214: 29503,
              35215: 32257,
              35216: 33398,
              35217: 33489,
              35218: 34199,
              35219: 36960,
              35220: 37467,
              35221: 40219,
              35222: 22633,
              35223: 26044,
              35224: 27738,
              35225: 29989,
              35226: 20985,
              35227: 22830,
              35228: 22885,
              35229: 24448,
              35230: 24540,
              35231: 25276,
              35232: 26106,
              35233: 27178,
              35234: 27431,
              35235: 27572,
              35236: 29579,
              35237: 32705,
              35238: 35158,
              35239: 40236,
              35240: 40206,
              35241: 40644,
              35242: 23713,
              35243: 27798,
              35244: 33659,
              35245: 20740,
              35246: 23627,
              35247: 25014,
              35248: 33222,
              35249: 26742,
              35250: 29281,
              35251: 20057,
              35252: 20474,
              35253: 21368,
              35254: 24681,
              35255: 28201,
              35256: 31311,
              35257: 38899,
              35258: 19979,
              35259: 21270,
              35260: 20206,
              35261: 20309,
              35262: 20285,
              35263: 20385,
              35264: 20339,
              35265: 21152,
              35266: 21487,
              35267: 22025,
              35268: 22799,
              35269: 23233,
              35270: 23478,
              35271: 23521,
              35272: 31185,
              35273: 26247,
              35274: 26524,
              35275: 26550,
              35276: 27468,
              35277: 27827,
              35278: 28779,
              35279: 29634,
              35280: 31117,
              35281: 31166,
              35282: 31292,
              35283: 31623,
              35284: 33457,
              35285: 33499,
              35286: 33540,
              35287: 33655,
              35288: 33775,
              35289: 33747,
              35290: 34662,
              35291: 35506,
              35292: 22057,
              35293: 36008,
              35294: 36838,
              35295: 36942,
              35296: 38686,
              35297: 34442,
              35298: 20420,
              35299: 23784,
              35300: 25105,
              35301: 29273,
              35302: 30011,
              35303: 33253,
              35304: 33469,
              35305: 34558,
              35306: 36032,
              35307: 38597,
              35308: 39187,
              35309: 39381,
              35310: 20171,
              35311: 20250,
              35312: 35299,
              35313: 22238,
              35314: 22602,
              35315: 22730,
              35316: 24315,
              35317: 24555,
              35318: 24618,
              35319: 24724,
              35320: 24674,
              35321: 25040,
              35322: 25106,
              35323: 25296,
              35324: 25913,
              35392: 39745,
              35393: 26214,
              35394: 26800,
              35395: 28023,
              35396: 28784,
              35397: 30028,
              35398: 30342,
              35399: 32117,
              35400: 33445,
              35401: 34809,
              35402: 38283,
              35403: 38542,
              35404: 35997,
              35405: 20977,
              35406: 21182,
              35407: 22806,
              35408: 21683,
              35409: 23475,
              35410: 23830,
              35411: 24936,
              35412: 27010,
              35413: 28079,
              35414: 30861,
              35415: 33995,
              35416: 34903,
              35417: 35442,
              35418: 37799,
              35419: 39608,
              35420: 28012,
              35421: 39336,
              35422: 34521,
              35423: 22435,
              35424: 26623,
              35425: 34510,
              35426: 37390,
              35427: 21123,
              35428: 22151,
              35429: 21508,
              35430: 24275,
              35431: 25313,
              35432: 25785,
              35433: 26684,
              35434: 26680,
              35435: 27579,
              35436: 29554,
              35437: 30906,
              35438: 31339,
              35439: 35226,
              35440: 35282,
              35441: 36203,
              35442: 36611,
              35443: 37101,
              35444: 38307,
              35445: 38548,
              35446: 38761,
              35447: 23398,
              35448: 23731,
              35449: 27005,
              35450: 38989,
              35451: 38990,
              35452: 25499,
              35453: 31520,
              35454: 27179,
              35456: 27263,
              35457: 26806,
              35458: 39949,
              35459: 28511,
              35460: 21106,
              35461: 21917,
              35462: 24688,
              35463: 25324,
              35464: 27963,
              35465: 28167,
              35466: 28369,
              35467: 33883,
              35468: 35088,
              35469: 36676,
              35470: 19988,
              35471: 39993,
              35472: 21494,
              35473: 26907,
              35474: 27194,
              35475: 38788,
              35476: 26666,
              35477: 20828,
              35478: 31427,
              35479: 33970,
              35480: 37340,
              35481: 37772,
              35482: 22107,
              35483: 40232,
              35484: 26658,
              35485: 33541,
              35486: 33841,
              35487: 31909,
              35488: 21e3,
              35489: 33477,
              35490: 29926,
              35491: 20094,
              35492: 20355,
              35493: 20896,
              35494: 23506,
              35495: 21002,
              35496: 21208,
              35497: 21223,
              35498: 24059,
              35499: 21914,
              35500: 22570,
              35501: 23014,
              35502: 23436,
              35503: 23448,
              35504: 23515,
              35505: 24178,
              35506: 24185,
              35507: 24739,
              35508: 24863,
              35509: 24931,
              35510: 25022,
              35511: 25563,
              35512: 25954,
              35513: 26577,
              35514: 26707,
              35515: 26874,
              35516: 27454,
              35517: 27475,
              35518: 27735,
              35519: 28450,
              35520: 28567,
              35521: 28485,
              35522: 29872,
              35523: 29976,
              35524: 30435,
              35525: 30475,
              35526: 31487,
              35527: 31649,
              35528: 31777,
              35529: 32233,
              35530: 32566,
              35531: 32752,
              35532: 32925,
              35533: 33382,
              35534: 33694,
              35535: 35251,
              35536: 35532,
              35537: 36011,
              35538: 36996,
              35539: 37969,
              35540: 38291,
              35541: 38289,
              35542: 38306,
              35543: 38501,
              35544: 38867,
              35545: 39208,
              35546: 33304,
              35547: 20024,
              35548: 21547,
              35549: 23736,
              35550: 24012,
              35551: 29609,
              35552: 30284,
              35553: 30524,
              35554: 23721,
              35555: 32747,
              35556: 36107,
              35557: 38593,
              35558: 38929,
              35559: 38996,
              35560: 39e3,
              35561: 20225,
              35562: 20238,
              35563: 21361,
              35564: 21916,
              35565: 22120,
              35566: 22522,
              35567: 22855,
              35568: 23305,
              35569: 23492,
              35570: 23696,
              35571: 24076,
              35572: 24190,
              35573: 24524,
              35574: 25582,
              35575: 26426,
              35576: 26071,
              35577: 26082,
              35578: 26399,
              35579: 26827,
              35580: 26820,
              35648: 27231,
              35649: 24112,
              35650: 27589,
              35651: 27671,
              35652: 27773,
              35653: 30079,
              35654: 31048,
              35655: 23395,
              35656: 31232,
              35657: 32e3,
              35658: 24509,
              35659: 35215,
              35660: 35352,
              35661: 36020,
              35662: 36215,
              35663: 36556,
              35664: 36637,
              35665: 39138,
              35666: 39438,
              35667: 39740,
              35668: 20096,
              35669: 20605,
              35670: 20736,
              35671: 22931,
              35672: 23452,
              35673: 25135,
              35674: 25216,
              35675: 25836,
              35676: 27450,
              35677: 29344,
              35678: 30097,
              35679: 31047,
              35680: 32681,
              35681: 34811,
              35682: 35516,
              35683: 35696,
              35684: 25516,
              35685: 33738,
              35686: 38816,
              35687: 21513,
              35688: 21507,
              35689: 21931,
              35690: 26708,
              35691: 27224,
              35692: 35440,
              35693: 30759,
              35694: 26485,
              35695: 40653,
              35696: 21364,
              35697: 23458,
              35698: 33050,
              35699: 34384,
              35700: 36870,
              35701: 19992,
              35702: 20037,
              35703: 20167,
              35704: 20241,
              35705: 21450,
              35706: 21560,
              35707: 23470,
              35708: 24339,
              35709: 24613,
              35710: 25937,
              35712: 26429,
              35713: 27714,
              35714: 27762,
              35715: 27875,
              35716: 28792,
              35717: 29699,
              35718: 31350,
              35719: 31406,
              35720: 31496,
              35721: 32026,
              35722: 31998,
              35723: 32102,
              35724: 26087,
              35725: 29275,
              35726: 21435,
              35727: 23621,
              35728: 24040,
              35729: 25298,
              35730: 25312,
              35731: 25369,
              35732: 28192,
              35733: 34394,
              35734: 35377,
              35735: 36317,
              35736: 37624,
              35737: 28417,
              35738: 31142,
              35739: 39770,
              35740: 20136,
              35741: 20139,
              35742: 20140,
              35743: 20379,
              35744: 20384,
              35745: 20689,
              35746: 20807,
              35747: 31478,
              35748: 20849,
              35749: 20982,
              35750: 21332,
              35751: 21281,
              35752: 21375,
              35753: 21483,
              35754: 21932,
              35755: 22659,
              35756: 23777,
              35757: 24375,
              35758: 24394,
              35759: 24623,
              35760: 24656,
              35761: 24685,
              35762: 25375,
              35763: 25945,
              35764: 27211,
              35765: 27841,
              35766: 29378,
              35767: 29421,
              35768: 30703,
              35769: 33016,
              35770: 33029,
              35771: 33288,
              35772: 34126,
              35773: 37111,
              35774: 37857,
              35775: 38911,
              35776: 39255,
              35777: 39514,
              35778: 20208,
              35779: 20957,
              35780: 23597,
              35781: 26241,
              35782: 26989,
              35783: 23616,
              35784: 26354,
              35785: 26997,
              35786: 29577,
              35787: 26704,
              35788: 31873,
              35789: 20677,
              35790: 21220,
              35791: 22343,
              35792: 24062,
              35793: 37670,
              35794: 26020,
              35795: 27427,
              35796: 27453,
              35797: 29748,
              35798: 31105,
              35799: 31165,
              35800: 31563,
              35801: 32202,
              35802: 33465,
              35803: 33740,
              35804: 34943,
              35805: 35167,
              35806: 35641,
              35807: 36817,
              35808: 37329,
              35809: 21535,
              35810: 37504,
              35811: 20061,
              35812: 20534,
              35813: 21477,
              35814: 21306,
              35815: 29399,
              35816: 29590,
              35817: 30697,
              35818: 33510,
              35819: 36527,
              35820: 39366,
              35821: 39368,
              35822: 39378,
              35823: 20855,
              35824: 24858,
              35825: 34398,
              35826: 21936,
              35827: 31354,
              35828: 20598,
              35829: 23507,
              35830: 36935,
              35831: 38533,
              35832: 20018,
              35833: 27355,
              35834: 37351,
              35835: 23633,
              35836: 23624,
              35904: 25496,
              35905: 31391,
              35906: 27795,
              35907: 38772,
              35908: 36705,
              35909: 31402,
              35910: 29066,
              35911: 38536,
              35912: 31874,
              35913: 26647,
              35914: 32368,
              35915: 26705,
              35916: 37740,
              35917: 21234,
              35918: 21531,
              35919: 34219,
              35920: 35347,
              35921: 32676,
              35922: 36557,
              35923: 37089,
              35924: 21350,
              35925: 34952,
              35926: 31041,
              35927: 20418,
              35928: 20670,
              35929: 21009,
              35930: 20804,
              35931: 21843,
              35932: 22317,
              35933: 29674,
              35934: 22411,
              35935: 22865,
              35936: 24418,
              35937: 24452,
              35938: 24693,
              35939: 24950,
              35940: 24935,
              35941: 25001,
              35942: 25522,
              35943: 25658,
              35944: 25964,
              35945: 26223,
              35946: 26690,
              35947: 28179,
              35948: 30054,
              35949: 31293,
              35950: 31995,
              35951: 32076,
              35952: 32153,
              35953: 32331,
              35954: 32619,
              35955: 33550,
              35956: 33610,
              35957: 34509,
              35958: 35336,
              35959: 35427,
              35960: 35686,
              35961: 36605,
              35962: 38938,
              35963: 40335,
              35964: 33464,
              35965: 36814,
              35966: 39912,
              35968: 21127,
              35969: 25119,
              35970: 25731,
              35971: 28608,
              35972: 38553,
              35973: 26689,
              35974: 20625,
              35975: 27424,
              35976: 27770,
              35977: 28500,
              35978: 31348,
              35979: 32080,
              35980: 34880,
              35981: 35363,
              35982: 26376,
              35983: 20214,
              35984: 20537,
              35985: 20518,
              35986: 20581,
              35987: 20860,
              35988: 21048,
              35989: 21091,
              35990: 21927,
              35991: 22287,
              35992: 22533,
              35993: 23244,
              35994: 24314,
              35995: 25010,
              35996: 25080,
              35997: 25331,
              35998: 25458,
              35999: 26908,
              36e3: 27177,
              36001: 29309,
              36002: 29356,
              36003: 29486,
              36004: 30740,
              36005: 30831,
              36006: 32121,
              36007: 30476,
              36008: 32937,
              36009: 35211,
              36010: 35609,
              36011: 36066,
              36012: 36562,
              36013: 36963,
              36014: 37749,
              36015: 38522,
              36016: 38997,
              36017: 39443,
              36018: 40568,
              36019: 20803,
              36020: 21407,
              36021: 21427,
              36022: 24187,
              36023: 24358,
              36024: 28187,
              36025: 28304,
              36026: 29572,
              36027: 29694,
              36028: 32067,
              36029: 33335,
              36030: 35328,
              36031: 35578,
              36032: 38480,
              36033: 20046,
              36034: 20491,
              36035: 21476,
              36036: 21628,
              36037: 22266,
              36038: 22993,
              36039: 23396,
              36040: 24049,
              36041: 24235,
              36042: 24359,
              36043: 25144,
              36044: 25925,
              36045: 26543,
              36046: 28246,
              36047: 29392,
              36048: 31946,
              36049: 34996,
              36050: 32929,
              36051: 32993,
              36052: 33776,
              36053: 34382,
              36054: 35463,
              36055: 36328,
              36056: 37431,
              36057: 38599,
              36058: 39015,
              36059: 40723,
              36060: 20116,
              36061: 20114,
              36062: 20237,
              36063: 21320,
              36064: 21577,
              36065: 21566,
              36066: 23087,
              36067: 24460,
              36068: 24481,
              36069: 24735,
              36070: 26791,
              36071: 27278,
              36072: 29786,
              36073: 30849,
              36074: 35486,
              36075: 35492,
              36076: 35703,
              36077: 37264,
              36078: 20062,
              36079: 39881,
              36080: 20132,
              36081: 20348,
              36082: 20399,
              36083: 20505,
              36084: 20502,
              36085: 20809,
              36086: 20844,
              36087: 21151,
              36088: 21177,
              36089: 21246,
              36090: 21402,
              36091: 21475,
              36092: 21521,
              36160: 21518,
              36161: 21897,
              36162: 22353,
              36163: 22434,
              36164: 22909,
              36165: 23380,
              36166: 23389,
              36167: 23439,
              36168: 24037,
              36169: 24039,
              36170: 24055,
              36171: 24184,
              36172: 24195,
              36173: 24218,
              36174: 24247,
              36175: 24344,
              36176: 24658,
              36177: 24908,
              36178: 25239,
              36179: 25304,
              36180: 25511,
              36181: 25915,
              36182: 26114,
              36183: 26179,
              36184: 26356,
              36185: 26477,
              36186: 26657,
              36187: 26775,
              36188: 27083,
              36189: 27743,
              36190: 27946,
              36191: 28009,
              36192: 28207,
              36193: 28317,
              36194: 30002,
              36195: 30343,
              36196: 30828,
              36197: 31295,
              36198: 31968,
              36199: 32005,
              36200: 32024,
              36201: 32094,
              36202: 32177,
              36203: 32789,
              36204: 32771,
              36205: 32943,
              36206: 32945,
              36207: 33108,
              36208: 33167,
              36209: 33322,
              36210: 33618,
              36211: 34892,
              36212: 34913,
              36213: 35611,
              36214: 36002,
              36215: 36092,
              36216: 37066,
              36217: 37237,
              36218: 37489,
              36219: 30783,
              36220: 37628,
              36221: 38308,
              36222: 38477,
              36224: 38917,
              36225: 39321,
              36226: 39640,
              36227: 40251,
              36228: 21083,
              36229: 21163,
              36230: 21495,
              36231: 21512,
              36232: 22741,
              36233: 25335,
              36234: 28640,
              36235: 35946,
              36236: 36703,
              36237: 40633,
              36238: 20811,
              36239: 21051,
              36240: 21578,
              36241: 22269,
              36242: 31296,
              36243: 37239,
              36244: 40288,
              36245: 40658,
              36246: 29508,
              36247: 28425,
              36248: 33136,
              36249: 29969,
              36250: 24573,
              36251: 24794,
              36252: 39592,
              36253: 29403,
              36254: 36796,
              36255: 27492,
              36256: 38915,
              36257: 20170,
              36258: 22256,
              36259: 22372,
              36260: 22718,
              36261: 23130,
              36262: 24680,
              36263: 25031,
              36264: 26127,
              36265: 26118,
              36266: 26681,
              36267: 26801,
              36268: 28151,
              36269: 30165,
              36270: 32058,
              36271: 33390,
              36272: 39746,
              36273: 20123,
              36274: 20304,
              36275: 21449,
              36276: 21766,
              36277: 23919,
              36278: 24038,
              36279: 24046,
              36280: 26619,
              36281: 27801,
              36282: 29811,
              36283: 30722,
              36284: 35408,
              36285: 37782,
              36286: 35039,
              36287: 22352,
              36288: 24231,
              36289: 25387,
              36290: 20661,
              36291: 20652,
              36292: 20877,
              36293: 26368,
              36294: 21705,
              36295: 22622,
              36296: 22971,
              36297: 23472,
              36298: 24425,
              36299: 25165,
              36300: 25505,
              36301: 26685,
              36302: 27507,
              36303: 28168,
              36304: 28797,
              36305: 37319,
              36306: 29312,
              36307: 30741,
              36308: 30758,
              36309: 31085,
              36310: 25998,
              36311: 32048,
              36312: 33756,
              36313: 35009,
              36314: 36617,
              36315: 38555,
              36316: 21092,
              36317: 22312,
              36318: 26448,
              36319: 32618,
              36320: 36001,
              36321: 20916,
              36322: 22338,
              36323: 38442,
              36324: 22586,
              36325: 27018,
              36326: 32948,
              36327: 21682,
              36328: 23822,
              36329: 22524,
              36330: 30869,
              36331: 40442,
              36332: 20316,
              36333: 21066,
              36334: 21643,
              36335: 25662,
              36336: 26152,
              36337: 26388,
              36338: 26613,
              36339: 31364,
              36340: 31574,
              36341: 32034,
              36342: 37679,
              36343: 26716,
              36344: 39853,
              36345: 31545,
              36346: 21273,
              36347: 20874,
              36348: 21047,
              36416: 23519,
              36417: 25334,
              36418: 25774,
              36419: 25830,
              36420: 26413,
              36421: 27578,
              36422: 34217,
              36423: 38609,
              36424: 30352,
              36425: 39894,
              36426: 25420,
              36427: 37638,
              36428: 39851,
              36429: 30399,
              36430: 26194,
              36431: 19977,
              36432: 20632,
              36433: 21442,
              36434: 23665,
              36435: 24808,
              36436: 25746,
              36437: 25955,
              36438: 26719,
              36439: 29158,
              36440: 29642,
              36441: 29987,
              36442: 31639,
              36443: 32386,
              36444: 34453,
              36445: 35715,
              36446: 36059,
              36447: 37240,
              36448: 39184,
              36449: 26028,
              36450: 26283,
              36451: 27531,
              36452: 20181,
              36453: 20180,
              36454: 20282,
              36455: 20351,
              36456: 21050,
              36457: 21496,
              36458: 21490,
              36459: 21987,
              36460: 22235,
              36461: 22763,
              36462: 22987,
              36463: 22985,
              36464: 23039,
              36465: 23376,
              36466: 23629,
              36467: 24066,
              36468: 24107,
              36469: 24535,
              36470: 24605,
              36471: 25351,
              36472: 25903,
              36473: 23388,
              36474: 26031,
              36475: 26045,
              36476: 26088,
              36477: 26525,
              36478: 27490,
              36480: 27515,
              36481: 27663,
              36482: 29509,
              36483: 31049,
              36484: 31169,
              36485: 31992,
              36486: 32025,
              36487: 32043,
              36488: 32930,
              36489: 33026,
              36490: 33267,
              36491: 35222,
              36492: 35422,
              36493: 35433,
              36494: 35430,
              36495: 35468,
              36496: 35566,
              36497: 36039,
              36498: 36060,
              36499: 38604,
              36500: 39164,
              36501: 27503,
              36502: 20107,
              36503: 20284,
              36504: 20365,
              36505: 20816,
              36506: 23383,
              36507: 23546,
              36508: 24904,
              36509: 25345,
              36510: 26178,
              36511: 27425,
              36512: 28363,
              36513: 27835,
              36514: 29246,
              36515: 29885,
              36516: 30164,
              36517: 30913,
              36518: 31034,
              36519: 32780,
              36520: 32819,
              36521: 33258,
              36522: 33940,
              36523: 36766,
              36524: 27728,
              36525: 40575,
              36526: 24335,
              36527: 35672,
              36528: 40235,
              36529: 31482,
              36530: 36600,
              36531: 23437,
              36532: 38635,
              36533: 19971,
              36534: 21489,
              36535: 22519,
              36536: 22833,
              36537: 23241,
              36538: 23460,
              36539: 24713,
              36540: 28287,
              36541: 28422,
              36542: 30142,
              36543: 36074,
              36544: 23455,
              36545: 34048,
              36546: 31712,
              36547: 20594,
              36548: 26612,
              36549: 33437,
              36550: 23649,
              36551: 34122,
              36552: 32286,
              36553: 33294,
              36554: 20889,
              36555: 23556,
              36556: 25448,
              36557: 36198,
              36558: 26012,
              36559: 29038,
              36560: 31038,
              36561: 32023,
              36562: 32773,
              36563: 35613,
              36564: 36554,
              36565: 36974,
              36566: 34503,
              36567: 37034,
              36568: 20511,
              36569: 21242,
              36570: 23610,
              36571: 26451,
              36572: 28796,
              36573: 29237,
              36574: 37196,
              36575: 37320,
              36576: 37675,
              36577: 33509,
              36578: 23490,
              36579: 24369,
              36580: 24825,
              36581: 20027,
              36582: 21462,
              36583: 23432,
              36584: 25163,
              36585: 26417,
              36586: 27530,
              36587: 29417,
              36588: 29664,
              36589: 31278,
              36590: 33131,
              36591: 36259,
              36592: 37202,
              36593: 39318,
              36594: 20754,
              36595: 21463,
              36596: 21610,
              36597: 23551,
              36598: 25480,
              36599: 27193,
              36600: 32172,
              36601: 38656,
              36602: 22234,
              36603: 21454,
              36604: 21608,
              36672: 23447,
              36673: 23601,
              36674: 24030,
              36675: 20462,
              36676: 24833,
              36677: 25342,
              36678: 27954,
              36679: 31168,
              36680: 31179,
              36681: 32066,
              36682: 32333,
              36683: 32722,
              36684: 33261,
              36685: 33311,
              36686: 33936,
              36687: 34886,
              36688: 35186,
              36689: 35728,
              36690: 36468,
              36691: 36655,
              36692: 36913,
              36693: 37195,
              36694: 37228,
              36695: 38598,
              36696: 37276,
              36697: 20160,
              36698: 20303,
              36699: 20805,
              36700: 21313,
              36701: 24467,
              36702: 25102,
              36703: 26580,
              36704: 27713,
              36705: 28171,
              36706: 29539,
              36707: 32294,
              36708: 37325,
              36709: 37507,
              36710: 21460,
              36711: 22809,
              36712: 23487,
              36713: 28113,
              36714: 31069,
              36715: 32302,
              36716: 31899,
              36717: 22654,
              36718: 29087,
              36719: 20986,
              36720: 34899,
              36721: 36848,
              36722: 20426,
              36723: 23803,
              36724: 26149,
              36725: 30636,
              36726: 31459,
              36727: 33308,
              36728: 39423,
              36729: 20934,
              36730: 24490,
              36731: 26092,
              36732: 26991,
              36733: 27529,
              36734: 28147,
              36736: 28310,
              36737: 28516,
              36738: 30462,
              36739: 32020,
              36740: 24033,
              36741: 36981,
              36742: 37255,
              36743: 38918,
              36744: 20966,
              36745: 21021,
              36746: 25152,
              36747: 26257,
              36748: 26329,
              36749: 28186,
              36750: 24246,
              36751: 32210,
              36752: 32626,
              36753: 26360,
              36754: 34223,
              36755: 34295,
              36756: 35576,
              36757: 21161,
              36758: 21465,
              36759: 22899,
              36760: 24207,
              36761: 24464,
              36762: 24661,
              36763: 37604,
              36764: 38500,
              36765: 20663,
              36766: 20767,
              36767: 21213,
              36768: 21280,
              36769: 21319,
              36770: 21484,
              36771: 21736,
              36772: 21830,
              36773: 21809,
              36774: 22039,
              36775: 22888,
              36776: 22974,
              36777: 23100,
              36778: 23477,
              36779: 23558,
              36780: 23567,
              36781: 23569,
              36782: 23578,
              36783: 24196,
              36784: 24202,
              36785: 24288,
              36786: 24432,
              36787: 25215,
              36788: 25220,
              36789: 25307,
              36790: 25484,
              36791: 25463,
              36792: 26119,
              36793: 26124,
              36794: 26157,
              36795: 26230,
              36796: 26494,
              36797: 26786,
              36798: 27167,
              36799: 27189,
              36800: 27836,
              36801: 28040,
              36802: 28169,
              36803: 28248,
              36804: 28988,
              36805: 28966,
              36806: 29031,
              36807: 30151,
              36808: 30465,
              36809: 30813,
              36810: 30977,
              36811: 31077,
              36812: 31216,
              36813: 31456,
              36814: 31505,
              36815: 31911,
              36816: 32057,
              36817: 32918,
              36818: 33750,
              36819: 33931,
              36820: 34121,
              36821: 34909,
              36822: 35059,
              36823: 35359,
              36824: 35388,
              36825: 35412,
              36826: 35443,
              36827: 35937,
              36828: 36062,
              36829: 37284,
              36830: 37478,
              36831: 37758,
              36832: 37912,
              36833: 38556,
              36834: 38808,
              36835: 19978,
              36836: 19976,
              36837: 19998,
              36838: 20055,
              36839: 20887,
              36840: 21104,
              36841: 22478,
              36842: 22580,
              36843: 22732,
              36844: 23330,
              36845: 24120,
              36846: 24773,
              36847: 25854,
              36848: 26465,
              36849: 26454,
              36850: 27972,
              36851: 29366,
              36852: 30067,
              36853: 31331,
              36854: 33976,
              36855: 35698,
              36856: 37304,
              36857: 37664,
              36858: 22065,
              36859: 22516,
              36860: 39166,
              36928: 25325,
              36929: 26893,
              36930: 27542,
              36931: 29165,
              36932: 32340,
              36933: 32887,
              36934: 33394,
              36935: 35302,
              36936: 39135,
              36937: 34645,
              36938: 36785,
              36939: 23611,
              36940: 20280,
              36941: 20449,
              36942: 20405,
              36943: 21767,
              36944: 23072,
              36945: 23517,
              36946: 23529,
              36947: 24515,
              36948: 24910,
              36949: 25391,
              36950: 26032,
              36951: 26187,
              36952: 26862,
              36953: 27035,
              36954: 28024,
              36955: 28145,
              36956: 30003,
              36957: 30137,
              36958: 30495,
              36959: 31070,
              36960: 31206,
              36961: 32051,
              36962: 33251,
              36963: 33455,
              36964: 34218,
              36965: 35242,
              36966: 35386,
              36967: 36523,
              36968: 36763,
              36969: 36914,
              36970: 37341,
              36971: 38663,
              36972: 20154,
              36973: 20161,
              36974: 20995,
              36975: 22645,
              36976: 22764,
              36977: 23563,
              36978: 29978,
              36979: 23613,
              36980: 33102,
              36981: 35338,
              36982: 36805,
              36983: 38499,
              36984: 38765,
              36985: 31525,
              36986: 35535,
              36987: 38920,
              36988: 37218,
              36989: 22259,
              36990: 21416,
              36992: 36887,
              36993: 21561,
              36994: 22402,
              36995: 24101,
              36996: 25512,
              36997: 27700,
              36998: 28810,
              36999: 30561,
              37e3: 31883,
              37001: 32736,
              37002: 34928,
              37003: 36930,
              37004: 37204,
              37005: 37648,
              37006: 37656,
              37007: 38543,
              37008: 29790,
              37009: 39620,
              37010: 23815,
              37011: 23913,
              37012: 25968,
              37013: 26530,
              37014: 36264,
              37015: 38619,
              37016: 25454,
              37017: 26441,
              37018: 26905,
              37019: 33733,
              37020: 38935,
              37021: 38592,
              37022: 35070,
              37023: 28548,
              37024: 25722,
              37025: 23544,
              37026: 19990,
              37027: 28716,
              37028: 30045,
              37029: 26159,
              37030: 20932,
              37031: 21046,
              37032: 21218,
              37033: 22995,
              37034: 24449,
              37035: 24615,
              37036: 25104,
              37037: 25919,
              37038: 25972,
              37039: 26143,
              37040: 26228,
              37041: 26866,
              37042: 26646,
              37043: 27491,
              37044: 28165,
              37045: 29298,
              37046: 29983,
              37047: 30427,
              37048: 31934,
              37049: 32854,
              37050: 22768,
              37051: 35069,
              37052: 35199,
              37053: 35488,
              37054: 35475,
              37055: 35531,
              37056: 36893,
              37057: 37266,
              37058: 38738,
              37059: 38745,
              37060: 25993,
              37061: 31246,
              37062: 33030,
              37063: 38587,
              37064: 24109,
              37065: 24796,
              37066: 25114,
              37067: 26021,
              37068: 26132,
              37069: 26512,
              37070: 30707,
              37071: 31309,
              37072: 31821,
              37073: 32318,
              37074: 33034,
              37075: 36012,
              37076: 36196,
              37077: 36321,
              37078: 36447,
              37079: 30889,
              37080: 20999,
              37081: 25305,
              37082: 25509,
              37083: 25666,
              37084: 25240,
              37085: 35373,
              37086: 31363,
              37087: 31680,
              37088: 35500,
              37089: 38634,
              37090: 32118,
              37091: 33292,
              37092: 34633,
              37093: 20185,
              37094: 20808,
              37095: 21315,
              37096: 21344,
              37097: 23459,
              37098: 23554,
              37099: 23574,
              37100: 24029,
              37101: 25126,
              37102: 25159,
              37103: 25776,
              37104: 26643,
              37105: 26676,
              37106: 27849,
              37107: 27973,
              37108: 27927,
              37109: 26579,
              37110: 28508,
              37111: 29006,
              37112: 29053,
              37113: 26059,
              37114: 31359,
              37115: 31661,
              37116: 32218,
              37184: 32330,
              37185: 32680,
              37186: 33146,
              37187: 33307,
              37188: 33337,
              37189: 34214,
              37190: 35438,
              37191: 36046,
              37192: 36341,
              37193: 36984,
              37194: 36983,
              37195: 37549,
              37196: 37521,
              37197: 38275,
              37198: 39854,
              37199: 21069,
              37200: 21892,
              37201: 28472,
              37202: 28982,
              37203: 20840,
              37204: 31109,
              37205: 32341,
              37206: 33203,
              37207: 31950,
              37208: 22092,
              37209: 22609,
              37210: 23720,
              37211: 25514,
              37212: 26366,
              37213: 26365,
              37214: 26970,
              37215: 29401,
              37216: 30095,
              37217: 30094,
              37218: 30990,
              37219: 31062,
              37220: 31199,
              37221: 31895,
              37222: 32032,
              37223: 32068,
              37224: 34311,
              37225: 35380,
              37226: 38459,
              37227: 36961,
              37228: 40736,
              37229: 20711,
              37230: 21109,
              37231: 21452,
              37232: 21474,
              37233: 20489,
              37234: 21930,
              37235: 22766,
              37236: 22863,
              37237: 29245,
              37238: 23435,
              37239: 23652,
              37240: 21277,
              37241: 24803,
              37242: 24819,
              37243: 25436,
              37244: 25475,
              37245: 25407,
              37246: 25531,
              37248: 25805,
              37249: 26089,
              37250: 26361,
              37251: 24035,
              37252: 27085,
              37253: 27133,
              37254: 28437,
              37255: 29157,
              37256: 20105,
              37257: 30185,
              37258: 30456,
              37259: 31379,
              37260: 31967,
              37261: 32207,
              37262: 32156,
              37263: 32865,
              37264: 33609,
              37265: 33624,
              37266: 33900,
              37267: 33980,
              37268: 34299,
              37269: 35013,
              37270: 36208,
              37271: 36865,
              37272: 36973,
              37273: 37783,
              37274: 38684,
              37275: 39442,
              37276: 20687,
              37277: 22679,
              37278: 24974,
              37279: 33235,
              37280: 34101,
              37281: 36104,
              37282: 36896,
              37283: 20419,
              37284: 20596,
              37285: 21063,
              37286: 21363,
              37287: 24687,
              37288: 25417,
              37289: 26463,
              37290: 28204,
              37291: 36275,
              37292: 36895,
              37293: 20439,
              37294: 23646,
              37295: 36042,
              37296: 26063,
              37297: 32154,
              37298: 21330,
              37299: 34966,
              37300: 20854,
              37301: 25539,
              37302: 23384,
              37303: 23403,
              37304: 23562,
              37305: 25613,
              37306: 26449,
              37307: 36956,
              37308: 20182,
              37309: 22810,
              37310: 22826,
              37311: 27760,
              37312: 35409,
              37313: 21822,
              37314: 22549,
              37315: 22949,
              37316: 24816,
              37317: 25171,
              37318: 26561,
              37319: 33333,
              37320: 26965,
              37321: 38464,
              37322: 39364,
              37323: 39464,
              37324: 20307,
              37325: 22534,
              37326: 23550,
              37327: 32784,
              37328: 23729,
              37329: 24111,
              37330: 24453,
              37331: 24608,
              37332: 24907,
              37333: 25140,
              37334: 26367,
              37335: 27888,
              37336: 28382,
              37337: 32974,
              37338: 33151,
              37339: 33492,
              37340: 34955,
              37341: 36024,
              37342: 36864,
              37343: 36910,
              37344: 38538,
              37345: 40667,
              37346: 39899,
              37347: 20195,
              37348: 21488,
              37349: 22823,
              37350: 31532,
              37351: 37261,
              37352: 38988,
              37353: 40441,
              37354: 28381,
              37355: 28711,
              37356: 21331,
              37357: 21828,
              37358: 23429,
              37359: 25176,
              37360: 25246,
              37361: 25299,
              37362: 27810,
              37363: 28655,
              37364: 29730,
              37365: 35351,
              37366: 37944,
              37367: 28609,
              37368: 35582,
              37369: 33592,
              37370: 20967,
              37371: 34552,
              37372: 21482,
              37440: 21481,
              37441: 20294,
              37442: 36948,
              37443: 36784,
              37444: 22890,
              37445: 33073,
              37446: 24061,
              37447: 31466,
              37448: 36799,
              37449: 26842,
              37450: 35895,
              37451: 29432,
              37452: 40008,
              37453: 27197,
              37454: 35504,
              37455: 20025,
              37456: 21336,
              37457: 22022,
              37458: 22374,
              37459: 25285,
              37460: 25506,
              37461: 26086,
              37462: 27470,
              37463: 28129,
              37464: 28251,
              37465: 28845,
              37466: 30701,
              37467: 31471,
              37468: 31658,
              37469: 32187,
              37470: 32829,
              37471: 32966,
              37472: 34507,
              37473: 35477,
              37474: 37723,
              37475: 22243,
              37476: 22727,
              37477: 24382,
              37478: 26029,
              37479: 26262,
              37480: 27264,
              37481: 27573,
              37482: 30007,
              37483: 35527,
              37484: 20516,
              37485: 30693,
              37486: 22320,
              37487: 24347,
              37488: 24677,
              37489: 26234,
              37490: 27744,
              37491: 30196,
              37492: 31258,
              37493: 32622,
              37494: 33268,
              37495: 34584,
              37496: 36933,
              37497: 39347,
              37498: 31689,
              37499: 30044,
              37500: 31481,
              37501: 31569,
              37502: 33988,
              37504: 36880,
              37505: 31209,
              37506: 31378,
              37507: 33590,
              37508: 23265,
              37509: 30528,
              37510: 20013,
              37511: 20210,
              37512: 23449,
              37513: 24544,
              37514: 25277,
              37515: 26172,
              37516: 26609,
              37517: 27880,
              37518: 34411,
              37519: 34935,
              37520: 35387,
              37521: 37198,
              37522: 37619,
              37523: 39376,
              37524: 27159,
              37525: 28710,
              37526: 29482,
              37527: 33511,
              37528: 33879,
              37529: 36015,
              37530: 19969,
              37531: 20806,
              37532: 20939,
              37533: 21899,
              37534: 23541,
              37535: 24086,
              37536: 24115,
              37537: 24193,
              37538: 24340,
              37539: 24373,
              37540: 24427,
              37541: 24500,
              37542: 25074,
              37543: 25361,
              37544: 26274,
              37545: 26397,
              37546: 28526,
              37547: 29266,
              37548: 30010,
              37549: 30522,
              37550: 32884,
              37551: 33081,
              37552: 33144,
              37553: 34678,
              37554: 35519,
              37555: 35548,
              37556: 36229,
              37557: 36339,
              37558: 37530,
              37559: 38263,
              37560: 38914,
              37561: 40165,
              37562: 21189,
              37563: 25431,
              37564: 30452,
              37565: 26389,
              37566: 27784,
              37567: 29645,
              37568: 36035,
              37569: 37806,
              37570: 38515,
              37571: 27941,
              37572: 22684,
              37573: 26894,
              37574: 27084,
              37575: 36861,
              37576: 37786,
              37577: 30171,
              37578: 36890,
              37579: 22618,
              37580: 26626,
              37581: 25524,
              37582: 27131,
              37583: 20291,
              37584: 28460,
              37585: 26584,
              37586: 36795,
              37587: 34086,
              37588: 32180,
              37589: 37716,
              37590: 26943,
              37591: 28528,
              37592: 22378,
              37593: 22775,
              37594: 23340,
              37595: 32044,
              37596: 29226,
              37597: 21514,
              37598: 37347,
              37599: 40372,
              37600: 20141,
              37601: 20302,
              37602: 20572,
              37603: 20597,
              37604: 21059,
              37605: 35998,
              37606: 21576,
              37607: 22564,
              37608: 23450,
              37609: 24093,
              37610: 24213,
              37611: 24237,
              37612: 24311,
              37613: 24351,
              37614: 24716,
              37615: 25269,
              37616: 25402,
              37617: 25552,
              37618: 26799,
              37619: 27712,
              37620: 30855,
              37621: 31118,
              37622: 31243,
              37623: 32224,
              37624: 33351,
              37625: 35330,
              37626: 35558,
              37627: 36420,
              37628: 36883,
              37696: 37048,
              37697: 37165,
              37698: 37336,
              37699: 40718,
              37700: 27877,
              37701: 25688,
              37702: 25826,
              37703: 25973,
              37704: 28404,
              37705: 30340,
              37706: 31515,
              37707: 36969,
              37708: 37841,
              37709: 28346,
              37710: 21746,
              37711: 24505,
              37712: 25764,
              37713: 36685,
              37714: 36845,
              37715: 37444,
              37716: 20856,
              37717: 22635,
              37718: 22825,
              37719: 23637,
              37720: 24215,
              37721: 28155,
              37722: 32399,
              37723: 29980,
              37724: 36028,
              37725: 36578,
              37726: 39003,
              37727: 28857,
              37728: 20253,
              37729: 27583,
              37730: 28593,
              37731: 3e4,
              37732: 38651,
              37733: 20814,
              37734: 21520,
              37735: 22581,
              37736: 22615,
              37737: 22956,
              37738: 23648,
              37739: 24466,
              37740: 26007,
              37741: 26460,
              37742: 28193,
              37743: 30331,
              37744: 33759,
              37745: 36077,
              37746: 36884,
              37747: 37117,
              37748: 37709,
              37749: 30757,
              37750: 30778,
              37751: 21162,
              37752: 24230,
              37753: 22303,
              37754: 22900,
              37755: 24594,
              37756: 20498,
              37757: 20826,
              37758: 20908,
              37760: 20941,
              37761: 20992,
              37762: 21776,
              37763: 22612,
              37764: 22616,
              37765: 22871,
              37766: 23445,
              37767: 23798,
              37768: 23947,
              37769: 24764,
              37770: 25237,
              37771: 25645,
              37772: 26481,
              37773: 26691,
              37774: 26812,
              37775: 26847,
              37776: 30423,
              37777: 28120,
              37778: 28271,
              37779: 28059,
              37780: 28783,
              37781: 29128,
              37782: 24403,
              37783: 30168,
              37784: 31095,
              37785: 31561,
              37786: 31572,
              37787: 31570,
              37788: 31958,
              37789: 32113,
              37790: 21040,
              37791: 33891,
              37792: 34153,
              37793: 34276,
              37794: 35342,
              37795: 35588,
              37796: 35910,
              37797: 36367,
              37798: 36867,
              37799: 36879,
              37800: 37913,
              37801: 38518,
              37802: 38957,
              37803: 39472,
              37804: 38360,
              37805: 20685,
              37806: 21205,
              37807: 21516,
              37808: 22530,
              37809: 23566,
              37810: 24999,
              37811: 25758,
              37812: 27934,
              37813: 30643,
              37814: 31461,
              37815: 33012,
              37816: 33796,
              37817: 36947,
              37818: 37509,
              37819: 23776,
              37820: 40199,
              37821: 21311,
              37822: 24471,
              37823: 24499,
              37824: 28060,
              37825: 29305,
              37826: 30563,
              37827: 31167,
              37828: 31716,
              37829: 27602,
              37830: 29420,
              37831: 35501,
              37832: 26627,
              37833: 27233,
              37834: 20984,
              37835: 31361,
              37836: 26932,
              37837: 23626,
              37838: 40182,
              37839: 33515,
              37840: 23493,
              37841: 37193,
              37842: 28702,
              37843: 22136,
              37844: 23663,
              37845: 24775,
              37846: 25958,
              37847: 27788,
              37848: 35930,
              37849: 36929,
              37850: 38931,
              37851: 21585,
              37852: 26311,
              37853: 37389,
              37854: 22856,
              37855: 37027,
              37856: 20869,
              37857: 20045,
              37858: 20970,
              37859: 34201,
              37860: 35598,
              37861: 28760,
              37862: 25466,
              37863: 37707,
              37864: 26978,
              37865: 39348,
              37866: 32260,
              37867: 30071,
              37868: 21335,
              37869: 26976,
              37870: 36575,
              37871: 38627,
              37872: 27741,
              37873: 20108,
              37874: 23612,
              37875: 24336,
              37876: 36841,
              37877: 21250,
              37878: 36049,
              37879: 32905,
              37880: 34425,
              37881: 24319,
              37882: 26085,
              37883: 20083,
              37884: 20837,
              37952: 22914,
              37953: 23615,
              37954: 38894,
              37955: 20219,
              37956: 22922,
              37957: 24525,
              37958: 35469,
              37959: 28641,
              37960: 31152,
              37961: 31074,
              37962: 23527,
              37963: 33905,
              37964: 29483,
              37965: 29105,
              37966: 24180,
              37967: 24565,
              37968: 25467,
              37969: 25754,
              37970: 29123,
              37971: 31896,
              37972: 20035,
              37973: 24316,
              37974: 20043,
              37975: 22492,
              37976: 22178,
              37977: 24745,
              37978: 28611,
              37979: 32013,
              37980: 33021,
              37981: 33075,
              37982: 33215,
              37983: 36786,
              37984: 35223,
              37985: 34468,
              37986: 24052,
              37987: 25226,
              37988: 25773,
              37989: 35207,
              37990: 26487,
              37991: 27874,
              37992: 27966,
              37993: 29750,
              37994: 30772,
              37995: 23110,
              37996: 32629,
              37997: 33453,
              37998: 39340,
              37999: 20467,
              38e3: 24259,
              38001: 25309,
              38002: 25490,
              38003: 25943,
              38004: 26479,
              38005: 30403,
              38006: 29260,
              38007: 32972,
              38008: 32954,
              38009: 36649,
              38010: 37197,
              38011: 20493,
              38012: 22521,
              38013: 23186,
              38014: 26757,
              38016: 26995,
              38017: 29028,
              38018: 29437,
              38019: 36023,
              38020: 22770,
              38021: 36064,
              38022: 38506,
              38023: 36889,
              38024: 34687,
              38025: 31204,
              38026: 30695,
              38027: 33833,
              38028: 20271,
              38029: 21093,
              38030: 21338,
              38031: 25293,
              38032: 26575,
              38033: 27850,
              38034: 30333,
              38035: 31636,
              38036: 31893,
              38037: 33334,
              38038: 34180,
              38039: 36843,
              38040: 26333,
              38041: 28448,
              38042: 29190,
              38043: 32283,
              38044: 33707,
              38045: 39361,
              38046: 40614,
              38047: 20989,
              38048: 31665,
              38049: 30834,
              38050: 31672,
              38051: 32903,
              38052: 31560,
              38053: 27368,
              38054: 24161,
              38055: 32908,
              38056: 30033,
              38057: 30048,
              38058: 20843,
              38059: 37474,
              38060: 28300,
              38061: 30330,
              38062: 37271,
              38063: 39658,
              38064: 20240,
              38065: 32624,
              38066: 25244,
              38067: 31567,
              38068: 38309,
              38069: 40169,
              38070: 22138,
              38071: 22617,
              38072: 34532,
              38073: 38588,
              38074: 20276,
              38075: 21028,
              38076: 21322,
              38077: 21453,
              38078: 21467,
              38079: 24070,
              38080: 25644,
              38081: 26001,
              38082: 26495,
              38083: 27710,
              38084: 27726,
              38085: 29256,
              38086: 29359,
              38087: 29677,
              38088: 30036,
              38089: 32321,
              38090: 33324,
              38091: 34281,
              38092: 36009,
              38093: 31684,
              38094: 37318,
              38095: 29033,
              38096: 38930,
              38097: 39151,
              38098: 25405,
              38099: 26217,
              38100: 30058,
              38101: 30436,
              38102: 30928,
              38103: 34115,
              38104: 34542,
              38105: 21290,
              38106: 21329,
              38107: 21542,
              38108: 22915,
              38109: 24199,
              38110: 24444,
              38111: 24754,
              38112: 25161,
              38113: 25209,
              38114: 25259,
              38115: 26e3,
              38116: 27604,
              38117: 27852,
              38118: 30130,
              38119: 30382,
              38120: 30865,
              38121: 31192,
              38122: 32203,
              38123: 32631,
              38124: 32933,
              38125: 34987,
              38126: 35513,
              38127: 36027,
              38128: 36991,
              38129: 38750,
              38130: 39131,
              38131: 27147,
              38132: 31800,
              38133: 20633,
              38134: 23614,
              38135: 24494,
              38136: 26503,
              38137: 27608,
              38138: 29749,
              38139: 30473,
              38140: 32654,
              38208: 40763,
              38209: 26570,
              38210: 31255,
              38211: 21305,
              38212: 30091,
              38213: 39661,
              38214: 24422,
              38215: 33181,
              38216: 33777,
              38217: 32920,
              38218: 24380,
              38219: 24517,
              38220: 30050,
              38221: 31558,
              38222: 36924,
              38223: 26727,
              38224: 23019,
              38225: 23195,
              38226: 32016,
              38227: 30334,
              38228: 35628,
              38229: 20469,
              38230: 24426,
              38231: 27161,
              38232: 27703,
              38233: 28418,
              38234: 29922,
              38235: 31080,
              38236: 34920,
              38237: 35413,
              38238: 35961,
              38239: 24287,
              38240: 25551,
              38241: 30149,
              38242: 31186,
              38243: 33495,
              38244: 37672,
              38245: 37618,
              38246: 33948,
              38247: 34541,
              38248: 39981,
              38249: 21697,
              38250: 24428,
              38251: 25996,
              38252: 27996,
              38253: 28693,
              38254: 36007,
              38255: 36051,
              38256: 38971,
              38257: 25935,
              38258: 29942,
              38259: 19981,
              38260: 20184,
              38261: 22496,
              38262: 22827,
              38263: 23142,
              38264: 23500,
              38265: 20904,
              38266: 24067,
              38267: 24220,
              38268: 24598,
              38269: 25206,
              38270: 25975,
              38272: 26023,
              38273: 26222,
              38274: 28014,
              38275: 29238,
              38276: 31526,
              38277: 33104,
              38278: 33178,
              38279: 33433,
              38280: 35676,
              38281: 36e3,
              38282: 36070,
              38283: 36212,
              38284: 38428,
              38285: 38468,
              38286: 20398,
              38287: 25771,
              38288: 27494,
              38289: 33310,
              38290: 33889,
              38291: 34154,
              38292: 37096,
              38293: 23553,
              38294: 26963,
              38295: 39080,
              38296: 33914,
              38297: 34135,
              38298: 20239,
              38299: 21103,
              38300: 24489,
              38301: 24133,
              38302: 26381,
              38303: 31119,
              38304: 33145,
              38305: 35079,
              38306: 35206,
              38307: 28149,
              38308: 24343,
              38309: 25173,
              38310: 27832,
              38311: 20175,
              38312: 29289,
              38313: 39826,
              38314: 20998,
              38315: 21563,
              38316: 22132,
              38317: 22707,
              38318: 24996,
              38319: 25198,
              38320: 28954,
              38321: 22894,
              38322: 31881,
              38323: 31966,
              38324: 32027,
              38325: 38640,
              38326: 25991,
              38327: 32862,
              38328: 19993,
              38329: 20341,
              38330: 20853,
              38331: 22592,
              38332: 24163,
              38333: 24179,
              38334: 24330,
              38335: 26564,
              38336: 20006,
              38337: 34109,
              38338: 38281,
              38339: 38491,
              38340: 31859,
              38341: 38913,
              38342: 20731,
              38343: 22721,
              38344: 30294,
              38345: 30887,
              38346: 21029,
              38347: 30629,
              38348: 34065,
              38349: 31622,
              38350: 20559,
              38351: 22793,
              38352: 29255,
              38353: 31687,
              38354: 32232,
              38355: 36794,
              38356: 36820,
              38357: 36941,
              38358: 20415,
              38359: 21193,
              38360: 23081,
              38361: 24321,
              38362: 38829,
              38363: 20445,
              38364: 33303,
              38365: 37610,
              38366: 22275,
              38367: 25429,
              38368: 27497,
              38369: 29995,
              38370: 35036,
              38371: 36628,
              38372: 31298,
              38373: 21215,
              38374: 22675,
              38375: 24917,
              38376: 25098,
              38377: 26286,
              38378: 27597,
              38379: 31807,
              38380: 33769,
              38381: 20515,
              38382: 20472,
              38383: 21253,
              38384: 21574,
              38385: 22577,
              38386: 22857,
              38387: 23453,
              38388: 23792,
              38389: 23791,
              38390: 23849,
              38391: 24214,
              38392: 25265,
              38393: 25447,
              38394: 25918,
              38395: 26041,
              38396: 26379,
              38464: 27861,
              38465: 27873,
              38466: 28921,
              38467: 30770,
              38468: 32299,
              38469: 32990,
              38470: 33459,
              38471: 33804,
              38472: 34028,
              38473: 34562,
              38474: 35090,
              38475: 35370,
              38476: 35914,
              38477: 37030,
              38478: 37586,
              38479: 39165,
              38480: 40179,
              38481: 40300,
              38482: 20047,
              38483: 20129,
              38484: 20621,
              38485: 21078,
              38486: 22346,
              38487: 22952,
              38488: 24125,
              38489: 24536,
              38490: 24537,
              38491: 25151,
              38492: 26292,
              38493: 26395,
              38494: 26576,
              38495: 26834,
              38496: 20882,
              38497: 32033,
              38498: 32938,
              38499: 33192,
              38500: 35584,
              38501: 35980,
              38502: 36031,
              38503: 37502,
              38504: 38450,
              38505: 21536,
              38506: 38956,
              38507: 21271,
              38508: 20693,
              38509: 21340,
              38510: 22696,
              38511: 25778,
              38512: 26420,
              38513: 29287,
              38514: 30566,
              38515: 31302,
              38516: 37350,
              38517: 21187,
              38518: 27809,
              38519: 27526,
              38520: 22528,
              38521: 24140,
              38522: 22868,
              38523: 26412,
              38524: 32763,
              38525: 20961,
              38526: 30406,
              38528: 25705,
              38529: 30952,
              38530: 39764,
              38531: 40635,
              38532: 22475,
              38533: 22969,
              38534: 26151,
              38535: 26522,
              38536: 27598,
              38537: 21737,
              38538: 27097,
              38539: 24149,
              38540: 33180,
              38541: 26517,
              38542: 39850,
              38543: 26622,
              38544: 40018,
              38545: 26717,
              38546: 20134,
              38547: 20451,
              38548: 21448,
              38549: 25273,
              38550: 26411,
              38551: 27819,
              38552: 36804,
              38553: 20397,
              38554: 32365,
              38555: 40639,
              38556: 19975,
              38557: 24930,
              38558: 28288,
              38559: 28459,
              38560: 34067,
              38561: 21619,
              38562: 26410,
              38563: 39749,
              38564: 24051,
              38565: 31637,
              38566: 23724,
              38567: 23494,
              38568: 34588,
              38569: 28234,
              38570: 34001,
              38571: 31252,
              38572: 33032,
              38573: 22937,
              38574: 31885,
              38575: 27665,
              38576: 30496,
              38577: 21209,
              38578: 22818,
              38579: 28961,
              38580: 29279,
              38581: 30683,
              38582: 38695,
              38583: 40289,
              38584: 26891,
              38585: 23167,
              38586: 23064,
              38587: 20901,
              38588: 21517,
              38589: 21629,
              38590: 26126,
              38591: 30431,
              38592: 36855,
              38593: 37528,
              38594: 40180,
              38595: 23018,
              38596: 29277,
              38597: 28357,
              38598: 20813,
              38599: 26825,
              38600: 32191,
              38601: 32236,
              38602: 38754,
              38603: 40634,
              38604: 25720,
              38605: 27169,
              38606: 33538,
              38607: 22916,
              38608: 23391,
              38609: 27611,
              38610: 29467,
              38611: 30450,
              38612: 32178,
              38613: 32791,
              38614: 33945,
              38615: 20786,
              38616: 26408,
              38617: 40665,
              38618: 30446,
              38619: 26466,
              38620: 21247,
              38621: 39173,
              38622: 23588,
              38623: 25147,
              38624: 31870,
              38625: 36016,
              38626: 21839,
              38627: 24758,
              38628: 32011,
              38629: 38272,
              38630: 21249,
              38631: 20063,
              38632: 20918,
              38633: 22812,
              38634: 29242,
              38635: 32822,
              38636: 37326,
              38637: 24357,
              38638: 30690,
              38639: 21380,
              38640: 24441,
              38641: 32004,
              38642: 34220,
              38643: 35379,
              38644: 36493,
              38645: 38742,
              38646: 26611,
              38647: 34222,
              38648: 37971,
              38649: 24841,
              38650: 24840,
              38651: 27833,
              38652: 30290,
              38720: 35565,
              38721: 36664,
              38722: 21807,
              38723: 20305,
              38724: 20778,
              38725: 21191,
              38726: 21451,
              38727: 23461,
              38728: 24189,
              38729: 24736,
              38730: 24962,
              38731: 25558,
              38732: 26377,
              38733: 26586,
              38734: 28263,
              38735: 28044,
              38736: 29494,
              38737: 29495,
              38738: 30001,
              38739: 31056,
              38740: 35029,
              38741: 35480,
              38742: 36938,
              38743: 37009,
              38744: 37109,
              38745: 38596,
              38746: 34701,
              38747: 22805,
              38748: 20104,
              38749: 20313,
              38750: 19982,
              38751: 35465,
              38752: 36671,
              38753: 38928,
              38754: 20653,
              38755: 24188,
              38756: 22934,
              38757: 23481,
              38758: 24248,
              38759: 25562,
              38760: 25594,
              38761: 25793,
              38762: 26332,
              38763: 26954,
              38764: 27096,
              38765: 27915,
              38766: 28342,
              38767: 29076,
              38768: 29992,
              38769: 31407,
              38770: 32650,
              38771: 32768,
              38772: 33865,
              38773: 33993,
              38774: 35201,
              38775: 35617,
              38776: 36362,
              38777: 36965,
              38778: 38525,
              38779: 39178,
              38780: 24958,
              38781: 25233,
              38782: 27442,
              38784: 27779,
              38785: 28020,
              38786: 32716,
              38787: 32764,
              38788: 28096,
              38789: 32645,
              38790: 34746,
              38791: 35064,
              38792: 26469,
              38793: 33713,
              38794: 38972,
              38795: 38647,
              38796: 27931,
              38797: 32097,
              38798: 33853,
              38799: 37226,
              38800: 20081,
              38801: 21365,
              38802: 23888,
              38803: 27396,
              38804: 28651,
              38805: 34253,
              38806: 34349,
              38807: 35239,
              38808: 21033,
              38809: 21519,
              38810: 23653,
              38811: 26446,
              38812: 26792,
              38813: 29702,
              38814: 29827,
              38815: 30178,
              38816: 35023,
              38817: 35041,
              38818: 37324,
              38819: 38626,
              38820: 38520,
              38821: 24459,
              38822: 29575,
              38823: 31435,
              38824: 33870,
              38825: 25504,
              38826: 30053,
              38827: 21129,
              38828: 27969,
              38829: 28316,
              38830: 29705,
              38831: 30041,
              38832: 30827,
              38833: 31890,
              38834: 38534,
              38835: 31452,
              38836: 40845,
              38837: 20406,
              38838: 24942,
              38839: 26053,
              38840: 34396,
              38841: 20102,
              38842: 20142,
              38843: 20698,
              38844: 20001,
              38845: 20940,
              38846: 23534,
              38847: 26009,
              38848: 26753,
              38849: 28092,
              38850: 29471,
              38851: 30274,
              38852: 30637,
              38853: 31260,
              38854: 31975,
              38855: 33391,
              38856: 35538,
              38857: 36988,
              38858: 37327,
              38859: 38517,
              38860: 38936,
              38861: 21147,
              38862: 32209,
              38863: 20523,
              38864: 21400,
              38865: 26519,
              38866: 28107,
              38867: 29136,
              38868: 29747,
              38869: 33256,
              38870: 36650,
              38871: 38563,
              38872: 40023,
              38873: 40607,
              38874: 29792,
              38875: 22593,
              38876: 28057,
              38877: 32047,
              38878: 39006,
              38879: 20196,
              38880: 20278,
              38881: 20363,
              38882: 20919,
              38883: 21169,
              38884: 23994,
              38885: 24604,
              38886: 29618,
              38887: 31036,
              38888: 33491,
              38889: 37428,
              38890: 38583,
              38891: 38646,
              38892: 38666,
              38893: 40599,
              38894: 40802,
              38895: 26278,
              38896: 27508,
              38897: 21015,
              38898: 21155,
              38899: 28872,
              38900: 35010,
              38901: 24265,
              38902: 24651,
              38903: 24976,
              38904: 28451,
              38905: 29001,
              38906: 31806,
              38907: 32244,
              38908: 32879,
              38976: 34030,
              38977: 36899,
              38978: 37676,
              38979: 21570,
              38980: 39791,
              38981: 27347,
              38982: 28809,
              38983: 36034,
              38984: 36335,
              38985: 38706,
              38986: 21172,
              38987: 23105,
              38988: 24266,
              38989: 24324,
              38990: 26391,
              38991: 27004,
              38992: 27028,
              38993: 28010,
              38994: 28431,
              38995: 29282,
              38996: 29436,
              38997: 31725,
              38998: 32769,
              38999: 32894,
              39e3: 34635,
              39001: 37070,
              39002: 20845,
              39003: 40595,
              39004: 31108,
              39005: 32907,
              39006: 37682,
              39007: 35542,
              39008: 20525,
              39009: 21644,
              39010: 35441,
              39011: 27498,
              39012: 36036,
              39013: 33031,
              39014: 24785,
              39015: 26528,
              39016: 40434,
              39017: 20121,
              39018: 20120,
              39019: 39952,
              39020: 35435,
              39021: 34241,
              39022: 34152,
              39023: 26880,
              39024: 28286,
              39025: 30871,
              39026: 33109,
              39071: 24332,
              39072: 19984,
              39073: 19989,
              39074: 20010,
              39075: 20017,
              39076: 20022,
              39077: 20028,
              39078: 20031,
              39079: 20034,
              39080: 20054,
              39081: 20056,
              39082: 20098,
              39083: 20101,
              39084: 35947,
              39085: 20106,
              39086: 33298,
              39087: 24333,
              39088: 20110,
              39089: 20126,
              39090: 20127,
              39091: 20128,
              39092: 20130,
              39093: 20144,
              39094: 20147,
              39095: 20150,
              39096: 20174,
              39097: 20173,
              39098: 20164,
              39099: 20166,
              39100: 20162,
              39101: 20183,
              39102: 20190,
              39103: 20205,
              39104: 20191,
              39105: 20215,
              39106: 20233,
              39107: 20314,
              39108: 20272,
              39109: 20315,
              39110: 20317,
              39111: 20311,
              39112: 20295,
              39113: 20342,
              39114: 20360,
              39115: 20367,
              39116: 20376,
              39117: 20347,
              39118: 20329,
              39119: 20336,
              39120: 20369,
              39121: 20335,
              39122: 20358,
              39123: 20374,
              39124: 20760,
              39125: 20436,
              39126: 20447,
              39127: 20430,
              39128: 20440,
              39129: 20443,
              39130: 20433,
              39131: 20442,
              39132: 20432,
              39133: 20452,
              39134: 20453,
              39135: 20506,
              39136: 20520,
              39137: 20500,
              39138: 20522,
              39139: 20517,
              39140: 20485,
              39141: 20252,
              39142: 20470,
              39143: 20513,
              39144: 20521,
              39145: 20524,
              39146: 20478,
              39147: 20463,
              39148: 20497,
              39149: 20486,
              39150: 20547,
              39151: 20551,
              39152: 26371,
              39153: 20565,
              39154: 20560,
              39155: 20552,
              39156: 20570,
              39157: 20566,
              39158: 20588,
              39159: 20600,
              39160: 20608,
              39161: 20634,
              39162: 20613,
              39163: 20660,
              39164: 20658,
              39232: 20681,
              39233: 20682,
              39234: 20659,
              39235: 20674,
              39236: 20694,
              39237: 20702,
              39238: 20709,
              39239: 20717,
              39240: 20707,
              39241: 20718,
              39242: 20729,
              39243: 20725,
              39244: 20745,
              39245: 20737,
              39246: 20738,
              39247: 20758,
              39248: 20757,
              39249: 20756,
              39250: 20762,
              39251: 20769,
              39252: 20794,
              39253: 20791,
              39254: 20796,
              39255: 20795,
              39256: 20799,
              39257: 20800,
              39258: 20818,
              39259: 20812,
              39260: 20820,
              39261: 20834,
              39262: 31480,
              39263: 20841,
              39264: 20842,
              39265: 20846,
              39266: 20864,
              39267: 20866,
              39268: 22232,
              39269: 20876,
              39270: 20873,
              39271: 20879,
              39272: 20881,
              39273: 20883,
              39274: 20885,
              39275: 20886,
              39276: 20900,
              39277: 20902,
              39278: 20898,
              39279: 20905,
              39280: 20906,
              39281: 20907,
              39282: 20915,
              39283: 20913,
              39284: 20914,
              39285: 20912,
              39286: 20917,
              39287: 20925,
              39288: 20933,
              39289: 20937,
              39290: 20955,
              39291: 20960,
              39292: 34389,
              39293: 20969,
              39294: 20973,
              39296: 20976,
              39297: 20981,
              39298: 20990,
              39299: 20996,
              39300: 21003,
              39301: 21012,
              39302: 21006,
              39303: 21031,
              39304: 21034,
              39305: 21038,
              39306: 21043,
              39307: 21049,
              39308: 21071,
              39309: 21060,
              39310: 21067,
              39311: 21068,
              39312: 21086,
              39313: 21076,
              39314: 21098,
              39315: 21108,
              39316: 21097,
              39317: 21107,
              39318: 21119,
              39319: 21117,
              39320: 21133,
              39321: 21140,
              39322: 21138,
              39323: 21105,
              39324: 21128,
              39325: 21137,
              39326: 36776,
              39327: 36775,
              39328: 21164,
              39329: 21165,
              39330: 21180,
              39331: 21173,
              39332: 21185,
              39333: 21197,
              39334: 21207,
              39335: 21214,
              39336: 21219,
              39337: 21222,
              39338: 39149,
              39339: 21216,
              39340: 21235,
              39341: 21237,
              39342: 21240,
              39343: 21241,
              39344: 21254,
              39345: 21256,
              39346: 30008,
              39347: 21261,
              39348: 21264,
              39349: 21263,
              39350: 21269,
              39351: 21274,
              39352: 21283,
              39353: 21295,
              39354: 21297,
              39355: 21299,
              39356: 21304,
              39357: 21312,
              39358: 21318,
              39359: 21317,
              39360: 19991,
              39361: 21321,
              39362: 21325,
              39363: 20950,
              39364: 21342,
              39365: 21353,
              39366: 21358,
              39367: 22808,
              39368: 21371,
              39369: 21367,
              39370: 21378,
              39371: 21398,
              39372: 21408,
              39373: 21414,
              39374: 21413,
              39375: 21422,
              39376: 21424,
              39377: 21430,
              39378: 21443,
              39379: 31762,
              39380: 38617,
              39381: 21471,
              39382: 26364,
              39383: 29166,
              39384: 21486,
              39385: 21480,
              39386: 21485,
              39387: 21498,
              39388: 21505,
              39389: 21565,
              39390: 21568,
              39391: 21548,
              39392: 21549,
              39393: 21564,
              39394: 21550,
              39395: 21558,
              39396: 21545,
              39397: 21533,
              39398: 21582,
              39399: 21647,
              39400: 21621,
              39401: 21646,
              39402: 21599,
              39403: 21617,
              39404: 21623,
              39405: 21616,
              39406: 21650,
              39407: 21627,
              39408: 21632,
              39409: 21622,
              39410: 21636,
              39411: 21648,
              39412: 21638,
              39413: 21703,
              39414: 21666,
              39415: 21688,
              39416: 21669,
              39417: 21676,
              39418: 21700,
              39419: 21704,
              39420: 21672,
              39488: 21675,
              39489: 21698,
              39490: 21668,
              39491: 21694,
              39492: 21692,
              39493: 21720,
              39494: 21733,
              39495: 21734,
              39496: 21775,
              39497: 21780,
              39498: 21757,
              39499: 21742,
              39500: 21741,
              39501: 21754,
              39502: 21730,
              39503: 21817,
              39504: 21824,
              39505: 21859,
              39506: 21836,
              39507: 21806,
              39508: 21852,
              39509: 21829,
              39510: 21846,
              39511: 21847,
              39512: 21816,
              39513: 21811,
              39514: 21853,
              39515: 21913,
              39516: 21888,
              39517: 21679,
              39518: 21898,
              39519: 21919,
              39520: 21883,
              39521: 21886,
              39522: 21912,
              39523: 21918,
              39524: 21934,
              39525: 21884,
              39526: 21891,
              39527: 21929,
              39528: 21895,
              39529: 21928,
              39530: 21978,
              39531: 21957,
              39532: 21983,
              39533: 21956,
              39534: 21980,
              39535: 21988,
              39536: 21972,
              39537: 22036,
              39538: 22007,
              39539: 22038,
              39540: 22014,
              39541: 22013,
              39542: 22043,
              39543: 22009,
              39544: 22094,
              39545: 22096,
              39546: 29151,
              39547: 22068,
              39548: 22070,
              39549: 22066,
              39550: 22072,
              39552: 22123,
              39553: 22116,
              39554: 22063,
              39555: 22124,
              39556: 22122,
              39557: 22150,
              39558: 22144,
              39559: 22154,
              39560: 22176,
              39561: 22164,
              39562: 22159,
              39563: 22181,
              39564: 22190,
              39565: 22198,
              39566: 22196,
              39567: 22210,
              39568: 22204,
              39569: 22209,
              39570: 22211,
              39571: 22208,
              39572: 22216,
              39573: 22222,
              39574: 22225,
              39575: 22227,
              39576: 22231,
              39577: 22254,
              39578: 22265,
              39579: 22272,
              39580: 22271,
              39581: 22276,
              39582: 22281,
              39583: 22280,
              39584: 22283,
              39585: 22285,
              39586: 22291,
              39587: 22296,
              39588: 22294,
              39589: 21959,
              39590: 22300,
              39591: 22310,
              39592: 22327,
              39593: 22328,
              39594: 22350,
              39595: 22331,
              39596: 22336,
              39597: 22351,
              39598: 22377,
              39599: 22464,
              39600: 22408,
              39601: 22369,
              39602: 22399,
              39603: 22409,
              39604: 22419,
              39605: 22432,
              39606: 22451,
              39607: 22436,
              39608: 22442,
              39609: 22448,
              39610: 22467,
              39611: 22470,
              39612: 22484,
              39613: 22482,
              39614: 22483,
              39615: 22538,
              39616: 22486,
              39617: 22499,
              39618: 22539,
              39619: 22553,
              39620: 22557,
              39621: 22642,
              39622: 22561,
              39623: 22626,
              39624: 22603,
              39625: 22640,
              39626: 27584,
              39627: 22610,
              39628: 22589,
              39629: 22649,
              39630: 22661,
              39631: 22713,
              39632: 22687,
              39633: 22699,
              39634: 22714,
              39635: 22750,
              39636: 22715,
              39637: 22712,
              39638: 22702,
              39639: 22725,
              39640: 22739,
              39641: 22737,
              39642: 22743,
              39643: 22745,
              39644: 22744,
              39645: 22757,
              39646: 22748,
              39647: 22756,
              39648: 22751,
              39649: 22767,
              39650: 22778,
              39651: 22777,
              39652: 22779,
              39653: 22780,
              39654: 22781,
              39655: 22786,
              39656: 22794,
              39657: 22800,
              39658: 22811,
              39659: 26790,
              39660: 22821,
              39661: 22828,
              39662: 22829,
              39663: 22834,
              39664: 22840,
              39665: 22846,
              39666: 31442,
              39667: 22869,
              39668: 22864,
              39669: 22862,
              39670: 22874,
              39671: 22872,
              39672: 22882,
              39673: 22880,
              39674: 22887,
              39675: 22892,
              39676: 22889,
              39744: 22904,
              39745: 22913,
              39746: 22941,
              39747: 20318,
              39748: 20395,
              39749: 22947,
              39750: 22962,
              39751: 22982,
              39752: 23016,
              39753: 23004,
              39754: 22925,
              39755: 23001,
              39756: 23002,
              39757: 23077,
              39758: 23071,
              39759: 23057,
              39760: 23068,
              39761: 23049,
              39762: 23066,
              39763: 23104,
              39764: 23148,
              39765: 23113,
              39766: 23093,
              39767: 23094,
              39768: 23138,
              39769: 23146,
              39770: 23194,
              39771: 23228,
              39772: 23230,
              39773: 23243,
              39774: 23234,
              39775: 23229,
              39776: 23267,
              39777: 23255,
              39778: 23270,
              39779: 23273,
              39780: 23254,
              39781: 23290,
              39782: 23291,
              39783: 23308,
              39784: 23307,
              39785: 23318,
              39786: 23346,
              39787: 23248,
              39788: 23338,
              39789: 23350,
              39790: 23358,
              39791: 23363,
              39792: 23365,
              39793: 23360,
              39794: 23377,
              39795: 23381,
              39796: 23386,
              39797: 23387,
              39798: 23397,
              39799: 23401,
              39800: 23408,
              39801: 23411,
              39802: 23413,
              39803: 23416,
              39804: 25992,
              39805: 23418,
              39806: 23424,
              39808: 23427,
              39809: 23462,
              39810: 23480,
              39811: 23491,
              39812: 23495,
              39813: 23497,
              39814: 23508,
              39815: 23504,
              39816: 23524,
              39817: 23526,
              39818: 23522,
              39819: 23518,
              39820: 23525,
              39821: 23531,
              39822: 23536,
              39823: 23542,
              39824: 23539,
              39825: 23557,
              39826: 23559,
              39827: 23560,
              39828: 23565,
              39829: 23571,
              39830: 23584,
              39831: 23586,
              39832: 23592,
              39833: 23608,
              39834: 23609,
              39835: 23617,
              39836: 23622,
              39837: 23630,
              39838: 23635,
              39839: 23632,
              39840: 23631,
              39841: 23409,
              39842: 23660,
              39843: 23662,
              39844: 20066,
              39845: 23670,
              39846: 23673,
              39847: 23692,
              39848: 23697,
              39849: 23700,
              39850: 22939,
              39851: 23723,
              39852: 23739,
              39853: 23734,
              39854: 23740,
              39855: 23735,
              39856: 23749,
              39857: 23742,
              39858: 23751,
              39859: 23769,
              39860: 23785,
              39861: 23805,
              39862: 23802,
              39863: 23789,
              39864: 23948,
              39865: 23786,
              39866: 23819,
              39867: 23829,
              39868: 23831,
              39869: 23900,
              39870: 23839,
              39871: 23835,
              39872: 23825,
              39873: 23828,
              39874: 23842,
              39875: 23834,
              39876: 23833,
              39877: 23832,
              39878: 23884,
              39879: 23890,
              39880: 23886,
              39881: 23883,
              39882: 23916,
              39883: 23923,
              39884: 23926,
              39885: 23943,
              39886: 23940,
              39887: 23938,
              39888: 23970,
              39889: 23965,
              39890: 23980,
              39891: 23982,
              39892: 23997,
              39893: 23952,
              39894: 23991,
              39895: 23996,
              39896: 24009,
              39897: 24013,
              39898: 24019,
              39899: 24018,
              39900: 24022,
              39901: 24027,
              39902: 24043,
              39903: 24050,
              39904: 24053,
              39905: 24075,
              39906: 24090,
              39907: 24089,
              39908: 24081,
              39909: 24091,
              39910: 24118,
              39911: 24119,
              39912: 24132,
              39913: 24131,
              39914: 24128,
              39915: 24142,
              39916: 24151,
              39917: 24148,
              39918: 24159,
              39919: 24162,
              39920: 24164,
              39921: 24135,
              39922: 24181,
              39923: 24182,
              39924: 24186,
              39925: 40636,
              39926: 24191,
              39927: 24224,
              39928: 24257,
              39929: 24258,
              39930: 24264,
              39931: 24272,
              39932: 24271,
              4e4: 24278,
              40001: 24291,
              40002: 24285,
              40003: 24282,
              40004: 24283,
              40005: 24290,
              40006: 24289,
              40007: 24296,
              40008: 24297,
              40009: 24300,
              40010: 24305,
              40011: 24307,
              40012: 24304,
              40013: 24308,
              40014: 24312,
              40015: 24318,
              40016: 24323,
              40017: 24329,
              40018: 24413,
              40019: 24412,
              40020: 24331,
              40021: 24337,
              40022: 24342,
              40023: 24361,
              40024: 24365,
              40025: 24376,
              40026: 24385,
              40027: 24392,
              40028: 24396,
              40029: 24398,
              40030: 24367,
              40031: 24401,
              40032: 24406,
              40033: 24407,
              40034: 24409,
              40035: 24417,
              40036: 24429,
              40037: 24435,
              40038: 24439,
              40039: 24451,
              40040: 24450,
              40041: 24447,
              40042: 24458,
              40043: 24456,
              40044: 24465,
              40045: 24455,
              40046: 24478,
              40047: 24473,
              40048: 24472,
              40049: 24480,
              40050: 24488,
              40051: 24493,
              40052: 24508,
              40053: 24534,
              40054: 24571,
              40055: 24548,
              40056: 24568,
              40057: 24561,
              40058: 24541,
              40059: 24755,
              40060: 24575,
              40061: 24609,
              40062: 24672,
              40064: 24601,
              40065: 24592,
              40066: 24617,
              40067: 24590,
              40068: 24625,
              40069: 24603,
              40070: 24597,
              40071: 24619,
              40072: 24614,
              40073: 24591,
              40074: 24634,
              40075: 24666,
              40076: 24641,
              40077: 24682,
              40078: 24695,
              40079: 24671,
              40080: 24650,
              40081: 24646,
              40082: 24653,
              40083: 24675,
              40084: 24643,
              40085: 24676,
              40086: 24642,
              40087: 24684,
              40088: 24683,
              40089: 24665,
              40090: 24705,
              40091: 24717,
              40092: 24807,
              40093: 24707,
              40094: 24730,
              40095: 24708,
              40096: 24731,
              40097: 24726,
              40098: 24727,
              40099: 24722,
              40100: 24743,
              40101: 24715,
              40102: 24801,
              40103: 24760,
              40104: 24800,
              40105: 24787,
              40106: 24756,
              40107: 24560,
              40108: 24765,
              40109: 24774,
              40110: 24757,
              40111: 24792,
              40112: 24909,
              40113: 24853,
              40114: 24838,
              40115: 24822,
              40116: 24823,
              40117: 24832,
              40118: 24820,
              40119: 24826,
              40120: 24835,
              40121: 24865,
              40122: 24827,
              40123: 24817,
              40124: 24845,
              40125: 24846,
              40126: 24903,
              40127: 24894,
              40128: 24872,
              40129: 24871,
              40130: 24906,
              40131: 24895,
              40132: 24892,
              40133: 24876,
              40134: 24884,
              40135: 24893,
              40136: 24898,
              40137: 24900,
              40138: 24947,
              40139: 24951,
              40140: 24920,
              40141: 24921,
              40142: 24922,
              40143: 24939,
              40144: 24948,
              40145: 24943,
              40146: 24933,
              40147: 24945,
              40148: 24927,
              40149: 24925,
              40150: 24915,
              40151: 24949,
              40152: 24985,
              40153: 24982,
              40154: 24967,
              40155: 25004,
              40156: 24980,
              40157: 24986,
              40158: 24970,
              40159: 24977,
              40160: 25003,
              40161: 25006,
              40162: 25036,
              40163: 25034,
              40164: 25033,
              40165: 25079,
              40166: 25032,
              40167: 25027,
              40168: 25030,
              40169: 25018,
              40170: 25035,
              40171: 32633,
              40172: 25037,
              40173: 25062,
              40174: 25059,
              40175: 25078,
              40176: 25082,
              40177: 25076,
              40178: 25087,
              40179: 25085,
              40180: 25084,
              40181: 25086,
              40182: 25088,
              40183: 25096,
              40184: 25097,
              40185: 25101,
              40186: 25100,
              40187: 25108,
              40188: 25115,
              40256: 25118,
              40257: 25121,
              40258: 25130,
              40259: 25134,
              40260: 25136,
              40261: 25138,
              40262: 25139,
              40263: 25153,
              40264: 25166,
              40265: 25182,
              40266: 25187,
              40267: 25179,
              40268: 25184,
              40269: 25192,
              40270: 25212,
              40271: 25218,
              40272: 25225,
              40273: 25214,
              40274: 25234,
              40275: 25235,
              40276: 25238,
              40277: 25300,
              40278: 25219,
              40279: 25236,
              40280: 25303,
              40281: 25297,
              40282: 25275,
              40283: 25295,
              40284: 25343,
              40285: 25286,
              40286: 25812,
              40287: 25288,
              40288: 25308,
              40289: 25292,
              40290: 25290,
              40291: 25282,
              40292: 25287,
              40293: 25243,
              40294: 25289,
              40295: 25356,
              40296: 25326,
              40297: 25329,
              40298: 25383,
              40299: 25346,
              40300: 25352,
              40301: 25327,
              40302: 25333,
              40303: 25424,
              40304: 25406,
              40305: 25421,
              40306: 25628,
              40307: 25423,
              40308: 25494,
              40309: 25486,
              40310: 25472,
              40311: 25515,
              40312: 25462,
              40313: 25507,
              40314: 25487,
              40315: 25481,
              40316: 25503,
              40317: 25525,
              40318: 25451,
              40320: 25449,
              40321: 25534,
              40322: 25577,
              40323: 25536,
              40324: 25542,
              40325: 25571,
              40326: 25545,
              40327: 25554,
              40328: 25590,
              40329: 25540,
              40330: 25622,
              40331: 25652,
              40332: 25606,
              40333: 25619,
              40334: 25638,
              40335: 25654,
              40336: 25885,
              40337: 25623,
              40338: 25640,
              40339: 25615,
              40340: 25703,
              40341: 25711,
              40342: 25718,
              40343: 25678,
              40344: 25898,
              40345: 25749,
              40346: 25747,
              40347: 25765,
              40348: 25769,
              40349: 25736,
              40350: 25788,
              40351: 25818,
              40352: 25810,
              40353: 25797,
              40354: 25799,
              40355: 25787,
              40356: 25816,
              40357: 25794,
              40358: 25841,
              40359: 25831,
              40360: 33289,
              40361: 25824,
              40362: 25825,
              40363: 25260,
              40364: 25827,
              40365: 25839,
              40366: 25900,
              40367: 25846,
              40368: 25844,
              40369: 25842,
              40370: 25850,
              40371: 25856,
              40372: 25853,
              40373: 25880,
              40374: 25884,
              40375: 25861,
              40376: 25892,
              40377: 25891,
              40378: 25899,
              40379: 25908,
              40380: 25909,
              40381: 25911,
              40382: 25910,
              40383: 25912,
              40384: 30027,
              40385: 25928,
              40386: 25942,
              40387: 25941,
              40388: 25933,
              40389: 25944,
              40390: 25950,
              40391: 25949,
              40392: 25970,
              40393: 25976,
              40394: 25986,
              40395: 25987,
              40396: 35722,
              40397: 26011,
              40398: 26015,
              40399: 26027,
              40400: 26039,
              40401: 26051,
              40402: 26054,
              40403: 26049,
              40404: 26052,
              40405: 26060,
              40406: 26066,
              40407: 26075,
              40408: 26073,
              40409: 26080,
              40410: 26081,
              40411: 26097,
              40412: 26482,
              40413: 26122,
              40414: 26115,
              40415: 26107,
              40416: 26483,
              40417: 26165,
              40418: 26166,
              40419: 26164,
              40420: 26140,
              40421: 26191,
              40422: 26180,
              40423: 26185,
              40424: 26177,
              40425: 26206,
              40426: 26205,
              40427: 26212,
              40428: 26215,
              40429: 26216,
              40430: 26207,
              40431: 26210,
              40432: 26224,
              40433: 26243,
              40434: 26248,
              40435: 26254,
              40436: 26249,
              40437: 26244,
              40438: 26264,
              40439: 26269,
              40440: 26305,
              40441: 26297,
              40442: 26313,
              40443: 26302,
              40444: 26300,
              40512: 26308,
              40513: 26296,
              40514: 26326,
              40515: 26330,
              40516: 26336,
              40517: 26175,
              40518: 26342,
              40519: 26345,
              40520: 26352,
              40521: 26357,
              40522: 26359,
              40523: 26383,
              40524: 26390,
              40525: 26398,
              40526: 26406,
              40527: 26407,
              40528: 38712,
              40529: 26414,
              40530: 26431,
              40531: 26422,
              40532: 26433,
              40533: 26424,
              40534: 26423,
              40535: 26438,
              40536: 26462,
              40537: 26464,
              40538: 26457,
              40539: 26467,
              40540: 26468,
              40541: 26505,
              40542: 26480,
              40543: 26537,
              40544: 26492,
              40545: 26474,
              40546: 26508,
              40547: 26507,
              40548: 26534,
              40549: 26529,
              40550: 26501,
              40551: 26551,
              40552: 26607,
              40553: 26548,
              40554: 26604,
              40555: 26547,
              40556: 26601,
              40557: 26552,
              40558: 26596,
              40559: 26590,
              40560: 26589,
              40561: 26594,
              40562: 26606,
              40563: 26553,
              40564: 26574,
              40565: 26566,
              40566: 26599,
              40567: 27292,
              40568: 26654,
              40569: 26694,
              40570: 26665,
              40571: 26688,
              40572: 26701,
              40573: 26674,
              40574: 26702,
              40576: 26803,
              40577: 26667,
              40578: 26713,
              40579: 26723,
              40580: 26743,
              40581: 26751,
              40582: 26783,
              40583: 26767,
              40584: 26797,
              40585: 26772,
              40586: 26781,
              40587: 26779,
              40588: 26755,
              40589: 27310,
              40590: 26809,
              40591: 26740,
              40592: 26805,
              40593: 26784,
              40594: 26810,
              40595: 26895,
              40596: 26765,
              40597: 26750,
              40598: 26881,
              40599: 26826,
              40600: 26888,
              40601: 26840,
              40602: 26914,
              40603: 26918,
              40604: 26849,
              40605: 26892,
              40606: 26829,
              40607: 26836,
              40608: 26855,
              40609: 26837,
              40610: 26934,
              40611: 26898,
              40612: 26884,
              40613: 26839,
              40614: 26851,
              40615: 26917,
              40616: 26873,
              40617: 26848,
              40618: 26863,
              40619: 26920,
              40620: 26922,
              40621: 26906,
              40622: 26915,
              40623: 26913,
              40624: 26822,
              40625: 27001,
              40626: 26999,
              40627: 26972,
              40628: 27e3,
              40629: 26987,
              40630: 26964,
              40631: 27006,
              40632: 26990,
              40633: 26937,
              40634: 26996,
              40635: 26941,
              40636: 26969,
              40637: 26928,
              40638: 26977,
              40639: 26974,
              40640: 26973,
              40641: 27009,
              40642: 26986,
              40643: 27058,
              40644: 27054,
              40645: 27088,
              40646: 27071,
              40647: 27073,
              40648: 27091,
              40649: 27070,
              40650: 27086,
              40651: 23528,
              40652: 27082,
              40653: 27101,
              40654: 27067,
              40655: 27075,
              40656: 27047,
              40657: 27182,
              40658: 27025,
              40659: 27040,
              40660: 27036,
              40661: 27029,
              40662: 27060,
              40663: 27102,
              40664: 27112,
              40665: 27138,
              40666: 27163,
              40667: 27135,
              40668: 27402,
              40669: 27129,
              40670: 27122,
              40671: 27111,
              40672: 27141,
              40673: 27057,
              40674: 27166,
              40675: 27117,
              40676: 27156,
              40677: 27115,
              40678: 27146,
              40679: 27154,
              40680: 27329,
              40681: 27171,
              40682: 27155,
              40683: 27204,
              40684: 27148,
              40685: 27250,
              40686: 27190,
              40687: 27256,
              40688: 27207,
              40689: 27234,
              40690: 27225,
              40691: 27238,
              40692: 27208,
              40693: 27192,
              40694: 27170,
              40695: 27280,
              40696: 27277,
              40697: 27296,
              40698: 27268,
              40699: 27298,
              40700: 27299,
              40768: 27287,
              40769: 34327,
              40770: 27323,
              40771: 27331,
              40772: 27330,
              40773: 27320,
              40774: 27315,
              40775: 27308,
              40776: 27358,
              40777: 27345,
              40778: 27359,
              40779: 27306,
              40780: 27354,
              40781: 27370,
              40782: 27387,
              40783: 27397,
              40784: 34326,
              40785: 27386,
              40786: 27410,
              40787: 27414,
              40788: 39729,
              40789: 27423,
              40790: 27448,
              40791: 27447,
              40792: 30428,
              40793: 27449,
              40794: 39150,
              40795: 27463,
              40796: 27459,
              40797: 27465,
              40798: 27472,
              40799: 27481,
              40800: 27476,
              40801: 27483,
              40802: 27487,
              40803: 27489,
              40804: 27512,
              40805: 27513,
              40806: 27519,
              40807: 27520,
              40808: 27524,
              40809: 27523,
              40810: 27533,
              40811: 27544,
              40812: 27541,
              40813: 27550,
              40814: 27556,
              40815: 27562,
              40816: 27563,
              40817: 27567,
              40818: 27570,
              40819: 27569,
              40820: 27571,
              40821: 27575,
              40822: 27580,
              40823: 27590,
              40824: 27595,
              40825: 27603,
              40826: 27615,
              40827: 27628,
              40828: 27627,
              40829: 27635,
              40830: 27631,
              40832: 40638,
              40833: 27656,
              40834: 27667,
              40835: 27668,
              40836: 27675,
              40837: 27684,
              40838: 27683,
              40839: 27742,
              40840: 27733,
              40841: 27746,
              40842: 27754,
              40843: 27778,
              40844: 27789,
              40845: 27802,
              40846: 27777,
              40847: 27803,
              40848: 27774,
              40849: 27752,
              40850: 27763,
              40851: 27794,
              40852: 27792,
              40853: 27844,
              40854: 27889,
              40855: 27859,
              40856: 27837,
              40857: 27863,
              40858: 27845,
              40859: 27869,
              40860: 27822,
              40861: 27825,
              40862: 27838,
              40863: 27834,
              40864: 27867,
              40865: 27887,
              40866: 27865,
              40867: 27882,
              40868: 27935,
              40869: 34893,
              40870: 27958,
              40871: 27947,
              40872: 27965,
              40873: 27960,
              40874: 27929,
              40875: 27957,
              40876: 27955,
              40877: 27922,
              40878: 27916,
              40879: 28003,
              40880: 28051,
              40881: 28004,
              40882: 27994,
              40883: 28025,
              40884: 27993,
              40885: 28046,
              40886: 28053,
              40887: 28644,
              40888: 28037,
              40889: 28153,
              40890: 28181,
              40891: 28170,
              40892: 28085,
              40893: 28103,
              40894: 28134,
              40895: 28088,
              40896: 28102,
              40897: 28140,
              40898: 28126,
              40899: 28108,
              40900: 28136,
              40901: 28114,
              40902: 28101,
              40903: 28154,
              40904: 28121,
              40905: 28132,
              40906: 28117,
              40907: 28138,
              40908: 28142,
              40909: 28205,
              40910: 28270,
              40911: 28206,
              40912: 28185,
              40913: 28274,
              40914: 28255,
              40915: 28222,
              40916: 28195,
              40917: 28267,
              40918: 28203,
              40919: 28278,
              40920: 28237,
              40921: 28191,
              40922: 28227,
              40923: 28218,
              40924: 28238,
              40925: 28196,
              40926: 28415,
              40927: 28189,
              40928: 28216,
              40929: 28290,
              40930: 28330,
              40931: 28312,
              40932: 28361,
              40933: 28343,
              40934: 28371,
              40935: 28349,
              40936: 28335,
              40937: 28356,
              40938: 28338,
              40939: 28372,
              40940: 28373,
              40941: 28303,
              40942: 28325,
              40943: 28354,
              40944: 28319,
              40945: 28481,
              40946: 28433,
              40947: 28748,
              40948: 28396,
              40949: 28408,
              40950: 28414,
              40951: 28479,
              40952: 28402,
              40953: 28465,
              40954: 28399,
              40955: 28466,
              40956: 28364,
              161: 65377,
              162: 65378,
              163: 65379,
              164: 65380,
              165: 65381,
              166: 65382,
              167: 65383,
              168: 65384,
              169: 65385,
              170: 65386,
              171: 65387,
              172: 65388,
              173: 65389,
              174: 65390,
              175: 65391,
              176: 65392,
              177: 65393,
              178: 65394,
              179: 65395,
              180: 65396,
              181: 65397,
              182: 65398,
              183: 65399,
              184: 65400,
              185: 65401,
              186: 65402,
              187: 65403,
              188: 65404,
              189: 65405,
              190: 65406,
              191: 65407,
              192: 65408,
              193: 65409,
              194: 65410,
              195: 65411,
              196: 65412,
              197: 65413,
              198: 65414,
              199: 65415,
              200: 65416,
              201: 65417,
              202: 65418,
              203: 65419,
              204: 65420,
              205: 65421,
              206: 65422,
              207: 65423,
              208: 65424,
              209: 65425,
              210: 65426,
              211: 65427,
              212: 65428,
              213: 65429,
              214: 65430,
              215: 65431,
              216: 65432,
              217: 65433,
              218: 65434,
              219: 65435,
              220: 65436,
              221: 65437,
              222: 65438,
              223: 65439,
              57408: 28478,
              57409: 28435,
              57410: 28407,
              57411: 28550,
              57412: 28538,
              57413: 28536,
              57414: 28545,
              57415: 28544,
              57416: 28527,
              57417: 28507,
              57418: 28659,
              57419: 28525,
              57420: 28546,
              57421: 28540,
              57422: 28504,
              57423: 28558,
              57424: 28561,
              57425: 28610,
              57426: 28518,
              57427: 28595,
              57428: 28579,
              57429: 28577,
              57430: 28580,
              57431: 28601,
              57432: 28614,
              57433: 28586,
              57434: 28639,
              57435: 28629,
              57436: 28652,
              57437: 28628,
              57438: 28632,
              57439: 28657,
              57440: 28654,
              57441: 28635,
              57442: 28681,
              57443: 28683,
              57444: 28666,
              57445: 28689,
              57446: 28673,
              57447: 28687,
              57448: 28670,
              57449: 28699,
              57450: 28698,
              57451: 28532,
              57452: 28701,
              57453: 28696,
              57454: 28703,
              57455: 28720,
              57456: 28734,
              57457: 28722,
              57458: 28753,
              57459: 28771,
              57460: 28825,
              57461: 28818,
              57462: 28847,
              57463: 28913,
              57464: 28844,
              57465: 28856,
              57466: 28851,
              57467: 28846,
              57468: 28895,
              57469: 28875,
              57470: 28893,
              57472: 28889,
              57473: 28937,
              57474: 28925,
              57475: 28956,
              57476: 28953,
              57477: 29029,
              57478: 29013,
              57479: 29064,
              57480: 29030,
              57481: 29026,
              57482: 29004,
              57483: 29014,
              57484: 29036,
              57485: 29071,
              57486: 29179,
              57487: 29060,
              57488: 29077,
              57489: 29096,
              57490: 29100,
              57491: 29143,
              57492: 29113,
              57493: 29118,
              57494: 29138,
              57495: 29129,
              57496: 29140,
              57497: 29134,
              57498: 29152,
              57499: 29164,
              57500: 29159,
              57501: 29173,
              57502: 29180,
              57503: 29177,
              57504: 29183,
              57505: 29197,
              57506: 29200,
              57507: 29211,
              57508: 29224,
              57509: 29229,
              57510: 29228,
              57511: 29232,
              57512: 29234,
              57513: 29243,
              57514: 29244,
              57515: 29247,
              57516: 29248,
              57517: 29254,
              57518: 29259,
              57519: 29272,
              57520: 29300,
              57521: 29310,
              57522: 29314,
              57523: 29313,
              57524: 29319,
              57525: 29330,
              57526: 29334,
              57527: 29346,
              57528: 29351,
              57529: 29369,
              57530: 29362,
              57531: 29379,
              57532: 29382,
              57533: 29380,
              57534: 29390,
              57535: 29394,
              57536: 29410,
              57537: 29408,
              57538: 29409,
              57539: 29433,
              57540: 29431,
              57541: 20495,
              57542: 29463,
              57543: 29450,
              57544: 29468,
              57545: 29462,
              57546: 29469,
              57547: 29492,
              57548: 29487,
              57549: 29481,
              57550: 29477,
              57551: 29502,
              57552: 29518,
              57553: 29519,
              57554: 40664,
              57555: 29527,
              57556: 29546,
              57557: 29544,
              57558: 29552,
              57559: 29560,
              57560: 29557,
              57561: 29563,
              57562: 29562,
              57563: 29640,
              57564: 29619,
              57565: 29646,
              57566: 29627,
              57567: 29632,
              57568: 29669,
              57569: 29678,
              57570: 29662,
              57571: 29858,
              57572: 29701,
              57573: 29807,
              57574: 29733,
              57575: 29688,
              57576: 29746,
              57577: 29754,
              57578: 29781,
              57579: 29759,
              57580: 29791,
              57581: 29785,
              57582: 29761,
              57583: 29788,
              57584: 29801,
              57585: 29808,
              57586: 29795,
              57587: 29802,
              57588: 29814,
              57589: 29822,
              57590: 29835,
              57591: 29854,
              57592: 29863,
              57593: 29898,
              57594: 29903,
              57595: 29908,
              57596: 29681,
              57664: 29920,
              57665: 29923,
              57666: 29927,
              57667: 29929,
              57668: 29934,
              57669: 29938,
              57670: 29936,
              57671: 29937,
              57672: 29944,
              57673: 29943,
              57674: 29956,
              57675: 29955,
              57676: 29957,
              57677: 29964,
              57678: 29966,
              57679: 29965,
              57680: 29973,
              57681: 29971,
              57682: 29982,
              57683: 29990,
              57684: 29996,
              57685: 30012,
              57686: 30020,
              57687: 30029,
              57688: 30026,
              57689: 30025,
              57690: 30043,
              57691: 30022,
              57692: 30042,
              57693: 30057,
              57694: 30052,
              57695: 30055,
              57696: 30059,
              57697: 30061,
              57698: 30072,
              57699: 30070,
              57700: 30086,
              57701: 30087,
              57702: 30068,
              57703: 30090,
              57704: 30089,
              57705: 30082,
              57706: 30100,
              57707: 30106,
              57708: 30109,
              57709: 30117,
              57710: 30115,
              57711: 30146,
              57712: 30131,
              57713: 30147,
              57714: 30133,
              57715: 30141,
              57716: 30136,
              57717: 30140,
              57718: 30129,
              57719: 30157,
              57720: 30154,
              57721: 30162,
              57722: 30169,
              57723: 30179,
              57724: 30174,
              57725: 30206,
              57726: 30207,
              57728: 30204,
              57729: 30209,
              57730: 30192,
              57731: 30202,
              57732: 30194,
              57733: 30195,
              57734: 30219,
              57735: 30221,
              57736: 30217,
              57737: 30239,
              57738: 30247,
              57739: 30240,
              57740: 30241,
              57741: 30242,
              57742: 30244,
              57743: 30260,
              57744: 30256,
              57745: 30267,
              57746: 30279,
              57747: 30280,
              57748: 30278,
              57749: 30300,
              57750: 30296,
              57751: 30305,
              57752: 30306,
              57753: 30312,
              57754: 30313,
              57755: 30314,
              57756: 30311,
              57757: 30316,
              57758: 30320,
              57759: 30322,
              57760: 30326,
              57761: 30328,
              57762: 30332,
              57763: 30336,
              57764: 30339,
              57765: 30344,
              57766: 30347,
              57767: 30350,
              57768: 30358,
              57769: 30355,
              57770: 30361,
              57771: 30362,
              57772: 30384,
              57773: 30388,
              57774: 30392,
              57775: 30393,
              57776: 30394,
              57777: 30402,
              57778: 30413,
              57779: 30422,
              57780: 30418,
              57781: 30430,
              57782: 30433,
              57783: 30437,
              57784: 30439,
              57785: 30442,
              57786: 34351,
              57787: 30459,
              57788: 30472,
              57789: 30471,
              57790: 30468,
              57791: 30505,
              57792: 30500,
              57793: 30494,
              57794: 30501,
              57795: 30502,
              57796: 30491,
              57797: 30519,
              57798: 30520,
              57799: 30535,
              57800: 30554,
              57801: 30568,
              57802: 30571,
              57803: 30555,
              57804: 30565,
              57805: 30591,
              57806: 30590,
              57807: 30585,
              57808: 30606,
              57809: 30603,
              57810: 30609,
              57811: 30624,
              57812: 30622,
              57813: 30640,
              57814: 30646,
              57815: 30649,
              57816: 30655,
              57817: 30652,
              57818: 30653,
              57819: 30651,
              57820: 30663,
              57821: 30669,
              57822: 30679,
              57823: 30682,
              57824: 30684,
              57825: 30691,
              57826: 30702,
              57827: 30716,
              57828: 30732,
              57829: 30738,
              57830: 31014,
              57831: 30752,
              57832: 31018,
              57833: 30789,
              57834: 30862,
              57835: 30836,
              57836: 30854,
              57837: 30844,
              57838: 30874,
              57839: 30860,
              57840: 30883,
              57841: 30901,
              57842: 30890,
              57843: 30895,
              57844: 30929,
              57845: 30918,
              57846: 30923,
              57847: 30932,
              57848: 30910,
              57849: 30908,
              57850: 30917,
              57851: 30922,
              57852: 30956,
              57920: 30951,
              57921: 30938,
              57922: 30973,
              57923: 30964,
              57924: 30983,
              57925: 30994,
              57926: 30993,
              57927: 31001,
              57928: 31020,
              57929: 31019,
              57930: 31040,
              57931: 31072,
              57932: 31063,
              57933: 31071,
              57934: 31066,
              57935: 31061,
              57936: 31059,
              57937: 31098,
              57938: 31103,
              57939: 31114,
              57940: 31133,
              57941: 31143,
              57942: 40779,
              57943: 31146,
              57944: 31150,
              57945: 31155,
              57946: 31161,
              57947: 31162,
              57948: 31177,
              57949: 31189,
              57950: 31207,
              57951: 31212,
              57952: 31201,
              57953: 31203,
              57954: 31240,
              57955: 31245,
              57956: 31256,
              57957: 31257,
              57958: 31264,
              57959: 31263,
              57960: 31104,
              57961: 31281,
              57962: 31291,
              57963: 31294,
              57964: 31287,
              57965: 31299,
              57966: 31319,
              57967: 31305,
              57968: 31329,
              57969: 31330,
              57970: 31337,
              57971: 40861,
              57972: 31344,
              57973: 31353,
              57974: 31357,
              57975: 31368,
              57976: 31383,
              57977: 31381,
              57978: 31384,
              57979: 31382,
              57980: 31401,
              57981: 31432,
              57982: 31408,
              57984: 31414,
              57985: 31429,
              57986: 31428,
              57987: 31423,
              57988: 36995,
              57989: 31431,
              57990: 31434,
              57991: 31437,
              57992: 31439,
              57993: 31445,
              57994: 31443,
              57995: 31449,
              57996: 31450,
              57997: 31453,
              57998: 31457,
              57999: 31458,
              58e3: 31462,
              58001: 31469,
              58002: 31472,
              58003: 31490,
              58004: 31503,
              58005: 31498,
              58006: 31494,
              58007: 31539,
              58008: 31512,
              58009: 31513,
              58010: 31518,
              58011: 31541,
              58012: 31528,
              58013: 31542,
              58014: 31568,
              58015: 31610,
              58016: 31492,
              58017: 31565,
              58018: 31499,
              58019: 31564,
              58020: 31557,
              58021: 31605,
              58022: 31589,
              58023: 31604,
              58024: 31591,
              58025: 31600,
              58026: 31601,
              58027: 31596,
              58028: 31598,
              58029: 31645,
              58030: 31640,
              58031: 31647,
              58032: 31629,
              58033: 31644,
              58034: 31642,
              58035: 31627,
              58036: 31634,
              58037: 31631,
              58038: 31581,
              58039: 31641,
              58040: 31691,
              58041: 31681,
              58042: 31692,
              58043: 31695,
              58044: 31668,
              58045: 31686,
              58046: 31709,
              58047: 31721,
              58048: 31761,
              58049: 31764,
              58050: 31718,
              58051: 31717,
              58052: 31840,
              58053: 31744,
              58054: 31751,
              58055: 31763,
              58056: 31731,
              58057: 31735,
              58058: 31767,
              58059: 31757,
              58060: 31734,
              58061: 31779,
              58062: 31783,
              58063: 31786,
              58064: 31775,
              58065: 31799,
              58066: 31787,
              58067: 31805,
              58068: 31820,
              58069: 31811,
              58070: 31828,
              58071: 31823,
              58072: 31808,
              58073: 31824,
              58074: 31832,
              58075: 31839,
              58076: 31844,
              58077: 31830,
              58078: 31845,
              58079: 31852,
              58080: 31861,
              58081: 31875,
              58082: 31888,
              58083: 31908,
              58084: 31917,
              58085: 31906,
              58086: 31915,
              58087: 31905,
              58088: 31912,
              58089: 31923,
              58090: 31922,
              58091: 31921,
              58092: 31918,
              58093: 31929,
              58094: 31933,
              58095: 31936,
              58096: 31941,
              58097: 31938,
              58098: 31960,
              58099: 31954,
              58100: 31964,
              58101: 31970,
              58102: 39739,
              58103: 31983,
              58104: 31986,
              58105: 31988,
              58106: 31990,
              58107: 31994,
              58108: 32006,
              58176: 32002,
              58177: 32028,
              58178: 32021,
              58179: 32010,
              58180: 32069,
              58181: 32075,
              58182: 32046,
              58183: 32050,
              58184: 32063,
              58185: 32053,
              58186: 32070,
              58187: 32115,
              58188: 32086,
              58189: 32078,
              58190: 32114,
              58191: 32104,
              58192: 32110,
              58193: 32079,
              58194: 32099,
              58195: 32147,
              58196: 32137,
              58197: 32091,
              58198: 32143,
              58199: 32125,
              58200: 32155,
              58201: 32186,
              58202: 32174,
              58203: 32163,
              58204: 32181,
              58205: 32199,
              58206: 32189,
              58207: 32171,
              58208: 32317,
              58209: 32162,
              58210: 32175,
              58211: 32220,
              58212: 32184,
              58213: 32159,
              58214: 32176,
              58215: 32216,
              58216: 32221,
              58217: 32228,
              58218: 32222,
              58219: 32251,
              58220: 32242,
              58221: 32225,
              58222: 32261,
              58223: 32266,
              58224: 32291,
              58225: 32289,
              58226: 32274,
              58227: 32305,
              58228: 32287,
              58229: 32265,
              58230: 32267,
              58231: 32290,
              58232: 32326,
              58233: 32358,
              58234: 32315,
              58235: 32309,
              58236: 32313,
              58237: 32323,
              58238: 32311,
              58240: 32306,
              58241: 32314,
              58242: 32359,
              58243: 32349,
              58244: 32342,
              58245: 32350,
              58246: 32345,
              58247: 32346,
              58248: 32377,
              58249: 32362,
              58250: 32361,
              58251: 32380,
              58252: 32379,
              58253: 32387,
              58254: 32213,
              58255: 32381,
              58256: 36782,
              58257: 32383,
              58258: 32392,
              58259: 32393,
              58260: 32396,
              58261: 32402,
              58262: 32400,
              58263: 32403,
              58264: 32404,
              58265: 32406,
              58266: 32398,
              58267: 32411,
              58268: 32412,
              58269: 32568,
              58270: 32570,
              58271: 32581,
              58272: 32588,
              58273: 32589,
              58274: 32590,
              58275: 32592,
              58276: 32593,
              58277: 32597,
              58278: 32596,
              58279: 32600,
              58280: 32607,
              58281: 32608,
              58282: 32616,
              58283: 32617,
              58284: 32615,
              58285: 32632,
              58286: 32642,
              58287: 32646,
              58288: 32643,
              58289: 32648,
              58290: 32647,
              58291: 32652,
              58292: 32660,
              58293: 32670,
              58294: 32669,
              58295: 32666,
              58296: 32675,
              58297: 32687,
              58298: 32690,
              58299: 32697,
              58300: 32686,
              58301: 32694,
              58302: 32696,
              58303: 35697,
              58304: 32709,
              58305: 32710,
              58306: 32714,
              58307: 32725,
              58308: 32724,
              58309: 32737,
              58310: 32742,
              58311: 32745,
              58312: 32755,
              58313: 32761,
              58314: 39132,
              58315: 32774,
              58316: 32772,
              58317: 32779,
              58318: 32786,
              58319: 32792,
              58320: 32793,
              58321: 32796,
              58322: 32801,
              58323: 32808,
              58324: 32831,
              58325: 32827,
              58326: 32842,
              58327: 32838,
              58328: 32850,
              58329: 32856,
              58330: 32858,
              58331: 32863,
              58332: 32866,
              58333: 32872,
              58334: 32883,
              58335: 32882,
              58336: 32880,
              58337: 32886,
              58338: 32889,
              58339: 32893,
              58340: 32895,
              58341: 32900,
              58342: 32902,
              58343: 32901,
              58344: 32923,
              58345: 32915,
              58346: 32922,
              58347: 32941,
              58348: 20880,
              58349: 32940,
              58350: 32987,
              58351: 32997,
              58352: 32985,
              58353: 32989,
              58354: 32964,
              58355: 32986,
              58356: 32982,
              58357: 33033,
              58358: 33007,
              58359: 33009,
              58360: 33051,
              58361: 33065,
              58362: 33059,
              58363: 33071,
              58364: 33099,
              58432: 38539,
              58433: 33094,
              58434: 33086,
              58435: 33107,
              58436: 33105,
              58437: 33020,
              58438: 33137,
              58439: 33134,
              58440: 33125,
              58441: 33126,
              58442: 33140,
              58443: 33155,
              58444: 33160,
              58445: 33162,
              58446: 33152,
              58447: 33154,
              58448: 33184,
              58449: 33173,
              58450: 33188,
              58451: 33187,
              58452: 33119,
              58453: 33171,
              58454: 33193,
              58455: 33200,
              58456: 33205,
              58457: 33214,
              58458: 33208,
              58459: 33213,
              58460: 33216,
              58461: 33218,
              58462: 33210,
              58463: 33225,
              58464: 33229,
              58465: 33233,
              58466: 33241,
              58467: 33240,
              58468: 33224,
              58469: 33242,
              58470: 33247,
              58471: 33248,
              58472: 33255,
              58473: 33274,
              58474: 33275,
              58475: 33278,
              58476: 33281,
              58477: 33282,
              58478: 33285,
              58479: 33287,
              58480: 33290,
              58481: 33293,
              58482: 33296,
              58483: 33302,
              58484: 33321,
              58485: 33323,
              58486: 33336,
              58487: 33331,
              58488: 33344,
              58489: 33369,
              58490: 33368,
              58491: 33373,
              58492: 33370,
              58493: 33375,
              58494: 33380,
              58496: 33378,
              58497: 33384,
              58498: 33386,
              58499: 33387,
              58500: 33326,
              58501: 33393,
              58502: 33399,
              58503: 33400,
              58504: 33406,
              58505: 33421,
              58506: 33426,
              58507: 33451,
              58508: 33439,
              58509: 33467,
              58510: 33452,
              58511: 33505,
              58512: 33507,
              58513: 33503,
              58514: 33490,
              58515: 33524,
              58516: 33523,
              58517: 33530,
              58518: 33683,
              58519: 33539,
              58520: 33531,
              58521: 33529,
              58522: 33502,
              58523: 33542,
              58524: 33500,
              58525: 33545,
              58526: 33497,
              58527: 33589,
              58528: 33588,
              58529: 33558,
              58530: 33586,
              58531: 33585,
              58532: 33600,
              58533: 33593,
              58534: 33616,
              58535: 33605,
              58536: 33583,
              58537: 33579,
              58538: 33559,
              58539: 33560,
              58540: 33669,
              58541: 33690,
              58542: 33706,
              58543: 33695,
              58544: 33698,
              58545: 33686,
              58546: 33571,
              58547: 33678,
              58548: 33671,
              58549: 33674,
              58550: 33660,
              58551: 33717,
              58552: 33651,
              58553: 33653,
              58554: 33696,
              58555: 33673,
              58556: 33704,
              58557: 33780,
              58558: 33811,
              58559: 33771,
              58560: 33742,
              58561: 33789,
              58562: 33795,
              58563: 33752,
              58564: 33803,
              58565: 33729,
              58566: 33783,
              58567: 33799,
              58568: 33760,
              58569: 33778,
              58570: 33805,
              58571: 33826,
              58572: 33824,
              58573: 33725,
              58574: 33848,
              58575: 34054,
              58576: 33787,
              58577: 33901,
              58578: 33834,
              58579: 33852,
              58580: 34138,
              58581: 33924,
              58582: 33911,
              58583: 33899,
              58584: 33965,
              58585: 33902,
              58586: 33922,
              58587: 33897,
              58588: 33862,
              58589: 33836,
              58590: 33903,
              58591: 33913,
              58592: 33845,
              58593: 33994,
              58594: 33890,
              58595: 33977,
              58596: 33983,
              58597: 33951,
              58598: 34009,
              58599: 33997,
              58600: 33979,
              58601: 34010,
              58602: 34e3,
              58603: 33985,
              58604: 33990,
              58605: 34006,
              58606: 33953,
              58607: 34081,
              58608: 34047,
              58609: 34036,
              58610: 34071,
              58611: 34072,
              58612: 34092,
              58613: 34079,
              58614: 34069,
              58615: 34068,
              58616: 34044,
              58617: 34112,
              58618: 34147,
              58619: 34136,
              58620: 34120,
              58688: 34113,
              58689: 34306,
              58690: 34123,
              58691: 34133,
              58692: 34176,
              58693: 34212,
              58694: 34184,
              58695: 34193,
              58696: 34186,
              58697: 34216,
              58698: 34157,
              58699: 34196,
              58700: 34203,
              58701: 34282,
              58702: 34183,
              58703: 34204,
              58704: 34167,
              58705: 34174,
              58706: 34192,
              58707: 34249,
              58708: 34234,
              58709: 34255,
              58710: 34233,
              58711: 34256,
              58712: 34261,
              58713: 34269,
              58714: 34277,
              58715: 34268,
              58716: 34297,
              58717: 34314,
              58718: 34323,
              58719: 34315,
              58720: 34302,
              58721: 34298,
              58722: 34310,
              58723: 34338,
              58724: 34330,
              58725: 34352,
              58726: 34367,
              58727: 34381,
              58728: 20053,
              58729: 34388,
              58730: 34399,
              58731: 34407,
              58732: 34417,
              58733: 34451,
              58734: 34467,
              58735: 34473,
              58736: 34474,
              58737: 34443,
              58738: 34444,
              58739: 34486,
              58740: 34479,
              58741: 34500,
              58742: 34502,
              58743: 34480,
              58744: 34505,
              58745: 34851,
              58746: 34475,
              58747: 34516,
              58748: 34526,
              58749: 34537,
              58750: 34540,
              58752: 34527,
              58753: 34523,
              58754: 34543,
              58755: 34578,
              58756: 34566,
              58757: 34568,
              58758: 34560,
              58759: 34563,
              58760: 34555,
              58761: 34577,
              58762: 34569,
              58763: 34573,
              58764: 34553,
              58765: 34570,
              58766: 34612,
              58767: 34623,
              58768: 34615,
              58769: 34619,
              58770: 34597,
              58771: 34601,
              58772: 34586,
              58773: 34656,
              58774: 34655,
              58775: 34680,
              58776: 34636,
              58777: 34638,
              58778: 34676,
              58779: 34647,
              58780: 34664,
              58781: 34670,
              58782: 34649,
              58783: 34643,
              58784: 34659,
              58785: 34666,
              58786: 34821,
              58787: 34722,
              58788: 34719,
              58789: 34690,
              58790: 34735,
              58791: 34763,
              58792: 34749,
              58793: 34752,
              58794: 34768,
              58795: 38614,
              58796: 34731,
              58797: 34756,
              58798: 34739,
              58799: 34759,
              58800: 34758,
              58801: 34747,
              58802: 34799,
              58803: 34802,
              58804: 34784,
              58805: 34831,
              58806: 34829,
              58807: 34814,
              58808: 34806,
              58809: 34807,
              58810: 34830,
              58811: 34770,
              58812: 34833,
              58813: 34838,
              58814: 34837,
              58815: 34850,
              58816: 34849,
              58817: 34865,
              58818: 34870,
              58819: 34873,
              58820: 34855,
              58821: 34875,
              58822: 34884,
              58823: 34882,
              58824: 34898,
              58825: 34905,
              58826: 34910,
              58827: 34914,
              58828: 34923,
              58829: 34945,
              58830: 34942,
              58831: 34974,
              58832: 34933,
              58833: 34941,
              58834: 34997,
              58835: 34930,
              58836: 34946,
              58837: 34967,
              58838: 34962,
              58839: 34990,
              58840: 34969,
              58841: 34978,
              58842: 34957,
              58843: 34980,
              58844: 34992,
              58845: 35007,
              58846: 34993,
              58847: 35011,
              58848: 35012,
              58849: 35028,
              58850: 35032,
              58851: 35033,
              58852: 35037,
              58853: 35065,
              58854: 35074,
              58855: 35068,
              58856: 35060,
              58857: 35048,
              58858: 35058,
              58859: 35076,
              58860: 35084,
              58861: 35082,
              58862: 35091,
              58863: 35139,
              58864: 35102,
              58865: 35109,
              58866: 35114,
              58867: 35115,
              58868: 35137,
              58869: 35140,
              58870: 35131,
              58871: 35126,
              58872: 35128,
              58873: 35148,
              58874: 35101,
              58875: 35168,
              58876: 35166,
              58944: 35174,
              58945: 35172,
              58946: 35181,
              58947: 35178,
              58948: 35183,
              58949: 35188,
              58950: 35191,
              58951: 35198,
              58952: 35203,
              58953: 35208,
              58954: 35210,
              58955: 35219,
              58956: 35224,
              58957: 35233,
              58958: 35241,
              58959: 35238,
              58960: 35244,
              58961: 35247,
              58962: 35250,
              58963: 35258,
              58964: 35261,
              58965: 35263,
              58966: 35264,
              58967: 35290,
              58968: 35292,
              58969: 35293,
              58970: 35303,
              58971: 35316,
              58972: 35320,
              58973: 35331,
              58974: 35350,
              58975: 35344,
              58976: 35340,
              58977: 35355,
              58978: 35357,
              58979: 35365,
              58980: 35382,
              58981: 35393,
              58982: 35419,
              58983: 35410,
              58984: 35398,
              58985: 35400,
              58986: 35452,
              58987: 35437,
              58988: 35436,
              58989: 35426,
              58990: 35461,
              58991: 35458,
              58992: 35460,
              58993: 35496,
              58994: 35489,
              58995: 35473,
              58996: 35493,
              58997: 35494,
              58998: 35482,
              58999: 35491,
              59e3: 35524,
              59001: 35533,
              59002: 35522,
              59003: 35546,
              59004: 35563,
              59005: 35571,
              59006: 35559,
              59008: 35556,
              59009: 35569,
              59010: 35604,
              59011: 35552,
              59012: 35554,
              59013: 35575,
              59014: 35550,
              59015: 35547,
              59016: 35596,
              59017: 35591,
              59018: 35610,
              59019: 35553,
              59020: 35606,
              59021: 35600,
              59022: 35607,
              59023: 35616,
              59024: 35635,
              59025: 38827,
              59026: 35622,
              59027: 35627,
              59028: 35646,
              59029: 35624,
              59030: 35649,
              59031: 35660,
              59032: 35663,
              59033: 35662,
              59034: 35657,
              59035: 35670,
              59036: 35675,
              59037: 35674,
              59038: 35691,
              59039: 35679,
              59040: 35692,
              59041: 35695,
              59042: 35700,
              59043: 35709,
              59044: 35712,
              59045: 35724,
              59046: 35726,
              59047: 35730,
              59048: 35731,
              59049: 35734,
              59050: 35737,
              59051: 35738,
              59052: 35898,
              59053: 35905,
              59054: 35903,
              59055: 35912,
              59056: 35916,
              59057: 35918,
              59058: 35920,
              59059: 35925,
              59060: 35938,
              59061: 35948,
              59062: 35960,
              59063: 35962,
              59064: 35970,
              59065: 35977,
              59066: 35973,
              59067: 35978,
              59068: 35981,
              59069: 35982,
              59070: 35988,
              59071: 35964,
              59072: 35992,
              59073: 25117,
              59074: 36013,
              59075: 36010,
              59076: 36029,
              59077: 36018,
              59078: 36019,
              59079: 36014,
              59080: 36022,
              59081: 36040,
              59082: 36033,
              59083: 36068,
              59084: 36067,
              59085: 36058,
              59086: 36093,
              59087: 36090,
              59088: 36091,
              59089: 36100,
              59090: 36101,
              59091: 36106,
              59092: 36103,
              59093: 36111,
              59094: 36109,
              59095: 36112,
              59096: 40782,
              59097: 36115,
              59098: 36045,
              59099: 36116,
              59100: 36118,
              59101: 36199,
              59102: 36205,
              59103: 36209,
              59104: 36211,
              59105: 36225,
              59106: 36249,
              59107: 36290,
              59108: 36286,
              59109: 36282,
              59110: 36303,
              59111: 36314,
              59112: 36310,
              59113: 36300,
              59114: 36315,
              59115: 36299,
              59116: 36330,
              59117: 36331,
              59118: 36319,
              59119: 36323,
              59120: 36348,
              59121: 36360,
              59122: 36361,
              59123: 36351,
              59124: 36381,
              59125: 36382,
              59126: 36368,
              59127: 36383,
              59128: 36418,
              59129: 36405,
              59130: 36400,
              59131: 36404,
              59132: 36426,
              59200: 36423,
              59201: 36425,
              59202: 36428,
              59203: 36432,
              59204: 36424,
              59205: 36441,
              59206: 36452,
              59207: 36448,
              59208: 36394,
              59209: 36451,
              59210: 36437,
              59211: 36470,
              59212: 36466,
              59213: 36476,
              59214: 36481,
              59215: 36487,
              59216: 36485,
              59217: 36484,
              59218: 36491,
              59219: 36490,
              59220: 36499,
              59221: 36497,
              59222: 36500,
              59223: 36505,
              59224: 36522,
              59225: 36513,
              59226: 36524,
              59227: 36528,
              59228: 36550,
              59229: 36529,
              59230: 36542,
              59231: 36549,
              59232: 36552,
              59233: 36555,
              59234: 36571,
              59235: 36579,
              59236: 36604,
              59237: 36603,
              59238: 36587,
              59239: 36606,
              59240: 36618,
              59241: 36613,
              59242: 36629,
              59243: 36626,
              59244: 36633,
              59245: 36627,
              59246: 36636,
              59247: 36639,
              59248: 36635,
              59249: 36620,
              59250: 36646,
              59251: 36659,
              59252: 36667,
              59253: 36665,
              59254: 36677,
              59255: 36674,
              59256: 36670,
              59257: 36684,
              59258: 36681,
              59259: 36678,
              59260: 36686,
              59261: 36695,
              59262: 36700,
              59264: 36706,
              59265: 36707,
              59266: 36708,
              59267: 36764,
              59268: 36767,
              59269: 36771,
              59270: 36781,
              59271: 36783,
              59272: 36791,
              59273: 36826,
              59274: 36837,
              59275: 36834,
              59276: 36842,
              59277: 36847,
              59278: 36999,
              59279: 36852,
              59280: 36869,
              59281: 36857,
              59282: 36858,
              59283: 36881,
              59284: 36885,
              59285: 36897,
              59286: 36877,
              59287: 36894,
              59288: 36886,
              59289: 36875,
              59290: 36903,
              59291: 36918,
              59292: 36917,
              59293: 36921,
              59294: 36856,
              59295: 36943,
              59296: 36944,
              59297: 36945,
              59298: 36946,
              59299: 36878,
              59300: 36937,
              59301: 36926,
              59302: 36950,
              59303: 36952,
              59304: 36958,
              59305: 36968,
              59306: 36975,
              59307: 36982,
              59308: 38568,
              59309: 36978,
              59310: 36994,
              59311: 36989,
              59312: 36993,
              59313: 36992,
              59314: 37002,
              59315: 37001,
              59316: 37007,
              59317: 37032,
              59318: 37039,
              59319: 37041,
              59320: 37045,
              59321: 37090,
              59322: 37092,
              59323: 25160,
              59324: 37083,
              59325: 37122,
              59326: 37138,
              59327: 37145,
              59328: 37170,
              59329: 37168,
              59330: 37194,
              59331: 37206,
              59332: 37208,
              59333: 37219,
              59334: 37221,
              59335: 37225,
              59336: 37235,
              59337: 37234,
              59338: 37259,
              59339: 37257,
              59340: 37250,
              59341: 37282,
              59342: 37291,
              59343: 37295,
              59344: 37290,
              59345: 37301,
              59346: 37300,
              59347: 37306,
              59348: 37312,
              59349: 37313,
              59350: 37321,
              59351: 37323,
              59352: 37328,
              59353: 37334,
              59354: 37343,
              59355: 37345,
              59356: 37339,
              59357: 37372,
              59358: 37365,
              59359: 37366,
              59360: 37406,
              59361: 37375,
              59362: 37396,
              59363: 37420,
              59364: 37397,
              59365: 37393,
              59366: 37470,
              59367: 37463,
              59368: 37445,
              59369: 37449,
              59370: 37476,
              59371: 37448,
              59372: 37525,
              59373: 37439,
              59374: 37451,
              59375: 37456,
              59376: 37532,
              59377: 37526,
              59378: 37523,
              59379: 37531,
              59380: 37466,
              59381: 37583,
              59382: 37561,
              59383: 37559,
              59384: 37609,
              59385: 37647,
              59386: 37626,
              59387: 37700,
              59388: 37678,
              59456: 37657,
              59457: 37666,
              59458: 37658,
              59459: 37667,
              59460: 37690,
              59461: 37685,
              59462: 37691,
              59463: 37724,
              59464: 37728,
              59465: 37756,
              59466: 37742,
              59467: 37718,
              59468: 37808,
              59469: 37804,
              59470: 37805,
              59471: 37780,
              59472: 37817,
              59473: 37846,
              59474: 37847,
              59475: 37864,
              59476: 37861,
              59477: 37848,
              59478: 37827,
              59479: 37853,
              59480: 37840,
              59481: 37832,
              59482: 37860,
              59483: 37914,
              59484: 37908,
              59485: 37907,
              59486: 37891,
              59487: 37895,
              59488: 37904,
              59489: 37942,
              59490: 37931,
              59491: 37941,
              59492: 37921,
              59493: 37946,
              59494: 37953,
              59495: 37970,
              59496: 37956,
              59497: 37979,
              59498: 37984,
              59499: 37986,
              59500: 37982,
              59501: 37994,
              59502: 37417,
              59503: 38e3,
              59504: 38005,
              59505: 38007,
              59506: 38013,
              59507: 37978,
              59508: 38012,
              59509: 38014,
              59510: 38017,
              59511: 38015,
              59512: 38274,
              59513: 38279,
              59514: 38282,
              59515: 38292,
              59516: 38294,
              59517: 38296,
              59518: 38297,
              59520: 38304,
              59521: 38312,
              59522: 38311,
              59523: 38317,
              59524: 38332,
              59525: 38331,
              59526: 38329,
              59527: 38334,
              59528: 38346,
              59529: 28662,
              59530: 38339,
              59531: 38349,
              59532: 38348,
              59533: 38357,
              59534: 38356,
              59535: 38358,
              59536: 38364,
              59537: 38369,
              59538: 38373,
              59539: 38370,
              59540: 38433,
              59541: 38440,
              59542: 38446,
              59543: 38447,
              59544: 38466,
              59545: 38476,
              59546: 38479,
              59547: 38475,
              59548: 38519,
              59549: 38492,
              59550: 38494,
              59551: 38493,
              59552: 38495,
              59553: 38502,
              59554: 38514,
              59555: 38508,
              59556: 38541,
              59557: 38552,
              59558: 38549,
              59559: 38551,
              59560: 38570,
              59561: 38567,
              59562: 38577,
              59563: 38578,
              59564: 38576,
              59565: 38580,
              59566: 38582,
              59567: 38584,
              59568: 38585,
              59569: 38606,
              59570: 38603,
              59571: 38601,
              59572: 38605,
              59573: 35149,
              59574: 38620,
              59575: 38669,
              59576: 38613,
              59577: 38649,
              59578: 38660,
              59579: 38662,
              59580: 38664,
              59581: 38675,
              59582: 38670,
              59583: 38673,
              59584: 38671,
              59585: 38678,
              59586: 38681,
              59587: 38692,
              59588: 38698,
              59589: 38704,
              59590: 38713,
              59591: 38717,
              59592: 38718,
              59593: 38724,
              59594: 38726,
              59595: 38728,
              59596: 38722,
              59597: 38729,
              59598: 38748,
              59599: 38752,
              59600: 38756,
              59601: 38758,
              59602: 38760,
              59603: 21202,
              59604: 38763,
              59605: 38769,
              59606: 38777,
              59607: 38789,
              59608: 38780,
              59609: 38785,
              59610: 38778,
              59611: 38790,
              59612: 38795,
              59613: 38799,
              59614: 38800,
              59615: 38812,
              59616: 38824,
              59617: 38822,
              59618: 38819,
              59619: 38835,
              59620: 38836,
              59621: 38851,
              59622: 38854,
              59623: 38856,
              59624: 38859,
              59625: 38876,
              59626: 38893,
              59627: 40783,
              59628: 38898,
              59629: 31455,
              59630: 38902,
              59631: 38901,
              59632: 38927,
              59633: 38924,
              59634: 38968,
              59635: 38948,
              59636: 38945,
              59637: 38967,
              59638: 38973,
              59639: 38982,
              59640: 38991,
              59641: 38987,
              59642: 39019,
              59643: 39023,
              59644: 39024,
              59712: 39025,
              59713: 39028,
              59714: 39027,
              59715: 39082,
              59716: 39087,
              59717: 39089,
              59718: 39094,
              59719: 39108,
              59720: 39107,
              59721: 39110,
              59722: 39145,
              59723: 39147,
              59724: 39171,
              59725: 39177,
              59726: 39186,
              59727: 39188,
              59728: 39192,
              59729: 39201,
              59730: 39197,
              59731: 39198,
              59732: 39204,
              59733: 39200,
              59734: 39212,
              59735: 39214,
              59736: 39229,
              59737: 39230,
              59738: 39234,
              59739: 39241,
              59740: 39237,
              59741: 39248,
              59742: 39243,
              59743: 39249,
              59744: 39250,
              59745: 39244,
              59746: 39253,
              59747: 39319,
              59748: 39320,
              59749: 39333,
              59750: 39341,
              59751: 39342,
              59752: 39356,
              59753: 39391,
              59754: 39387,
              59755: 39389,
              59756: 39384,
              59757: 39377,
              59758: 39405,
              59759: 39406,
              59760: 39409,
              59761: 39410,
              59762: 39419,
              59763: 39416,
              59764: 39425,
              59765: 39439,
              59766: 39429,
              59767: 39394,
              59768: 39449,
              59769: 39467,
              59770: 39479,
              59771: 39493,
              59772: 39490,
              59773: 39488,
              59774: 39491,
              59776: 39486,
              59777: 39509,
              59778: 39501,
              59779: 39515,
              59780: 39511,
              59781: 39519,
              59782: 39522,
              59783: 39525,
              59784: 39524,
              59785: 39529,
              59786: 39531,
              59787: 39530,
              59788: 39597,
              59789: 39600,
              59790: 39612,
              59791: 39616,
              59792: 39631,
              59793: 39633,
              59794: 39635,
              59795: 39636,
              59796: 39646,
              59797: 39647,
              59798: 39650,
              59799: 39651,
              59800: 39654,
              59801: 39663,
              59802: 39659,
              59803: 39662,
              59804: 39668,
              59805: 39665,
              59806: 39671,
              59807: 39675,
              59808: 39686,
              59809: 39704,
              59810: 39706,
              59811: 39711,
              59812: 39714,
              59813: 39715,
              59814: 39717,
              59815: 39719,
              59816: 39720,
              59817: 39721,
              59818: 39722,
              59819: 39726,
              59820: 39727,
              59821: 39730,
              59822: 39748,
              59823: 39747,
              59824: 39759,
              59825: 39757,
              59826: 39758,
              59827: 39761,
              59828: 39768,
              59829: 39796,
              59830: 39827,
              59831: 39811,
              59832: 39825,
              59833: 39830,
              59834: 39831,
              59835: 39839,
              59836: 39840,
              59837: 39848,
              59838: 39860,
              59839: 39872,
              59840: 39882,
              59841: 39865,
              59842: 39878,
              59843: 39887,
              59844: 39889,
              59845: 39890,
              59846: 39907,
              59847: 39906,
              59848: 39908,
              59849: 39892,
              59850: 39905,
              59851: 39994,
              59852: 39922,
              59853: 39921,
              59854: 39920,
              59855: 39957,
              59856: 39956,
              59857: 39945,
              59858: 39955,
              59859: 39948,
              59860: 39942,
              59861: 39944,
              59862: 39954,
              59863: 39946,
              59864: 39940,
              59865: 39982,
              59866: 39963,
              59867: 39973,
              59868: 39972,
              59869: 39969,
              59870: 39984,
              59871: 40007,
              59872: 39986,
              59873: 40006,
              59874: 39998,
              59875: 40026,
              59876: 40032,
              59877: 40039,
              59878: 40054,
              59879: 40056,
              59880: 40167,
              59881: 40172,
              59882: 40176,
              59883: 40201,
              59884: 40200,
              59885: 40171,
              59886: 40195,
              59887: 40198,
              59888: 40234,
              59889: 40230,
              59890: 40367,
              59891: 40227,
              59892: 40223,
              59893: 40260,
              59894: 40213,
              59895: 40210,
              59896: 40257,
              59897: 40255,
              59898: 40254,
              59899: 40262,
              59900: 40264,
              59968: 40285,
              59969: 40286,
              59970: 40292,
              59971: 40273,
              59972: 40272,
              59973: 40281,
              59974: 40306,
              59975: 40329,
              59976: 40327,
              59977: 40363,
              59978: 40303,
              59979: 40314,
              59980: 40346,
              59981: 40356,
              59982: 40361,
              59983: 40370,
              59984: 40388,
              59985: 40385,
              59986: 40379,
              59987: 40376,
              59988: 40378,
              59989: 40390,
              59990: 40399,
              59991: 40386,
              59992: 40409,
              59993: 40403,
              59994: 40440,
              59995: 40422,
              59996: 40429,
              59997: 40431,
              59998: 40445,
              59999: 40474,
              6e4: 40475,
              60001: 40478,
              60002: 40565,
              60003: 40569,
              60004: 40573,
              60005: 40577,
              60006: 40584,
              60007: 40587,
              60008: 40588,
              60009: 40594,
              60010: 40597,
              60011: 40593,
              60012: 40605,
              60013: 40613,
              60014: 40617,
              60015: 40632,
              60016: 40618,
              60017: 40621,
              60018: 38753,
              60019: 40652,
              60020: 40654,
              60021: 40655,
              60022: 40656,
              60023: 40660,
              60024: 40668,
              60025: 40670,
              60026: 40669,
              60027: 40672,
              60028: 40677,
              60029: 40680,
              60030: 40687,
              60032: 40692,
              60033: 40694,
              60034: 40695,
              60035: 40697,
              60036: 40699,
              60037: 40700,
              60038: 40701,
              60039: 40711,
              60040: 40712,
              60041: 30391,
              60042: 40725,
              60043: 40737,
              60044: 40748,
              60045: 40766,
              60046: 40778,
              60047: 40786,
              60048: 40788,
              60049: 40803,
              60050: 40799,
              60051: 40800,
              60052: 40801,
              60053: 40806,
              60054: 40807,
              60055: 40812,
              60056: 40810,
              60057: 40823,
              60058: 40818,
              60059: 40822,
              60060: 40853,
              60061: 40860,
              60062: 40864,
              60063: 22575,
              60064: 27079,
              60065: 36953,
              60066: 29796,
              60067: 20956,
              60068: 29081
            };
          }),
          /* 9 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var GenericGF_1 = __webpack_require__(1);
            var GenericGFPoly_1 = __webpack_require__(2);
            function runEuclideanAlgorithm(field, a, b, R) {
              var _a;
              if (a.degree() < b.degree()) {
                _a = [b, a], a = _a[0], b = _a[1];
              }
              var rLast = a;
              var r = b;
              var tLast = field.zero;
              var t = field.one;
              while (r.degree() >= R / 2) {
                var rLastLast = rLast;
                var tLastLast = tLast;
                rLast = r;
                tLast = t;
                if (rLast.isZero()) {
                  return null;
                }
                r = rLastLast;
                var q = field.zero;
                var denominatorLeadingTerm = rLast.getCoefficient(rLast.degree());
                var dltInverse = field.inverse(denominatorLeadingTerm);
                while (r.degree() >= rLast.degree() && !r.isZero()) {
                  var degreeDiff = r.degree() - rLast.degree();
                  var scale = field.multiply(r.getCoefficient(r.degree()), dltInverse);
                  q = q.addOrSubtract(field.buildMonomial(degreeDiff, scale));
                  r = r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff, scale));
                }
                t = q.multiplyPoly(tLast).addOrSubtract(tLastLast);
                if (r.degree() >= rLast.degree()) {
                  return null;
                }
              }
              var sigmaTildeAtZero = t.getCoefficient(0);
              if (sigmaTildeAtZero === 0) {
                return null;
              }
              var inverse = field.inverse(sigmaTildeAtZero);
              return [t.multiply(inverse), r.multiply(inverse)];
            }
            function findErrorLocations(field, errorLocator) {
              var numErrors = errorLocator.degree();
              if (numErrors === 1) {
                return [errorLocator.getCoefficient(1)];
              }
              var result = new Array(numErrors);
              var errorCount = 0;
              for (var i = 1; i < field.size && errorCount < numErrors; i++) {
                if (errorLocator.evaluateAt(i) === 0) {
                  result[errorCount] = field.inverse(i);
                  errorCount++;
                }
              }
              if (errorCount !== numErrors) {
                return null;
              }
              return result;
            }
            function findErrorMagnitudes(field, errorEvaluator, errorLocations) {
              var s = errorLocations.length;
              var result = new Array(s);
              for (var i = 0; i < s; i++) {
                var xiInverse = field.inverse(errorLocations[i]);
                var denominator = 1;
                for (var j = 0; j < s; j++) {
                  if (i !== j) {
                    denominator = field.multiply(denominator, GenericGF_1.addOrSubtractGF(1, field.multiply(errorLocations[j], xiInverse)));
                  }
                }
                result[i] = field.multiply(errorEvaluator.evaluateAt(xiInverse), field.inverse(denominator));
                if (field.generatorBase !== 0) {
                  result[i] = field.multiply(result[i], xiInverse);
                }
              }
              return result;
            }
            function decode(bytes, twoS) {
              var outputBytes = new Uint8ClampedArray(bytes.length);
              outputBytes.set(bytes);
              var field = new GenericGF_1.default(285, 256, 0);
              var poly = new GenericGFPoly_1.default(field, outputBytes);
              var syndromeCoefficients = new Uint8ClampedArray(twoS);
              var error = false;
              for (var s = 0; s < twoS; s++) {
                var evaluation = poly.evaluateAt(field.exp(s + field.generatorBase));
                syndromeCoefficients[syndromeCoefficients.length - 1 - s] = evaluation;
                if (evaluation !== 0) {
                  error = true;
                }
              }
              if (!error) {
                return outputBytes;
              }
              var syndrome = new GenericGFPoly_1.default(field, syndromeCoefficients);
              var sigmaOmega = runEuclideanAlgorithm(field, field.buildMonomial(twoS, 1), syndrome, twoS);
              if (sigmaOmega === null) {
                return null;
              }
              var errorLocations = findErrorLocations(field, sigmaOmega[0]);
              if (errorLocations == null) {
                return null;
              }
              var errorMagnitudes = findErrorMagnitudes(field, sigmaOmega[1], errorLocations);
              for (var i = 0; i < errorLocations.length; i++) {
                var position = outputBytes.length - 1 - field.log(errorLocations[i]);
                if (position < 0) {
                  return null;
                }
                outputBytes[position] = GenericGF_1.addOrSubtractGF(outputBytes[position], errorMagnitudes[i]);
              }
              return outputBytes;
            }
            exports2.decode = decode;
          }),
          /* 10 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            exports2.VERSIONS = [
              {
                infoBits: null,
                versionNumber: 1,
                alignmentPatternCenters: [],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 7,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 19 }]
                  },
                  {
                    ecCodewordsPerBlock: 10,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 16 }]
                  },
                  {
                    ecCodewordsPerBlock: 13,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 13 }]
                  },
                  {
                    ecCodewordsPerBlock: 17,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 9 }]
                  }
                ]
              },
              {
                infoBits: null,
                versionNumber: 2,
                alignmentPatternCenters: [6, 18],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 10,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 34 }]
                  },
                  {
                    ecCodewordsPerBlock: 16,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 28 }]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 22 }]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 16 }]
                  }
                ]
              },
              {
                infoBits: null,
                versionNumber: 3,
                alignmentPatternCenters: [6, 22],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 15,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 55 }]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 44 }]
                  },
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 17 }]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 13 }]
                  }
                ]
              },
              {
                infoBits: null,
                versionNumber: 4,
                alignmentPatternCenters: [6, 26],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 20,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 80 }]
                  },
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 32 }]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 24 }]
                  },
                  {
                    ecCodewordsPerBlock: 16,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 9 }]
                  }
                ]
              },
              {
                infoBits: null,
                versionNumber: 5,
                alignmentPatternCenters: [6, 30],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [{ numBlocks: 1, dataCodewordsPerBlock: 108 }]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 43 }]
                  },
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 15 },
                      { numBlocks: 2, dataCodewordsPerBlock: 16 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 11 },
                      { numBlocks: 2, dataCodewordsPerBlock: 12 }
                    ]
                  }
                ]
              },
              {
                infoBits: null,
                versionNumber: 6,
                alignmentPatternCenters: [6, 34],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 68 }]
                  },
                  {
                    ecCodewordsPerBlock: 16,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 27 }]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 19 }]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 15 }]
                  }
                ]
              },
              {
                infoBits: 31892,
                versionNumber: 7,
                alignmentPatternCenters: [6, 22, 38],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 20,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 78 }]
                  },
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 31 }]
                  },
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 14 },
                      { numBlocks: 4, dataCodewordsPerBlock: 15 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 13 },
                      { numBlocks: 1, dataCodewordsPerBlock: 14 }
                    ]
                  }
                ]
              },
              {
                infoBits: 34236,
                versionNumber: 8,
                alignmentPatternCenters: [6, 24, 42],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 97 }]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 38 },
                      { numBlocks: 2, dataCodewordsPerBlock: 39 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 18 },
                      { numBlocks: 2, dataCodewordsPerBlock: 19 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 14 },
                      { numBlocks: 2, dataCodewordsPerBlock: 15 }
                    ]
                  }
                ]
              },
              {
                infoBits: 39577,
                versionNumber: 9,
                alignmentPatternCenters: [6, 26, 46],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [{ numBlocks: 2, dataCodewordsPerBlock: 116 }]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 36 },
                      { numBlocks: 2, dataCodewordsPerBlock: 37 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 20,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 16 },
                      { numBlocks: 4, dataCodewordsPerBlock: 17 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 12 },
                      { numBlocks: 4, dataCodewordsPerBlock: 13 }
                    ]
                  }
                ]
              },
              {
                infoBits: 42195,
                versionNumber: 10,
                alignmentPatternCenters: [6, 28, 50],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 18,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 68 },
                      { numBlocks: 2, dataCodewordsPerBlock: 69 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 43 },
                      { numBlocks: 1, dataCodewordsPerBlock: 44 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 19 },
                      { numBlocks: 2, dataCodewordsPerBlock: 20 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 15 },
                      { numBlocks: 2, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 48118,
                versionNumber: 11,
                alignmentPatternCenters: [6, 30, 54],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 20,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 81 }]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 1, dataCodewordsPerBlock: 50 },
                      { numBlocks: 4, dataCodewordsPerBlock: 51 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 22 },
                      { numBlocks: 4, dataCodewordsPerBlock: 23 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 12 },
                      { numBlocks: 8, dataCodewordsPerBlock: 13 }
                    ]
                  }
                ]
              },
              {
                infoBits: 51042,
                versionNumber: 12,
                alignmentPatternCenters: [6, 32, 58],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 92 },
                      { numBlocks: 2, dataCodewordsPerBlock: 93 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 36 },
                      { numBlocks: 2, dataCodewordsPerBlock: 37 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 20 },
                      { numBlocks: 6, dataCodewordsPerBlock: 21 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 7, dataCodewordsPerBlock: 14 },
                      { numBlocks: 4, dataCodewordsPerBlock: 15 }
                    ]
                  }
                ]
              },
              {
                infoBits: 55367,
                versionNumber: 13,
                alignmentPatternCenters: [6, 34, 62],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [{ numBlocks: 4, dataCodewordsPerBlock: 107 }]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 37 },
                      { numBlocks: 1, dataCodewordsPerBlock: 38 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 20 },
                      { numBlocks: 4, dataCodewordsPerBlock: 21 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 12, dataCodewordsPerBlock: 11 },
                      { numBlocks: 4, dataCodewordsPerBlock: 12 }
                    ]
                  }
                ]
              },
              {
                infoBits: 58893,
                versionNumber: 14,
                alignmentPatternCenters: [6, 26, 46, 66],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 115 },
                      { numBlocks: 1, dataCodewordsPerBlock: 116 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 40 },
                      { numBlocks: 5, dataCodewordsPerBlock: 41 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 20,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 16 },
                      { numBlocks: 5, dataCodewordsPerBlock: 17 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 12 },
                      { numBlocks: 5, dataCodewordsPerBlock: 13 }
                    ]
                  }
                ]
              },
              {
                infoBits: 63784,
                versionNumber: 15,
                alignmentPatternCenters: [6, 26, 48, 70],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 22,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 87 },
                      { numBlocks: 1, dataCodewordsPerBlock: 88 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 41 },
                      { numBlocks: 5, dataCodewordsPerBlock: 42 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 24 },
                      { numBlocks: 7, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 12 },
                      { numBlocks: 7, dataCodewordsPerBlock: 13 }
                    ]
                  }
                ]
              },
              {
                infoBits: 68472,
                versionNumber: 16,
                alignmentPatternCenters: [6, 26, 50, 74],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 98 },
                      { numBlocks: 1, dataCodewordsPerBlock: 99 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 7, dataCodewordsPerBlock: 45 },
                      { numBlocks: 3, dataCodewordsPerBlock: 46 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [
                      { numBlocks: 15, dataCodewordsPerBlock: 19 },
                      { numBlocks: 2, dataCodewordsPerBlock: 20 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 15 },
                      { numBlocks: 13, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 70749,
                versionNumber: 17,
                alignmentPatternCenters: [6, 30, 54, 78],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 1, dataCodewordsPerBlock: 107 },
                      { numBlocks: 5, dataCodewordsPerBlock: 108 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 10, dataCodewordsPerBlock: 46 },
                      { numBlocks: 1, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 1, dataCodewordsPerBlock: 22 },
                      { numBlocks: 15, dataCodewordsPerBlock: 23 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 14 },
                      { numBlocks: 17, dataCodewordsPerBlock: 15 }
                    ]
                  }
                ]
              },
              {
                infoBits: 76311,
                versionNumber: 18,
                alignmentPatternCenters: [6, 30, 56, 82],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 120 },
                      { numBlocks: 1, dataCodewordsPerBlock: 121 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 9, dataCodewordsPerBlock: 43 },
                      { numBlocks: 4, dataCodewordsPerBlock: 44 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 17, dataCodewordsPerBlock: 22 },
                      { numBlocks: 1, dataCodewordsPerBlock: 23 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 14 },
                      { numBlocks: 19, dataCodewordsPerBlock: 15 }
                    ]
                  }
                ]
              },
              {
                infoBits: 79154,
                versionNumber: 19,
                alignmentPatternCenters: [6, 30, 58, 86],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 113 },
                      { numBlocks: 4, dataCodewordsPerBlock: 114 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 44 },
                      { numBlocks: 11, dataCodewordsPerBlock: 45 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 17, dataCodewordsPerBlock: 21 },
                      { numBlocks: 4, dataCodewordsPerBlock: 22 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 9, dataCodewordsPerBlock: 13 },
                      { numBlocks: 16, dataCodewordsPerBlock: 14 }
                    ]
                  }
                ]
              },
              {
                infoBits: 84390,
                versionNumber: 20,
                alignmentPatternCenters: [6, 34, 62, 90],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 107 },
                      { numBlocks: 5, dataCodewordsPerBlock: 108 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 41 },
                      { numBlocks: 13, dataCodewordsPerBlock: 42 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 15, dataCodewordsPerBlock: 24 },
                      { numBlocks: 5, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 15, dataCodewordsPerBlock: 15 },
                      { numBlocks: 10, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 87683,
                versionNumber: 21,
                alignmentPatternCenters: [6, 28, 50, 72, 94],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 116 },
                      { numBlocks: 4, dataCodewordsPerBlock: 117 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [{ numBlocks: 17, dataCodewordsPerBlock: 42 }]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 17, dataCodewordsPerBlock: 22 },
                      { numBlocks: 6, dataCodewordsPerBlock: 23 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 16 },
                      { numBlocks: 6, dataCodewordsPerBlock: 17 }
                    ]
                  }
                ]
              },
              {
                infoBits: 92361,
                versionNumber: 22,
                alignmentPatternCenters: [6, 26, 50, 74, 98],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 111 },
                      { numBlocks: 7, dataCodewordsPerBlock: 112 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [{ numBlocks: 17, dataCodewordsPerBlock: 46 }]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 7, dataCodewordsPerBlock: 24 },
                      { numBlocks: 16, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 24,
                    ecBlocks: [{ numBlocks: 34, dataCodewordsPerBlock: 13 }]
                  }
                ]
              },
              {
                infoBits: 96236,
                versionNumber: 23,
                alignmentPatternCenters: [6, 30, 54, 74, 102],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 121 },
                      { numBlocks: 5, dataCodewordsPerBlock: 122 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 47 },
                      { numBlocks: 14, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 24 },
                      { numBlocks: 14, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 16, dataCodewordsPerBlock: 15 },
                      { numBlocks: 14, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 102084,
                versionNumber: 24,
                alignmentPatternCenters: [6, 28, 54, 80, 106],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 117 },
                      { numBlocks: 4, dataCodewordsPerBlock: 118 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 45 },
                      { numBlocks: 14, dataCodewordsPerBlock: 46 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 24 },
                      { numBlocks: 16, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 30, dataCodewordsPerBlock: 16 },
                      { numBlocks: 2, dataCodewordsPerBlock: 17 }
                    ]
                  }
                ]
              },
              {
                infoBits: 102881,
                versionNumber: 25,
                alignmentPatternCenters: [6, 32, 58, 84, 110],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 26,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 106 },
                      { numBlocks: 4, dataCodewordsPerBlock: 107 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 47 },
                      { numBlocks: 13, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 7, dataCodewordsPerBlock: 24 },
                      { numBlocks: 22, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 22, dataCodewordsPerBlock: 15 },
                      { numBlocks: 13, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 110507,
                versionNumber: 26,
                alignmentPatternCenters: [6, 30, 58, 86, 114],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 10, dataCodewordsPerBlock: 114 },
                      { numBlocks: 2, dataCodewordsPerBlock: 115 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 46 },
                      { numBlocks: 4, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 28, dataCodewordsPerBlock: 22 },
                      { numBlocks: 6, dataCodewordsPerBlock: 23 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 33, dataCodewordsPerBlock: 16 },
                      { numBlocks: 4, dataCodewordsPerBlock: 17 }
                    ]
                  }
                ]
              },
              {
                infoBits: 110734,
                versionNumber: 27,
                alignmentPatternCenters: [6, 34, 62, 90, 118],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 122 },
                      { numBlocks: 4, dataCodewordsPerBlock: 123 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 22, dataCodewordsPerBlock: 45 },
                      { numBlocks: 3, dataCodewordsPerBlock: 46 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 8, dataCodewordsPerBlock: 23 },
                      { numBlocks: 26, dataCodewordsPerBlock: 24 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 12, dataCodewordsPerBlock: 15 },
                      { numBlocks: 28, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 117786,
                versionNumber: 28,
                alignmentPatternCenters: [6, 26, 50, 74, 98, 122],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 117 },
                      { numBlocks: 10, dataCodewordsPerBlock: 118 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 3, dataCodewordsPerBlock: 45 },
                      { numBlocks: 23, dataCodewordsPerBlock: 46 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 24 },
                      { numBlocks: 31, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 15 },
                      { numBlocks: 31, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 119615,
                versionNumber: 29,
                alignmentPatternCenters: [6, 30, 54, 78, 102, 126],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 7, dataCodewordsPerBlock: 116 },
                      { numBlocks: 7, dataCodewordsPerBlock: 117 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 21, dataCodewordsPerBlock: 45 },
                      { numBlocks: 7, dataCodewordsPerBlock: 46 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 1, dataCodewordsPerBlock: 23 },
                      { numBlocks: 37, dataCodewordsPerBlock: 24 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 15 },
                      { numBlocks: 26, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 126325,
                versionNumber: 30,
                alignmentPatternCenters: [6, 26, 52, 78, 104, 130],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 5, dataCodewordsPerBlock: 115 },
                      { numBlocks: 10, dataCodewordsPerBlock: 116 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 47 },
                      { numBlocks: 10, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 15, dataCodewordsPerBlock: 24 },
                      { numBlocks: 25, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 23, dataCodewordsPerBlock: 15 },
                      { numBlocks: 25, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 127568,
                versionNumber: 31,
                alignmentPatternCenters: [6, 30, 56, 82, 108, 134],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 13, dataCodewordsPerBlock: 115 },
                      { numBlocks: 3, dataCodewordsPerBlock: 116 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 46 },
                      { numBlocks: 29, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 42, dataCodewordsPerBlock: 24 },
                      { numBlocks: 1, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 23, dataCodewordsPerBlock: 15 },
                      { numBlocks: 28, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 133589,
                versionNumber: 32,
                alignmentPatternCenters: [6, 34, 60, 86, 112, 138],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [{ numBlocks: 17, dataCodewordsPerBlock: 115 }]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 10, dataCodewordsPerBlock: 46 },
                      { numBlocks: 23, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 10, dataCodewordsPerBlock: 24 },
                      { numBlocks: 35, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 15 },
                      { numBlocks: 35, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 136944,
                versionNumber: 33,
                alignmentPatternCenters: [6, 30, 58, 86, 114, 142],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 17, dataCodewordsPerBlock: 115 },
                      { numBlocks: 1, dataCodewordsPerBlock: 116 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 14, dataCodewordsPerBlock: 46 },
                      { numBlocks: 21, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 29, dataCodewordsPerBlock: 24 },
                      { numBlocks: 19, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 11, dataCodewordsPerBlock: 15 },
                      { numBlocks: 46, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 141498,
                versionNumber: 34,
                alignmentPatternCenters: [6, 34, 62, 90, 118, 146],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 13, dataCodewordsPerBlock: 115 },
                      { numBlocks: 6, dataCodewordsPerBlock: 116 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 14, dataCodewordsPerBlock: 46 },
                      { numBlocks: 23, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 44, dataCodewordsPerBlock: 24 },
                      { numBlocks: 7, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 59, dataCodewordsPerBlock: 16 },
                      { numBlocks: 1, dataCodewordsPerBlock: 17 }
                    ]
                  }
                ]
              },
              {
                infoBits: 145311,
                versionNumber: 35,
                alignmentPatternCenters: [6, 30, 54, 78, 102, 126, 150],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 12, dataCodewordsPerBlock: 121 },
                      { numBlocks: 7, dataCodewordsPerBlock: 122 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 12, dataCodewordsPerBlock: 47 },
                      { numBlocks: 26, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 39, dataCodewordsPerBlock: 24 },
                      { numBlocks: 14, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 22, dataCodewordsPerBlock: 15 },
                      { numBlocks: 41, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 150283,
                versionNumber: 36,
                alignmentPatternCenters: [6, 24, 50, 76, 102, 128, 154],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 121 },
                      { numBlocks: 14, dataCodewordsPerBlock: 122 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 6, dataCodewordsPerBlock: 47 },
                      { numBlocks: 34, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 46, dataCodewordsPerBlock: 24 },
                      { numBlocks: 10, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 2, dataCodewordsPerBlock: 15 },
                      { numBlocks: 64, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 152622,
                versionNumber: 37,
                alignmentPatternCenters: [6, 28, 54, 80, 106, 132, 158],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 17, dataCodewordsPerBlock: 122 },
                      { numBlocks: 4, dataCodewordsPerBlock: 123 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 29, dataCodewordsPerBlock: 46 },
                      { numBlocks: 14, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 49, dataCodewordsPerBlock: 24 },
                      { numBlocks: 10, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 24, dataCodewordsPerBlock: 15 },
                      { numBlocks: 46, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 158308,
                versionNumber: 38,
                alignmentPatternCenters: [6, 32, 58, 84, 110, 136, 162],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 4, dataCodewordsPerBlock: 122 },
                      { numBlocks: 18, dataCodewordsPerBlock: 123 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 13, dataCodewordsPerBlock: 46 },
                      { numBlocks: 32, dataCodewordsPerBlock: 47 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 48, dataCodewordsPerBlock: 24 },
                      { numBlocks: 14, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 42, dataCodewordsPerBlock: 15 },
                      { numBlocks: 32, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 161089,
                versionNumber: 39,
                alignmentPatternCenters: [6, 26, 54, 82, 110, 138, 166],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 20, dataCodewordsPerBlock: 117 },
                      { numBlocks: 4, dataCodewordsPerBlock: 118 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 40, dataCodewordsPerBlock: 47 },
                      { numBlocks: 7, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 43, dataCodewordsPerBlock: 24 },
                      { numBlocks: 22, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 10, dataCodewordsPerBlock: 15 },
                      { numBlocks: 67, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              },
              {
                infoBits: 167017,
                versionNumber: 40,
                alignmentPatternCenters: [6, 30, 58, 86, 114, 142, 170],
                errorCorrectionLevels: [
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 19, dataCodewordsPerBlock: 118 },
                      { numBlocks: 6, dataCodewordsPerBlock: 119 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 28,
                    ecBlocks: [
                      { numBlocks: 18, dataCodewordsPerBlock: 47 },
                      { numBlocks: 31, dataCodewordsPerBlock: 48 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 34, dataCodewordsPerBlock: 24 },
                      { numBlocks: 34, dataCodewordsPerBlock: 25 }
                    ]
                  },
                  {
                    ecCodewordsPerBlock: 30,
                    ecBlocks: [
                      { numBlocks: 20, dataCodewordsPerBlock: 15 },
                      { numBlocks: 61, dataCodewordsPerBlock: 16 }
                    ]
                  }
                ]
              }
            ];
          }),
          /* 11 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var BitMatrix_1 = __webpack_require__(0);
            function squareToQuadrilateral(p1, p2, p3, p4) {
              var dx3 = p1.x - p2.x + p3.x - p4.x;
              var dy3 = p1.y - p2.y + p3.y - p4.y;
              if (dx3 === 0 && dy3 === 0) {
                return {
                  a11: p2.x - p1.x,
                  a12: p2.y - p1.y,
                  a13: 0,
                  a21: p3.x - p2.x,
                  a22: p3.y - p2.y,
                  a23: 0,
                  a31: p1.x,
                  a32: p1.y,
                  a33: 1
                };
              } else {
                var dx1 = p2.x - p3.x;
                var dx2 = p4.x - p3.x;
                var dy1 = p2.y - p3.y;
                var dy2 = p4.y - p3.y;
                var denominator = dx1 * dy2 - dx2 * dy1;
                var a13 = (dx3 * dy2 - dx2 * dy3) / denominator;
                var a23 = (dx1 * dy3 - dx3 * dy1) / denominator;
                return {
                  a11: p2.x - p1.x + a13 * p2.x,
                  a12: p2.y - p1.y + a13 * p2.y,
                  a13,
                  a21: p4.x - p1.x + a23 * p4.x,
                  a22: p4.y - p1.y + a23 * p4.y,
                  a23,
                  a31: p1.x,
                  a32: p1.y,
                  a33: 1
                };
              }
            }
            function quadrilateralToSquare(p1, p2, p3, p4) {
              var sToQ = squareToQuadrilateral(p1, p2, p3, p4);
              return {
                a11: sToQ.a22 * sToQ.a33 - sToQ.a23 * sToQ.a32,
                a12: sToQ.a13 * sToQ.a32 - sToQ.a12 * sToQ.a33,
                a13: sToQ.a12 * sToQ.a23 - sToQ.a13 * sToQ.a22,
                a21: sToQ.a23 * sToQ.a31 - sToQ.a21 * sToQ.a33,
                a22: sToQ.a11 * sToQ.a33 - sToQ.a13 * sToQ.a31,
                a23: sToQ.a13 * sToQ.a21 - sToQ.a11 * sToQ.a23,
                a31: sToQ.a21 * sToQ.a32 - sToQ.a22 * sToQ.a31,
                a32: sToQ.a12 * sToQ.a31 - sToQ.a11 * sToQ.a32,
                a33: sToQ.a11 * sToQ.a22 - sToQ.a12 * sToQ.a21
              };
            }
            function times(a, b) {
              return {
                a11: a.a11 * b.a11 + a.a21 * b.a12 + a.a31 * b.a13,
                a12: a.a12 * b.a11 + a.a22 * b.a12 + a.a32 * b.a13,
                a13: a.a13 * b.a11 + a.a23 * b.a12 + a.a33 * b.a13,
                a21: a.a11 * b.a21 + a.a21 * b.a22 + a.a31 * b.a23,
                a22: a.a12 * b.a21 + a.a22 * b.a22 + a.a32 * b.a23,
                a23: a.a13 * b.a21 + a.a23 * b.a22 + a.a33 * b.a23,
                a31: a.a11 * b.a31 + a.a21 * b.a32 + a.a31 * b.a33,
                a32: a.a12 * b.a31 + a.a22 * b.a32 + a.a32 * b.a33,
                a33: a.a13 * b.a31 + a.a23 * b.a32 + a.a33 * b.a33
              };
            }
            function extract(image, location2) {
              var qToS = quadrilateralToSquare({ x: 3.5, y: 3.5 }, { x: location2.dimension - 3.5, y: 3.5 }, { x: location2.dimension - 6.5, y: location2.dimension - 6.5 }, { x: 3.5, y: location2.dimension - 3.5 });
              var sToQ = squareToQuadrilateral(location2.topLeft, location2.topRight, location2.alignmentPattern, location2.bottomLeft);
              var transform = times(sToQ, qToS);
              var matrix = BitMatrix_1.BitMatrix.createEmpty(location2.dimension, location2.dimension);
              var mappingFunction = function(x2, y2) {
                var denominator = transform.a13 * x2 + transform.a23 * y2 + transform.a33;
                return {
                  x: (transform.a11 * x2 + transform.a21 * y2 + transform.a31) / denominator,
                  y: (transform.a12 * x2 + transform.a22 * y2 + transform.a32) / denominator
                };
              };
              for (var y = 0; y < location2.dimension; y++) {
                for (var x = 0; x < location2.dimension; x++) {
                  var xValue = x + 0.5;
                  var yValue = y + 0.5;
                  var sourcePixel = mappingFunction(xValue, yValue);
                  matrix.set(x, y, image.get(Math.floor(sourcePixel.x), Math.floor(sourcePixel.y)));
                }
              }
              return {
                matrix,
                mappingFunction
              };
            }
            exports2.extract = extract;
          }),
          /* 12 */
          /***/
          (function(module2, exports2, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports2, "__esModule", { value: true });
            var MAX_FINDERPATTERNS_TO_SEARCH = 4;
            var MIN_QUAD_RATIO = 0.5;
            var MAX_QUAD_RATIO = 1.5;
            var distance = function(a, b) {
              return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
            };
            function sum(values) {
              return values.reduce(function(a, b) {
                return a + b;
              });
            }
            function reorderFinderPatterns(pattern1, pattern2, pattern3) {
              var _a, _b, _c, _d;
              var oneTwoDistance = distance(pattern1, pattern2);
              var twoThreeDistance = distance(pattern2, pattern3);
              var oneThreeDistance = distance(pattern1, pattern3);
              var bottomLeft;
              var topLeft;
              var topRight;
              if (twoThreeDistance >= oneTwoDistance && twoThreeDistance >= oneThreeDistance) {
                _a = [pattern2, pattern1, pattern3], bottomLeft = _a[0], topLeft = _a[1], topRight = _a[2];
              } else if (oneThreeDistance >= twoThreeDistance && oneThreeDistance >= oneTwoDistance) {
                _b = [pattern1, pattern2, pattern3], bottomLeft = _b[0], topLeft = _b[1], topRight = _b[2];
              } else {
                _c = [pattern1, pattern3, pattern2], bottomLeft = _c[0], topLeft = _c[1], topRight = _c[2];
              }
              if ((topRight.x - topLeft.x) * (bottomLeft.y - topLeft.y) - (topRight.y - topLeft.y) * (bottomLeft.x - topLeft.x) < 0) {
                _d = [topRight, bottomLeft], bottomLeft = _d[0], topRight = _d[1];
              }
              return { bottomLeft, topLeft, topRight };
            }
            function computeDimension(topLeft, topRight, bottomLeft, matrix) {
              var moduleSize = (sum(countBlackWhiteRun(topLeft, bottomLeft, matrix, 5)) / 7 + // Divide by 7 since the ratio is 1:1:3:1:1
              sum(countBlackWhiteRun(topLeft, topRight, matrix, 5)) / 7 + sum(countBlackWhiteRun(bottomLeft, topLeft, matrix, 5)) / 7 + sum(countBlackWhiteRun(topRight, topLeft, matrix, 5)) / 7) / 4;
              if (moduleSize < 1) {
                throw new Error("Invalid module size");
              }
              var topDimension = Math.round(distance(topLeft, topRight) / moduleSize);
              var sideDimension = Math.round(distance(topLeft, bottomLeft) / moduleSize);
              var dimension = Math.floor((topDimension + sideDimension) / 2) + 7;
              switch (dimension % 4) {
                case 0:
                  dimension++;
                  break;
                case 2:
                  dimension--;
                  break;
              }
              return { dimension, moduleSize };
            }
            function countBlackWhiteRunTowardsPoint(origin, end, matrix, length) {
              var switchPoints = [{ x: Math.floor(origin.x), y: Math.floor(origin.y) }];
              var steep = Math.abs(end.y - origin.y) > Math.abs(end.x - origin.x);
              var fromX;
              var fromY;
              var toX;
              var toY;
              if (steep) {
                fromX = Math.floor(origin.y);
                fromY = Math.floor(origin.x);
                toX = Math.floor(end.y);
                toY = Math.floor(end.x);
              } else {
                fromX = Math.floor(origin.x);
                fromY = Math.floor(origin.y);
                toX = Math.floor(end.x);
                toY = Math.floor(end.y);
              }
              var dx = Math.abs(toX - fromX);
              var dy = Math.abs(toY - fromY);
              var error = Math.floor(-dx / 2);
              var xStep = fromX < toX ? 1 : -1;
              var yStep = fromY < toY ? 1 : -1;
              var currentPixel = true;
              for (var x = fromX, y = fromY; x !== toX + xStep; x += xStep) {
                var realX = steep ? y : x;
                var realY = steep ? x : y;
                if (matrix.get(realX, realY) !== currentPixel) {
                  currentPixel = !currentPixel;
                  switchPoints.push({ x: realX, y: realY });
                  if (switchPoints.length === length + 1) {
                    break;
                  }
                }
                error += dy;
                if (error > 0) {
                  if (y === toY) {
                    break;
                  }
                  y += yStep;
                  error -= dx;
                }
              }
              var distances = [];
              for (var i = 0; i < length; i++) {
                if (switchPoints[i] && switchPoints[i + 1]) {
                  distances.push(distance(switchPoints[i], switchPoints[i + 1]));
                } else {
                  distances.push(0);
                }
              }
              return distances;
            }
            function countBlackWhiteRun(origin, end, matrix, length) {
              var _a;
              var rise = end.y - origin.y;
              var run = end.x - origin.x;
              var towardsEnd = countBlackWhiteRunTowardsPoint(origin, end, matrix, Math.ceil(length / 2));
              var awayFromEnd = countBlackWhiteRunTowardsPoint(origin, { x: origin.x - run, y: origin.y - rise }, matrix, Math.ceil(length / 2));
              var middleValue = towardsEnd.shift() + awayFromEnd.shift() - 1;
              return (_a = awayFromEnd.concat(middleValue)).concat.apply(_a, towardsEnd);
            }
            function scoreBlackWhiteRun(sequence, ratios) {
              var averageSize = sum(sequence) / sum(ratios);
              var error = 0;
              ratios.forEach(function(ratio, i) {
                error += Math.pow(sequence[i] - ratio * averageSize, 2);
              });
              return { averageSize, error };
            }
            function scorePattern(point, ratios, matrix) {
              try {
                var horizontalRun = countBlackWhiteRun(point, { x: -1, y: point.y }, matrix, ratios.length);
                var verticalRun = countBlackWhiteRun(point, { x: point.x, y: -1 }, matrix, ratios.length);
                var topLeftPoint = {
                  x: Math.max(0, point.x - point.y) - 1,
                  y: Math.max(0, point.y - point.x) - 1
                };
                var topLeftBottomRightRun = countBlackWhiteRun(point, topLeftPoint, matrix, ratios.length);
                var bottomLeftPoint = {
                  x: Math.min(matrix.width, point.x + point.y) + 1,
                  y: Math.min(matrix.height, point.y + point.x) + 1
                };
                var bottomLeftTopRightRun = countBlackWhiteRun(point, bottomLeftPoint, matrix, ratios.length);
                var horzError = scoreBlackWhiteRun(horizontalRun, ratios);
                var vertError = scoreBlackWhiteRun(verticalRun, ratios);
                var diagDownError = scoreBlackWhiteRun(topLeftBottomRightRun, ratios);
                var diagUpError = scoreBlackWhiteRun(bottomLeftTopRightRun, ratios);
                var ratioError = Math.sqrt(horzError.error * horzError.error + vertError.error * vertError.error + diagDownError.error * diagDownError.error + diagUpError.error * diagUpError.error);
                var avgSize = (horzError.averageSize + vertError.averageSize + diagDownError.averageSize + diagUpError.averageSize) / 4;
                var sizeError = (Math.pow(horzError.averageSize - avgSize, 2) + Math.pow(vertError.averageSize - avgSize, 2) + Math.pow(diagDownError.averageSize - avgSize, 2) + Math.pow(diagUpError.averageSize - avgSize, 2)) / avgSize;
                return ratioError + sizeError;
              } catch (_a) {
                return Infinity;
              }
            }
            function recenterLocation(matrix, p) {
              var leftX = Math.round(p.x);
              while (matrix.get(leftX, Math.round(p.y))) {
                leftX--;
              }
              var rightX = Math.round(p.x);
              while (matrix.get(rightX, Math.round(p.y))) {
                rightX++;
              }
              var x = (leftX + rightX) / 2;
              var topY = Math.round(p.y);
              while (matrix.get(Math.round(x), topY)) {
                topY--;
              }
              var bottomY = Math.round(p.y);
              while (matrix.get(Math.round(x), bottomY)) {
                bottomY++;
              }
              var y = (topY + bottomY) / 2;
              return { x, y };
            }
            function locate(matrix) {
              var finderPatternQuads = [];
              var activeFinderPatternQuads = [];
              var alignmentPatternQuads = [];
              var activeAlignmentPatternQuads = [];
              var _loop_1 = function(y2) {
                var length_1 = 0;
                var lastBit = false;
                var scans = [0, 0, 0, 0, 0];
                var _loop_2 = function(x2) {
                  var v = matrix.get(x2, y2);
                  if (v === lastBit) {
                    length_1++;
                  } else {
                    scans = [scans[1], scans[2], scans[3], scans[4], length_1];
                    length_1 = 1;
                    lastBit = v;
                    var averageFinderPatternBlocksize = sum(scans) / 7;
                    var validFinderPattern = Math.abs(scans[0] - averageFinderPatternBlocksize) < averageFinderPatternBlocksize && Math.abs(scans[1] - averageFinderPatternBlocksize) < averageFinderPatternBlocksize && Math.abs(scans[2] - 3 * averageFinderPatternBlocksize) < 3 * averageFinderPatternBlocksize && Math.abs(scans[3] - averageFinderPatternBlocksize) < averageFinderPatternBlocksize && Math.abs(scans[4] - averageFinderPatternBlocksize) < averageFinderPatternBlocksize && !v;
                    var averageAlignmentPatternBlocksize = sum(scans.slice(-3)) / 3;
                    var validAlignmentPattern = Math.abs(scans[2] - averageAlignmentPatternBlocksize) < averageAlignmentPatternBlocksize && Math.abs(scans[3] - averageAlignmentPatternBlocksize) < averageAlignmentPatternBlocksize && Math.abs(scans[4] - averageAlignmentPatternBlocksize) < averageAlignmentPatternBlocksize && v;
                    if (validFinderPattern) {
                      var endX_1 = x2 - scans[3] - scans[4];
                      var startX_1 = endX_1 - scans[2];
                      var line = { startX: startX_1, endX: endX_1, y: y2 };
                      var matchingQuads = activeFinderPatternQuads.filter(function(q) {
                        return startX_1 >= q.bottom.startX && startX_1 <= q.bottom.endX || endX_1 >= q.bottom.startX && startX_1 <= q.bottom.endX || startX_1 <= q.bottom.startX && endX_1 >= q.bottom.endX && (scans[2] / (q.bottom.endX - q.bottom.startX) < MAX_QUAD_RATIO && scans[2] / (q.bottom.endX - q.bottom.startX) > MIN_QUAD_RATIO);
                      });
                      if (matchingQuads.length > 0) {
                        matchingQuads[0].bottom = line;
                      } else {
                        activeFinderPatternQuads.push({ top: line, bottom: line });
                      }
                    }
                    if (validAlignmentPattern) {
                      var endX_2 = x2 - scans[4];
                      var startX_2 = endX_2 - scans[3];
                      var line = { startX: startX_2, y: y2, endX: endX_2 };
                      var matchingQuads = activeAlignmentPatternQuads.filter(function(q) {
                        return startX_2 >= q.bottom.startX && startX_2 <= q.bottom.endX || endX_2 >= q.bottom.startX && startX_2 <= q.bottom.endX || startX_2 <= q.bottom.startX && endX_2 >= q.bottom.endX && (scans[2] / (q.bottom.endX - q.bottom.startX) < MAX_QUAD_RATIO && scans[2] / (q.bottom.endX - q.bottom.startX) > MIN_QUAD_RATIO);
                      });
                      if (matchingQuads.length > 0) {
                        matchingQuads[0].bottom = line;
                      } else {
                        activeAlignmentPatternQuads.push({ top: line, bottom: line });
                      }
                    }
                  }
                };
                for (var x = -1; x <= matrix.width; x++) {
                  _loop_2(x);
                }
                finderPatternQuads.push.apply(finderPatternQuads, activeFinderPatternQuads.filter(function(q) {
                  return q.bottom.y !== y2 && q.bottom.y - q.top.y >= 2;
                }));
                activeFinderPatternQuads = activeFinderPatternQuads.filter(function(q) {
                  return q.bottom.y === y2;
                });
                alignmentPatternQuads.push.apply(alignmentPatternQuads, activeAlignmentPatternQuads.filter(function(q) {
                  return q.bottom.y !== y2;
                }));
                activeAlignmentPatternQuads = activeAlignmentPatternQuads.filter(function(q) {
                  return q.bottom.y === y2;
                });
              };
              for (var y = 0; y <= matrix.height; y++) {
                _loop_1(y);
              }
              finderPatternQuads.push.apply(finderPatternQuads, activeFinderPatternQuads.filter(function(q) {
                return q.bottom.y - q.top.y >= 2;
              }));
              alignmentPatternQuads.push.apply(alignmentPatternQuads, activeAlignmentPatternQuads);
              var finderPatternGroups = finderPatternQuads.filter(function(q) {
                return q.bottom.y - q.top.y >= 2;
              }).map(function(q) {
                var x = (q.top.startX + q.top.endX + q.bottom.startX + q.bottom.endX) / 4;
                var y2 = (q.top.y + q.bottom.y + 1) / 2;
                if (!matrix.get(Math.round(x), Math.round(y2))) {
                  return;
                }
                var lengths = [q.top.endX - q.top.startX, q.bottom.endX - q.bottom.startX, q.bottom.y - q.top.y + 1];
                var size = sum(lengths) / lengths.length;
                var score = scorePattern({ x: Math.round(x), y: Math.round(y2) }, [1, 1, 3, 1, 1], matrix);
                return { score, x, y: y2, size };
              }).filter(function(q) {
                return !!q;
              }).sort(function(a, b) {
                return a.score - b.score;
              }).map(function(point, i, finderPatterns) {
                if (i > MAX_FINDERPATTERNS_TO_SEARCH) {
                  return null;
                }
                var otherPoints = finderPatterns.filter(function(p, ii) {
                  return i !== ii;
                }).map(function(p) {
                  return { x: p.x, y: p.y, score: p.score + Math.pow(p.size - point.size, 2) / point.size, size: p.size };
                }).sort(function(a, b) {
                  return a.score - b.score;
                });
                if (otherPoints.length < 2) {
                  return null;
                }
                var score = point.score + otherPoints[0].score + otherPoints[1].score;
                return { points: [point].concat(otherPoints.slice(0, 2)), score };
              }).filter(function(q) {
                return !!q;
              }).sort(function(a, b) {
                return a.score - b.score;
              });
              if (finderPatternGroups.length === 0) {
                return null;
              }
              var _a = reorderFinderPatterns(finderPatternGroups[0].points[0], finderPatternGroups[0].points[1], finderPatternGroups[0].points[2]), topRight = _a.topRight, topLeft = _a.topLeft, bottomLeft = _a.bottomLeft;
              var alignment = findAlignmentPattern(matrix, alignmentPatternQuads, topRight, topLeft, bottomLeft);
              var result = [];
              if (alignment) {
                result.push({
                  alignmentPattern: { x: alignment.alignmentPattern.x, y: alignment.alignmentPattern.y },
                  bottomLeft: { x: bottomLeft.x, y: bottomLeft.y },
                  dimension: alignment.dimension,
                  topLeft: { x: topLeft.x, y: topLeft.y },
                  topRight: { x: topRight.x, y: topRight.y }
                });
              }
              var midTopRight = recenterLocation(matrix, topRight);
              var midTopLeft = recenterLocation(matrix, topLeft);
              var midBottomLeft = recenterLocation(matrix, bottomLeft);
              var centeredAlignment = findAlignmentPattern(matrix, alignmentPatternQuads, midTopRight, midTopLeft, midBottomLeft);
              if (centeredAlignment) {
                result.push({
                  alignmentPattern: { x: centeredAlignment.alignmentPattern.x, y: centeredAlignment.alignmentPattern.y },
                  bottomLeft: { x: midBottomLeft.x, y: midBottomLeft.y },
                  topLeft: { x: midTopLeft.x, y: midTopLeft.y },
                  topRight: { x: midTopRight.x, y: midTopRight.y },
                  dimension: centeredAlignment.dimension
                });
              }
              if (result.length === 0) {
                return null;
              }
              return result;
            }
            exports2.locate = locate;
            function findAlignmentPattern(matrix, alignmentPatternQuads, topRight, topLeft, bottomLeft) {
              var _a;
              var dimension;
              var moduleSize;
              try {
                _a = computeDimension(topLeft, topRight, bottomLeft, matrix), dimension = _a.dimension, moduleSize = _a.moduleSize;
              } catch (e) {
                return null;
              }
              var bottomRightFinderPattern = {
                x: topRight.x - topLeft.x + bottomLeft.x,
                y: topRight.y - topLeft.y + bottomLeft.y
              };
              var modulesBetweenFinderPatterns = (distance(topLeft, bottomLeft) + distance(topLeft, topRight)) / 2 / moduleSize;
              var correctionToTopLeft = 1 - 3 / modulesBetweenFinderPatterns;
              var expectedAlignmentPattern = {
                x: topLeft.x + correctionToTopLeft * (bottomRightFinderPattern.x - topLeft.x),
                y: topLeft.y + correctionToTopLeft * (bottomRightFinderPattern.y - topLeft.y)
              };
              var alignmentPatterns = alignmentPatternQuads.map(function(q) {
                var x = (q.top.startX + q.top.endX + q.bottom.startX + q.bottom.endX) / 4;
                var y = (q.top.y + q.bottom.y + 1) / 2;
                if (!matrix.get(Math.floor(x), Math.floor(y))) {
                  return;
                }
                var lengths = [q.top.endX - q.top.startX, q.bottom.endX - q.bottom.startX, q.bottom.y - q.top.y + 1];
                var size = sum(lengths) / lengths.length;
                var sizeScore = scorePattern({ x: Math.floor(x), y: Math.floor(y) }, [1, 1, 1], matrix);
                var score = sizeScore + distance({ x, y }, expectedAlignmentPattern);
                return { x, y, score };
              }).filter(function(v) {
                return !!v;
              }).sort(function(a, b) {
                return a.score - b.score;
              });
              var alignmentPattern = modulesBetweenFinderPatterns >= 15 && alignmentPatterns.length ? alignmentPatterns[0] : expectedAlignmentPattern;
              return { alignmentPattern, dimension };
            }
          })
          /******/
        ])["default"]
      );
    });
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/can-promise.js"(exports, module) {
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/utils.js"(exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/galois-field.js"(exports) {
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/polynomial.js"(exports) {
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/regex.js"(exports) {
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mode.js"(exports) {
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version.js"(exports) {
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/format-info.js"(exports) {
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// node_modules/.pnpm/dijkstrajs@1.0.3/node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "node_modules/.pnpm/dijkstrajs@1.0.3/node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/segments.js"(exports) {
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/qrcode.js"(exports) {
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/chunkstream.js
var require_chunkstream = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/chunkstream.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var ChunkStream = module.exports = function() {
      Stream.call(this);
      this._buffers = [];
      this._buffered = 0;
      this._reads = [];
      this._paused = false;
      this._encoding = "utf8";
      this.writable = true;
    };
    util.inherits(ChunkStream, Stream);
    ChunkStream.prototype.read = function(length, callback) {
      this._reads.push({
        length: Math.abs(length),
        // if length < 0 then at most this length
        allowLess: length < 0,
        func: callback
      });
      process.nextTick(
        function() {
          this._process();
          if (this._paused && this._reads && this._reads.length > 0) {
            this._paused = false;
            this.emit("drain");
          }
        }.bind(this)
      );
    };
    ChunkStream.prototype.write = function(data, encoding) {
      if (!this.writable) {
        this.emit("error", new Error("Stream not writable"));
        return false;
      }
      let dataBuffer;
      if (Buffer.isBuffer(data)) {
        dataBuffer = data;
      } else {
        dataBuffer = Buffer.from(data, encoding || this._encoding);
      }
      this._buffers.push(dataBuffer);
      this._buffered += dataBuffer.length;
      this._process();
      if (this._reads && this._reads.length === 0) {
        this._paused = true;
      }
      return this.writable && !this._paused;
    };
    ChunkStream.prototype.end = function(data, encoding) {
      if (data) {
        this.write(data, encoding);
      }
      this.writable = false;
      if (!this._buffers) {
        return;
      }
      if (this._buffers.length === 0) {
        this._end();
      } else {
        this._buffers.push(null);
        this._process();
      }
    };
    ChunkStream.prototype.destroySoon = ChunkStream.prototype.end;
    ChunkStream.prototype._end = function() {
      if (this._reads.length > 0) {
        this.emit("error", new Error("Unexpected end of input"));
      }
      this.destroy();
    };
    ChunkStream.prototype.destroy = function() {
      if (!this._buffers) {
        return;
      }
      this.writable = false;
      this._reads = null;
      this._buffers = null;
      this.emit("close");
    };
    ChunkStream.prototype._processReadAllowingLess = function(read) {
      this._reads.shift();
      let smallerBuf = this._buffers[0];
      if (smallerBuf.length > read.length) {
        this._buffered -= read.length;
        this._buffers[0] = smallerBuf.slice(read.length);
        read.func.call(this, smallerBuf.slice(0, read.length));
      } else {
        this._buffered -= smallerBuf.length;
        this._buffers.shift();
        read.func.call(this, smallerBuf);
      }
    };
    ChunkStream.prototype._processRead = function(read) {
      this._reads.shift();
      let pos = 0;
      let count = 0;
      let data = Buffer.alloc(read.length);
      while (pos < read.length) {
        let buf = this._buffers[count++];
        let len = Math.min(buf.length, read.length - pos);
        buf.copy(data, pos, 0, len);
        pos += len;
        if (len !== buf.length) {
          this._buffers[--count] = buf.slice(len);
        }
      }
      if (count > 0) {
        this._buffers.splice(0, count);
      }
      this._buffered -= read.length;
      read.func.call(this, data);
    };
    ChunkStream.prototype._process = function() {
      try {
        while (this._buffered > 0 && this._reads && this._reads.length > 0) {
          let read = this._reads[0];
          if (read.allowLess) {
            this._processReadAllowingLess(read);
          } else if (this._buffered >= read.length) {
            this._processRead(read);
          } else {
            break;
          }
        }
        if (this._buffers && !this.writable) {
          this._end();
        }
      } catch (ex) {
        this.emit("error", ex);
      }
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/interlace.js
var require_interlace = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/interlace.js"(exports) {
    "use strict";
    var imagePasses = [
      {
        // pass 1 - 1px
        x: [0],
        y: [0]
      },
      {
        // pass 2 - 1px
        x: [4],
        y: [0]
      },
      {
        // pass 3 - 2px
        x: [0, 4],
        y: [4]
      },
      {
        // pass 4 - 4px
        x: [2, 6],
        y: [0, 4]
      },
      {
        // pass 5 - 8px
        x: [0, 2, 4, 6],
        y: [2, 6]
      },
      {
        // pass 6 - 16px
        x: [1, 3, 5, 7],
        y: [0, 2, 4, 6]
      },
      {
        // pass 7 - 32px
        x: [0, 1, 2, 3, 4, 5, 6, 7],
        y: [1, 3, 5, 7]
      }
    ];
    exports.getImagePasses = function(width, height) {
      let images = [];
      let xLeftOver = width % 8;
      let yLeftOver = height % 8;
      let xRepeats = (width - xLeftOver) / 8;
      let yRepeats = (height - yLeftOver) / 8;
      for (let i = 0; i < imagePasses.length; i++) {
        let pass = imagePasses[i];
        let passWidth = xRepeats * pass.x.length;
        let passHeight = yRepeats * pass.y.length;
        for (let j = 0; j < pass.x.length; j++) {
          if (pass.x[j] < xLeftOver) {
            passWidth++;
          } else {
            break;
          }
        }
        for (let j = 0; j < pass.y.length; j++) {
          if (pass.y[j] < yLeftOver) {
            passHeight++;
          } else {
            break;
          }
        }
        if (passWidth > 0 && passHeight > 0) {
          images.push({ width: passWidth, height: passHeight, index: i });
        }
      }
      return images;
    };
    exports.getInterlaceIterator = function(width) {
      return function(x, y, pass) {
        let outerXLeftOver = x % imagePasses[pass].x.length;
        let outerX = (x - outerXLeftOver) / imagePasses[pass].x.length * 8 + imagePasses[pass].x[outerXLeftOver];
        let outerYLeftOver = y % imagePasses[pass].y.length;
        let outerY = (y - outerYLeftOver) / imagePasses[pass].y.length * 8 + imagePasses[pass].y[outerYLeftOver];
        return outerX * 4 + outerY * width * 4;
      };
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/paeth-predictor.js
var require_paeth_predictor = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/paeth-predictor.js"(exports, module) {
    "use strict";
    module.exports = function paethPredictor(left, above, upLeft) {
      let paeth = left + above - upLeft;
      let pLeft = Math.abs(paeth - left);
      let pAbove = Math.abs(paeth - above);
      let pUpLeft = Math.abs(paeth - upLeft);
      if (pLeft <= pAbove && pLeft <= pUpLeft) {
        return left;
      }
      if (pAbove <= pUpLeft) {
        return above;
      }
      return upLeft;
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse.js
var require_filter_parse = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse.js"(exports, module) {
    "use strict";
    var interlaceUtils = require_interlace();
    var paethPredictor = require_paeth_predictor();
    function getByteWidth(width, bpp, depth) {
      let byteWidth = width * bpp;
      if (depth !== 8) {
        byteWidth = Math.ceil(byteWidth / (8 / depth));
      }
      return byteWidth;
    }
    var Filter = module.exports = function(bitmapInfo, dependencies) {
      let width = bitmapInfo.width;
      let height = bitmapInfo.height;
      let interlace = bitmapInfo.interlace;
      let bpp = bitmapInfo.bpp;
      let depth = bitmapInfo.depth;
      this.read = dependencies.read;
      this.write = dependencies.write;
      this.complete = dependencies.complete;
      this._imageIndex = 0;
      this._images = [];
      if (interlace) {
        let passes = interlaceUtils.getImagePasses(width, height);
        for (let i = 0; i < passes.length; i++) {
          this._images.push({
            byteWidth: getByteWidth(passes[i].width, bpp, depth),
            height: passes[i].height,
            lineIndex: 0
          });
        }
      } else {
        this._images.push({
          byteWidth: getByteWidth(width, bpp, depth),
          height,
          lineIndex: 0
        });
      }
      if (depth === 8) {
        this._xComparison = bpp;
      } else if (depth === 16) {
        this._xComparison = bpp * 2;
      } else {
        this._xComparison = 1;
      }
    };
    Filter.prototype.start = function() {
      this.read(
        this._images[this._imageIndex].byteWidth + 1,
        this._reverseFilterLine.bind(this)
      );
    };
    Filter.prototype._unFilterType1 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f1Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
        unfilteredLine[x] = rawByte + f1Left;
      }
    };
    Filter.prototype._unFilterType2 = function(rawData, unfilteredLine, byteWidth) {
      let lastLine = this._lastLine;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f2Up = lastLine ? lastLine[x] : 0;
        unfilteredLine[x] = rawByte + f2Up;
      }
    };
    Filter.prototype._unFilterType3 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      let lastLine = this._lastLine;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f3Up = lastLine ? lastLine[x] : 0;
        let f3Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
        let f3Add = Math.floor((f3Left + f3Up) / 2);
        unfilteredLine[x] = rawByte + f3Add;
      }
    };
    Filter.prototype._unFilterType4 = function(rawData, unfilteredLine, byteWidth) {
      let xComparison = this._xComparison;
      let xBiggerThan = xComparison - 1;
      let lastLine = this._lastLine;
      for (let x = 0; x < byteWidth; x++) {
        let rawByte = rawData[1 + x];
        let f4Up = lastLine ? lastLine[x] : 0;
        let f4Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
        let f4UpLeft = x > xBiggerThan && lastLine ? lastLine[x - xComparison] : 0;
        let f4Add = paethPredictor(f4Left, f4Up, f4UpLeft);
        unfilteredLine[x] = rawByte + f4Add;
      }
    };
    Filter.prototype._reverseFilterLine = function(rawData) {
      let filter = rawData[0];
      let unfilteredLine;
      let currentImage = this._images[this._imageIndex];
      let byteWidth = currentImage.byteWidth;
      if (filter === 0) {
        unfilteredLine = rawData.slice(1, byteWidth + 1);
      } else {
        unfilteredLine = Buffer.alloc(byteWidth);
        switch (filter) {
          case 1:
            this._unFilterType1(rawData, unfilteredLine, byteWidth);
            break;
          case 2:
            this._unFilterType2(rawData, unfilteredLine, byteWidth);
            break;
          case 3:
            this._unFilterType3(rawData, unfilteredLine, byteWidth);
            break;
          case 4:
            this._unFilterType4(rawData, unfilteredLine, byteWidth);
            break;
          default:
            throw new Error("Unrecognised filter type - " + filter);
        }
      }
      this.write(unfilteredLine);
      currentImage.lineIndex++;
      if (currentImage.lineIndex >= currentImage.height) {
        this._lastLine = null;
        this._imageIndex++;
        currentImage = this._images[this._imageIndex];
      } else {
        this._lastLine = unfilteredLine;
      }
      if (currentImage) {
        this.read(currentImage.byteWidth + 1, this._reverseFilterLine.bind(this));
      } else {
        this._lastLine = null;
        this.complete();
      }
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse-async.js
var require_filter_parse_async = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var ChunkStream = require_chunkstream();
    var Filter = require_filter_parse();
    var FilterAsync = module.exports = function(bitmapInfo) {
      ChunkStream.call(this);
      let buffers = [];
      let that = this;
      this._filter = new Filter(bitmapInfo, {
        read: this.read.bind(this),
        write: function(buffer) {
          buffers.push(buffer);
        },
        complete: function() {
          that.emit("complete", Buffer.concat(buffers));
        }
      });
      this._filter.start();
    };
    util.inherits(FilterAsync, ChunkStream);
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/constants.js
var require_constants = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/constants.js"(exports, module) {
    "use strict";
    module.exports = {
      PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
      TYPE_IHDR: 1229472850,
      TYPE_IEND: 1229278788,
      TYPE_IDAT: 1229209940,
      TYPE_PLTE: 1347179589,
      TYPE_tRNS: 1951551059,
      // eslint-disable-line camelcase
      TYPE_gAMA: 1732332865,
      // eslint-disable-line camelcase
      // color-type bits
      COLORTYPE_GRAYSCALE: 0,
      COLORTYPE_PALETTE: 1,
      COLORTYPE_COLOR: 2,
      COLORTYPE_ALPHA: 4,
      // e.g. grayscale and alpha
      // color-type combinations
      COLORTYPE_PALETTE_COLOR: 3,
      COLORTYPE_COLOR_ALPHA: 6,
      COLORTYPE_TO_BPP_MAP: {
        0: 1,
        2: 3,
        3: 1,
        4: 2,
        6: 4
      },
      GAMMA_DIVISION: 1e5
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/crc.js
var require_crc = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/crc.js"(exports, module) {
    "use strict";
    var crcTable = [];
    (function() {
      for (let i = 0; i < 256; i++) {
        let currentCrc = i;
        for (let j = 0; j < 8; j++) {
          if (currentCrc & 1) {
            currentCrc = 3988292384 ^ currentCrc >>> 1;
          } else {
            currentCrc = currentCrc >>> 1;
          }
        }
        crcTable[i] = currentCrc;
      }
    })();
    var CrcCalculator = module.exports = function() {
      this._crc = -1;
    };
    CrcCalculator.prototype.write = function(data) {
      for (let i = 0; i < data.length; i++) {
        this._crc = crcTable[(this._crc ^ data[i]) & 255] ^ this._crc >>> 8;
      }
      return true;
    };
    CrcCalculator.prototype.crc32 = function() {
      return this._crc ^ -1;
    };
    CrcCalculator.crc32 = function(buf) {
      let crc = -1;
      for (let i = 0; i < buf.length; i++) {
        crc = crcTable[(crc ^ buf[i]) & 255] ^ crc >>> 8;
      }
      return crc ^ -1;
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser.js
var require_parser = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    var CrcCalculator = require_crc();
    var Parser = module.exports = function(options, dependencies) {
      this._options = options;
      options.checkCRC = options.checkCRC !== false;
      this._hasIHDR = false;
      this._hasIEND = false;
      this._emittedHeadersFinished = false;
      this._palette = [];
      this._colorType = 0;
      this._chunks = {};
      this._chunks[constants.TYPE_IHDR] = this._handleIHDR.bind(this);
      this._chunks[constants.TYPE_IEND] = this._handleIEND.bind(this);
      this._chunks[constants.TYPE_IDAT] = this._handleIDAT.bind(this);
      this._chunks[constants.TYPE_PLTE] = this._handlePLTE.bind(this);
      this._chunks[constants.TYPE_tRNS] = this._handleTRNS.bind(this);
      this._chunks[constants.TYPE_gAMA] = this._handleGAMA.bind(this);
      this.read = dependencies.read;
      this.error = dependencies.error;
      this.metadata = dependencies.metadata;
      this.gamma = dependencies.gamma;
      this.transColor = dependencies.transColor;
      this.palette = dependencies.palette;
      this.parsed = dependencies.parsed;
      this.inflateData = dependencies.inflateData;
      this.finished = dependencies.finished;
      this.simpleTransparency = dependencies.simpleTransparency;
      this.headersFinished = dependencies.headersFinished || function() {
      };
    };
    Parser.prototype.start = function() {
      this.read(constants.PNG_SIGNATURE.length, this._parseSignature.bind(this));
    };
    Parser.prototype._parseSignature = function(data) {
      let signature = constants.PNG_SIGNATURE;
      for (let i = 0; i < signature.length; i++) {
        if (data[i] !== signature[i]) {
          this.error(new Error("Invalid file signature"));
          return;
        }
      }
      this.read(8, this._parseChunkBegin.bind(this));
    };
    Parser.prototype._parseChunkBegin = function(data) {
      let length = data.readUInt32BE(0);
      let type = data.readUInt32BE(4);
      let name = "";
      for (let i = 4; i < 8; i++) {
        name += String.fromCharCode(data[i]);
      }
      let ancillary = Boolean(data[4] & 32);
      if (!this._hasIHDR && type !== constants.TYPE_IHDR) {
        this.error(new Error("Expected IHDR on beggining"));
        return;
      }
      this._crc = new CrcCalculator();
      this._crc.write(Buffer.from(name));
      if (this._chunks[type]) {
        return this._chunks[type](length);
      }
      if (!ancillary) {
        this.error(new Error("Unsupported critical chunk type " + name));
        return;
      }
      this.read(length + 4, this._skipChunk.bind(this));
    };
    Parser.prototype._skipChunk = function() {
      this.read(8, this._parseChunkBegin.bind(this));
    };
    Parser.prototype._handleChunkEnd = function() {
      this.read(4, this._parseChunkEnd.bind(this));
    };
    Parser.prototype._parseChunkEnd = function(data) {
      let fileCrc = data.readInt32BE(0);
      let calcCrc = this._crc.crc32();
      if (this._options.checkCRC && calcCrc !== fileCrc) {
        this.error(new Error("Crc error - " + fileCrc + " - " + calcCrc));
        return;
      }
      if (!this._hasIEND) {
        this.read(8, this._parseChunkBegin.bind(this));
      }
    };
    Parser.prototype._handleIHDR = function(length) {
      this.read(length, this._parseIHDR.bind(this));
    };
    Parser.prototype._parseIHDR = function(data) {
      this._crc.write(data);
      let width = data.readUInt32BE(0);
      let height = data.readUInt32BE(4);
      let depth = data[8];
      let colorType = data[9];
      let compr = data[10];
      let filter = data[11];
      let interlace = data[12];
      if (depth !== 8 && depth !== 4 && depth !== 2 && depth !== 1 && depth !== 16) {
        this.error(new Error("Unsupported bit depth " + depth));
        return;
      }
      if (!(colorType in constants.COLORTYPE_TO_BPP_MAP)) {
        this.error(new Error("Unsupported color type"));
        return;
      }
      if (compr !== 0) {
        this.error(new Error("Unsupported compression method"));
        return;
      }
      if (filter !== 0) {
        this.error(new Error("Unsupported filter method"));
        return;
      }
      if (interlace !== 0 && interlace !== 1) {
        this.error(new Error("Unsupported interlace method"));
        return;
      }
      this._colorType = colorType;
      let bpp = constants.COLORTYPE_TO_BPP_MAP[this._colorType];
      this._hasIHDR = true;
      this.metadata({
        width,
        height,
        depth,
        interlace: Boolean(interlace),
        palette: Boolean(colorType & constants.COLORTYPE_PALETTE),
        color: Boolean(colorType & constants.COLORTYPE_COLOR),
        alpha: Boolean(colorType & constants.COLORTYPE_ALPHA),
        bpp,
        colorType
      });
      this._handleChunkEnd();
    };
    Parser.prototype._handlePLTE = function(length) {
      this.read(length, this._parsePLTE.bind(this));
    };
    Parser.prototype._parsePLTE = function(data) {
      this._crc.write(data);
      let entries = Math.floor(data.length / 3);
      for (let i = 0; i < entries; i++) {
        this._palette.push([data[i * 3], data[i * 3 + 1], data[i * 3 + 2], 255]);
      }
      this.palette(this._palette);
      this._handleChunkEnd();
    };
    Parser.prototype._handleTRNS = function(length) {
      this.simpleTransparency();
      this.read(length, this._parseTRNS.bind(this));
    };
    Parser.prototype._parseTRNS = function(data) {
      this._crc.write(data);
      if (this._colorType === constants.COLORTYPE_PALETTE_COLOR) {
        if (this._palette.length === 0) {
          this.error(new Error("Transparency chunk must be after palette"));
          return;
        }
        if (data.length > this._palette.length) {
          this.error(new Error("More transparent colors than palette size"));
          return;
        }
        for (let i = 0; i < data.length; i++) {
          this._palette[i][3] = data[i];
        }
        this.palette(this._palette);
      }
      if (this._colorType === constants.COLORTYPE_GRAYSCALE) {
        this.transColor([data.readUInt16BE(0)]);
      }
      if (this._colorType === constants.COLORTYPE_COLOR) {
        this.transColor([
          data.readUInt16BE(0),
          data.readUInt16BE(2),
          data.readUInt16BE(4)
        ]);
      }
      this._handleChunkEnd();
    };
    Parser.prototype._handleGAMA = function(length) {
      this.read(length, this._parseGAMA.bind(this));
    };
    Parser.prototype._parseGAMA = function(data) {
      this._crc.write(data);
      this.gamma(data.readUInt32BE(0) / constants.GAMMA_DIVISION);
      this._handleChunkEnd();
    };
    Parser.prototype._handleIDAT = function(length) {
      if (!this._emittedHeadersFinished) {
        this._emittedHeadersFinished = true;
        this.headersFinished();
      }
      this.read(-length, this._parseIDAT.bind(this, length));
    };
    Parser.prototype._parseIDAT = function(length, data) {
      this._crc.write(data);
      if (this._colorType === constants.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) {
        throw new Error("Expected palette not found");
      }
      this.inflateData(data);
      let leftOverLength = length - data.length;
      if (leftOverLength > 0) {
        this._handleIDAT(leftOverLength);
      } else {
        this._handleChunkEnd();
      }
    };
    Parser.prototype._handleIEND = function(length) {
      this.read(length, this._parseIEND.bind(this));
    };
    Parser.prototype._parseIEND = function(data) {
      this._crc.write(data);
      this._hasIEND = true;
      this._handleChunkEnd();
      if (this.finished) {
        this.finished();
      }
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/bitmapper.js
var require_bitmapper = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/bitmapper.js"(exports) {
    "use strict";
    var interlaceUtils = require_interlace();
    var pixelBppMapper = [
      // 0 - dummy entry
      function() {
      },
      // 1 - L
      // 0: 0, 1: 0, 2: 0, 3: 0xff
      function(pxData, data, pxPos, rawPos) {
        if (rawPos === data.length) {
          throw new Error("Ran out of data");
        }
        let pixel = data[rawPos];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = 255;
      },
      // 2 - LA
      // 0: 0, 1: 0, 2: 0, 3: 1
      function(pxData, data, pxPos, rawPos) {
        if (rawPos + 1 >= data.length) {
          throw new Error("Ran out of data");
        }
        let pixel = data[rawPos];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = data[rawPos + 1];
      },
      // 3 - RGB
      // 0: 0, 1: 1, 2: 2, 3: 0xff
      function(pxData, data, pxPos, rawPos) {
        if (rawPos + 2 >= data.length) {
          throw new Error("Ran out of data");
        }
        pxData[pxPos] = data[rawPos];
        pxData[pxPos + 1] = data[rawPos + 1];
        pxData[pxPos + 2] = data[rawPos + 2];
        pxData[pxPos + 3] = 255;
      },
      // 4 - RGBA
      // 0: 0, 1: 1, 2: 2, 3: 3
      function(pxData, data, pxPos, rawPos) {
        if (rawPos + 3 >= data.length) {
          throw new Error("Ran out of data");
        }
        pxData[pxPos] = data[rawPos];
        pxData[pxPos + 1] = data[rawPos + 1];
        pxData[pxPos + 2] = data[rawPos + 2];
        pxData[pxPos + 3] = data[rawPos + 3];
      }
    ];
    var pixelBppCustomMapper = [
      // 0 - dummy entry
      function() {
      },
      // 1 - L
      // 0: 0, 1: 0, 2: 0, 3: 0xff
      function(pxData, pixelData, pxPos, maxBit) {
        let pixel = pixelData[0];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = maxBit;
      },
      // 2 - LA
      // 0: 0, 1: 0, 2: 0, 3: 1
      function(pxData, pixelData, pxPos) {
        let pixel = pixelData[0];
        pxData[pxPos] = pixel;
        pxData[pxPos + 1] = pixel;
        pxData[pxPos + 2] = pixel;
        pxData[pxPos + 3] = pixelData[1];
      },
      // 3 - RGB
      // 0: 0, 1: 1, 2: 2, 3: 0xff
      function(pxData, pixelData, pxPos, maxBit) {
        pxData[pxPos] = pixelData[0];
        pxData[pxPos + 1] = pixelData[1];
        pxData[pxPos + 2] = pixelData[2];
        pxData[pxPos + 3] = maxBit;
      },
      // 4 - RGBA
      // 0: 0, 1: 1, 2: 2, 3: 3
      function(pxData, pixelData, pxPos) {
        pxData[pxPos] = pixelData[0];
        pxData[pxPos + 1] = pixelData[1];
        pxData[pxPos + 2] = pixelData[2];
        pxData[pxPos + 3] = pixelData[3];
      }
    ];
    function bitRetriever(data, depth) {
      let leftOver = [];
      let i = 0;
      function split() {
        if (i === data.length) {
          throw new Error("Ran out of data");
        }
        let byte = data[i];
        i++;
        let byte8, byte7, byte6, byte5, byte4, byte3, byte2, byte1;
        switch (depth) {
          default:
            throw new Error("unrecognised depth");
          case 16:
            byte2 = data[i];
            i++;
            leftOver.push((byte << 8) + byte2);
            break;
          case 4:
            byte2 = byte & 15;
            byte1 = byte >> 4;
            leftOver.push(byte1, byte2);
            break;
          case 2:
            byte4 = byte & 3;
            byte3 = byte >> 2 & 3;
            byte2 = byte >> 4 & 3;
            byte1 = byte >> 6 & 3;
            leftOver.push(byte1, byte2, byte3, byte4);
            break;
          case 1:
            byte8 = byte & 1;
            byte7 = byte >> 1 & 1;
            byte6 = byte >> 2 & 1;
            byte5 = byte >> 3 & 1;
            byte4 = byte >> 4 & 1;
            byte3 = byte >> 5 & 1;
            byte2 = byte >> 6 & 1;
            byte1 = byte >> 7 & 1;
            leftOver.push(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8);
            break;
        }
      }
      return {
        get: function(count) {
          while (leftOver.length < count) {
            split();
          }
          let returner = leftOver.slice(0, count);
          leftOver = leftOver.slice(count);
          return returner;
        },
        resetAfterLine: function() {
          leftOver.length = 0;
        },
        end: function() {
          if (i !== data.length) {
            throw new Error("extra data found");
          }
        }
      };
    }
    function mapImage8Bit(image, pxData, getPxPos, bpp, data, rawPos) {
      let imageWidth = image.width;
      let imageHeight = image.height;
      let imagePass = image.index;
      for (let y = 0; y < imageHeight; y++) {
        for (let x = 0; x < imageWidth; x++) {
          let pxPos = getPxPos(x, y, imagePass);
          pixelBppMapper[bpp](pxData, data, pxPos, rawPos);
          rawPos += bpp;
        }
      }
      return rawPos;
    }
    function mapImageCustomBit(image, pxData, getPxPos, bpp, bits, maxBit) {
      let imageWidth = image.width;
      let imageHeight = image.height;
      let imagePass = image.index;
      for (let y = 0; y < imageHeight; y++) {
        for (let x = 0; x < imageWidth; x++) {
          let pixelData = bits.get(bpp);
          let pxPos = getPxPos(x, y, imagePass);
          pixelBppCustomMapper[bpp](pxData, pixelData, pxPos, maxBit);
        }
        bits.resetAfterLine();
      }
    }
    exports.dataToBitMap = function(data, bitmapInfo) {
      let width = bitmapInfo.width;
      let height = bitmapInfo.height;
      let depth = bitmapInfo.depth;
      let bpp = bitmapInfo.bpp;
      let interlace = bitmapInfo.interlace;
      let bits;
      if (depth !== 8) {
        bits = bitRetriever(data, depth);
      }
      let pxData;
      if (depth <= 8) {
        pxData = Buffer.alloc(width * height * 4);
      } else {
        pxData = new Uint16Array(width * height * 4);
      }
      let maxBit = Math.pow(2, depth) - 1;
      let rawPos = 0;
      let images;
      let getPxPos;
      if (interlace) {
        images = interlaceUtils.getImagePasses(width, height);
        getPxPos = interlaceUtils.getInterlaceIterator(width, height);
      } else {
        let nonInterlacedPxPos = 0;
        getPxPos = function() {
          let returner = nonInterlacedPxPos;
          nonInterlacedPxPos += 4;
          return returner;
        };
        images = [{ width, height }];
      }
      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        if (depth === 8) {
          rawPos = mapImage8Bit(
            images[imageIndex],
            pxData,
            getPxPos,
            bpp,
            data,
            rawPos
          );
        } else {
          mapImageCustomBit(
            images[imageIndex],
            pxData,
            getPxPos,
            bpp,
            bits,
            maxBit
          );
        }
      }
      if (depth === 8) {
        if (rawPos !== data.length) {
          throw new Error("extra data found");
        }
      } else {
        bits.end();
      }
      return pxData;
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/format-normaliser.js
var require_format_normaliser = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/format-normaliser.js"(exports, module) {
    "use strict";
    function dePalette(indata, outdata, width, height, palette) {
      let pxPos = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let color = palette[indata[pxPos]];
          if (!color) {
            throw new Error("index " + indata[pxPos] + " not in palette");
          }
          for (let i = 0; i < 4; i++) {
            outdata[pxPos + i] = color[i];
          }
          pxPos += 4;
        }
      }
    }
    function replaceTransparentColor(indata, outdata, width, height, transColor) {
      let pxPos = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let makeTrans = false;
          if (transColor.length === 1) {
            if (transColor[0] === indata[pxPos]) {
              makeTrans = true;
            }
          } else if (transColor[0] === indata[pxPos] && transColor[1] === indata[pxPos + 1] && transColor[2] === indata[pxPos + 2]) {
            makeTrans = true;
          }
          if (makeTrans) {
            for (let i = 0; i < 4; i++) {
              outdata[pxPos + i] = 0;
            }
          }
          pxPos += 4;
        }
      }
    }
    function scaleDepth(indata, outdata, width, height, depth) {
      let maxOutSample = 255;
      let maxInSample = Math.pow(2, depth) - 1;
      let pxPos = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          for (let i = 0; i < 4; i++) {
            outdata[pxPos + i] = Math.floor(
              indata[pxPos + i] * maxOutSample / maxInSample + 0.5
            );
          }
          pxPos += 4;
        }
      }
    }
    module.exports = function(indata, imageData) {
      let depth = imageData.depth;
      let width = imageData.width;
      let height = imageData.height;
      let colorType = imageData.colorType;
      let transColor = imageData.transColor;
      let palette = imageData.palette;
      let outdata = indata;
      if (colorType === 3) {
        dePalette(indata, outdata, width, height, palette);
      } else {
        if (transColor) {
          replaceTransparentColor(indata, outdata, width, height, transColor);
        }
        if (depth !== 8) {
          if (depth === 16) {
            outdata = Buffer.alloc(width * height * 4);
          }
          scaleDepth(indata, outdata, width, height, depth);
        }
      }
      return outdata;
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser-async.js
var require_parser_async = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var zlib = __require("zlib");
    var ChunkStream = require_chunkstream();
    var FilterAsync = require_filter_parse_async();
    var Parser = require_parser();
    var bitmapper = require_bitmapper();
    var formatNormaliser = require_format_normaliser();
    var ParserAsync = module.exports = function(options) {
      ChunkStream.call(this);
      this._parser = new Parser(options, {
        read: this.read.bind(this),
        error: this._handleError.bind(this),
        metadata: this._handleMetaData.bind(this),
        gamma: this.emit.bind(this, "gamma"),
        palette: this._handlePalette.bind(this),
        transColor: this._handleTransColor.bind(this),
        finished: this._finished.bind(this),
        inflateData: this._inflateData.bind(this),
        simpleTransparency: this._simpleTransparency.bind(this),
        headersFinished: this._headersFinished.bind(this)
      });
      this._options = options;
      this.writable = true;
      this._parser.start();
    };
    util.inherits(ParserAsync, ChunkStream);
    ParserAsync.prototype._handleError = function(err) {
      this.emit("error", err);
      this.writable = false;
      this.destroy();
      if (this._inflate && this._inflate.destroy) {
        this._inflate.destroy();
      }
      if (this._filter) {
        this._filter.destroy();
        this._filter.on("error", function() {
        });
      }
      this.errord = true;
    };
    ParserAsync.prototype._inflateData = function(data) {
      if (!this._inflate) {
        if (this._bitmapInfo.interlace) {
          this._inflate = zlib.createInflate();
          this._inflate.on("error", this.emit.bind(this, "error"));
          this._filter.on("complete", this._complete.bind(this));
          this._inflate.pipe(this._filter);
        } else {
          let rowSize = (this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1;
          let imageSize = rowSize * this._bitmapInfo.height;
          let chunkSize = Math.max(imageSize, zlib.Z_MIN_CHUNK);
          this._inflate = zlib.createInflate({ chunkSize });
          let leftToInflate = imageSize;
          let emitError = this.emit.bind(this, "error");
          this._inflate.on("error", function(err) {
            if (!leftToInflate) {
              return;
            }
            emitError(err);
          });
          this._filter.on("complete", this._complete.bind(this));
          let filterWrite = this._filter.write.bind(this._filter);
          this._inflate.on("data", function(chunk) {
            if (!leftToInflate) {
              return;
            }
            if (chunk.length > leftToInflate) {
              chunk = chunk.slice(0, leftToInflate);
            }
            leftToInflate -= chunk.length;
            filterWrite(chunk);
          });
          this._inflate.on("end", this._filter.end.bind(this._filter));
        }
      }
      this._inflate.write(data);
    };
    ParserAsync.prototype._handleMetaData = function(metaData) {
      this._metaData = metaData;
      this._bitmapInfo = Object.create(metaData);
      this._filter = new FilterAsync(this._bitmapInfo);
    };
    ParserAsync.prototype._handleTransColor = function(transColor) {
      this._bitmapInfo.transColor = transColor;
    };
    ParserAsync.prototype._handlePalette = function(palette) {
      this._bitmapInfo.palette = palette;
    };
    ParserAsync.prototype._simpleTransparency = function() {
      this._metaData.alpha = true;
    };
    ParserAsync.prototype._headersFinished = function() {
      this.emit("metadata", this._metaData);
    };
    ParserAsync.prototype._finished = function() {
      if (this.errord) {
        return;
      }
      if (!this._inflate) {
        this.emit("error", "No Inflate block");
      } else {
        this._inflate.end();
      }
    };
    ParserAsync.prototype._complete = function(filteredData) {
      if (this.errord) {
        return;
      }
      let normalisedBitmapData;
      try {
        let bitmapData = bitmapper.dataToBitMap(filteredData, this._bitmapInfo);
        normalisedBitmapData = formatNormaliser(bitmapData, this._bitmapInfo);
        bitmapData = null;
      } catch (ex) {
        this._handleError(ex);
        return;
      }
      this.emit("parsed", normalisedBitmapData);
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/bitpacker.js
var require_bitpacker = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/bitpacker.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    module.exports = function(dataIn, width, height, options) {
      let outHasAlpha = [constants.COLORTYPE_COLOR_ALPHA, constants.COLORTYPE_ALPHA].indexOf(
        options.colorType
      ) !== -1;
      if (options.colorType === options.inputColorType) {
        let bigEndian = (function() {
          let buffer = new ArrayBuffer(2);
          new DataView(buffer).setInt16(
            0,
            256,
            true
            /* littleEndian */
          );
          return new Int16Array(buffer)[0] !== 256;
        })();
        if (options.bitDepth === 8 || options.bitDepth === 16 && bigEndian) {
          return dataIn;
        }
      }
      let data = options.bitDepth !== 16 ? dataIn : new Uint16Array(dataIn.buffer);
      let maxValue = 255;
      let inBpp = constants.COLORTYPE_TO_BPP_MAP[options.inputColorType];
      if (inBpp === 4 && !options.inputHasAlpha) {
        inBpp = 3;
      }
      let outBpp = constants.COLORTYPE_TO_BPP_MAP[options.colorType];
      if (options.bitDepth === 16) {
        maxValue = 65535;
        outBpp *= 2;
      }
      let outData = Buffer.alloc(width * height * outBpp);
      let inIndex = 0;
      let outIndex = 0;
      let bgColor = options.bgColor || {};
      if (bgColor.red === void 0) {
        bgColor.red = maxValue;
      }
      if (bgColor.green === void 0) {
        bgColor.green = maxValue;
      }
      if (bgColor.blue === void 0) {
        bgColor.blue = maxValue;
      }
      function getRGBA() {
        let red;
        let green;
        let blue;
        let alpha = maxValue;
        switch (options.inputColorType) {
          case constants.COLORTYPE_COLOR_ALPHA:
            alpha = data[inIndex + 3];
            red = data[inIndex];
            green = data[inIndex + 1];
            blue = data[inIndex + 2];
            break;
          case constants.COLORTYPE_COLOR:
            red = data[inIndex];
            green = data[inIndex + 1];
            blue = data[inIndex + 2];
            break;
          case constants.COLORTYPE_ALPHA:
            alpha = data[inIndex + 1];
            red = data[inIndex];
            green = red;
            blue = red;
            break;
          case constants.COLORTYPE_GRAYSCALE:
            red = data[inIndex];
            green = red;
            blue = red;
            break;
          default:
            throw new Error(
              "input color type:" + options.inputColorType + " is not supported at present"
            );
        }
        if (options.inputHasAlpha) {
          if (!outHasAlpha) {
            alpha /= maxValue;
            red = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.red + alpha * red), 0),
              maxValue
            );
            green = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.green + alpha * green), 0),
              maxValue
            );
            blue = Math.min(
              Math.max(Math.round((1 - alpha) * bgColor.blue + alpha * blue), 0),
              maxValue
            );
          }
        }
        return { red, green, blue, alpha };
      }
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let rgba = getRGBA(data, inIndex);
          switch (options.colorType) {
            case constants.COLORTYPE_COLOR_ALPHA:
            case constants.COLORTYPE_COLOR:
              if (options.bitDepth === 8) {
                outData[outIndex] = rgba.red;
                outData[outIndex + 1] = rgba.green;
                outData[outIndex + 2] = rgba.blue;
                if (outHasAlpha) {
                  outData[outIndex + 3] = rgba.alpha;
                }
              } else {
                outData.writeUInt16BE(rgba.red, outIndex);
                outData.writeUInt16BE(rgba.green, outIndex + 2);
                outData.writeUInt16BE(rgba.blue, outIndex + 4);
                if (outHasAlpha) {
                  outData.writeUInt16BE(rgba.alpha, outIndex + 6);
                }
              }
              break;
            case constants.COLORTYPE_ALPHA:
            case constants.COLORTYPE_GRAYSCALE: {
              let grayscale = (rgba.red + rgba.green + rgba.blue) / 3;
              if (options.bitDepth === 8) {
                outData[outIndex] = grayscale;
                if (outHasAlpha) {
                  outData[outIndex + 1] = rgba.alpha;
                }
              } else {
                outData.writeUInt16BE(grayscale, outIndex);
                if (outHasAlpha) {
                  outData.writeUInt16BE(rgba.alpha, outIndex + 2);
                }
              }
              break;
            }
            default:
              throw new Error("unrecognised color Type " + options.colorType);
          }
          inIndex += inBpp;
          outIndex += outBpp;
        }
      }
      return outData;
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-pack.js
var require_filter_pack = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-pack.js"(exports, module) {
    "use strict";
    var paethPredictor = require_paeth_predictor();
    function filterNone(pxData, pxPos, byteWidth, rawData, rawPos) {
      for (let x = 0; x < byteWidth; x++) {
        rawData[rawPos + x] = pxData[pxPos + x];
      }
    }
    function filterSumNone(pxData, pxPos, byteWidth) {
      let sum = 0;
      let length = pxPos + byteWidth;
      for (let i = pxPos; i < length; i++) {
        sum += Math.abs(pxData[i]);
      }
      return sum;
    }
    function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let val = pxData[pxPos + x] - left;
        rawData[rawPos + x] = val;
      }
    }
    function filterSumSub(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let val = pxData[pxPos + x] - left;
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterUp(pxData, pxPos, byteWidth, rawData, rawPos) {
      for (let x = 0; x < byteWidth; x++) {
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let val = pxData[pxPos + x] - up;
        rawData[rawPos + x] = val;
      }
    }
    function filterSumUp(pxData, pxPos, byteWidth) {
      let sum = 0;
      let length = pxPos + byteWidth;
      for (let x = pxPos; x < length; x++) {
        let up = pxPos > 0 ? pxData[x - byteWidth] : 0;
        let val = pxData[x] - up;
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let val = pxData[pxPos + x] - (left + up >> 1);
        rawData[rawPos + x] = val;
      }
    }
    function filterSumAvg(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let val = pxData[pxPos + x] - (left + up >> 1);
        sum += Math.abs(val);
      }
      return sum;
    }
    function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
        let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
        rawData[rawPos + x] = val;
      }
    }
    function filterSumPaeth(pxData, pxPos, byteWidth, bpp) {
      let sum = 0;
      for (let x = 0; x < byteWidth; x++) {
        let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
        let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
        let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
        let val = pxData[pxPos + x] - paethPredictor(left, up, upleft);
        sum += Math.abs(val);
      }
      return sum;
    }
    var filters = {
      0: filterNone,
      1: filterSub,
      2: filterUp,
      3: filterAvg,
      4: filterPaeth
    };
    var filterSums = {
      0: filterSumNone,
      1: filterSumSub,
      2: filterSumUp,
      3: filterSumAvg,
      4: filterSumPaeth
    };
    module.exports = function(pxData, width, height, options, bpp) {
      let filterTypes;
      if (!("filterType" in options) || options.filterType === -1) {
        filterTypes = [0, 1, 2, 3, 4];
      } else if (typeof options.filterType === "number") {
        filterTypes = [options.filterType];
      } else {
        throw new Error("unrecognised filter types");
      }
      if (options.bitDepth === 16) {
        bpp *= 2;
      }
      let byteWidth = width * bpp;
      let rawPos = 0;
      let pxPos = 0;
      let rawData = Buffer.alloc((byteWidth + 1) * height);
      let sel = filterTypes[0];
      for (let y = 0; y < height; y++) {
        if (filterTypes.length > 1) {
          let min = Infinity;
          for (let i = 0; i < filterTypes.length; i++) {
            let sum = filterSums[filterTypes[i]](pxData, pxPos, byteWidth, bpp);
            if (sum < min) {
              sel = filterTypes[i];
              min = sum;
            }
          }
        }
        rawData[rawPos] = sel;
        rawPos++;
        filters[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp);
        rawPos += byteWidth;
        pxPos += byteWidth;
      }
      return rawData;
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer.js
var require_packer = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    var CrcStream = require_crc();
    var bitPacker = require_bitpacker();
    var filter = require_filter_pack();
    var zlib = __require("zlib");
    var Packer = module.exports = function(options) {
      this._options = options;
      options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
      options.deflateLevel = options.deflateLevel != null ? options.deflateLevel : 9;
      options.deflateStrategy = options.deflateStrategy != null ? options.deflateStrategy : 3;
      options.inputHasAlpha = options.inputHasAlpha != null ? options.inputHasAlpha : true;
      options.deflateFactory = options.deflateFactory || zlib.createDeflate;
      options.bitDepth = options.bitDepth || 8;
      options.colorType = typeof options.colorType === "number" ? options.colorType : constants.COLORTYPE_COLOR_ALPHA;
      options.inputColorType = typeof options.inputColorType === "number" ? options.inputColorType : constants.COLORTYPE_COLOR_ALPHA;
      if ([
        constants.COLORTYPE_GRAYSCALE,
        constants.COLORTYPE_COLOR,
        constants.COLORTYPE_COLOR_ALPHA,
        constants.COLORTYPE_ALPHA
      ].indexOf(options.colorType) === -1) {
        throw new Error(
          "option color type:" + options.colorType + " is not supported at present"
        );
      }
      if ([
        constants.COLORTYPE_GRAYSCALE,
        constants.COLORTYPE_COLOR,
        constants.COLORTYPE_COLOR_ALPHA,
        constants.COLORTYPE_ALPHA
      ].indexOf(options.inputColorType) === -1) {
        throw new Error(
          "option input color type:" + options.inputColorType + " is not supported at present"
        );
      }
      if (options.bitDepth !== 8 && options.bitDepth !== 16) {
        throw new Error(
          "option bit depth:" + options.bitDepth + " is not supported at present"
        );
      }
    };
    Packer.prototype.getDeflateOptions = function() {
      return {
        chunkSize: this._options.deflateChunkSize,
        level: this._options.deflateLevel,
        strategy: this._options.deflateStrategy
      };
    };
    Packer.prototype.createDeflate = function() {
      return this._options.deflateFactory(this.getDeflateOptions());
    };
    Packer.prototype.filterData = function(data, width, height) {
      let packedData = bitPacker(data, width, height, this._options);
      let bpp = constants.COLORTYPE_TO_BPP_MAP[this._options.colorType];
      let filteredData = filter(packedData, width, height, this._options, bpp);
      return filteredData;
    };
    Packer.prototype._packChunk = function(type, data) {
      let len = data ? data.length : 0;
      let buf = Buffer.alloc(len + 12);
      buf.writeUInt32BE(len, 0);
      buf.writeUInt32BE(type, 4);
      if (data) {
        data.copy(buf, 8);
      }
      buf.writeInt32BE(
        CrcStream.crc32(buf.slice(4, buf.length - 4)),
        buf.length - 4
      );
      return buf;
    };
    Packer.prototype.packGAMA = function(gamma) {
      let buf = Buffer.alloc(4);
      buf.writeUInt32BE(Math.floor(gamma * constants.GAMMA_DIVISION), 0);
      return this._packChunk(constants.TYPE_gAMA, buf);
    };
    Packer.prototype.packIHDR = function(width, height) {
      let buf = Buffer.alloc(13);
      buf.writeUInt32BE(width, 0);
      buf.writeUInt32BE(height, 4);
      buf[8] = this._options.bitDepth;
      buf[9] = this._options.colorType;
      buf[10] = 0;
      buf[11] = 0;
      buf[12] = 0;
      return this._packChunk(constants.TYPE_IHDR, buf);
    };
    Packer.prototype.packIDAT = function(data) {
      return this._packChunk(constants.TYPE_IDAT, data);
    };
    Packer.prototype.packIEND = function() {
      return this._packChunk(constants.TYPE_IEND, null);
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer-async.js
var require_packer_async = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer-async.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var constants = require_constants();
    var Packer = require_packer();
    var PackerAsync = module.exports = function(opt) {
      Stream.call(this);
      let options = opt || {};
      this._packer = new Packer(options);
      this._deflate = this._packer.createDeflate();
      this.readable = true;
    };
    util.inherits(PackerAsync, Stream);
    PackerAsync.prototype.pack = function(data, width, height, gamma) {
      this.emit("data", Buffer.from(constants.PNG_SIGNATURE));
      this.emit("data", this._packer.packIHDR(width, height));
      if (gamma) {
        this.emit("data", this._packer.packGAMA(gamma));
      }
      let filteredData = this._packer.filterData(data, width, height);
      this._deflate.on("error", this.emit.bind(this, "error"));
      this._deflate.on(
        "data",
        function(compressedData) {
          this.emit("data", this._packer.packIDAT(compressedData));
        }.bind(this)
      );
      this._deflate.on(
        "end",
        function() {
          this.emit("data", this._packer.packIEND());
          this.emit("end");
        }.bind(this)
      );
      this._deflate.end(filteredData);
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/sync-inflate.js
var require_sync_inflate = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/sync-inflate.js"(exports, module) {
    "use strict";
    var assert = __require("assert").ok;
    var zlib = __require("zlib");
    var util = __require("util");
    var kMaxLength = __require("buffer").kMaxLength;
    function Inflate(opts) {
      if (!(this instanceof Inflate)) {
        return new Inflate(opts);
      }
      if (opts && opts.chunkSize < zlib.Z_MIN_CHUNK) {
        opts.chunkSize = zlib.Z_MIN_CHUNK;
      }
      zlib.Inflate.call(this, opts);
      this._offset = this._offset === void 0 ? this._outOffset : this._offset;
      this._buffer = this._buffer || this._outBuffer;
      if (opts && opts.maxLength != null) {
        this._maxLength = opts.maxLength;
      }
    }
    function createInflate(opts) {
      return new Inflate(opts);
    }
    function _close(engine, callback) {
      if (callback) {
        process.nextTick(callback);
      }
      if (!engine._handle) {
        return;
      }
      engine._handle.close();
      engine._handle = null;
    }
    Inflate.prototype._processChunk = function(chunk, flushFlag, asyncCb) {
      if (typeof asyncCb === "function") {
        return zlib.Inflate._processChunk.call(this, chunk, flushFlag, asyncCb);
      }
      let self2 = this;
      let availInBefore = chunk && chunk.length;
      let availOutBefore = this._chunkSize - this._offset;
      let leftToInflate = this._maxLength;
      let inOff = 0;
      let buffers = [];
      let nread = 0;
      let error;
      this.on("error", function(err) {
        error = err;
      });
      function handleChunk(availInAfter, availOutAfter) {
        if (self2._hadError) {
          return;
        }
        let have = availOutBefore - availOutAfter;
        assert(have >= 0, "have should not go down");
        if (have > 0) {
          let out = self2._buffer.slice(self2._offset, self2._offset + have);
          self2._offset += have;
          if (out.length > leftToInflate) {
            out = out.slice(0, leftToInflate);
          }
          buffers.push(out);
          nread += out.length;
          leftToInflate -= out.length;
          if (leftToInflate === 0) {
            return false;
          }
        }
        if (availOutAfter === 0 || self2._offset >= self2._chunkSize) {
          availOutBefore = self2._chunkSize;
          self2._offset = 0;
          self2._buffer = Buffer.allocUnsafe(self2._chunkSize);
        }
        if (availOutAfter === 0) {
          inOff += availInBefore - availInAfter;
          availInBefore = availInAfter;
          return true;
        }
        return false;
      }
      assert(this._handle, "zlib binding closed");
      let res;
      do {
        res = this._handle.writeSync(
          flushFlag,
          chunk,
          // in
          inOff,
          // in_off
          availInBefore,
          // in_len
          this._buffer,
          // out
          this._offset,
          //out_off
          availOutBefore
        );
        res = res || this._writeState;
      } while (!this._hadError && handleChunk(res[0], res[1]));
      if (this._hadError) {
        throw error;
      }
      if (nread >= kMaxLength) {
        _close(this);
        throw new RangeError(
          "Cannot create final Buffer. It would be larger than 0x" + kMaxLength.toString(16) + " bytes"
        );
      }
      let buf = Buffer.concat(buffers, nread);
      _close(this);
      return buf;
    };
    util.inherits(Inflate, zlib.Inflate);
    function zlibBufferSync(engine, buffer) {
      if (typeof buffer === "string") {
        buffer = Buffer.from(buffer);
      }
      if (!(buffer instanceof Buffer)) {
        throw new TypeError("Not a string or buffer");
      }
      let flushFlag = engine._finishFlushFlag;
      if (flushFlag == null) {
        flushFlag = zlib.Z_FINISH;
      }
      return engine._processChunk(buffer, flushFlag);
    }
    function inflateSync(buffer, opts) {
      return zlibBufferSync(new Inflate(opts), buffer);
    }
    module.exports = exports = inflateSync;
    exports.Inflate = Inflate;
    exports.createInflate = createInflate;
    exports.inflateSync = inflateSync;
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/sync-reader.js
var require_sync_reader = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/sync-reader.js"(exports, module) {
    "use strict";
    var SyncReader = module.exports = function(buffer) {
      this._buffer = buffer;
      this._reads = [];
    };
    SyncReader.prototype.read = function(length, callback) {
      this._reads.push({
        length: Math.abs(length),
        // if length < 0 then at most this length
        allowLess: length < 0,
        func: callback
      });
    };
    SyncReader.prototype.process = function() {
      while (this._reads.length > 0 && this._buffer.length) {
        let read = this._reads[0];
        if (this._buffer.length && (this._buffer.length >= read.length || read.allowLess)) {
          this._reads.shift();
          let buf = this._buffer;
          this._buffer = buf.slice(read.length);
          read.func.call(this, buf.slice(0, read.length));
        } else {
          break;
        }
      }
      if (this._reads.length > 0) {
        return new Error("There are some read requests waitng on finished stream");
      }
      if (this._buffer.length > 0) {
        return new Error("unrecognised content at end of stream");
      }
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse-sync.js
var require_filter_parse_sync = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse-sync.js"(exports) {
    "use strict";
    var SyncReader = require_sync_reader();
    var Filter = require_filter_parse();
    exports.process = function(inBuffer, bitmapInfo) {
      let outBuffers = [];
      let reader = new SyncReader(inBuffer);
      let filter = new Filter(bitmapInfo, {
        read: reader.read.bind(reader),
        write: function(bufferPart) {
          outBuffers.push(bufferPart);
        },
        complete: function() {
        }
      });
      filter.start();
      reader.process();
      return Buffer.concat(outBuffers);
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser-sync.js
var require_parser_sync = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser-sync.js"(exports, module) {
    "use strict";
    var hasSyncZlib = true;
    var zlib = __require("zlib");
    var inflateSync = require_sync_inflate();
    if (!zlib.deflateSync) {
      hasSyncZlib = false;
    }
    var SyncReader = require_sync_reader();
    var FilterSync = require_filter_parse_sync();
    var Parser = require_parser();
    var bitmapper = require_bitmapper();
    var formatNormaliser = require_format_normaliser();
    module.exports = function(buffer, options) {
      if (!hasSyncZlib) {
        throw new Error(
          "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
        );
      }
      let err;
      function handleError(_err_) {
        err = _err_;
      }
      let metaData;
      function handleMetaData(_metaData_) {
        metaData = _metaData_;
      }
      function handleTransColor(transColor) {
        metaData.transColor = transColor;
      }
      function handlePalette(palette) {
        metaData.palette = palette;
      }
      function handleSimpleTransparency() {
        metaData.alpha = true;
      }
      let gamma;
      function handleGamma(_gamma_) {
        gamma = _gamma_;
      }
      let inflateDataList = [];
      function handleInflateData(inflatedData2) {
        inflateDataList.push(inflatedData2);
      }
      let reader = new SyncReader(buffer);
      let parser = new Parser(options, {
        read: reader.read.bind(reader),
        error: handleError,
        metadata: handleMetaData,
        gamma: handleGamma,
        palette: handlePalette,
        transColor: handleTransColor,
        inflateData: handleInflateData,
        simpleTransparency: handleSimpleTransparency
      });
      parser.start();
      reader.process();
      if (err) {
        throw err;
      }
      let inflateData = Buffer.concat(inflateDataList);
      inflateDataList.length = 0;
      let inflatedData;
      if (metaData.interlace) {
        inflatedData = zlib.inflateSync(inflateData);
      } else {
        let rowSize = (metaData.width * metaData.bpp * metaData.depth + 7 >> 3) + 1;
        let imageSize = rowSize * metaData.height;
        inflatedData = inflateSync(inflateData, {
          chunkSize: imageSize,
          maxLength: imageSize
        });
      }
      inflateData = null;
      if (!inflatedData || !inflatedData.length) {
        throw new Error("bad png - invalid inflate data response");
      }
      let unfilteredData = FilterSync.process(inflatedData, metaData);
      inflateData = null;
      let bitmapData = bitmapper.dataToBitMap(unfilteredData, metaData);
      unfilteredData = null;
      let normalisedBitmapData = formatNormaliser(bitmapData, metaData);
      metaData.data = normalisedBitmapData;
      metaData.gamma = gamma || 0;
      return metaData;
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer-sync.js
var require_packer_sync = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer-sync.js"(exports, module) {
    "use strict";
    var hasSyncZlib = true;
    var zlib = __require("zlib");
    if (!zlib.deflateSync) {
      hasSyncZlib = false;
    }
    var constants = require_constants();
    var Packer = require_packer();
    module.exports = function(metaData, opt) {
      if (!hasSyncZlib) {
        throw new Error(
          "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
        );
      }
      let options = opt || {};
      let packer = new Packer(options);
      let chunks = [];
      chunks.push(Buffer.from(constants.PNG_SIGNATURE));
      chunks.push(packer.packIHDR(metaData.width, metaData.height));
      if (metaData.gamma) {
        chunks.push(packer.packGAMA(metaData.gamma));
      }
      let filteredData = packer.filterData(
        metaData.data,
        metaData.width,
        metaData.height
      );
      let compressedData = zlib.deflateSync(
        filteredData,
        packer.getDeflateOptions()
      );
      filteredData = null;
      if (!compressedData || !compressedData.length) {
        throw new Error("bad png - invalid compressed data response");
      }
      chunks.push(packer.packIDAT(compressedData));
      chunks.push(packer.packIEND());
      return Buffer.concat(chunks);
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/png-sync.js
var require_png_sync = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/png-sync.js"(exports) {
    "use strict";
    var parse = require_parser_sync();
    var pack = require_packer_sync();
    exports.read = function(buffer, options) {
      return parse(buffer, options || {});
    };
    exports.write = function(png, options) {
      return pack(png, options);
    };
  }
});

// node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/png.js
var require_png = __commonJS({
  "node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/png.js"(exports) {
    "use strict";
    var util = __require("util");
    var Stream = __require("stream");
    var Parser = require_parser_async();
    var Packer = require_packer_async();
    var PNGSync = require_png_sync();
    var PNG = exports.PNG = function(options) {
      Stream.call(this);
      options = options || {};
      this.width = options.width | 0;
      this.height = options.height | 0;
      this.data = this.width > 0 && this.height > 0 ? Buffer.alloc(4 * this.width * this.height) : null;
      if (options.fill && this.data) {
        this.data.fill(0);
      }
      this.gamma = 0;
      this.readable = this.writable = true;
      this._parser = new Parser(options);
      this._parser.on("error", this.emit.bind(this, "error"));
      this._parser.on("close", this._handleClose.bind(this));
      this._parser.on("metadata", this._metadata.bind(this));
      this._parser.on("gamma", this._gamma.bind(this));
      this._parser.on(
        "parsed",
        function(data) {
          this.data = data;
          this.emit("parsed", data);
        }.bind(this)
      );
      this._packer = new Packer(options);
      this._packer.on("data", this.emit.bind(this, "data"));
      this._packer.on("end", this.emit.bind(this, "end"));
      this._parser.on("close", this._handleClose.bind(this));
      this._packer.on("error", this.emit.bind(this, "error"));
    };
    util.inherits(PNG, Stream);
    PNG.sync = PNGSync;
    PNG.prototype.pack = function() {
      if (!this.data || !this.data.length) {
        this.emit("error", "No data provided");
        return this;
      }
      process.nextTick(
        function() {
          this._packer.pack(this.data, this.width, this.height, this.gamma);
        }.bind(this)
      );
      return this;
    };
    PNG.prototype.parse = function(data, callback) {
      if (callback) {
        let onParsed, onError;
        onParsed = function(parsedData) {
          this.removeListener("error", onError);
          this.data = parsedData;
          callback(null, this);
        }.bind(this);
        onError = function(err) {
          this.removeListener("parsed", onParsed);
          callback(err, null);
        }.bind(this);
        this.once("parsed", onParsed);
        this.once("error", onError);
      }
      this.end(data);
      return this;
    };
    PNG.prototype.write = function(data) {
      this._parser.write(data);
      return true;
    };
    PNG.prototype.end = function(data) {
      this._parser.end(data);
    };
    PNG.prototype._metadata = function(metadata) {
      this.width = metadata.width;
      this.height = metadata.height;
      this.emit("metadata", metadata);
    };
    PNG.prototype._gamma = function(gamma) {
      this.gamma = gamma;
    };
    PNG.prototype._handleClose = function() {
      if (!this._parser.writable && !this._packer.readable) {
        this.emit("close");
      }
    };
    PNG.bitblt = function(src, dst, srcX, srcY, width, height, deltaX, deltaY) {
      srcX |= 0;
      srcY |= 0;
      width |= 0;
      height |= 0;
      deltaX |= 0;
      deltaY |= 0;
      if (srcX > src.width || srcY > src.height || srcX + width > src.width || srcY + height > src.height) {
        throw new Error("bitblt reading outside image");
      }
      if (deltaX > dst.width || deltaY > dst.height || deltaX + width > dst.width || deltaY + height > dst.height) {
        throw new Error("bitblt writing outside image");
      }
      for (let y = 0; y < height; y++) {
        src.data.copy(
          dst.data,
          (deltaY + y) * dst.width + deltaX << 2,
          (srcY + y) * src.width + srcX << 2,
          (srcY + y) * src.width + srcX + width << 2
        );
      }
    };
    PNG.prototype.bitblt = function(dst, srcX, srcY, width, height, deltaX, deltaY) {
      PNG.bitblt(this, dst, srcX, srcY, width, height, deltaX, deltaY);
      return this;
    };
    PNG.adjustGamma = function(src) {
      if (src.gamma) {
        for (let y = 0; y < src.height; y++) {
          for (let x = 0; x < src.width; x++) {
            let idx = src.width * y + x << 2;
            for (let i = 0; i < 3; i++) {
              let sample = src.data[idx + i] / 255;
              sample = Math.pow(sample, 1 / 2.2 / src.gamma);
              src.data[idx + i] = Math.round(sample * 255);
            }
          }
        }
        src.gamma = 0;
      }
    };
    PNG.prototype.adjustGamma = function() {
      PNG.adjustGamma(this);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utils.js"(exports) {
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/png.js
var require_png2 = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/png.js"(exports) {
    var fs = __require("fs");
    var PNG = require_png().PNG;
    var Utils = require_utils2();
    exports.render = function render(qrData, options) {
      const opts = Utils.getOptions(options);
      const pngOpts = opts.rendererOpts;
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      pngOpts.width = size;
      pngOpts.height = size;
      const pngImage = new PNG(pngOpts);
      Utils.qrToImageData(pngImage.data, qrData, opts);
      return pngImage;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      exports.renderToBuffer(qrData, options, function(err, output) {
        if (err) cb(err);
        let url = "data:image/png;base64,";
        url += output.toString("base64");
        cb(null, url);
      });
    };
    exports.renderToBuffer = function renderToBuffer(qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      const png = exports.render(qrData, options);
      const buffer = [];
      png.on("error", cb);
      png.on("data", function(data) {
        buffer.push(data);
      });
      png.on("end", function() {
        cb(null, Buffer.concat(buffer));
      });
      png.pack();
    };
    exports.renderToFile = function renderToFile(path, qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      let called = false;
      const done = (...args) => {
        if (called) return;
        called = true;
        cb.apply(null, args);
      };
      const stream = fs.createWriteStream(path);
      stream.on("error", done);
      stream.on("close", done);
      exports.renderToFileStream(stream, qrData, options);
    };
    exports.renderToFileStream = function renderToFileStream(stream, qrData, options) {
      const png = exports.render(qrData, options);
      png.pack().pipe(stream);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utf8.js
var require_utf8 = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utf8.js"(exports) {
    var Utils = require_utils2();
    var BLOCK_CHAR = {
      WW: " ",
      WB: "\u2584",
      BB: "\u2588",
      BW: "\u2580"
    };
    var INVERTED_BLOCK_CHAR = {
      BB: " ",
      BW: "\u2584",
      WW: "\u2588",
      WB: "\u2580"
    };
    function getBlockChar(top, bottom, blocks) {
      if (top && bottom) return blocks.BB;
      if (top && !bottom) return blocks.BW;
      if (!top && bottom) return blocks.WB;
      return blocks.WW;
    }
    exports.render = function(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      let blocks = BLOCK_CHAR;
      if (opts.color.dark.hex === "#ffffff" || opts.color.light.hex === "#000000") {
        blocks = INVERTED_BLOCK_CHAR;
      }
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      let output = "";
      let hMargin = Array(size + opts.margin * 2 + 1).join(blocks.WW);
      hMargin = Array(opts.margin / 2 + 1).join(hMargin + "\n");
      const vMargin = Array(opts.margin + 1).join(blocks.WW);
      output += hMargin;
      for (let i = 0; i < size; i += 2) {
        output += vMargin;
        for (let j = 0; j < size; j++) {
          const topModule = data[i * size + j];
          const bottomModule = data[(i + 1) * size + j];
          output += getBlockChar(topModule, bottomModule, blocks);
        }
        output += vMargin + "\n";
      }
      output += hMargin.slice(0, -1);
      if (typeof cb === "function") {
        cb(null, output);
      }
      return output;
    };
    exports.renderToFile = function renderToFile(path, qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      const fs = __require("fs");
      const utf8 = exports.render(qrData, options);
      fs.writeFile(path, utf8, cb);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal/terminal.js
var require_terminal = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal/terminal.js"(exports) {
    exports.render = function(qrData, options, cb) {
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const black = "\x1B[40m  \x1B[0m";
      const white = "\x1B[47m  \x1B[0m";
      let output = "";
      const hMargin = Array(size + 3).join(white);
      const vMargin = Array(2).join(white);
      output += hMargin + "\n";
      for (let i = 0; i < size; ++i) {
        output += white;
        for (let j = 0; j < size; j++) {
          output += data[i * size + j] ? black : white;
        }
        output += vMargin + "\n";
      }
      output += hMargin + "\n";
      if (typeof cb === "function") {
        cb(null, output);
      }
      return output;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal/terminal-small.js
var require_terminal_small = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal/terminal-small.js"(exports) {
    var backgroundWhite = "\x1B[47m";
    var backgroundBlack = "\x1B[40m";
    var foregroundWhite = "\x1B[37m";
    var foregroundBlack = "\x1B[30m";
    var reset = "\x1B[0m";
    var lineSetupNormal = backgroundWhite + foregroundBlack;
    var lineSetupInverse = backgroundBlack + foregroundWhite;
    var createPalette = function(lineSetup, foregroundWhite2, foregroundBlack2) {
      return {
        // 1 ... white, 2 ... black, 0 ... transparent (default)
        "00": reset + " " + lineSetup,
        "01": reset + foregroundWhite2 + "\u2584" + lineSetup,
        "02": reset + foregroundBlack2 + "\u2584" + lineSetup,
        10: reset + foregroundWhite2 + "\u2580" + lineSetup,
        11: " ",
        12: "\u2584",
        20: reset + foregroundBlack2 + "\u2580" + lineSetup,
        21: "\u2580",
        22: "\u2588"
      };
    };
    var mkCodePixel = function(modules, size, x, y) {
      const sizePlus = size + 1;
      if (x >= sizePlus || y >= sizePlus || y < -1 || x < -1) return "0";
      if (x >= size || y >= size || y < 0 || x < 0) return "1";
      const idx = y * size + x;
      return modules[idx] ? "2" : "1";
    };
    var mkCode = function(modules, size, x, y) {
      return mkCodePixel(modules, size, x, y) + mkCodePixel(modules, size, x, y + 1);
    };
    exports.render = function(qrData, options, cb) {
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const inverse = !!(options && options.inverse);
      const lineSetup = options && options.inverse ? lineSetupInverse : lineSetupNormal;
      const white = inverse ? foregroundBlack : foregroundWhite;
      const black = inverse ? foregroundWhite : foregroundBlack;
      const palette = createPalette(lineSetup, white, black);
      const newLine = reset + "\n" + lineSetup;
      let output = lineSetup;
      for (let y = -1; y < size + 1; y += 2) {
        for (let x = -1; x < size; x++) {
          output += palette[mkCode(data, size, x, y)];
        }
        output += palette[mkCode(data, size, size, y)] + newLine;
      }
      output += reset;
      if (typeof cb === "function") {
        cb(null, output);
      }
      return output;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal.js
var require_terminal2 = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal.js"(exports) {
    var big = require_terminal();
    var small = require_terminal_small();
    exports.render = function(qrData, options, cb) {
      if (options && options.small) {
        return small.render(qrData, options, cb);
      }
      return big.render(qrData, options, cb);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg.js
var require_svg = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg.js"(exports) {
    var svgTagRenderer = require_svg_tag();
    exports.render = svgTagRenderer.render;
    exports.renderToFile = function renderToFile(path, qrData, options, cb) {
      if (typeof cb === "undefined") {
        cb = options;
        options = void 0;
      }
      const fs = __require("fs");
      const svgTag = exports.render(qrData, options);
      const xmlStr = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + svgTag;
      fs.writeFile(path, xmlStr, cb);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/browser.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/server.js
var require_server = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/server.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var PngRenderer = require_png2();
    var Utf8Renderer = require_utf8();
    var TerminalRenderer = require_terminal2();
    var SvgRenderer = require_svg();
    function checkParams(text, opts, cb) {
      if (typeof text === "undefined") {
        throw new Error("String required as first argument");
      }
      if (typeof cb === "undefined") {
        cb = opts;
        opts = {};
      }
      if (typeof cb !== "function") {
        if (!canPromise()) {
          throw new Error("Callback required as last argument");
        } else {
          opts = cb || {};
          cb = null;
        }
      }
      return {
        opts,
        cb
      };
    }
    function getTypeFromFilename(path) {
      return path.slice((path.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
    }
    function getRendererFromType(type) {
      switch (type) {
        case "svg":
          return SvgRenderer;
        case "txt":
        case "utf8":
          return Utf8Renderer;
        case "png":
        case "image/png":
        default:
          return PngRenderer;
      }
    }
    function getStringRendererFromType(type) {
      switch (type) {
        case "svg":
          return SvgRenderer;
        case "terminal":
          return TerminalRenderer;
        case "utf8":
        default:
          return Utf8Renderer;
      }
    }
    function render(renderFunc, text, params) {
      if (!params.cb) {
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text, params.opts);
            return renderFunc(data, params.opts, function(err, data2) {
              return err ? reject(err) : resolve(data2);
            });
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, params.opts);
        return renderFunc(data, params.opts, params.cb);
      } catch (e) {
        params.cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = require_browser().toCanvas;
    exports.toString = function toString(text, opts, cb) {
      const params = checkParams(text, opts, cb);
      const type = params.opts ? params.opts.type : void 0;
      const renderer = getStringRendererFromType(type);
      return render(renderer.render, text, params);
    };
    exports.toDataURL = function toDataURL(text, opts, cb) {
      const params = checkParams(text, opts, cb);
      const renderer = getRendererFromType(params.opts.type);
      return render(renderer.renderToDataURL, text, params);
    };
    exports.toBuffer = function toBuffer(text, opts, cb) {
      const params = checkParams(text, opts, cb);
      const renderer = getRendererFromType(params.opts.type);
      return render(renderer.renderToBuffer, text, params);
    };
    exports.toFile = function toFile(path, text, opts, cb) {
      if (typeof path !== "string" || !(typeof text === "string" || typeof text === "object")) {
        throw new Error("Invalid argument");
      }
      if (arguments.length < 3 && !canPromise()) {
        throw new Error("Too few arguments provided");
      }
      const params = checkParams(text, opts, cb);
      const type = params.opts.type || getTypeFromFilename(path);
      const renderer = getRendererFromType(type);
      const renderToFile = renderer.renderToFile.bind(null, path);
      return render(renderToFile, text, params);
    };
    exports.toFileStream = function toFileStream(stream, text, opts) {
      if (arguments.length < 2) {
        throw new Error("Too few arguments provided");
      }
      const params = checkParams(text, opts, stream.emit.bind(stream, "error"));
      const renderer = getRendererFromType("png");
      const renderToFileStream = renderer.renderToFileStream.bind(null, stream);
      render(renderToFileStream, text, params);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/index.js"(exports, module) {
    module.exports = require_server();
  }
});

// apps/fx/src/engine/codeNotice.ts
function codeHeader(title, license) {
  const where = license.domain && license.domain !== "*" ? ` \xB7 \u0441\u0430\u0439\u0442 ${license.domain}` : "";
  return `<!--
  Gridika \xB7 ${title}
  \u0417\u0430\u043A\u0430\u0437 \u2116 ${license.id}${where} \xB7 \u043A\u043E\u0434 \u0432\u0430\u0448 \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430, \u0431\u0435\u0437 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438

  \u0412\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043A\u043E\u0434 \u0446\u0435\u043B\u0438\u043A\u043E\u043C \u0432 HTML-\u0431\u043B\u043E\u043A \u0441\u0430\u0439\u0442\u0430 (Tilda \u2014 \u0431\u043B\u043E\u043A T123).

  \u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438, \u043F\u043E\u0434\u043F\u0438\u0441\u0438, \u0442\u0435\u043A\u0441\u0442 \u0438 \u0441\u0441\u044B\u043B\u043A\u0438 \u043A\u043D\u043E\u043F\u043E\u043A \u043C\u043E\u0436\u043D\u043E \u043C\u0435\u043D\u044F\u0442\u044C \u043F\u0440\u044F\u043C\u043E \u0437\u0434\u0435\u0441\u044C \u2014
  \u044D\u0442\u043E \u043E\u0431\u044B\u0447\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u0432 \u043A\u0430\u0432\u044B\u0447\u043A\u0430\u0445 (\u043D\u0430\u0439\u0434\u0438\u0442\u0435 \u0435\u0433\u043E \u0447\u0435\u0440\u0435\u0437 Ctrl+F).
  QR, \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434, \u043B\u043E\u0433\u043E\u0442\u0438\u043F \u0438 \u0444\u043E\u0442\u043E \u0441\u043E\u0431\u0440\u0430\u043D\u044B \u0438\u0437 \u043A\u0443\u0431\u0438\u043A\u043E\u0432: \u0438\u0445 \u043C\u0435\u043D\u044F\u0439\u0442\u0435
  \u043D\u0430 gridika.ru \u0438 \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u043A\u043E\u0434 \u0432\u043C\u0435\u0441\u0442\u043E \u044D\u0442\u043E\u0433\u043E.
-->`;
}

// apps/fx/src/engine/domainLock.ts
function domainLockJs(badgeId, domain) {
  return `
(function () {
  var d = ${JSON.stringify(domain)};
  // a bought code ("*") is clean on any site
  if (d === "*") { var b0 = document.getElementById(${JSON.stringify(badgeId)}); if (b0 && b0.parentNode) b0.parentNode.removeChild(b0); return; }
  var clean = function (h) { h = String(h || "").toLowerCase(); return h.indexOf("www.") === 0 ? h.slice(4) : h; };
  var on = function (h, x) { h = clean(h); return h === x || h.slice(-(x.length + 1)) === "." + x; };
  var hosts = [location.hostname];
  if (window.top !== window) {
    try { var a = location.ancestorOrigins; if (a) for (var i = 0; i < a.length; i++) hosts.push(new URL(a[i]).hostname); } catch (e) {}
    try { if (document.referrer) hosts.push(new URL(document.referrer).hostname); } catch (e) {}
  }
  for (var j = 0; j < hosts.length; j++) {
    if (on(hosts[j], d) || on(hosts[j], "tilda.cc")) { var b = document.getElementById(${JSON.stringify(badgeId)}); if (b && b.parentNode) b.parentNode.removeChild(b); return; }
  }
})();`;
}

// raw-file:E:\Programming\temka\apps\fx\src\embed\qrMorphRuntime.iife.js
var qrMorphRuntime_iife_default = '"use strict";var GridikaQrMorphModule=(()=>{var gr=Object.create;var ze=Object.defineProperty;var br=Object.getOwnPropertyDescriptor;var Mr=Object.getOwnPropertyNames;var wr=Object.getPrototypeOf,Tr=Object.prototype.hasOwnProperty;var D=(l,e)=>()=>(e||l((e={exports:{}}).exports,e),e.exports),yr=(l,e)=>{for(var t in e)ze(l,t,{get:e[t],enumerable:!0})},qt=(l,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of Mr(e))!Tr.call(l,s)&&s!==t&&ze(l,s,{get:()=>e[s],enumerable:!(o=br(e,s))||o.enumerable});return l};var te=(l,e,t)=>(t=l!=null?gr(wr(l)):{},qt(e||!l||!l.__esModule?ze(t,"default",{value:l,enumerable:!0}):t,l)),Hr=l=>qt(ze({},"__esModule",{value:!0}),l);var oe=D((Ns,Ft)=>{var X=typeof window<"u"?window.THREE||{}:{};X.MathUtils||(X.MathUtils=X.Math||{});X.MathUtils.degToRad||(X.MathUtils.degToRad=function(l){return l*(Math.PI/180)});X.MathUtils.lerp||(X.MathUtils.lerp=function(l,e,t){return l+(e-l)*t});X.MathUtils.clamp||(X.MathUtils.clamp=function(l,e,t){return Math.max(e,Math.min(t,l))});X.MathUtils.smoothstep||(X.MathUtils.smoothstep=function(l,e,t){if(l<=e)return 0;if(l>=t)return 1;var o=(l-e)/(t-e);return o*o*(3-2*o)});Ft.exports=X});var Qt=D((qs,Yt)=>{Yt.exports=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}});var ie=D(pe=>{var it,Rr=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];pe.getSymbolSize=function(e){if(!e)throw new Error(\'"version" cannot be null or undefined\');if(e<1||e>40)throw new Error(\'"version" should be in range from 1 to 40\');return e*4+17};pe.getSymbolTotalCodewords=function(e){return Rr[e]};pe.getBCHDigit=function(l){let e=0;for(;l!==0;)e++,l>>>=1;return e};pe.setToSJISFunction=function(e){if(typeof e!="function")throw new Error(\'"toSJISFunc" is not a valid function.\');it=e};pe.isKanjiModeEnabled=function(){return typeof it<"u"};pe.toSJIS=function(e){return it(e)}});var De=D(Z=>{Z.L={bit:1};Z.M={bit:0};Z.Q={bit:3};Z.H={bit:2};function xr(l){if(typeof l!="string")throw new Error("Param is not a string");switch(l.toLowerCase()){case"l":case"low":return Z.L;case"m":case"medium":return Z.M;case"q":case"quartile":return Z.Q;case"h":case"high":return Z.H;default:throw new Error("Unknown EC Level: "+l)}}Z.isValid=function(e){return e&&typeof e.bit<"u"&&e.bit>=0&&e.bit<4};Z.from=function(e,t){if(Z.isValid(e))return e;try{return xr(e)}catch{return t}}});var Wt=D((Qs,Ot)=>{function _t(){this.buffer=[],this.length=0}_t.prototype={get:function(l){let e=Math.floor(l/8);return(this.buffer[e]>>>7-l%8&1)===1},put:function(l,e){for(let t=0;t<e;t++)this.putBit((l>>>e-t-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(l){let e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),l&&(this.buffer[e]|=128>>>this.length%8),this.length++}};Ot.exports=_t});var Kt=D((_s,jt)=>{function Se(l){if(!l||l<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=l,this.data=new Uint8Array(l*l),this.reservedBit=new Uint8Array(l*l)}Se.prototype.set=function(l,e,t,o){let s=l*this.size+e;this.data[s]=t,o&&(this.reservedBit[s]=!0)};Se.prototype.get=function(l,e){return this.data[l*this.size+e]};Se.prototype.xor=function(l,e,t){this.data[l*this.size+e]^=t};Se.prototype.isReserved=function(l,e){return this.reservedBit[l*this.size+e]};jt.exports=Se});var Xt=D(Ue=>{var vr=ie().getSymbolSize;Ue.getRowColCoords=function(e){if(e===1)return[];let t=Math.floor(e/7)+2,o=vr(e),s=o===145?26:Math.ceil((o-13)/(2*t-2))*2,r=[o-7];for(let a=1;a<t-1;a++)r[a]=r[a-1]-s;return r.push(6),r.reverse()};Ue.getPositions=function(e){let t=[],o=Ue.getRowColCoords(e),s=o.length;for(let r=0;r<s;r++)for(let a=0;a<s;a++)r===0&&a===0||r===0&&a===s-1||r===s-1&&a===0||t.push([o[r],o[a]]);return t}});var $t=D(Jt=>{var Sr=ie().getSymbolSize,Zt=7;Jt.getPositions=function(e){let t=Sr(e);return[[0,0],[t-Zt,0],[0,t-Zt]]}});var eo=D(N=>{N.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var me={N1:3,N2:3,N3:40,N4:10};N.isValid=function(e){return e!=null&&e!==""&&!isNaN(e)&&e>=0&&e<=7};N.from=function(e){return N.isValid(e)?parseInt(e,10):void 0};N.getPenaltyN1=function(e){let t=e.size,o=0,s=0,r=0,a=null,n=null;for(let i=0;i<t;i++){s=r=0,a=n=null;for(let h=0;h<t;h++){let c=e.get(i,h);c===a?s++:(s>=5&&(o+=me.N1+(s-5)),a=c,s=1),c=e.get(h,i),c===n?r++:(r>=5&&(o+=me.N1+(r-5)),n=c,r=1)}s>=5&&(o+=me.N1+(s-5)),r>=5&&(o+=me.N1+(r-5))}return o};N.getPenaltyN2=function(e){let t=e.size,o=0;for(let s=0;s<t-1;s++)for(let r=0;r<t-1;r++){let a=e.get(s,r)+e.get(s,r+1)+e.get(s+1,r)+e.get(s+1,r+1);(a===4||a===0)&&o++}return o*me.N2};N.getPenaltyN3=function(e){let t=e.size,o=0,s=0,r=0;for(let a=0;a<t;a++){s=r=0;for(let n=0;n<t;n++)s=s<<1&2047|e.get(a,n),n>=10&&(s===1488||s===93)&&o++,r=r<<1&2047|e.get(n,a),n>=10&&(r===1488||r===93)&&o++}return o*me.N3};N.getPenaltyN4=function(e){let t=0,o=e.data.length;for(let r=0;r<o;r++)t+=e.data[r];return Math.abs(Math.ceil(t*100/o/5)-10)*me.N4};function Cr(l,e,t){switch(l){case N.Patterns.PATTERN000:return(e+t)%2===0;case N.Patterns.PATTERN001:return e%2===0;case N.Patterns.PATTERN010:return t%3===0;case N.Patterns.PATTERN011:return(e+t)%3===0;case N.Patterns.PATTERN100:return(Math.floor(e/2)+Math.floor(t/3))%2===0;case N.Patterns.PATTERN101:return e*t%2+e*t%3===0;case N.Patterns.PATTERN110:return(e*t%2+e*t%3)%2===0;case N.Patterns.PATTERN111:return(e*t%3+(e+t)%2)%2===0;default:throw new Error("bad maskPattern:"+l)}}N.applyMask=function(e,t){let o=t.size;for(let s=0;s<o;s++)for(let r=0;r<o;r++)t.isReserved(r,s)||t.xor(r,s,Cr(e,r,s))};N.getBestMask=function(e,t){let o=Object.keys(N.Patterns).length,s=0,r=1/0;for(let a=0;a<o;a++){t(a),N.applyMask(a,e);let n=N.getPenaltyN1(e)+N.getPenaltyN2(e)+N.getPenaltyN3(e)+N.getPenaltyN4(e);N.applyMask(a,e),n<r&&(r=n,s=a)}return s}});var ct=D(lt=>{var le=De(),Ne=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],qe=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];lt.getBlocksCount=function(e,t){switch(t){case le.L:return Ne[(e-1)*4+0];case le.M:return Ne[(e-1)*4+1];case le.Q:return Ne[(e-1)*4+2];case le.H:return Ne[(e-1)*4+3];default:return}};lt.getTotalCodewordsCount=function(e,t){switch(t){case le.L:return qe[(e-1)*4+0];case le.M:return qe[(e-1)*4+1];case le.Q:return qe[(e-1)*4+2];case le.H:return qe[(e-1)*4+3];default:return}}});var to=D(Ye=>{var Ce=new Uint8Array(512),Fe=new Uint8Array(256);(function(){let e=1;for(let t=0;t<255;t++)Ce[t]=e,Fe[e]=t,e<<=1,e&256&&(e^=285);for(let t=255;t<512;t++)Ce[t]=Ce[t-255]})();Ye.log=function(e){if(e<1)throw new Error("log("+e+")");return Fe[e]};Ye.exp=function(e){return Ce[e]};Ye.mul=function(e,t){return e===0||t===0?0:Ce[Fe[e]+Fe[t]]}});var oo=D(ke=>{var ht=to();ke.mul=function(e,t){let o=new Uint8Array(e.length+t.length-1);for(let s=0;s<e.length;s++)for(let r=0;r<t.length;r++)o[s+r]^=ht.mul(e[s],t[r]);return o};ke.mod=function(e,t){let o=new Uint8Array(e);for(;o.length-t.length>=0;){let s=o[0];for(let a=0;a<t.length;a++)o[a]^=ht.mul(t[a],s);let r=0;for(;r<o.length&&o[r]===0;)r++;o=o.slice(r)}return o};ke.generateECPolynomial=function(e){let t=new Uint8Array([1]);for(let o=0;o<e;o++)t=ke.mul(t,new Uint8Array([1,ht.exp(o)]));return t}});var no=D((Js,so)=>{var ro=oo();function ft(l){this.genPoly=void 0,this.degree=l,this.degree&&this.initialize(this.degree)}ft.prototype.initialize=function(e){this.degree=e,this.genPoly=ro.generateECPolynomial(this.degree)};ft.prototype.encode=function(e){if(!this.genPoly)throw new Error("Encoder not initialized");let t=new Uint8Array(e.length+this.degree);t.set(e);let o=ro.mod(t,this.genPoly),s=this.degree-o.length;if(s>0){let r=new Uint8Array(this.degree);return r.set(o,s),r}return o};so.exports=ft});var ut=D(ao=>{ao.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}});var dt=D(ne=>{var io="[0-9]+",kr="[A-Z $%*+\\\\-./:]+",Ie="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";Ie=Ie.replace(/u/g,"\\\\u");var Ir="(?:(?![A-Z0-9 $%*+\\\\-./:]|"+Ie+`)(?:.|[\\r\n]))+`;ne.KANJI=new RegExp(Ie,"g");ne.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\\\-./:]+","g");ne.BYTE=new RegExp(Ir,"g");ne.NUMERIC=new RegExp(io,"g");ne.ALPHANUMERIC=new RegExp(kr,"g");var Gr=new RegExp("^"+Ie+"$"),Lr=new RegExp("^"+io+"$"),Pr=new RegExp("^[A-Z0-9 $%*+\\\\-./:]+$");ne.testKanji=function(e){return Gr.test(e)};ne.testNumeric=function(e){return Lr.test(e)};ne.testAlphanumeric=function(e){return Pr.test(e)}});var ce=D(F=>{var Br=ut(),Et=dt();F.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]};F.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]};F.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]};F.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]};F.MIXED={bit:-1};F.getCharCountIndicator=function(e,t){if(!e.ccBits)throw new Error("Invalid mode: "+e);if(!Br.isValid(t))throw new Error("Invalid version: "+t);return t>=1&&t<10?e.ccBits[0]:t<27?e.ccBits[1]:e.ccBits[2]};F.getBestModeForData=function(e){return Et.testNumeric(e)?F.NUMERIC:Et.testAlphanumeric(e)?F.ALPHANUMERIC:Et.testKanji(e)?F.KANJI:F.BYTE};F.toString=function(e){if(e&&e.id)return e.id;throw new Error("Invalid mode")};F.isValid=function(e){return e&&e.bit&&e.ccBits};function Vr(l){if(typeof l!="string")throw new Error("Param is not a string");switch(l.toLowerCase()){case"numeric":return F.NUMERIC;case"alphanumeric":return F.ALPHANUMERIC;case"kanji":return F.KANJI;case"byte":return F.BYTE;default:throw new Error("Unknown mode: "+l)}}F.from=function(e,t){if(F.isValid(e))return e;try{return Vr(e)}catch{return t}}});var uo=D(ge=>{var Qe=ie(),Ar=ct(),lo=De(),he=ce(),pt=ut(),ho=7973,co=Qe.getBCHDigit(ho);function zr(l,e,t){for(let o=1;o<=40;o++)if(e<=ge.getCapacity(o,t,l))return o}function fo(l,e){return he.getCharCountIndicator(l,e)+4}function Dr(l,e){let t=0;return l.forEach(function(o){let s=fo(o.mode,e);t+=s+o.getBitsLength()}),t}function Ur(l,e){for(let t=1;t<=40;t++)if(Dr(l,t)<=ge.getCapacity(t,e,he.MIXED))return t}ge.from=function(e,t){return pt.isValid(e)?parseInt(e,10):t};ge.getCapacity=function(e,t,o){if(!pt.isValid(e))throw new Error("Invalid QR Code version");typeof o>"u"&&(o=he.BYTE);let s=Qe.getSymbolTotalCodewords(e),r=Ar.getTotalCodewordsCount(e,t),a=(s-r)*8;if(o===he.MIXED)return a;let n=a-fo(o,e);switch(o){case he.NUMERIC:return Math.floor(n/10*3);case he.ALPHANUMERIC:return Math.floor(n/11*2);case he.KANJI:return Math.floor(n/13);case he.BYTE:default:return Math.floor(n/8)}};ge.getBestVersionForData=function(e,t){let o,s=lo.from(t,lo.M);if(Array.isArray(e)){if(e.length>1)return Ur(e,s);if(e.length===0)return 1;o=e[0]}else o=e;return zr(o.mode,o.getLength(),s)};ge.getEncodedBits=function(e){if(!pt.isValid(e)||e<7)throw new Error("Invalid QR Code version");let t=e<<12;for(;Qe.getBCHDigit(t)-co>=0;)t^=ho<<Qe.getBCHDigit(t)-co;return e<<12|t}});var go=D(mo=>{var mt=ie(),po=1335,Nr=21522,Eo=mt.getBCHDigit(po);mo.getEncodedBits=function(e,t){let o=e.bit<<3|t,s=o<<10;for(;mt.getBCHDigit(s)-Eo>=0;)s^=po<<mt.getBCHDigit(s)-Eo;return(o<<10|s)^Nr}});var Mo=D((sn,bo)=>{var qr=ce();function Te(l){this.mode=qr.NUMERIC,this.data=l.toString()}Te.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)};Te.prototype.getLength=function(){return this.data.length};Te.prototype.getBitsLength=function(){return Te.getBitsLength(this.data.length)};Te.prototype.write=function(e){let t,o,s;for(t=0;t+3<=this.data.length;t+=3)o=this.data.substr(t,3),s=parseInt(o,10),e.put(s,10);let r=this.data.length-t;r>0&&(o=this.data.substr(t),s=parseInt(o,10),e.put(s,r*3+1))};bo.exports=Te});var To=D((nn,wo)=>{var Fr=ce(),gt=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function ye(l){this.mode=Fr.ALPHANUMERIC,this.data=l}ye.getBitsLength=function(e){return 11*Math.floor(e/2)+6*(e%2)};ye.prototype.getLength=function(){return this.data.length};ye.prototype.getBitsLength=function(){return ye.getBitsLength(this.data.length)};ye.prototype.write=function(e){let t;for(t=0;t+2<=this.data.length;t+=2){let o=gt.indexOf(this.data[t])*45;o+=gt.indexOf(this.data[t+1]),e.put(o,11)}this.data.length%2&&e.put(gt.indexOf(this.data[t]),6)};wo.exports=ye});var Ho=D((an,yo)=>{var Yr=ce();function He(l){this.mode=Yr.BYTE,typeof l=="string"?this.data=new TextEncoder().encode(l):this.data=new Uint8Array(l)}He.getBitsLength=function(e){return e*8};He.prototype.getLength=function(){return this.data.length};He.prototype.getBitsLength=function(){return He.getBitsLength(this.data.length)};He.prototype.write=function(l){for(let e=0,t=this.data.length;e<t;e++)l.put(this.data[e],8)};yo.exports=He});var xo=D((ln,Ro)=>{var Qr=ce(),_r=ie();function Re(l){this.mode=Qr.KANJI,this.data=l}Re.getBitsLength=function(e){return e*13};Re.prototype.getLength=function(){return this.data.length};Re.prototype.getBitsLength=function(){return Re.getBitsLength(this.data.length)};Re.prototype.write=function(l){let e;for(e=0;e<this.data.length;e++){let t=_r.toSJIS(this.data[e]);if(t>=33088&&t<=40956)t-=33088;else if(t>=57408&&t<=60351)t-=49472;else throw new Error("Invalid SJIS character: "+this.data[e]+`\nMake sure your charset is UTF-8`);t=(t>>>8&255)*192+(t&255),l.put(t,13)}};Ro.exports=Re});var vo=D((cn,bt)=>{"use strict";var Ge={single_source_shortest_paths:function(l,e,t){var o={},s={};s[e]=0;var r=Ge.PriorityQueue.make();r.push(e,0);for(var a,n,i,h,c,u,f,E,d;!r.empty();){a=r.pop(),n=a.value,h=a.cost,c=l[n]||{};for(i in c)c.hasOwnProperty(i)&&(u=c[i],f=h+u,E=s[i],d=typeof s[i]>"u",(d||E>f)&&(s[i]=f,r.push(i,f),o[i]=n))}if(typeof t<"u"&&typeof s[t]>"u"){var g=["Could not find a path from ",e," to ",t,"."].join("");throw new Error(g)}return o},extract_shortest_path_from_predecessor_list:function(l,e){for(var t=[],o=e,s;o;)t.push(o),s=l[o],o=l[o];return t.reverse(),t},find_path:function(l,e,t){var o=Ge.single_source_shortest_paths(l,e,t);return Ge.extract_shortest_path_from_predecessor_list(o,t)},PriorityQueue:{make:function(l){var e=Ge.PriorityQueue,t={},o;l=l||{};for(o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);return t.queue=[],t.sorter=l.sorter||e.default_sorter,t},default_sorter:function(l,e){return l.cost-e.cost},push:function(l,e){var t={value:l,cost:e};this.queue.push(t),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};typeof bt<"u"&&(bt.exports=Ge)});var Bo=D(xe=>{var z=ce(),ko=Mo(),Io=To(),Go=Ho(),Lo=xo(),Le=dt(),_e=ie(),Or=vo();function So(l){return unescape(encodeURIComponent(l)).length}function Pe(l,e,t){let o=[],s;for(;(s=l.exec(t))!==null;)o.push({data:s[0],index:s.index,mode:e,length:s[0].length});return o}function Po(l){let e=Pe(Le.NUMERIC,z.NUMERIC,l),t=Pe(Le.ALPHANUMERIC,z.ALPHANUMERIC,l),o,s;return _e.isKanjiModeEnabled()?(o=Pe(Le.BYTE,z.BYTE,l),s=Pe(Le.KANJI,z.KANJI,l)):(o=Pe(Le.BYTE_KANJI,z.BYTE,l),s=[]),e.concat(t,o,s).sort(function(a,n){return a.index-n.index}).map(function(a){return{data:a.data,mode:a.mode,length:a.length}})}function Mt(l,e){switch(e){case z.NUMERIC:return ko.getBitsLength(l);case z.ALPHANUMERIC:return Io.getBitsLength(l);case z.KANJI:return Lo.getBitsLength(l);case z.BYTE:return Go.getBitsLength(l)}}function Wr(l){return l.reduce(function(e,t){let o=e.length-1>=0?e[e.length-1]:null;return o&&o.mode===t.mode?(e[e.length-1].data+=t.data,e):(e.push(t),e)},[])}function jr(l){let e=[];for(let t=0;t<l.length;t++){let o=l[t];switch(o.mode){case z.NUMERIC:e.push([o,{data:o.data,mode:z.ALPHANUMERIC,length:o.length},{data:o.data,mode:z.BYTE,length:o.length}]);break;case z.ALPHANUMERIC:e.push([o,{data:o.data,mode:z.BYTE,length:o.length}]);break;case z.KANJI:e.push([o,{data:o.data,mode:z.BYTE,length:So(o.data)}]);break;case z.BYTE:e.push([{data:o.data,mode:z.BYTE,length:So(o.data)}])}}return e}function Kr(l,e){let t={},o={start:{}},s=["start"];for(let r=0;r<l.length;r++){let a=l[r],n=[];for(let i=0;i<a.length;i++){let h=a[i],c=""+r+i;n.push(c),t[c]={node:h,lastCount:0},o[c]={};for(let u=0;u<s.length;u++){let f=s[u];t[f]&&t[f].node.mode===h.mode?(o[f][c]=Mt(t[f].lastCount+h.length,h.mode)-Mt(t[f].lastCount,h.mode),t[f].lastCount+=h.length):(t[f]&&(t[f].lastCount=h.length),o[f][c]=Mt(h.length,h.mode)+4+z.getCharCountIndicator(h.mode,e))}}s=n}for(let r=0;r<s.length;r++)o[s[r]].end=0;return{map:o,table:t}}function Co(l,e){let t,o=z.getBestModeForData(l);if(t=z.from(e,o),t!==z.BYTE&&t.bit<o.bit)throw new Error(\'"\'+l+\'" cannot be encoded with mode \'+z.toString(t)+`.\n Suggested mode is: `+z.toString(o));switch(t===z.KANJI&&!_e.isKanjiModeEnabled()&&(t=z.BYTE),t){case z.NUMERIC:return new ko(l);case z.ALPHANUMERIC:return new Io(l);case z.KANJI:return new Lo(l);case z.BYTE:return new Go(l)}}xe.fromArray=function(e){return e.reduce(function(t,o){return typeof o=="string"?t.push(Co(o,null)):o.data&&t.push(Co(o.data,o.mode)),t},[])};xe.fromString=function(e,t){let o=Po(e,_e.isKanjiModeEnabled()),s=jr(o),r=Kr(s,t),a=Or.find_path(r.map,"start","end"),n=[];for(let i=1;i<a.length-1;i++)n.push(r.table[a[i]].node);return xe.fromArray(Wr(n))};xe.rawSplit=function(e){return xe.fromArray(Po(e,_e.isKanjiModeEnabled()))}});var Ao=D(Vo=>{var We=ie(),wt=De(),Xr=Wt(),Zr=Kt(),Jr=Xt(),$r=$t(),Ht=eo(),Rt=ct(),es=no(),Oe=uo(),ts=go(),os=ce(),Tt=Bo();function rs(l,e){let t=l.size,o=$r.getPositions(e);for(let s=0;s<o.length;s++){let r=o[s][0],a=o[s][1];for(let n=-1;n<=7;n++)if(!(r+n<=-1||t<=r+n))for(let i=-1;i<=7;i++)a+i<=-1||t<=a+i||(n>=0&&n<=6&&(i===0||i===6)||i>=0&&i<=6&&(n===0||n===6)||n>=2&&n<=4&&i>=2&&i<=4?l.set(r+n,a+i,!0,!0):l.set(r+n,a+i,!1,!0))}}function ss(l){let e=l.size;for(let t=8;t<e-8;t++){let o=t%2===0;l.set(t,6,o,!0),l.set(6,t,o,!0)}}function ns(l,e){let t=Jr.getPositions(e);for(let o=0;o<t.length;o++){let s=t[o][0],r=t[o][1];for(let a=-2;a<=2;a++)for(let n=-2;n<=2;n++)a===-2||a===2||n===-2||n===2||a===0&&n===0?l.set(s+a,r+n,!0,!0):l.set(s+a,r+n,!1,!0)}}function as(l,e){let t=l.size,o=Oe.getEncodedBits(e),s,r,a;for(let n=0;n<18;n++)s=Math.floor(n/3),r=n%3+t-8-3,a=(o>>n&1)===1,l.set(s,r,a,!0),l.set(r,s,a,!0)}function yt(l,e,t){let o=l.size,s=ts.getEncodedBits(e,t),r,a;for(r=0;r<15;r++)a=(s>>r&1)===1,r<6?l.set(r,8,a,!0):r<8?l.set(r+1,8,a,!0):l.set(o-15+r,8,a,!0),r<8?l.set(8,o-r-1,a,!0):r<9?l.set(8,15-r-1+1,a,!0):l.set(8,15-r-1,a,!0);l.set(o-8,8,1,!0)}function is(l,e){let t=l.size,o=-1,s=t-1,r=7,a=0;for(let n=t-1;n>0;n-=2)for(n===6&&n--;;){for(let i=0;i<2;i++)if(!l.isReserved(s,n-i)){let h=!1;a<e.length&&(h=(e[a]>>>r&1)===1),l.set(s,n-i,h),r--,r===-1&&(a++,r=7)}if(s+=o,s<0||t<=s){s-=o,o=-o;break}}}function ls(l,e,t){let o=new Xr;t.forEach(function(i){o.put(i.mode.bit,4),o.put(i.getLength(),os.getCharCountIndicator(i.mode,l)),i.write(o)});let s=We.getSymbolTotalCodewords(l),r=Rt.getTotalCodewordsCount(l,e),a=(s-r)*8;for(o.getLengthInBits()+4<=a&&o.put(0,4);o.getLengthInBits()%8!==0;)o.putBit(0);let n=(a-o.getLengthInBits())/8;for(let i=0;i<n;i++)o.put(i%2?17:236,8);return cs(o,l,e)}function cs(l,e,t){let o=We.getSymbolTotalCodewords(e),s=Rt.getTotalCodewordsCount(e,t),r=o-s,a=Rt.getBlocksCount(e,t),n=o%a,i=a-n,h=Math.floor(o/a),c=Math.floor(r/a),u=c+1,f=h-c,E=new es(f),d=0,g=new Array(a),m=new Array(a),y=0,T=new Uint8Array(l.buffer);for(let I=0;I<a;I++){let P=I<i?c:u;g[I]=T.slice(d,d+P),m[I]=E.encode(g[I]),d+=P,y=Math.max(y,P)}let x=new Uint8Array(o),k=0,L,v;for(L=0;L<y;L++)for(v=0;v<a;v++)L<g[v].length&&(x[k++]=g[v][L]);for(L=0;L<f;L++)for(v=0;v<a;v++)x[k++]=m[v][L];return x}function hs(l,e,t,o){let s;if(Array.isArray(l))s=Tt.fromArray(l);else if(typeof l=="string"){let h=e;if(!h){let c=Tt.rawSplit(l);h=Oe.getBestVersionForData(c,t)}s=Tt.fromString(l,h||40)}else throw new Error("Invalid data");let r=Oe.getBestVersionForData(s,t);if(!r)throw new Error("The amount of data is too big to be stored in a QR Code");if(!e)e=r;else if(e<r)throw new Error(`\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: `+r+`.\n`);let a=ls(e,t,s),n=We.getSymbolSize(e),i=new Zr(n);return rs(i,e),ss(i),ns(i,e),yt(i,t,0),e>=7&&as(i,e),is(i,a),isNaN(o)&&(o=Ht.getBestMask(i,yt.bind(null,i,t))),Ht.applyMask(o,i),yt(i,t,o),{modules:i,version:e,errorCorrectionLevel:t,maskPattern:o,segments:s}}Vo.create=function(e,t){if(typeof e>"u"||e==="")throw new Error("No input text");let o=wt.M,s,r;return typeof t<"u"&&(o=wt.from(t.errorCorrectionLevel,wt.M),s=Oe.from(t.version),r=Ht.from(t.maskPattern),t.toSJISFunc&&We.setToSJISFunction(t.toSJISFunc)),hs(e,s,o,r)}});var xt=D(be=>{function zo(l){if(typeof l=="number"&&(l=l.toString()),typeof l!="string")throw new Error("Color should be defined as hex string");let e=l.slice().replace("#","").split("");if(e.length<3||e.length===5||e.length>8)throw new Error("Invalid hex color: "+l);(e.length===3||e.length===4)&&(e=Array.prototype.concat.apply([],e.map(function(o){return[o,o]}))),e.length===6&&e.push("F","F");let t=parseInt(e.join(""),16);return{r:t>>24&255,g:t>>16&255,b:t>>8&255,a:t&255,hex:"#"+e.slice(0,6).join("")}}be.getOptions=function(e){e||(e={}),e.color||(e.color={});let t=typeof e.margin>"u"||e.margin===null||e.margin<0?4:e.margin,o=e.width&&e.width>=21?e.width:void 0,s=e.scale||4;return{width:o,scale:o?4:s,margin:t,color:{dark:zo(e.color.dark||"#000000ff"),light:zo(e.color.light||"#ffffffff")},type:e.type,rendererOpts:e.rendererOpts||{}}};be.getScale=function(e,t){return t.width&&t.width>=e+t.margin*2?t.width/(e+t.margin*2):t.scale};be.getImageWidth=function(e,t){let o=be.getScale(e,t);return Math.floor((e+t.margin*2)*o)};be.qrToImageData=function(e,t,o){let s=t.modules.size,r=t.modules.data,a=be.getScale(s,o),n=Math.floor((s+o.margin*2)*a),i=o.margin*a,h=[o.color.light,o.color.dark];for(let c=0;c<n;c++)for(let u=0;u<n;u++){let f=(c*n+u)*4,E=o.color.light;if(c>=i&&u>=i&&c<n-i&&u<n-i){let d=Math.floor((c-i)/a),g=Math.floor((u-i)/a);E=h[r[d*s+g]?1:0]}e[f++]=E.r,e[f++]=E.g,e[f++]=E.b,e[f]=E.a}}});var Do=D(je=>{var vt=xt();function fs(l,e,t){l.clearRect(0,0,e.width,e.height),e.style||(e.style={}),e.height=t,e.width=t,e.style.height=t+"px",e.style.width=t+"px"}function us(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}je.render=function(e,t,o){let s=o,r=t;typeof s>"u"&&(!t||!t.getContext)&&(s=t,t=void 0),t||(r=us()),s=vt.getOptions(s);let a=vt.getImageWidth(e.modules.size,s),n=r.getContext("2d"),i=n.createImageData(a,a);return vt.qrToImageData(i.data,e,s),fs(n,r,a),n.putImageData(i,0,0),r};je.renderToDataURL=function(e,t,o){let s=o;typeof s>"u"&&(!t||!t.getContext)&&(s=t,t=void 0),s||(s={});let r=je.render(e,t,s),a=s.type||"image/png",n=s.rendererOpts||{};return r.toDataURL(a,n.quality)}});var qo=D(No=>{var ds=xt();function Uo(l,e){let t=l.a/255,o=e+\'="\'+l.hex+\'"\';return t<1?o+" "+e+\'-opacity="\'+t.toFixed(2).slice(1)+\'"\':o}function St(l,e,t){let o=l+e;return typeof t<"u"&&(o+=" "+t),o}function Es(l,e,t){let o="",s=0,r=!1,a=0;for(let n=0;n<l.length;n++){let i=Math.floor(n%e),h=Math.floor(n/e);!i&&!r&&(r=!0),l[n]?(a++,n>0&&i>0&&l[n-1]||(o+=r?St("M",i+t,.5+h+t):St("m",s,0),s=0,r=!1),i+1<e&&l[n+1]||(o+=St("h",a),a=0)):s++}return o}No.render=function(e,t,o){let s=ds.getOptions(t),r=e.modules.size,a=e.modules.data,n=r+s.margin*2,i=s.color.light.a?"<path "+Uo(s.color.light,"fill")+\' d="M0 0h\'+n+"v"+n+\'H0z"/>\':"",h="<path "+Uo(s.color.dark,"stroke")+\' d="\'+Es(a,r,s.margin)+\'"/>\',c=\'viewBox="0 0 \'+n+" "+n+\'"\',f=\'<svg xmlns="http://www.w3.org/2000/svg" \'+(s.width?\'width="\'+s.width+\'" height="\'+s.width+\'" \':"")+c+\' shape-rendering="crispEdges">\'+i+h+`</svg>\n`;return typeof o=="function"&&o(null,f),f}});var Yo=D(Be=>{var ps=Qt(),Ct=Ao(),Fo=Do(),ms=qo();function kt(l,e,t,o,s){let r=[].slice.call(arguments,1),a=r.length,n=typeof r[a-1]=="function";if(!n&&!ps())throw new Error("Callback required as last argument");if(n){if(a<2)throw new Error("Too few arguments provided");a===2?(s=t,t=e,e=o=void 0):a===3&&(e.getContext&&typeof s>"u"?(s=o,o=void 0):(s=o,o=t,t=e,e=void 0))}else{if(a<1)throw new Error("Too few arguments provided");return a===1?(t=e,e=o=void 0):a===2&&!e.getContext&&(o=t,t=e,e=void 0),new Promise(function(i,h){try{let c=Ct.create(t,o);i(l(c,e,o))}catch(c){h(c)}})}try{let i=Ct.create(t,o);s(null,l(i,e,o))}catch(i){s(i)}}Be.create=Ct.create;Be.toCanvas=kt.bind(null,Fo.render);Be.toDataURL=kt.bind(null,Fo.renderToDataURL);Be.toString=kt.bind(null,function(l,e,t){return ms.render(l,t)})});var Ds={};yr(Ds,{initQrMorphWidget:()=>zs});var C=te(oe(),1);var Qo=te(Yo(),1);function _o(l,e="M"){let t=Qo.default.create(l,{errorCorrectionLevel:e}),o=t.modules.size,s=[];for(let r=0;r<o;r++){let a=[];for(let n=0;n<o;n++)a.push(!!t.modules.get(r,n));s.push(a)}return{modules:s,size:o}}function Oo(l,e,t){return l<7&&e<7||l<7&&e>=t-7||l>=t-7&&e<7}var S=te(oe(),1);function j(l,e){let t=parseInt(l.slice(1),16),o=t>>16&255,s=t>>8&255,r=t&255,a=.299*o+.587*s+.114*r,n=e/a,i=h=>Math.max(0,Math.min(255,Math.round(h*n))).toString(16).padStart(2,"0");return"#"+i(o)+i(s)+i(r)}var Wo=108,jo=104;function It(l){return{...l,leaves:l.leaves.map(e=>j(e,Wo)),grass:l.grass.map(e=>j(e,jo))}}var Gt={spring:{leaves:["#d0507f","#c2386c","#e0679a","#b8416c","#d95c8a","#e0607a","#c4508f","#d46a8c","#b84a86","#e2708f"],grass:["#4f8a24","#5a9a2a","#467d1f","#3f7019","#6a9a1f","#2f7a3a","#5f8f30","#3d8a2e","#78a02a"],bloom:["#f9d3e2","#f6c1d5","#fce6ef","#f2b3cb","#fff2f7","#eeaac4","#f8cadb"],blades:["#6fbf3a","#8fd14f","#5aa02e","#a6dc6a","#4c8f26","#7cc444"],trunk:["#8a4a2e","#743b24"]},summer:{leaves:["#8a5ccc","#7646bd","#9a6fd6","#6538ab","#a57fdc","#9c5ac8","#7f62d8","#b06cc9","#8e4fb8","#6f5bd0"],grass:["#4f8a24","#5a9a2a","#467d1f","#3f7019","#6a9a1f","#2f7a3a","#5f8f30","#3d8a2e","#78a02a"],bloom:["#dcc8f5","#cfb6f0","#e9dcfa","#c3a6ea","#f3ecfd","#d5bff3"],blades:["#6fbf3a","#8fd14f","#5aa02e","#a6dc6a","#4c8f26","#7cc444"],trunk:["#7d4a32","#683d28"]},autumn:{leaves:["#d2701a","#c2581a","#e08f1f","#b04a12","#e8971c","#c9402a","#d9a21f","#b86a1a","#a8541f","#cf5a2e"],grass:["#8a6a1c","#7a5c18","#96741f","#6e5215","#9a7a1a","#7f6a24","#a0702a","#86621a"],bloom:["#f7cf5a","#f2b83c","#f9dc7e","#eea12e","#fbe6a4","#f4c24a"],blades:["#d9b44a","#c9a13a","#e6c868","#b08a2e","#efd27a"],trunk:["#7a3f26","#66331e"]}},Lt={spring:It(Gt.spring),summer:It(Gt.summer),autumn:It(Gt.autumn)};function p(l){let e=Math.sin(l*127.1+311.7)*43758.5453;return e-Math.floor(e)}function Xe(l){let e=l/2,t=l*.47,o=l*.34,s=l*.34;return{size:l,half:e,trunkH:o,canopyCenterY:o+s*.78,canopyRy:s,canopyFloor:o*.82,radiusAt:r=>t*(1+.1*Math.sin(3*r+.6)+.06*Math.sin(5*r+2.1)+.04*Math.cos(7*r))}}function Ko(l,e){return{x:l.c-e+.5,z:l.r-e+.5}}function Pt(l,e,t){let o=Math.hypot(e,t),s=Math.atan2(t,e);return o/l.radiusAt(s)}function gs(l,e){let t=Math.sqrt(Math.max(0,1-e*e)),o=l.canopyCenterY+l.canopyRy*t;return[Math.max(l.canopyFloor,l.canopyCenterY-l.canopyRy*.85*t),o]}function Ve(l,e){if(e.isFinder)return!1;let{x:t,z:o}=Ko(e,l.half);return Pt(l,t,o)<1}function Bt(l,e){let t=Xe(e);return l.map((o,s)=>{let{x:r,z:a}=Ko(o,t.half);if(Ve(t,o)){let[n,i]=gs(t,Pt(t,r,a)),h=i-(i-n)*.35*p(s+1),c=1.13;return{x:r,y:h,z:a,scaleX:c,scaleY:c,scaleZ:c,kind:"leaf"}}return{x:r,y:.18,z:a,scaleX:1.14,scaleY:.4,scaleZ:1.14,kind:"grass"}})}function Vt(l,e,t,o){let s=Lt[o],r=Xe(t),a=Ve(r,l),n=a?s.leaves:s.grass,i=n[Math.floor(p(e+13)*n.length)];return j(i,(a?Wo:jo)+(p(e+71)-.5)*14)}function Xo(l,e,t,o){let s=Lt[o],r=Xe(t);return Ve(r,l)?{color:s.bloom[Math.floor(p(e+31)*s.bloom.length)],scale:0}:{color:s.blades[Math.floor(p(e+37)*s.blades.length)],scale:1}}var Ke=class{constructor(e,t,o,s){this.modules=e;this.matrix=t;this.size=o;this.season=s;this.geometry=Xe(o),this.build()}group=new S.Group;grown=[];petals=[];petalMesh;geometry;disposables=[];lightModules=[];lastGrowth=-1;bloom={home:[],pos:[],quat:[],size:[],qrColor:[],color:[],offset:[]};track(e){return this.disposables.push(e),e}build(){let e=this.geometry,t=Lt[this.season],o=this.size,s=new S.Color,r=o+2.4,a=new S.Mesh(this.track(new S.BoxGeometry(r,.9,r)),this.track(new S.MeshStandardMaterial({color:"#f3f1ec",roughness:.85})));a.position.y=-.45,a.receiveShadow=!0,a.castShadow=!0,this.group.add(a);for(let c=0;c<o;c++)for(let u=0;u<o;u++)this.matrix[c][u]||this.lightModules.push({x:u-e.half+.5,z:c-e.half+.5});let n=new S.InstancedMesh(this.track(new S.BoxGeometry(.98,.06,.98)),this.track(new S.MeshStandardMaterial({color:16777215,roughness:.9})),this.lightModules.length);n.receiveShadow=!0;let i=new S.Matrix4,h=["#ffffff","#f6f5f2","#eeece8","#e6e4df","#f9f8f6"];this.lightModules.forEach((c,u)=>{i.makeTranslation(c.x,.03,c.z),n.setMatrixAt(u,i),n.setColorAt(u,s.set(h[Math.floor(p(u*3+5)*h.length)]))}),this.group.add(n),this.buildTrunk(t),this.buildBranches(t),this.buildBloom(t),this.buildGrassBlades(t),this.buildGroundPetals(t),this.buildFallingPetals(t)}addGrown(e,t,o,s=!0){let r=new S.InstancedMesh(this.track(e),this.track(t),Math.max(1,o.length));r.count=o.length,r.castShadow=s,r.receiveShadow=!0;let a=new S.Color;o.forEach((n,i)=>r.setColorAt(i,a.set(n.color))),r.instanceColor&&(r.instanceColor.needsUpdate=!0),this.group.add(r),this.grown.push({mesh:r,base:o.map(n=>n.matrix),delay:o.map(n=>n.delay),pivot:o.map(n=>n.pivot)})}buildTrunk(e){let t=this.geometry,o=[],s=.45,r=t.canopyCenterY,a=Math.ceil(r/s);for(let n=0;n<a;n++){let i=n*s+s/2,h=i/r,c=h<.1?1+(.1-h)*4.5:1,u=(1-h*.42)*c,f=Math.sin(h*2.2)*.3,E=new S.Matrix4().compose(new S.Vector3(f,i,f*.35),new S.Quaternion,new S.Vector3(u,1,u));o.push({matrix:E,color:n%3===0?e.trunk[1]:e.trunk[0],delay:h*.22,pivot:new S.Vector3(0,0,0)})}this.addGrown(new S.CylinderGeometry(.98,1,s*1.02,18),new S.MeshStandardMaterial({color:16777215,roughness:.85}),o)}buildBranches(e){let t=this.geometry,o=[],s=new S.Vector3(0,1,0),r=(n,i,h,c,u)=>{let f=i.clone().sub(n),E=new S.Quaternion().setFromUnitVectors(s,f.clone().normalize()),d=n.clone().add(i).multiplyScalar(.5);o.push({matrix:new S.Matrix4().compose(d,E,new S.Vector3(h,f.length(),h)),color:e.trunk[u],delay:c,pivot:n.clone()})},a=8;for(let n=0;n<a;n++){let i=n/a*Math.PI*2+p(n+40)*.6,h=t.trunkH*(.6+p(n+41)*.45),c=t.radiusAt(i)*(.6+p(n+42)*.25),u=new S.Vector3(0,h,0),f=new S.Vector3(Math.cos(i)*c*.5,h+t.canopyRy*(.3+p(n+43)*.2),Math.sin(i)*c*.5),E=new S.Vector3(Math.cos(i)*c,f.y+t.canopyRy*(.2+p(n+44)*.25),Math.sin(i)*c);r(u,f,.38,.2,n%2),r(f,E,.22,.3,(n+1)%2);for(let d=0;d<2;d++){let g=i+(p(n*3+d+45)-.5)*1.8,m=d===0?f:E,y=new S.Vector3(m.x+Math.cos(g)*c*.3,m.y+t.canopyRy*(.18+p(n+d+46)*.15),m.z+Math.sin(g)*c*.3);r(m,y,.12,.38,1)}}r(new S.Vector3(0,t.trunkH,0),new S.Vector3(.4,t.canopyCenterY+t.canopyRy*.7,-.3),.32,.25,0),this.addGrown(new S.CylinderGeometry(1,1,1,8),new S.MeshStandardMaterial({color:16777215,roughness:.9}),o)}buildBloom(e){let t=this.geometry,o=this.size,s=Bt(this.modules,o),r=new Map,a=[];this.modules.forEach((E,d)=>{if(!Ve(t,E))return;let g=s[d],m={pos:new S.Vector3(g.x,g.y,g.z),color:new S.Color(Vt(E,d,o,this.season))};r.set(E.r*o+E.c,m),a.push(m)});let n=(E,d,g)=>{let m=Math.round(E+t.half-.5),y=Math.round(d+t.half-.5);for(let T=0;T<=3;T++)for(let x=-T;x<=T;x++)for(let k=-T;k<=T;k++){if(Math.max(Math.abs(x),Math.abs(k))!==T)continue;let L=y+x,v=m+k;if(L<0||v<0||L>=o||v>=o)continue;let I=r.get(L*o+v);if(I)return I}return a[Math.floor(p(g)*a.length)]},i=Math.round(o*o*.6),h=new S.Euler,c=new S.Color,u=1e3,f=this.bloom;for(let E=0;E<i;E++){let d=p(u++)*Math.PI*2,g=1-2*p(u++),m=Math.sqrt(1-g*g),y=.55+.45*Math.sqrt(p(u++)),T=t.radiusAt(d),x=Math.cos(d)*m*T*y,k=Math.sin(d)*m*T*y,L=t.canopyCenterY+g*t.canopyRy*y;L=Math.max(L,t.canopyFloor+.4+p(u++)*1.2);let v=8+Math.floor(p(u++)*8);for(let I=0;I<v;I++){let P=new S.Vector3(x+(p(u++)-.5)*2.2,L+(p(u++)-.5)*1.6,k+(p(u++)-.5)*2.2);P.y<t.canopyFloor-.3&&(P.y=t.canopyFloor-.3+p(u++)*.6),h.set((p(u++)-.5)*2.2,p(u++)*Math.PI,(p(u++)-.5)*2.2);let V=n(P.x,P.z,u++);if(!V)continue;let A=V.pos.clone().add(new S.Vector3((p(u++)-.5)*.5,(p(u++)-.5)*.4,(p(u++)-.5)*.5));f.home.push(A),f.pos.push(P),f.quat.push(new S.Quaternion().setFromEuler(h)),f.size.push(new S.Vector3(.36+p(u++)*.34,.1+p(u++)*.12,.36+p(u++)*.34)),f.qrColor.push(V.color),f.color.push(c.set(e.bloom[Math.floor(p(u++)*e.bloom.length)]).clone()),f.offset.push((p(u++)-.5)*.16)}}f.mesh=new S.InstancedMesh(this.track(new S.BoxGeometry(1,1,1)),this.track(new S.MeshStandardMaterial({color:16777215,roughness:.75})),Math.max(1,f.pos.length)),f.mesh.count=f.pos.length,f.mesh.castShadow=!0,f.mesh.receiveShadow=!0;for(let E=0;E<f.pos.length;E++)f.mesh.setColorAt(E,f.color[E]);this.group.add(f.mesh)}updateBloom(e){let t=this.bloom;if(!t.mesh)return;let o=new S.Vector3,s=new S.Quaternion,r=new S.Vector3,a=new S.Matrix4,n=new S.Color,i=new S.Quaternion,h=!1;for(let c=0;c<t.pos.length;c++){let u=t.offset[c],f=S.MathUtils.smoothstep(e,.06+u*.5,.92+u*.5);f>0&&(h=!0),o.copy(t.home[c]).lerp(t.pos[c],f),o.y+=Math.sin(f*Math.PI)*.6,s.copy(i).slerp(t.quat[c],f);let E=S.MathUtils.lerp(.04,1,f);r.copy(t.size[c]).multiplyScalar(E||1e-4),a.compose(o,s,r),t.mesh.setMatrixAt(c,a),n.copy(t.qrColor[c]).lerp(t.color[c],S.MathUtils.smoothstep(f,.15,.85)),t.mesh.setColorAt(c,n)}t.mesh.visible=h,t.mesh.instanceMatrix.needsUpdate=!0,t.mesh.instanceColor&&(t.mesh.instanceColor.needsUpdate=!0)}buildGrassBlades(e){let t=this.geometry,o=[];this.modules.forEach((s,r)=>{if(Ve(t,s))return;let a=s.c-t.half+.5,n=s.r-t.half+.5,i=s.isFinder?8:6;for(let h=0;h<i;h++){let c=(s.isFinder?.7:.5)+p(r*7+h*31)*(s.isFinder?1.2:.9),u=a+(p(r*3+h*5)-.5)*.85,f=n+(p(r*5+h*3)-.5)*.85,E=Math.atan2(f-n,u-a),d=.15+p(r+h*9)*.4,g=new S.Quaternion().setFromEuler(new S.Euler(Math.sin(E)*d,p(r+h)*Math.PI,-Math.cos(E)*d)),m=new S.Vector3(u,.34,f),y=m.clone().add(new S.Vector3(0,c/2,0).applyQuaternion(g));o.push({matrix:new S.Matrix4().compose(y,g,new S.Vector3(.09,c,.05)),color:e.blades[Math.floor(p(r*29+h)*e.blades.length)],delay:.05+p(r+h*17)*.3,pivot:m})}}),this.addGrown(new S.BoxGeometry(1,1,1),new S.MeshStandardMaterial({color:16777215,roughness:.8}),o,!1)}buildGroundPetals(e){let t=this.geometry,o=[];this.lightModules.forEach((s,r)=>{let a=Pt(t,s.x,s.z);if(a>1.25||p(r*7+1)>.2*(1.4-a))return;let n=.28+p(r+2)*.2,i=new S.Vector3(s.x+(p(r+3)-.5)*.5,.08,s.z+(p(r+4)-.5)*.5);o.push({matrix:new S.Matrix4().compose(i,new S.Quaternion().setFromEuler(new S.Euler(0,p(r)*Math.PI,0)),new S.Vector3(n,.05,n)),color:e.bloom[r%e.bloom.length],delay:.65,pivot:i.clone()})}),this.addGrown(new S.BoxGeometry(1,1,1),new S.MeshStandardMaterial({color:16777215,roughness:.7}),o,!1)}buildFallingPetals(e){let t=this.geometry,o=60;this.petalMesh=new S.InstancedMesh(this.track(new S.BoxGeometry(.34,.06,.34)),this.track(new S.MeshStandardMaterial({color:16777215,roughness:.6})),o);let s=new S.Color;for(let r=0;r<o;r++){let a=p(r+500)*Math.PI*2,n=Math.sqrt(p(r+600))*t.radiusAt(a)*1.15;this.petals.push({x:Math.cos(a)*n,z:Math.sin(a)*n,y0:t.canopyFloor+p(r+700)*t.canopyRy,speed:.6+p(r+800)*.8,phase:p(r+900)*10,spin:1+p(r+950)*2,floor:.1}),this.petalMesh.setColorAt(r,s.set(e.bloom[r%e.bloom.length]))}this.group.add(this.petalMesh)}update(e,t){if(e!==this.lastGrowth){this.lastGrowth=e,this.updateBloom(e);let r=new S.Matrix4,a=new S.Matrix4,n=new S.Matrix4,i=new S.Matrix4;for(let h of this.grown){let c=!1;for(let u=0;u<h.base.length;u++){let f=S.MathUtils.clamp((e-h.delay[u])/(1-h.delay[u]),0,1),E=f<=0?0:f>=1?1:1-Math.pow(1-f,3)+Math.sin(f*Math.PI)*.08;E>0&&(c=!0);let d=h.pivot[u];n.makeTranslation(-d.x,-d.y,-d.z),i.makeTranslation(d.x,d.y,d.z);let g=E||1e-4;a.makeScale(g,g,g),r.copy(i).multiply(a).multiply(n).multiply(h.base[u]),h.mesh.setMatrixAt(u,r)}h.mesh.visible=c,h.mesh.instanceMatrix.needsUpdate=!0}}let o=S.MathUtils.clamp((e-.85)/.15,0,1);if(this.petalMesh.visible=o>0,!this.petalMesh.visible)return;let s=new S.Object3D;for(let r=0;r<this.petals.length;r++){let a=this.petals[r],n=a.y0-a.floor,i=(t*a.speed+a.phase)%(n+2),h=a.y0-Math.min(i,n),c=Math.sin(t*1.3+a.phase)*.6;s.position.set(a.x+c,h,a.z+Math.cos(t*1.1+a.phase)*.4),s.rotation.set(Math.sin(t*a.spin+a.phase)*1.2,t*a.spin,Math.cos(t+a.phase)*.8);let u=o*(i>n?Math.max(0,1-(i-n)/2):1);s.scale.setScalar(u||1e-4),s.updateMatrix(),this.petalMesh.setMatrixAt(r,s.matrix)}this.petalMesh.instanceMatrix.needsUpdate=!0}dispose(){this.group.removeFromParent(),this.disposables.forEach(e=>e.dispose()),this.disposables=[]}};var M=te(oe(),1);var Ze={day:{facades:["#d9cfc1","#c9bba7","#b8735a","#9fb0c0","#e4e0d8","#8a9aa8","#c48a6a","#a7b5a0"],road:"#a3a5aa",park:["#7fb54a","#6ea842","#8cc05a"],slab:"#e6e2da",marking:"#ffffff",glass:"#a9c4d8",night:0,windowLit:"#ffd27a",ambient:{color:"#ffffff",intensity:1.2},sun:{color:"#fff6e8",intensity:2.6,position:[22,48,28]},car:["#e94f4f","#f2c14e","#4f8fe9","#f5f5f5","#2b2b2b","#5fbf8f"]},sunset:{facades:["#e0b48f","#c98a6a","#b0766a","#d9a27e","#a8707a","#e6c3a0","#bf8f80","#d0a090"],road:"#9a8a86",park:["#8fa24a","#7f9442","#9aab55"],slab:"#ead6c4",marking:"#fff0dc",glass:"#ffc890",night:.25,windowLit:"#ffcf80",ambient:{color:"#ffd2b8",intensity:.95},sun:{color:"#ffad6b",intensity:2.7,position:[46,16,-6]},car:["#e94f4f","#f2c14e","#4f8fe9","#f5f5f5","#2b2b2b","#5fbf8f"]},night:{facades:["#3a4150","#2f3542","#454c5c","#3d3a48","#2c3340","#4a4458","#36404c","#40485a"],road:"#363b46",park:["#2f4a35","#2a4230","#35523a"],slab:"#2a2e38",marking:"#8a8f9a",glass:"#1f2633",night:1,windowLit:"#ffd27a",ambient:{color:"#5b6aa8",intensity:.7},sun:{color:"#a8b8ff",intensity:.9,position:[-20,40,10]},car:["#c0392b","#d4a43a","#3a6fc0","#d8d8d8","#1e1e1e","#3f9f70"]}},fe={ambient:{color:"#ffffff",intensity:1.25},sun:{color:"#ffffff",intensity:2.5,position:[22,48,28]},slab:"#f3f1ec"},bs=100,re=.75;function Ms(l,e,t){return l<7&&e<7?[l,e]:l<7&&e>=t-7?[l,e-(t-7)]:l>=t-7&&e<7?[l-(t-7),e]:null}function Jo(l,e){let t=e/2,o=new Map;l.forEach((c,u)=>o.set(c.r*e+c.c,u));let s=new Array(l.length).fill(-1),r=[],a=Math.round(e*.62/re);[[0,0],[0,e-7],[e-7,0]].forEach(([c,u],f)=>{let E=[],d=[];for(let T=0;T<7;T++)for(let x=0;x<7;x++){let k=o.get((c+T)*e+(u+x));k!==void 0&&(T>=2&&T<=4&&x>=2&&x<=4?d.push(k):E.push(k))}let g={id:r.length,h:3*re,facadeIndex:(f*3+1)%8,cells:E,isTower:!1};r.push(g),E.forEach(T=>s[T]=g.id);let m=Math.round(e*.5/re)+f*2,y={id:r.length,h:m*re,facadeIndex:(f*3+3)%8,cells:d,isTower:!0};r.push(y),d.forEach(T=>s[T]=y.id)});let i=(c,u)=>Math.floor(c/3)*1e3+Math.floor(u/3);l.forEach((c,u)=>{if(s[u]!==-1)return;let f=i(c.r,c.c),E=[],d=[u];for(s[u]=-2;d.length;){let v=d.pop();E.push(v);let{r:I,c:P}=l[v];for(let[V,A]of[[1,0],[-1,0],[0,1],[0,-1]]){let O=I+V,ee=P+A;if(O<0||ee<0||O>=e||ee>=e||i(O,ee)!==f)continue;let U=o.get(O*e+ee);U===void 0||s[U]!==-1||(s[U]=-2,d.push(U))}}let g=0,m=0;E.forEach(v=>{g+=l[v].c-t+.5,m+=l[v].r-t+.5}),g/=E.length,m/=E.length;let y=r.length,T=Math.min(1,Math.hypot(g,m)/(t*1.1)),x=Math.pow(1-T,1.4),k=2+Math.round(x*a*(.45+.55*p(y*7+3)));p(y*13+5)<.07&&(k+=5);let L={id:y,h:k*re,facadeIndex:Math.floor(p(y*3+1)*8),cells:E,isTower:!1};r.push(L),E.forEach(v=>s[v]=y)});let h=l.map((c,u)=>r[s[u]].h);return{size:e,half:t,height:h,building:s,buildings:r,maxH:Math.max(...h)}}function $o(l,e){let t=Jo(l,e);return l.map((o,s)=>{let r=t.height[s];return{x:o.c-t.half+.5,y:r/2,z:o.r-t.half+.5,scaleX:1.13,scaleY:r/.88,scaleZ:1.13}})}function Zo(l,e,t){let o=l.buildings[l.building[e]],s=Ze[t].facades[o.facadeIndex%Ze[t].facades.length];return{qr:j(s,bs+(p(e*5+11)-.5)*14),side:s}}function ws(l,e){let t=l.buildings[l.building[e]];return .04+t.h/l.maxH*.32+p(t.id*17+2)*.06}function At(l,e){let t=Ze[l],o=e??{uSide:{value:0},uNight:{value:0},uTime:{value:0},uGlass:{value:new M.Color(t.glass)},uLit:{value:new M.Color(t.windowLit)}},s=new M.MeshStandardMaterial({color:16777215,roughness:.7,metalness:.05});return s.onBeforeCompile=r=>{Object.assign(r.uniforms,o),r.vertexShader=`varying vec3 vCityPos;\nvarying vec3 vCityN;\n`+r.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>\n        vec4 cityWp = vec4(transformed, 1.0);\n        vec3 cityN = objectNormal;\n        #ifdef USE_INSTANCING\n          cityWp = instanceMatrix * cityWp;\n          cityN = mat3(instanceMatrix) * cityN;\n        #endif\n        cityWp = modelMatrix * cityWp;\n        vCityPos = cityWp.xyz;\n        vCityN = normalize(mat3(modelMatrix) * cityN);`),r.fragmentShader=`varying vec3 vCityPos;\n      varying vec3 vCityN;\n      uniform float uSide;\n      uniform float uNight;\n      uniform float uTime;\n      uniform vec3 uGlass;\n      uniform vec3 uLit;\n      float cityHash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }\n      `+r.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>\n          float citySideFace = 1.0 - step(0.5, abs(vCityN.y));\n          float cityTopFace = step(0.5, vCityN.y);\n          bool cityAlongZ = abs(vCityN.x) > 0.5;\n          float cityU = cityAlongZ ? vCityPos.z : vCityPos.x;\n          float cityW = cityAlongZ ? vCityPos.x : vCityPos.z;\n          vec2 cityCell = vec2(cityU * 2.0, vCityPos.y / ${re.toFixed(2)});\n          vec2 cityF = fract(cityCell);\n          float cityWin = step(0.2, cityF.x) * step(cityF.x, 0.8) * step(0.25, cityF.y) * step(cityF.y, 0.8);\n          cityWin *= citySideFace * step(0.6, vCityPos.y) * uSide;\n          float cityH = cityHash(vec3(floor(cityCell), floor(cityW * 2.0)));\n          // lit windows change now and then\n          float cityOn = step(0.42, fract(cityH + floor(uTime * 0.07 + cityH * 13.0) * 0.37));\n          vec3 cityGlass = mix(uGlass, uGlass * 0.45, uNight);\n          diffuseColor.rgb = mix(diffuseColor.rgb, cityGlass, cityWin * 0.85);\n          // roofs a touch darker than facades in the side view\n          diffuseColor.rgb *= mix(1.0, 0.86, cityTopFace * uSide);\n          float cityGlow = cityWin * cityOn * uNight;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>\n          totalEmissiveRadiance += uLit * cityGlow * (0.75 + 0.5 * cityH);`)},s.customProgramCacheKey=()=>"qr-city-facade",{material:s,uniforms:o}}var Je=class{constructor(e,t,o,s){this.modules=e;this.matrix=t;this.size=o;this.modeName=s,this.layout=Jo(e,o),this.cfg=Ze[s];let r=At(s);this.voxelMaterial=r.material,this.uniforms=r.uniforms,this.build()}group=new M.Group;voxelMaterial;uniforms;layout;cfg;grown=[];disposables=[];tiles=[];tileMesh;tileQr=[];tileSide=[];slabMat;lampMat;headMat;tailMat;cars=[];carBody;carCabin;carHead;carTail;lastGrowth=-1;growth=0;modeName;get maxHeight(){return this.layout.maxH+2.5}voxelColor(e){return Zo(this.layout,e,this.modeName)}growDelay(e){return ws(this.layout,e)}voxelSideWindow=[.45,.8];voxelSideScale(){return[0,0,0]}get cityLayout(){return this.layout}track(e){return this.disposables.push(e),e}isLight(e,t){return e<0||t<0||e>=this.size||t>=this.size?!0:!this.matrix[e][t]}build(){let e=this.size,t=e/2,o=this.cfg,s=e+2.4;this.slabMat=this.track(new M.MeshStandardMaterial({color:fe.slab,roughness:.85}));let r=new M.Mesh(this.track(new M.BoxGeometry(s,.9,s)),this.slabMat);r.position.y=-.45,r.receiveShadow=!0,r.castShadow=!0,this.group.add(r);for(let i=0;i<e;i++)for(let h=0;h<e;h++){if(this.matrix[i][h])continue;let c=Ms(i,h,e),u="road";if(c){let[f,E]=c;f>=1&&f<=5&&E>=1&&E<=5&&(u="park")}else{let f=!0;for(let E=-1;E<=1&&f;E++)for(let d=-1;d<=1;d++)if(!this.isLight(i+E,h+d)){f=!1;break}f&&p(Math.floor(i/4)*97+Math.floor(h/4)*31+7)<.45&&(u="park")}this.tiles.push({x:h-t+.5,z:i-t+.5,r:i,c:h,kind:u})}this.tileMesh=new M.InstancedMesh(this.track(new M.BoxGeometry(1,.06,1)),this.track(new M.MeshStandardMaterial({color:16777215,roughness:.9})),Math.max(1,this.tiles.length)),this.tileMesh.count=this.tiles.length,this.tileMesh.receiveShadow=!0;let a=["#ffffff","#f6f5f2","#eeece8","#e9e7e2","#f9f8f6"],n=new M.Matrix4;this.tiles.forEach((i,h)=>{n.makeTranslation(i.x,.03,i.z),this.tileMesh.setMatrixAt(h,n),this.tileQr.push(new M.Color(a[Math.floor(p(h*3+5)*a.length)]));let c=i.kind==="park"?o.park[Math.floor(p(h*7+2)*o.park.length)]:o.road,u=new M.Color(c).multiplyScalar(.94+p(h*11+9)*.1);this.tileSide.push(u),this.tileMesh.setColorAt(h,this.tileQr[h])}),this.group.add(this.tileMesh),this.buildDetailedBuildings(),this.buildMarkings(),this.buildTrees(),this.buildLamps(),this.buildRooftops(),this.buildCars()}addGrown(e,t,o,s=!0){let r=new M.InstancedMesh(this.track(e),this.track(t),Math.max(1,o.length));r.count=o.length,r.castShadow=s,r.receiveShadow=!0;let a=new M.Color;o.forEach((n,i)=>r.setColorAt(i,a.set(n.color))),r.instanceColor&&(r.instanceColor.needsUpdate=!0),this.group.add(r),this.grown.push({mesh:r,base:o.map(n=>n.matrix),delay:o.map(n=>n.delay),pivot:o.map(n=>n.pivot)})}buildDetailedBuildings(){let e=this.layout,t=this.size,o=e.half,s=new Map;this.modules.forEach((d,g)=>s.set(d.r*t+d.c,e.building[g]));let r=new Set(this.tiles.filter(d=>d.kind==="road").map(d=>d.r*t+d.c)),a=[],n=[],i=[],h=[],c=[],u=["#d94a3a","#2f8f6a","#f2c14e","#3a6fc0","#e07a3a"],f=(d,g,m,y,T,x)=>new M.Matrix4().compose(new M.Vector3((d+g)/2,(m+y)/2,(T+x)/2),new M.Quaternion,new M.Vector3(g-d,y-m,x-T));this.modules.forEach((d,g)=>{let m=e.building[g],y=e.buildings[m],T=y.h,x=Math.round(T/re),k=d.c-o+.5,L=d.r-o+.5,v={l:s.get(d.r*t+d.c-1)!==m||d.c===0,r:s.get(d.r*t+d.c+1)!==m||d.c===t-1,u:s.get((d.r-1)*t+d.c)!==m||d.r===0,d:s.get((d.r+1)*t+d.c)!==m||d.r===t-1},I=Zo(e,g,this.modeName).side,P="#"+new M.Color(I).lerp(new M.Color("#f4f1ea"),.45).getHexString(),V=Math.min(.7,this.growDelay(g)+.04),A=new M.Vector3(k,0,L),O=B=>({x0:k-.5+(v.l?B:0),x1:k+.5-(v.r?B:0),z0:L-.5+(v.u?B:0),z1:L+.5-(v.d?B:0)}),U=(x>=9&&!y.isTower?!0:y.isTower)?Math.round(x*.62)*re:T,W=O(.05);if(a.push({matrix:f(W.x0,W.x1,0,U,W.z0,W.z1),color:I,delay:V,pivot:A}),U<T){let B=O(.2);a.push({matrix:f(B.x0,B.x1,U,T,B.z0,B.z1),color:I,delay:V+.04,pivot:A})}let ue=O(.01);i.push({matrix:f(ue.x0,ue.x1,0,.72,ue.z0,ue.z1),color:"#"+new M.Color(I).multiplyScalar(.62).getHexString(),delay:V,pivot:A});let ae=(B,K,Y,Ee,Me,we)=>{let Q=O(Ee);v.l&&n.push({matrix:f(Q.x0-Y,Q.x0+.08,B,B+K,Q.z0-(v.u?Y:0),Q.z1+(v.d?Y:0)),color:Me,delay:V+we,pivot:A}),v.r&&n.push({matrix:f(Q.x1-.08,Q.x1+Y,B,B+K,Q.z0-(v.u?Y:0),Q.z1+(v.d?Y:0)),color:Me,delay:V+we,pivot:A}),v.u&&n.push({matrix:f(Q.x0-(v.l?Y:0),Q.x1+(v.r?Y:0),B,B+K,Q.z0-Y,Q.z0+.08),color:Me,delay:V+we,pivot:A}),v.d&&n.push({matrix:f(Q.x0-(v.l?Y:0),Q.x1+(v.r?Y:0),B,B+K,Q.z1-.08,Q.z1+Y),color:Me,delay:V+we,pivot:A})};ae(.72,.06,.05,.05,P,.02);for(let B=6;B*re<U-.2;B+=6)ae(B*re-.03,.06,.04,.05,P,.05);if(U<T&&ae(U-.02,.1,.06,.05,P,.06),x<=3&&y.cells.length<=3&&!y.isTower){let B=O(.05);c.push({matrix:new M.Matrix4().compose(new M.Vector3((B.x0+B.x1)/2,T+.27,(B.z0+B.z1)/2),new M.Quaternion().setFromEuler(new M.Euler(0,Math.PI/4,0)),new M.Vector3((B.x1-B.x0)*.74,.54,(B.z1-B.z0)*.74)),color:this.modeName==="night"?"#5a3a34":"#b5533a",delay:V+.08,pivot:A})}else ae(T,.2,0,U<T?.2:.05,P,.08);[[v.l,0,-1],[v.r,0,1],[v.u,-1,0],[v.d,1,0]].forEach(([B,K,Y],Ee)=>{if(!B||!r.has((d.r+K)*t+(d.c+Y))||p(g*7+Ee)>.45)return;let Me=u[Math.floor(p(g*3+Ee)*u.length)],we=new M.Quaternion().setFromEuler(new M.Euler(K*.5,0,-Y*.5)),Q=new M.Vector3(k+Y*.6,.62,L+K*.6);h.push({matrix:new M.Matrix4().compose(Q,we,new M.Vector3(Y!==0?.24:.8,.04,K!==0?.24:.8)),color:Me,delay:V+.1,pivot:A})})});let E=At(this.modeName,this.uniforms).material;this.addGrown(new M.BoxGeometry(1,1,1),E,a),this.addGrown(new M.BoxGeometry(1,1,1),new M.MeshStandardMaterial({color:16777215,roughness:.6}),n),this.addGrown(new M.BoxGeometry(1,1,1),At(this.modeName,this.uniforms).material,i),this.addGrown(new M.BoxGeometry(1,1,1),new M.MeshStandardMaterial({color:16777215,roughness:.7}),h,!1),this.addGrown(new M.CylinderGeometry(0,.72,1,4),new M.MeshStandardMaterial({color:16777215,roughness:.8}),c)}buildMarkings(){let e=[];this.tiles.forEach((t,o)=>{if(t.kind!=="road")return;let s=this.isLight(t.r,t.c-1)&&this.isLight(t.r,t.c+1),r=this.isLight(t.r-1,t.c)&&this.isLight(t.r+1,t.c);if(s===r)return;let a=new M.Vector3(t.x,.065,t.z),n=s?new M.Vector3(.42,.01,.07):new M.Vector3(.07,.01,.42);e.push({matrix:new M.Matrix4().compose(a,new M.Quaternion,n),color:this.cfg.marking,delay:.45+p(o+3)*.1,pivot:a.clone()})}),this.addGrown(new M.BoxGeometry(1,1,1),new M.MeshStandardMaterial({color:16777215,roughness:.6}),e,!1)}buildTrees(){let e=[],t=[];this.tiles.forEach((o,s)=>{if(o.kind!=="park"||p(s*13+1)>.62)return;let r=(p(s+21)-.5)*.3,a=(p(s+22)-.5)*.3,n=.35+p(s+23)*.25,i=new M.Vector3(o.x+r,.06,o.z+a);e.push({matrix:new M.Matrix4().compose(i.clone().setY(.06+n/2),new M.Quaternion,new M.Vector3(.1,n,.1)),color:"#6b4a32",delay:.35+p(s+4)*.2,pivot:i});let h=.45+p(s+24)*.25,c=this.cfg.park[Math.floor(p(s+25)*this.cfg.park.length)];t.push({matrix:new M.Matrix4().compose(i.clone().setY(.06+n+h*.45),new M.Quaternion().setFromEuler(new M.Euler(0,p(s+26)*Math.PI,0)),new M.Vector3(h,h*.9,h)),color:"#"+new M.Color(c).multiplyScalar(.85).getHexString(),delay:.45+p(s+5)*.25,pivot:i})}),this.addGrown(new M.BoxGeometry(1,1,1),new M.MeshStandardMaterial({color:16777215,roughness:.9}),e),this.addGrown(new M.BoxGeometry(1,1,1),new M.MeshStandardMaterial({color:16777215,roughness:.8}),t)}buildLamps(){let e=[],t=[];this.tiles.forEach((o,s)=>{if(o.kind!=="road"||p(s*19+4)>.12)return;let r=[[0,-1],[0,1],[-1,0],[1,0]].find(([n,i])=>!this.isLight(o.r+n,o.c+i));if(!r)return;let a=new M.Vector3(o.x+r[1]*.36,.06,o.z+r[0]*.36);e.push({matrix:new M.Matrix4().compose(a.clone().setY(.06+.45),new M.Quaternion,new M.Vector3(.06,.9,.06)),color:"#4a4f58",delay:.5+p(s+6)*.15,pivot:a}),t.push({matrix:new M.Matrix4().compose(a.clone().setY(.98),new M.Quaternion,new M.Vector3(.16,.1,.16)),color:"#ffffff",delay:.55+p(s+7)*.15,pivot:a})}),this.addGrown(new M.BoxGeometry(1,1,1),new M.MeshStandardMaterial({color:16777215,roughness:.6}),e,!1),this.lampMat=new M.MeshStandardMaterial({color:"#fff2cc",emissive:this.cfg.windowLit,emissiveIntensity:0}),this.addGrown(new M.BoxGeometry(1,1,1),this.lampMat,t,!1)}buildRooftops(){let e=this.layout,t=e.half,o=[],s=[],r=[],a=[...e.buildings].filter(n=>!n.isTower).sort((n,i)=>i.h-n.h).slice(0,5).map(n=>n.id);for(let n of e.buildings){let i=Math.min(.85,.08+n.h/e.maxH*.32+.3),h=c=>{let u=this.modules[n.cells[c%n.cells.length]];return new M.Vector3(u.c-t+.5,n.h,u.r-t+.5)};if(n.isTower){let c=0,u=0;n.cells.forEach(E=>{c+=this.modules[E].c-t+.5,u+=this.modules[E].r-t+.5}),c/=n.cells.length,u/=n.cells.length;let f=new M.Vector3(c,n.h,u);o.push({matrix:new M.Matrix4().compose(f.clone().setY(n.h+.35),new M.Quaternion,new M.Vector3(1.8,.7,1.8)),color:"#8a9099",delay:i,pivot:f.clone()}),r.push({matrix:new M.Matrix4().compose(f.clone().setY(n.h+.7+1.6),new M.Quaternion,new M.Vector3(.12,3.2,.12)),color:"#c9ccd2",delay:Math.min(.9,i+.05),pivot:f.clone().setY(n.h+.7)});continue}if(n.cells.length>=2&&p(n.id*5+1)<.6){let c=h(Math.floor(p(n.id+2)*n.cells.length));c.x+=(p(n.id+3)-.5)*.3,c.z+=(p(n.id+4)-.5)*.3,o.push({matrix:new M.Matrix4().compose(c.clone().setY(n.h+.13),new M.Quaternion,new M.Vector3(.45,.26,.32)),color:"#9aa0a8",delay:i,pivot:c.clone()})}if(n.cells.length>=4&&p(n.id*7+2)<.4){let c=h(Math.floor(p(n.id+5)*n.cells.length));s.push({matrix:new M.Matrix4().compose(c.clone().setY(n.h+.4),new M.Quaternion,new M.Vector3(.32,.55,.32)),color:"#8a6a4a",delay:i,pivot:c.clone()})}if(a.includes(n.id)){let c=h(0),u=1.2+p(n.id+6)*1.4;r.push({matrix:new M.Matrix4().compose(c.clone().setY(n.h+u/2),new M.Quaternion,new M.Vector3(.06,u,.06)),color:"#c9ccd2",delay:i,pivot:c.clone()})}}this.addGrown(new M.BoxGeometry(1,1,1),new M.MeshStandardMaterial({color:16777215,roughness:.7}),o),this.addGrown(new M.CylinderGeometry(1,1,1,12),new M.MeshStandardMaterial({color:16777215,roughness:.8}),s),this.addGrown(new M.BoxGeometry(1,1,1),new M.MeshStandardMaterial({color:16777215,roughness:.5}),r)}buildCars(){let e=this.size,t=new Set(this.tiles.filter(n=>n.kind==="road").map(n=>n.r*e+n.c)),o=[];for(let n=0;n<e;n++)for(let i of[!0,!1]){let h=-1;for(let c=0;c<=e;c++){let u=c<e&&t.has(i?n*e+c:c*e+n);u&&h<0&&(h=c),!u&&h>=0&&(c-h>=4&&o.push({horizontal:i,line:n,from:h,to:c-1}),h=-1)}}o.sort((n,i)=>p(n.line*31+n.from+(n.horizontal?7:0))-p(i.line*31+i.from+(i.horizontal?7:0))),o.slice(0,Math.min(18,o.length)).forEach((n,i)=>{let h=n.to-n.from+1>=10?2:1;for(let c=0;c<h;c++)this.cars.push({...n,dir:p(i*3+c)<.5?1:-1,speed:.9+p(i*5+c)*.9,phase:p(i*7+c*3)})});let r=Math.max(1,this.cars.length);this.carBody=new M.InstancedMesh(this.track(new M.BoxGeometry(.62,.2,.3)),this.track(new M.MeshStandardMaterial({color:16777215,roughness:.4,metalness:.2})),r),this.carCabin=new M.InstancedMesh(this.track(new M.BoxGeometry(.32,.15,.26)),this.track(new M.MeshStandardMaterial({color:"#2a3340",roughness:.3})),r),this.headMat=this.track(new M.MeshBasicMaterial({color:"#fff3c4"})),this.tailMat=this.track(new M.MeshBasicMaterial({color:"#ff3b3b"})),this.carHead=new M.InstancedMesh(this.track(new M.BoxGeometry(.04,.06,.24)),this.headMat,r),this.carTail=new M.InstancedMesh(this.track(new M.BoxGeometry(.04,.06,.24)),this.tailMat,r),[this.carBody,this.carCabin,this.carHead,this.carTail].forEach(n=>{n.count=this.cars.length,n.castShadow=n===this.carBody,this.group.add(n)});let a=new M.Color;this.cars.forEach((n,i)=>this.carBody.setColorAt(i,a.set(this.cfg.car[Math.floor(p(i*9+4)*this.cfg.car.length)])))}applyLighting(e,t,o,s){let r=this.cfg;t.color.set(fe.ambient.color).lerp(new M.Color(r.ambient.color),e),t.intensity=M.MathUtils.lerp(fe.ambient.intensity,r.ambient.intensity,e),o.color.set(fe.sun.color).lerp(new M.Color(r.sun.color),e),o.intensity=M.MathUtils.lerp(fe.sun.intensity,r.sun.intensity,e);let a=new M.Vector3(...fe.sun.position);o.position.copy(a.lerp(new M.Vector3(...r.sun.position),e)),s.intensity=0,this.slabMat.color.set(fe.slab).lerp(new M.Color(r.slab),e),this.uniforms.uSide.value=e,this.uniforms.uNight.value=r.night*M.MathUtils.smoothstep(e,.4,1),this.lampMat.emissiveIntensity=2.2*this.uniforms.uNight.value;let n=this.uniforms.uNight.value;this.headMat.color.set("#fff3c4").multiplyScalar(.35+.65*n),this.tailMat.color.set("#ff3b3b").multiplyScalar(.35+.65*n)}update(e,t){if(this.growth=e,this.uniforms.uTime.value=t,e!==this.lastGrowth){this.lastGrowth=e;let o=new M.Color;for(let i=0;i<this.tiles.length;i++)o.copy(this.tileQr[i]).lerp(this.tileSide[i],M.MathUtils.smoothstep(e,.1,.7)),this.tileMesh.setColorAt(i,o);this.tileMesh.instanceColor&&(this.tileMesh.instanceColor.needsUpdate=!0);let s=new M.Matrix4,r=new M.Matrix4,a=new M.Matrix4,n=new M.Matrix4;for(let i of this.grown){let h=!1;for(let c=0;c<i.base.length;c++){let u=M.MathUtils.clamp((e-i.delay[c])/(1-i.delay[c]),0,1),f=u<=0?0:u>=1?1:1-Math.pow(1-u,3);f>0&&(h=!0);let E=i.pivot[c];a.makeTranslation(-E.x,-E.y,-E.z),n.makeTranslation(E.x,E.y,E.z);let d=f||1e-4;r.makeScale(d,d,d),s.copy(n).multiply(r).multiply(a).multiply(i.base[c]),i.mesh.setMatrixAt(c,s)}i.mesh.visible=h,i.mesh.instanceMatrix.needsUpdate=!0}}this.updateCars(t)}updateCars(e){let t=M.MathUtils.clamp((this.growth-.8)/.2,0,1),o=[this.carBody,this.carCabin,this.carHead,this.carTail];if(o.forEach(n=>n.visible=t>0&&this.cars.length>0),t<=0)return;let s=this.size/2,r=new M.Object3D,a=(n,i,h,c,u,f)=>{r.position.copy(u).applyAxisAngle(new M.Vector3(0,1,0),c).add(h),r.rotation.set(0,c,0),r.scale.setScalar(f||1e-4),r.updateMatrix(),n.setMatrixAt(i,r.matrix)};this.cars.forEach((n,i)=>{let h=n.to-n.from+1,c=(e*n.speed/h+n.phase)%1,u=n.dir>0?c:1-c,f=n.from-s+.5-.5+.3+u*(h-.6),E=n.dir*.2,d=n.line-s+.5+E,g=n.horizontal?new M.Vector3(f,.17,d):new M.Vector3(d,.17,f),m=n.horizontal?n.dir>0?0:Math.PI:n.dir>0?-Math.PI/2:Math.PI/2,y=Math.min(1,c*10,(1-c)*10)*t;a(this.carBody,i,g,m,new M.Vector3(0,0,0),y),a(this.carCabin,i,g,m,new M.Vector3(-.04,.16,0),y),a(this.carHead,i,g,m,new M.Vector3(.31,.02,0),y),a(this.carTail,i,g,m,new M.Vector3(-.31,.02,0),y)}),o.forEach(n=>n.instanceMatrix.needsUpdate=!0),this.carBody.instanceColor&&(this.carBody.instanceColor.needsUpdate=!0)}static resetLighting(e,t){e.color.set("#ffffff"),t.color.set("#ffffff"),t.position.set(...fe.sun.position)}dispose(){this.group.removeFromParent(),this.disposables.forEach(e=>e.dispose()),this.disposables=[]}};var b=te(oe(),1);var _=te(oe(),1),q={ambient:{color:"#ffffff",intensity:1.25},sun:{color:"#ffffff",intensity:2.5,position:[22,48,28]},slab:"#f3f1ec"};function er(l,e){l.color.set(q.ambient.color),e.color.set(q.sun.color),e.position.set(...q.sun.position)}function se(l,e,t,o,s){t.color.set(q.ambient.color).lerp(new _.Color(e.ambient.color),l),t.intensity=_.MathUtils.lerp(q.ambient.intensity,e.ambient.intensity,l),o.color.set(q.sun.color).lerp(new _.Color(e.sun.color),l),o.intensity=_.MathUtils.lerp(q.sun.intensity,e.sun.intensity,l),o.position.copy(new _.Vector3(...q.sun.position).lerp(new _.Vector3(...e.sun.position),l)),s.intensity=0}var J=class{constructor(e,t){this.group=e;this.track=t}sets=[];add(e,t,o,s=!0){let r=new _.InstancedMesh(this.track(e),this.track(t),Math.max(1,o.length));r.count=o.length,r.castShadow=s,r.receiveShadow=!0;let a=new _.Color;return o.forEach((n,i)=>r.setColorAt(i,a.set(n.color))),r.instanceColor&&(r.instanceColor.needsUpdate=!0),this.group.add(r),this.sets.push({mesh:r,base:o.map(n=>n.matrix),delay:o.map(n=>n.delay),pivot:o.map(n=>n.pivot)}),r}update(e){let t=new _.Matrix4,o=new _.Matrix4,s=new _.Matrix4,r=new _.Matrix4;for(let a of this.sets){let n=!1;for(let i=0;i<a.base.length;i++){let h=_.MathUtils.clamp((e-a.delay[i])/(1-a.delay[i]),0,1),c=h<=0?0:h>=1?1:1-Math.pow(1-h,3);c>0&&(n=!0);let u=a.pivot[i];s.makeTranslation(-u.x,-u.y,-u.z),r.makeTranslation(u.x,u.y,u.z);let f=c||1e-4;o.makeScale(f,f,f),t.copy(r).multiply(o).multiply(s).multiply(a.base[i]),a.mesh.setMatrixAt(i,t)}a.mesh.visible=n,a.mesh.instanceMatrix.needsUpdate=!0}}};function tr(l,e,t){let o=[];for(let s=0;s<e;s++)for(let r of[!0,!1]){let a=-1;for(let n=0;n<=e;n++){let i=n<e&&(r?l(s,n):l(n,s));i&&a<0&&(a=n),!i&&a>=0&&(n-a>=t&&o.push({horizontal:r,line:s,from:a,to:n-1}),a=-1)}}return o}function $(l,e,t){return l<7&&e<7?[l,e,0]:l<7&&e>=t-7?[l,e-(t-7),1]:l>=t-7&&e<7?[l-(t-7),e,2]:null}var Ts={summer:{bands:["#d9c27e","#7fb54a","#5a9a3a","#8a8378","#f2f4f6"],qrBands:["#c9a25a","#5fa83a","#3f8f3a","#8a7058","#7fa6c8"],waterDeep:"#2f9fc7",waterShallow:"#6fd6dc",slab:"#1f6f8f",foliage:["#3f8f3a","#4fa043","#357c33","#5aaa48"],trunk:"#7a5634",waterfall:"#bfeefa",mood:{ambient:{color:"#ffffff",intensity:1.2},sun:{color:"#fff4dc",intensity:2.6,position:[22,48,28]}}},winter:{bands:["#cfd8de","#eef3f7","#dfe7ee","#aab3bc","#ffffff"],qrBands:["#8fa8bc","#9db8cc","#7f9fb8","#7a8796","#a9c2d8"],waterDeep:"#3d6f8f",waterShallow:"#a9c9da",slab:"#2c4f66",foliage:["#2f5a3c","#36654a","#2a5036"],trunk:"#5e4632",waterfall:"#e4f6ff",mood:{ambient:{color:"#dfe9ff",intensity:1.25},sun:{color:"#e8f0ff",intensity:2.2,position:[30,30,20]}}},volcano:{bands:["#2b2b2b","#5f8a34","#476f2c","#3d3733","#2a2523"],qrBands:["#5a4a40","#5f8a34","#476f2c","#6a4a3a","#5a3530"],waterDeep:"#246f8f",waterShallow:"#4fb3c0",slab:"#1a4f66",foliage:["#3f7a2a","#4b8a30","#356a24"],trunk:"#5a3d28",waterfall:"#9fdcef",mood:{ambient:{color:"#ffd9c4",intensity:.85},sun:{color:"#ffb27a",intensity:2.3,position:[-30,35,20]}}}},ys=100,or=[[2,2],[3,4],[4,2]],zt=.5;function rr(l,e,t,o){let s=l/t,r=e/t,a=Math.floor(s),n=Math.floor(r),i=s-a,h=r-n,c=i*i*(3-2*i),u=h*h*(3-2*h),f=(g,m)=>p(g*57.1+m*131.7+o),E=f(a,n)*(1-c)+f(a+1,n)*c,d=f(a,n+1)*(1-c)+f(a+1,n+1)*c;return E*(1-u)+d*u}function sr(l,e,t){let o=e/2,s=e*.6,r=[],a=[],n=[],i=[];return l.forEach(h=>{let c=h.c-o+.5,u=h.r-o+.5,f=$(h.r,h.c,e);if(f){let[v,I,P]=f,V=v>=2&&v<=4&&I>=2&&I<=4,A=V?[2.5,2,1.5][P]:1;r.push(A),a.push(V?1:0),n.push(V?P:-1),i.push(!1);return}let E=Math.hypot(c,u)/(o*1.05),d=Math.max(0,1-E),g=rr(c+o,u+o,5,11)*.7+rr(c+o,u+o,2.5,23)*.3,m=.4+2.2*g*Math.pow(d,.7),y=Math.max(0,1-Math.hypot(c,u)/(o*.78)),T=s*Math.pow(y,1.15)*(.72+.28*g),x=Math.max(m,T),k=!1;t==="volcano"&&(x=.4+s*1.1*Math.pow(d,1.6)*(.75+.25*g),Math.hypot(c,u)<e*.09&&(x=s*.72,k=!0)),x=Math.max(zt,Math.round(x/zt)*zt),r.push(x);let L=x/s;a.push(L<.07?0:L<.2?1:L<.38?2:L<.62?3:4),n.push(-1),i.push(k)}),{size:e,half:o,height:r,band:a,core:n,maxH:Math.max(...r),crater:i}}function nr(l,e,t="summer"){let o=sr(l,e,t);return l.map((s,r)=>{let a=o.height[r];return{x:s.c-o.half+.5,y:a/2,z:s.r-o.half+.5,scaleX:1.13,scaleY:a/.88,scaleZ:1.13}})}function Hs(){let l={uSide:{value:0}},e=new b.MeshStandardMaterial({color:16777215,roughness:.92,metalness:0});return e.onBeforeCompile=t=>{Object.assign(t.uniforms,l),t.vertexShader=`varying vec3 vRockPos;\nvarying vec3 vRockN;\n`+t.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>\n        vec4 rockWp = vec4(transformed, 1.0);\n        vec3 rockN = objectNormal;\n        #ifdef USE_INSTANCING\n          rockWp = instanceMatrix * rockWp;\n          rockN = mat3(instanceMatrix) * rockN;\n        #endif\n        vRockPos = (modelMatrix * rockWp).xyz;\n        vRockN = normalize(mat3(modelMatrix) * rockN);`),t.fragmentShader=`varying vec3 vRockPos;\nvarying vec3 vRockN;\nuniform float uSide;\n`+t.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>\n        float rockSide = 1.0 - step(0.5, abs(vRockN.y));\n        float strata = 0.86 + 0.14 * step(0.5, fract(vRockPos.y * 2.0));\n        float grain = 0.95 + 0.05 * fract(sin(dot(floor(vRockPos * 4.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);\n        diffuseColor.rgb *= mix(1.0, strata * grain * 0.9, rockSide * uSide);`)},e.customProgramCacheKey=()=>"qr-island-rock",{material:e,uniforms:l}}var $e=class{constructor(e,t,o,s){this.modules=e;this.matrix=t;this.size=o;this.mode=s;this.layout=sr(e,o,s),this.pal=Ts[s];let r=Hs();this.voxelMaterial=r.material,this.rockUniforms=r.uniforms,this.targets=e.map((a,n)=>{let i=this.layout.height[n];return{x:a.c-this.layout.half+.5,y:i/2,z:a.r-this.layout.half+.5,scaleX:1.13,scaleY:i/.88,scaleZ:1.13}}),this.grow=new J(this.group,a=>this.track(a)),this.build()}group=new b.Group;voxelMaterial;targets;rockUniforms;layout;pal;disposables=[];grow;water=[];waterMesh;waterQr=[];waterSide=[];slabMat;boats=[];boatHull;boatSail;particles;particleKind="none";lavaMat=null;lampMat;lastGrowth=-1;terrainTop=0;growth=0;get maxHeight(){return this.layout.maxH+3}track(e){return this.disposables.push(e),e}isWater(e,t){return e<0||t<0||e>=this.size||t>=this.size?!0:!this.matrix[e][t]}moduleIndex=new Map;qrHue=new Map;voxelColor(e){let t=this.layout,o=this.pal.bands[t.band[e]];t.crater[e]&&(o="#3a2a22");let s=t.crater[e]?"#ff5a1f":this.qrHue.get(e)??this.pal.qrBands[t.band[e]];return{qr:j(s,ys+(p(e*5+17)-.5)*14),side:o}}growDelay(e){return .04+this.layout.height[e]/this.layout.maxH*.34+p(e*7+3)*.06}build(){let e=this.size,t=e/2;this.modules.forEach((a,n)=>this.moduleIndex.set(a.r*e+a.c,n));let o=e+2.4;this.slabMat=this.track(new b.MeshStandardMaterial({color:q.slab,roughness:.6}));let s=new b.Mesh(this.track(new b.BoxGeometry(o,.9,o)),this.slabMat);s.position.y=-.45,s.receiveShadow=!0,this.group.add(s),this.slab=s;for(let a=0;a<e;a++)for(let n=0;n<e;n++){if(this.matrix[a][n])continue;let i=!this.isWater(a-1,n)||!this.isWater(a+1,n)||!this.isWater(a,n-1)||!this.isWater(a,n+1);this.water.push({x:n-t+.5,z:a-t+.5,r:a,c:n,shallow:i})}this.waterMesh=new b.InstancedMesh(this.track(new b.BoxGeometry(1,.06,1)),this.track(new b.MeshStandardMaterial({color:16777215,roughness:.25,metalness:.05})),Math.max(1,this.water.length)),this.waterMesh.count=this.water.length,this.waterMesh.receiveShadow=!0;let r=["#ffffff","#f6f5f2","#eeece8","#e9e7e2","#f9f8f6"];this.water.forEach((a,n)=>{this.waterQr.push(new b.Color(r[Math.floor(p(n*3+5)*r.length)]));let i=new b.Color(a.shallow?this.pal.waterShallow:this.pal.waterDeep);this.waterSide.push(i.multiplyScalar(.95+p(n*11+1)*.08)),this.waterMesh.setColorAt(n,this.waterQr[n])}),this.group.add(this.waterMesh),this.computeHeightField(),this.buildTerrain(),this.buildTrees(),this.buildLandmarks(),this.buildFoam(),this.mode==="volcano"&&this.buildLava(),this.buildRiver(),this.buildBoats(),this.buildParticles(),this.update(0,0)}top(e){let t=this.modules[e],o=t.c-this.layout.half+.5,s=t.r-this.layout.half+.5;return new b.Vector3(o,this.surfaceAt(o,s),s)}voxelSideWindow=[.3,.72];voxelSideScale(){return[0,0,0]}H;terrain;craterCentre=null;slab;seaLevel=0;sea;seaMat;computeHeightField(){let e=this.size,t=this.layout,o=new Float32Array(e*e).fill(-.4);this.modules.forEach((r,a)=>o[r.r*e+r.c]=t.height[a]);let s=new Uint8Array(e*e);this.modules.forEach(r=>s[r.r*e+r.c]=1);for(let r=0;r<2;r++){let a=new Float32Array(e*e);for(let n=0;n<e;n++)for(let i=0;i<e;i++){let h=0,c=0;for(let u=-1;u<=1;u++)for(let f=-1;f<=1;f++){let E=Math.min(e-1,Math.max(0,n+u)),d=Math.min(e-1,Math.max(0,i+f)),g=u===0&&f===0?4:u===0||f===0?2:1;h+=o[E*e+d]*g,c+=g}a[n*e+i]=h/c}o=a}for(let r=0;r<e*e;r++)o[r]=s[r]?Math.max(.22,o[r]*1.12):Math.min(-.06,o[r]);this.H=o,this.mode==="volcano"&&this.computeCrater(),this.terrainTop=o.reduce((r,a)=>Math.max(r,a),0),this.crater&&(this.terrainTop=this.crater.rim)}crater=null;computeCrater(){let e=this.layout,t=0,o=0,s=0;if(this.modules.forEach((i,h)=>{e.crater[h]&&(t+=i.c-e.half+.5,o+=i.r-e.half+.5,s++)}),!s)return;t/=s,o/=s;let r=Math.max(1,Math.sqrt(s/Math.PI)*.95),a=0;for(let i of this.H)a=Math.max(a,i);let n=a+.45;this.crater={x:t,z:o,r,rim:n,lake:n-.95}}surfaceAt(e,t){let o=this.hAt(e,t),s=this.crater;if(!s)return o;let r=Math.hypot(e-s.x,t-s.z),a=.8,n=2.2;if(r<s.r)return s.lake-.25;if(r<s.r+a)return b.MathUtils.lerp(s.lake-.25,s.rim,b.MathUtils.smoothstep(r,s.r,s.r+a));if(r<s.r+a+n){let i=b.MathUtils.smoothstep(r,s.r+a,s.r+a+n);return Math.max(o,b.MathUtils.lerp(s.rim,o,i))}return o}hAt(e,t){let o=this.size,s=Math.min(o-1,Math.max(0,e+o/2-.5)),r=Math.min(o-1,Math.max(0,t+o/2-.5)),a=Math.floor(s),n=Math.floor(r),i=Math.min(o-1,a+1),h=Math.min(o-1,n+1),c=s-a,u=r-n,f=this.H,E=f[n*o+a]*(1-c)+f[n*o+i]*c,d=f[h*o+a]*(1-c)+f[h*o+i]*c;return E*(1-u)+d*u}buildTerrain(){let e=this.size,t=e*2,o=new b.PlaneGeometry(e,e,t,t);o.rotateX(-Math.PI/2);let s=o.attributes.position;for(let f=0;f<s.count;f++){let E=s.getX(f),d=s.getZ(f),g=(p(Math.round((E+100)*2)*131+Math.round((d+100)*2)*17)-.5)*.18,m=this.surfaceAt(E,d),y=this.crater&&Math.hypot(E-this.crater.x,d-this.crater.z)<this.crater.r+.9;s.setY(f,m+(m>.4&&!y?g:0))}let r=o.toNonIndexed();o.dispose(),r.computeVertexNormals();let a=r.attributes.position,n=r.attributes.normal,i=new Float32Array(a.count*3),h=new b.Color,c=this.layout.maxH,u=this.pal.bands;for(let f=0;f<a.count;f+=3){let E=(a.getY(f)+a.getY(f+1)+a.getY(f+2))/3,d=n.getY(f),g=E/c,m=u[1];E<.27?m=u[0]:d<.62&&g>.12?m=u[3]:g>.62?m=u[4]:g>.38?m=u[3]:g>.2&&(m=u[2]),h.set(m).multiplyScalar(.92+p(f*.37+3)*.14),E<0&&h.multiplyScalar(.8);for(let y=0;y<3;y++)i.set([h.r,h.g,h.b],(f+y)*3)}r.setAttribute("color",new b.BufferAttribute(i,3)),this.terrain=new b.Mesh(this.track(r),this.track(new b.MeshStandardMaterial({vertexColors:!0,roughness:.95,flatShading:!0}))),this.terrain.castShadow=!0,this.terrain.receiveShadow=!0,this.terrain.visible=!1,this.group.add(this.terrain),this.seaMat=this.track(new b.MeshStandardMaterial({color:this.pal.waterDeep,roughness:.2,metalness:.05,transparent:!0,opacity:0})),this.sea=new b.Mesh(this.track(new b.BoxGeometry(e+2.38,.05,e+2.38)),this.seaMat),this.sea.position.y=.05,this.sea.receiveShadow=!0,this.sea.visible=!1,this.group.add(this.sea)}buildLava(){this.lavaMat=new b.MeshStandardMaterial({color:"#ff6a1f",emissive:"#ff4a10",emissiveIntensity:0,flatShading:!0});let e=this.crater;if(!e)return;let t=e.r+.25,o=new b.Vector3(e.x,e.lake,e.z);this.craterCentre=o.clone();let s=[{matrix:new b.Matrix4().compose(o,new b.Quaternion,new b.Vector3(t,.14,t)),color:"#ff6a1f",delay:.6,pivot:o.clone()}],r=[],a=[];for(let n=0;n<14;n++){let i=p(n*7+1)*Math.PI*2,h=Math.sqrt(p(n*7+2))*t*.8,c=o.clone().add(new b.Vector3(Math.cos(i)*h,.08,Math.sin(i)*h)),u=.16+p(n*7+3)*.22;(n%2?r:a).push({matrix:new b.Matrix4().compose(c,new b.Quaternion().setFromEuler(new b.Euler(p(n)*3,p(n+1)*3,0)),n%2?new b.Vector3(u,u*.7,u):new b.Vector3(u*1.8,u*.35,u*1.4)),color:n%2?"#ffb340":"#3a2620",delay:.68,pivot:o.clone()})}this.grow.add(new b.CylinderGeometry(1,.94,1,22),this.lavaMat,s,!1),this.grow.add(new b.IcosahedronGeometry(.5,0),this.lavaMat,r,!1),this.grow.add(new b.IcosahedronGeometry(.5,0),new b.MeshStandardMaterial({color:16777215,roughness:1,flatShading:!0}),a,!1)}traceFlow(e){let t=this.size,o=this.H,s=[],r=new Set,a=e;for(let n=0;n<t*2;n++){let i=Math.floor(a/t),h=a%t,c=h-t/2+.5,u=i-t/2+.5;if(s.push({p:new b.Vector3(c,this.surfaceAt(c,u)+.06,u),k:a}),r.add(a),o[a]<0)break;let f=-1,E=1/0;for(let d=-1;d<=1;d++)for(let g=-1;g<=1;g++){let m=i+d,y=h+g;if(!d&&!g||m<0||y<0||m>=t||y>=t)continue;let T=m*t+y;!r.has(T)&&o[T]<E&&(E=o[T],f=T)}if(f<0)break;a=f}return s}buildRiver(){let e=this.size,t=this.H,o=this.layout,s=[];if(this.mode==="volcano"&&this.craterCentre)for(let f=0;f<3;f++){let E=f*(Math.PI*2/3)+.5,d=this.craterCentre,g=(this.crater?.r??1)+1,m=d.x+Math.cos(E)*g,y=d.z+Math.sin(E)*g,T=Math.round(m+e/2-.5),x=Math.round(y+e/2-.5);x>=0&&T>=0&&x<e&&T<e&&s.push(x*e+T)}else{let f=-1,E=-1/0;this.modules.forEach((d,g)=>{if(o.core[g]>=0||o.crater[g])return;let m=d.r*e+d.c,y=t[m]-Math.hypot(d.c-e/2,d.r-e/2)*.15+p(g)*.3;y>E&&(E=y,f=m)}),f>=0&&s.push(f)}let r=this.mode==="volcano",a=r?"#ff6a1f":this.mode==="winter"?"#dff1fb":"#5fc8e6",n=[],i=[],h=new b.Vector3(1,0,0),c=new Map;this.modules.forEach((f,E)=>c.set(f.r*e+f.c,E)),s.forEach((f,E)=>{let d=this.traceFlow(f);d.forEach(({k:g})=>{let m=c.get(g);m!==void 0&&o.core[m]<0&&this.qrHue.set(m,r?"#ff7a24":"#2f8fc7")});for(let g=0;g<d.length;g++){let m=d[g].p,y=(r?.3:.34)+g*.018,T=Math.min(.9,(r?.62:.55)+g/d.length*.28+E*.02);if(i.push({matrix:new b.Matrix4().compose(m,new b.Quaternion,new b.Vector3(y/2,.05,y/2)),color:a,delay:T,pivot:m.clone()}),g===d.length-1)break;let x=d[g+1].p,k=x.clone().sub(m),L=new b.Quaternion().setFromUnitVectors(h,k.clone().normalize());n.push({matrix:new b.Matrix4().compose(m.clone().add(x).multiplyScalar(.5),L,new b.Vector3(k.length(),.05,y)),color:a,delay:T,pivot:m.clone()})}});let u=r?this.lavaMat:new b.MeshStandardMaterial({color:16777215,roughness:.15,transparent:!0,opacity:.9});this.grow.add(new b.BoxGeometry(1,1,1),u,n,!1),this.grow.add(new b.CylinderGeometry(1,1,1,14),r?this.lavaMat:u.clone(),i,!1)}buildTrees(){let e=this.layout,t=[],o=[],s=[],r=this.mode==="winter",a=this.mode==="volcano";this.modules.forEach((n,i)=>{if(e.core[i]>=0||e.crater[i])return;let h=e.band[i],c=(h===0||h===1)&&!r&&p(i*3+9)<.18,u=(h===1||h===2)&&p(i*13+2)<(h===2?.32:.14);if(!c&&!u)return;this.qrHue.set(i,this.pal.foliage[Math.floor(p(i+30)*this.pal.foliage.length)]);let f=this.top(i);f.x+=(p(i+31)-.5)*.3,f.z+=(p(i+32)-.5)*.3;let E=Math.min(.85,this.growDelay(i)+.3+p(i+33)*.12);if(c||a){let g=.9+p(i+34)*.5,m=new b.Quaternion().setFromEuler(new b.Euler((p(i+35)-.5)*.4,0,(p(i+36)-.5)*.4)),y=new b.Vector3(0,g/2,0).applyQuaternion(m).add(f);t.push({matrix:new b.Matrix4().compose(y,m,new b.Vector3(.09,g,.09)),color:this.pal.trunk,delay:E,pivot:f.clone()});let T=new b.Vector3(0,g,0).applyQuaternion(m).add(f);for(let x=0;x<5;x++){let k=x/5*Math.PI*2+p(i+x)*.5,L=new b.Quaternion().setFromEuler(new b.Euler(0,k,-.45)),v=new b.Vector3(.28,-.05,0).applyQuaternion(L);s.push({matrix:new b.Matrix4().compose(T.clone().add(v),L,new b.Vector3(.6,.05,.16)),color:this.pal.foliage[x%this.pal.foliage.length],delay:Math.min(.9,E+.05),pivot:T.clone()})}return}let d=.8+p(i+37)*.5;t.push({matrix:new b.Matrix4().compose(f.clone().setY(f.y+.15*d),new b.Quaternion,new b.Vector3(.1,.3*d,.1)),color:this.pal.trunk,delay:E,pivot:f.clone()});for(let g=0;g<2;g++){let m=(.55-g*.12)*d,y=(.42-g*.12)*d,T=this.pal.foliage[Math.floor(p(i*5+g)*this.pal.foliage.length)];o.push({matrix:new b.Matrix4().compose(f.clone().setY(f.y+(.3+g*.32+m/2)*d),new b.Quaternion,new b.Vector3(y,m,y)),color:r&&g===1?"#f4f8fb":T,delay:Math.min(.9,E+.04*g),pivot:f.clone()})}}),this.grow.add(new b.BoxGeometry(1,1,1),new b.MeshStandardMaterial({color:16777215,roughness:.9}),t),this.grow.add(new b.CylinderGeometry(0,1,1,7),new b.MeshStandardMaterial({color:16777215,roughness:.85}),o),this.grow.add(new b.BoxGeometry(1,1,1),new b.MeshStandardMaterial({color:16777215,roughness:.8}),s,!1)}buildLandmarks(){let e=this.layout,t=[null,null,null],o=[0,0,0];this.modules.forEach((i,h)=>{let c=e.core[h];if(c<0)return;let[u,f]=$(i.r,i.c,this.size),E=u===3&&f===3;c===0&&E&&this.qrHue.set(h,"#d94a3a"),c===2&&E&&this.qrHue.set(h,"#8a4a32"),c===1&&or.some(([g,m])=>g===u&&m===f)&&this.qrHue.set(h,"#8a4a32");let d=this.top(h);t[c]=(t[c]??new b.Vector3).add(d),o[c]++});let s=[],r=[],a=[],n=[];t.forEach((i,h)=>{if(!i||!o[h])return;let c=i.divideScalar(o[h]),u=.55+h*.05;if(h===0){for(let f=0;f<6;f++)r.push({matrix:new b.Matrix4().compose(c.clone().setY(c.y+.25+f*.5),new b.Quaternion,new b.Vector3(.42-f*.025,.5,.42-f*.025)),color:f%2?"#d94a3a":"#f4f2ee",delay:u+f*.03,pivot:c.clone()});n.push({matrix:new b.Matrix4().compose(c.clone().setY(c.y+3.25),new b.Quaternion,new b.Vector3(.3,.4,.3)),color:"#fff2b0",delay:u+.2,pivot:c.clone()}),a.push({matrix:new b.Matrix4().compose(c.clone().setY(c.y+3.7),new b.Quaternion,new b.Vector3(.42,.5,.42)),color:"#d94a3a",delay:u+.22,pivot:c.clone()})}else if(h===1)for(let f=0;f<3;f++){let[E,d]=or[f],g=c.clone().add(new b.Vector3(d-3,0,E-3)),m=1.2+f*.25;s.push({matrix:new b.Matrix4().compose(g.clone().setY(g.y+m/2),new b.Quaternion,new b.Vector3(.1,m,.1)),color:this.pal.trunk,delay:u,pivot:g.clone()});for(let y=0;y<5;y++){let T=new b.Quaternion().setFromEuler(new b.Euler(0,y/5*Math.PI*2+f,-.5)),x=g.clone().setY(g.y+m);s.push({matrix:new b.Matrix4().compose(x.clone().add(new b.Vector3(.3,-.06,0).applyQuaternion(T)),T,new b.Vector3(.65,.05,.17)),color:this.mode==="winter"?"#e8eef2":this.pal.foliage[y%this.pal.foliage.length],delay:u+.08,pivot:x.clone()})}}else s.push({matrix:new b.Matrix4().compose(c.clone().setY(c.y+.31),new b.Quaternion,new b.Vector3(.84,.62,.8)),color:"#c99a6a",delay:u,pivot:c.clone()}),a.push({matrix:new b.Matrix4().compose(c.clone().setY(c.y+.84),new b.Quaternion().setFromEuler(new b.Euler(0,Math.PI/4,0)),new b.Vector3(.66,.44,.66)),color:this.mode==="winter"?"#f4f8fb":"#8a4a32",delay:u+.06,pivot:c.clone()}),s.push({matrix:new b.Matrix4().compose(c.clone().setY(c.y+.2).add(new b.Vector3(0,0,.41)),new b.Quaternion,new b.Vector3(.2,.38,.02)),color:"#5a3d28",delay:u+.05,pivot:c.clone()})}),this.grow.add(new b.BoxGeometry(1,1,1),new b.MeshStandardMaterial({color:16777215,roughness:.8}),s),this.grow.add(new b.CylinderGeometry(1,1,1,14),new b.MeshStandardMaterial({color:16777215,roughness:.6}),r),this.grow.add(new b.CylinderGeometry(0,1,1,4),new b.MeshStandardMaterial({color:16777215,roughness:.7}),a),this.lampMat=new b.MeshStandardMaterial({color:"#fff2b0",emissive:"#ffd35a",emissiveIntensity:0}),this.grow.add(new b.CylinderGeometry(1,1,1,10),this.lampMat,n,!1)}buildFoam(){let e=[];this.mode!=="winter"&&(this.water.forEach((t,o)=>{if(!t.shallow||p(o*17+5)>.35)return;let s=new b.Vector3(t.x+(p(o+1)-.5)*.6,.07,t.z+(p(o+2)-.5)*.6);e.push({matrix:new b.Matrix4().compose(s,new b.Quaternion().setFromEuler(new b.Euler(0,p(o)*3,0)),new b.Vector3(.3,.02,.12)),color:"#f4fbff",delay:.5+p(o+3)*.2,pivot:s.clone()})}),this.grow.add(new b.BoxGeometry(1,1,1),new b.MeshStandardMaterial({color:16777215,roughness:.5}),e,!1))}buildBoats(){if(this.mode==="winter"){this.boatHull=this.boatSail=null;return}let e=tr((s,r)=>this.isWater(s,r),this.size,5);e.sort((s,r)=>p(s.line*31+s.from+(s.horizontal?7:0))-p(r.line*31+r.from+(r.horizontal?7:0))),e.slice(0,5).forEach((s,r)=>this.boats.push({...s,speed:.35+p(r+5)*.3,phase:p(r*7+1)*2}));let t=Math.max(1,this.boats.length);this.boatHull=new b.InstancedMesh(this.track(new b.BoxGeometry(.7,.16,.3)),this.track(new b.MeshStandardMaterial({color:16777215,roughness:.6})),t),this.boatSail=new b.InstancedMesh(this.track(new b.CylinderGeometry(0,.28,.6,3)),this.track(new b.MeshStandardMaterial({color:"#fbfbf8",roughness:.5})),t),[this.boatHull,this.boatSail].forEach(s=>{s.count=this.boats.length,s.castShadow=!0,this.group.add(s)});let o=new b.Color;this.boats.forEach((s,r)=>this.boatHull.setColorAt(r,o.set(["#8a5a3a","#f4f2ee","#d94a3a","#3a6fc0","#f2c14e"][r%5])))}buildParticles(){this.particleKind=this.mode==="winter"?"snow":this.mode==="volcano"?"smoke":"none";let e=this.particleKind==="snow"?120:this.particleKind==="smoke"?26:1;this.particles=new b.InstancedMesh(this.track(new b.BoxGeometry(1,1,1)),this.track(new b.MeshStandardMaterial({color:this.particleKind==="smoke"?"#8a8580":"#ffffff",roughness:1,transparent:this.particleKind==="smoke",opacity:.85})),e),this.particles.count=this.particleKind==="none"?0:e,this.group.add(this.particles)}applyLighting(e,t,o,s){se(e,this.pal.mood,t,o,s),this.slabMat.color.set(q.slab).lerp(new b.Color(this.pal.slab),e),this.rockUniforms.uSide.value=e;let r=b.MathUtils.smoothstep(e,.5,1);this.lavaMat&&(this.lavaMat.emissiveIntensity=2.4*r),this.lampMat.emissiveIntensity=1.6*r}update(e,t){if(this.growth=e,e!==this.lastGrowth){this.lastGrowth=e,this.grow.update(e);let n=b.MathUtils.smoothstep(e,.06,.66);this.terrain.visible=n>.002,this.terrain.scale.y=Math.max(.001,n);let i=b.MathUtils.smoothstep(e,.2,.7);this.sea.visible=i>.002,this.seaMat.opacity=.82*i,this.seaLevel=i,this.slab.position.y=-.45-.5*i}let o=b.MathUtils.smoothstep(e,.08,.6),s=new b.Color,r=new b.Matrix4,a=this.mode!=="winter"?e:0;for(let n=0;n<this.water.length;n++){let i=this.water[n];s.copy(this.waterQr[n]).lerp(this.waterSide[n],o),this.waterMesh.setColorAt(n,s);let h=.03-.55*this.seaLevel+Math.sin(t*1.6+i.x*.7+i.z*.5)*.035*a;r.makeTranslation(i.x,h,i.z),this.waterMesh.setMatrixAt(n,r)}this.waterMesh.instanceColor&&(this.waterMesh.instanceColor.needsUpdate=!0),this.waterMesh.instanceMatrix.needsUpdate=!0,this.updateBoats(t),this.updateParticles(t)}updateBoats(e){if(!this.boatHull)return;let t=b.MathUtils.clamp((this.growth-.8)/.2,0,1);if(this.boatHull.visible=this.boatSail.visible=t>0&&this.boats.length>0,t<=0)return;let o=this.size/2,s=new b.Object3D;this.boats.forEach((r,a)=>{let n=r.to-r.from+1,i=(e*r.speed/n+r.phase)%2,h=i<1,c=h?i:2-i,u=r.from-o+.4+c*(n-.8),f=r.line-o+.5,E=r.horizontal?new b.Vector3(u,.15,f):new b.Vector3(f,.15,u);E.y+=Math.sin(e*2+a)*.03;let d=r.horizontal?h?0:Math.PI:h?-Math.PI/2:Math.PI/2,g=Math.min(c,1-c)*n,m=t*Math.min(1,.4+g);s.position.copy(E),s.rotation.set(0,d,Math.sin(e*1.7+a)*.06),s.scale.setScalar(m),s.updateMatrix(),this.boatHull.setMatrixAt(a,s.matrix),s.position.y+=.38*m,s.updateMatrix(),this.boatSail.setMatrixAt(a,s.matrix)}),this.boatHull.instanceMatrix.needsUpdate=!0,this.boatSail.instanceMatrix.needsUpdate=!0,this.boatHull.instanceColor&&(this.boatHull.instanceColor.needsUpdate=!0)}updateParticles(e){let t=b.MathUtils.clamp((this.growth-.85)/.15,0,1);if(this.particles.visible=t>0&&this.particleKind!=="none",!this.particles.visible)return;let o=new b.Object3D,s=this.size/2;for(let r=0;r<this.particles.count;r++){if(this.particleKind==="snow"){let a=this.terrainTop+4,n=a-(e*(.6+p(r)*.5)+p(r+50)*a)%a;o.position.set((p(r+1)-.5)*(s*2+1)+Math.sin(e+r)*.3,n,(p(r+2)-.5)*(s*2+1)),o.rotation.set(e+r,e*.7,0),o.scale.setScalar(.09*t)}else{let a=(e*.18+p(r+3))%1,n=this.craterCentre??new b.Vector3(0,this.terrainTop,0);o.position.set(n.x+(p(r+4)-.5)*1.6+a*2.2,n.y+.3+a*6,n.z+(p(r+5)-.5)*1.6-a*1.2),o.rotation.set(p(r)*3,e*.2+r,0),o.scale.setScalar((.4+a*1.4)*t*Math.min(1,(1-a)*3))}o.updateMatrix(),this.particles.setMatrixAt(r,o.matrix)}this.particles.instanceMatrix.needsUpdate=!0}dispose(){this.group.removeFromParent(),this.disposables.forEach(e=>e.dispose()),this.disposables=[]}};var w=te(oe(),1);var Rs={day:{hedges:["#3f8f3a","#4a9a40","#357c33","#5aa648","#44923c"],flowers:["#f25c8a","#ffd23f","#ffffff","#b07cf0","#ff7a4a"],path:"#e6d9bf",slab:"#d9ceb6",gazebo:["#d94a3a","#3a6fc0","#8a4a32"],leaves:[],lanterns:0,qrTint:null,qrTintAmount:0,mood:{ambient:{color:"#ffffff",intensity:1.2},sun:{color:"#fff4dc",intensity:2.6,position:[22,48,28]}}},evening:{hedges:["#4f9a5a","#58a464","#4a8f55","#5fae6a","#529e5e"],flowers:["#ff7aa8","#ffd86a","#fff4e0","#c79bff","#ff9a6a"],path:"#bfae90",slab:"#a8987e",gazebo:["#c9423a","#3a62b0","#7a4230"],leaves:[],lanterns:1,qrTint:"#4a3fa8",qrTintAmount:.55,mood:{ambient:{color:"#b4a6e0",intensity:1.35},sun:{color:"#ffa070",intensity:2.3,position:[44,16,-10]}}},autumn:{hedges:["#c9682a","#d98a2a","#b5532a","#e0a83a","#8f6a2a","#a8452a"],flowers:["#ffd23f","#ff7a4a","#c0392b"],path:"#dccbaa",slab:"#cbb894",gazebo:["#8a2f2a","#3a5a8a","#6a3a22"],leaves:["#e0892a","#c9562a","#f2b33a","#a8452a"],lanterns:0,qrTint:null,qrTintAmount:0,mood:{ambient:{color:"#fff0dc",intensity:1.15},sun:{color:"#ffd8a0",intensity:2.5,position:[30,36,22]}}}},xs=100,ar=1.2;function ir(l,e){let t=e/2,o=new Set(l.map(i=>i.r*e+i.c)),s=(i,h)=>i>=0&&h>=0&&i<e&&h<e&&o.has(i*e+h),r=[],a=[],n=[];return l.forEach((i,h)=>{let c=$(i.r,i.c,e);if(c){let[f,E,d]=c,g=f>=2&&f<=4&&E>=2&&E<=4;n.push(d),g?f===3&&E===3?(a.push("gazebo"),r.push(.3)):(a.push("bed"),r.push(.3)):(a.push("ring"),r.push(ar+.3));return}if(n.push(-1),!s(i.r-1,i.c)&&!s(i.r+1,i.c)&&!s(i.r,i.c-1)&&!s(i.r,i.c+1)){a.push("topiary"),r.push(.45);return}a.push("hedge"),r.push(ar+(p(h*7+3)<.12?.3:0))}),{size:e,half:t,height:r,kind:a,pavilion:n,maxH:Math.max(...r)}}function lr(l,e){let t=ir(l,e);return l.map((o,s)=>{let r=t.height[s];return{x:o.c-t.half+.5,y:r/2,z:o.r-t.half+.5,scaleX:1.13,scaleY:r/.88,scaleZ:1.13}})}function vs(){let l={uSide:{value:0}},e=new w.MeshStandardMaterial({color:16777215,roughness:.95,metalness:0});return e.onBeforeCompile=t=>{Object.assign(t.uniforms,l),t.vertexShader=`varying vec3 vHedgePos;\n`+t.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>\n        vec4 hedgeWp = vec4(transformed, 1.0);\n        #ifdef USE_INSTANCING\n          hedgeWp = instanceMatrix * hedgeWp;\n        #endif\n        vHedgePos = (modelMatrix * hedgeWp).xyz;`),t.fragmentShader=`varying vec3 vHedgePos;\nuniform float uSide;\n`+t.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>\n        vec3 hp = floor(vHedgePos * 6.0);\n        float leaf = fract(sin(dot(hp, vec3(12.9898, 78.233, 37.719))) * 43758.5453);\n        float leaf2 = fract(sin(dot(floor(vHedgePos * 2.5), vec3(39.3, 11.7, 91.1))) * 13758.5453);\n        diffuseColor.rgb *= mix(1.0, 0.78 + 0.22 * leaf + 0.1 * (leaf2 - 0.5), uSide);`)},e.customProgramCacheKey=()=>"qr-maze-hedge",{material:e,uniforms:l}}var et=class{constructor(e,t,o,s){this.modules=e;this.matrix=t;this.size=o;this.mode=s;this.layout=ir(e,o),this.pal=Rs[s];let r=vs();this.voxelMaterial=r.material,this.hedgeUniforms=r.uniforms,this.targets=e.map((a,n)=>{let i=this.layout.height[n];return{x:a.c-this.layout.half+.5,y:i/2,z:a.r-this.layout.half+.5,scaleX:1.13,scaleY:i/.88,scaleZ:1.13}}),this.grow=new J(this.group,a=>this.track(a)),this.build()}group=new w.Group;voxelMaterial;targets;hedgeUniforms;layout;pal;disposables=[];grow;tiles=[];tileMesh;tileQr=[];tileSide=[];slabMat;lanternMat;qrHue=new Map;walkers=[];walkerBody;walkerHead;fountain=null;jets;lastGrowth=-1;growth=0;get maxHeight(){return this.layout.maxH+3.2}track(e){return this.disposables.push(e),e}isPath(e,t){return e<0||t<0||e>=this.size||t>=this.size?!1:!this.matrix[e][t]}hedgeColor(e){let t=this.modules[e],o=Math.floor(t.r/3)*97+Math.floor(t.c/3)*31,s=p(o+7)*.85+p(e*3+7)*.15;return this.pal.hedges[Math.min(this.pal.hedges.length-1,Math.floor(s*this.pal.hedges.length))]}voxelColor(e){let o=this.layout.kind[e],s=this.hedgeColor(e);(o==="bed"||o==="gazebo")&&(s="#6b4a32"),o==="topiary"&&(s="#b5653f");let r=this.qrHue.get(e)??(o==="bed"?"#5a9a3a":this.hedgeColor(e));return this.pal.qrTint&&!this.qrHue.has(e)&&(r="#"+new w.Color(r).lerp(new w.Color(this.pal.qrTint),this.pal.qrTintAmount).getHexString()),{qr:j(r,xs+(p(e*5+17)-.5)*14),side:s}}voxelSideWindow=[.3,.72];voxelSideScale(e){let t=this.layout.kind[e];return t==="hedge"||t==="ring"?[.8,.88,.8]:t==="topiary"?[.5,1,.5]:[1,1,1]}growDelay(e){let t=this.modules[e];return .04+(t.r+t.c)/(2*this.size)*.3+p(e*7+3)*.06}top(e){let t=this.modules[e];return new w.Vector3(t.c-this.layout.half+.5,this.layout.height[e],t.r-this.layout.half+.5)}build(){let e=this.size,t=e/2,o=e+2.4;this.slabMat=this.track(new w.MeshStandardMaterial({color:q.slab,roughness:.9}));let s=new w.Mesh(this.track(new w.BoxGeometry(o,.9,o)),this.slabMat);s.position.y=-.45,s.receiveShadow=!0,s.castShadow=!0,this.group.add(s);for(let n=0;n<e;n++)for(let i=0;i<e;i++)this.matrix[n][i]||this.tiles.push({x:i-t+.5,z:n-t+.5,r:n,c:i});this.tileMesh=new w.InstancedMesh(this.track(new w.BoxGeometry(1,.06,1)),this.track(new w.MeshStandardMaterial({color:16777215,roughness:.95})),Math.max(1,this.tiles.length)),this.tileMesh.count=this.tiles.length,this.tileMesh.receiveShadow=!0;let r=["#ffffff","#f6f5f2","#eeece8","#e9e7e2","#f9f8f6"],a=new w.Matrix4;this.tiles.forEach((n,i)=>{a.makeTranslation(n.x,.03,n.z),this.tileMesh.setMatrixAt(i,a),this.tileQr.push(new w.Color(r[Math.floor(p(i*3+5)*r.length)])),this.tileSide.push(new w.Color(this.pal.path).multiplyScalar(.93+p(i*11+9)*.1)),this.tileMesh.setColorAt(i,this.tileQr[i])}),this.group.add(this.tileMesh),this.buildLeafClumps(),this.buildFlowers(),this.buildTopiary(),this.buildPavilions(),this.buildFountain(),this.buildLanterns(),this.buildLeaves(),this.buildWalkers(),this.update(0,0)}buildLeafClumps(){let e=this.layout,t=this.size,o=new Set(this.modules.map(n=>n.r*t+n.c)),s=new Map;this.modules.forEach((n,i)=>s.set(n.r*t+n.c,e.height[i]));let r=[],a=new w.Color;this.modules.forEach((n,i)=>{let h=e.kind[i];if(h!=="hedge"&&h!=="ring")return;let c=this.top(i),u=e.height[i],f=this.hedgeColor(i),E=Math.min(.8,this.growDelay(i)+.18),d=(m,y,T)=>{a.set(f).multiplyScalar(.86+p(T)*.26),r.push({matrix:new w.Matrix4().compose(m,new w.Quaternion().setFromEuler(new w.Euler(p(T+1)*3,p(T+2)*3,p(T+3)*3)),new w.Vector3(y,y*(.8+p(T+4)*.3),y)),color:"#"+a.getHexString(),delay:E+p(T+5)*.08,pivot:new w.Vector3(c.x,u/2,c.z)})};for(let m=0;m<4;m++)d(c.clone().add(new w.Vector3((m%2?.22:-.22)+(p(i*9+m)-.5)*.12,-.08+p(i+m*3)*.1,(m<2?-.22:.22)+(p(i*7+m)-.5)*.12)),.5+p(i*11+m)*.16,i*31+m);[[0,1],[0,-1],[1,0],[-1,0]].forEach(([m,y],T)=>{let x=(n.r+m)*t+(n.c+y),k=o.has(x)?s.get(x)??0:0;if(k>=u)return;let L=Math.max(1,Math.round((u-k)/.45));for(let v=0;v<L;v++)for(let I=0;I<2;I++){let P=(I?.24:-.24)+(p(i*13+T*5+v+I)-.5)*.1,V=k+.25+v*.45+(p(i+T+v*7+I)-.5)*.1,A=new w.Vector3(c.x+(y!==0?y*.43:P),Math.min(u-.15,V),c.z+(m!==0?m*.43:P));d(A,.4+p(i*17+T+v+I)*.14,i*53+T*11+v*3+I)}})}),this.grow.add(new w.IcosahedronGeometry(.5,0),new w.MeshStandardMaterial({color:16777215,roughness:.95,flatShading:!0}),r)}buildFlowers(){let e=this.layout,t=[];this.modules.forEach((o,s)=>{if(e.kind[s]!=="hedge"&&e.kind[s]!=="ring"||p(s*13+5)>(this.mode==="autumn"?.12:.24))return;let r=this.pal.flowers[Math.floor(p(s*17+2)*this.pal.flowers.length)];this.qrHue.set(s,r==="#ffffff"||r==="#fff4e0"?"#c9b8e8":r);let a=this.top(s),n=Math.min(.88,this.growDelay(s)+.35);for(let i=0;i<6;i++){let h=i<3,c=a.clone().add(new w.Vector3((p(s*3+i)-.5)*.85,h?.26:-.2-p(s+i*5)*.7,(p(s*5+i)-.5)*.85));if(!h){let f=Math.floor(p(s+i*7)*4);f===0&&(c.x=a.x+.68),f===1&&(c.x=a.x-.68),f===2&&(c.z=a.z+.68),f===3&&(c.z=a.z-.68)}let u=.14+p(s*7+i)*.08;t.push({matrix:new w.Matrix4().compose(c,new w.Quaternion().setFromEuler(new w.Euler(0,p(s+i)*3,0)),new w.Vector3(u,u*.7,u)),color:r,delay:n,pivot:c.clone()})}}),this.grow.add(new w.BoxGeometry(1,1,1),new w.MeshStandardMaterial({color:16777215,roughness:.6}),t,!1)}buildTopiary(){let e=this.layout,t=[],o=[];this.modules.forEach((s,r)=>{if(e.kind[r]!=="topiary")return;let a=this.top(r),n=Math.min(.85,this.growDelay(r)+.25);o.push({matrix:new w.Matrix4().compose(a.clone().setY(a.y+.25),new w.Quaternion,new w.Vector3(.08,.5,.08)),color:"#6b4a32",delay:n,pivot:a.clone()});let i=.75+p(r+1)*.15;t.push({matrix:new w.Matrix4().compose(a.clone().setY(a.y+.5+i*.42),new w.Quaternion,new w.Vector3(i,i,i)),color:this.hedgeColor(r),delay:n+.05,pivot:a.clone()})}),this.grow.add(new w.BoxGeometry(1,1,1),new w.MeshStandardMaterial({color:16777215,roughness:.9}),o),this.grow.add(new w.SphereGeometry(.5,12,10),new w.MeshStandardMaterial({color:16777215,roughness:.95}),t)}buildPavilions(){let e=this.layout,t=[],o=[],s=[],r=[];this.modules.forEach((a,n)=>{let i=e.pavilion[n];if(i<0)return;let h=this.top(n),c=Math.min(.85,this.growDelay(n)+.3);if(e.kind[n]==="bed")for(let u=0;u<5;u++){let f=h.clone().add(new w.Vector3((p(n*3+u)-.5)*.8,.12,(p(n*5+u)-.5)*.8)),E=this.pal.flowers[Math.floor(p(n*11+u)*this.pal.flowers.length)];t.push({matrix:new w.Matrix4().compose(f,new w.Quaternion,new w.Vector3(.18,.24,.18)),color:E,delay:c,pivot:f.clone().setY(h.y)})}if(e.kind[n]==="gazebo"){let u=this.pal.gazebo[i];this.qrHue.set(n,u),r.push({matrix:new w.Matrix4().compose(h.clone().setY(h.y+.05),new w.Quaternion,new w.Vector3(.95,.1,.95)),color:"#f2eee6",delay:c,pivot:h.clone()});for(let[f,E]of[[-.38,-.38],[.38,-.38],[-.38,.38],[.38,.38]])o.push({matrix:new w.Matrix4().compose(h.clone().add(new w.Vector3(f,.75,E)),new w.Quaternion,new w.Vector3(.08,1.3,.08)),color:"#ffffff",delay:c+.04,pivot:h.clone()});s.push({matrix:new w.Matrix4().compose(h.clone().setY(h.y+1.75),new w.Quaternion().setFromEuler(new w.Euler(0,Math.PI/8,0)),new w.Vector3(.62,.6,.62)),color:u,delay:c+.08,pivot:h.clone()}),s.push({matrix:new w.Matrix4().compose(h.clone().setY(h.y+2.15),new w.Quaternion,new w.Vector3(.08,.25,.08)),color:"#d8b44a",delay:c+.1,pivot:h.clone()})}}),this.grow.add(new w.BoxGeometry(1,1,1),new w.MeshStandardMaterial({color:16777215,roughness:.6}),t,!1),this.grow.add(new w.BoxGeometry(1,1,1),new w.MeshStandardMaterial({color:16777215,roughness:.5}),r),this.grow.add(new w.BoxGeometry(1,1,1),new w.MeshStandardMaterial({color:16777215,roughness:.4}),o),this.grow.add(new w.CylinderGeometry(0,1,1,8),new w.MeshStandardMaterial({color:16777215,roughness:.55}),s)}buildFountain(){let e=null,t=1/0;for(let r of this.tiles){if(!(this.isPath(r.r-1,r.c)&&this.isPath(r.r+1,r.c)&&this.isPath(r.r,r.c-1)&&this.isPath(r.r,r.c+1)))continue;let n=Math.hypot(r.x,r.z);n<t&&(t=n,e=r)}let o=[],s=[];if(e){let r=new w.Vector3(e.x,.06,e.z);this.fountain={pos:r},o.push({matrix:new w.Matrix4().compose(r.clone().setY(.16),new w.Quaternion,new w.Vector3(1.5,.22,1.5)),color:"#dcd6cc",delay:.45,pivot:r.clone()}),o.push({matrix:new w.Matrix4().compose(r.clone().setY(.55),new w.Quaternion,new w.Vector3(.16,.7,.16)),color:"#dcd6cc",delay:.5,pivot:r.clone()}),o.push({matrix:new w.Matrix4().compose(r.clone().setY(.92),new w.Quaternion,new w.Vector3(.6,.1,.6)),color:"#dcd6cc",delay:.55,pivot:r.clone()}),s.push({matrix:new w.Matrix4().compose(r.clone().setY(.25),new w.Quaternion,new w.Vector3(1.3,.05,1.3)),color:"#6fc7dc",delay:.55,pivot:r.clone()}),s.push({matrix:new w.Matrix4().compose(r.clone().setY(.96),new w.Quaternion,new w.Vector3(.5,.04,.5)),color:"#6fc7dc",delay:.6,pivot:r.clone()})}this.grow.add(new w.CylinderGeometry(.5,.5,1,16),new w.MeshStandardMaterial({color:16777215,roughness:.6}),o),this.grow.add(new w.CylinderGeometry(.5,.5,1,16),new w.MeshStandardMaterial({color:16777215,roughness:.15,transparent:!0,opacity:.85}),s,!1),this.jets=new w.InstancedMesh(this.track(new w.BoxGeometry(.07,.07,.07)),this.track(new w.MeshStandardMaterial({color:"#cfefff",roughness:.2})),36),this.jets.count=this.fountain?36:0,this.group.add(this.jets)}buildLanterns(){let e=[],t=[];this.tiles.forEach((o,s)=>{if(p(s*19+4)>.09)return;let r=new w.Vector3(o.x+(p(s+1)-.5)*.5,.06,o.z+(p(s+2)-.5)*.5);e.push({matrix:new w.Matrix4().compose(r.clone().setY(.48),new w.Quaternion,new w.Vector3(.05,.85,.05)),color:"#3a3f46",delay:.6,pivot:r.clone()}),t.push({matrix:new w.Matrix4().compose(r.clone().setY(.98),new w.Quaternion,new w.Vector3(.2,.22,.2)),color:"#ffffff",delay:.65,pivot:r.clone()})}),this.grow.add(new w.BoxGeometry(1,1,1),new w.MeshStandardMaterial({color:16777215,roughness:.6}),e,!1),this.lanternMat=new w.MeshStandardMaterial({color:"#fff2cc",emissive:"#ffcf6a",emissiveIntensity:0}),this.grow.add(new w.BoxGeometry(1,1,1),this.lanternMat,t,!1)}buildLeaves(){if(!this.pal.leaves.length)return;let e=[];this.tiles.forEach((t,o)=>{let s=p(o*23+1)<.5?2:0;for(let r=0;r<s;r++){let a=new w.Vector3(t.x+(p(o*3+r)-.5)*.8,.075,t.z+(p(o*5+r)-.5)*.8);e.push({matrix:new w.Matrix4().compose(a,new w.Quaternion().setFromEuler(new w.Euler(0,p(o+r)*Math.PI,0)),new w.Vector3(.2,.02,.13)),color:this.pal.leaves[Math.floor(p(o*7+r)*this.pal.leaves.length)],delay:.65+p(o+r)*.15,pivot:a.clone()})}}),this.grow.add(new w.BoxGeometry(1,1,1),new w.MeshStandardMaterial({color:16777215,roughness:.8}),e,!1)}buildWalkers(){let e=this.size,t=(h,c)=>h*e+c,o=(h,c)=>{let u=new Map,f=new Map([[t(h,c),0]]),E=[t(h,c)],d=t(h,c);for(;E.length;){let g=E.shift(),m=Math.floor(g/e),y=g%e;for(let[T,x]of[[1,0],[-1,0],[0,1],[0,-1]]){let k=m+T,L=y+x;if(!this.isPath(k,L))continue;let v=t(k,L);f.has(v)||(f.set(v,f.get(g)+1),u.set(v,g),f.get(v)>f.get(d)&&(d=v),E.push(v))}}return{far:d,prev:u}},s=e/2,r=[];for(let h of this.tiles)if(h.r>7&&h.c>7){r.push([h.r,h.c]);break}for(let h=this.tiles.length-1;h>=0;h--){let c=this.tiles[h];if(!(c.r<e-8||c.c<8)){r.push([c.r,c.c]);break}}let a=["#e94f4f","#3a6fc0","#f2c14e"];r.forEach(([h,c],u)=>{let f=o(h,c),E=o(Math.floor(f.far/e),f.far%e),d=[],g=E.far;for(;g!==void 0;)d.push(g),g=E.prev.get(g);d.length<6||this.walkers.push({path:d.map(m=>new w.Vector3(m%e-s+.5,.06,Math.floor(m/e)-s+.5)),speed:.9+u*.25,phase:p(u+3)*2,color:a[u%a.length]})});let n=Math.max(1,this.walkers.length);this.walkerBody=new w.InstancedMesh(this.track(new w.CylinderGeometry(.12,.16,.42,8)),this.track(new w.MeshStandardMaterial({color:16777215,roughness:.7})),n),this.walkerHead=new w.InstancedMesh(this.track(new w.SphereGeometry(.11,10,8)),this.track(new w.MeshStandardMaterial({color:"#f1c9a5",roughness:.7})),n),[this.walkerBody,this.walkerHead].forEach(h=>{h.count=this.walkers.length,h.castShadow=!0,this.group.add(h)});let i=new w.Color;this.walkers.forEach((h,c)=>this.walkerBody.setColorAt(c,i.set(h.color)))}applyLighting(e,t,o,s){se(e,this.pal.mood,t,o,s),this.slabMat.color.set(q.slab).lerp(new w.Color(this.pal.slab),e),this.hedgeUniforms.uSide.value=e,this.lanternMat.emissiveIntensity=3*this.pal.lanterns*w.MathUtils.smoothstep(e,.5,1)}update(e,t){if(this.growth=e,e!==this.lastGrowth){this.lastGrowth=e,this.grow.update(e);let o=w.MathUtils.smoothstep(e,.1,.65),s=new w.Color;for(let r=0;r<this.tiles.length;r++)s.copy(this.tileQr[r]).lerp(this.tileSide[r],o),this.tileMesh.setColorAt(r,s);this.tileMesh.instanceColor&&(this.tileMesh.instanceColor.needsUpdate=!0)}this.updateWalkers(t),this.updateFountain(t)}updateWalkers(e){let t=w.MathUtils.clamp((this.growth-.8)/.2,0,1);if(this.walkerBody.visible=this.walkerHead.visible=t>0&&this.walkers.length>0,t<=0)return;let o=new w.Object3D;this.walkers.forEach((s,r)=>{let a=s.path.length-1,n=(e*s.speed/a+s.phase)%2,i=(n<1?n:2-n)*a,h=Math.floor(Math.min(i,a-1e-4)),c=i-h,u=s.path[h].clone().lerp(s.path[h+1],c),f=Math.abs(Math.sin(e*s.speed*6+r))*.04;o.position.set(u.x,.06+.21+f,u.z),o.rotation.set(0,0,0),o.scale.setScalar(t),o.updateMatrix(),this.walkerBody.setMatrixAt(r,o.matrix),o.position.y+=.32*t,o.updateMatrix(),this.walkerHead.setMatrixAt(r,o.matrix)}),this.walkerBody.instanceMatrix.needsUpdate=!0,this.walkerHead.instanceMatrix.needsUpdate=!0,this.walkerBody.instanceColor&&(this.walkerBody.instanceColor.needsUpdate=!0)}updateFountain(e){if(!this.fountain)return;let t=w.MathUtils.clamp((this.growth-.75)/.25,0,1);if(this.jets.visible=t>0,!this.jets.visible)return;let o=new w.Object3D,s=this.fountain.pos;for(let r=0;r<36;r++){let a=(e*.9+r/36)%1,n=r/36*Math.PI*2*3,i=a*.6;o.position.set(s.x+Math.cos(n)*i,1+a*1.6-a*a*2.2,s.z+Math.sin(n)*i),o.scale.setScalar(t),o.updateMatrix(),this.jets.setMatrixAt(r,o.matrix)}this.jets.instanceMatrix.needsUpdate=!0}dispose(){this.group.removeFromParent(),this.disposables.forEach(e=>e.dispose()),this.disposables=[]}};var G=te(oe(),1);var Ss={neon:{bottom:"#4fb8c8",mid:"#7f8fd8",top:"#b47ad6",accent:"#a98ae0",floor:"#13131c",slab:"#0b0b12",cabinet:"#2c2c3a",mood:{ambient:{color:"#8a8ab8",intensity:.65},sun:{color:"#b0b6ff",intensity:1,position:[22,48,28]}}},retro:{bottom:"#5cb85c",mid:"#e8c040",top:"#d9503a",accent:"#e8a030",floor:"#15110d",slab:"#0c0906",cabinet:"#3a2e24",mood:{ambient:{color:"#ffd8b0",intensity:.6},sun:{color:"#ffc890",intensity:1.1,position:[30,36,20]}}},mono:{bottom:"#5a5a66",mid:"#a0a0aa",top:"#ffffff",accent:"#e03a3a",floor:"#111113",slab:"#08080a",cabinet:"#2c2c34",mood:{ambient:{color:"#ffffff",intensity:.6},sun:{color:"#ffffff",intensity:1,position:[22,48,28]}}}};function Cs(l,e){return"#"+(e<.5?new G.Color(l.bottom).lerp(new G.Color(l.mid),e*2):new G.Color(l.mid).lerp(new G.Color(l.top),e*2-1)).getHexString()}var ks=62,tt=2.4,Is=120;function hr(l,e){let t=e*.34,o=[],s=[];return l.forEach(r=>{let a=$(r.r,r.c,e);if(a){let[n,i]=a;o.push(n>=2&&n<=4&&i>=2&&i<=4?"core":"cab"),s.push(tt)}else o.push("bar"),s.push(t)}),{size:e,half:e/2,kind:o,height:s,barH:t}}function Dt(l,e){let t=hr(l,e);return l.map((o,s)=>{let r=t.height[s];return{x:o.c-t.half+.5,y:r/2,z:o.r-t.half+.5,scaleX:1.13,scaleY:r/.88,scaleZ:1.13}})}function cr(l){let e=l*Is/60;return Math.exp(-(e-Math.floor(e))*6)}function Gs(l,e){let t={uSide:{value:0},uBeat:{value:0},uBottom:{value:new G.Color(l.bottom)},uMid:{value:new G.Color(l.mid)},uTop:{value:new G.Color(l.top)},uHmax:{value:e*1.15}},o=new G.MeshStandardMaterial({color:16777215,roughness:.35,metalness:.1});return o.onBeforeCompile=s=>{Object.assign(s.uniforms,t),s.vertexShader=`varying vec3 vEqPos;\n`+s.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>\n        vec4 eqWp = vec4(transformed, 1.0);\n        #ifdef USE_INSTANCING\n          eqWp = instanceMatrix * eqWp;\n        #endif\n        vEqPos = (modelMatrix * eqWp).xyz;`),s.fragmentShader=`varying vec3 vEqPos;\n      uniform float uSide;\n      uniform float uBeat;\n      uniform vec3 uBottom;\n      uniform vec3 uMid;\n      uniform vec3 uTop;\n      uniform float uHmax;\n      `+s.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>\n          float eqT = clamp(vEqPos.y / uHmax, 0.0, 1.0);\n          vec3 eqGrad = eqT < 0.5 ? mix(uBottom, uMid, eqT * 2.0) : mix(uMid, uTop, eqT * 2.0 - 1.0);\n          float eqSeg = step(0.16, fract(vEqPos.y / 0.32));\n          diffuseColor.rgb = mix(diffuseColor.rgb, eqGrad * mix(0.18, 0.9, eqSeg), uSide);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>\n          totalEmissiveRadiance += eqGrad * eqSeg * uSide * (0.32 + 0.28 * uBeat);`)},o.customProgramCacheKey=()=>"qr-eq-bar",{material:o,uniforms:t}}var ot=class{constructor(e,t,o,s){this.modules=e;this.matrix=t;this.size=o;this.layout=hr(e,o),this.pal=Ss[s];let r=Gs(this.pal,this.layout.barH);this.voxelMaterial=r.material,this.barUniforms=r.uniforms,this.targets=Dt(e,o),this.modules.forEach((a,n)=>this.layout.kind[n]==="bar"&&this.bars.push(n)),this.grow=new J(this.group,a=>this.track(a)),this.build()}group=new G.Group;voxelMaterial;targets;animated=!0;voxelSideWindow=[.3,.65];barUniforms;layout;pal;disposables=[];grow;tiles=[];tileMesh;tileQr=[];slabMat;bars=[];caps;capMat;woofers=[];ringMat;get maxHeight(){return this.layout.barH*1.25+1}track(e){return this.disposables.push(e),e}voxelColor(e){let t=this.layout.kind[e],o=this.modules[e],s,r;return t!=="bar"?{qr:this.pal.cabinet,side:this.pal.cabinet}:(s=Cs(this.pal,o.c/(this.size-1)),r=s,{qr:j(s,ks+(p(e*5+17)-.5)*8),side:r})}growDelay(e){let t=this.modules[e];return .04+Math.hypot(t.c-this.size/2,t.r-this.size/2)/(this.size/2)*.3+p(e*7+3)*.04}voxelSideScale(e){return this.layout.kind[e]==="bar"?[1,1,1]:[0,0,0]}level(e,t){let o=this.modules[e],s=o.c/(this.size-1),r=.5+.5*Math.sin(t*(1.7+s*5.3)+o.c*.9+o.r*.15),a=.5+.5*Math.sin(t*(3.1+s*8.7)+o.c*1.7-o.r*.35),n=cr(t)*(1-s)*.75;return .12+.78*(.55*r+.45*a)*(1-.4*s)+n}voxelDance(e,t){return this.layout.kind[e]==="bar"?this.level(e,t):1}build(){let e=this.size,t=e/2,o=e+2.4;this.slabMat=this.track(new G.MeshStandardMaterial({color:q.slab,roughness:.6}));let s=new G.Mesh(this.track(new G.BoxGeometry(o,.9,o)),this.slabMat);s.position.y=-.45,s.receiveShadow=!0,this.group.add(s);for(let n=0;n<e;n++)for(let i=0;i<e;i++)this.matrix[n][i]||this.tiles.push({x:i-t+.5,z:n-t+.5,r:n,c:i});this.tileMesh=new G.InstancedMesh(this.track(new G.BoxGeometry(.98,.06,.98)),this.track(new G.MeshStandardMaterial({color:16777215,roughness:.3,metalness:.2})),Math.max(1,this.tiles.length)),this.tileMesh.count=this.tiles.length,this.tileMesh.receiveShadow=!0;let r=["#ffffff","#f6f5f2","#eeece8","#e9e7e2","#f9f8f6"],a=new G.Matrix4;this.tiles.forEach((n,i)=>{a.makeTranslation(n.x,.03,n.z),this.tileMesh.setMatrixAt(i,a),this.tileQr.push(new G.Color(r[Math.floor(p(i*3+5)*r.length)])),this.tileMesh.setColorAt(i,this.tileQr[i])}),this.group.add(this.tileMesh),this.buildSpeakers(),this.buildCaps(),this.update(0,0)}buildSpeakers(){let e=this.size,t=e/2,o=[[0,0],[0,e-7],[e-7,0]],s=[];this.ringMat=this.track(new G.MeshStandardMaterial({color:this.pal.accent,emissive:this.pal.accent,emissiveIntensity:0}));let r=this.track(new G.MeshStandardMaterial({color:"#2a2a34",roughness:.8})),a=this.track(new G.MeshStandardMaterial({color:"#3a3a46",roughness:.5,metalness:.3})),n=this.track(new G.CylinderGeometry(2,1.1,.35,32,1,!0)),i=this.track(new G.SphereGeometry(.75,20,10,0,Math.PI*2,0,Math.PI/2)),h=this.track(new G.TorusGeometry(2.25,.08,8,48));o.forEach(([c,u],f)=>{let E=u+3.5-t,d=c+3.5-t,g=new G.Vector3(E,0,d);s.push({matrix:new G.Matrix4().compose(new G.Vector3(E,tt/2,d),new G.Quaternion,new G.Vector3(6.9,tt,6.9)),color:this.pal.cabinet,delay:.18+f*.03,pivot:g});let m=tt,y=new G.Mesh(n,r);y.position.set(E,m-.1,d);let T=new G.Mesh(i,a);T.position.set(E,m-.25,d);let x=new G.Mesh(h,this.ringMat);x.rotation.x=Math.PI/2,x.position.set(E,m+.04,d),[y,T,x].forEach(k=>{k.visible=!1,this.group.add(k)}),this.woofers.push({cone:y,cap:T,ring:x,y:m})}),this.grow.add(new G.BoxGeometry(1,1,1),new G.MeshStandardMaterial({color:16777215,roughness:.55,metalness:.15}),s)}buildCaps(){this.capMat=this.track(new G.MeshStandardMaterial({color:this.pal.top,emissive:this.pal.top,emissiveIntensity:.45})),this.caps=new G.InstancedMesh(this.track(new G.BoxGeometry(.98,.1,.98)),this.capMat,Math.max(1,this.bars.length)),this.caps.count=this.bars.length,this.caps.visible=!1,this.group.add(this.caps)}applyLighting(e,t,o,s){se(e,this.pal.mood,t,o,s),this.slabMat.color.set(q.slab).lerp(new G.Color(this.pal.slab),e),this.barUniforms.uSide.value=G.MathUtils.smoothstep(e,.2,.8)}update(e,t){this.grow.update(e);let o=cr(t),s=G.MathUtils.smoothstep(e,.2,.8);this.barUniforms.uBeat.value=o*s;let r=new G.Color(this.pal.floor),a=new G.Color(this.pal.accent),n=new G.Color;for(let c=0;c<this.tiles.length;c++){let u=this.tiles[c];n.copy(r),(u.r+u.c)%2===0&&n.lerp(a,.18*o),n.lerp(this.tileQr[c],1-s),this.tileMesh.setColorAt(c,n)}this.tileMesh.instanceColor&&(this.tileMesh.instanceColor.needsUpdate=!0);let i=G.MathUtils.smoothstep(e,.45,.8);this.woofers.forEach(c=>{[c.cone,c.cap,c.ring].forEach(f=>f.visible=i>.01);let u=Math.max(.001,i);c.cone.scale.set(u*(1+o*.05),u,u*(1+o*.05)),c.cap.scale.setScalar(u),c.cap.position.y=c.y-.25+o*.18*i,c.ring.scale.setScalar(u)}),this.ringMat.emissiveIntensity=(.8+1.6*o)*i;let h=G.MathUtils.smoothstep(e,.8,1);if(this.caps.visible=h>.01,this.caps.visible){let c=new G.Matrix4,u=this.layout.barH;this.bars.forEach((f,E)=>{let d=this.level(f,t),g=this.modules[f];c.compose(new G.Vector3(g.c-this.layout.half+.5,u*G.MathUtils.lerp(1,d,G.MathUtils.smoothstep(e,.55,1))+.05,g.r-this.layout.half+.5),new G.Quaternion,new G.Vector3(h,h,h)),this.caps.setMatrixAt(E,c)}),this.caps.instanceMatrix.needsUpdate=!0}}dispose(){this.group.removeFromParent(),this.disposables.forEach(e=>e.dispose()),this.disposables=[]}};var R=te(oe(),1);var Ls={ambient:{color:"#fff4ea",intensity:1.2},sun:{color:"#fff2e0",intensity:2.5,position:[22,48,28]}},Ps={chocolate:{sponge:"#7a4a2e",cream:"#f3e2c8",glaze:"#3e2216",choc:"#4a2a1a",berry:"#c8303a",leaf:"#4f9a3a",macaron:["#e8a0b4","#f0d080","#a8d8b0"],rosette:"#8a5236",candle:["#f4f1ea","#d94a3a"],board:"#d8b45a",confetti:["#f25c8a","#ffd23f","#4fb8e8","#7cd67c","#b07cf0"],mood:Ls},strawberry:{sponge:"#f2d4a8",cream:"#fff0f3",glaze:"#e8708e",choc:"#c9a07a",berry:"#d8243a",leaf:"#5aa648",macaron:["#f4a8c0","#ffd2dc","#e86a8a"],rosette:"#f08aa8",candle:["#ffffff","#f4a8c0"],board:"#f4e6ea",confetti:["#f25c8a","#ffd2dc","#ffffff","#ff9ab8","#ffd23f"],mood:{ambient:{color:"#fff0f4",intensity:1.2},sun:{color:"#fff4f0",intensity:2.5,position:[22,48,28]}}},mint:{sponge:"#5a3a28",cream:"#e2f5ea",glaze:"#7fd0b0",choc:"#3a2418",berry:"#3a5fb0",leaf:"#3f9a5a",macaron:["#a8e0c8","#d8f0e4","#7fd0b0"],rosette:"#6cc7a2",candle:["#ffffff","#5fbf9a"],board:"#cfe8dc",confetti:["#7fd0b0","#ffffff","#4fb8e8","#ffd23f","#a8e0c8"],mood:{ambient:{color:"#f0fff8",intensity:1.2},sun:{color:"#f4fff8",intensity:2.5,position:[22,48,28]}}}},Bs=82,ve=[4.6,4,3.4];function fr(l,e){let t=e/2,o=(e-1)/2,s=Math.max(2,Math.floor(o-7)),r=Math.max(1,Math.round(s*.5)),a=[[0,e-1],[Math.round(o-s),Math.round(o+s)],[Math.round(o-r),Math.round(o+r)]],n=[ve[0],ve[0]+ve[1],ve[0]+ve[1]+ve[2]],i=new Uint8Array(e*e);for(let c=0;c<e;c++)for(let u=0;u<e;u++){let f=0;c>=a[1][0]&&c<=a[1][1]&&u>=a[1][0]&&u<=a[1][1]&&(f=1),c>=a[2][0]&&c<=a[2][1]&&u>=a[2][0]&&u<=a[2][1]&&(f=2),i[c*e+u]=f}let h=l.map((c,u)=>{let f=$(c.r,c.c,e);if(f){let[d,g]=f;return d===3&&g===3?"candle":d>=2&&d<=4&&g>=2&&g<=4?"rosette":"border"}let E=p(u*13+7);return E<.45?"choc":E<.75?"berry":"macaron"});return{size:e,half:t,tierOf:i,tierTop:n,bounds:a,kind:h}}function ur(l,e,t){return l.tierTop[l.tierOf[e*l.size+t]]}function Ut(l,e){let t=fr(l,e);return l.map(o=>{let s=ur(t,o.r,o.c);return{x:o.c-t.half+.5,y:s+.36,z:o.r-t.half+.5,scaleX:1.13,scaleY:.82,scaleZ:1.13}})}var rt=class{constructor(e,t,o,s){this.modules=e;this.matrix=t;this.size=o;this.layout=fr(e,o),this.pal=Ps[s],this.voxelMaterial=new R.MeshStandardMaterial({color:16777215,roughness:.35,metalness:.05}),this.targets=Ut(e,o),this.grow=new J(this.group,r=>this.track(r)),this.build()}group=new R.Group;voxelMaterial;targets;voxelSideWindow=[.6,.92];layout;pal;disposables=[];grow;tiles=[];tileMesh;tileQr=[];tileSide=[];slabMat;flames=[];flameMat;confetti;lastGrowth=-1;get maxHeight(){return this.layout.tierTop[2]+1.5}track(e){return this.disposables.push(e),e}decoColor(e){let t=this.layout.kind[e],o=this.pal;switch(t){case"choc":case"border":return o.choc;case"berry":return o.berry;case"macaron":return o.macaron[Math.floor(p(e*3+1)*o.macaron.length)];case"rosette":return o.rosette;case"candle":return o.candle[1]}}voxelColor(e){let t=this.decoColor(e);return{qr:j(t,Bs+(p(e*5+17)-.5)*12),side:t}}rise(e,t){return R.MathUtils.smoothstep(t,.06+e*.13,.5+e*.13)}surface(e,t,o){let s=this.layout,r=s.tierOf[e*this.size+t],a=0;for(let n=0;n<=r;n++)a=Math.max(a,s.tierTop[n]*this.rise(n,o));return a}voxelBase(e,t){let o=this.modules[e];return this.surface(o.r,o.c,t)}detailDelay(e,t){return Math.min(.9,.55+e*.12+p(t)*.04)}growDelay(e){let t=this.modules[e];return .12+this.layout.tierOf[t.r*this.size+t.c]*.12+p(e*7+3)*.08}voxelSideScale(e){let t=this.layout.kind[e];return t==="choc"||t==="border"?[.62,.72,.62]:[0,0,0]}cellTopOf(e){let t=this.modules[e];return new R.Vector3(t.c-this.layout.half+.5,ur(this.layout,t.r,t.c),t.r-this.layout.half+.5)}build(){let e=this.size,t=e/2,o=e+2.4;this.slabMat=this.track(new R.MeshStandardMaterial({color:q.slab,roughness:.4,metalness:.3}));let s=new R.Mesh(this.track(new R.BoxGeometry(o,.9,o)),this.slabMat);s.position.y=-.45,s.receiveShadow=!0,this.group.add(s);for(let a=0;a<e;a++)for(let n=0;n<e;n++)this.matrix[a][n]||this.tiles.push({x:n-t+.5,z:a-t+.5,r:a,c:n});this.tileMesh=new R.InstancedMesh(this.track(new R.BoxGeometry(1,.06,1)),this.track(new R.MeshStandardMaterial({color:16777215,roughness:.6})),Math.max(1,this.tiles.length)),this.tileMesh.count=this.tiles.length,this.tileMesh.receiveShadow=!0;let r=["#ffffff","#f6f5f2","#eeece8","#e9e7e2","#f9f8f6"];this.tiles.forEach((a,n)=>{this.tileQr.push(new R.Color(r[Math.floor(p(n*3+5)*r.length)])),this.tileSide.push(new R.Color(this.pal.cream).multiplyScalar(.97+p(n*7+2)*.05))}),this.group.add(this.tileMesh),this.buildTiers(),this.buildDecorations(),this.buildCandles(),this.buildConfetti(),this.update(0,0)}buildTiers(){let e=this.layout,t=e.half,o=[],s=[],r=[],a=[],n=[],i=[],h=(c,u,f,E,d,g)=>new R.Matrix4().compose(new R.Vector3((c+u)/2,(f+E)/2,(d+g)/2),new R.Quaternion,new R.Vector3(u-c,E-f,g-d));e.bounds.forEach(([c,u],f)=>{let E=c-t,d=u+1-t,g=f===0?0:e.tierTop[f-1],m=e.tierTop[f],y=m-g,T=this.detailDelay(f,f*7+1)+.04,x=new R.Vector3((E+d)/2,g,(E+d)/2);s.push(f),o.push({matrix:h(E+.04,d-.04,g,m-.12,E+.04,d-.04),color:this.pal.sponge,delay:T,pivot:x});for(let v of[.33,.66]){let I=g+y*v;r.push(f),a.push({matrix:h(E+.02,d-.02,I-.07,I+.07,E+.02,d-.02),color:this.pal.cream,delay:T,pivot:x})}r.push(f),a.push({matrix:h(E,d,m-.14,m-.005,E,d),color:this.pal.cream,delay:T+.03,pivot:x});let k=m-.1;[[E,d,E,E],[E,d,d,d],[E,E,E,d],[d,d,E,d]].forEach(([v,I,P,V],A)=>{let O=Math.max(Math.abs(I-v),Math.abs(V-P)),ee=Math.round(O/.5);for(let W=0;W<=ee;W++){let ue=W/ee,ae=v+(I-v)*ue,Ae=P+(V-P)*ue,de=A===0?[0,-1]:A===1?[0,1]:A===2?[-1,0]:[1,0],B=f*1e3+A*100+W,K=.15+p(B)*.55,Y=new R.Vector3(ae+de[0]*.03,k-K/2,Ae+de[1]*.03);n.push({matrix:new R.Matrix4().compose(Y,new R.Quaternion,new R.Vector3(de[0]?.08:.26,K,de[1]?.08:.26)),color:this.pal.glaze,delay:T+.08,pivot:new R.Vector3(ae,k,Ae)});let Ee=new R.Vector3(ae+de[0]*.02,m+.06,Ae+de[1]*.02);i.push({matrix:new R.Matrix4().compose(Ee,new R.Quaternion,new R.Vector3(.2,.2,.2)),color:this.pal.cream,delay:T+.1,pivot:Ee.clone()})}let U=.07;n.push({matrix:A<2?h(E-U,d+U,k-.06,k+.08,(A?d:E)-U,(A?d:E)+U):h((A===3?d:E)-U,(A===3?d:E)+U,k-.06,k+.08,E-U,d+U),color:this.pal.glaze,delay:T+.06,pivot:new R.Vector3((E+d)/2,k,(E+d)/2)})})}),this.addTierMesh(new R.BoxGeometry(1,1,1),new R.MeshStandardMaterial({color:16777215,roughness:.9}),o,s),this.addTierMesh(new R.BoxGeometry(1,1,1),new R.MeshStandardMaterial({color:16777215,roughness:.7}),a,r),this.grow.add(new R.BoxGeometry(1,1,1),new R.MeshStandardMaterial({color:16777215,roughness:.2,metalness:.05}),n,!1),this.grow.add(new R.SphereGeometry(.5,10,8),new R.MeshStandardMaterial({color:16777215,roughness:.6}),i,!1)}tierSets=[];addTierMesh(e,t,o,s){let r=new R.InstancedMesh(this.track(e),this.track(t),Math.max(1,o.length));r.count=o.length,r.castShadow=!0,r.receiveShadow=!0;let a=new R.Color;o.forEach((n,i)=>r.setColorAt(i,a.set(n.color))),r.instanceColor&&(r.instanceColor.needsUpdate=!0),this.group.add(r),this.tierSets.push({mesh:r,base:o.map(n=>n.matrix),tier:s})}updateTiers(e){let t=new R.Matrix4,o=new R.Matrix4;for(let s of this.tierSets){let r=!1;for(let a=0;a<s.base.length;a++){let n=this.rise(s.tier[a],e);n>.001&&(r=!0),t.makeScale(1,Math.max(1e-4,n),1),o.copy(t).multiply(s.base[a]),s.mesh.setMatrixAt(a,o)}s.mesh.visible=r,s.mesh.instanceMatrix.needsUpdate=!0}}buildDecorations(){let e=this.layout,t=[],o=[],s=[],r=[],a=[];this.modules.forEach((n,i)=>{let h=e.kind[i],c=this.cellTopOf(i),u=this.detailDelay(e.tierOf[this.modules[i].r*this.size+this.modules[i].c],i*3+2),f=c.clone();if(h==="berry"){let E=c.clone().setY(c.y+.26);t.push({matrix:new R.Matrix4().compose(E,new R.Quaternion().setFromEuler(new R.Euler(.3,p(i)*3,0)),new R.Vector3(.62,.56,.62)),color:this.pal.berry,delay:u,pivot:f}),o.push({matrix:new R.Matrix4().compose(E.clone().setY(E.y+.27),new R.Quaternion().setFromEuler(new R.Euler(0,p(i+1)*3,0)),new R.Vector3(.36,.12,.36)),color:this.pal.leaf,delay:u+.03,pivot:f})}else if(h==="macaron"){let E=this.decoColor(i),d=new R.Quaternion().setFromEuler(new R.Euler((p(i+2)-.5)*.4,0,(p(i+3)-.5)*.4));s.push({matrix:new R.Matrix4().compose(c.clone().setY(c.y+.1),d,new R.Vector3(.74,.17,.74)),color:E,delay:u,pivot:f}),r.push({matrix:new R.Matrix4().compose(c.clone().setY(c.y+.23),d,new R.Vector3(.66,.09,.66)),color:this.pal.cream,delay:u,pivot:f}),s.push({matrix:new R.Matrix4().compose(c.clone().setY(c.y+.35),d,new R.Vector3(.74,.17,.74)),color:E,delay:u,pivot:f})}else h==="rosette"&&(a.push({matrix:new R.Matrix4().compose(c.clone().setY(c.y+.2),new R.Quaternion().setFromEuler(new R.Euler(0,p(i)*3,0)),new R.Vector3(.7,.4,.7)),color:this.pal.rosette,delay:u,pivot:f}),a.push({matrix:new R.Matrix4().compose(c.clone().setY(c.y+.5),new R.Quaternion().setFromEuler(new R.Euler(0,p(i+5)*3,0)),new R.Vector3(.36,.3,.36)),color:this.pal.rosette,delay:u+.03,pivot:f}))}),this.grow.add(new R.SphereGeometry(.5,12,10),new R.MeshStandardMaterial({color:16777215,roughness:.35}),t),this.grow.add(new R.CylinderGeometry(.5,.2,1,6),new R.MeshStandardMaterial({color:16777215,roughness:.7}),o,!1),this.grow.add(new R.CylinderGeometry(.5,.5,1,18),new R.MeshStandardMaterial({color:16777215,roughness:.55}),s),this.grow.add(new R.CylinderGeometry(.5,.5,1,18),new R.MeshStandardMaterial({color:16777215,roughness:.7}),r,!1),this.grow.add(new R.ConeGeometry(.5,1,8),new R.MeshStandardMaterial({color:16777215,roughness:.6,flatShading:!0}),a)}buildCandles(){let e=this.layout,t=[];this.flameMat=this.track(new R.MeshStandardMaterial({color:"#ffd27a",emissive:"#ff9a2a",emissiveIntensity:0,transparent:!0,opacity:.95}));let o=this.track(new R.ConeGeometry(.2,.62,12));this.modules.forEach((s,r)=>{if(e.kind[r]!=="candle")return;let a=this.cellTopOf(r),n=this.detailDelay(0,r*5+4);for(let h=0;h<8;h++)t.push({matrix:new R.Matrix4().compose(a.clone().setY(a.y+.16+h*.32),new R.Quaternion,new R.Vector3(.6,.32,.6)),color:this.pal.candle[h%2],delay:n+h*.01,pivot:a.clone()});let i=new R.Mesh(o,this.flameMat);i.position.set(a.x,a.y+2.95,a.z),i.visible=!1,this.group.add(i),this.flames.push(i)}),this.grow.add(new R.CylinderGeometry(.5,.5,1,14),new R.MeshStandardMaterial({color:16777215,roughness:.6}),t)}buildConfetti(){this.confetti=new R.InstancedMesh(this.track(new R.BoxGeometry(.22,.03,.14)),this.track(new R.MeshStandardMaterial({color:16777215,roughness:.6})),80);let t=new R.Color;for(let o=0;o<80;o++)this.confetti.setColorAt(o,t.set(this.pal.confetti[o%this.pal.confetti.length]));this.confetti.visible=!1,this.group.add(this.confetti)}applyLighting(e,t,o,s){se(e,this.pal.mood,t,o,s),this.slabMat.color.set(q.slab).lerp(new R.Color(this.pal.board),e)}update(e,t){if(e!==this.lastGrowth){this.lastGrowth=e,this.grow.update(e),this.updateTiers(e);let r=new R.Matrix4,a=new R.Color,n=R.MathUtils.smoothstep(e,.1,.65);this.tiles.forEach((i,h)=>{r.makeTranslation(i.x,this.surface(i.r,i.c,e)+.03,i.z),this.tileMesh.setMatrixAt(h,r),a.copy(this.tileQr[h]).lerp(this.tileSide[h],n),this.tileMesh.setColorAt(h,a)}),this.tileMesh.instanceMatrix.needsUpdate=!0,this.tileMesh.instanceColor&&(this.tileMesh.instanceColor.needsUpdate=!0)}let o=R.MathUtils.smoothstep(e,.75,1);this.flameMat.emissiveIntensity=2.2*o,this.flames.forEach((r,a)=>{r.visible=o>.01;let n=1+Math.sin(t*13+a*2)*.08+Math.sin(t*23+a)*.05;r.scale.set(o*(1+Math.sin(t*9+a)*.06),o*n,o*(1+Math.cos(t*9+a)*.06)),r.rotation.z=Math.sin(t*4+a)*.08});let s=R.MathUtils.clamp((e-.85)/.15,0,1);if(this.confetti.visible=s>0,this.confetti.visible){let r=new R.Object3D,a=this.size+2,n=this.layout.tierTop[2]+5;for(let i=0;i<this.confetti.count;i++){let h=n-(t*(.5+p(i)*.6)+p(i+50)*n)%n;r.position.set((p(i+1)-.5)*a+Math.sin(t+i)*.4,h,(p(i+2)-.5)*a+Math.cos(t*.8+i)*.4),r.rotation.set(t*(1+p(i+3))+i,t*.7+i,Math.sin(t+i)),r.scale.setScalar(s),r.updateMatrix(),this.confetti.setMatrixAt(i,r.matrix)}this.confetti.instanceMatrix.needsUpdate=!0}}dispose(){this.group.removeFromParent(),this.disposables.forEach(e=>e.dispose()),this.disposables=[]}};var H=te(oe(),1);var Vs={day:{stone:["#b8ab94","#a89c86","#c4b8a2","#9e937e"],roof:"#b5453a",courtyard:"#cfc6b4",water:"#3f8fb0",slab:"#6f8a4a",banners:["#c0392b","#2f5fb0","#d8a92a"],snow:!1,night:0,mood:{ambient:{color:"#ffffff",intensity:1.2},sun:{color:"#fff2dc",intensity:2.6,position:[22,48,28]}}},night:{stone:["#8a90a4","#7e8498","#969cb0","#767c8e"],roof:"#6a2f3a",courtyard:"#666b7a",water:"#1f3550",slab:"#3a4a3a",banners:["#c0392b","#2f5fb0","#d8a92a"],snow:!1,night:1,mood:{ambient:{color:"#8a98d8",intensity:1.15},sun:{color:"#b8c4ff",intensity:1.3,position:[-20,40,10]}}},winter:{stone:["#a9adb5","#9a9fa8","#b5b9c0","#8f949e"],roof:"#8a3a3a",courtyard:"#eef2f6",water:"#a9c9da",slab:"#e6eef4",banners:["#c0392b","#2f5fb0","#d8a92a"],snow:!0,night:0,mood:{ambient:{color:"#e8f0ff",intensity:1.25},sun:{color:"#f0f4ff",intensity:2.3,position:[30,32,20]}}}},As=92,dr=.4;function pr(l,e){let t=e/2,o=new Set(l.map(i=>i.r*e+i.c)),s=(i,h)=>i>=0&&h>=0&&i<e&&h<e&&o.has(i*e+h),r=[],a=[],n=[];return l.forEach((i,h)=>{let c=$(i.r,i.c,e);if(c){let[g,m,y]=c;n.push(y),g>=2&&g<=4&&m>=2&&m<=4?(r.push(g===3&&m===3?"keepTop":"keep"),a.push(5.2)):(r.push("ring"),a.push(3.2));return}if(n.push(-1),!s(i.r-1,i.c)&&!s(i.r+1,i.c)&&!s(i.r,i.c-1)&&!s(i.r,i.c+1)){r.push("house"),a.push(1.2);return}r.push("wall");let f=Math.hypot(i.c-t+.5,i.r-t+.5)/(t*.95),d=1.6+Math.pow(Math.max(0,1-f),1.3)*3.2+(p(h*7+1)<.1?.8:0);a.push(Math.round(d/dr)*dr)}),{size:e,half:t,kind:r,height:a,tower:n,maxH:Math.max(...a)}}function Nt(l,e){let t=pr(l,e);return l.map((o,s)=>{let r=t.height[s];return{x:o.c-t.half+.5,y:r/2,z:o.r-t.half+.5,scaleX:1.13,scaleY:r/.88,scaleZ:1.13}})}function Er(l){let e=l??{uSide:{value:0}},t=new H.MeshStandardMaterial({color:16777215,roughness:.92,metalness:0});return t.onBeforeCompile=o=>{Object.assign(o.uniforms,e),o.vertexShader=`varying vec3 vStonePos;\nvarying vec3 vStoneN;\n`+o.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>\n        vec4 stoneWp = vec4(transformed, 1.0);\n        vec3 stoneN = objectNormal;\n        #ifdef USE_INSTANCING\n          stoneWp = instanceMatrix * stoneWp;\n          stoneN = mat3(instanceMatrix) * stoneN;\n        #endif\n        vStonePos = (modelMatrix * stoneWp).xyz;\n        vStoneN = normalize(mat3(modelMatrix) * stoneN);`),o.fragmentShader=`varying vec3 vStonePos;\nvarying vec3 vStoneN;\nuniform float uSide;\n`+o.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>\n        float stSide = 1.0 - step(0.5, abs(vStoneN.y));\n        float stU = abs(vStoneN.x) > 0.5 ? vStonePos.z : vStonePos.x;\n        float row = floor(vStonePos.y / 0.22);\n        float brickU = stU * 2.4 + mod(row, 2.0) * 0.5;\n        float mortar = (1.0 - step(0.08, fract(vStonePos.y / 0.22))) + (1.0 - step(0.06, fract(brickU)));\n        float shade = 0.9 + 0.12 * fract(sin(dot(vec2(floor(brickU), row), vec2(12.9898, 78.233))) * 43758.5453);\n        vec3 brick = diffuseColor.rgb * shade * mix(1.0, 0.62, clamp(mortar, 0.0, 1.0));\n        diffuseColor.rgb = mix(diffuseColor.rgb, brick, stSide * uSide);`)},t.customProgramCacheKey=()=>"qr-castle-stone",{material:t,uniforms:e}}var st=class{constructor(e,t,o,s){this.modules=e;this.matrix=t;this.size=o;this.layout=pr(e,o),this.pal=Vs[s];let r=Er();this.voxelMaterial=r.material,this.stoneUniforms=r.uniforms,this.targets=Nt(e,o),this.grow=new J(this.group,a=>this.track(a)),this.build()}group=new H.Group;voxelMaterial;targets;voxelSideWindow=[.6,.9];stoneUniforms;layout;pal;disposables=[];grow;tiles=[];tileMesh;tileQr=[];tileSide=[];slabMat;glowMats=[];flags=[];snowfall=null;lastGrowth=-1;get maxHeight(){return this.layout.maxH+3.4}track(e){return this.disposables.push(e),e}stoneColor(e){let t=this.modules[e],o=Math.floor(t.r/4)*97+Math.floor(t.c/4)*31;return this.pal.stone[Math.floor(p(o+3)*this.pal.stone.length)]}voxelColor(e){let t=this.layout.kind[e],o=this.stoneColor(e),s=o;return t==="house"&&(s=this.pal.roof),(t==="keepTop"||t==="keep")&&(s=this.pal.banners[this.layout.tower[e]]),{qr:j(s,As+(p(e*5+17)-.5)*12),side:o}}growDelay(e){return .04+this.layout.height[e]/this.layout.maxH*.32+p(e*7+3)*.05}voxelSideScale(e){return this.layout.kind[e]==="house"?[0,0,0]:[1,1,1]}top(e){let t=this.modules[e];return new H.Vector3(t.c-this.layout.half+.5,this.layout.height[e],t.r-this.layout.half+.5)}detailDelay(e){return Math.min(.9,.58+p(e*11+5)*.12)}build(){let e=this.size,t=e/2,o=e+2.4;this.slabMat=this.track(new H.MeshStandardMaterial({color:q.slab,roughness:.9}));let s=new H.Mesh(this.track(new H.BoxGeometry(o,.9,o)),this.slabMat);s.position.y=-.45,s.receiveShadow=!0,this.group.add(s);for(let n=0;n<e;n++)for(let i=0;i<e;i++)this.matrix[n][i]||this.tiles.push({x:i-t+.5,z:n-t+.5,r:n,c:i});this.tileMesh=new H.InstancedMesh(this.track(new H.BoxGeometry(1,.06,1)),this.track(new H.MeshStandardMaterial({color:16777215,roughness:.95})),Math.max(1,this.tiles.length)),this.tileMesh.count=this.tiles.length,this.tileMesh.receiveShadow=!0;let r=["#ffffff","#f6f5f2","#eeece8","#e9e7e2","#f9f8f6"],a=new H.Matrix4;this.tiles.forEach((n,i)=>{a.makeTranslation(n.x,.03,n.z),this.tileMesh.setMatrixAt(i,a),this.tileQr.push(new H.Color(r[Math.floor(p(i*3+5)*r.length)])),this.tileSide.push(new H.Color(this.pal.courtyard).multiplyScalar(.9+p(i*7+2)*.14)),this.tileMesh.setColorAt(i,this.tileQr[i])}),this.group.add(this.tileMesh),this.buildBattlements(),this.buildHouses(),this.buildKeeps(),this.buildWindowsAndTorches(),this.buildMoat(),this.pal.snow&&this.buildSnow(),this.update(0,0)}buildBattlements(){let e=this.layout,t=this.size,o=new Map;this.modules.forEach((a,n)=>o.set(a.r*t+a.c,e.height[n]));let s=[],r=[];this.modules.forEach((a,n)=>{let i=e.kind[n];if(i!=="wall"&&i!=="ring")return;let h=this.top(n),c=e.height[n],u=this.detailDelay(n),f=this.stoneColor(n);this.pal.snow&&r.push({matrix:new H.Matrix4().compose(h.clone().setY(c+.04),new H.Quaternion,new H.Vector3(1,.08,1)),color:"#f6f9fc",delay:u,pivot:h.clone()});for(let[E,d]of[[0,1],[0,-1],[1,0],[-1,0]])if(!((o.get((a.r+E)*t+(a.c+d))??0)>=c))for(let m of[-.25,.25]){let y=new H.Vector3(h.x+(d!==0?d*.39:m),c+.16,h.z+(E!==0?E*.39:m));s.push({matrix:new H.Matrix4().compose(y,new H.Quaternion,new H.Vector3(d!==0?.2:.26,.32,E!==0?.2:.26)),color:f,delay:u,pivot:y.clone().setY(c)}),this.pal.snow&&r.push({matrix:new H.Matrix4().compose(y.clone().setY(c+.35),new H.Quaternion,new H.Vector3(d!==0?.22:.28,.06,E!==0?.22:.28)),color:"#f6f9fc",delay:u,pivot:y.clone().setY(c)})}}),this.grow.add(new H.BoxGeometry(1,1,1),Er(this.stoneUniforms).material,s),r.length&&this.grow.add(new H.BoxGeometry(1,1,1),new H.MeshStandardMaterial({color:16777215,roughness:.9}),r,!1)}buildHouses(){let e=this.layout,t=[],o=[];this.modules.forEach((s,r)=>{if(e.kind[r]!=="house")return;let a=this.modules[r],n=new H.Vector3(a.c-e.half+.5,0,a.r-e.half+.5),i=Math.min(.8,this.growDelay(r)+.3);t.push({matrix:new H.Matrix4().compose(n.clone().setY(.45),new H.Quaternion,new H.Vector3(.82,.9,.82)),color:this.pal.snow?"#e4dccb":"#e8dcc2",delay:i,pivot:n.clone()}),t.push({matrix:new H.Matrix4().compose(n.clone().add(new H.Vector3(0,.25,.42)),new H.Quaternion,new H.Vector3(.24,.42,.04)),color:"#6a4a32",delay:i,pivot:n.clone()}),o.push({matrix:new H.Matrix4().compose(n.clone().setY(.9+.3),new H.Quaternion().setFromEuler(new H.Euler(0,Math.PI/4,0)),new H.Vector3(.7,.6,.7)),color:this.pal.snow?"#f4f8fb":this.pal.roof,delay:i+.05,pivot:n.clone()})}),this.grow.add(new H.BoxGeometry(1,1,1),new H.MeshStandardMaterial({color:16777215,roughness:.85}),t),this.grow.add(new H.CylinderGeometry(0,1,1,4),new H.MeshStandardMaterial({color:16777215,roughness:.8}),o)}buildKeeps(){let e=this.layout,t=e.half,o=[],s=this.size;[[0,0],[0,s-7],[s-7,0]].forEach(([n,i],h)=>{let c=i+3.5-t,u=n+3.5-t,f=5.2,E=new H.Vector3(c,f+1.1,u);o.push({matrix:new H.Matrix4().compose(E,new H.Quaternion().setFromEuler(new H.Euler(0,Math.PI/4,0)),new H.Vector3(1.5*Math.SQRT2,2.2,1.5*Math.SQRT2)),color:this.pal.banners[h],delay:.62+h*.03,pivot:new H.Vector3(c,f,u)}),this.addFlag(new H.Vector3(c,f+2.15,u),this.pal.banners[h],.7+h*.03)});let a=-1;this.modules.forEach((n,i)=>{e.kind[i]==="wall"&&(a<0||e.height[i]>e.height[a])&&(a=i)}),a>=0&&this.addFlag(this.top(a),this.pal.banners[0],.72),this.grow.add(new H.CylinderGeometry(0,1,1,4),new H.MeshStandardMaterial({color:16777215,roughness:.6}),o)}addFlag(e,t,o){let s=new H.Mesh(this.track(new H.CylinderGeometry(.04,.04,1.4,6)),this.track(new H.MeshStandardMaterial({color:"#4a4a52",roughness:.5}))),r=new H.Mesh(this.track(new H.BoxGeometry(.7,.42,.03)),this.track(new H.MeshStandardMaterial({color:t,roughness:.7,side:H.DoubleSide})));[s,r].forEach(a=>{a.visible=!1,a.castShadow=!0,this.group.add(a)}),this.flags.push({pole:s,cloth:r,base:e.clone(),delay:o})}buildWindowsAndTorches(){let e=this.layout,t=this.size,o=new Set(this.modules.map(h=>h.r*t+h.c)),s=this.track(new H.MeshStandardMaterial({color:"#2a2a32",emissive:"#ffb84a",emissiveIntensity:0,roughness:.4})),r=this.track(new H.MeshStandardMaterial({color:"#ffd27a",emissive:"#ff8a2a",emissiveIntensity:0}));this.glowMats.push(s,r);let a=[],n=[],i=[];this.modules.forEach((h,c)=>{let u=e.kind[c],f=e.height[c],E=this.top(c),d=this.detailDelay(c);if((u==="keep"||u==="ring"||u==="wall"&&f>=3)&&p(c*13+2)<.55)for(let[g,m]of[[0,1],[0,-1],[1,0],[-1,0]]){if(o.has((h.r+g)*t+(h.c+m)))continue;let y=Math.min(f-.6,1+p(c+g*3+m)*(f-1.6)),T=new H.Vector3(E.x+m*.5,y,E.z+g*.5);a.push({matrix:new H.Matrix4().compose(T,new H.Quaternion,new H.Vector3(m?.04:.18,.3,g?.04:.18)),color:"#ffffff",delay:d,pivot:T.clone()})}if((u==="wall"||u==="ring")&&p(c*19+7)<.12){let g=E.clone().setY(f+.25);n.push({matrix:new H.Matrix4().compose(g,new H.Quaternion,new H.Vector3(.06,.5,.06)),color:"#5a3d28",delay:d,pivot:E.clone()}),i.push({matrix:new H.Matrix4().compose(g.clone().setY(f+.58),new H.Quaternion,new H.Vector3(.14,.2,.14)),color:"#ffffff",delay:d+.03,pivot:E.clone()})}}),this.grow.add(new H.BoxGeometry(1,1,1),s,a,!1),this.pal.night&&(this.grow.add(new H.BoxGeometry(1,1,1),new H.MeshStandardMaterial({color:16777215,roughness:.8}),n,!1),this.grow.add(new H.ConeGeometry(.5,1,8),r,i,!1))}buildMoat(){let e=this.size,t=e/2,o=1.1,s=[],r=t+o/2+.02,a=e+2*o;[[0,-r,a,o],[0,r,a,o],[-r,0,o,e],[r,0,o,e]].forEach(([c,u,f,E])=>{let d=new H.Vector3(c,.02,u);s.push({matrix:new H.Matrix4().compose(d,new H.Quaternion,new H.Vector3(f,.05,E)),color:this.pal.water,delay:.55,pivot:d.clone()})});let i=[],h=new H.Vector3(0,.12,r);i.push({matrix:new H.Matrix4().compose(h,new H.Quaternion,new H.Vector3(1.6,.12,o+.4)),color:"#7a5634",delay:.68,pivot:h.clone()}),this.grow.add(new H.BoxGeometry(1,1,1),new H.MeshStandardMaterial({color:16777215,roughness:.2,metalness:.05}),s,!1),this.grow.add(new H.BoxGeometry(1,1,1),new H.MeshStandardMaterial({color:16777215,roughness:.85}),i)}buildSnow(){this.snowfall=new H.InstancedMesh(this.track(new H.BoxGeometry(.09,.09,.09)),this.track(new H.MeshStandardMaterial({color:"#ffffff"})),110),this.snowfall.visible=!1,this.group.add(this.snowfall)}applyLighting(e,t,o,s){se(e,this.pal.mood,t,o,s),this.slabMat.color.set(q.slab).lerp(new H.Color(this.pal.slab),e),this.stoneUniforms.uSide.value=H.MathUtils.smoothstep(e,.2,.8);let r=this.pal.night*H.MathUtils.smoothstep(e,.6,1);this.glowMats.forEach(a=>a.emissiveIntensity=2.4*r)}update(e,t){if(e!==this.lastGrowth){this.lastGrowth=e,this.grow.update(e);let o=H.MathUtils.smoothstep(e,.1,.65),s=new H.Color;for(let r=0;r<this.tiles.length;r++)s.copy(this.tileQr[r]).lerp(this.tileSide[r],o),this.tileMesh.setColorAt(r,s);this.tileMesh.instanceColor&&(this.tileMesh.instanceColor.needsUpdate=!0)}if(this.flags.forEach((o,s)=>{let r=H.MathUtils.clamp((e-o.delay)/(1-o.delay),0,1);o.pole.visible=o.cloth.visible=r>.01,o.pole.position.set(o.base.x,o.base.y+.7*r,o.base.z),o.pole.scale.set(1,Math.max(.001,r),1);let a=Math.sin(t*3+s)*.25;o.cloth.position.set(o.base.x+.36*r,o.base.y+1.2*r,o.base.z),o.cloth.rotation.set(0,a,Math.sin(t*5+s)*.05),o.cloth.scale.set(Math.max(.001,r),Math.max(.001,r),1)}),this.snowfall){let o=H.MathUtils.clamp((e-.85)/.15,0,1);if(this.snowfall.visible=o>0,o>0){let s=new H.Object3D,r=this.size+2,a=this.layout.maxH+6;for(let n=0;n<this.snowfall.count;n++){let i=a-(t*(.5+p(n)*.5)+p(n+50)*a)%a;s.position.set((p(n+1)-.5)*r+Math.sin(t+n)*.3,i,(p(n+2)-.5)*r),s.scale.setScalar(o),s.updateMatrix(),this.snowfall.setMatrixAt(n,s.matrix)}this.snowfall.instanceMatrix.needsUpdate=!0}}}dispose(){this.group.removeFromParent(),this.disposables.forEach(e=>e.dispose()),this.disposables=[]}};function mr(l,e,t,o){if(l==="tree"&&o&&o.length===e)return Bt(o,t);if(l==="city"&&o&&o.length===e)return $o(o,t);if(l==="island"&&o&&o.length===e)return nr(o,t);if(l==="maze"&&o&&o.length===e)return lr(o,t);if(l==="equalizer"&&o&&o.length===e)return Dt(o,t);if(l==="cake"&&o&&o.length===e)return Ut(o,t);if(l==="castle"&&o&&o.length===e)return Nt(o,t);let s=[],r=1;switch(l){case"tree":{let i=t*.7,h=i*.36,c=i-h,u=.5,f=Math.max(12,Math.floor(e*.16));for(let T=0;T<f;T++){let x=T/(f-1||1),k=u+x*h,L=x<.28?1.35:Math.max(.75,1.05-x*.3),v=T*2.39996,I=T%3*.35*L,P=Math.cos(v)*I,V=Math.sin(v)*I;s.push({x:P,y:k,z:V,scaleX:.92,scaleY:.92,scaleZ:.92})}let E=Math.max(10,Math.floor(e*.12)),d=[.1,Math.PI*.65,Math.PI*1.32,Math.PI*.32];for(let T=0;T<E;T++){let x=T%d.length,k=d[x]+Math.floor(T/d.length)*.12,L=Math.floor(T/d.length)/Math.max(1,Math.floor(E/d.length)),v=u+h*.72+L*(h*.55),I=(L*.75+.25)*(t*.23),P=Math.cos(k)*I,V=Math.sin(k)*I;s.push({x:P,y:v,z:V,scaleX:.9,scaleY:.9,scaleZ:.9})}let g=Math.max(8,Math.floor(e*.08));for(let T=0;T<g;T++){let x=T*1.37,k=1.4+T%5*1.4;s.push({x:Math.cos(x)*k,y:u+T%2*.2,z:Math.sin(x)*k,scaleX:.85,scaleY:.6,scaleZ:.85})}let m=e-s.length,y=[{cx:0,cy:u+h+c*.55,cz:0,rx:t*.35,ry:c*.48,rz:t*.35},{cx:3.2,cy:u+h+c*.42,cz:2.2,rx:t*.25,ry:c*.38,rz:t*.25},{cx:-3.2,cy:u+h+c*.46,cz:1.8,rx:t*.26,ry:c*.4,rz:t*.26},{cx:.6,cy:u+h+c*.38,cz:-3.2,rx:t*.27,ry:c*.36,rz:t*.27}];for(let T=0;T<m;T++){let x=y[T%y.length],k=Math.floor(T/y.length),L=Math.max(1,Math.floor(m/y.length)),v=Math.acos(1-2*(k/L)),I=T*2.39996,P=.62+.38*(T*23%100/100),V=x.cx+Math.sin(v)*Math.cos(I)*x.rx*P,A=x.cy+Math.cos(v)*x.ry*P,O=x.cz+Math.sin(v)*Math.sin(I)*x.rz*P;s.push({x:V,y:A,z:O,scaleX:.95,scaleY:.95,scaleZ:.95})}break}case"phone":{let i=t*.72,h=i*.52,c=h/2,u=i/2,f=r+u,E=Math.floor(h/.88),d=Math.floor(i/.88),g=0;for(let m=0;m<d&&g<e;m++)for(let y=0;y<E&&g<e;y++){let T=(y/(E-1||1)-.5)*2,x=(m/(d-1||1)-.5)*2;if(Math.pow(T,4)+Math.pow(x,4)<=1){let L=T*c,v=f-x*u,I=Math.abs(T)<.28&&Math.abs(x- -.72)<.08,P=I?.8:0;s.push({x:L,y:v,z:P,scaleX:I?1.05:.92,scaleY:I?1.05:.92,scaleZ:I?1.2:.85}),g++}}for(;s.length<e;){let m=s.length/e*Math.PI*2;s.push({x:Math.cos(m)*c*.92,y:f+Math.sin(m)*u*.92,z:-.6,scaleX:.88,scaleY:.88,scaleZ:1.1})}break}case"city":{let i=Math.ceil(Math.sqrt(e)),h=t*.8/i,c=i*h/2,u=t*.55;for(let f=0;f<e;f++){let E=Math.floor(f/i),d=f%i,g=Math.sin(E*12.9898+d*78.233)*43758.5453,m=g-Math.floor(g),y=Math.hypot(d-i/2,E-i/2)/(i/2),T=Math.max(0,1-y),x=(.2+m*.8)*(1+T*2),k=d*h-c,L=E*h-c,v=Math.max(1.2,x*u),I=.88*v/2+.05;s.push({x:k,y:I,z:L,scaleX:.88,scaleY:v,scaleZ:.88})}break}case"crystal":{let h=t*.65/2,c=t*.35,u=r+h;for(let f=0;f<e;f++){let E=Math.acos(-1+2*f/e),d=Math.sqrt(e*Math.PI)*E,g=.84+.22*Math.cos(d*4),m=c*Math.sin(E)*g,y=m*Math.cos(d),T=m*Math.sin(d),x=u+Math.cos(E)*h;s.push({x:y,y:x,z:T,scaleX:.95,scaleY:.95,scaleZ:.95})}break}case"pyramid":{let h=t*.42/8,c=0;for(let u=0;u<8&&c<e;u++){let f=8-u,E=(u+.5)*h+.05;for(let d=-f;d<=f&&c<e;d++)for(let g=-f;g<=f&&c<e;g++)if(Math.abs(d)===f||Math.abs(g)===f||u===0){let m=g*(t*.048),y=d*(t*.048);s.push({x:m,y:E,z:y,scaleX:.95,scaleY:.95,scaleZ:.95}),c++}}for(;s.length<e;){let u=Math.floor(Math.random()*8),f=Math.max(1,8-u),E=(Math.random()*2-1)*f,d=(Math.random()*2-1)*f;s.push({x:d*(t*.048),y:(u+.5)*h+.05,z:E*(t*.048),scaleX:.95,scaleY:.95,scaleZ:.95})}break}case"heart":{let i=t*.62,h=i*.96,c=r;for(let u=0;u<e;u++){let f=u/e*Math.PI*2,E=u*7%e/e,d=(E-.5)*(t*.22),g=16*Math.pow(Math.sin(f),3),y=(13*Math.cos(f)-5*Math.cos(2*f)-2*Math.cos(3*f)-Math.cos(4*f)+17)/34,T=c+y*i,x=g/16*(h/2)*(1-Math.abs(E-.5)*.4),k=d;s.push({x,y:T,z:k,scaleX:.95,scaleY:.95,scaleZ:.95})}break}case"sphere":default:{let i=t*.35,h=r+i,c=Math.PI*(Math.sqrt(5)-1);for(let u=0;u<e;u++){let f=1-u/(e-1||1)*2,E=Math.sqrt(Math.max(0,1-f*f)),d=c*u,g=Math.cos(d)*E*i,m=h+f*i,y=Math.sin(d)*E*i;s.push({x:g,y:m,z:y,scaleX:.95,scaleY:.95,scaleZ:.95})}break}}let a=1/0;for(let i of s){let h=.88*(i.scaleY??1)/2,c=i.y-h;c<a&&(a=c)}let n=.25;if(a<n){let i=n-a;for(let h of s)h.y+=i}return s}var nt={"velvet-emerald":{id:"velvet-emerald",name:"Fresh Mint",subtitle:"\\u0421\\u0432\\u0435\\u0436\\u0430\\u044F \\u043C\\u044F\\u0442\\u0430 \\u0438 \\u0441\\u043E\\u0441\\u043D\\u043E\\u0432\\u044B\\u0439 \\u0430\\u043A\\u0446\\u0435\\u043D\\u0442",bgColor:"#F0EBE9",groundColor:"#fcfbf9",voxelColor:"#19C37D",accentColor:"#22d38e",finderColor:"#132A22",isDark:!1},"terracotta-clay":{id:"terracotta-clay",name:"\\u0422\\u0435\\u0440\\u0440\\u0430\\u043A\\u043E\\u0442\\u0430 \\u0438 \\u041A\\u0440\\u0435\\u043C",subtitle:"\\u0422\\u0435\\u043F\\u043B\\u044B\\u0439 \\u0433\\u043B\\u0438\\u043D\\u044F\\u043D\\u044B\\u0439 \\u0430\\u043A\\u0446\\u0435\\u043D\\u0442 \\u0438 \\u043A\\u0430\\u0440\\u0430\\u043C\\u0435\\u043B\\u044C",bgColor:"#F0EBE9",groundColor:"#ffffff",voxelColor:"#3d2516",accentColor:"#ea580c",finderColor:"#f97316",isDark:!1},"espresso-cream":{id:"espresso-cream",name:"\\u042D\\u0441\\u043F\\u0440\\u0435\\u0441\\u0441\\u043E \\u0438 \\u0424\\u0430\\u0440\\u0444\\u043E\\u0440",subtitle:"\\u0413\\u043B\\u0443\\u0431\\u043E\\u043A\\u0438\\u0439 \\u0442\\u0435\\u043C\\u043D\\u044B\\u0439 \\u043A\\u043E\\u0444\\u0435 \\u043D\\u0430 \\u043C\\u043E\\u043B\\u043E\\u0447\\u043D\\u043E\\u043C",bgColor:"#F0EBE9",groundColor:"#ffffff",voxelColor:"#201e1c",accentColor:"#57534e",finderColor:"#292524",isDark:!1},"soft-indigo":{id:"soft-indigo",name:"\\u041A\\u043E\\u0431\\u0430\\u043B\\u044C\\u0442 \\u0438 \\u041B\\u0430\\u0432\\u0430\\u043D\\u0434\\u0430",subtitle:"\\u041C\\u044F\\u0433\\u043A\\u0438\\u0439 \\u043F\\u0430\\u0441\\u0442\\u0435\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0438\\u043D\\u0434\\u0438\\u0433\\u043E",bgColor:"#f4f4f8",groundColor:"#ffffff",voxelColor:"#1e1b4b",accentColor:"#4f46e5",finderColor:"#6366f1",isDark:!1},"dark-obsidian":{id:"dark-obsidian",name:"\\u0413\\u043B\\u0443\\u0431\\u043E\\u043A\\u0438\\u0439 \\u041E\\u0431\\u0441\\u0438\\u0434\\u0438\\u0430\\u043D",subtitle:"\\u041A\\u043E\\u043D\\u0442\\u0440\\u0430\\u0441\\u0442\\u043D\\u044B\\u0439 \\u0442\\u0435\\u043C\\u043D\\u044B\\u0439 \\u0433\\u0440\\u0430\\u0444\\u0438\\u0442",bgColor:"#161514",groundColor:"#23201d",voxelColor:"#3f3a36",accentColor:"#10b981",finderColor:"#34d399",isDark:!0}},at=class{container;renderer;scene;camera;orthoCam;viewT=0;treeView=0;lastFrameTime=0;instancedMesh;groundMesh;shadowMesh;slabMesh=null;stageTop=10;faceYaw=0;ambientLight;dirLight;pointLight;baseAmbientIntensity=1.15;baseDirIntensity=1.6;voxels=[];text;shape;theme;state="qr";season="spring";treeDecor=null;stageScene=null;timeOfDay="day";islandMode="summer";gardenMode="day";eqMode="neon";cakeFlavor="chocolate";castleMode="day";qrSize=25;clock=new C.Clock;morphProgress=0;targetProgress=0;animFrameId=null;intersectionObserver=null;isVisible=!0;paused=!1;setPaused(e){this.paused=e}onPointerDownHandler;onPointerUpHandler;onResizeHandler;onStateChange;onReady;standalone=!1;constructor(e){this.container=e.container,this.text=e.text,this.shape=e.shape,this.theme=nt[e.themeId]||nt["velvet-emerald"],this.standalone=e.standalone??!1,this.season=e.season??"spring",this.timeOfDay=e.timeOfDay??"day",this.islandMode=e.islandMode??"summer",this.gardenMode=e.gardenMode??"day",this.eqMode=e.eqMode??"neon",this.cakeFlavor=e.cakeFlavor??"chocolate",this.castleMode=e.castleMode??"day";let t=e.initialState??"morphed";this.state=t,this.targetProgress=t==="morphed"?1:0,this.viewT=this.targetProgress,this.treeView=this.targetProgress,this.morphProgress=this.targetProgress,this.onStateChange=e.onStateChange,this.onReady=e.onReady,this.init()}init(){let e=this.container.clientWidth||500,t=this.container.clientHeight||500;this.scene=new C.Scene,this.scene.background=null,this.camera=new C.PerspectiveCamera(36,e/t,.1,1e3),this.camera.position.set(0,46,56),this.camera.lookAt(0,3.5,0),this.orthoCam=new C.OrthographicCamera(-20,20,20,-20,.1,1e3);try{this.renderer=new C.WebGLRenderer({antialias:!0,alpha:!0})}catch{try{this.renderer=new C.WebGLRenderer({alpha:!0})}catch(n){console.error("WebGLRenderer initialization failed:",n);return}}this.renderer.setSize(e,t),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=C.PCFSoftShadowMap,"outputColorSpace"in this.renderer?this.renderer.outputColorSpace=C.SRGBColorSpace:"outputEncoding"in this.renderer&&(this.renderer.outputEncoding=3001),this.container.innerHTML="",this.container.appendChild(this.renderer.domElement),this.ambientLight=new C.AmbientLight(this.theme.isDark?16777215:16579577,this.theme.isDark?.7:1.35),this.scene.add(this.ambientLight),this.dirLight=new C.DirectionalLight(16777215,this.theme.isDark?1.5:1.6),this.dirLight.position.set(22,48,28),this.dirLight.castShadow=!0,this.dirLight.shadow.mapSize.width=1024,this.dirLight.shadow.mapSize.height=1024,this.dirLight.shadow.bias=-.001,this.dirLight.shadow.camera.left=-22,this.dirLight.shadow.camera.right=22,this.dirLight.shadow.camera.top=22,this.dirLight.shadow.camera.bottom=-22,this.dirLight.shadow.camera.near=.5,this.dirLight.shadow.camera.far=120,this.scene.add(this.dirLight),this.pointLight=new C.PointLight(this.theme.accentColor,this.theme.isDark?2:1.5,70),this.pointLight.position.set(-18,22,-18),this.scene.add(this.pointLight);let o=new C.CylinderGeometry(15.6,16.2,.45,64),s=new C.MeshStandardMaterial({color:this.theme.isDark?2236446:16513525,roughness:this.theme.isDark?.4:.6,metalness:this.theme.isDark?.3:.04});this.groundMesh=new C.Mesh(o,s),this.groundMesh.position.y=-.25,this.groundMesh.receiveShadow=!0,this.scene.add(this.groundMesh);let r=new C.PlaneGeometry(60,60),a=new C.ShadowMaterial({opacity:this.theme.isDark?.35:.08});this.shadowMesh=new C.Mesh(r,a),this.shadowMesh.rotation.x=-Math.PI/2,this.shadowMesh.position.y=-.27,this.shadowMesh.receiveShadow=!0,this.standalone&&(this.shadowMesh.visible=!1),this.scene.add(this.shadowMesh),this.rebuildVoxels(),this.bindEvents(),this.setupIntersectionObserver(),this.animate(),this.onReady&&this.onReady()}rebuildVoxels(){this.instancedMesh&&(this.scene.remove(this.instancedMesh),this.instancedMesh.geometry.dispose(),Array.isArray(this.instancedMesh.material)?this.instancedMesh.material.forEach(m=>m.dispose()):this.instancedMesh.material.dispose());let{modules:e,size:t}=_o(this.text),o=[];for(let m=0;m<t;m++)for(let y=0;y<t;y++)e[m][y]&&o.push({r:m,c:y,isFinder:Oo(m,y,t)});let s=o.length,r=this.shape==="tree";this.qrSize=t,this.faceYaw=this.shape==="phone"||this.shape==="heart"?Math.PI/4:0;let a=mr(this.shape,s,t,o);this.treeDecor&&(this.treeDecor.dispose(),this.treeDecor=null),r&&(this.treeDecor=new Ke(o,e,t,this.season),this.scene.add(this.treeDecor.group)),this.stageScene&&(this.stageScene.dispose(),this.stageScene=null),this.shape==="city"?this.stageScene=new Je(o,e,t,this.timeOfDay):this.shape==="island"?this.stageScene=new $e(o,e,t,this.islandMode):this.shape==="maze"?this.stageScene=new et(o,e,t,this.gardenMode):this.shape==="equalizer"?this.stageScene=new ot(o,e,t,this.eqMode):this.shape==="cake"?this.stageScene=new rt(o,e,t,this.cakeFlavor):this.shape==="castle"&&(this.stageScene=new st(o,e,t,this.castleMode));let n=!!this.stageScene;if(this.stageScene?(this.scene.add(this.stageScene.group),this.stageScene.targets&&(a=this.stageScene.targets)):er(this.ambientLight,this.dirLight),this.groundMesh.visible=!1,this.slabMesh&&(this.slabMesh.removeFromParent(),this.slabMesh.geometry.dispose(),this.slabMesh.material.dispose(),this.slabMesh=null),!r&&!n){let m=t+2.4;this.slabMesh=new C.Mesh(new C.BoxGeometry(m,.9,m),new C.MeshStandardMaterial({color:this.theme.isDark?"#23201d":"#f3f1ec",roughness:.85})),this.slabMesh.position.y=-.45,this.slabMesh.receiveShadow=!0,this.slabMesh.castShadow=!0,this.scene.add(this.slabMesh)}this.stageTop=r?t*.95:n?this.stageScene.maxHeight:Math.max(4,...a.map(m=>m.y+.44*(m.scaleY??1))),r||!this.theme.isDark?(this.baseAmbientIntensity=1.25,this.baseDirIntensity=2.5,this.pointLight.intensity=.4):(this.baseAmbientIntensity=this.theme.isDark?.7:1.15,this.baseDirIntensity=this.theme.isDark?1.5:1.6,this.pointLight.intensity=this.theme.isDark?2:1.2),this.ambientLight.intensity=this.baseAmbientIntensity,this.dirLight.intensity=this.baseDirIntensity;let i=.88,h=new C.BoxGeometry(i,i,i),c=n?this.stageScene.voxelMaterial:new C.MeshStandardMaterial({color:16777215,roughness:r?.6:.25,metalness:r?0:.35});this.instancedMesh=new C.InstancedMesh(h,c,s),this.instancedMesh.castShadow=!0,this.instancedMesh.receiveShadow=!0,this.voxels=[];let u=new C.Color,f=new C.Color(this.theme.voxelColor),E=new C.Color(this.theme.finderColor),d=new C.Color(this.theme.accentColor),g=t/2;for(let m=0;m<s;m++){let{r:y,c:T,isFinder:x}=o[m],k=a[m]||{x:0,y:0,z:0},L=Math.cos(this.faceYaw),v=Math.sin(this.faceYaw),I={...k,x:k.x*L+k.z*v,z:-k.x*v+k.z*L},P=T-g+.5,V=y-g+.5,A=.5,O=Math.hypot(P,V),ee=n?this.stageScene.growDelay(m):O/(g*1.4)*.45;if(this.voxels.push({qrX:P,qrY:A,qrZ:V,qrScaleX:1.142,qrScaleY:1,qrScaleZ:1.142,targetX:I.x,targetY:I.y,targetZ:I.z,targetScaleX:I.scaleX??1,targetScaleY:I.scaleY??1,targetScaleZ:I.scaleZ??1,waveDelay:ee,isFinder:x}),r){u.set(Vt(o[m],m,t,this.season));let U=Xo(o[m],m,t,this.season),W=this.voxels[this.voxels.length-1];W.qrColor=u.clone(),W.sideColor=new C.Color(U.color),W.sideScale=U.scale}else if(n){let U=this.stageScene.voxelColor(m);u.set(U.qr);let W=this.voxels[this.voxels.length-1];W.qrColor=u.clone(),W.sideColor=new C.Color(U.side)}else x?u.copy(E):m%7===0?u.copy(d):u.copy(f);this.instancedMesh.setColorAt(m,u)}this.instancedMesh.instanceColor.needsUpdate=!0,this.scene.add(this.instancedMesh),this.updateMeshTransforms()}updateMeshTransforms(){let e=new C.Object3D;for(let t=0;t<this.voxels.length;t++){let o=this.voxels[t],s=this.treeDecor?1:this.morphProgress,r=C.MathUtils.clamp((s-o.waveDelay)/(1-o.waveDelay||.001),0,1),a=r<.5?4*r*r*r:1-Math.pow(-2*r+2,3)/2,n=this.stageScene?0:Math.sin(r*Math.PI)*5,i=C.MathUtils.lerp(o.qrX,o.targetX,a),h=C.MathUtils.lerp(o.qrY,o.targetY,a)+n,c=C.MathUtils.lerp(o.qrZ,o.targetZ,a),u=C.MathUtils.lerp(o.qrScaleX,o.targetScaleX,a),f=C.MathUtils.lerp(o.qrScaleY,o.targetScaleY,a),E=C.MathUtils.lerp(o.qrScaleZ,o.targetScaleZ,a);e.position.set(i,h,c);let d=this.treeDecor&&o.sideScale!==void 0?Math.max(1e-4,C.MathUtils.lerp(1,o.sideScale,C.MathUtils.smoothstep(this.treeView,.12,.6))):1,g=d,m=d,y=d;if(this.stageScene?.voxelSideScale){let[T,x,k]=this.stageScene.voxelSideScale(t),[L,v]=this.stageScene.voxelSideWindow??[.35,.75],I=C.MathUtils.smoothstep(this.treeView,L,v);g=Math.max(1e-4,C.MathUtils.lerp(1,T,I)),m=Math.max(1e-4,C.MathUtils.lerp(1,x,I)),y=Math.max(1e-4,C.MathUtils.lerp(1,k,I))}if(e.scale.set(u*g,f*m,E*y),this.stageScene?.voxelBase&&(e.position.y=this.stageScene.voxelBase(t,this.treeView)+f*m*.88/2),this.stageScene?.voxelDance){let T=C.MathUtils.lerp(1,this.stageScene.voxelDance(t,this.clock.getElapsedTime()),C.MathUtils.smoothstep(this.treeView,.55,1)),x=f*m*.88;e.position.y=h-x/2+x*T/2,e.scale.y*=T}this.stageScene?e.rotation.set(0,0,0):r>0&&r<1?(e.rotation.x=r*Math.PI*2,e.rotation.y=r*Math.PI+this.faceYaw*a):e.rotation.set(0,r>=1?this.faceYaw:0,0),e.updateMatrix(),this.instancedMesh.setMatrixAt(t,e.matrix)}if(this.instancedMesh.instanceMatrix.needsUpdate=!0,this.treeDecor||this.stageScene){let t=new C.Color;for(let o=0;o<this.voxels.length;o++){let s=this.voxels[o];!s.qrColor||!s.sideColor||(t.copy(s.qrColor).lerp(s.sideColor,this.treeView),this.instancedMesh.setColorAt(o,t))}this.instancedMesh.instanceColor.needsUpdate=!0,this.treeDecor?.update(this.treeView,this.clock.getElapsedTime()),this.stageScene&&(this.stageScene.applyLighting(this.treeView,this.ambientLight,this.dirLight,this.pointLight),this.stageScene.update(this.treeView,this.clock.getElapsedTime()))}}setSeason(e){e!==this.season&&(this.season=e,this.shape==="tree"&&this.rebuildVoxels())}setCastleMode(e){e!==this.castleMode&&(this.castleMode=e,this.shape==="castle"&&this.rebuildVoxels())}setCakeFlavor(e){e!==this.cakeFlavor&&(this.cakeFlavor=e,this.shape==="cake"&&this.rebuildVoxels())}setEqMode(e){e!==this.eqMode&&(this.eqMode=e,this.shape==="equalizer"&&this.rebuildVoxels())}setGardenMode(e){e!==this.gardenMode&&(this.gardenMode=e,this.shape==="maze"&&this.rebuildVoxels())}setIslandMode(e){e!==this.islandMode&&(this.islandMode=e,this.shape==="island"&&this.rebuildVoxels())}setTimeOfDay(e){e!==this.timeOfDay&&(this.timeOfDay=e,this.shape==="city"&&this.rebuildVoxels())}getSeason(){return this.season}toggleState(){this.setState(this.state==="qr"?"morphed":"qr")}resetView(){}setState(e){this.state=e,this.targetProgress=e==="morphed"?1:0,this.onStateChange&&this.onStateChange(this.state)}getState(){return this.state}updateConfig(e,t,o){let s=!1;if((e!==this.text||t!==this.shape)&&(this.text=e,this.shape=t,s=!0),o!==this.theme.id){this.theme=nt[o]||nt["velvet-emerald"];let r=this.groundMesh.material;r.color.set(this.theme.isDark?2236446:16513525),r.roughness=this.theme.isDark?.4:.6,r.metalness=this.theme.isDark?.3:.05,this.pointLight.color.set(this.theme.accentColor),this.pointLight.intensity=this.theme.isDark?2:1.2,this.ambientLight.intensity=this.theme.isDark?.7:1.15,s=!0}s&&this.rebuildVoxels()}bindEvents(){let e=this.renderer.domElement;e.style.cursor="pointer";let t=!1,o=0,s=0;this.onPointerDownHandler=r=>{t=!0,o=r.clientX,s=r.clientY},this.onPointerUpHandler=r=>{if(!t)return;t=!1,Math.hypot(r.clientX-o,r.clientY-s)<6&&this.toggleState()},this.onResizeHandler=()=>{this.handleResize()},e.addEventListener("pointerdown",this.onPointerDownHandler),window.addEventListener("pointerup",this.onPointerUpHandler),window.addEventListener("resize",this.onResizeHandler)}handleResize(){if(!this.container||!this.renderer)return;let e=this.container.clientWidth||500,t=this.container.clientHeight||500;this.camera&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix()),this.renderer.setSize(e,t)}setupIntersectionObserver(){this.intersectionObserver=new IntersectionObserver(e=>{e.forEach(t=>{this.isVisible=t.isIntersecting})},{threshold:.05}),this.intersectionObserver.observe(this.container)}animate=()=>{this.animFrameId=requestAnimationFrame(this.animate),!(!this.isVisible||this.paused)&&(this.updateStageCamera(),this.renderer.render(this.scene,this.activeCamera()))};activeCamera(){return this.orthoCam}updateStageCamera(){let e=performance.now()/1e3,t=Math.min(.05,this.lastFrameTime?e-this.lastFrameTime:0);this.lastFrameTime=e;let o=1.15,s=this.targetProgress;if(this.viewT!==s){let I=t/o;this.viewT=s>this.viewT?Math.min(s,this.viewT+I):Math.max(s,this.viewT-I)}let r=this.viewT,a=r<.5?4*r*r*r:1-Math.pow(-2*r+2,3)/2,n=this.qrSize,i=this.stageTop,h=C.MathUtils.lerp(Math.PI/2-1e-4,C.MathUtils.degToRad(32),a),c=C.MathUtils.lerp(0,Math.PI/4,a),u=new C.Vector3(0,C.MathUtils.lerp(0,i*.4,a),0),f=200;this.orthoCam.position.set(u.x+f*Math.cos(h)*Math.sin(c),u.y+f*Math.sin(h),u.z+f*Math.cos(h)*Math.cos(c)),this.orthoCam.up.set(0,1,0),this.orthoCam.lookAt(u);let E=(this.container.clientWidth||500)/(this.container.clientHeight||500),d=this.standalone?1.22:1,g=C.MathUtils.lerp((n+2.4)*1.56,n*1.62+4,a)*d,m=C.MathUtils.lerp((n+2.4)*1.56,i*1.18+4,a)*d,y=Math.max(m,g/E),T=this.standalone?0:y*E*C.MathUtils.lerp(.11,.06,a);this.orthoCam.left=-y*E/2-T,this.orthoCam.right=y*E/2-T,this.orthoCam.top=y/2,this.orthoCam.bottom=-y/2,this.orthoCam.updateProjectionMatrix(),a!==this.treeView?(this.treeView=a,this.morphProgress=a,this.updateMeshTransforms()):this.stageScene?.animated&&a>.001?this.updateMeshTransforms():(this.treeDecor?.update(a,this.clock.getElapsedTime()),this.stageScene?.update(a,this.clock.getElapsedTime()));let x=C.MathUtils.smoothstep(a,.45,.78);this.dirLight.intensity=this.baseDirIntensity*x,this.ambientLight.intensity=this.baseAmbientIntensity+this.baseDirIntensity*(1-x)*.45,this.dirLight.castShadow=x>.005;let k=C.MathUtils.lerp(0,24,a),L=C.MathUtils.lerp(50,38,a),v=C.MathUtils.lerp(0,20,a);this.dirLight.position.set(k,L,v)}exportSnapshot(){return this.renderer.render(this.scene,this.activeCamera()),this.renderer.domElement.toDataURL("image/png")}destroy(){this.animFrameId&&cancelAnimationFrame(this.animFrameId),this.intersectionObserver&&this.intersectionObserver.disconnect(),this.onPointerDownHandler&&this.renderer?.domElement&&this.renderer.domElement.removeEventListener("pointerdown",this.onPointerDownHandler),this.onPointerUpHandler&&window.removeEventListener("pointerup",this.onPointerUpHandler),this.onResizeHandler&&window.removeEventListener("resize",this.onResizeHandler),this.treeDecor?.dispose(),this.stageScene?.dispose(),this.renderer?.dispose(),this.container&&(this.container.innerHTML="")}};function zs(l,e={}){let t=document.getElementById(l);return t?new at({container:t,text:e.url||"https://gridika.ru",shape:e.shape||"tree",themeId:e.themeId||"velvet-emerald",season:e.season,timeOfDay:e.timeOfDay,islandMode:e.islandMode,gardenMode:e.gardenMode,eqMode:e.eqMode,cakeFlavor:e.cakeFlavor,castleMode:e.castleMode,initialState:e.initialState??"morphed",standalone:!0}):null}return Hr(Ds);})();\n';

// apps/fx/src/engine/qrMorphEmbedGenerator.ts
function generateQrMorphEmbedCode(o) {
  const id = "gridika-qr-" + Math.random().toString(36).slice(2, 8);
  const height = o.height ?? 480;
  const maxW = o.maxWidth ?? 480;
  const url = o.text || "https://gridika.ru";
  const badgeHtml = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;bottom:10px;right:12px;z-index:10;font-family:system-ui,-apple-system,sans-serif;font-size:10px;font-weight:600;color:rgba(0,0,0,0.45);text-decoration:none;background:rgba(255,255,255,0.7);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:3px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 1px 4px rgba(0,0,0,0.06);">Gridika \u2197</a>`;
  const header = o.license ? codeHeader("3D \u0438\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 QR-\u043A\u043E\u0434", o.license) : "<!-- Gridika \xB7 3D \u0438\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 QR-\u043A\u043E\u0434 -->";
  const licenseJs = o.license ? domainLockJs(`${id}-badge`, o.license.domain) : "";
  const opts = {
    url,
    shape: o.shape || "tree",
    themeId: o.themeId || "velvet-emerald",
    season: o.season,
    timeOfDay: o.timeOfDay,
    islandMode: o.islandMode,
    gardenMode: o.gardenMode,
    eqMode: o.eqMode,
    cakeFlavor: o.cakeFlavor,
    castleMode: o.castleMode,
    initialState: "morphed"
  };
  return `${header}
<div id="${id}" style="width:100%;max-width:${maxW}px;height:${height}px;margin:0 auto;position:relative;background:transparent;user-select:none;-webkit-user-select:none;">
  ${badgeHtml}
</div>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script>
(function() {
  function start() {
    ${qrMorphRuntime_iife_default}
    if (typeof GridikaQrMorphModule !== 'undefined' && GridikaQrMorphModule.initQrMorphWidget) {
      GridikaQrMorphModule.initQrMorphWidget("${id}", ${JSON.stringify(opts)});
    }
  }
  ${licenseJs}
  if (window.THREE) {
    start();
  } else {
    var check = setInterval(function() {
      if (window.THREE) {
        clearInterval(check);
        start();
      }
    }, 50);
  }
})();
</script>`;
}

// raw-file:E:\Programming\temka\apps\fx\src\embed\cardRuntime.js
var cardRuntime_default = "/* Gridika \xB7 \u0412\u0438\u0437\u0438\u0442\u043A\u0430 \u0441 QR \u2014 runtime shared by the studio and the Tilda snippet.\r\n * Plain JS without imports: three.js is passed in, so the same text can be inlined into the embed.\r\n * Everything the card needs (contact text, links, the precomputed QR matrix) comes in `data`. */\r\n\r\nexport const CARD_PALETTES = {\r\n  emerald: { body: '#0f4d3a', edge: '#0b3b2d', bgA: '#14684f', bgB: '#0a3326', text: '#f4f1ec', sub: '#a9dcc6', accent: '#8BF0C2', panel: '#f6f2ea', module: '#0b2a20', cube: '#19C37D', cubeIcon: '#0a3326', metal: 0.1 },\r\n  graphite: { body: '#2a2f37', edge: '#1c2026', bgA: '#3a414c', bgB: '#1b1f25', text: '#eef1f5', sub: '#a7b0bd', accent: '#d4dbe5', panel: '#f1efeb', module: '#15181d', cube: '#e6e9ee', cubeIcon: '#22272e', metal: 0.25 },\r\n  gold: { body: '#15120d', edge: '#b8933f', bgA: '#211c14', bgB: '#0c0a07', text: '#ecd9a4', sub: '#b7a274', accent: '#d9b45f', panel: '#f5ecd6', module: '#16130d', cube: '#d9b45f', cubeIcon: '#15120d', metal: 0.7 },\r\n  ocean: { body: '#0d2f4f', edge: '#0a2540', bgA: '#164a7a', bgB: '#0a2540', text: '#eef6ff', sub: '#9cc3e6', accent: '#6fd3ff', panel: '#f1f6fb', module: '#0a1f33', cube: '#6fd3ff', cubeIcon: '#0a2540', metal: 0.15 },\r\n  berry: { body: '#4a1026', edge: '#3a0c1e', bgA: '#6e1838', bgB: '#2e0918', text: '#fff0f4', sub: '#e3a3b8', accent: '#ff8fb1', panel: '#fbf1f4', module: '#2a0814', cube: '#ff8fb1', cubeIcon: '#3a0c1e', metal: 0.1 },\r\n  amethyst: { body: '#2a1a52', edge: '#1f1340', bgA: '#41297e', bgB: '#1a1036', text: '#f4f0ff', sub: '#b9a8e8', accent: '#b69cff', panel: '#f5f2fc', module: '#160d2e', cube: '#b69cff', cubeIcon: '#1f1340', metal: 0.15 },\r\n  terracotta: { body: '#7a3420', edge: '#5e2717', bgA: '#9c4a2c', bgB: '#5a2414', text: '#fff4ea', sub: '#f0c2a4', accent: '#ffd2a8', panel: '#fbf3ea', module: '#3a160b', cube: '#ffd2a8', cubeIcon: '#5a2414', metal: 0.05 },\r\n  snow: { body: '#f2efe9', edge: '#d9d3c7', bgA: '#ffffff', bgB: '#ebe6dc', text: '#1d1f22', sub: '#6b6560', accent: '#1f6f54', panel: '#ffffff', module: '#111312', cube: '#1d1f22', cubeIcon: '#ffffff', metal: 0.05 },\r\n};\r\n\r\nexport const CARD_STYLES = ['classic', 'minimal', 'pixel', 'wave', 'split', 'diagonal', 'grid'];\r\n\r\nexport function createCardViewer(THREE, container, init) {\r\n  var W = 5.4, H = 8.6, D = 0.24, R = 0.38, FACE_Z = D / 2 + 0.035;\r\n  var FONT = \"'Nunito', system-ui, sans-serif\";\r\n  var state = { data: init.data, mode: init.mode || 'graphite', style: init.style || 'classic', logo: init.logo || null };\r\n  var api = { onFlip: null };\r\n\r\n  // ---------- helpers ----------\r\n  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }\r\n  function easeOutBack(t) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }\r\n  function pal() { return CARD_PALETTES[state.mode] || CARD_PALETTES.graphite; }\r\n  function rrShape(w, h, r) {\r\n    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;\r\n    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);\r\n    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);\r\n    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);\r\n    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);\r\n    return s;\r\n  }\r\n  function faceGeo(w, h, r) {\r\n    var g = new THREE.ShapeGeometry(rrShape(w, h, r), 10), p = g.attributes.position, uv = g.attributes.uv;\r\n    for (var i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);\r\n    return g;\r\n  }\r\n  /** rounded cube: extruded rounded square; caps (group 0) get 0..1 UVs for an icon */\r\n  function roundCube(size, depth, r) {\r\n    var b = Math.min(0.05, depth * 0.2);\r\n    var g = new THREE.ExtrudeGeometry(rrShape(size - b * 2, size - b * 2, r), { depth: depth - b * 2, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 6 });\r\n    g.translate(0, 0, -depth / 2 + b);\r\n    var p = g.attributes.position, uv = g.attributes.uv, cap = g.groups[0];\r\n    for (var i = cap.start; i < cap.start + cap.count; i++) uv.setXY(i, (p.getX(i) + size / 2) / size, (p.getY(i) + size / 2) / size);\r\n    return g;\r\n  }\r\n  function rr(ctx, x, y, w, h, r) {\r\n    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);\r\n    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();\r\n  }\r\n  function fit(ctx, text, weight, size, maxW) {\r\n    var s = size;\r\n    var minS = Math.max(24, Math.round(size * 0.45)); // below this the line stops reading: cut it instead\r\n    do { ctx.font = weight + ' ' + s + 'px ' + FONT; if (ctx.measureText(text).width <= maxW) break; s -= 4; } while (s > minS);\r\n    return s;\r\n  }\r\n  /** fit() and, if even the smallest size is too wide, cut the end off with an ellipsis */\r\n  function fitStr(ctx, text, weight, size, maxW) {\r\n    fit(ctx, text, weight, size, maxW);\r\n    if (ctx.measureText(text).width <= maxW) return text;\r\n    var t = text;\r\n    while (t.length > 1 && ctx.measureText(t + '\u2026').width > maxW) t = t.slice(0, -1);\r\n    return t.replace(/\\s+$/, '') + '\u2026';\r\n  }\r\n  function hash(x, y) { var n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return n - Math.floor(n); }\r\n  function mix(a, b, t) {\r\n    var A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);\r\n    var r = Math.round(((A >> 16) & 255) * (1 - t) + ((B >> 16) & 255) * t);\r\n    var g = Math.round(((A >> 8) & 255) * (1 - t) + ((B >> 8) & 255) * t);\r\n    var bl = Math.round((A & 255) * (1 - t) + (B & 255) * t);\r\n    return 'rgb(' + r + ',' + g + ',' + bl + ')';\r\n  }\r\n  function icon(ctx, kind, cx, cy, s, color) {\r\n    ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 24, s / 24); ctx.translate(-12, -12);\r\n    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';\r\n    if (kind === 'telegram') {\r\n      ctx.beginPath(); ctx.moveTo(21.5, 3.5); ctx.lineTo(2.5, 11); ctx.lineTo(9.5, 13.5); ctx.lineTo(12, 20.5); ctx.lineTo(15, 15.5); ctx.lineTo(19.5, 19); ctx.closePath(); ctx.fill();\r\n    } else if (kind === 'whatsapp') {\r\n      ctx.beginPath(); ctx.arc(12, 11.5, 8.5, 0.7 * Math.PI, 2.55 * Math.PI); ctx.lineTo(4.2, 20.5); ctx.closePath(); ctx.stroke();\r\n      ctx.beginPath(); ctx.moveTo(9, 8.5); ctx.quadraticCurveTo(9, 14.5, 15.5, 15); ctx.stroke();\r\n    } else if (kind === 'site') {\r\n      ctx.beginPath(); ctx.arc(12, 12, 9, 0, Math.PI * 2); ctx.stroke();\r\n      ctx.beginPath(); ctx.ellipse(12, 12, 4, 9, 0, 0, Math.PI * 2); ctx.stroke();\r\n      ctx.beginPath(); ctx.moveTo(3, 12); ctx.lineTo(21, 12); ctx.stroke();\r\n    } else if (kind === 'phone') {\r\n      ctx.beginPath(); ctx.moveTo(6, 3.5); ctx.lineTo(9.5, 3.5); ctx.lineTo(11, 8); ctx.lineTo(8.8, 9.6); ctx.quadraticCurveTo(10.5, 13.5, 14.4, 15.2);\r\n      ctx.lineTo(16, 13); ctx.lineTo(20.5, 14.5); ctx.lineTo(20.5, 18); ctx.quadraticCurveTo(20.5, 20.5, 18, 20.5); ctx.quadraticCurveTo(3.5, 19.5, 3.5, 6); ctx.quadraticCurveTo(3.5, 3.5, 6, 3.5); ctx.fill();\r\n    } else {\r\n      rr(ctx, 3, 5.5, 18, 13, 2.5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(3.5, 7); ctx.lineTo(12, 13); ctx.lineTo(20.5, 7); ctx.stroke();\r\n    }\r\n    ctx.restore();\r\n  }\r\n  function tex(canvas) {\r\n    var t = new THREE.CanvasTexture(canvas);\r\n    if ('colorSpace' in t) t.colorSpace = THREE.SRGBColorSpace;\r\n    t.anisotropy = 8;\r\n    return t;\r\n  }\r\n\r\n  // ---------- scene ----------\r\n  var renderer;\r\n  try {\r\n    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });\r\n  } catch (e1) {\r\n    try {\r\n      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });\r\n    } catch (e2) {\r\n      console.warn('Card WebGLRenderer init failed:', e2);\r\n      return {\r\n        domElement: document.createElement('div'),\r\n        setContact: function() {},\r\n        setMode: function() {},\r\n        setStyle: function() {},\r\n        setLogo: function() {},\r\n        setFlipped: function() {},\r\n        setPaused: function() {},\r\n        checkScan: function() { return { ok: false }; },\r\n        dispose: function() {}\r\n      };\r\n    }\r\n  }\r\n  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));\r\n  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;\r\n  container.appendChild(renderer.domElement);\r\n  var cv = renderer.domElement;\r\n  cv.style.display = 'block'; cv.style.width = '100%'; cv.style.height = '100%'; cv.style.touchAction = 'pan-y';\r\n\r\n  var scene = new THREE.Scene();\r\n  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);\r\n  scene.add(new THREE.AmbientLight(0xffffff, 1.5));\r\n  var key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-4, 6, 10); scene.add(key);\r\n  var rim = new THREE.DirectionalLight(0xffffff, 0.6); rim.position.set(6, -3, 4); scene.add(rim);\r\n\r\n  var floatG = new THREE.Group(), pivot = new THREE.Group();\r\n  floatG.add(pivot); scene.add(floatG);\r\n\r\n  var bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.55 });\r\n  var frontCanvas = document.createElement('canvas'); frontCanvas.width = 1080; frontCanvas.height = 1720;\r\n  var backCanvas = document.createElement('canvas'); backCanvas.width = 1080; backCanvas.height = 1720;\r\n  var frontTex = tex(frontCanvas), backTex = tex(backCanvas);\r\n  var frontMat = new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.62 });\r\n  var backMat = new THREE.MeshBasicMaterial({ map: backTex });\r\n\r\n  var body = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(W, H, R), { depth: D, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 14 }), bodyMat);\r\n  body.position.z = -D / 2; pivot.add(body);\r\n  var front = new THREE.Mesh(faceGeo(W, H, R), frontMat); front.position.z = FACE_Z; pivot.add(front);\r\n  var back = new THREE.Mesh(faceGeo(W, H, R), backMat); back.rotation.y = Math.PI; back.position.z = -FACE_Z; pivot.add(back);\r\n  var qrGroup = new THREE.Group(); qrGroup.rotation.y = Math.PI; qrGroup.position.z = -FACE_Z; pivot.add(qrGroup);\r\n  var cubeGroup = new THREE.Group(); cubeGroup.position.z = FACE_Z; pivot.add(cubeGroup);\r\n\r\n  var glareMat = new THREE.ShaderMaterial({\r\n    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,\r\n    uniforms: { uPos: { value: new THREE.Vector2(0.3, 0.7) }, uStrength: { value: 0 }, uAspect: { value: W / H } },\r\n    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',\r\n    fragmentShader: 'varying vec2 vUv; uniform vec2 uPos; uniform float uStrength; uniform float uAspect;' +\r\n      'void main(){ vec2 p = vUv - uPos; p.x *= uAspect; float spot = exp(-dot(p,p) * 7.0);' +\r\n      'float band = exp(-pow((vUv.x + vUv.y) - (uPos.x + uPos.y), 2.0) * 22.0) * 0.45;' +\r\n      'gl_FragColor = vec4(vec3(1.0), (spot * 0.55 + band) * uStrength); }',\r\n  });\r\n  var glare = new THREE.Mesh(faceGeo(W, H, R), glareMat); glare.position.z = FACE_Z + 0.004; pivot.add(glare);\r\n\r\n  var sc = document.createElement('canvas'); sc.width = 256; sc.height = 384;\r\n  var sctx = sc.getContext('2d'); sctx.filter = 'blur(22px)'; sctx.fillStyle = 'rgba(30,25,20,0.55)'; rr(sctx, 50, 50, 156, 284, 26); sctx.fill();\r\n  var shadow = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.55, H * 1.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, opacity: 0.55 }));\r\n  shadow.position.set(0.45, -0.7, -2.2); scene.add(shadow);\r\n\r\n  var moduleMat = new THREE.MeshStandardMaterial({ roughness: 0.7 });\r\n  var qrMesh = null, qrCells = [], qrModule = 0.08;\r\n  var cubes = [];\r\n\r\n  // ---------- drawing ----------\r\n  function drawMonogram(ctx, x, y, s, p, invert) {\r\n    var c = state.data.contact;\r\n    if (state.logo && state.logo.width) {\r\n      var k = Math.min(s / state.logo.width, s / state.logo.height);\r\n      ctx.drawImage(state.logo, x, y + (s - state.logo.height * k) / 2, state.logo.width * k, state.logo.height * k);\r\n      return;\r\n    }\r\n    var initials = (c.name.trim() || '\u0412\u0430\u0448\u0435 \u0418\u043C\u044F').split(/\\s+/).slice(0, 2).map(function (w) { return (w[0] || '').toUpperCase(); }).join('');\r\n    ctx.fillStyle = invert ? p.bgB : p.accent; rr(ctx, x, y, s, s, s * 0.23); ctx.fill();\r\n    ctx.fillStyle = invert ? p.accent : p.bgB; ctx.font = '900 ' + Math.round(s * 0.48) + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';\r\n    ctx.fillText(initials, x + s / 2, y + s / 2 + s * 0.03);\r\n    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';\r\n  }\r\n  function contactRows() {\r\n    var c = state.data.contact, rows = [];\r\n    if (c.phone.trim()) rows.push(['phone', c.phone.trim()]);\r\n    if (c.email.trim()) rows.push(['email', c.email.trim()]);\r\n    if (state.data.siteLabel) rows.push(['site', state.data.siteLabel]);\r\n    return rows;\r\n  }\r\n  function nameLines() {\r\n    var n = state.data.contact.name.trim() || '\u0412\u0430\u0448\u0435 \u0418\u043C\u044F', w = n.split(/\\s+/);\r\n    return w.length > 1 ? [w[0], w.slice(1).join(' ')] : [n];\r\n  }\r\n\r\n  function drawFront() {\r\n    var p = pal(), c = state.data.contact, ctx = frontCanvas.getContext('2d'), cw = 1080, ch = 1720, maxW = cw - 180;\r\n    var g = ctx.createLinearGradient(0, 0, cw, ch); g.addColorStop(0, p.bgA); g.addColorStop(1, p.bgB);\r\n    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);\r\n    var st = state.style, rows = contactRows(), lines = nameLines(), y, i;\r\n\r\n    if (st === 'minimal') {\r\n      ctx.strokeStyle = p.accent; ctx.globalAlpha = 0.35; ctx.lineWidth = 4; rr(ctx, 50, 50, cw - 100, ch - 100, 46); ctx.stroke(); ctx.globalAlpha = 1;\r\n      drawMonogram(ctx, cw / 2 - 70, 170, 140, p);\r\n      ctx.textAlign = 'center'; ctx.fillStyle = p.text; y = 640;\r\n      for (i = 0; i < lines.length; i++) { ctx.fillText(fitStr(ctx, lines[i], 900, 120, maxW), cw / 2, y); y += 126; }\r\n      ctx.fillStyle = p.accent; ctx.fillRect(cw / 2 - 50, y - 40, 100, 6); y += 50;\r\n      if (c.role.trim()) { ctx.fillStyle = p.accent; ctx.fillText(fitStr(ctx, c.role.trim(), 800, 52, maxW), cw / 2, y); y += 62; }\r\n      if (c.company.trim()) { ctx.fillStyle = p.sub; ctx.fillText(fitStr(ctx, c.company.trim(), 700, 44, maxW), cw / 2, y); }\r\n      y = 1200;\r\n      for (i = 0; i < rows.length; i++) { ctx.fillStyle = p.text; ctx.fillText(fitStr(ctx, rows[i][1], 700, 44, maxW), cw / 2, y); y += 66; }\r\n      ctx.textAlign = 'left';\r\n    } else {\r\n      var top = 110;\r\n      if (st === 'pixel') {\r\n        // voxel mosaic across the top half, monogram sitting on it\r\n        var cell = 60;\r\n        for (var gy = 0; gy < 11; gy++) for (var gx = 0; gx < 18; gx++) {\r\n          var h = hash(gx, gy), fade = 1 - gy / 11;\r\n          if (h > 0.3 + fade * 0.55) continue;\r\n          ctx.globalAlpha = 0.18 + fade * 0.62;\r\n          ctx.fillStyle = mix(p.accent, p.bgA, 0.1 + h * 0.55);\r\n          rr(ctx, 20 + gx * cell, 20 + gy * cell, cell - 8, cell - 8, 8); ctx.fill();\r\n        }\r\n        ctx.globalAlpha = 1; top = 470;\r\n        drawMonogram(ctx, 90, 140, 210, p);\r\n      } else if (st === 'wave') {\r\n        // the Gridika wave washing in from the bottom-left\r\n        ctx.fillStyle = p.accent; ctx.globalAlpha = 0.18;\r\n        ctx.beginPath(); ctx.moveTo(0, ch); ctx.lineTo(0, 1020);\r\n        ctx.bezierCurveTo(260, 900, 420, 1180, 640, 1120); ctx.bezierCurveTo(860, 1060, 940, 1240, cw, 1200); ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill();\r\n        ctx.globalAlpha = 0.32;\r\n        ctx.beginPath(); ctx.moveTo(0, ch); ctx.lineTo(0, 1260); ctx.bezierCurveTo(300, 1150, 520, 1420, 760, 1340); ctx.bezierCurveTo(900, 1290, 980, 1380, cw, 1360); ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill();\r\n        ctx.globalAlpha = 1;\r\n        drawMonogram(ctx, 90, 110, 190, p);\r\n      } else if (st === 'split') {\r\n        // two-tone: a solid accent block with the name, the dark half below\r\n        var sg = ctx.createLinearGradient(0, 0, cw, 900); sg.addColorStop(0, p.accent); sg.addColorStop(1, mix(p.accent, p.bgA, 0.25));\r\n        ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(cw, 0); ctx.lineTo(cw, 860); ctx.bezierCurveTo(760, 930, 320, 830, 0, 900); ctx.closePath(); ctx.fill();\r\n        drawMonogram(ctx, 90, 110, 170, p, true);\r\n      } else if (st === 'diagonal') {\r\n        // a bold diagonal band with thin echoes\r\n        // kept above the name: at the left edge the band ends well before the first line of text\r\n        ctx.save(); ctx.translate(cw * 0.8, 40); ctx.rotate(-0.45);\r\n        ctx.fillStyle = p.accent; ctx.globalAlpha = 0.9; ctx.fillRect(-1100, -70, 2200, 140);\r\n        ctx.globalAlpha = 0.35; ctx.fillRect(-1100, -126, 2200, 16); ctx.fillRect(-1100, -160, 2200, 6);\r\n        ctx.restore(); ctx.globalAlpha = 1;\r\n        drawMonogram(ctx, 90, 110, 190, p);\r\n      } else if (st === 'grid') {\r\n        // blueprint: a fine grid and crop marks\r\n        ctx.strokeStyle = p.accent; ctx.lineWidth = 2; ctx.globalAlpha = 0.12;\r\n        for (gx = 60; gx < cw; gx += 60) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, ch); ctx.stroke(); }\r\n        for (gy = 60; gy < ch; gy += 60) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cw, gy); ctx.stroke(); }\r\n        ctx.globalAlpha = 0.8; ctx.lineWidth = 5;\r\n        [[50, 50, 1, 1], [cw - 50, 50, -1, 1], [50, ch - 50, 1, -1], [cw - 50, ch - 50, -1, -1]].forEach(function (k) {\r\n          ctx.beginPath(); ctx.moveTo(k[0], k[1] + k[3] * 70); ctx.lineTo(k[0], k[1]); ctx.lineTo(k[0] + k[2] * 70, k[1]); ctx.stroke();\r\n        });\r\n        ctx.globalAlpha = 1; ctx.lineWidth = 6; rr(ctx, 90, 110, 190, 190, 44); ctx.stroke();\r\n        var gi = (c.name.trim() || '\u0412\u0430\u0448\u0435 \u0418\u043C\u044F').split(/\\s+/).slice(0, 2).map(function (w) { return (w[0] || '').toUpperCase(); }).join('');\r\n        if (state.logo && state.logo.width) drawMonogram(ctx, 105, 125, 160, p);\r\n        else { ctx.fillStyle = p.accent; ctx.font = '900 88px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(gi, 185, 212); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; }\r\n      } else {\r\n        // classic: a few cubes fading out of the top-right corner\r\n        for (gy = 0; gy < 9; gy++) for (gx = 0; gx < 9; gx++) {\r\n          var d = Math.hypot(gx, gy) / 9;\r\n          if (hash(gx, gy) > 0.82 - d * 0.5 || d > 1.05) continue;\r\n          ctx.globalAlpha = 0.22 * (1 - d); ctx.fillStyle = p.accent;\r\n          rr(ctx, cw - 70 - (gx + 1) * 46, 70 + gy * 46, 38, 38, 7); ctx.fill();\r\n        }\r\n        ctx.globalAlpha = 1;\r\n        drawMonogram(ctx, 90, 110, 190, p);\r\n      }\r\n      y = st === 'pixel' ? 820 : st === 'split' ? 500 : 720;\r\n      ctx.fillStyle = st === 'split' ? p.bgB : p.text;\r\n      for (i = 0; i < lines.length; i++) { ctx.fillText(fitStr(ctx, lines[i], 900, 128, maxW), 90, y); y += 132; }\r\n      y += st === 'split' ? 170 : 10;\r\n      if (c.role.trim()) { ctx.fillStyle = p.accent; ctx.fillText(fitStr(ctx, c.role.trim(), 800, 56, maxW), 92, y); y += 64; }\r\n      if (c.company.trim()) { ctx.fillStyle = p.sub; ctx.fillText(fitStr(ctx, c.company.trim(), 700, 46, maxW), 92, y); }\r\n      var ry = st === 'pixel' ? 1290 : 1220;\r\n      ctx.fillStyle = p.accent; ctx.fillRect(92, ry - 90, 90, 8);\r\n      for (i = 0; i < rows.length; i++) {\r\n        icon(ctx, rows[i][0], 112, ry - 16, 40, p.accent); ctx.fillStyle = p.text;\r\n        ctx.fillText(fitStr(ctx, rows[i][1], 700, 46, maxW - 80), 160, ry); ry += 72;\r\n      }\r\n      void top;\r\n    }\r\n    ctx.fillStyle = p.sub; ctx.globalAlpha = 0.7; ctx.font = '700 34px ' + FONT; ctx.textAlign = 'right';\r\n    ctx.fillText('QR \u043D\u0430 \u043E\u0431\u043E\u0440\u043E\u0442\u0435 \u21BB', cw - 90, ch - 92); ctx.textAlign = 'left'; ctx.globalAlpha = 1;\r\n    frontTex.needsUpdate = true;\r\n  }\r\n\r\n  function drawBack() {\r\n    var p = pal(), ctx = backCanvas.getContext('2d'), cw = 1080, ch = 1720;\r\n    var g = ctx.createLinearGradient(cw, 0, 0, ch); g.addColorStop(0, p.bgA); g.addColorStop(1, p.bgB);\r\n    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);\r\n    if (state.style === 'pixel') {\r\n      for (var gx = 0; gx < 18; gx++) for (var gy = 0; gy < 3; gy++) {\r\n        var h = hash(gx + 40, gy); if (h > 0.55) continue;\r\n        ctx.globalAlpha = 0.18 + h * 0.3; ctx.fillStyle = p.accent; rr(ctx, 20 + gx * 60, ch - 200 + gy * 60, 52, 52, 8); ctx.fill();\r\n      }\r\n      ctx.globalAlpha = 1;\r\n    } else if (state.style === 'wave') {\r\n      ctx.fillStyle = p.accent; ctx.globalAlpha = 0.2;\r\n      ctx.beginPath(); ctx.moveTo(0, ch); ctx.lineTo(0, 1500); ctx.bezierCurveTo(300, 1420, 600, 1600, cw, 1480); ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill();\r\n      ctx.globalAlpha = 1;\r\n    }\r\n    var m = 70;\r\n    ctx.fillStyle = p.panel; rr(ctx, m, m + 40, cw - m * 2, cw - m * 2, 48); ctx.fill();\r\n    ctx.textAlign = 'center';\r\n    ctx.fillStyle = p.text; ctx.font = '900 72px ' + FONT; ctx.fillText('\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043A\u043E\u043D\u0442\u0430\u043A\u0442', cw / 2, cw + 180);\r\n    ctx.fillStyle = p.sub; ctx.font = '700 42px ' + FONT;\r\n    ctx.fillText('\u041D\u0430\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u0430\u043C\u0435\u0440\u0443 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430', cw / 2, cw + 250); ctx.fillText('\u043D\u0430 QR-\u043A\u043E\u0434', cw / 2, cw + 300);\r\n    var n = state.data.contact.name.trim();\r\n    if (n) { ctx.fillStyle = p.accent; ctx.fillText(fitStr(ctx, n, 800, 52, cw - 200), cw / 2, ch - (state.style === 'pixel' ? 250 : 150)); }\r\n    ctx.textAlign = 'left';\r\n    backTex.needsUpdate = true;\r\n  }\r\n\r\n  function buildQr() {\r\n    if (qrMesh) { qrGroup.remove(qrMesh); qrMesh.geometry.dispose(); }\r\n    var q = state.data.qr, size = q.size, quiet = 3, unit = W / 1080, panelPx = 1080 - 140;\r\n    var mod = (panelPx * unit) / (size + quiet * 2), cy = H / 2 - (70 + 40 + panelPx / 2) * unit;\r\n    qrModule = mod; qrCells = [];\r\n    for (var i = 0; i < q.cells.length; i++) {\r\n      var c = q.cells[i][0], r = q.cells[i][1];\r\n      var dc = Math.hypot(c - size / 2, r - size / 2) / (size * 0.71);\r\n      qrCells.push({ x: (c - (size - 1) / 2) * mod, y: cy - (r - (size - 1) / 2) * mod, delay: dc * 0.55 + ((r * 7 + c * 13) % 10) * 0.012 });\r\n    }\r\n    qrMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(mod * 1.04, mod * 1.04, mod * 0.9), moduleMat, qrCells.length);\r\n    qrGroup.add(qrMesh);\r\n    assembleStart = flipped ? -2 : -1;\r\n    updateQr(1e9);\r\n  }\r\n\r\n  var mtx = new THREE.Matrix4(), quat = new THREE.Quaternion(), scl = new THREE.Vector3(), vec = new THREE.Vector3();\r\n  function updateQr(now) {\r\n    if (!qrMesh) return;\r\n    var h = qrModule * 0.9;\r\n    for (var i = 0; i < qrCells.length; i++) {\r\n      var cell = qrCells[i], k;\r\n      if (assembleStart === -1) k = 0; else if (assembleStart === -2) k = 1; else k = (now - assembleStart - cell.delay) / 0.45;\r\n      k = Math.min(1, Math.max(0, k));\r\n      var e = easeOutBack(k), s = Math.max(0.0001, Math.min(1.08, e));\r\n      vec.set(cell.x, cell.y, h / 2 + (1 - Math.min(1, e)) * 2.2); scl.set(s, s, s);\r\n      mtx.compose(vec, quat, scl); qrMesh.setMatrixAt(i, mtx);\r\n    }\r\n    qrMesh.instanceMatrix.needsUpdate = true;\r\n  }\r\n\r\n  function cubeTex(kind) {\r\n    var p = pal(), c = document.createElement('canvas'); c.width = c.height = 128;\r\n    var ctx = c.getContext('2d'); ctx.fillStyle = p.cube; ctx.fillRect(0, 0, 128, 128); icon(ctx, kind, 64, 64, 62, p.cubeIcon);\r\n    return tex(c);\r\n  }\r\n  function buildCubes() {\r\n    cubes.forEach(function (cb) { cubeGroup.remove(cb.mesh); cb.mesh.geometry.dispose(); cb.mesh.material.forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); }); });\r\n    cubes = [];\r\n    var size = 0.66, links = (state.data.links || []).slice(0, 3), p = pal(), metal = state.mode === 'gold' ? 0.5 : 0.05;\r\n    links.forEach(function (l, i) {\r\n      var face = new THREE.MeshStandardMaterial({ map: cubeTex(l.kind), roughness: 0.5, metalness: metal * 0.8 });\r\n      var side = new THREE.MeshStandardMaterial({ color: p.cube, roughness: 0.5, metalness: metal });\r\n      var mesh = new THREE.Mesh(roundCube(size, size * 0.55, 0.1), [face, side]);\r\n      var bx = state.style === 'minimal' ? (i - (links.length - 1) / 2) * (size + 0.22) : -W / 2 + 0.62 + size / 2 + i * (size + 0.22);\r\n      mesh.position.set(bx, -H / 2 + 0.62 + size / 2, size * 0.275);\r\n      cubeGroup.add(mesh);\r\n      cubes.push({ mesh: mesh, url: l.url, lift: 0 });\r\n    });\r\n  }\r\n\r\n  function applyMode() {\r\n    var p = pal();\r\n    bodyMat.color.set(p.edge); bodyMat.metalness = p.metal; bodyMat.roughness = p.metal > 0.5 ? 0.35 : 0.55;\r\n    moduleMat.color.set(p.module);\r\n  }\r\n  function redraw() { drawFront(); drawBack(); buildCubes(); }\r\n\r\n  // ---------- interaction ----------\r\n  var raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(), inside = false, hovered = null, down = null;\r\n  var flipped = false, flipFrom = 0, flipTo = 0, flipStart = -1, assembleStart = -1;\r\n  var tiltX = 0, tiltY = 0, distFront = 20, distBack = 18, visible = true, paused = false, raf = 0, disposed = false;\r\n  var t0 = performance.now();\r\n  function now() { return (performance.now() - t0) / 1000; }\r\n  var gyro = null;\r\n\r\n  function flipAngle(t) {\r\n    if (flipStart < 0) return flipTo;\r\n    var k = Math.min(1, (t - flipStart) / 0.9);\r\n    return flipFrom + (flipTo - flipFrom) * easeInOut(k);\r\n  }\r\n  function setFlipped(f) {\r\n    if (f === flipped) return;\r\n    var t = now(); flipFrom = flipAngle(t); flipped = f; flipTo = f ? Math.PI : 0; flipStart = t;\r\n    if (f) assembleStart = t + 0.55;\r\n    if (api.onFlip) api.onFlip(f);\r\n  }\r\n  cv.addEventListener('pointermove', function (e) {\r\n    var r = cv.getBoundingClientRect();\r\n    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); inside = true;\r\n  });\r\n  cv.addEventListener('pointerleave', function () { inside = false; hovered = null; cv.style.cursor = ''; });\r\n  cv.addEventListener('pointerdown', function (e) { down = { x: e.clientX, y: e.clientY }; });\r\n  cv.addEventListener('pointerup', function (e) {\r\n    if (!down) return;\r\n    var dx = e.clientX - down.x, dy = e.clientY - down.y; down = null;\r\n    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { setFlipped(!flipped); return; }\r\n    if (Math.hypot(dx, dy) > 8) return;\r\n    if (hovered && !flipped) { window.open(hovered.url, '_blank', 'noopener'); return; }\r\n    raycaster.setFromCamera(pointer, camera);\r\n    if (raycaster.intersectObject(pivot, true).length) setFlipped(!flipped);\r\n  });\r\n  // phones: tilt with the gyroscope once the page gets orientation events\r\n  window.addEventListener('deviceorientation', function (e) {\r\n    if (e.beta == null || e.gamma == null) return;\r\n    gyro = { x: Math.max(-1, Math.min(1, (e.beta - 40) / 30)), y: Math.max(-1, Math.min(1, e.gamma / 30)) };\r\n  });\r\n\r\n  function resize() {\r\n    var w = container.clientWidth || 400, h = container.clientHeight || 500;\r\n    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';\r\n    camera.aspect = w / h;\r\n    var fov = THREE.MathUtils.degToRad(camera.fov);\r\n    function fitD(pw, ph) { return Math.max((H * ph) / 2 / Math.tan(fov / 2), (W * pw) / 2 / Math.tan(fov / 2) / camera.aspect); }\r\n    distFront = fitD(1.3, 1.18); distBack = distFront; // the QR side keeps the same size as the front\r\n    camera.position.set(0, 0, flipped ? distBack : distFront); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();\r\n  }\r\n\r\n  function frame(t) {\r\n    var angle = flipAngle(t), fk = flipStart < 0 ? 1 : Math.min(1, (t - flipStart) / 0.9), lift = Math.sin(fk * Math.PI) * 0.9;\r\n    camera.position.z += ((flipped ? distBack : distFront) - camera.position.z) * 0.06;\r\n    var amp = flipped ? 0.25 : 1, px = inside ? pointer.x : gyro ? gyro.y : null, py = inside ? pointer.y : gyro ? -gyro.x : null;\r\n    var tx = py !== null ? -py * 0.2 * amp : Math.sin(t * 0.7) * 0.03 * amp;\r\n    var ty = px !== null ? px * 0.28 * amp : Math.sin(t * 0.5) * 0.06 * amp;\r\n    tiltX += (tx - tiltX) * 0.08; tiltY += (ty - tiltY) * 0.08;\r\n    pivot.rotation.set(tiltX, angle + tiltY, 0); pivot.position.z = lift;\r\n    floatG.position.y = Math.sin(t * 1.1) * 0.06;\r\n    shadow.scale.x = Math.max(0.12, Math.abs(Math.cos(angle)));\r\n    shadow.position.x = 0.45 - tiltY * 1.2; shadow.position.y = -0.7 + tiltX * 1.2;\r\n    var u = glareMat.uniforms; u.uPos.value.set(0.5 - tiltY * 1.6, 0.5 + tiltX * 2.0);\r\n    u.uStrength.value = (flipped ? 0 : 0.18 + Math.min(1, Math.hypot(tiltX, tiltY) * 5) * 0.35) * (1 - Math.sin(fk * Math.PI));\r\n    if (assembleStart >= 0 && t - assembleStart < 1.4) updateQr(t);\r\n    hovered = null;\r\n    if (inside && !flipped && fk >= 1) {\r\n      raycaster.setFromCamera(pointer, camera);\r\n      var hit = raycaster.intersectObjects(cubes.map(function (c) { return c.mesh; }), false)[0];\r\n      if (hit) for (var i = 0; i < cubes.length; i++) if (cubes[i].mesh === hit.object) hovered = cubes[i];\r\n    }\r\n    cv.style.cursor = inside ? 'pointer' : '';\r\n    cubes.forEach(function (cb) {\r\n      cb.lift += ((cb === hovered ? 1 : 0) - cb.lift) * 0.18;\r\n      cb.mesh.position.z = 0.66 * 0.275 + cb.lift * 0.32; cb.mesh.scale.setScalar(1 + cb.lift * 0.1);\r\n      cb.mesh.rotation.set(cb.lift * 0.18, -cb.lift * 0.22, 0);\r\n    });\r\n  }\r\n  function loop() {\r\n    raf = requestAnimationFrame(loop);\r\n    if (!visible || paused) return;\r\n    frame(now()); renderer.render(scene, camera);\r\n  }\r\n\r\n  var ro = new ResizeObserver(resize); ro.observe(container);\r\n  var io = null;\r\n  if ('IntersectionObserver' in window) { io = new IntersectionObserver(function (e) { visible = e[0] ? e[0].isIntersecting : true; }, { threshold: 0.02 }); io.observe(container); }\r\n\r\n  applyMode(); drawFront(); drawBack(); buildQr(); buildCubes(); resize(); loop();\r\n  if (document.fonts && document.fonts.load) {\r\n    Promise.all([document.fonts.load('900 64px Nunito'), document.fonts.load('700 40px Nunito')]).then(function () { if (!disposed) { drawFront(); drawBack(); } });\r\n  }\r\n\r\n  // ---------- public ----------\r\n  api.setData = function (d) { state.data = d; drawFront(); drawBack(); buildQr(); buildCubes(); };\r\n  api.setMode = function (m) { state.mode = m; applyMode(); redraw(); };\r\n  api.setStyle = function (s) { state.style = s; redraw(); };\r\n  api.setLogo = function (img) { state.logo = img; drawFront(); };\r\n  api.setFlipped = setFlipped;\r\n  api.isFlipped = function () { return flipped; };\r\n  api.setPaused = function (p) { paused = p; };\r\n  /** render the current frame into a 2D canvas (works without preserveDrawingBuffer) */\r\n  api.snapshot = function () {\r\n    frame(now()); renderer.render(scene, camera);\r\n    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;\r\n    var c = out.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, out.width, out.height); c.drawImage(cv, 0, 0);\r\n    return out;\r\n  };\r\n  api.dispose = function () {\r\n    disposed = true; cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect();\r\n    scene.traverse(function (o) {\r\n      if (o.geometry) o.geometry.dispose();\r\n      var m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(function (x) { if (x.map) x.map.dispose(); x.dispose(); });\r\n    });\r\n    renderer.dispose(); cv.remove();\r\n  };\r\n  return api;\r\n}\r\n";

// apps/fx/src/engine/cardScene.ts
var import_jsqr = __toESM(require_jsQR(), 1);

// apps/fx/src/engine/qrMatrix.ts
var import_qrcode = __toESM(require_lib(), 1);
function generateQrMatrix(text, errorCorrectionLevel = "M") {
  const qr = import_qrcode.default.create(text, {
    errorCorrectionLevel
  });
  const size = qr.modules.size;
  const modules = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push(Boolean(qr.modules.get(r, c)));
    }
    modules.push(row);
  }
  return { modules, size };
}

// apps/fx/src/engine/vcard.ts
var EMPTY_CONTACT = {
  name: "",
  role: "",
  company: "",
  phone: "",
  email: "",
  site: "",
  telegram: "",
  whatsapp: ""
};
var esc = (v) => v.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
var cleanPhone = (v) => {
  const d = (v || "").replace(/[^\d+]/g, "");
  return d.startsWith("8") && d.length === 11 ? "+7" + d.slice(1) : d;
};
var cleanSite = (v) => (v || "").trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
var cleanTelegram = (v) => (v || "").trim().replace(/^@/, "").replace(/^https?:\/\/t\.me\//i, "");
var telegramUrl = (c) => cleanTelegram(c.telegram) ? `https://t.me/${cleanTelegram(c.telegram)}` : "";
var whatsappUrl = (c) => {
  const d = cleanPhone(c.whatsapp).replace("+", "");
  return d ? `https://wa.me/${d}` : "";
};
var siteUrl = (c) => cleanSite(c.site) ? `https://${cleanSite(c.site)}` : "";
var QR_OPTIONAL = ["whatsapp", "company", "role", "telegram", "site"];
function buildVCard(rawContact, omit = []) {
  let c = { ...EMPTY_CONTACT, ...rawContact || {} };
  if (omit.length) c = { ...c, ...Object.fromEntries(omit.map((k) => [k, ""])) };
  const name = (c.name || "").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ");
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${esc(last)};${esc(first)};;;`, `FN:${esc(name || "\u041A\u043E\u043D\u0442\u0430\u043A\u0442")}`];
  if (c.company?.trim()) lines.push(`ORG:${esc(c.company.trim())}`);
  if (c.role?.trim()) lines.push(`TITLE:${esc(c.role.trim())}`);
  if (cleanPhone(c.phone)) lines.push(`TEL;TYPE=CELL:${cleanPhone(c.phone)}`);
  if (c.email?.trim()) lines.push(`EMAIL:${c.email.trim()}`);
  if (siteUrl(c)) lines.push(`URL:${siteUrl(c)}`);
  if (telegramUrl(c)) lines.push(`URL:${telegramUrl(c)}`);
  if (whatsappUrl(c)) lines.push(`URL:${whatsappUrl(c)}`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

// apps/fx/src/engine/cardScene.ts
function buildCardData(contact) {
  let qrText = "";
  let qrOmitted = [];
  for (let n = 0; n <= QR_OPTIONAL.length; n++) {
    const omit = QR_OPTIONAL.slice(0, n).filter((k) => contact[k].trim());
    qrText = buildVCard(contact, omit);
    qrOmitted = omit;
    if (generateQrMatrix(qrText, "L").size <= 53) break;
  }
  let qr = generateQrMatrix(qrText, "M");
  if (qr.size > 49) qr = generateQrMatrix(qrText, "L");
  const cells = [];
  for (let r = 0; r < qr.size; r++) for (let c = 0; c < qr.size; c++) if (qr.modules[r][c]) cells.push([c, r]);
  const links = [];
  if (telegramUrl(contact)) links.push({ kind: "telegram", url: telegramUrl(contact) });
  if (whatsappUrl(contact)) links.push({ kind: "whatsapp", url: whatsappUrl(contact) });
  if (siteUrl(contact)) links.push({ kind: "site", url: siteUrl(contact) });
  if (!links.length && cleanPhone(contact.phone)) links.push({ kind: "phone", url: `tel:${cleanPhone(contact.phone)}` });
  return { contact, siteLabel: cleanSite(contact.site), links, qr: { size: qr.size, cells }, qrText, qrOmitted };
}

// apps/fx/src/engine/cardEmbedGenerator.ts
var THREE_URLS = [
  "https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.min.js",
  "https://unpkg.com/three@0.174.0/build/three.module.min.js"
];
var LS = new RegExp(String.fromCharCode(8232), "g");
var PS = new RegExp(String.fromCharCode(8233), "g");
var BS = String.fromCharCode(92);
var safeJson = (v) => JSON.stringify(v).replace(/</g, BS + "u003c").replace(LS, BS + "u2028").replace(PS, BS + "u2029");
function generateCardEmbedCode(o) {
  const id = "gridika-card-" + Math.random().toString(36).slice(2, 8);
  const height = o.height ?? 560;
  const maxW = o.maxWidth ?? 440;
  const data = buildCardData(o.contact);
  const payload = {
    card: { contact: data.contact, siteLabel: data.siteLabel, links: data.links, qr: data.qr },
    mode: o.mode,
    style: o.style,
    logo: o.logo ?? null
  };
  const header = o.license ? codeHeader("\u0432\u0438\u0437\u0438\u0442\u043A\u0430 \u0441 QR", o.license) : `<!-- Gridika: 3D-\u0432\u0438\u0437\u0438\u0442\u043A\u0430 \u0441 QR -->`;
  const badge = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;right:12px;bottom:12px;z-index:5;font:600 11px system-ui,-apple-system,sans-serif;color:#64748b;text-decoration:none;background:rgba(255,255,255,0.85);padding:4px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)">Gridika</a>`;
  const lock = o.license ? domainLockJs(`${id}-badge`, o.license.domain) : "";
  const runtime = cardRuntime_default.replace(/^export /gm, "");
  return `${header}
<div id="${id}" style="position:relative;width:100%;max-width:${maxW}px;height:${height}px;margin:0 auto;">${badge}</div>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap">
<script type="module">${lock}
var GRIDIKA = ${safeJson(payload)};
${runtime}
(async function () {
  var el = document.getElementById("${id}");
  var THREE = null, urls = ${JSON.stringify(THREE_URLS)};
  for (var i = 0; i < urls.length && !THREE; i++) { try { THREE = await import(urls[i]); } catch (e) {} }
  if (!THREE || !el) return;
  var logo = null;
  if (GRIDIKA.logo) logo = await new Promise(function (ok) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = function () { ok(null); }; im.src = GRIDIKA.logo; });
  el.__gridika = createCardViewer(THREE, el, { data: GRIDIKA.card, mode: GRIDIKA.mode, style: GRIDIKA.style, logo: logo });
})();
</script>`;
}

// raw-file:E:\Programming\temka\apps\fx\src\embed\giftRuntime.js
var giftRuntime_default = "/* Gridika \xB7 \u041F\u043E\u0434\u0430\u0440\u043E\u043A \u0441 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\u043E\u043C \u2014 runtime shared by the studio and the site snippet.\r\n * Plain JS without imports: three.js is passed in. The reward (promo code / discount / QR coupon)\r\n * comes precomputed as a grid of cells, so the snippet needs no fonts or QR library for it. */\r\n\r\nexport const GIFT_PALETTES = {\r\n  festive: { box: '#d6333f', ribbon: '#f2c14e', pattern: '#f6d26b', podium: '#f6efe4', podiumEdge: '#e4d8c4', reward: '#d6333f', plate: '#fff8ec', badge: '#d6333f', badgeText: '#fff8ec', confetti: ['#d6333f', '#f2c14e', '#ffffff', '#19C37D', '#ff8fb1', '#5b8def'], neon: false, metal: 0.25, btn: '#d6333f', btnText: '#ffffff' },\r\n  kraft: { box: '#c9a27a', ribbon: '#6b4a2e', pattern: '#efe3cf', podium: '#f1e8da', podiumEdge: '#ddcfb8', reward: '#6b4a2e', plate: '#fbf4e8', badge: '#6b4a2e', badgeText: '#fbf4e8', confetti: ['#c9a27a', '#6b4a2e', '#efe3cf', '#a3c49a', '#d98a5a'], neon: false, metal: 0, btn: '#6b4a2e', btnText: '#fff7ec' },\r\n  neon: { box: '#1b1b22', ribbon: '#ff2e88', pattern: '#2ef2ff', podium: '#2a2a33', podiumEdge: '#1c1c23', reward: '#ff2e88', plate: '#22222b', badge: '#ff2e88', badgeText: '#ffffff', confetti: ['#ff2e88', '#2ef2ff', '#f7ff2e', '#ffffff', '#9d4bff'], neon: true, metal: 0.1, btn: '#ff2e88', btnText: '#ffffff' },\r\n  mint: { box: '#7fd6b4', ribbon: '#ff7aa8', pattern: '#ffffff', podium: '#f4f1ea', podiumEdge: '#e2dccf', reward: '#e0457b', plate: '#ffffff', badge: '#ff7aa8', badgeText: '#ffffff', confetti: ['#7fd6b4', '#ff7aa8', '#ffffff', '#ffd166', '#a78bfa'], neon: false, metal: 0.05, btn: '#e0457b', btnText: '#ffffff' },\r\n  royal: { box: '#24356b', ribbon: '#dfe3ec', pattern: '#f2c14e', podium: '#eef0f5', podiumEdge: '#d6dae4', reward: '#24356b', plate: '#ffffff', badge: '#24356b', badgeText: '#f2c14e', confetti: ['#24356b', '#dfe3ec', '#f2c14e', '#ffffff', '#5b8def'], neon: false, metal: 0.55, btn: '#24356b', btnText: '#ffffff' },\r\n  sunny: { box: '#ffc83d', ribbon: '#3b6fe0', pattern: '#ffffff', podium: '#f7f2e8', podiumEdge: '#e6dcc8', reward: '#3b6fe0', plate: '#ffffff', badge: '#3b6fe0', badgeText: '#ffffff', confetti: ['#ffc83d', '#3b6fe0', '#ffffff', '#ff6b6b', '#19C37D'], neon: false, metal: 0.1, btn: '#3b6fe0', btnText: '#ffffff' },\r\n};\r\n\r\n/** box proportions in voxels: width, height */\r\nvar SHAPES = { cube: [8, 6], tall: [6, 9], flat: [10, 4] };\r\n\r\nexport function createGiftViewer(THREE, container, init) {\r\n  var U = 0.5; // voxel size\r\n  var state = { data: init.data, mode: init.mode || 'festive' };\r\n  var api = { onOpen: null };\r\n  function pal() { return GIFT_PALETTES[state.mode] || GIFT_PALETTES.festive; }\r\n  function easeOutBack(t) { var c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }\r\n  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }\r\n  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }\r\n  function rnd(i) { var n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }\r\n\r\n  // ---------- renderer / scene ----------\r\n  var renderer;\r\n  try {\r\n    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });\r\n  } catch (e1) {\r\n    try {\r\n      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });\r\n    } catch (e2) {\r\n      console.warn('Gift WebGLRenderer init failed:', e2);\r\n      return {\r\n        domElement: document.createElement('div'),\r\n        setSettings: function() {},\r\n        setMode: function() {},\r\n        open: function() {},\r\n        close: function() {},\r\n        setPaused: function() {},\r\n        checkScan: function() { return { ok: false }; },\r\n        dispose: function() {}\r\n      };\r\n    }\r\n  }\r\n  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));\r\n  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;\r\n  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';\r\n  container.appendChild(renderer.domElement);\r\n  var cv = renderer.domElement;\r\n  cv.style.display = 'block'; cv.style.width = '100%'; cv.style.height = '100%'; cv.style.cursor = 'pointer';\r\n\r\n  var scene = new THREE.Scene();\r\n  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);\r\n  var hemi = new THREE.HemisphereLight(0xffffff, 0xd8cfc0, 1.6); scene.add(hemi);\r\n  var sun = new THREE.DirectionalLight(0xffffff, 1.7); sun.position.set(6, 12, 8); scene.add(sun);\r\n  var world = new THREE.Group(); scene.add(world);\r\n  var cube = new THREE.BoxGeometry(U * 0.96, U * 0.96, U * 0.96);\r\n  var mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), sc = new THREE.Vector3(), vp = new THREE.Vector3(), col = new THREE.Color();\r\n\r\n  // podium\r\n  var podiumMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });\r\n  var podiumEdgeMat = new THREE.MeshStandardMaterial({ roughness: 0.85 });\r\n  var podium = new THREE.Mesh(new THREE.BoxGeometry(9, 0.5, 9), [podiumEdgeMat, podiumEdgeMat, podiumMat, podiumEdgeMat, podiumEdgeMat, podiumEdgeMat]);\r\n  podium.position.y = -0.25; world.add(podium);\r\n  var shc = document.createElement('canvas'); shc.width = shc.height = 128;\r\n  var sx = shc.getContext('2d'); var sg = sx.createRadialGradient(64, 64, 8, 64, 64, 62);\r\n  sg.addColorStop(0, 'rgba(40,30,20,0.45)'); sg.addColorStop(1, 'rgba(40,30,20,0)'); sx.fillStyle = sg; sx.fillRect(0, 0, 128, 128);\r\n  var shadowTex = new THREE.CanvasTexture(shc);\r\n  var shadow = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));\r\n  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.005; world.add(shadow);\r\n  var lidShadow = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 }));\r\n  lidShadow.rotation.x = -Math.PI / 2; lidShadow.position.y = 0.006; world.add(lidShadow);\r\n\r\n  // ---------- the box (rebuilt when shape / pattern / colours change) ----------\r\n  var boxG = new THREE.Group(); world.add(boxG);\r\n  var bodyG = new THREE.Group(); boxG.add(bodyG);\r\n  var lidG = new THREE.Group(); boxG.add(lidG);\r\n  var paintMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.55 }); // colours come per cube\r\n  var ribbonMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.2 });\r\n  var N = 8, HB = 6, LN = 10, LID_Y = 3.5;\r\n  var bodyMesh, bodyRibbonMesh, lidMesh, lidRibbonMesh, bowMesh, bodyCells = [], bodyRibbon = [], lidCells = [], lidRibbon = [], bowCells = [];\r\n\r\n  function patternAt(u, v) {\r\n    var pat = state.data.pattern || 'plain';\r\n    if (pat === 'dots') return u % 3 === 1 && v % 3 === 1;\r\n    if (pat === 'stripes') return ((u + v) % 4) < 1;\r\n    return false;\r\n  }\r\n  function disposeBox() {\r\n    [bodyMesh, bodyRibbonMesh, lidMesh, lidRibbonMesh, bowMesh].forEach(function (m) { if (m) { m.parent.remove(m); if (m.dispose) m.dispose(); } });\r\n  }\r\n  function instanced(cells, mat, parent) {\r\n    var m = new THREE.InstancedMesh(cube, mat, Math.max(1, cells.length));\r\n    m.count = cells.length;\r\n    cells.forEach(function (c, i) { mtx.makeTranslation(c[0], c[1], c[2]); m.setMatrixAt(i, mtx); });\r\n    parent.add(m);\r\n    return m;\r\n  }\r\n  function buildBox() {\r\n    disposeBox();\r\n    var dims = SHAPES[state.data.shape] || SHAPES.cube, p = pal();\r\n    N = dims[0]; HB = dims[1]; LN = N + 2;\r\n    var mid0 = N / 2 - 1, mid1 = N / 2, lm0 = LN / 2 - 1, lm1 = LN / 2;\r\n    bodyCells = []; bodyRibbon = []; lidCells = []; lidRibbon = []; bowCells = [];\r\n    var bodyCol = [], lidCol = [];\r\n    for (var y = 0; y < HB; y++) for (var x = 0; x < N; x++) for (var z = 0; z < N; z++) {\r\n      if (!(x === 0 || x === N - 1 || z === 0 || z === N - 1 || y === 0)) continue;\r\n      var pos = [(x - (N - 1) / 2) * U, (y + 0.5) * U, (z - (N - 1) / 2) * U];\r\n      bodyCells.push(pos);\r\n      var u = (z === 0 || z === N - 1) ? x : z; // horizontal coordinate along the face\r\n      bodyCol.push(y > 0 && patternAt(u, y) ? p.pattern : p.box);\r\n      if (y === 0) continue;\r\n      if ((x === mid0 || x === mid1) && (z === 0 || z === N - 1)) bodyRibbon.push([pos[0], pos[1], pos[2] + (z === 0 ? -1 : 1) * U * 0.56, 2]);\r\n      if ((z === mid0 || z === mid1) && (x === 0 || x === N - 1)) bodyRibbon.push([pos[0] + (x === 0 ? -1 : 1) * U * 0.56, pos[1], pos[2], 0]);\r\n    }\r\n    for (y = 0; y < 2; y++) for (x = 0; x < LN; x++) for (z = 0; z < LN; z++) {\r\n      if (y === 0 && x > 0 && x < LN - 1 && z > 0 && z < LN - 1) continue;\r\n      var lp = [(x - (LN - 1) / 2) * U, (y - 0.5) * U, (z - (LN - 1) / 2) * U];\r\n      if (x === lm0 || x === lm1 || z === lm0 || z === lm1) lidRibbon.push(lp);\r\n      else { lidCells.push(lp); lidCol.push(y === 1 && patternAt(x, z) ? p.pattern : p.box); }\r\n    }\r\n    var BOW = ['.XX....XX.', 'X..X..X..X', 'X..XXXX..X', '.XXXXXXXX.'];\r\n    for (var r = 0; r < BOW.length; r++) for (x = 0; x < BOW[r].length; x++) {\r\n      if (BOW[r][x] !== 'X') continue;\r\n      for (z = 0; z < 2; z++) bowCells.push([(x - 4.5) * U, (BOW.length - r + 0.5) * U, (z - 0.5) * U]);\r\n    }\r\n    bodyMesh = instanced(bodyCells, paintMat, bodyG);\r\n    bodyRibbonMesh = instanced(bodyRibbon, ribbonMat, bodyG);\r\n    lidMesh = instanced(lidCells, paintMat, lidG);\r\n    lidRibbonMesh = instanced(lidRibbon, ribbonMat, lidG);\r\n    bowMesh = instanced(bowCells, ribbonMat, lidG);\r\n    // colours with a subtle per-cube shade so the voxels read\r\n    [[bodyMesh, bodyCol, 1], [lidMesh, lidCol, 2]].forEach(function (a) {\r\n      a[1].forEach(function (hex, i) { col.set(hex); col.multiplyScalar(0.93 + rnd(i + a[2] * 1000) * 0.1); a[0].setColorAt(i, col); });\r\n      if (a[0].instanceColor) a[0].instanceColor.needsUpdate = true;\r\n    });\r\n    LID_Y = HB * U + U;\r\n    computeLidRest();\r\n    setBow(openT < 0 ? -1 : 9); setBodyRibbon(openT < 0 ? -1 : 9);\r\n  }\r\n\r\n  // The lid ends up leaning against the box corner on the camera's left, standing on the podium.\r\n  // Computed from the box size so it never sinks into the podium, the box or the reward above.\r\n  var lidRest = { pos: new THREE.Vector3(), yaw: 0, tilt: 0, top: 0 };\r\n  function computeLidRest() {\r\n    var th = 0.7, phi = camYaw - 0.35; // lean angle and the direction it leans towards the box\r\n    var W2 = (LN * U) / 2, T2 = U, sn = Math.sin(th), cs = Math.cos(th);\r\n    var yc = W2 * sn + T2 * cs + 0.03;                      // lowest corner just above the podium\r\n    var yb = HB * U;                                         // box top\r\n    var lx = (yb - yc + T2 * cs) / sn;                       // where the lid face reaches the box top\r\n    var reach = Math.min(lx, W2) * cs + T2 * sn;              // how far the lid extends towards the box\r\n    var support = (N * U / 2) * (Math.abs(Math.cos(phi)) + Math.abs(Math.sin(phi))); // box corner along that direction\r\n    var dist = support + reach + 0.12;\r\n    lidRest.pos.set(-Math.cos(phi) * dist, yc, Math.sin(phi) * dist);\r\n    lidRest.yaw = phi; lidRest.tilt = th;\r\n    lidRest.top = yc + W2 * sn + T2 * cs;\r\n  }\r\n  lidG.rotation.order = 'YZX';\r\n\r\n  // ---------- reward on a plate: ticket (code), star badge (discount), framed card (QR) ----------\r\n  var rewardG = new THREE.Group(); world.add(rewardG);\r\n  var letterMat = new THREE.MeshStandardMaterial({ roughness: 0.45 });\r\n  var qrModMat = new THREE.MeshBasicMaterial({ color: '#141414' });\r\n  var plateMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7 });\r\n  var plateWhiteMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });\r\n  var rewardMesh = null, plateMesh = null, plateWhite = null, rewardCells = [], plateCells = [], plateWhiteCells = [];\r\n  var rewardCell = 0.14, plateW = 0, plateH = 0, REWARD_Y = 6;\r\n\r\n  function plateLayout(d) {\r\n    // cells: [x, y, kind] \u2014 kind 0 = edge colour, 1 = plate colour, 2 = white (behind the QR)\r\n    var cells = [], W, H, x, y;\r\n    if (d.kind === 'percent') {\r\n      var D = Math.ceil(Math.sqrt(d.w * d.w + d.h * d.h)) + 7, R = D / 2, c0 = (D - 1) / 2;\r\n      for (y = 0; y < D; y++) for (x = 0; x < D; x++) {\r\n        var dx = x - c0, dy = y - c0, rr = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);\r\n        var lim = R * (0.88 + 0.12 * Math.cos(a * 12));\r\n        if (rr <= lim) cells.push([x, y, rr > lim - 1.2 ? 0 : 1]);\r\n      }\r\n      return { W: D, H: D, ox: Math.floor((D - d.w) / 2), oy: Math.floor((D - d.h) / 2), cells: cells };\r\n    }\r\n    var pad = 4, padY = d.kind === 'qr' ? 4 : 3, rad = 2;\r\n    W = d.w + pad * 2; H = d.h + padY * 2;\r\n    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {\r\n      var cx = x < rad ? rad - x : x > W - 1 - rad ? x - (W - 1 - rad) : 0;\r\n      var cy = y < rad ? rad - y : y > H - 1 - rad ? y - (H - 1 - rad) : 0;\r\n      if (cx * cx + cy * cy > rad * rad + 0.5) continue; // rounded corners\r\n      if (d.kind === 'code') { var my = (H - 1) / 2; if ((x < 2 || x > W - 3) && Math.abs(y - my) < 1.6 - (x < 2 ? x : W - 1 - x) * 0.5) continue; } // ticket notches\r\n      var edge = x === 0 || y === 0 || x === W - 1 || y === H - 1 || cx * cx + cy * cy > (rad - 1) * (rad - 1) + 0.5;\r\n      cells.push([x, y, edge ? 0 : d.kind === 'qr' ? 2 : 1]);\r\n    }\r\n    return { W: W, H: H, ox: pad, oy: padY, cells: cells };\r\n  }\r\n\r\n  function buildReward() {\r\n    [rewardMesh, plateMesh, plateWhite].forEach(function (m) { if (m) { rewardG.remove(m); m.geometry.dispose(); } });\r\n    var d = state.data.reward, isQr = d.kind === 'qr';\r\n    var L = plateLayout(d);\r\n    rewardCell = Math.min(isQr ? 0.17 : 0.15, (isQr ? 6.0 : 6.6) / L.W);\r\n    plateW = L.W * rewardCell; plateH = L.H * rewardCell;\r\n    REWARD_Y = Math.max(HB * U + 1.6, lidRest.top + 0.5) + plateH / 2;\r\n    var cx = (L.W - 1) / 2, cy = (L.H - 1) / 2;\r\n    rewardCells = d.cells.map(function (c, i) {\r\n      return { x: (c[0] + L.ox - cx) * rewardCell, y: -(c[1] + L.oy - cy) * rewardCell, delay: 1.4 + (c[0] / d.w) * 0.5 + rnd(i) * 0.1, seed: i };\r\n    });\r\n    plateCells = []; plateWhiteCells = [];\r\n    L.cells.forEach(function (c, i) {\r\n      var cell = { x: (c[0] - cx) * rewardCell, y: -(c[1] - cy) * rewardCell, delay: 1.1 + Math.hypot(c[0] - cx, c[1] - cy) / L.W * 0.35, seed: i + 5000, k: c[2] };\r\n      (c[2] === 2 ? plateWhiteCells : plateCells).push(cell);\r\n    });\r\n    var front = rewardCell * (isQr ? 0.5 : 1.3), back = rewardCell * 0.7;\r\n    rewardMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(rewardCell * 1.02, rewardCell * 1.02, front), isQr ? qrModMat : letterMat, rewardCells.length);\r\n    plateMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(rewardCell * 1.02, rewardCell * 1.02, back), plateMat, Math.max(1, plateCells.length));\r\n    plateMesh.count = plateCells.length;\r\n    plateWhite = new THREE.InstancedMesh(new THREE.BoxGeometry(rewardCell * 1.02, rewardCell * 1.02, back), plateWhiteMat, Math.max(1, plateWhiteCells.length));\r\n    plateWhite.count = plateWhiteCells.length;\r\n    rewardMesh.userData.z = front / 2 + back / 2;\r\n    rewardG.add(plateMesh); rewardG.add(plateWhite); rewardG.add(rewardMesh);\r\n    colorPlate();\r\n    updateReward(openT < 0 ? -1 : now() - openT);\r\n  }\r\n  function colorPlate() {\r\n    var p = pal(), d = state.data.reward;\r\n    var edge = p.ribbon, body = d.kind === 'percent' ? p.badge : p.plate;\r\n    plateCells.forEach(function (c, i) { col.set(c.k === 0 ? edge : body); col.multiplyScalar(0.95 + rnd(c.seed) * 0.08); plateMesh.setColorAt(i, col); });\r\n    if (plateMesh.instanceColor) plateMesh.instanceColor.needsUpdate = true;\r\n    letterMat.color.set(d.kind === 'percent' ? p.badgeText : p.reward);\r\n    letterMat.emissive.set(p.neon ? (d.kind === 'percent' ? '#ffffff' : p.reward) : '#000000'); letterMat.emissiveIntensity = p.neon ? 0.6 : 0;\r\n    plateMat.emissive.set(p.neon && d.kind === 'percent' ? p.badge : '#000000'); plateMat.emissiveIntensity = p.neon && d.kind === 'percent' ? 0.35 : 0;\r\n  }\r\n\r\n  function placeCells(mesh, cells, t, z, from) {\r\n    for (var i = 0; i < cells.length; i++) {\r\n      var c = cells[i], k = t < 0 ? 0 : clamp01((t - c.delay) / 0.5), e = easeOutBack(k), m1 = Math.min(1, e);\r\n      var s = Math.max(0.0001, Math.min(1.1, e));\r\n      vp.set(from.x + (c.x - from.x) * m1, from.y + (c.y - from.y) * m1 + Math.sin(k * Math.PI) * 0.5, z + (1 - m1) * 1.2);\r\n      e3.set((1 - k) * 2.4 * (rnd(c.seed) - 0.5), (1 - k) * 3 * (rnd(c.seed + 7) - 0.5), 0); q.setFromEuler(e3);\r\n      sc.set(s, s, s); mtx.compose(vp, q, sc); mesh.setMatrixAt(i, mtx);\r\n    }\r\n    mesh.instanceMatrix.needsUpdate = true;\r\n  }\r\n  function updateReward(t) {\r\n    if (!rewardMesh) return;\r\n    var from = new THREE.Vector3(0, -(REWARD_Y - HB * U * 0.6), 0); // inside the box, in reward space\r\n    placeCells(plateMesh, plateCells, t, -rewardCell * 0.2, from);\r\n    placeCells(plateWhite, plateWhiteCells, t, -rewardCell * 0.2, from);\r\n    placeCells(rewardMesh, rewardCells, t, rewardMesh.userData.z - rewardCell * 0.2, from);\r\n  }\r\n\r\n  // ---------- confetti ----------\r\n  var CN = 140;\r\n  var confetti = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.16, 0.09), new THREE.MeshStandardMaterial({ roughness: 0.6, side: THREE.DoubleSide }), CN);\r\n  confetti.frustumCulled = false; world.add(confetti);\r\n  var conf = [];\r\n  for (var ci = 0; ci < CN; ci++) conf.push({ p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), w: new THREE.Vector3(), alive: false });\r\n  function colorConfetti() {\r\n    var cols = pal().confetti;\r\n    for (var i = 0; i < CN; i++) { col.set(cols[i % cols.length]); confetti.setColorAt(i, col); }\r\n    if (confetti.instanceColor) confetti.instanceColor.needsUpdate = true;\r\n  }\r\n  function burst() {\r\n    for (var i = 0; i < CN; i++) {\r\n      var a = rnd(i * 3) * Math.PI * 2, sp = 2.5 + rnd(i * 5) * 4;\r\n      conf[i].p.set((rnd(i) - 0.5) * N * U * 0.6, HB * U + 0.4, (rnd(i + 9) - 0.5) * N * U * 0.6);\r\n      conf[i].v.set(Math.cos(a) * sp * 0.55, 6 + rnd(i * 7) * 5, Math.sin(a) * sp * 0.55);\r\n      conf[i].w.set(rnd(i + 1) * 12 - 6, rnd(i + 2) * 12 - 6, rnd(i + 3) * 12 - 6);\r\n      conf[i].alive = true;\r\n    }\r\n  }\r\n  function updateConfetti(dt) {\r\n    for (var i = 0; i < CN; i++) {\r\n      var c = conf[i];\r\n      if (c.alive) {\r\n        c.v.y -= 9.8 * dt; c.v.multiplyScalar(1 - 0.9 * dt);\r\n        if (c.v.y < -2.2) c.v.y = -2.2;\r\n        c.p.addScaledVector(c.v, dt);\r\n        c.r.x += c.w.x * dt; c.r.y += c.w.y * dt; c.r.z += c.w.z * dt;\r\n        // rest on the podium, or keep falling past its edge\r\n        var onPodium = Math.abs(c.p.x) < 4.5 && Math.abs(c.p.z) < 4.5;\r\n        if (onPodium && c.p.y < 0.03) { c.p.y = 0.03; c.v.set(0, 0, 0); c.w.set(0, 0, 0); c.r.x = -Math.PI / 2; }\r\n        if (c.p.y < -6) c.alive = false;\r\n      }\r\n      var fade = closeT >= 0 ? Math.max(0.0001, 1 - (now() - closeT) / 0.6) : 1;\r\n      q.setFromEuler(c.r); sc.setScalar(c.alive ? fade : 0.0001); mtx.compose(c.p, q, sc); confetti.setMatrixAt(i, mtx);\r\n    }\r\n    confetti.instanceMatrix.needsUpdate = true;\r\n  }\r\n\r\n  // ---------- overlay (caption + button): plain DOM so it works on any site ----------\r\n  var ov = document.createElement('div');\r\n  var btm = init.isStudio ? '88px' : '14px';\r\n  ov.style.cssText = 'position:absolute;left:50%;bottom:' + btm + ';transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;font-family:Nunito,system-ui,sans-serif;width:max-content;max-width:92%;z-index:15;';\r\n  var hint = document.createElement('div');\r\n  hint.style.cssText = 'padding:7px 14px;border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 6px 18px -8px rgba(0,0,0,.35);font-weight:800;font-size:13px;color:#2b2622';\r\n  hint.textContent = '\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u043F\u043E\u0434\u0430\u0440\u043E\u043A \u{1F381}';\r\n  var caption = document.createElement('div');\r\n  caption.style.cssText = 'padding:6px 14px;border-radius:12px;background:rgba(255,255,255,.92);font-weight:800;font-size:13px;color:#2b2622;text-align:center;display:none;max-width:calc(100% - 24px);overflow-wrap:anywhere;box-sizing:border-box';\r\n  var btn = document.createElement('button');\r\n  btn.type = 'button';\r\n  btn.style.cssText = 'pointer-events:auto;border:0;cursor:pointer;padding:10px 18px;border-radius:999px;font:800 13px Nunito,system-ui,sans-serif;box-shadow:0 10px 22px -10px rgba(0,0,0,.45);display:none';\r\n  ov.appendChild(hint); ov.appendChild(caption); ov.appendChild(btn);\r\n  container.appendChild(ov);\r\n  btn.addEventListener('click', function (e) {\r\n    e.stopPropagation();\r\n    var d = state.data;\r\n    if (d.reward.kind === 'qr' && d.url) { window.open(d.url, '_blank', 'noopener'); return; }\r\n    var done = function () { btn.textContent = '\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u2713'; jiggle = now(); setTimeout(applyOverlay, 1800); };\r\n    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(d.code).then(done, done); else done();\r\n  });\r\n  function applyOverlay() {\r\n    var d = state.data, p = pal(), opened = openT >= 0 && closeT < 0;\r\n    hint.style.display = opened || d.trigger === 'scroll' ? 'none' : '';\r\n    caption.textContent = d.caption || '';\r\n    caption.style.display = opened && d.caption ? '' : 'none';\r\n    btn.style.display = opened && (d.reward.kind === 'code' || (d.reward.kind === 'qr' && d.url)) ? '' : 'none';\r\n    btn.textContent = d.reward.kind === 'qr' ? '\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443' : '\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434';\r\n    btn.style.background = p.btn; btn.style.color = p.btnText;\r\n  }\r\n\r\n  // ---------- state & animation ----------\r\n  var t0 = performance.now();\r\n  function now() { return (performance.now() - t0) / 1000; }\r\n  var openT = -1, jiggle = -10, visible = true, paused = false, raf = 0, last = now(), burstDone = false;\r\n  // closing plays the opening timeline backwards (from where it is, a bit faster)\r\n  var closeT = -1, closeFrom = 0, CLOSE_SPEED = 1.35, OPEN_END = 2.6, curOt = -1;\r\n  function timeline(t) {\r\n    if (closeT >= 0) {\r\n      var ot = closeFrom - (t - closeT) * CLOSE_SPEED;\r\n      if (ot <= 0) { finishClose(); return -1; }\r\n      return ot;\r\n    }\r\n    return openT >= 0 ? t - openT : -1;\r\n  }\r\n  function finishClose() {\r\n    openT = -1; closeT = -1;\r\n    for (var i = 0; i < CN; i++) conf[i].alive = false;\r\n    applyOverlay();\r\n  }\r\n\r\n  function applyMode() {\r\n    var p = pal();\r\n    ribbonMat.color.set(p.ribbon); ribbonMat.metalness = p.metal;\r\n    ribbonMat.emissive.set(p.neon ? p.ribbon : '#000000'); ribbonMat.emissiveIntensity = p.neon ? 0.85 : 0;\r\n    podiumMat.color.set(p.podium); podiumEdgeMat.color.set(p.podiumEdge);\r\n    hemi.groundColor.set(p.neon ? '#3a3040' : '#d8cfc0');\r\n    buildBox(); colorConfetti(); if (plateMesh) colorPlate(); applyOverlay();\r\n  }\r\n  function open() {\r\n    var t = now();\r\n    if (closeT >= 0) { var ot = Math.max(0, timeline(t)); closeT = -1; openT = t - ot; } // reopen mid-close: continue from here\r\n    else if (openT >= 0) return;\r\n    else { openT = t; burstDone = false; }\r\n    applyOverlay();\r\n    if (api.onOpen) api.onOpen(true);\r\n  }\r\n  function close() {\r\n    if (openT < 0 || closeT >= 0) return;\r\n    var t = now();\r\n    closeFrom = Math.min(t - openT, OPEN_END);\r\n    closeT = t;\r\n    applyOverlay();\r\n    if (api.onOpen) api.onOpen(false);\r\n  }\r\n\r\n  function ribbonScale(c, s) { return [c[3] === 0 ? 0.22 * s : s, s, c[3] === 2 ? 0.22 * s : s]; }\r\n  function setBodyRibbon(t) {\r\n    for (var i = 0; i < bodyRibbon.length; i++) {\r\n      var c = bodyRibbon[i], k = t < 0 ? 0 : clamp01((t - 0.1 - (HB * U - c[1]) * 0.08) / 0.35), s = Math.max(0.0001, 1 - k), rs = ribbonScale(c, s);\r\n      mtx.makeScale(rs[0], rs[1], rs[2]); mtx.setPosition(c[0], c[1] - k * 0.4, c[2]); bodyRibbonMesh.setMatrixAt(i, mtx);\r\n    }\r\n    bodyRibbonMesh.instanceMatrix.needsUpdate = true;\r\n  }\r\n  function setBow(t) {\r\n    for (var i = 0; i < bowCells.length; i++) {\r\n      var c = bowCells[i], k = t < 0 ? 0 : clamp01((t - rnd(i) * 0.12) / 0.4), s = Math.max(0.0001, 1 - k);\r\n      mtx.makeScale(s, s, s); mtx.setPosition(c[0] + c[0] * 2.2 * k + (rnd(i + 3) - 0.5) * k, c[1] + k * 4.8 * (1 - k), c[2] + (rnd(i + 5) - 0.5) * 2.4 * k); bowMesh.setMatrixAt(i, mtx);\r\n    }\r\n    bowMesh.instanceMatrix.needsUpdate = true;\r\n  }\r\n\r\n  // the lid flips over and then hovers to the left of the box (it never touches the podium)\r\n  var camYaw = 0.72, camPitch = 0.42, camDist = 20, camLook = new THREE.Vector3(0, 1.8, 0);\r\n  // Frame the camera on the actual corners of what is visible: the box, the lid (on top or\r\n  // leaning at the side) and, once open, the reward plate. Keeps everything in view at any size.\r\n  var tmpM = new THREE.Matrix4(), tmpE = new THREE.Euler(0, 0, 0, 'YZX'), tmpV = new THREE.Vector3();\r\n  function keyPoints(opened) {\r\n    var pts = [], bh = N * U / 2, top = HB * U, i;\r\n    for (i = 0; i < 8; i++) pts.push(new THREE.Vector3(i & 1 ? bh : -bh, i & 2 ? top : 0, i & 4 ? bh : -bh));\r\n    for (i = 0; i < 4; i++) pts.push(new THREE.Vector3(i & 1 ? 4.5 : -4.5, -0.5, i & 2 ? 4.5 : -4.5)); // podium corners\r\n    var W2 = LN * U / 2;\r\n    if (!opened) {\r\n      for (i = 0; i < 4; i++) pts.push(new THREE.Vector3(i & 1 ? W2 : -W2, LID_Y + U * 5.5, i & 2 ? W2 : -W2)); // lid + bow\r\n      return pts;\r\n    }\r\n    tmpE.set(0, lidRest.yaw, lidRest.tilt); tmpM.makeRotationFromEuler(tmpE); tmpM.setPosition(lidRest.pos);\r\n    for (i = 0; i < 8; i++) pts.push(new THREE.Vector3(i & 1 ? W2 : -W2, i & 2 ? U : -U, i & 4 ? W2 : -W2).applyMatrix4(tmpM));\r\n    var r = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion), u = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);\r\n    for (i = 0; i < 4; i++) pts.push(new THREE.Vector3(0, REWARD_Y, 0).addScaledVector(r, (i & 1 ? 1 : -1) * plateW / 2).addScaledVector(u, (i & 2 ? 1 : -1) * plateH / 2 + 0.15));\r\n    return pts;\r\n  }\r\n  function camTargets() {\r\n    var opened = closeT >= 0 ? curOt > 1.0 : openT >= 0, pts = keyPoints(opened);\r\n    var f = new THREE.Vector3(Math.sin(camYaw) * Math.cos(camPitch), Math.sin(camPitch), Math.cos(camYaw) * Math.cos(camPitch));\r\n    var r = new THREE.Vector3(Math.cos(camYaw), 0, -Math.sin(camYaw)), u = new THREE.Vector3().crossVectors(f, r).normalize();\r\n    var tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);\r\n    var effAspect = Math.min(camera.aspect, 0.85);\r\n    var tanH = tanV * effAspect;\r\n    // centre: middle of the projected extents (plus generous room at the bottom so the podium never overlaps caption)\r\n    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;\r\n    pts.forEach(function (p) { var x = p.dot(r), y = p.dot(u); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });\r\n    y0 -= opened ? 2.6 : 1.6;\r\n    var look = new THREE.Vector3().addScaledVector(r, (x0 + x1) / 2).addScaledVector(u, (y0 + y1) / 2);\r\n    // distance: every point must fit within the field of view\r\n    var dist = 0;\r\n    pts.forEach(function (p) {\r\n      tmpV.copy(p).sub(look);\r\n      var x = Math.abs(tmpV.dot(r)), y = tmpV.dot(u), z = tmpV.dot(f);\r\n      if (y < 0) y = Math.max(-y, Math.abs(y0 - look.dot(u)) * 0); else y = Math.abs(y);\r\n      dist = Math.max(dist, z + x / tanH, z + y / tanV);\r\n    });\r\n    dist = Math.max(dist, z0dist(look, y0, u, f, tanV));\r\n    return { look: look, dist: dist * 1.08 };\r\n  }\r\n  // keep the extra caption room at the bottom inside the frame\r\n  function z0dist(look, y0, u, f, tanV) { return Math.abs(y0 - look.dot(u)) / tanV; }\r\n  function placeCamera(snap) {\r\n    var tg = camTargets();\r\n    if (snap) { camLook.copy(tg.look); camDist = tg.dist; } else { camLook.lerp(tg.look, 0.05); camDist += (tg.dist - camDist) * 0.05; }\r\n    camera.position.set(camLook.x + Math.sin(camYaw) * Math.cos(camPitch) * camDist, camLook.y + Math.sin(camPitch) * camDist, camLook.z + Math.cos(camYaw) * Math.cos(camPitch) * camDist);\r\n    camera.lookAt(camLook);\r\n  }\r\n\r\n  function frame(t, dt) {\r\n    var ot = timeline(t), opened = ot >= 0;\r\n    curOt = ot;\r\n    if (!opened) {\r\n      var phase = t % 3.2, jump = phase < 0.5 ? Math.sin(phase / 0.5 * Math.PI) * 0.35 : 0, squash = phase < 0.08 ? 1 : 0;\r\n      boxG.rotation.z = Math.sin(t * 1.6) * 0.035; boxG.rotation.x = Math.sin(t * 1.3 + 1) * 0.02;\r\n      boxG.position.y = jump; boxG.scale.set(1 + squash * 0.04, 1 - squash * 0.05, 1 + squash * 0.04);\r\n      lidG.position.set(0, LID_Y, 0); lidG.rotation.set(0, 0, 0);\r\n      setBow(-1); setBodyRibbon(-1); updateReward(-1);\r\n      shadow.scale.setScalar((N / 8) * (1 - jump * 0.4)); lidShadow.material.opacity = 0;\r\n    } else {\r\n      boxG.rotation.z *= 0.9; boxG.rotation.x *= 0.9; boxG.position.y *= 0.85;\r\n      var sq = ot < 0.22 ? Math.sin(ot / 0.22 * Math.PI) : 0;\r\n      boxG.scale.set(1 + sq * 0.05, 1 - sq * 0.08, 1 + sq * 0.05);\r\n      setBow(ot - 0.12); setBodyRibbon(ot);\r\n      // three phases, so it never cuts through anything:\r\n      // 1) straight up above the box, 2) out to the side tilting while high, 3) straight down onto the podium\r\n      var lk = clamp01((ot - 0.15) / 0.9);\r\n      var up = easeInOut(clamp01(lk / 0.3)), out = easeInOut(clamp01((lk - 0.2) / 0.45)), down = easeInOut(clamp01((lk - 0.62) / 0.38));\r\n      var highY = LID_Y + 1.7;\r\n      var y = lk < 0.62 ? LID_Y + (highY - LID_Y) * up : highY + (lidRest.pos.y - highY) * down;\r\n      var settle = lk >= 1 ? Math.sin(Math.min(1, (ot - 1.05) / 0.25) * Math.PI) * 0.05 : 0;\r\n      lidG.position.set(lidRest.pos.x * out, y + settle, lidRest.pos.z * out);\r\n      lidG.rotation.set(0, lidRest.yaw * out, lidRest.tilt * out);\r\n      var le = out;\r\n      lidShadow.position.x = lidG.position.x; lidShadow.position.z = lidG.position.z;\r\n      lidShadow.material.opacity = 0.5 * le;\r\n      if (!burstDone && ot > 0.3) { burst(); burstDone = true; }\r\n      updateReward(ot);\r\n    }\r\n    updateConfetti(Math.min(dt, 0.05));\r\n    var bounce = Math.max(0, Math.sin(Math.min(1, (t - jiggle) / 0.35) * Math.PI)) * 0.25;\r\n    rewardG.position.set(0, REWARD_Y + (opened ? Math.sin(t * 1.3) * 0.08 : 0) + bounce, 0);\r\n    rewardG.quaternion.copy(camera.quaternion);\r\n    placeCamera(false);\r\n  }\r\n\r\n  function loop() {\r\n    raf = requestAnimationFrame(loop);\r\n    var t = now(), dt = t - last; last = t;\r\n    if (!visible || paused) return;\r\n    frame(t, dt); renderer.render(scene, camera);\r\n  }\r\n  function resize() {\r\n    var w = container.clientWidth || 400, h = container.clientHeight || 500;\r\n    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';\r\n    camera.aspect = w / h; camera.updateProjectionMatrix(); placeCamera(true);\r\n  }\r\n\r\n  cv.addEventListener('click', function () { if (openT < 0) open(); });\r\n  var ro = new ResizeObserver(resize); ro.observe(container);\r\n  var io = null;\r\n  var userScrolled = false;\r\n  var onUserScroll = function () {\r\n    userScrolled = true;\r\n    window.removeEventListener('scroll', onUserScroll);\r\n  };\r\n  window.addEventListener('scroll', onUserScroll, { passive: true });\r\n\r\n  if ('IntersectionObserver' in window) {\r\n    var initialFired = false;\r\n    io = new IntersectionObserver(function (es) {\r\n      var e = es[0]; visible = e ? e.isIntersecting : true;\r\n      if (!e) return;\r\n      if (init.isStudio) return; // In studio editor, user controls open/close manually\r\n      // On initial load without scroll, don't auto-open if already visible\r\n      if (!initialFired) {\r\n        initialFired = true;\r\n        if (!userScrolled) return;\r\n      }\r\n      if (state.data.trigger === 'scroll' && e.intersectionRatio >= 0.6 && openT < 0 && userScrolled) {\r\n        setTimeout(open, 350);\r\n      }\r\n    }, { threshold: [0, 0.02, 0.6] });\r\n    io.observe(container);\r\n  }\r\n\r\n  applyMode(); buildReward(); resize(); loop();\r\n\r\n  // ---------- public ----------\r\n  api.setData = function (d) {\r\n    var rebuildBox = d.shape !== state.data.shape || d.pattern !== state.data.pattern;\r\n    state.data = d; if (rebuildBox) buildBox(); buildReward(); applyOverlay();\r\n  };\r\n  api.setMode = function (m) { state.mode = m; applyMode(); };\r\n  api.open = open;\r\n  api.close = close;\r\n  api.isOpen = function () { return openT >= 0 && closeT < 0; };\r\n  api.setPaused = function (p) { paused = p; };\r\n  api.snapshot = function () {\r\n    var t = now(); frame(t, 1 / 60); renderer.render(scene, camera);\r\n    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;\r\n    var c = out.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, out.width, out.height); c.drawImage(cv, 0, 0);\r\n    return out;\r\n  };\r\n  /** for checks: jump the camera to its target framing */\r\n  api.snapCamera = function () { placeCamera(true); };\r\n  /** for checks: screen extents (NDC) of the framing points and of the real lid */\r\n  api.debugFrame = function () {\r\n    lidG.updateMatrixWorld(true); camera.updateMatrixWorld(true);\r\n    var ext = function (pts) { var e = { x0: 9, x1: -9, y0: 9, y1: -9 }; pts.forEach(function (p) { var v = p.clone().project(camera); e.x0 = Math.min(e.x0, v.x); e.x1 = Math.max(e.x1, v.x); e.y0 = Math.min(e.y0, v.y); e.y1 = Math.max(e.y1, v.y); }); return e; };\r\n    var lid = [], h = U / 2;\r\n    lidCells.forEach(function (c) { for (var i = 0; i < 8; i++) lid.push(new THREE.Vector3(c[0] + (i & 1 ? h : -h), c[1] + (i & 2 ? h : -h), c[2] + (i & 4 ? h : -h)).applyMatrix4(lidG.matrixWorld)); });\r\n    return { key: ext(keyPoints(openT >= 0)), lid: ext(lid), lidPos: lidG.position.toArray(), rest: lidRest.pos.toArray(), rot: [lidG.rotation.x, lidG.rotation.y, lidG.rotation.z, lidG.rotation.order] };\r\n  };\r\n  /** for checks: how many lid cube corners are inside the box, below the podium or inside the reward plate */\r\n  api.collisions = function () {\r\n    lidG.updateMatrixWorld(true); rewardG.updateMatrixWorld(true);\r\n    var inv = new THREE.Matrix4().copy(rewardG.matrixWorld).invert(), v = new THREE.Vector3(), r = new THREE.Vector3(), h = U / 2;\r\n    var bh = N * U / 2, out = { box: 0, floor: 0, reward: 0 };\r\n    lidCells.concat(lidRibbon).forEach(function (c) {\r\n      for (var i = 0; i < 8; i++) {\r\n        v.set(c[0] + (i & 1 ? h : -h), c[1] + (i & 2 ? h : -h), c[2] + (i & 4 ? h : -h)).applyMatrix4(lidG.matrixWorld);\r\n        if (v.y < -0.01) out.floor++;\r\n        if (Math.abs(v.x) < bh - 0.02 && Math.abs(v.z) < bh - 0.02 && v.y < HB * U - 0.02) out.box++;\r\n        r.copy(v).applyMatrix4(inv);\r\n        if (openT >= 0 && now() - openT > 1.1 && Math.abs(r.x) < plateW / 2 && Math.abs(r.y) < plateH / 2 && Math.abs(r.z) < 0.4) out.reward++;\r\n      }\r\n    });\r\n    return out;\r\n  };\r\n  /** lowest point of the lid (for checks: it must stay above the podium) */\r\n  api.lidBottom = function () {\r\n    lidG.updateMatrixWorld(true);\r\n    var min = Infinity, v = new THREE.Vector3(), h = U / 2;\r\n    lidCells.concat(lidRibbon).forEach(function (c) {\r\n      for (var i = 0; i < 8; i++) {\r\n        v.set(c[0] + (i & 1 ? h : -h), c[1] + (i & 2 ? h : -h), c[2] + (i & 4 ? h : -h)).applyMatrix4(lidG.matrixWorld);\r\n        if (v.y < min) min = v.y;\r\n      }\r\n    });\r\n    return min;\r\n  };\r\n  api.dispose = function () {\r\n    window.removeEventListener('scroll', onUserScroll);\r\n    cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect();\r\n    scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); var m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(function (x) { if (x.map) x.map.dispose(); x.dispose(); }); });\r\n    renderer.dispose(); cv.remove(); ov.remove();\r\n  };\r\n  return api;\r\n}\r\n";

// apps/fx/src/engine/giftScene.ts
var import_jsqr2 = __toESM(require_jsQR(), 1);
var FONT_5X7 = {
  "0": [14, 17, 19, 21, 25, 17, 14],
  "1": [4, 12, 4, 4, 4, 4, 14],
  "2": [14, 17, 1, 2, 4, 8, 31],
  "3": [31, 2, 4, 2, 1, 17, 14],
  "4": [2, 6, 10, 18, 31, 2, 2],
  "5": [31, 16, 30, 1, 1, 17, 14],
  "6": [6, 8, 16, 30, 17, 17, 14],
  "7": [31, 1, 2, 4, 8, 8, 8],
  "8": [14, 17, 17, 14, 17, 17, 14],
  "9": [14, 17, 17, 15, 1, 2, 12],
  "-": [0, 0, 0, 31, 0, 0, 0],
  "+": [0, 4, 4, 31, 4, 4, 0],
  "%": [27, 27, 2, 4, 8, 27, 27],
  " ": [0, 0, 0, 0, 0, 0, 0],
  "A": [14, 17, 17, 31, 17, 17, 17],
  "B": [30, 17, 17, 30, 17, 17, 30],
  "C": [14, 17, 16, 16, 16, 17, 14],
  "D": [28, 18, 17, 17, 17, 18, 28],
  "E": [31, 16, 16, 30, 16, 16, 31],
  "F": [31, 16, 16, 30, 16, 16, 16],
  "G": [14, 17, 16, 23, 17, 17, 14],
  "H": [17, 17, 17, 31, 17, 17, 17],
  "I": [14, 4, 4, 4, 4, 4, 14],
  "J": [7, 2, 2, 2, 2, 18, 12],
  "K": [17, 18, 20, 24, 20, 18, 17],
  "L": [16, 16, 16, 16, 16, 16, 31],
  "M": [17, 27, 21, 21, 17, 17, 17],
  "N": [17, 17, 25, 21, 19, 17, 17],
  "O": [14, 17, 17, 17, 17, 17, 14],
  "P": [30, 17, 17, 30, 16, 16, 16],
  "Q": [14, 17, 17, 17, 21, 18, 13],
  "R": [30, 17, 17, 30, 20, 18, 17],
  "S": [14, 17, 16, 14, 1, 17, 14],
  "T": [31, 4, 4, 4, 4, 4, 4],
  "U": [17, 17, 17, 17, 17, 17, 14],
  "V": [17, 17, 17, 17, 17, 10, 4],
  "W": [17, 17, 17, 21, 21, 27, 17],
  "X": [17, 17, 10, 4, 10, 17, 17],
  "Y": [17, 17, 10, 4, 4, 4, 4],
  "Z": [31, 1, 2, 4, 8, 16, 31],
  "!": [4, 4, 4, 4, 4, 0, 4],
  "?": [14, 17, 1, 2, 4, 0, 4],
  ".": [0, 0, 0, 0, 0, 0, 4],
  ":": [0, 4, 0, 0, 0, 4, 0],
  "_": [0, 0, 0, 0, 0, 0, 31]
};
var CYR_MAP = {
  "\u0410": "A",
  "\u0412": "B",
  "\u0415": "E",
  "\u041A": "K",
  "\u041C": "M",
  "\u041D": "H",
  "\u041E": "O",
  "\u0420": "P",
  "\u0421": "C",
  "\u0422": "T",
  "\u0425": "X"
};
function rasterizeTextHeadless(text) {
  const upper = text.toUpperCase();
  const cells = [];
  let curX = 0;
  for (let i = 0; i < upper.length; i++) {
    const rawChar = upper[i];
    const ch = CYR_MAP[rawChar] || rawChar;
    const rows = FONT_5X7[ch] || FONT_5X7["?"] || [14, 17, 1, 2, 4, 0, 4];
    for (let y = 0; y < 7; y++) {
      const rowBits = rows[y] || 0;
      for (let bit = 0; bit < 5; bit++) {
        if (rowBits >> 4 - bit & 1) {
          cells.push([curX + bit, y]);
        }
      }
    }
    curX += 6;
  }
  const w = Math.max(1, curX - 1);
  return { w, h: 7, cells };
}
function rasterizeText(text) {
  if (typeof document === "undefined") {
    return rasterizeTextHeadless(text);
  }
  const H = 13;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d", { willReadFrequently: true });
  const font = `900 ${H}px Nunito, system-ui, sans-serif`;
  ctx.font = font;
  const w = Math.max(1, Math.ceil(ctx.measureText(text).width) + 2);
  const h = H + 4;
  c.width = w;
  c.height = h;
  ctx.font = font;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#000";
  ctx.fillText(text, 1, H);
  const img = ctx.getImageData(0, 0, w, h).data;
  const cells = [];
  let minY = h, maxY = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (img[(y * w + x) * 4 + 3] > 110) {
        cells.push([x, y]);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
  if (!cells.length) return { w: 1, h: 1, cells: [[0, 0]] };
  return { w, h: maxY - minY + 1, cells: cells.map(([x, y]) => [x, y - minY]) };
}
function buildGiftData(s) {
  const safeSettings = {
    caption: s?.caption || "",
    code: s?.code || "GRID20",
    percent: s?.percent || "10",
    url: s?.url || "https://gridika.ru",
    trigger: s?.trigger || "click",
    shape: s?.shape || "cube",
    pattern: s?.pattern || "dots",
    kind: s?.kind || "code"
  };
  if (safeSettings.kind === "qr") {
    const url = (safeSettings.url || "").trim() || "https://gridika.ru";
    const qr = generateQrMatrix(url, "M");
    const cells = [];
    for (let r2 = 0; r2 < qr.size; r2++) for (let c = 0; c < qr.size; c++) if (qr.modules[r2][c]) cells.push([c, r2]);
    return { reward: { kind: "qr", w: qr.size, h: qr.size, cells }, code: "", url, caption: safeSettings.caption, trigger: safeSettings.trigger, shape: safeSettings.shape, pattern: safeSettings.pattern, qrText: url };
  }
  const text = safeSettings.kind === "percent" ? `-${((safeSettings.percent || "").replace(/[^\d]/g, "") || "10").slice(0, 3)}%` : ((safeSettings.code || "").trim() || "GRID20").slice(0, 14);
  const r = rasterizeText(text);
  return { reward: { kind: safeSettings.kind, ...r }, code: safeSettings.kind === "code" ? text : "", url: "", caption: safeSettings.caption, trigger: safeSettings.trigger, shape: safeSettings.shape, pattern: safeSettings.pattern, qrText: "" };
}

// apps/fx/src/engine/giftEmbedGenerator.ts
var THREE_URLS2 = [
  "https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.min.js",
  "https://unpkg.com/three@0.174.0/build/three.module.min.js"
];
var BS2 = String.fromCharCode(92);
var LS2 = new RegExp(String.fromCharCode(8232), "g");
var PS2 = new RegExp(String.fromCharCode(8233), "g");
var safeJson2 = (v) => JSON.stringify(v).replace(/</g, BS2 + "u003c").replace(LS2, BS2 + "u2028").replace(PS2, BS2 + "u2029");
function generateGiftEmbedCode(o) {
  const id = "gridika-gift-" + Math.random().toString(36).slice(2, 8);
  const height = o.height ?? 520;
  const maxW = o.maxWidth ?? 560;
  const d = buildGiftData(o.settings);
  const data = { reward: d.reward, code: d.code, url: d.url, caption: d.caption, trigger: d.trigger, shape: d.shape, pattern: d.pattern };
  const badge = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;right:12px;top:12px;z-index:5;font:600 11px system-ui,-apple-system,sans-serif;color:#64748b;text-decoration:none;background:rgba(255,255,255,0.85);padding:4px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)">Gridika</a>`;
  const runtime = giftRuntime_default.replace(/^export /gm, "");
  return `${codeHeader("\u043F\u043E\u0434\u0430\u0440\u043E\u043A \u0441 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\u043E\u043C", o.license)}
<div id="${id}" style="position:relative;width:100%;max-width:${maxW}px;height:${height}px;margin:0 auto;">${badge}</div>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap">
<script type="module">${domainLockJs(`${id}-badge`, o.license.domain)}
var GRIDIKA = ${safeJson2({ data, mode: o.mode })};
${runtime}
(async function () {
  var el = document.getElementById("${id}");
  var THREE = null, urls = ${JSON.stringify(THREE_URLS2)};
  for (var i = 0; i < urls.length && !THREE; i++) { try { THREE = await import(urls[i]); } catch (e) {} }
  if (!THREE || !el) return;
  el.__gridika = createGiftViewer(THREE, el, { data: GRIDIKA.data, mode: GRIDIKA.mode });
})();
</script>`;
}

// raw-file:E:\Programming\temka\apps\fx\src\embed\logoRuntime.js
var logoRuntime_default = `/* Gridika \xB7 3D-\u043B\u043E\u0433\u043E\u0442\u0438\u043F \u0438\u0437 \u0432\u043E\u043A\u0441\u0435\u043B\u0435\u0439 \u2014 runtime shared by the studio and the site snippet.
 * Plain JS without imports: three.js is passed in. The logo comes precomputed as a small
 * colour grid (run-length string + palette), so the snippet needs no image at all.
 *
 * data: { w, h, palette: ['#hex', \u2026], rle: '12.3a1b\u2026', depth: 1..8, motion: 'spin'|'sway'|'still' }
 * mode: 'gloss' | 'matte' | 'chrome' | 'pearl' | 'toon' | 'neon'
 */

export var LOGO_MODES = {
  gloss: { label: '\u0413\u043B\u044F\u043D\u0435\u0446' },
  matte: { label: '\u041C\u0430\u0442\u043E\u0432\u044B\u0439' },
  chrome: { label: '\u041C\u0435\u0442\u0430\u043B\u043B\u0438\u043A' },
  pearl: { label: '\u041F\u0435\u0440\u043B\u0430\u043C\u0443\u0442\u0440' },
  toon: { label: '\u041C\u0443\u043B\u044C\u0442\u044F\u0448\u043D\u044B\u0439' },
  neon: { label: '\u041D\u0435\u043E\u043D' },
};
/** neon: no dark tile \u2014 a soft aura in the logo's own colour that melts into any page */
function neonAura(hex, css) {
  var n = parseInt(String(hex || '#8b5cf6').replace('#', ''), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  var c = function (a) { return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; };
  return css
    ? 'radial-gradient(ellipse 46% 40% at 50% 50%, ' + c(0.26) + ' 0%, ' + c(0.12) + ' 50%, ' + c(0.04) + ' 78%, ' + c(0) + ' 100%)'
    : [c(0.26), c(0.12), c(0.04), c(0)];
}

/** "3.2a1b" \u2192 array of length w*h with -1 (empty) or a palette index */
export function decodeLogoGrid(d) {
  var out = new Int16Array(d.w * d.h).fill(-1), n = 0, num = '';
  for (var i = 0; i < d.rle.length; i++) {
    var ch = d.rle[i];
    if (ch >= '0' && ch <= '9') { num += ch; continue; }
    var count = num ? parseInt(num, 10) : 1; num = '';
    var v = ch === '.' ? -1 : ch.charCodeAt(0) - 97;
    for (var k = 0; k < count && n < out.length; k++) out[n++] = v;
  }
  return out;
}

export function createLogoViewer(THREE, container, init) {
  var U = 0.5;
  var state = { data: init.data, mode: init.mode || 'gloss' };
  var api = {};
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function rnd(i) { var n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }

  // ---------- renderer / scene ----------
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
  } catch (e1) {
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true }); } catch (e2) {
      console.warn('Logo WebGLRenderer init failed:', e2);
      var noop = function () {};
      return { setData: noop, setMode: noop, replay: noop, burst: noop, setPaused: noop, snapshot: function () { return document.createElement('canvas'); }, dispose: noop };
    }
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.appendChild(renderer.domElement);
  var cv = renderer.domElement;
  cv.style.display = 'block'; cv.style.width = '100%'; cv.style.height = '100%'; cv.style.cursor = 'pointer'; cv.style.touchAction = 'pan-y';

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 400);
  var hemi = new THREE.HemisphereLight(0xffffff, 0xd9d2c5, 1.2); scene.add(hemi);
  var key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(-5, 8, 10); scene.add(key);
  var rim = new THREE.DirectionalLight(0xffffff, 0.9); rim.position.set(8, 3, -6); scene.add(rim);
  var group = new THREE.Group(); scene.add(group);
  var cube = new THREE.BoxGeometry(U, U, U);

  // soft studio reflections for the glossy mode (built once, no files)
  var envTex = null;
  function glossEnv() {
    if (envTex) return envTex;
    try {
      var pm = new THREE.PMREMGenerator(renderer), s = new THREE.Scene();
      var room = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x8c8898, side: THREE.BackSide }));
      s.add(room);
      var panel = function (w, h, x, y, z, k) {
        var m = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }); m.color.setScalar(k);
        var p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); p.lookAt(0, 0, 0); s.add(p);
      };
      panel(10, 4, 0, 9, 2, 5); panel(3, 12, -9, 1, 4, 3); panel(3, 12, 9, 1, -2, 2); panel(12, 2, 0, -8, 6, 0.8); panel(14, 3, 0, 4, 10, 1.6);
      envTex = pm.fromScene(s, 0.03).texture;
      pm.dispose();
    } catch (e) { envTex = null; }
    return envTex;
  }

  // three-step light for the cartoon look
  var toonRamp = new THREE.DataTexture(new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
  toonRamp.minFilter = toonRamp.magFilter = THREE.NearestFilter; toonRamp.needsUpdate = true;

  var mats = {
    gloss: new THREE.MeshPhysicalMaterial({ roughness: 0.32, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.9 }),
    matte: new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0 }),
    chrome: new THREE.MeshStandardMaterial({ roughness: 0.24, metalness: 1, envMapIntensity: 0.95 }),
    pearl: new THREE.MeshPhysicalMaterial({ roughness: 0.28, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 520], sheen: 0.6, sheenRoughness: 0.4, sheenColor: new THREE.Color(0xffffff), envMapIntensity: 1 }),
    toon: new THREE.MeshToonMaterial({ gradientMap: toonRamp }),
    neon: new THREE.MeshStandardMaterial({ color: 0x1d1830, roughness: 0.5, metalness: 0.3 }),
  };
  // every cube gets a soft dark seam along its edges (the voxel grid without real gaps);
  // neon instead lights the edges up in the logo colour
  var EDGE_DARK = { gloss: 0.2, matte: 0.24, chrome: 0.3, pearl: 0.16, toon: 0.55 };
  Object.keys(mats).forEach(function (name) {
    var mat = mats[name], neon = name === 'neon';
    mat.onBeforeCompile = function (sh) {
      sh.uniforms.uHalf = { value: U * 0.5 };
      sh.uniforms.uEdge = { value: EDGE_DARK[name] || 0 };
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\\nvarying vec3 vLocalP;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\\nvLocalP = position;');
      var edgeFn = [
        'vec3 q = abs(vLocalP) / uHalf;',
        'float mid = q.x + q.y + q.z - max(q.x, max(q.y, q.z)) - min(q.x, min(q.y, q.z));',
      ].join('\\n');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\\nvarying vec3 vLocalP;\\nuniform float uHalf;\\nuniform float uEdge;');
      if (neon) {
        sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', [
          '#include <emissivemap_fragment>', edgeFn,
          'float edge = smoothstep(0.72, 0.96, mid);',
          '#if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )',
          'totalEmissiveRadiance += vColor * (edge * 2.2 + 0.1);',
          '#endif',
        ].join('\\n'));
      } else {
        sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', [
          '#include <color_fragment>', edgeFn,
          'diffuseColor.rgb *= 1.0 - uEdge * smoothstep(0.8, 0.985, mid);',
        ].join('\\n'));
      }
    };
    mat.customProgramCacheKey = function () { return 'gridika-voxel-' + name; };
  });

  // ---------- voxels ----------
  var mesh = null, N = 0;
  var home, from, delay, spin, burstDir;
  var center = new THREE.Vector3(), size = { w: 1, h: 1, d: 1 };
  var built = 0; // time of the last assembly start
  var burstT = -10, dirty = true, hoverK = 0, hoverTarget = 0;
  var pointer = { x: 0, y: 0, inside: false, lx: 0, ly: 0 };

  function shade(hex, i) {
    var c = new THREE.Color(hex);
    var rim = mesh && mesh.userData.edge ? mesh.userData.edge[i] : 1;
    if (state.mode === 'matte') c.lerp(new THREE.Color(0xffffff), 0.22);
    if (state.mode === 'chrome') c.lerp(new THREE.Color(0xffffff), 0.12);
    if (state.mode === 'pearl') c.lerp(new THREE.Color(0xffffff), 0.28);
    var hl = {}; c.getHSL(hl);
    if (hl.l > 0.84 && state.mode !== 'neon') c.setHSL(hl.h, hl.s, 0.84);
    if (state.mode === 'neon') { var hsl = {}; c.getHSL(hsl); c.setHSL(hsl.h, Math.min(1, hsl.s * 1.15 + 0.1), Math.min(0.62, Math.max(0.5, hsl.l))); }
    if (state.mode === 'neon') c.multiplyScalar(rim ? 1 : 0.22);
    else c.multiplyScalar(0.93 + rnd(i * 3.1) * 0.09);
    return c;
  }
  function colorAll() {
    if (!mesh) return;
    for (var i = 0; i < N; i++) mesh.setColorAt(i, shade(state.data.palette[mesh.userData.col[i]] || '#888888', i));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }

  function build() {
    if (mesh) { group.remove(mesh); mesh.dispose(); mesh = null; }
    var d = state.data, grid = decodeLogoGrid(d), depth = Math.max(1, Math.min(8, d.depth | 0 || 3));
    var cells = [];
    for (var y = 0; y < d.h; y++) for (var x = 0; x < d.w; x++) { var v = grid[y * d.w + x]; if (v >= 0) cells.push([x, y, v]); }
    N = cells.length * depth;
    size = { w: d.w * U, h: d.h * U, d: depth * U };
    mesh = new THREE.InstancedMesh(cube, mats[state.mode] || mats.gloss, Math.max(1, N));
    mesh.count = N;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    home = new Float32Array(N * 3); from = new Float32Array(N * 3); delay = new Float32Array(N); spin = new Float32Array(N * 3); burstDir = new Float32Array(N * 3);
    var col = new Uint8Array(N), edge = new Uint8Array(N);
    var filled = function (x, y) { return x >= 0 && y >= 0 && x < d.w && y < d.h && grid[y * d.w + x] >= 0; };
    for (var c = 0, i = 0; c < cells.length; c++) {
      for (var z = 0; z < depth; z++, i++) {
        var hx = (cells[c][0] - (d.w - 1) / 2) * U, hy = ((d.h - 1) / 2 - cells[c][1]) * U, hz = (z - (depth - 1) / 2) * U;
        home[i * 3] = hx; home[i * 3 + 1] = hy; home[i * 3 + 2] = hz;
        // drift in from a cloud inside the logo's own frame, a little in front of it
        from[i * 3] = hx * 0.6 + (rnd(i + 1) - 0.5) * size.w * 0.4;
        from[i * 3 + 1] = hy * 0.6 + (rnd(i + 7) - 0.5) * size.h * 0.4;
        from[i * 3 + 2] = hz + U * (3 + rnd(i + 13) * 7);
        // left to right sweep, front layers first
        delay[i] = (cells[c][0] / Math.max(1, d.w - 1)) * 0.9 + rnd(i + 21) * 0.45 + z * 0.03;
        spin[i * 3] = (rnd(i + 31) - 0.5) * 3; spin[i * 3 + 1] = (rnd(i + 37) - 0.5) * 3; spin[i * 3 + 2] = (rnd(i + 41) - 0.5) * 2;
        var bx = hx + (rnd(i + 51) - 0.5) * U * 4, by = hy + (rnd(i + 53) - 0.5) * U * 4, bz = (rnd(i + 57) - 0.2) * U * 6, bl = Math.hypot(bx, by, bz) || 1;
        var amp = U * (1 + rnd(i + 59) * 2);
        burstDir[i * 3] = bx / bl * amp; burstDir[i * 3 + 1] = by / bl * amp; burstDir[i * 3 + 2] = bz / bl * amp + U * 1.5;
        col[i] = cells[c][2];
        var cx = cells[c][0], cy = cells[c][1];
        edge[i] = !filled(cx - 1, cy) || !filled(cx + 1, cy) || !filled(cx, cy - 1) || !filled(cx, cy + 1) ? 1 : 0;
      }
    }
    mesh.userData.col = col;
    mesh.userData.edge = edge;
    group.add(mesh);
    colorAll();
    built = reduced ? -100 : now();
    dirty = true;
    resize();
  }

  // ---------- animation ----------
  var t0 = performance.now(), last = 0, raf = 0, paused = false, visible = true;
  function now() { return (performance.now() - t0) / 1000; }
  var m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sv = new THREE.Vector3(1, 1, 1);
  var DUR = 1.5, ASSEMBLE_END = DUR + 1.5, BURST_LEN = 1.3, DISSOLVE = 0.6, dissolveT = -1;
  function easeSine(t) { return 0.5 - 0.5 * Math.cos(Math.PI * t); }

  function updateVoxels(t) {
    var ta = t - built, tb = t - burstT;
    var pre = ta < 0, assembling = ta < ASSEMBLE_END, bursting = tb < BURST_LEN, hovering = hoverK > 0.002;
    if (!assembling && !bursting && !hovering && !dirty) return;
    var R2 = Math.pow(Math.max(size.w, size.h) * 0.16 + U * 2, 2);
    // before the assembly: either melting away (replay) or not shown yet (waiting to come into view)
    var dk = pre ? (dissolveT >= 0 ? clamp01((t - dissolveT) / DISSOLVE) : 1) : 0;
    for (var i = 0; i < N; i++) {
      var k, sc;
      if (pre) { k = 1 - easeSine(dk); sc = k; }
      else if (assembling) { var u = clamp01((ta - delay[i]) / DUR); k = easeSine(u); sc = easeOutCubic(clamp01(u * 1.7)); }
      else { k = 1; sc = 1; }
      var inv = 1 - k;
      var x = from[i * 3] + (home[i * 3] - from[i * 3]) * k;
      var y = from[i * 3 + 1] + (home[i * 3 + 1] - from[i * 3 + 1]) * k;
      var z = from[i * 3 + 2] + (home[i * 3 + 2] - from[i * 3 + 2]) * k;
      var rx = spin[i * 3] * inv, ry = spin[i * 3 + 1] * inv, rz = spin[i * 3 + 2] * inv;
      if (bursting) {
        var bt = clamp01(tb / BURST_LEN), lag = rnd(i + 71) * 0.12;
        var s = bt < 0.22 ? easeOutCubic(bt / 0.22) : 1 - easeInOut(clamp01((bt - 0.22 - lag) / (0.78 - lag)));
        x += burstDir[i * 3] * s; y += burstDir[i * 3 + 1] * s; z += burstDir[i * 3 + 2] * s;
        rx += spin[i * 3] * 0.25 * s; ry += spin[i * 3 + 1] * 0.25 * s;
      }
      if (hovering) {
        var dx = home[i * 3] - pointer.lx, dy = home[i * 3 + 1] - pointer.ly, d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          var f = Math.pow(1 - d2 / R2, 2) * hoverK, dl = Math.sqrt(d2) || 1;
          x += dx / dl * f * U * 0.9; y += dy / dl * f * U * 0.9; z += f * U * 2.4;
          rx += f * 0.5 * (rnd(i + 81) - 0.5); ry += f * 0.5 * (rnd(i + 83) - 0.5);
        }
      }
      e.set(rx, ry, rz); q.setFromEuler(e); p.set(x, y, z); sv.setScalar(Math.max(0.0001, sc));
      m4.compose(p, q, sv); mesh.setMatrixAt(i, m4);
    }
    mesh.instanceMatrix.needsUpdate = true;
    dirty = assembling || bursting || hovering;
  }

  var tilt = { x: 0, y: 0 };
  function frame(t, dt) {
    if (!mesh) return;
    hoverK += (hoverTarget - hoverK) * Math.min(1, dt * 6);
    var tx = pointer.inside ? -pointer.y * 0.22 : 0, ty = pointer.inside ? pointer.x * 0.32 : 0;
    tilt.x += (tx - tilt.x) * Math.min(1, dt * 3); tilt.y += (ty - tilt.y) * Math.min(1, dt * 3);
    var motion = reduced ? 'still' : state.data.motion;
    var ry = -0.32, rx = 0.14;
    if (motion === 'spin') { ry = t * (Math.PI * 2 / 14); rx = 0.1; }
    else if (motion === 'sway') { ry = -0.18 + Math.sin(t * 0.55) * 0.4; rx = 0.12 + Math.sin(t * 0.4) * 0.06; }
    group.rotation.set(rx + tilt.x, ry + tilt.y, 0);
    updateVoxels(t);
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    var t = now(), dt = Math.min(0.05, t - last); last = t;
    if (!visible || paused) return;
    frame(t, dt); renderer.render(scene, camera);
  }

  function fitCamera() {
    var w = container.clientWidth || 400, h = container.clientHeight || 400, aspect = w / h;
    camera.aspect = aspect;
    var tanV = Math.tan((camera.fov * Math.PI) / 360);
    var effAspect = Math.min(aspect, 0.85);
    // spinning: the widest the logo gets is its diagonal with the depth
    var halfW = (state.data.motion === 'spin' ? Math.hypot(size.w, size.d) : size.w) / 2, halfH = size.h / 2;
    var dist = Math.max(halfH / tanV, halfW / (tanV * effAspect)) * 1.75 + size.d / 2;
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
    camera.near = Math.max(0.1, dist / 50); camera.far = dist * 6;
    camera.updateProjectionMatrix();
  }
  function resize() {
    var w = container.clientWidth || 400, h = container.clientHeight || 400;
    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';
    fitCamera();
  }

  var LIGHT = {
    gloss: [1.0, 1.9, 1.0], matte: [1.9, 1.0, 0.4], chrome: [0.5, 1.4, 1.2],
    pearl: [1.3, 1.3, 0.9], toon: [1.1, 1.8, 0.0], neon: [0.25, 0.5, 0.6],
  };
  var pageBg = container.style.background;
  function applyMode() {
    var m = LIGHT[state.mode] ? state.mode : 'gloss', dark = m === 'neon';
    scene.background = null;
    container.style.background = dark ? neonAura(state.data.palette[0], true) : pageBg;
    scene.environment = m === 'gloss' || m === 'chrome' || m === 'pearl' ? glossEnv() : null;
    hemi.intensity = LIGHT[m][0]; key.intensity = LIGHT[m][1]; rim.intensity = LIGHT[m][2];
    hemi.groundColor.set(dark ? 0x221d33 : 0xd9d2c5);
    if (mesh) { mesh.material = mats[state.mode] || mats.gloss; colorAll(); }
  }

  // ---------- pointer ----------
  var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(), hit = new THREE.Vector3(), nrm = new THREE.Vector3();
  function onMove(ev) {
    var r = cv.getBoundingClientRect();
    pointer.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = ((ev.clientY - r.top) / r.height) * 2 - 1;
    ndc.set(pointer.x, -pointer.y);
    ray.setFromCamera(ndc, camera);
    nrm.set(0, 0, 1).applyQuaternion(group.quaternion);
    plane.setFromNormalAndCoplanarPoint(nrm, group.position);
    if (ray.ray.intersectPlane(plane, hit)) {
      group.worldToLocal(hit);
      pointer.lx = hit.x; pointer.ly = hit.y;
      var inLogo = Math.abs(hit.x) < size.w / 2 + U && Math.abs(hit.y) < size.h / 2 + U;
      hoverTarget = inLogo && !reduced ? 1 : 0;
    }
  }
  var lastBurst = -10;
  function burst() {
    var t = now();
    if (reduced || t - built < ASSEMBLE_END * 0.8 || t - lastBurst < BURST_LEN + 0.3) return;
    burstT = lastBurst = t; dirty = true;
  }
  cv.addEventListener('pointerenter', function (ev) { pointer.inside = true; if (ev.pointerType === 'mouse') burst(); });
  cv.addEventListener('pointermove', onMove);
  cv.addEventListener('pointerleave', function () { pointer.inside = false; hoverTarget = 0; });
  cv.addEventListener('click', burst);

  var ro = new ResizeObserver(resize); ro.observe(container);
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) {
      var en = es[0]; visible = en ? en.isIntersecting : true;
      // the cubes fly in when the block first comes into view, not while it is below the fold
      if (visible && waiting) { waiting = false; built = reduced ? -100 : now(); dirty = true; }
    }, { threshold: [0, 0.15] });
    io.observe(container);
  }

  var waiting = false;
  applyMode(); build();
  if (io && !reduced) { waiting = true; built = 1e9; }
  loop();

  // ---------- public ----------
  api.setData = function (d) {
    var shapeChanged = !state.data || d.rle !== state.data.rle || d.w !== state.data.w || d.depth !== state.data.depth;
    var motionChanged = d.motion !== state.data.motion;
    state.data = d;
    if (shapeChanged) build();
    else { colorAll(); if (motionChanged) fitCamera(); }
    if (state.mode === 'neon') container.style.background = neonAura(d.palette[0], true);
  };
  api.setMode = function (m) { state.mode = m; applyMode(); };
  api.replay = function () {
    var t = now(); waiting = false; burstT = -10; dirty = true;
    if (reduced) { built = -100; return; }
    dissolveT = t; built = t + DISSOLVE;
  };
  api.burst = function () { lastBurst = -10; burst(); };
  api.setPaused = function (pz) { paused = pz; };
  /** current frame on a transparent background (neon on its dark glow) */
  api.snapshot = function () {
    var t = now(); frame(t, 1 / 60); renderer.render(scene, camera);
    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;
    var ctx = out.getContext('2d');
    if (state.mode === 'neon') {
      var stops = neonAura(state.data.palette[0], false);
      ctx.save(); ctx.translate(out.width / 2, out.height / 2); ctx.scale(0.46, 0.4);
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(out.width, out.height));
      g.addColorStop(0, stops[0]); g.addColorStop(0.5, stops[1]); g.addColorStop(0.78, stops[2]); g.addColorStop(1, stops[3]);
      ctx.fillStyle = g; ctx.fillRect(-out.width * 1.2, -out.height * 1.3, out.width * 2.4, out.height * 2.6); ctx.restore();
    }
    ctx.drawImage(cv, 0, 0);
    return out;
  };
  /** for checks: skip the assembly */
  api.settle = function () { built = -100; burstT = -10; dirty = true; };
  api.count = function () { return N; };
  api.dispose = function () {
    cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect();
    if (mesh) mesh.dispose();
    cube.dispose(); Object.keys(mats).forEach(function (k) { mats[k].dispose(); });
    if (envTex) envTex.dispose();
    toonRamp.dispose(); container.style.background = pageBg;
    renderer.dispose(); cv.remove();
  };
  return api;
}
`;

// apps/fx/src/engine/logoEmbedGenerator.ts
var LOGO_EMBED_HEIGHT = 420;
var THREE_URLS3 = [
  "https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.min.js",
  "https://unpkg.com/three@0.174.0/build/three.module.min.js"
];
var BS3 = String.fromCharCode(92);
var LS3 = new RegExp(String.fromCharCode(8232), "g");
var PS3 = new RegExp(String.fromCharCode(8233), "g");
var safeJson3 = (v) => JSON.stringify(v).replace(/</g, BS3 + "u003c").replace(LS3, BS3 + "u2028").replace(PS3, BS3 + "u2029");
function generateLogoEmbedCode(o) {
  const id = "gridika-logo-" + Math.random().toString(36).slice(2, 8);
  const height = o.height ?? LOGO_EMBED_HEIGHT;
  const maxW = o.maxWidth ?? 480;
  const badge = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;right:12px;bottom:12px;z-index:5;font:600 11px system-ui,-apple-system,sans-serif;color:#64748b;text-decoration:none;background:rgba(255,255,255,0.85);padding:4px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)">Gridika</a>`;
  const runtime = logoRuntime_default.replace(/^export /gm, "");
  return `${codeHeader("3D-\u043B\u043E\u0433\u043E\u0442\u0438\u043F \u0438\u0437 \u0432\u043E\u043A\u0441\u0435\u043B\u0435\u0439", o.license)}
<div id="${id}" style="position:relative;width:100%;max-width:${maxW}px;height:${height}px;margin:0 auto;">${badge}</div>
<script type="module">${domainLockJs(`${id}-badge`, o.license.domain)}
var GRIDIKA = ${safeJson3({ data: o.data, mode: o.mode })};
${runtime}
(async function () {
  var el = document.getElementById("${id}");
  var THREE = null, urls = ${JSON.stringify(THREE_URLS3)};
  for (var i = 0; i < urls.length && !THREE; i++) { try { THREE = await import(urls[i]); } catch (e) {} }
  if (!THREE || !el) return;
  el.__gridika = createLogoViewer(THREE, el, { data: GRIDIKA.data, mode: GRIDIKA.mode });
})();
</script>`;
}

// raw-file:E:\Programming\temka\apps\fx\src\embed\morphRuntime.js
var morphRuntime_default = `/* Gridika \xB7 \u041C\u043E\u0440\u0444 \xAB\u0434\u043E / \u043F\u043E\u0441\u043B\u0435\xBB \u2014 runtime shared by the studio and the site snippet.
 * Plain JS without imports: three.js is passed in. Both pictures come as colour grids of the same
 * size (RGB565, base64), so the snippet carries no image files.
 *
 * data: { w, h, a: '<base64 RGB565>', b: '<base64 RGB565>', labels: ['\u0414\u043E', '\u041F\u043E\u0441\u043B\u0435'] | null,
 *         speed: 'slow' | 'normal' | 'fast', labelStyle: 'dark' | 'light', depth: 'flat' | 'deep',
 *         control: 'slider' | 'scroll' | 'auto', mode: 'wave' | 'burst' | 'pixel' }
 */

export var MORPH_MODES = {
  wave: { label: '\u0412\u043E\u043B\u043D\u0430' },
  burst: { label: '\u0412\u0437\u0440\u044B\u0432' },
  pixel: { label: '\u041F\u0438\u043A\u0441\u0435\u043B\u044C' },
  spiral: { label: '\u0421\u043F\u0438\u0440\u0430\u043B\u044C' },
  rain: { label: '\u0414\u043E\u0436\u0434\u044C' },
  mosaic: { label: '\u041C\u043E\u0437\u0430\u0438\u043A\u0430' },
};
var SPEED = { slow: 1.6, normal: 1, fast: 0.6 };

/** base64 RGB565 \u2192 Float32Array of sRGB 0..1 triples */
export function decodeMorphGrid(s, n) {
  var bin = atob(s), out = new Float32Array(n * 3);
  for (var i = 0; i < n; i++) {
    var v = bin.charCodeAt(i * 2) | (bin.charCodeAt(i * 2 + 1) << 8);
    out[i * 3] = ((v >> 11) & 31) / 31;
    out[i * 3 + 1] = ((v >> 5) & 63) / 63;
    out[i * 3 + 2] = (v & 31) / 31;
  }
  return out;
}

export function createMorphViewer(THREE, container, init) {
  var U = 0.5;
  var state = { data: init.data };
  var api = {};
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function rnd(i) { var n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }

  // ---------- renderer / scene ----------
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
  } catch (e1) {
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true }); } catch (e2) {
      console.warn('Morph WebGLRenderer init failed:', e2);
      var noop = function () {};
      return { setData: noop, setProgress: noop, setPaused: noop, snapshot: function () { return document.createElement('canvas'); }, dispose: noop };
    }
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.appendChild(renderer.domElement);
  var cv = renderer.domElement;
  cv.style.display = 'block'; cv.style.width = '100%'; cv.style.height = '100%'; cv.style.touchAction = 'pan-y';

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(28, 1, 0.1, 500);
  var group = new THREE.Group(); scene.add(group);
  var D = U * 0.6, cube = null;
  function depthOf(d) { return d.depth === 'deep' ? U * 1.6 : U * 0.6; }

  // Unlit colours with a fixed shade per face: the face looking at the camera keeps the exact photo
  // colour, sides and tops darken a little so lifted cubes read as 3D.
  var mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  mat.onBeforeCompile = function (sh) {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\\nvarying vec3 vViewN;')
      .replace('#include <begin_vertex>', [
        '#include <begin_vertex>',
        'vec3 nn = normal;',
        '#ifdef USE_INSTANCING',
        'nn = mat3(instanceMatrix) * nn;',
        '#endif',
        'vViewN = normalize(normalMatrix * nn);',
      ].join('\\n'));
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\\nvarying vec3 vViewN;')
      .replace('#include <color_fragment>', [
        '#include <color_fragment>',
        'vec3 n = normalize(vViewN);',
        'float shade = 0.58 + 0.42 * max(n.z, 0.0) + 0.12 * n.y;',
        'diffuseColor.rgb *= clamp(shade, 0.4, 1.0);',
      ].join('\\n'));
  };
  mat.customProgramCacheKey = function () { return 'gridika-morph-faces'; };

  // ---------- overlay: labels, slider, scroll hint, autoplay pill (plain DOM on top of the canvas) ----------
  var css = [
    '.gmx{position:absolute;inset:0;pointer-events:none;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#fff}',
    '.gmx-chip{position:absolute;top:12px;padding:5px 11px;border-radius:999px;background:rgba(18,16,26,.5);font-size:12px;font-weight:700;letter-spacing:.02em;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:opacity .3s}',
    '.gmx-light .gmx-chip{background:rgba(255,255,255,.88);color:#1d1a24;box-shadow:0 2px 10px rgba(0,0,0,.12)}',
    '.gmx-glass{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;border-radius:999px;background:rgba(18,16,26,.42);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 0 0 1px rgba(255,255,255,.14);transition:opacity .45s,transform .45s}',
    '.gmx-slider{width:min(68%,400px);height:44px;padding:0 22px;box-sizing:border-box;pointer-events:auto;cursor:grab;touch-action:none;outline:none}',
    '.gmx-slider:focus-visible{box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 0 0 2px #fff}',
    '.gmx-track{position:relative;flex:1;height:6px;border-radius:6px;background:rgba(255,255,255,.26)}',
    '.gmx-fill{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:linear-gradient(90deg,rgba(255,255,255,.55),#fff)}',
    '.gmx-knob{position:absolute;top:50%;width:32px;height:32px;margin:-16px 0 0 -16px;border-radius:50%;background:#fff;color:#221d2c;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.32),0 0 0 5px rgba(255,255,255,.22);transition:transform .18s cubic-bezier(.34,1.56,.64,1)}',
    '.gmx-slider:hover .gmx-knob{transform:scale(1.08)}',
    '.gmx-drag{cursor:grabbing}.gmx-drag .gmx-knob{transform:scale(.92)}',
    '.gmx-hint{padding:8px 15px 8px 11px;font-size:12.5px;font-weight:600;white-space:nowrap}',
    '.gmx-mouse{position:relative;width:15px;height:23px;border:2px solid #fff;border-radius:9px;box-sizing:border-box;flex:none}',
    '.gmx-mouse:after{content:"";position:absolute;left:50%;top:4px;width:2px;height:5px;margin-left:-1px;border-radius:2px;background:#fff;animation:gmx-wheel 1.5s ease-in-out infinite}',
    '@keyframes gmx-wheel{0%{transform:translateY(0);opacity:1}65%{transform:translateY(7px);opacity:0}100%{transform:translateY(7px);opacity:0}}',
    '.gmx-auto{padding:6px 15px 6px 6px;font-size:12px;font-weight:600;pointer-events:auto;white-space:nowrap;max-width:calc(100% - 24px);box-sizing:border-box}',
    '.gmx-auto [data-t]{overflow:hidden;text-overflow:ellipsis}',
    '.gmx-hint{max-width:calc(100% - 24px);box-sizing:border-box}',
    '.gmx-play{width:28px;height:28px;border-radius:50%;border:0;background:#fff;color:#221d2c;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none;padding:0}',
    '.gmx-mini{position:relative;width:56px;height:4px;border-radius:4px;background:rgba(255,255,255,.28);overflow:hidden;flex:none}',
    '.gmx-mini i{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:#fff}',
    '.gmx-slider,.gmx-auto{opacity:.45}',
    '.gmx-on .gmx-slider,.gmx-on .gmx-auto,.gmx-slider:focus-visible,.gmx-drag{opacity:1}',
    '.gmx-swipe{position:relative;width:14px;height:26px;flex:none}',
    '.gmx-swipe:before{content:"";position:absolute;left:50%;top:3px;bottom:3px;width:2px;margin-left:-1px;border-radius:2px;background:rgba(255,255,255,.35)}',
    '.gmx-swipe i{position:absolute;left:50%;top:14px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.28);animation:gmx-swipe 1.6s ease-in-out infinite}',
    '.gmx-rev .gmx-swipe i{animation-name:gmx-swipe-down}',
    '@keyframes gmx-swipe{0%{top:14px;opacity:0}20%{top:14px;opacity:1}75%{top:0;opacity:1}100%{top:0;opacity:0}}',
    '@keyframes gmx-swipe-down{0%{top:0;opacity:0}20%{top:0;opacity:1}75%{top:14px;opacity:1}100%{top:14px;opacity:0}}',
    '@media (prefers-reduced-motion: reduce){.gmx-mouse:after,.gmx-swipe i{animation:none}}',
  ].join('');
  var ui = document.createElement('div');
  ui.className = 'gmx';
  ui.innerHTML = '<style>' + css + '</style>';
  container.appendChild(ui);
  var el = function (tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html) x.innerHTML = html; ui.appendChild(x); return x; };
  var chipA = el('span', 'gmx-chip'), chipB = el('span', 'gmx-chip');
  chipA.style.left = '12px'; chipB.style.right = '12px';
  var CHEV = '<svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2 1 6l4 4M11 2l4 4-4 4"/></svg>';
  // slider
  var bar = el('div', 'gmx-glass gmx-slider', '<div class="gmx-track"><div class="gmx-fill"></div><div class="gmx-knob">' + CHEV + '</div></div>');
  bar.setAttribute('role', 'slider'); bar.setAttribute('aria-label', '\u0414\u043E / \u043F\u043E\u0441\u043B\u0435'); bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', '100'); bar.tabIndex = 0;
  var track = bar.querySelector('.gmx-track'), fill = bar.querySelector('.gmx-fill'), knob = bar.querySelector('.gmx-knob');
  // scroll: how to use it, and how far it has gone
  var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var hint = el('div', 'gmx-glass gmx-hint', (touch ? '<span class="gmx-swipe"><i></i></span>' : '<span class="gmx-mouse"></span>') + '<span data-h></span>');
  var hintText = hint.querySelector('[data-h]');
  var HINT_DOWN = touch ? '\u041B\u0438\u0441\u0442\u0430\u0439\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443' : '\u041F\u0440\u043E\u043A\u0440\u0443\u0442\u0438\u0442\u0435 \u0432\u043D\u0438\u0437', HINT_UP = touch ? '\u041B\u0438\u0441\u0442\u0430\u0439\u0442\u0435 \u043D\u0430\u0437\u0430\u0434 \u2014 \u0432\u0435\u0440\u043D\u0443\u0442\u044C' : '\u041F\u0440\u043E\u043A\u0440\u0443\u0442\u0438\u0442\u0435 \u0432\u0432\u0435\u0440\u0445 \u2014 \u0432\u0435\u0440\u043D\u0443\u0442\u044C';
  // autoplay: pause / play and where it is
  var PLAY = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>';
  var PAUSE = '<svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="1.5" width="3" height="9" rx="1" fill="currentColor"/><rect x="7" y="1.5" width="3" height="9" rx="1" fill="currentColor"/></svg>';
  var auto = el('div', 'gmx-glass gmx-auto', '<button type="button" class="gmx-play" aria-label="\u041F\u0430\u0443\u0437\u0430">' + PAUSE + '</button><span class="gmx-mini"><i></i></span><span data-t>\u041C\u0435\u043D\u044F\u0435\u0442\u0441\u044F \u0441\u0430\u043C\u043E</span>');
  auto.title = '\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u0444\u043E\u0442\u043E, \u0447\u0442\u043E\u0431\u044B \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u0440\u0430\u0437\u0443';
  var playBtn = auto.querySelector('.gmx-play'), autoFill = auto.querySelector('.gmx-mini i'), autoText = auto.querySelector('[data-t]');
  var autoPaused = false;

  // the controls stay dim until the visitor comes to the block (hover, touch, keyboard)
  var quietTimer = 0;
  function wake(ms) {
    clearTimeout(quietTimer);
    ui.classList.add('gmx-on');
    if (ms) quietTimer = setTimeout(function () { if (!dragging && !canvasDrag) ui.classList.remove('gmx-on'); }, ms);
  }
  container.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse') wake(0); });
  container.addEventListener('pointerleave', function (ev) { if (ev.pointerType === 'mouse') wake(1200); });
  container.addEventListener('pointerdown', function (ev) { if (ev.pointerType !== 'mouse') wake(2500); });
  container.addEventListener('focusin', function () { wake(0); });
  container.addEventListener('focusout', function () { wake(1200); });

  // ---------- grid ----------
  var mesh = null, N = 0, colA, colB, delay, rx, ry, dirX, dirY, amp, curFace;
  var size = { w: 1, h: 1 };
  var col = new THREE.Color();

  function build() {
    if (mesh) { group.remove(mesh); mesh.dispose(); mesh = null; }
    var d = state.data;
    N = d.w * d.h;
    size = { w: d.w * U, h: d.h * U };
    if (cube) cube.dispose();
    D = depthOf(d);
    cube = new THREE.BoxGeometry(U, U, D);
    colA = decodeMorphGrid(d.a, N); colB = decodeMorphGrid(d.b, N);
    mesh = new THREE.InstancedMesh(cube, mat, N);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    delay = new Float32Array(N); rx = new Float32Array(N); ry = new Float32Array(N);
    dirX = new Float32Array(N); dirY = new Float32Array(N); amp = new Float32Array(N);
    curFace = new Int8Array(N).fill(-1);
    var cx = (d.w - 1) / 2, cy = (d.h - 1) / 2, maxR = Math.hypot(cx, cy) || 1;
    for (var y = 0, i = 0; y < d.h; y++) {
      for (var x = 0; x < d.w; x++, i++) {
        rx[i] = (x - cx) * U; ry[i] = (cy - y) * U;
        var dx = x - cx, dy = cy - y, dl = Math.hypot(dx, dy) || 1;
        dirX[i] = dx / dl; dirY[i] = dy / dl; amp[i] = 0.5 + rnd(i + 3) * 0.8;
      }
    }
    setDelays();
    group.add(mesh);
    lastP = -1;
    resize();
  }
  function setDelays() {
    var d = state.data, cx = (d.w - 1) / 2, cy = (d.h - 1) / 2, maxR = Math.hypot(cx, cy) || 1;
    for (var y = 0, i = 0; y < d.h; y++) {
      for (var x = 0; x < d.w; x++, i++) {
        var fx = x / Math.max(1, d.w - 1), fy = y / Math.max(1, d.h - 1);
        if (d.mode === 'burst') delay[i] = (Math.hypot(x - cx, y - cy) / maxR) * 0.75 + rnd(i + 11) * 0.25;
        else if (d.mode === 'pixel') delay[i] = fy * 0.7 + fx * 0.15 + rnd(i + 13) * 0.15;
        else if (d.mode === 'spiral') {
          // a spiral arm sweeping out from the centre
          var ang = (Math.atan2(cy - y, x - cx) + Math.PI) / (Math.PI * 2);
          delay[i] = (Math.hypot(x - cx, y - cy) / maxR) * 0.55 + ang * 0.35 + rnd(i + 19) * 0.1;
        }
        else if (d.mode === 'rain') delay[i] = fx * 0.2 + fy * 0.25 + rnd(i + 23) * 0.55;
        else if (d.mode === 'mosaic') delay[i] = rnd(i + 29);
        else delay[i] = fx * 0.88 + rnd(i + 17) * 0.12;
      }
    }
  }

  // ---------- progress ----------
  var P = 0, target = 0, lastP = -1, dragging = false, uiDirty = true;
  var m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  function windowFor(mode) {
    return mode === 'pixel' ? 0.3 : mode === 'burst' ? 0.5 : mode === 'spiral' ? 0.42 : mode === 'rain' ? 0.4 : mode === 'mosaic' ? 0.22 : 0.36;
  }

  function place(Pv) {
    if (!mesh) return;
    var mode = state.data.mode, L = windowFor(mode);
    for (var i = 0; i < N; i++) {
      var l = clamp01((Pv - delay[i] * (1 - L)) / L), s = Math.sin(Math.PI * l);
      var x = rx[i], y = ry[i], z = 0, ax = 0, ay = 0, az = 0, face;
      if (mode === 'pixel') {
        var k = easeInOut(l); ax = Math.PI * k; z = s * D * 1.2; face = k < 0.5 ? 0 : 1;
      } else if (mode === 'burst') {
        var a = amp[i];
        x += dirX[i] * s * U * 5 * a; y += dirY[i] * s * U * 5 * a; z = s * U * 9 * a;
        ax = s * (rnd(i + 21) - 0.5) * 5; ay = s * (rnd(i + 23) - 0.5) * 5; face = l < 0.5 ? 0 : 1;
      } else if (mode === 'spiral') {
        // the cube is carried round the centre and lifted, then set down in the new picture
        var th = s * 1.4, cs = Math.cos(th), sn = Math.sin(th);
        x = rx[i] * cs - ry[i] * sn; y = rx[i] * sn + ry[i] * cs;
        z = s * U * 4.5 * amp[i]; az = s * 1.6; ax = s * 0.4; face = l < 0.5 ? 0 : 1;
      } else if (mode === 'rain') {
        // the old cube falls away, the new one drops in from above
        if (l < 0.5) { var kf = l * 2; y -= kf * kf * U * 16; z = kf * U * 2; ax = kf * 1.4; face = 0; }
        else { var kr = (l - 0.5) * 2, er = 1 - (1 - kr) * (1 - kr) * (1 - kr); y += (1 - er) * U * 16; z = (1 - er) * U * 2; ax = -(1 - er) * 1.4; face = 1; }
        if (l <= 0) face = 0;
      } else if (mode === 'mosaic') {
        var km = easeInOut(l); ay = Math.PI * km; z = s * D * 1.4; face = km < 0.5 ? 0 : 1;
      } else {
        z = s * U * 3.2; ay = s * 0.5; ax = -s * 0.25; face = l < 0.5 ? 0 : 1;
      }
      e.set(ax, ay, az); q.setFromEuler(e); p.set(x, y, z);
      m4.compose(p, q, one); mesh.setMatrixAt(i, m4);
      if (face !== curFace[i]) {
        var c = face ? colB : colA;
        col.setRGB(c[i * 3], c[i * 3 + 1], c[i * 3 + 2], THREE.SRGBColorSpace);
        mesh.setColorAt(i, col); curFace[i] = face;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  function updateUi() {
    var d = state.data, labels = d.labels, c = d.control;
    ui.classList.toggle('gmx-light', d.labelStyle === 'light');
    chipA.textContent = labels ? labels[0] : ''; chipB.textContent = labels ? labels[1] : '';
    chipA.style.display = labels && labels[0] ? '' : 'none'; chipB.style.display = labels && labels[1] ? '' : 'none';
    chipA.style.opacity = String(1 - smooth(clamp01(P * 1.6))); chipB.style.opacity = String(smooth(clamp01(P * 1.6 - 0.6)));
    bar.style.display = c === 'slider' ? '' : 'none';
    fill.style.width = (P * 100).toFixed(2) + '%'; knob.style.left = (P * 100).toFixed(2) + '%';
    bar.setAttribute('aria-valuenow', String(Math.round(P * 100)));
    // scroll: the hint says which way to scroll; it hides while the picture is changing
    hint.style.display = c === 'scroll' ? '' : 'none';
    if (c === 'scroll') {
      var moving = P > 0.02 && P < 0.98;
      hintText.textContent = target > 0.5 ? HINT_UP : HINT_DOWN;
      hint.classList.toggle('gmx-rev', target > 0.5);
      hint.style.opacity = moving ? '0' : '1';
      hint.style.transform = 'translateX(-50%) translateY(' + (moving ? '10px' : '0') + ')';
    }
    auto.style.display = c === 'auto' ? '' : 'none';
    autoFill.style.width = (P * 100).toFixed(2) + '%';
  }

  // ---------- controls ----------
  function setFromClientX(clientX, el) {
    var r = el.getBoundingClientRect();
    target = clamp01((clientX - r.left) / r.width);
  }
  bar.addEventListener('pointerdown', function (ev) { dragging = true; bar.classList.add('gmx-drag'); bar.setPointerCapture(ev.pointerId); setFromClientX(ev.clientX, track); });
  bar.addEventListener('pointermove', function (ev) { if (dragging) setFromClientX(ev.clientX, track); });
  var endDrag = function () { dragging = false; bar.classList.remove('gmx-drag'); };
  bar.addEventListener('pointerup', endDrag);
  bar.addEventListener('pointercancel', endDrag);
  bar.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') { target = clamp01(target + 0.1); ev.preventDefault(); }
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') { target = clamp01(target - 0.1); ev.preventDefault(); }
  });
  // dragging across the picture moves the transition too (slider mode)
  var canvasDrag = false;
  // mouse: press and drag; finger: only a sideways swipe moves the transition, an up/down swipe scrolls the page
  var touchStart = null;
  cv.addEventListener('pointerdown', function (ev) {
    if (state.data.control !== 'slider') return;
    if (ev.pointerType === 'mouse') { canvasDrag = true; cv.setPointerCapture(ev.pointerId); setFromClientX(ev.clientX, cv); }
    else touchStart = { x: ev.clientX, y: ev.clientY, id: ev.pointerId };
  });
  cv.addEventListener('pointermove', function (ev) {
    if (canvasDrag) return setFromClientX(ev.clientX, cv);
    if (!touchStart) return;
    var dx = ev.clientX - touchStart.x, dy = ev.clientY - touchStart.y;
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      canvasDrag = true; touchStart = null;
      try { cv.setPointerCapture(ev.pointerId); } catch (e) {}
      wake(2500); setFromClientX(ev.clientX, cv);
    } else if (Math.abs(dy) > 10) touchStart = null;
  });
  var endCanvasDrag = function () { canvasDrag = false; touchStart = null; };
  cv.addEventListener('pointerup', endCanvasDrag);
  cv.addEventListener('pointercancel', endCanvasDrag);
  cv.addEventListener('click', function () {
    // autoplay: a click on the picture flips to the other one right away
    if (state.data.control !== 'auto') return;
    if (autoPaused) setAutoPaused(false);
    autoT0 = now() - (P > 0.5 ? AUTO.hold * 2 + AUTO.morph : AUTO.hold);
  });
  function setAutoPaused(v) {
    autoPaused = v;
    playBtn.innerHTML = v ? PLAY : PAUSE;
    playBtn.setAttribute('aria-label', v ? '\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C' : '\u041F\u0430\u0443\u0437\u0430');
    autoText.textContent = v ? '\u041F\u0430\u0443\u0437\u0430' : '\u041C\u0435\u043D\u044F\u0435\u0442\u0441\u044F \u0441\u0430\u043C\u043E';
    // resume from where it stopped: the next phase that starts at this picture
    if (!v) autoT0 = now() - (P > 0.5 ? AUTO.hold + AUTO.morph : 0);
  }
  playBtn.addEventListener('click', function (ev) { ev.stopPropagation(); setAutoPaused(!autoPaused); });

  var AUTO = { hold: 1.6, morph: 2.2 }, autoT0 = 0;
  function sp() { return SPEED[state.data.speed] || 1; }
  function syncSpeed() { AUTO.hold = 1.6 * sp(); AUTO.morph = 2.2 * sp(); }
  function autoTarget(t) {
    var cyc = AUTO.hold * 2 + AUTO.morph * 2, u = ((t - autoT0) % cyc + cyc) % cyc;
    if (u < AUTO.hold) return 0;
    if (u < AUTO.hold + AUTO.morph) return easeInOut((u - AUTO.hold) / AUTO.morph);
    if (u < AUTO.hold * 2 + AUTO.morph) return 1;
    return 1 - easeInOut((u - AUTO.hold * 2 - AUTO.morph) / AUTO.morph);
  }
  var lastScrollY = window.scrollY, scrollAcc = 0;
  function onScroll() {
    if (state.data.control !== 'scroll' || !visible) { lastScrollY = window.scrollY; return; }
    var dy = window.scrollY - lastScrollY; lastScrollY = window.scrollY;
    if (dy === 0) return;
    // a new direction starts counting anew
    if ((dy > 0) !== (scrollAcc > 0)) scrollAcc = 0;
    scrollAcc += dy;
    if (scrollAcc > 24) target = 1;
    else if (scrollAcc < -24) target = 0;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- animation ----------
  var t0 = performance.now(), last = 0, raf = 0, paused = false, visible = true, manual = false;
  function now() { return (performance.now() - t0) / 1000; }

  function frame(t, dt) {
    if (!mesh) return;
    var c = state.data.control;
    if (!manual) {
      if (c === 'auto') { if (!autoPaused) target = reduced ? (Math.floor(t / 4) % 2) : autoTarget(t); }
    }
    if (reduced) P = target;
    // scroll: an even pace, the whole change takes ~1.5 s; the rest follows the target softly
    else if (c === 'scroll' && !manual) { var pace = dt / (1.5 * sp()); P += Math.max(-pace, Math.min(pace, target - P)); }
    else P += (target - P) * Math.min(1, dt * (c === 'auto' ? 30 : 9));
    if (Math.abs(target - P) < 0.0005) P = target;
    if (P !== lastP) { place(P); lastP = P; updateUi(); }
    else if (uiDirty) { updateUi(); }
    uiDirty = false;
  }
  function loop() {
    raf = requestAnimationFrame(loop);
    var t = now(), dt = Math.min(0.05, t - last); last = t;
    if (!visible || paused) return;
    frame(t, dt); renderer.render(scene, camera);
  }

  function resize() {
    var w = container.clientWidth || 400, h = container.clientHeight || 300, aspect = w / h;
    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';
    camera.aspect = aspect;
    var tanV = Math.tan((camera.fov * Math.PI) / 360);
    // the picture stays flat and fills the frame edge to edge: the front faces sit right on its border
    var dist = Math.max(size.h / 2 / tanV, size.w / 2 / (tanV * aspect)) + D / 2;
    camera.position.set(0, 0, dist); camera.lookAt(0, 0, 0);
    camera.near = dist / 50; camera.far = dist * 4; camera.updateProjectionMatrix();
  }

  var ro = new ResizeObserver(resize); ro.observe(container);
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) { var en = es[0]; visible = en ? en.isIntersecting : true; }, { threshold: [0, 0.01] });
    io.observe(container);
  }

  syncSpeed(); build(); place(0); updateUi(); loop();

  // ---------- public ----------
  api.setData = function (d) {
    var gridChanged = !state.data || d.w !== state.data.w || d.h !== state.data.h || d.a !== state.data.a || d.b !== state.data.b || d.depth !== state.data.depth;
    var modeChanged = d.mode !== state.data.mode;
    state.data = d;
    if (gridChanged) build();
    else if (modeChanged) setDelays();
    curFace.fill(-1); lastP = -1; uiDirty = true;
    scrollAcc = 0; lastScrollY = window.scrollY;
    if (d.control === 'scroll' && !manual) target = 0;
    syncSpeed();
    if (d.control === 'auto') { autoT0 = now(); setAutoPaused(false); }
    manual = false;
  };
  /** studio / checks: hold the transition at a point (0 = before, 1 = after) */
  api.setProgress = function (v, instant) { manual = true; target = clamp01(v); if (instant) { P = target; lastP = -1; } };
  api.release = function () { manual = false; if (state.data.control === 'auto') autoT0 = now(); };
  api.setPaused = function (pz) { paused = pz; };
  api.snapshot = function () {
    frame(now(), 1 / 60); renderer.render(scene, camera);
    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;
    out.getContext('2d').drawImage(cv, 0, 0);
    return out;
  };
  api.dispose = function () {
    cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect(); window.removeEventListener('scroll', onScroll);
    if (mesh) mesh.dispose(); cube.dispose(); mat.dispose(); renderer.dispose(); cv.remove(); ui.remove();
  };
  return api;
}
`;

// apps/fx/src/engine/morphEmbedGenerator.ts
var THREE_URLS4 = [
  "https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.min.js",
  "https://unpkg.com/three@0.174.0/build/three.module.min.js"
];
var BS4 = String.fromCharCode(92);
var LS4 = new RegExp(String.fromCharCode(8232), "g");
var PS4 = new RegExp(String.fromCharCode(8233), "g");
var safeJson4 = (v) => JSON.stringify(v).replace(/</g, BS4 + "u003c").replace(LS4, BS4 + "u2028").replace(PS4, BS4 + "u2029");
function generateMorphEmbedCode(o) {
  const id = "gridika-morph-" + Math.random().toString(36).slice(2, 8);
  const maxW = o.maxWidth ?? 480;
  const badge = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;right:12px;bottom:52px;z-index:5;font:600 11px system-ui,-apple-system,sans-serif;color:#64748b;text-decoration:none;background:rgba(255,255,255,0.85);padding:4px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)">Gridika</a>`;
  const runtime = morphRuntime_default.replace(/^export /gm, "");
  return `${codeHeader("\u043C\u043E\u0440\u0444 \xAB\u0434\u043E / \u043F\u043E\u0441\u043B\u0435\xBB", o.license)}
<div id="${id}" style="position:relative;width:100%;max-width:${maxW}px;aspect-ratio:${o.data.w}/${o.data.h};margin:0 auto;border-radius:18px;overflow:hidden;">${badge}</div>
<script type="module">${domainLockJs(`${id}-badge`, o.license.domain)}
var GRIDIKA = ${safeJson4({ data: o.data })};
${runtime}
(async function () {
  var el = document.getElementById("${id}");
  var THREE = null, urls = ${JSON.stringify(THREE_URLS4)};
  for (var i = 0; i < urls.length && !THREE; i++) { try { THREE = await import(urls[i]); } catch (e) {} }
  if (!THREE || !el) return;
  el.__gridika = createMorphViewer(THREE, el, { data: GRIDIKA.data });
})();
</script>`;
}

// raw-file:E:\Programming\temka\apps\fx\src\embed\timerRuntime.js
var timerRuntime_default = `/* Gridika \xB7 \u0422\u0430\u0439\u043C\u0435\u0440 \u0430\u043A\u0446\u0438\u0438 \u2014 runtime shared by the studio and the site snippet.\r
 * Plain JS without imports: three.js is passed in. Digits are a 5\xD77 pixel font turned into cubes;\r
 * when a digit changes, the cubes the new digit does not need fly away, the missing ones fly in,\r
 * the shared ones stay. Time is counted from an absolute moment (UTC ms), not from page load.\r
 *\r
 * data: { end: <UTC ms>, format: 'dhms' | 'hms' | 'dhm', title: '', button: { text, url } | null,\r
 *         personal: <hours> | 0 \u2014 "N hours from this visitor's first visit" (remembered in their browser), pid: '<id>',\r
 *         endAction: 'text' | 'link' | 'hide', endText: '', endUrl: '', mode: 'sale' | 'launch' | 'newyear' }\r
 */\r
\r
export var TIMER_MODES = {\r
  sale: { label: '\u0420\u0430\u0441\u043F\u0440\u043E\u0434\u0430\u0436\u0430', digit: '#e8343f', colon: '#ffc83d', podium: '#ffc83d', podiumEdge: '#f0a91b', title: '#2a1416', btn: '#e8343f', btnText: '#ffffff', confetti: ['#e8343f', '#ffc83d', '#ffffff', '#ff8a3d'] },\r
  launch: { label: '\u0417\u0430\u043F\u0443\u0441\u043A', digit: '#35e0b0', colon: '#7c8cff', podium: '#1f2a33', podiumEdge: '#2c3b47', title: '#0f2a24', btn: '#16a37f', btnText: '#ffffff', confetti: ['#35e0b0', '#7c8cff', '#ffffff', '#c7f9ea'] },\r
  newyear: { label: '\u041D\u043E\u0432\u044B\u0439 \u0433\u043E\u0434', digit: '#1f9a57', colon: '#f2c14e', podium: '#f2c14e', podiumEdge: '#d9a630', title: '#123222', btn: '#1f9a57', btnText: '#ffffff', confetti: ['#1f9a57', '#f2c14e', '#ffffff', '#e8343f'], fall: '#ffffff' },\r
  blackfriday: { label: '\u0427\u0451\u0440\u043D\u0430\u044F \u043F\u044F\u0442\u043D\u0438\u0446\u0430', digit: '#17171d', colon: '#ff2e88', podium: '#ff2e88', podiumEdge: '#e0207a', title: '#17171d', btn: '#17171d', btnText: '#ffffff', confetti: ['#ff2e88', '#17171d', '#ffffff', '#ffd23f'] },\r
  minimal: { label: '\u041C\u0438\u043D\u0438\u043C\u0430\u043B', digit: '#2b2b33', colon: '#b9b2a6', podium: '#ece6da', podiumEdge: '#ddd5c6', title: '#2b2b33', btn: '#2b2b33', btnText: '#ffffff', confetti: ['#2b2b33', '#b9b2a6', '#ffffff'] },\r
  spring: { label: '\u0412\u0435\u0441\u043D\u0430', digit: '#ec5c9a', colon: '#a78bfa', podium: '#fde2ef', podiumEdge: '#f7c6dc', title: '#5b1f45', btn: '#ec4899', btnText: '#ffffff', confetti: ['#ec5c9a', '#a78bfa', '#ffffff', '#fbcfe8'], fall: '#fbcfe8' },\r
};\r
\r
var FONT = {\r
  0: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],\r
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],\r
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],\r
  3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],\r
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],\r
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],\r
  6: ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],\r
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],\r
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],\r
  9: ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],\r
};\r
function bit(d, c) { return FONT[d][Math.floor(c / 5)][c % 5] === '1'; }\r
\r
/** time left as digits: [[d,d],[h,h],[m,m],[s,s]] (days left out for 'hms') */\r
export function timerParts(endMs, nowMs, format) {\r
  var s = Math.max(0, Math.floor((endMs - nowMs) / 1000));\r
  var d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;\r
  var two = function (v) { v = Math.min(99, v); return [Math.floor(v / 10), v % 10]; };\r
  if (format === 'hms') return { left: s, groups: [two(Math.min(99, Math.floor(s / 3600))), two(m), two(sec)] };\r
  if (format === 'dhm') return { left: s, groups: [two(d), two(h), two(m)] };\r
  return { left: s, groups: [two(d), two(h), two(m), two(sec)] };\r
}\r
\r
var GROUP_LABELS = { dhms: ['\u0434\u043D\u0435\u0439', '\u0447\u0430\u0441\u043E\u0432', '\u043C\u0438\u043D\u0443\u0442', '\u0441\u0435\u043A\u0443\u043D\u0434'], hms: ['\u0447\u0430\u0441\u043E\u0432', '\u043C\u0438\u043D\u0443\u0442', '\u0441\u0435\u043A\u0443\u043D\u0434'], dhm: ['\u0434\u043D\u0435\u0439', '\u0447\u0430\u0441\u043E\u0432', '\u043C\u0438\u043D\u0443\u0442'] };\r
\r
/** personal countdown: the end is this visitor's first visit + N hours (kept in their browser) */\r
function personalEnd(data, studio, studioStart) {\r
  var span = data.personal * 3600000;\r
  if (studio) return studioStart + span;\r
  var key = 'gridika-timer-' + (data.pid || 'x'), first = 0;\r
  try { first = parseInt(localStorage.getItem(key) || '0', 10) || 0; } catch (e) {}\r
  if (!first) { first = Date.now(); try { localStorage.setItem(key, String(first)); } catch (e) {} }\r
  return first + span;\r
}\r
\r
export function createTimerViewer(THREE, container, init) {\r
  var U = 0.5;\r
  var state = { data: init.data, previewEnd: false, studio: !!init.studio };\r
  var api = {};\r
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;\r
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }\r
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }\r
  function easeOutBack(t) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }\r
  function rnd(i) { var n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }\r
  function pal() { return TIMER_MODES[state.data.mode] || TIMER_MODES.sale; }\r
\r
  // ---------- DOM: title / stage (canvas + labels + final text) / button ----------\r
  var css = [\r
    '.gtm{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:center}',\r
    '.gtm-title{font-weight:800;font-size:clamp(16px,2.6vw,24px);line-height:1.2;margin:0 0 6px;letter-spacing:-.01em;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;padding:0 8px}',\r
    '.gtm-stage{position:relative;width:100%}',\r
    '.gtm-stage canvas{display:block;width:100%;height:100%}',\r
    '.gtm-labels{position:absolute;inset:0;pointer-events:none}',\r
    '.gtm-labels span{position:absolute;transform:translateX(-50%);font-size:clamp(10px,1.5vw,13px);font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.55;transition:opacity .4s}',\r
    '.gtm-end{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 16px;overflow-wrap:anywhere;text-align:center;font-weight:900;font-size:clamp(22px,5vw,46px);letter-spacing:-.02em;line-height:1.1;opacity:0;transform:scale(.9);transition:opacity .6s,transform .7s cubic-bezier(.34,1.56,.64,1);pointer-events:none}',\r
    '.gtm-flash{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(255,255,255,.95),rgba(255,255,255,0) 70%);opacity:0;pointer-events:none}',\r
    '.gtm-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;padding:13px 24px;max-width:calc(100% - 16px);overflow-wrap:anywhere;text-align:center;border-radius:999px;font-weight:800;font-size:15px;text-decoration:none;box-shadow:0 10px 24px -10px rgba(0,0,0,.45);transition:transform .2s,filter .2s}',\r
    '.gtm-btn:hover{transform:translateY(-1px);filter:brightness(1.06)}',\r
  ].join('');\r
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';\r
  var root = document.createElement('div');\r
  root.className = 'gtm';\r
  root.innerHTML = '<style>' + css + '</style><div class="gtm-title"></div><div class="gtm-stage"><div class="gtm-labels"></div><div class="gtm-flash"></div><div class="gtm-end"></div></div><a class="gtm-btn" target="_top"></a>';\r
  container.appendChild(root);\r
  var titleEl = root.querySelector('.gtm-title'), stage = root.querySelector('.gtm-stage'), labelsEl = root.querySelector('.gtm-labels');\r
  var flashEl = root.querySelector('.gtm-flash'), endEl = root.querySelector('.gtm-end'), btnEl = root.querySelector('.gtm-btn');\r
\r
  // ---------- renderer / scene ----------\r
  var renderer;\r
  try {\r
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });\r
  } catch (e1) {\r
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true }); } catch (e2) {\r
      console.warn('Timer WebGLRenderer init failed:', e2);\r
      var noop = function () {};\r
      return { setData: noop, previewEnd: noop, setPaused: noop, snapshot: function () { return document.createElement('canvas'); }, dispose: noop };\r
    }\r
  }\r
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));\r
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;\r
  stage.insertBefore(renderer.domElement, labelsEl);\r
  var cv = renderer.domElement;\r
\r
  var scene = new THREE.Scene();\r
  var camera = new THREE.PerspectiveCamera(26, 2.4, 0.1, 500);\r
  var hemi = new THREE.HemisphereLight(0xffffff, 0xd9d2c5, 1.5); scene.add(hemi);\r
  var key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(-4, 9, 10); scene.add(key);\r
  var group = new THREE.Group(); scene.add(group);\r
  // a fixed slight tilt shows the tops of the cubes and the podium (labels are placed for this view)\r
  group.rotation.x = 0.16;\r
  var cube = new THREE.BoxGeometry(U * 0.9, U * 0.9, U * 1.3);\r
  var digitMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.05, emissive: 0x000000 });\r
  var podiumMat = new THREE.MeshStandardMaterial({ roughness: 0.6 });\r
  var bitMat = new THREE.MeshStandardMaterial({ roughness: 0.5 });\r
\r
  // ---------- layout ----------\r
  var slots = [], N = 0, digitMesh = null, colonMesh = null, podium = null, layout = null;\r
  var on, kind, tC, cur, groupsNow = null;\r
  // narrow blocks (phones, small columns): days : hours over minutes : seconds, twice the size\r
  var ROW_GAP = 13;\r
  function wantTwoRows() {\r
    var w = stage.clientWidth || container.clientWidth || 600;\r
    return state.data.format === 'dhms' && w < 520;\r
  }\r
  function buildLayout() {\r
    [digitMesh, colonMesh].forEach(function (m) { if (m) { group.remove(m); m.dispose(); } });\r
    if (podium) { group.remove(podium); podium.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); }\r
    var nGroups = state.data.format === 'dhms' ? 4 : 3;\r
    var twoRows = nGroups === 4 && wantTwoRows();\r
    var rows = twoRows ? [[0, 1], [2, 3]] : [nGroups === 3 ? [0, 1, 2] : [0, 1, 2, 3]];\r
    slots = []; var colons = [], groupCenters = [], maxCols = 0;\r
    podium = new THREE.Group();\r
    rows.forEach(function (gs, r) {\r
      var cols = gs.length * 11 + (gs.length - 1) * 3, x0 = -(cols - 1) / 2, yOff = (rows.length - 1) * ROW_GAP / 2 - r * ROW_GAP;\r
      maxCols = Math.max(maxCols, cols);\r
      var x = 0;\r
      gs.forEach(function (g, k) {\r
        groupCenters[g] = { x: (x0 + x + 5) * U, y: (yOff - 5.4) * U };\r
        slots.push({ x: x0 + x, y: yOff }); slots.push({ x: x0 + x + 6, y: yOff });\r
        x += 11;\r
        if (k < gs.length - 1) { colons.push({ x: x0 + x + 1, y: yOff }); x += 3; }\r
      });\r
      // podium under each row\r
      var slab = new THREE.Mesh(new THREE.BoxGeometry((cols + 4) * U, U * 1.1, U * 5), podiumMat);\r
      slab.position.set(0, (yOff - 4.2) * U, -U * 1.2);\r
      podium.add(slab);\r
    });\r
    group.add(podium);\r
    N = slots.length * 35;\r
    digitMesh = new THREE.InstancedMesh(cube, digitMat, N);\r
    digitMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);\r
    on = new Uint8Array(N); kind = new Uint8Array(N); tC = new Float32Array(N); cur = slots.map(function () { return -1; });\r
    var m4 = new THREE.Matrix4();\r
    for (var i = 0; i < N; i++) { m4.makeScale(0, 0, 0); digitMesh.setMatrixAt(i, m4); }\r
    group.add(digitMesh);\r
    // colons: two cubes each\r
    colonMesh = new THREE.InstancedMesh(cube, bitMat, Math.max(1, colons.length * 2));\r
    colonMesh.count = colons.length * 2;\r
    colons.forEach(function (c, k) {\r
      [2, 4].forEach(function (row, j) { m4.makeTranslation(c.x * U, (c.y + 3 - row) * U, 0); colonMesh.setMatrixAt(k * 2 + j, m4); });\r
    });\r
    group.add(colonMesh);\r
    layout = { cols: maxCols, rows: rows.length, groupCenters: groupCenters, nGroups: nGroups, twoRows: twoRows };\r
    groupsNow = null;\r
    if (ended) { podium.visible = colonMesh.visible = false; }\r
    applyColors();\r
    buildLabels();\r
    fit();\r
  }\r
  function home(slot, c, out) {\r
    out.set((slots[slot].x + (c % 5)) * U, (slots[slot].y + 3 - Math.floor(c / 5)) * U, 0);\r
    return out;\r
  }\r
\r
  function applyColors() {\r
    var p = pal();\r
    digitMat.color.set(p.digit); digitMat.emissive.set(p.digit);\r
    bitMat.color.set(p.colon);\r
    podiumMat.color.set(p.podium);\r
    titleEl.style.color = p.title; endEl.style.color = p.digit;\r
    labelsEl.style.color = p.title;\r
    btnEl.style.background = p.btn; btnEl.style.color = p.btnText;\r
    if (confMesh) colorConfetti();\r
  }\r
\r
  // ---------- digits changing ----------\r
  var tmp = new THREE.Vector3(), q = new THREE.Quaternion(), e = new THREE.Euler(), sv = new THREE.Vector3(), m4b = new THREE.Matrix4();\r
  var dirtyUntil = 0;\r
  function setDigit(slot, d, t, first) {\r
    if (cur[slot] === d) return;\r
    var base = slot * 35;\r
    for (var c = 0; c < 35; c++) {\r
      var i = base + c, want = d >= 0 && bit(d, c) ? 1 : 0;\r
      if (want && !on[i]) { kind[i] = 1; tC[i] = t + (first ? slot * 0.06 + rnd(i) * 0.25 : rnd(i + t) * 0.12); }\r
      else if (!want && on[i]) { kind[i] = 2; tC[i] = t + rnd(i + 3) * 0.08; }\r
      on[i] = want;\r
    }\r
    cur[slot] = d;\r
    dirtyUntil = Math.max(dirtyUntil, t + (first ? 1.6 : 0.8));\r
  }\r
  var APPEAR = 0.45, LEAVE = 0.38;\r
  function placeDigits(t) {\r
    if (t > dirtyUntil + 0.05) return;\r
    for (var i = 0; i < N; i++) {\r
      var slot = Math.floor(i / 35), c = i % 35;\r
      home(slot, c, tmp);\r
      var sc = on[i] ? 1 : 0, ax = 0, ay = 0;\r
      if (kind[i] === 1) {\r
        var k = reduced ? 1 : clamp01((t - tC[i]) / APPEAR), ek = easeOutBack(k);\r
        tmp.y += (1 - easeOut(k)) * U * (2.5 + rnd(i) * 2); tmp.z += (1 - easeOut(k)) * U * 3;\r
        tmp.x += (1 - easeOut(k)) * (rnd(i + 5) - 0.5) * U * 2;\r
        sc = Math.max(0, ek); ax = (1 - k) * 2;\r
        if (k >= 1) kind[i] = 0;\r
      } else if (kind[i] === 2) {\r
        var k2 = reduced ? 1 : clamp01((t - tC[i]) / LEAVE);\r
        tmp.x += (rnd(i + 9) - 0.5) * U * 3 * k2; tmp.y -= U * 1.5 * k2 * k2; tmp.z += U * 2.5 * k2;\r
        sc = 1 - easeOut(k2); ay = k2 * 3;\r
        if (k2 >= 1) { kind[i] = 0; sc = 0; }\r
      }\r
      e.set(ax, ay, 0); q.setFromEuler(e); sv.setScalar(Math.max(0.0001, sc));\r
      m4b.compose(tmp, q, sv); digitMesh.setMatrixAt(i, m4b);\r
    }\r
    digitMesh.instanceMatrix.needsUpdate = true;\r
  }\r
\r
  // ---------- labels under the groups ----------\r
  function buildLabels() {\r
    var names = GROUP_LABELS[state.data.format] || GROUP_LABELS.dhms;\r
    labelsEl.innerHTML = names.map(function (n) { return '<span>' + n + '</span>'; }).join('');\r
    placeLabels();\r
  }\r
  function placeLabels() {\r
    if (!layout) return;\r
    var w = stage.clientWidth, h = stage.clientHeight;\r
    var spans = labelsEl.children;\r
    for (var g = 0; g < spans.length; g++) {\r
      tmp.set(layout.groupCenters[g].x, layout.groupCenters[g].y, U * 1.3).applyMatrix4(group.matrixWorld).project(camera);\r
      spans[g].style.left = ((tmp.x + 1) / 2 * w).toFixed(1) + 'px';\r
      spans[g].style.top = ((1 - tmp.y) / 2 * h).toFixed(1) + 'px';\r
    }\r
  }\r
\r
  // ---------- confetti and snow ----------\r
  var confMesh = null, conf = null, confT = -10;\r
  var CN = 160;\r
  function colorConfetti() {\r
    var p = pal(), col = new THREE.Color();\r
    for (var i = 0; i < CN; i++) { col.set(p.confetti[i % p.confetti.length]); confMesh.setColorAt(i, col); }\r
    if (confMesh.instanceColor) confMesh.instanceColor.needsUpdate = true;\r
  }\r
  confMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(U * 0.42, U * 0.42, U * 0.16), new THREE.MeshStandardMaterial({ roughness: 0.5 }), CN);\r
  confMesh.frustumCulled = false;\r
  conf = new Float32Array(CN * 9);\r
  (function () { var m = new THREE.Matrix4().makeScale(0, 0, 0); for (var i = 0; i < CN; i++) confMesh.setMatrixAt(i, m); })();\r
  colorConfetti();\r
  scene.add(confMesh);\r
  function burst() {\r
    confT = now();\r
    for (var i = 0; i < CN; i++) {\r
      var o = i * 9, a = rnd(i) * Math.PI * 2, sp = 6 + rnd(i + 1) * 10;\r
      conf[o] = (rnd(i + 2) - 0.5) * layout.cols * U * 0.6; conf[o + 1] = 0; conf[o + 2] = U * 2;\r
      conf[o + 3] = Math.cos(a) * sp * 0.6; conf[o + 4] = 6 + rnd(i + 3) * 9; conf[o + 5] = Math.sin(a) * sp * 0.3 + 2;\r
      conf[o + 6] = rnd(i + 4) * 6; conf[o + 7] = rnd(i + 5) * 6; conf[o + 8] = 0;\r
    }\r
  }\r
  var lastConfT = 0;\r
  function updateConfetti(t) {\r
    var age = t - confT;\r
    if (age > 3.6) { if (age < 3.8) { var m = new THREE.Matrix4().makeScale(0, 0, 0); for (var j = 0; j < CN; j++) confMesh.setMatrixAt(j, m); confMesh.instanceMatrix.needsUpdate = true; } return; }\r
    var dt = Math.min(0.05, Math.max(0, t - lastConfT)); lastConfT = t;\r
    for (var i = 0; i < CN; i++) {\r
      var o = i * 9;\r
      conf[o + 4] -= 18 * dt; conf[o + 3] *= 0.99; conf[o + 5] *= 0.99;\r
      conf[o] += conf[o + 3] * dt; conf[o + 1] += conf[o + 4] * dt; conf[o + 2] += conf[o + 5] * dt;\r
      conf[o + 6] += dt * 7; conf[o + 7] += dt * 5;\r
      tmp.set(conf[o], conf[o + 1], conf[o + 2]); e.set(conf[o + 6], conf[o + 7], 0); q.setFromEuler(e);\r
      sv.setScalar(age > 2.8 ? Math.max(0.0001, 1 - (age - 2.8) / 0.8) : 1);\r
      m4b.compose(tmp, q, sv); confMesh.setMatrixAt(i, m4b);\r
    }\r
    confMesh.instanceMatrix.needsUpdate = true;\r
  }\r
\r
  var SN = 70, snow = new THREE.InstancedMesh(new THREE.BoxGeometry(U * 0.28, U * 0.28, U * 0.28), new THREE.MeshBasicMaterial({ color: 0xffffff }), SN);\r
  snow.frustumCulled = false; scene.add(snow);\r
  function updateSnow(t) {\r
    var fall = pal().fall, show = !!fall && !reduced;\r
    if (show) snow.material.color.set(fall);\r
    snow.visible = show;\r
    if (!show || !layout) return;\r
    var W = (layout.cols + 10) * U, H = (layout.rows * ROW_GAP + 4) * U;\r
    for (var i = 0; i < SN; i++) {\r
      var sp = 0.5 + rnd(i) * 0.7, y = H / 2 - (((t * sp * 1.6 + rnd(i + 1) * H) % H));\r
      tmp.set((rnd(i + 2) - 0.5) * W + Math.sin(t * 0.8 + i) * 0.3, y + 1, (rnd(i + 3) - 0.3) * 6);\r
      e.set(t * sp, t * sp * 0.7, 0); q.setFromEuler(e); sv.setScalar(0.6 + rnd(i + 4) * 0.8);\r
      m4b.compose(tmp, q, sv); snow.setMatrixAt(i, m4b);\r
    }\r
    snow.instanceMatrix.needsUpdate = true;\r
  }\r
\r
  // ---------- the end ----------\r
  var ended = false;\r
  function showEnd(animated) {\r
    var d = state.data, preview = state.previewEnd;\r
    ended = true;\r
    var t = now();\r
    for (var s = 0; s < slots.length; s++) setDigit(s, -1, t, false);\r
    podium.visible = colonMesh.visible = false;\r
    labelsEl.style.opacity = '0';\r
    var text = d.endText || '\u0410\u043A\u0446\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u0430\u0441\u044C!';\r
    if (d.endAction === 'hide' && !preview && !state.studio) { container.style.display = 'none'; return; }\r
    if (d.endAction === 'hide') text = '\u0411\u043B\u043E\u043A \u0441\u043A\u0440\u043E\u0435\u0442\u0441\u044F';\r
    if (d.endAction === 'link' && d.endUrl) {\r
      if (!preview && !state.studio && animated) setTimeout(function () { try { window.top.location.href = d.endUrl; } catch (er) { location.href = d.endUrl; } }, 1800);\r
      else if (preview || state.studio) text = (d.endText || '\u0410\u043A\u0446\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u0430\u0441\u044C!') + ' \u2192';\r
    }\r
    endEl.textContent = text;\r
    endEl.style.opacity = '1'; endEl.style.transform = 'scale(1)';\r
    if (animated && !reduced) {\r
      burst();\r
      flashEl.animate([{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 0 }], { duration: 900, easing: 'ease-out' });\r
    }\r
  }\r
  function hideEnd() {\r
    ended = false;\r
    podium.visible = colonMesh.visible = true;\r
    labelsEl.style.opacity = '';\r
    endEl.style.opacity = '0'; endEl.style.transform = 'scale(.9)';\r
    groupsNow = null;\r
  }\r
\r
  var studioStart = Date.now();\r
  function tick(t) {\r
    if (state.previewEnd) { if (!ended) showEnd(true); return; }\r
    var endMs = state.data.personal > 0 ? personalEnd(state.data, state.studio, studioStart) : state.data.end;\r
    var parts = timerParts(endMs, Date.now(), state.data.format);\r
    if (parts.left <= 0) { if (!ended) showEnd(groupsNow !== null); return; }\r
    if (ended) hideEnd();\r
    var first = groupsNow === null;\r
    var flat = [];\r
    parts.groups.forEach(function (g) { flat.push(g[0], g[1]); });\r
    for (var s = 0; s < slots.length; s++) setDigit(s, flat[s], t, first);\r
    groupsNow = parts.groups;\r
  }\r
\r
  // ---------- frame ----------\r
  var t0 = performance.now(), last = 0, raf = 0, paused = false, visible = true;\r
  function now() { return (performance.now() - t0) / 1000; }\r
  function frame(t) {\r
    if (!layout) return;\r
    tick(t);\r
    placeDigits(t);\r
    // the standing digits breathe a little\r
    digitMat.emissiveIntensity = (reduced ? 0.06 : 0.05 + 0.05 * (0.5 + 0.5 * Math.sin(t * 2.2))) + (pal().glow || 0);\r
    updateConfetti(t); updateSnow(t);\r
  }\r
  function loop() {\r
    raf = requestAnimationFrame(loop);\r
    var t = now(); last = t;\r
    if (!visible || paused) return;\r
    frame(t); renderer.render(scene, camera);\r
  }\r
  function fit() {\r
    if (!layout) return;\r
    if (layout.twoRows !== wantTwoRows()) return buildLayout();\r
    var w = stage.clientWidth || 600;\r
    // the stage keeps the timer's proportions: digits, podium and labels with a little air\r
    var worldW = (layout.cols + 5) * U, worldH = (layout.rows * ROW_GAP + 3) * U;\r
    var h = Math.round(w * worldH / worldW);\r
    stage.style.height = h + 'px';\r
    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';\r
    camera.aspect = w / h;\r
    var tanV = Math.tan((camera.fov * Math.PI) / 360);\r
    var halfW = worldW / 2, halfH = worldH / 2;\r
    var dist = Math.max(halfH / tanV, halfW / (tanV * camera.aspect)) * 1.04 + U * 3;\r
    camera.position.set(0, U * 0.4, dist); camera.lookAt(0, -U * 1.2, 0);\r
    camera.near = dist / 40; camera.far = dist * 4; camera.updateProjectionMatrix();\r
    group.updateMatrixWorld(true);\r
    placeLabels();\r
  }\r
\r
  function applyText() {\r
    var d = state.data;\r
    titleEl.textContent = d.title || '';\r
    titleEl.style.display = d.title ? '' : 'none';\r
    if (d.button && d.button.text) {\r
      btnEl.style.display = ''; btnEl.textContent = d.button.text;\r
      if (d.button.url) btnEl.href = d.button.url; else btnEl.removeAttribute('href');\r
    } else btnEl.style.display = 'none';\r
  }\r
\r
  var ro = new ResizeObserver(fit); ro.observe(stage);\r
  var io = null;\r
  if ('IntersectionObserver' in window) {\r
    io = new IntersectionObserver(function (es) { var en = es[0]; visible = en ? en.isIntersecting : true; }, { threshold: [0, 0.01] });\r
    io.observe(container);\r
  }\r
\r
  applyText(); buildLayout(); loop();\r
\r
  // ---------- public ----------\r
  api.setData = function (d) {\r
    var prev = state.data;\r
    state.data = d;\r
    applyText(); applyColors();\r
    if (d.personal !== prev.personal) studioStart = Date.now();\r
    if (d.format !== prev.format) { buildLayout(); hideEnd(); }\r
    else if (d.end !== prev.end || d.personal !== prev.personal || d.endAction !== prev.endAction || d.endText !== prev.endText) { if (ended) hideEnd(); }\r
  };\r
  /** studio: show what happens at the end */\r
  api.previewEnd = function (v) { state.previewEnd = !!v; if (!v && ended) hideEnd(); };\r
  api.setPaused = function (p) { paused = p; };\r
  api.snapshot = function () {\r
    frame(now()); renderer.render(scene, camera);\r
    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;\r
    out.getContext('2d').drawImage(cv, 0, 0);\r
    return out;\r
  };\r
  /** for checks: skip the fly-in */\r
  api.settle = function () { dirtyUntil = now() + 0.05; for (var i = 0; i < N; i++) { tC[i] = -100; } };\r
  api.dispose = function () {\r
    cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect();\r
    scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });\r
    [digitMat, podiumMat, bitMat].forEach(function (m) { m.dispose(); });\r
    renderer.dispose(); root.remove();\r
  };\r
  return api;\r
}\r
`;

// apps/fx/src/engine/timerEmbedGenerator.ts
var THREE_URLS5 = [
  "https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.min.js",
  "https://unpkg.com/three@0.174.0/build/three.module.min.js"
];
var BS5 = String.fromCharCode(92);
var LS5 = new RegExp(String.fromCharCode(8232), "g");
var PS5 = new RegExp(String.fromCharCode(8233), "g");
var safeJson5 = (v) => JSON.stringify(v).replace(/</g, BS5 + "u003c").replace(LS5, BS5 + "u2028").replace(PS5, BS5 + "u2029");
function generateTimerEmbedCode(o) {
  const id = "gridika-timer-" + Math.random().toString(36).slice(2, 8);
  const maxW = o.maxWidth ?? 320;
  const badge = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;right:8px;top:8px;z-index:5;font:600 11px system-ui,-apple-system,sans-serif;color:#64748b;text-decoration:none;background:rgba(255,255,255,0.85);padding:4px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)">Gridika</a>`;
  const runtime = timerRuntime_default.replace(/^export /gm, "");
  const ends = o.data.personal ? `\u043B\u0438\u0447\u043D\u044B\u0439, ${o.data.personal} \u0447 \u0441 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u0432\u0438\u0437\u0438\u0442\u0430` : `\u0434\u043E ${new Date(o.data.end).toISOString().replace("T", " ").slice(0, 16)} UTC`;
  return `${codeHeader(`\u0442\u0430\u0439\u043C\u0435\u0440 \u0430\u043A\u0446\u0438\u0438 \xB7 ${ends}`, o.license)}
<div id="${id}" style="position:relative;width:100%;max-width:${maxW}px;margin:0 auto;">${badge}</div>
<script type="module">${domainLockJs(`${id}-badge`, o.license.domain)}
var GRIDIKA = ${safeJson5({ data: o.data })};
${runtime}
(async function () {
  var el = document.getElementById("${id}");
  var THREE = null, urls = ${JSON.stringify(THREE_URLS5)};
  for (var i = 0; i < urls.length && !THREE; i++) { try { THREE = await import(urls[i]); } catch (e) {} }
  if (!THREE || !el) return;
  el.__gridika = createTimerViewer(THREE, el, { data: GRIDIKA.data });
})();
</script>`;
}

// apps/fx/src/engine/timerScene.ts
function timerEndMs(s) {
  const [y, m, d] = s.date.split("-").map(Number);
  const [hh, mm] = (s.time || "00:00").split(":").map(Number);
  if (!y || !m || !d) return NaN;
  return Date.UTC(y, m - 1, d, hh || 0, mm || 0) - s.tz * 36e5;
}
function buildTimerData(s, mode) {
  const personal = s.endType === "personal" ? Math.max(1, Math.min(720, s.hours || 24)) : 0;
  const end = personal ? 0 : timerEndMs(s);
  if (!personal && !Number.isFinite(end)) return null;
  let hash = 5381;
  for (const ch of `${s.title}|${personal}`) hash = (hash * 33 ^ ch.charCodeAt(0)) >>> 0;
  const bt = s.buttonText.trim();
  return {
    end,
    format: s.format,
    personal,
    pid: personal ? hash.toString(36) : void 0,
    title: s.title.trim(),
    button: bt ? { text: bt, url: s.buttonUrl.trim() } : null,
    endAction: s.endAction,
    endText: s.endText.trim(),
    endUrl: s.endUrl.trim(),
    mode
  };
}

// apps/fx/src/engine/purchase.ts
var WIDGET_SIZE_MAP = {
  "qr-morph": { s: 360, m: 480, l: 640 },
  "qr-card": { s: 340, m: 440, l: 580 },
  "gift-box": { s: 420, m: 560, l: 720 },
  "voxel-logo": { s: 360, m: 480, l: 640 },
  "voxel-morph": { s: 360, m: 480, l: 680 },
  "sale-timer": { s: 280, m: 320, l: 700 }
};

// apps/fx/src/engine/purchaseCode.ts
function buildPurchaseCode(c, license) {
  const maxWidth = WIDGET_SIZE_MAP[c.p]?.[c.size || "m"];
  if (c.p === "qr-morph" && c.qr) {
    const shape = c.qr.shape || "tree";
    return generateQrMorphEmbedCode({
      text: c.qr.text,
      shape,
      themeId: c.qr.themeId,
      height: 480,
      maxWidth,
      season: c.qr.modes?.season || c.qr.modes?.tree,
      timeOfDay: c.qr.modes?.timeOfDay || c.qr.modes?.city,
      islandMode: c.qr.modes?.islandMode || c.qr.modes?.island,
      gardenMode: c.qr.modes?.gardenMode || c.qr.modes?.maze,
      eqMode: c.qr.modes?.eqMode || c.qr.modes?.equalizer,
      cakeFlavor: c.qr.modes?.cakeFlavor || c.qr.modes?.cake,
      castleMode: c.qr.modes?.castleMode || c.qr.modes?.castle,
      license
    });
  }
  if (c.p === "qr-card" && c.card) {
    const hidden = new Set(c.card.hidden);
    const contact = Object.fromEntries(Object.entries(c.card.contact).map(([k, v]) => [k, hidden.has(k) ? "" : v]));
    return generateCardEmbedCode({ contact, mode: c.card.mode, style: c.card.style, logo: null, maxWidth, license });
  }
  if (c.p === "gift-box" && c.gift) {
    return generateGiftEmbedCode({ settings: c.gift.settings, mode: c.gift.mode, maxWidth, license });
  }
  if (c.p === "sale-timer" && c.timer) {
    const data = buildTimerData(c.timer.settings, c.timer.mode);
    return data ? generateTimerEmbedCode({ data, maxWidth, license }) : null;
  }
  if (c.p === "voxel-morph" && c.morph) {
    return generateMorphEmbedCode({ data: c.morph.data, maxWidth, license });
  }
  if (c.p === "voxel-logo" && c.logo) {
    return generateLogoEmbedCode({ data: c.logo.data, mode: c.logo.mode, maxWidth, license });
  }
  return null;
}
export {
  buildPurchaseCode
};
