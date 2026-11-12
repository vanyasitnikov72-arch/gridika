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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/can-promise.js"(exports, module) {
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/utils.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/galois-field.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/polynomial.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/regex.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mode.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/format-info.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
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

// ../../node_modules/.pnpm/dijkstrajs@1.0.3/node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "../../node_modules/.pnpm/dijkstrajs@1.0.3/node_modules/dijkstrajs/dijkstra.js"(exports, module) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/segments.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/qrcode.js"(exports) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/chunkstream.js
var require_chunkstream = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/chunkstream.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/interlace.js
var require_interlace = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/interlace.js"(exports) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/paeth-predictor.js
var require_paeth_predictor = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/paeth-predictor.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse.js
var require_filter_parse = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse-async.js
var require_filter_parse_async = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse-async.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/constants.js
var require_constants = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/constants.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/crc.js
var require_crc = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/crc.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser.js
var require_parser = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/bitmapper.js
var require_bitmapper = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/bitmapper.js"(exports) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/format-normaliser.js
var require_format_normaliser = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/format-normaliser.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser-async.js
var require_parser_async = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser-async.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/bitpacker.js
var require_bitpacker = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/bitpacker.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-pack.js
var require_filter_pack = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-pack.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer.js
var require_packer = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer-async.js
var require_packer_async = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer-async.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/sync-inflate.js
var require_sync_inflate = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/sync-inflate.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/sync-reader.js
var require_sync_reader = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/sync-reader.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse-sync.js
var require_filter_parse_sync = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/filter-parse-sync.js"(exports) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser-sync.js
var require_parser_sync = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/parser-sync.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer-sync.js
var require_packer_sync = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/packer-sync.js"(exports, module) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/png-sync.js
var require_png_sync = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/png-sync.js"(exports) {
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

// ../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/png.js
var require_png = __commonJS({
  "../../node_modules/.pnpm/pngjs@5.0.0/node_modules/pngjs/lib/png.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utils.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/png.js
var require_png2 = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/png.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utf8.js
var require_utf8 = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utf8.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal/terminal.js
var require_terminal = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal/terminal.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal/terminal-small.js
var require_terminal_small = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal/terminal-small.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal.js
var require_terminal2 = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/terminal.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg.js
var require_svg = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/canvas.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/browser.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/server.js
var require_server = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/server.js"(exports) {
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

// ../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/index.js
var require_lib = __commonJS({
  "../../node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/index.js"(exports, module) {
    module.exports = require_server();
  }
});

// ../../node_modules/.pnpm/jsqr@1.4.0/node_modules/jsqr/dist/jsQR.js
var require_jsQR = __commonJS({
  "../../node_modules/.pnpm/jsqr@1.4.0/node_modules/jsqr/dist/jsQR.js"(exports, module) {
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

// src/engine/codeNotice.ts
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

// src/engine/qrMatrix.ts
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
function isFinderPattern(r, c, size) {
  if (r < 7 && c < 7) return true;
  if (r < 7 && c >= size - 7) return true;
  if (r >= size - 7 && c < 7) return true;
  return false;
}

// src/engine/treeScene.ts
function atLuminance(hex, target) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const k = target / lum;
  const ch = (v) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, "0");
  return "#" + ch(r) + ch(g) + ch(b);
}
var LEAF_LUM = 108;
var GRASS_LUM = 104;
function seasonPalette(p) {
  return {
    ...p,
    leaves: p.leaves.map((c) => atLuminance(c, LEAF_LUM)),
    grass: p.grass.map((c) => atLuminance(c, GRASS_LUM))
  };
}
var RAW_SEASONS = {
  spring: {
    // Sakura
    leaves: ["#d0507f", "#c2386c", "#e0679a", "#b8416c", "#d95c8a", "#e0607a", "#c4508f", "#d46a8c", "#b84a86", "#e2708f"],
    grass: ["#4f8a24", "#5a9a2a", "#467d1f", "#3f7019", "#6a9a1f", "#2f7a3a", "#5f8f30", "#3d8a2e", "#78a02a"],
    bloom: ["#f9d3e2", "#f6c1d5", "#fce6ef", "#f2b3cb", "#fff2f7", "#eeaac4", "#f8cadb"],
    blades: ["#6fbf3a", "#8fd14f", "#5aa02e", "#a6dc6a", "#4c8f26", "#7cc444"],
    trunk: ["#8a4a2e", "#743b24"]
  },
  summer: {
    // Jacaranda lilac
    leaves: ["#8a5ccc", "#7646bd", "#9a6fd6", "#6538ab", "#a57fdc", "#9c5ac8", "#7f62d8", "#b06cc9", "#8e4fb8", "#6f5bd0"],
    grass: ["#4f8a24", "#5a9a2a", "#467d1f", "#3f7019", "#6a9a1f", "#2f7a3a", "#5f8f30", "#3d8a2e", "#78a02a"],
    bloom: ["#dcc8f5", "#cfb6f0", "#e9dcfa", "#c3a6ea", "#f3ecfd", "#d5bff3"],
    blades: ["#6fbf3a", "#8fd14f", "#5aa02e", "#a6dc6a", "#4c8f26", "#7cc444"],
    trunk: ["#7d4a32", "#683d28"]
  },
  autumn: {
    leaves: ["#d2701a", "#c2581a", "#e08f1f", "#b04a12", "#e8971c", "#c9402a", "#d9a21f", "#b86a1a", "#a8541f", "#cf5a2e"],
    grass: ["#8a6a1c", "#7a5c18", "#96741f", "#6e5215", "#9a7a1a", "#7f6a24", "#a0702a", "#86621a"],
    bloom: ["#f7cf5a", "#f2b83c", "#f9dc7e", "#eea12e", "#fbe6a4", "#f4c24a"],
    blades: ["#d9b44a", "#c9a13a", "#e6c868", "#b08a2e", "#efd27a"],
    trunk: ["#7a3f26", "#66331e"]
  }
};
var TREE_SEASONS = {
  spring: seasonPalette(RAW_SEASONS.spring),
  summer: seasonPalette(RAW_SEASONS.summer),
  autumn: seasonPalette(RAW_SEASONS.autumn)
};
function rand(seed) {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function treeGeometry(size) {
  const half = size / 2;
  const R = size * 0.47;
  const trunkH = size * 0.34;
  const canopyRy = size * 0.34;
  return {
    size,
    half,
    trunkH,
    canopyCenterY: trunkH + canopyRy * 0.78,
    canopyRy,
    canopyFloor: trunkH * 0.82,
    radiusAt: (theta) => R * (1 + 0.1 * Math.sin(3 * theta + 0.6) + 0.06 * Math.sin(5 * theta + 2.1) + 0.04 * Math.cos(7 * theta))
  };
}
function moduleXZ(m, half) {
  return { x: m.c - half + 0.5, z: m.r - half + 0.5 };
}
function canopyQ(g, x, z) {
  const d = Math.hypot(x, z);
  const theta = Math.atan2(z, x);
  return d / g.radiusAt(theta);
}
function canopySpan(g, q) {
  const k = Math.sqrt(Math.max(0, 1 - q * q));
  const top = g.canopyCenterY + g.canopyRy * k;
  const bottom = Math.max(g.canopyFloor, g.canopyCenterY - g.canopyRy * 0.85 * k);
  return [bottom, top];
}
function isUnderCanopy(g, m) {
  if (m.isFinder) return false;
  const { x, z } = moduleXZ(m, g.half);
  return canopyQ(g, x, z) < 1;
}
function treeVoxelTargets(modules, size) {
  const g = treeGeometry(size);
  return modules.map((m, i) => {
    const { x, z } = moduleXZ(m, g.half);
    if (isUnderCanopy(g, m)) {
      const [bottom, top] = canopySpan(g, canopyQ(g, x, z));
      const y = top - (top - bottom) * 0.35 * rand(i + 1);
      const s = 1.13;
      return { x, y, z, scaleX: s, scaleY: s, scaleZ: s, kind: "leaf" };
    }
    return { x, y: 0.18, z, scaleX: 1.14, scaleY: 0.4, scaleZ: 1.14, kind: "grass" };
  });
}

// src/engine/cityScene.ts
var FLOOR_H = 0.75;
function cityLayout(modules, size) {
  const half = size / 2;
  const index = /* @__PURE__ */ new Map();
  modules.forEach((m, i) => index.set(m.r * size + m.c, i));
  const building = new Array(modules.length).fill(-1);
  const buildings = [];
  const maxFloors = Math.round(size * 0.62 / FLOOR_H);
  const finderOrigins = [
    [0, 0],
    [0, size - 7],
    [size - 7, 0]
  ];
  finderOrigins.forEach(([r0, c0], fi) => {
    const ring = [];
    const core = [];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const i = index.get((r0 + r) * size + (c0 + c));
        if (i === void 0) continue;
        if (r >= 2 && r <= 4 && c >= 2 && c <= 4) core.push(i);
        else ring.push(i);
      }
    }
    const ringB = { id: buildings.length, h: 3 * FLOOR_H, facadeIndex: (fi * 3 + 1) % 8, cells: ring, isTower: false };
    buildings.push(ringB);
    ring.forEach((i) => building[i] = ringB.id);
    const towerFloors = Math.round(size * 0.5 / FLOOR_H) + fi * 2;
    const tower = { id: buildings.length, h: towerFloors * FLOOR_H, facadeIndex: (fi * 3 + 3) % 8, cells: core, isTower: true };
    buildings.push(tower);
    core.forEach((i) => building[i] = tower.id);
  });
  const lotOf = (r, c) => Math.floor(r / 3) * 1e3 + Math.floor(c / 3);
  modules.forEach((m, start) => {
    if (building[start] !== -1) return;
    const lot = lotOf(m.r, m.c);
    const cells = [];
    const stack = [start];
    building[start] = -2;
    while (stack.length) {
      const i = stack.pop();
      cells.push(i);
      const { r, c } = modules[i];
      for (const [dr, dc] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
      ]) {
        const rr = r + dr, cc = c + dc;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        if (lotOf(rr, cc) !== lot) continue;
        const j = index.get(rr * size + cc);
        if (j === void 0 || building[j] !== -1) continue;
        building[j] = -2;
        stack.push(j);
      }
    }
    let cx = 0, cz = 0;
    cells.forEach((i) => {
      cx += modules[i].c - half + 0.5;
      cz += modules[i].r - half + 0.5;
    });
    cx /= cells.length;
    cz /= cells.length;
    const id = buildings.length;
    const d = Math.min(1, Math.hypot(cx, cz) / (half * 1.1));
    const profile = Math.pow(1 - d, 1.4);
    let floors = 2 + Math.round(profile * maxFloors * (0.45 + 0.55 * rand(id * 7 + 3)));
    if (rand(id * 13 + 5) < 0.07) floors += 5;
    const b = { id, h: floors * FLOOR_H, facadeIndex: Math.floor(rand(id * 3 + 1) * 8), cells, isTower: false };
    buildings.push(b);
    cells.forEach((i) => building[i] = id);
  });
  const height = modules.map((_, i) => buildings[building[i]].h);
  return { size, half, height, building, buildings, maxH: Math.max(...height) };
}
function cityVoxelTargets(modules, size) {
  const L = cityLayout(modules, size);
  return modules.map((m, i) => {
    const h = L.height[i];
    return {
      x: m.c - L.half + 0.5,
      y: h / 2,
      z: m.r - L.half + 0.5,
      scaleX: 1.13,
      scaleY: h / 0.88,
      scaleZ: 1.13
    };
  });
}

// src/engine/stageScene.ts
function finderLocal(r, c, size) {
  if (r < 7 && c < 7) return [r, c, 0];
  if (r < 7 && c >= size - 7) return [r, c - (size - 7), 1];
  if (r >= size - 7 && c < 7) return [r - (size - 7), c, 2];
  return null;
}

// src/engine/islandScene.ts
var STEP = 0.5;
function valueNoise(x, z, cell, seed) {
  const gx = x / cell, gz = z / cell;
  const ix = Math.floor(gx), iz = Math.floor(gz);
  const fx = gx - ix, fz = gz - iz;
  const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
  const v = (a, b) => rand(a * 57.1 + b * 131.7 + seed);
  const top = v(ix, iz) * (1 - sx) + v(ix + 1, iz) * sx;
  const bot = v(ix, iz + 1) * (1 - sx) + v(ix + 1, iz + 1) * sx;
  return top * (1 - sz) + bot * sz;
}
function islandLayout(modules, size, mode) {
  const half = size / 2;
  const maxH = size * 0.6;
  const height = [];
  const band = [];
  const core = [];
  const crater = [];
  modules.forEach((m) => {
    const x = m.c - half + 0.5;
    const z = m.r - half + 0.5;
    const local = finderLocal(m.r, m.c, size);
    if (local) {
      const [fr, fc, fi] = local;
      const isCore = fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4;
      const h2 = isCore ? [2.5, 2, 1.5][fi] : 1;
      height.push(h2);
      band.push(isCore ? 1 : 0);
      core.push(isCore ? fi : -1);
      crater.push(false);
      return;
    }
    const d = Math.hypot(x, z) / (half * 1.05);
    const profile = Math.max(0, 1 - d);
    const n = valueNoise(x + half, z + half, 5, 11) * 0.7 + valueNoise(x + half, z + half, 2.5, 23) * 0.3;
    const hills = 0.4 + 2.2 * n * Math.pow(profile, 0.7);
    const cone = Math.max(0, 1 - Math.hypot(x, z) / (half * 0.78));
    const mountain = maxH * Math.pow(cone, 1.15) * (0.72 + 0.28 * n);
    let h = Math.max(hills, mountain);
    let isCrater = false;
    if (mode === "volcano") {
      h = 0.4 + maxH * 1.1 * Math.pow(profile, 1.6) * (0.75 + 0.25 * n);
      const rc = Math.hypot(x, z);
      if (rc < size * 0.09) {
        h = maxH * 0.72;
        isCrater = true;
      }
    }
    h = Math.max(STEP, Math.round(h / STEP) * STEP);
    height.push(h);
    const t = h / maxH;
    band.push(t < 0.07 ? 0 : t < 0.2 ? 1 : t < 0.38 ? 2 : t < 0.62 ? 3 : 4);
    core.push(-1);
    crater.push(isCrater);
  });
  return { size, half, height, band, core, maxH: Math.max(...height), crater };
}
function islandVoxelTargets(modules, size, mode = "summer") {
  const L = islandLayout(modules, size, mode);
  return modules.map((m, i) => {
    const h = L.height[i];
    return { x: m.c - L.half + 0.5, y: h / 2, z: m.r - L.half + 0.5, scaleX: 1.13, scaleY: h / 0.88, scaleZ: 1.13 };
  });
}

// src/engine/mazeScene.ts
var HEDGE_H = 1.2;
function mazeLayout(modules, size) {
  const half = size / 2;
  const dark = new Set(modules.map((m) => m.r * size + m.c));
  const isDark = (r, c) => r >= 0 && c >= 0 && r < size && c < size && dark.has(r * size + c);
  const height = [];
  const kind = [];
  const pavilion = [];
  modules.forEach((m, i) => {
    const local = finderLocal(m.r, m.c, size);
    if (local) {
      const [fr, fc, fi] = local;
      const core = fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4;
      pavilion.push(fi);
      if (!core) {
        kind.push("ring");
        height.push(HEDGE_H + 0.3);
      } else if (fr === 3 && fc === 3) {
        kind.push("gazebo");
        height.push(0.3);
      } else {
        kind.push("bed");
        height.push(0.3);
      }
      return;
    }
    pavilion.push(-1);
    const lonely = !isDark(m.r - 1, m.c) && !isDark(m.r + 1, m.c) && !isDark(m.r, m.c - 1) && !isDark(m.r, m.c + 1);
    if (lonely) {
      kind.push("topiary");
      height.push(0.45);
      return;
    }
    kind.push("hedge");
    height.push(HEDGE_H + (rand(i * 7 + 3) < 0.12 ? 0.3 : 0));
  });
  return { size, half, height, kind, pavilion, maxH: Math.max(...height) };
}
function mazeVoxelTargets(modules, size) {
  const L = mazeLayout(modules, size);
  return modules.map((m, i) => {
    const h = L.height[i];
    return { x: m.c - L.half + 0.5, y: h / 2, z: m.r - L.half + 0.5, scaleX: 1.13, scaleY: h / 0.88, scaleZ: 1.13 };
  });
}

// src/engine/equalizerScene.ts
var CABINET_H = 2.4;
function eqLayout(modules, size) {
  const barH = size * 0.34;
  const kind = [];
  const height = [];
  modules.forEach((m) => {
    const local = finderLocal(m.r, m.c, size);
    if (local) {
      const [fr, fc] = local;
      kind.push(fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4 ? "core" : "cab");
      height.push(CABINET_H);
    } else {
      kind.push("bar");
      height.push(barH);
    }
  });
  return { size, half: size / 2, kind, height, barH };
}
function eqVoxelTargets(modules, size) {
  const L = eqLayout(modules, size);
  return modules.map((m, i) => {
    const h = L.height[i];
    return { x: m.c - L.half + 0.5, y: h / 2, z: m.r - L.half + 0.5, scaleX: 1.13, scaleY: h / 0.88, scaleZ: 1.13 };
  });
}

// src/engine/cakeScene.ts
var TIER_H = [4.6, 4, 3.4];
function cakeLayout(modules, size) {
  const half = size / 2;
  const centre = (size - 1) / 2;
  const k2 = Math.max(2, Math.floor(centre - 7));
  const k3 = Math.max(1, Math.round(k2 * 0.5));
  const bounds = [
    [0, size - 1],
    [Math.round(centre - k2), Math.round(centre + k2)],
    [Math.round(centre - k3), Math.round(centre + k3)]
  ];
  const tierTop = [TIER_H[0], TIER_H[0] + TIER_H[1], TIER_H[0] + TIER_H[1] + TIER_H[2]];
  const tierOf = new Uint8Array(size * size);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let t = 0;
      if (r >= bounds[1][0] && r <= bounds[1][1] && c >= bounds[1][0] && c <= bounds[1][1]) t = 1;
      if (r >= bounds[2][0] && r <= bounds[2][1] && c >= bounds[2][0] && c <= bounds[2][1]) t = 2;
      tierOf[r * size + c] = t;
    }
  }
  const kind = modules.map((m, i) => {
    const local = finderLocal(m.r, m.c, size);
    if (local) {
      const [fr, fc] = local;
      if (fr === 3 && fc === 3) return "candle";
      if (fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4) return "rosette";
      return "border";
    }
    const x = rand(i * 13 + 7);
    return x < 0.45 ? "choc" : x < 0.75 ? "berry" : "macaron";
  });
  return { size, half, tierOf, tierTop, bounds, kind };
}
function cellTop(L, r, c) {
  return L.tierTop[L.tierOf[r * L.size + c]];
}
function cakeVoxelTargets(modules, size) {
  const L = cakeLayout(modules, size);
  return modules.map((m) => {
    const top = cellTop(L, m.r, m.c);
    return { x: m.c - L.half + 0.5, y: top + 0.36, z: m.r - L.half + 0.5, scaleX: 1.13, scaleY: 0.82, scaleZ: 1.13 };
  });
}

// src/engine/castleScene.ts
var STEP2 = 0.4;
function castleLayout(modules, size) {
  const half = size / 2;
  const dark = new Set(modules.map((m) => m.r * size + m.c));
  const isDark = (r, c) => r >= 0 && c >= 0 && r < size && c < size && dark.has(r * size + c);
  const kind = [];
  const height = [];
  const tower = [];
  modules.forEach((m, i) => {
    const local = finderLocal(m.r, m.c, size);
    if (local) {
      const [fr, fc, fi] = local;
      tower.push(fi);
      if (fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4) {
        kind.push(fr === 3 && fc === 3 ? "keepTop" : "keep");
        height.push(5.2);
      } else {
        kind.push("ring");
        height.push(3.2);
      }
      return;
    }
    tower.push(-1);
    const lonely = !isDark(m.r - 1, m.c) && !isDark(m.r + 1, m.c) && !isDark(m.r, m.c - 1) && !isDark(m.r, m.c + 1);
    if (lonely) {
      kind.push("house");
      height.push(1.2);
      return;
    }
    kind.push("wall");
    const d = Math.hypot(m.c - half + 0.5, m.r - half + 0.5) / (half * 0.95);
    const profile = Math.pow(Math.max(0, 1 - d), 1.3);
    const h = 1.6 + profile * 3.2 + (rand(i * 7 + 1) < 0.1 ? 0.8 : 0);
    height.push(Math.round(h / STEP2) * STEP2);
  });
  return { size, half, kind, height, tower, maxH: Math.max(...height) };
}
function castleVoxelTargets(modules, size) {
  const L = castleLayout(modules, size);
  return modules.map((m, i) => {
    const h = L.height[i];
    return { x: m.c - L.half + 0.5, y: h / 2, z: m.r - L.half + 0.5, scaleX: 1.13, scaleY: h / 0.88, scaleZ: 1.13 };
  });
}

// src/engine/shapes.ts
function generateTargetShapePositions(shape, count, qrSize, modules) {
  if (shape === "tree" && modules && modules.length === count) {
    return treeVoxelTargets(modules, qrSize);
  }
  if (shape === "city" && modules && modules.length === count) {
    return cityVoxelTargets(modules, qrSize);
  }
  if (shape === "island" && modules && modules.length === count) {
    return islandVoxelTargets(modules, qrSize);
  }
  if (shape === "maze" && modules && modules.length === count) {
    return mazeVoxelTargets(modules, qrSize);
  }
  if (shape === "equalizer" && modules && modules.length === count) {
    return eqVoxelTargets(modules, qrSize);
  }
  if (shape === "cake" && modules && modules.length === count) {
    return cakeVoxelTargets(modules, qrSize);
  }
  if (shape === "castle" && modules && modules.length === count) {
    return castleVoxelTargets(modules, qrSize);
  }
  const targets = [];
  const hoverGap = 1;
  switch (shape) {
    case "tree": {
      const treeH = qrSize * 0.7;
      const trunkH = treeH * 0.36;
      const canopyH = treeH - trunkH;
      const yMin = 0.5;
      const trunkCount = Math.max(12, Math.floor(count * 0.16));
      for (let i = 0; i < trunkCount; i++) {
        const t = i / (trunkCount - 1 || 1);
        const y = yMin + t * trunkH;
        const flare = t < 0.28 ? 1.35 : Math.max(0.75, 1.05 - t * 0.3);
        const angle = i * 2.39996;
        const rad = i % 3 * 0.35 * flare;
        const x = Math.cos(angle) * rad;
        const z = Math.sin(angle) * rad;
        targets.push({
          x,
          y,
          z,
          scaleX: 0.92,
          scaleY: 0.92,
          scaleZ: 0.92
        });
      }
      const branchCount = Math.max(10, Math.floor(count * 0.12));
      const bAngles = [0.1, Math.PI * 0.65, Math.PI * 1.32, Math.PI * 0.32];
      for (let i = 0; i < branchCount; i++) {
        const bIdx = i % bAngles.length;
        const bAng = bAngles[bIdx] + Math.floor(i / bAngles.length) * 0.12;
        const t = Math.floor(i / bAngles.length) / Math.max(1, Math.floor(branchCount / bAngles.length));
        const y = yMin + trunkH * 0.72 + t * (trunkH * 0.55);
        const reach = (t * 0.75 + 0.25) * (qrSize * 0.23);
        const x = Math.cos(bAng) * reach;
        const z = Math.sin(bAng) * reach;
        targets.push({
          x,
          y,
          z,
          scaleX: 0.9,
          scaleY: 0.9,
          scaleZ: 0.9
        });
      }
      const groundCount = Math.max(8, Math.floor(count * 0.08));
      for (let i = 0; i < groundCount; i++) {
        const ang = i * 1.37;
        const rad = 1.4 + i % 5 * 1.4;
        targets.push({
          x: Math.cos(ang) * rad,
          y: yMin + i % 2 * 0.2,
          z: Math.sin(ang) * rad,
          scaleX: 0.85,
          scaleY: 0.6,
          scaleZ: 0.85
        });
      }
      const canopyCount = count - targets.length;
      const clusters = [
        { cx: 0, cy: yMin + trunkH + canopyH * 0.55, cz: 0, rx: qrSize * 0.35, ry: canopyH * 0.48, rz: qrSize * 0.35 },
        { cx: 3.2, cy: yMin + trunkH + canopyH * 0.42, cz: 2.2, rx: qrSize * 0.25, ry: canopyH * 0.38, rz: qrSize * 0.25 },
        { cx: -3.2, cy: yMin + trunkH + canopyH * 0.46, cz: 1.8, rx: qrSize * 0.26, ry: canopyH * 0.4, rz: qrSize * 0.26 },
        { cx: 0.6, cy: yMin + trunkH + canopyH * 0.38, cz: -3.2, rx: qrSize * 0.27, ry: canopyH * 0.36, rz: qrSize * 0.27 }
      ];
      for (let i = 0; i < canopyCount; i++) {
        const c = clusters[i % clusters.length];
        const stepInCluster = Math.floor(i / clusters.length);
        const totalInCluster = Math.max(1, Math.floor(canopyCount / clusters.length));
        const phi = Math.acos(1 - 2 * (stepInCluster / totalInCluster));
        const theta = i * 2.39996;
        const rRand = 0.62 + 0.38 * (i * 23 % 100 / 100);
        const x = c.cx + Math.sin(phi) * Math.cos(theta) * c.rx * rRand;
        const y = c.cy + Math.cos(phi) * c.ry * rRand;
        const z = c.cz + Math.sin(phi) * Math.sin(theta) * c.rz * rRand;
        targets.push({
          x,
          y,
          z,
          scaleX: 0.95,
          scaleY: 0.95,
          scaleZ: 0.95
        });
      }
      break;
    }
    case "phone": {
      const phoneH = qrSize * 0.72;
      const phoneW = phoneH * 0.52;
      const halfW = phoneW / 2;
      const halfH = phoneH / 2;
      const yCenter = hoverGap + halfH;
      const cols = Math.floor(phoneW / 0.88);
      const rows = Math.floor(phoneH / 0.88);
      let placed = 0;
      for (let r = 0; r < rows && placed < count; r++) {
        for (let c = 0; c < cols && placed < count; c++) {
          const nx = (c / (cols - 1 || 1) - 0.5) * 2;
          const ny = (r / (rows - 1 || 1) - 0.5) * 2;
          const squircle = Math.pow(nx, 4) + Math.pow(ny, 4);
          if (squircle <= 1) {
            const x = nx * halfW;
            const y = yCenter - ny * halfH;
            const isDynamicIsland = Math.abs(nx) < 0.28 && Math.abs(ny - -0.72) < 0.08;
            const z = isDynamicIsland ? 0.8 : 0;
            targets.push({
              x,
              y,
              z,
              scaleX: isDynamicIsland ? 1.05 : 0.92,
              scaleY: isDynamicIsland ? 1.05 : 0.92,
              scaleZ: isDynamicIsland ? 1.2 : 0.85
            });
            placed++;
          }
        }
      }
      while (targets.length < count) {
        const t = targets.length / count * Math.PI * 2;
        targets.push({
          x: Math.cos(t) * halfW * 0.92,
          y: yCenter + Math.sin(t) * halfH * 0.92,
          z: -0.6,
          scaleX: 0.88,
          scaleY: 0.88,
          scaleZ: 1.1
        });
      }
      break;
    }
    case "city": {
      const gridSize = Math.ceil(Math.sqrt(count));
      const step = qrSize * 0.8 / gridSize;
      const offset = gridSize * step / 2;
      const maxH = qrSize * 0.55;
      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const seed = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453;
        const norm = seed - Math.floor(seed);
        const distFromCenter = Math.hypot(col - gridSize / 2, row - gridSize / 2) / (gridSize / 2);
        const centerBoost = Math.max(0, 1 - distFromCenter);
        const heightMultiplier = (0.2 + norm * 0.8) * (1 + centerBoost * 2);
        const x = col * step - offset;
        const z = row * step - offset;
        const h = Math.max(1.2, heightMultiplier * maxH);
        const y = 0.88 * h / 2 + 0.05;
        targets.push({
          x,
          y,
          z,
          scaleX: 0.88,
          scaleY: h,
          scaleZ: 0.88
        });
      }
      break;
    }
    case "crystal": {
      const crystalH = qrSize * 0.65;
      const halfH = crystalH / 2;
      const crystalRadius = qrSize * 0.35;
      const yCenter = hoverGap + halfH;
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + 2 * i / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const facetMod = 0.84 + 0.22 * Math.cos(theta * 4);
        const r = crystalRadius * Math.sin(phi) * facetMod;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const y = yCenter + Math.cos(phi) * halfH;
        targets.push({
          x,
          y,
          z,
          scaleX: 0.95,
          scaleY: 0.95,
          scaleZ: 0.95
        });
      }
      break;
    }
    case "pyramid": {
      const levels = 8;
      const stepHeight = qrSize * 0.42 / levels;
      let placed = 0;
      for (let lvl = 0; lvl < levels && placed < count; lvl++) {
        const width = levels - lvl;
        const y = (lvl + 0.5) * stepHeight + 0.05;
        for (let r = -width; r <= width && placed < count; r++) {
          for (let c = -width; c <= width && placed < count; c++) {
            if (Math.abs(r) === width || Math.abs(c) === width || lvl === 0) {
              const x = c * (qrSize * 0.048);
              const z = r * (qrSize * 0.048);
              targets.push({
                x,
                y,
                z,
                scaleX: 0.95,
                scaleY: 0.95,
                scaleZ: 0.95
              });
              placed++;
            }
          }
        }
      }
      while (targets.length < count) {
        const lvl = Math.floor(Math.random() * levels);
        const width = Math.max(1, levels - lvl);
        const r = (Math.random() * 2 - 1) * width;
        const c = (Math.random() * 2 - 1) * width;
        targets.push({
          x: c * (qrSize * 0.048),
          y: (lvl + 0.5) * stepHeight + 0.05,
          z: r * (qrSize * 0.048),
          scaleX: 0.95,
          scaleY: 0.95,
          scaleZ: 0.95
        });
      }
      break;
    }
    case "heart": {
      const heartH = qrSize * 0.62;
      const heartW = heartH * 0.96;
      const yMin = hoverGap;
      for (let i = 0; i < count; i++) {
        const t = i / count * Math.PI * 2;
        const u = i * 7 % count / count;
        const zDepth = (u - 0.5) * (qrSize * 0.22);
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const normY = (hy + 17) / 34;
        const y = yMin + normY * heartH;
        const x = hx / 16 * (heartW / 2) * (1 - Math.abs(u - 0.5) * 0.4);
        const z = zDepth;
        targets.push({
          x,
          y,
          z,
          scaleX: 0.95,
          scaleY: 0.95,
          scaleZ: 0.95
        });
      }
      break;
    }
    case "sphere":
    default: {
      const sphereRadius = qrSize * 0.35;
      const yCenter = hoverGap + sphereRadius;
      const phi = Math.PI * (Math.sqrt(5) - 1);
      for (let i = 0; i < count; i++) {
        const normY = 1 - i / (count - 1 || 1) * 2;
        const radAtY = Math.sqrt(Math.max(0, 1 - normY * normY));
        const theta = phi * i;
        const x = Math.cos(theta) * radAtY * sphereRadius;
        const y = yCenter + normY * sphereRadius;
        const z = Math.sin(theta) * radAtY * sphereRadius;
        targets.push({
          x,
          y,
          z,
          scaleX: 0.95,
          scaleY: 0.95,
          scaleZ: 0.95
        });
      }
      break;
    }
  }
  let minBottom = Infinity;
  for (const t of targets) {
    const halfH = 0.88 * (t.scaleY ?? 1) / 2;
    const bottom = t.y - halfH;
    if (bottom < minBottom) {
      minBottom = bottom;
    }
  }
  const clearanceThreshold = 0.25;
  if (minBottom < clearanceThreshold) {
    const lift = clearanceThreshold - minBottom;
    for (const t of targets) {
      t.y += lift;
    }
  }
  return targets;
}

// src/engine/QrMorphViewer.ts
var THEMES = {
  "velvet-emerald": {
    id: "velvet-emerald",
    name: "Fresh Mint",
    subtitle: "\u0421\u0432\u0435\u0436\u0430\u044F \u043C\u044F\u0442\u0430 \u0438 \u0441\u043E\u0441\u043D\u043E\u0432\u044B\u0439 \u0430\u043A\u0446\u0435\u043D\u0442",
    bgColor: "#F0EBE9",
    groundColor: "#fcfbf9",
    voxelColor: "#19C37D",
    accentColor: "#22d38e",
    finderColor: "#132A22",
    isDark: false
  },
  "terracotta-clay": {
    id: "terracotta-clay",
    name: "\u0422\u0435\u0440\u0440\u0430\u043A\u043E\u0442\u0430 \u0438 \u041A\u0440\u0435\u043C",
    subtitle: "\u0422\u0435\u043F\u043B\u044B\u0439 \u0433\u043B\u0438\u043D\u044F\u043D\u044B\u0439 \u0430\u043A\u0446\u0435\u043D\u0442 \u0438 \u043A\u0430\u0440\u0430\u043C\u0435\u043B\u044C",
    bgColor: "#F0EBE9",
    groundColor: "#ffffff",
    voxelColor: "#3d2516",
    accentColor: "#ea580c",
    finderColor: "#f97316",
    isDark: false
  },
  "espresso-cream": {
    id: "espresso-cream",
    name: "\u042D\u0441\u043F\u0440\u0435\u0441\u0441\u043E \u0438 \u0424\u0430\u0440\u0444\u043E\u0440",
    subtitle: "\u0413\u043B\u0443\u0431\u043E\u043A\u0438\u0439 \u0442\u0435\u043C\u043D\u044B\u0439 \u043A\u043E\u0444\u0435 \u043D\u0430 \u043C\u043E\u043B\u043E\u0447\u043D\u043E\u043C",
    bgColor: "#F0EBE9",
    groundColor: "#ffffff",
    voxelColor: "#201e1c",
    accentColor: "#57534e",
    finderColor: "#292524",
    isDark: false
  },
  "soft-indigo": {
    id: "soft-indigo",
    name: "\u041A\u043E\u0431\u0430\u043B\u044C\u0442 \u0438 \u041B\u0430\u0432\u0430\u043D\u0434\u0430",
    subtitle: "\u041C\u044F\u0433\u043A\u0438\u0439 \u043F\u0430\u0441\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0438\u043D\u0434\u0438\u0433\u043E",
    bgColor: "#f4f4f8",
    groundColor: "#ffffff",
    voxelColor: "#1e1b4b",
    accentColor: "#4f46e5",
    finderColor: "#6366f1",
    isDark: false
  },
  "dark-obsidian": {
    id: "dark-obsidian",
    name: "\u0413\u043B\u0443\u0431\u043E\u043A\u0438\u0439 \u041E\u0431\u0441\u0438\u0434\u0438\u0430\u043D",
    subtitle: "\u041A\u043E\u043D\u0442\u0440\u0430\u0441\u0442\u043D\u044B\u0439 \u0442\u0435\u043C\u043D\u044B\u0439 \u0433\u0440\u0430\u0444\u0438\u0442",
    bgColor: "#161514",
    groundColor: "#23201d",
    voxelColor: "#3f3a36",
    accentColor: "#10b981",
    finderColor: "#34d399",
    isDark: true
  }
};

// src/engine/domainLock.ts
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

// src/engine/standaloneGenerator.ts
function generateEmbedCode(options) {
  const { text, shape, themeId, height = 480, license } = options;
  const showBadge = license ? true : options.showBadge ?? true;
  const theme = THEMES[themeId] || THEMES["velvet-emerald"];
  const { modules, size } = generateQrMatrix(text);
  const darkCoords = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules[r][c]) {
        darkCoords.push({
          r,
          c,
          isFinder: isFinderPattern(r, c, size)
        });
      }
    }
  }
  const targets = generateTargetShapePositions(shape, darkCoords.length, size, darkCoords);
  const payload = {
    s: size,
    c: darkCoords.map((d) => [d.c, d.r, d.isFinder ? 1 : 0]),
    t: targets.map((p) => [
      Number(p.x.toFixed(2)),
      Number(p.y.toFixed(2)),
      Number(p.z.toFixed(2)),
      Number((p.scaleY ?? 1).toFixed(2))
    ]),
    theme: {
      bg: theme.bgColor,
      ground: theme.groundColor,
      voxel: theme.voxelColor,
      accent: theme.accentColor,
      finder: theme.finderColor,
      dark: theme.isDark
    }
  };
  const instanceId = "gridika-qr-" + Math.random().toString(36).substring(2, 8);
  const badgeHtml = showBadge ? `
  <a id="${instanceId}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute; bottom:12px; right:12px; z-index:10; font-family:system-ui,-apple-system,sans-serif; font-size:11px; font-weight:600; color:${theme.isDark ? "#94a3b8" : "#64748b"}; text-decoration:none; background:${theme.isDark ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.85)"}; backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); padding:4px 9px; border-radius:6px; border:1px solid ${theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}; box-shadow:0 2px 6px rgba(0,0,0,0.1); transition:opacity 0.2s;">Gridika</a>` : "";
  const header = license ? codeHeader("3D \u0438\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 QR-\u043A\u043E\u0434", license) : `<!-- Gridika: 3D \u0438\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 QR-\u043A\u043E\u0434 -->`;
  const licenseJs = license ? domainLockJs(`${instanceId}-badge`, license.domain) : "";
  return `${header}
<div id="${instanceId}" style="width:100%; height:${height}px; position:relative; overflow:hidden; border-radius:16px; background:${theme.bgColor};">${badgeHtml}
</div>
<script>
(function() {
  var data = ${JSON.stringify(payload)};
  var container = document.getElementById("${instanceId}");${licenseJs}
  if (!container) return;

  function loadThree(cb) {
    if (window.THREE) return cb();
    var s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    s.crossOrigin = "anonymous";
    s.onload = cb;
    s.onerror = function() {
      // Fallback mirror
      var s2 = document.createElement("script");
      s2.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";
      s2.onload = cb;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  }

  loadThree(function() {
    var T = window.THREE;
    var w = container.clientWidth || 400;
    var h = container.clientHeight || ${height};

    var scene = new T.Scene();
    scene.background = new T.Color(data.theme.bg);

    var camera = new T.PerspectiveCamera(40, w / h, 0.1, 1000);
    camera.position.set(0, 38, 44);
    camera.lookAt(0, 2.5, 0);

    var renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    var amb = new T.AmbientLight(0xffffff, data.theme.dark ? 0.75 : 0.95);
    scene.add(amb);

    var dir = new T.DirectionalLight(0xffffff, data.theme.dark ? 1.5 : 1.2);
    dir.position.set(20, 45, 25);
    dir.castShadow = true;
    dir.shadow.camera.left = -22;
    dir.shadow.camera.right = 22;
    dir.shadow.camera.top = 22;
    dir.shadow.camera.bottom = -22;
    scene.add(dir);

    var pt = new T.PointLight(data.theme.accent, 2, 60);
    pt.position.set(-15, 20, -15);
    scene.add(pt);

    var groundGeo = new T.CylinderGeometry(20, 21, 1.2, 48);
    var groundMat = new T.MeshStandardMaterial({ color: data.theme.ground, roughness: 0.4, metalness: 0.3 });
    var ground = new T.Mesh(groundGeo, groundMat);
    ground.position.y = -0.7;
    ground.receiveShadow = true;
    scene.add(ground);

    var count = data.c.length;
    var boxGeo = new T.BoxGeometry(0.88, 0.88, 0.88);
    var mat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.35 });
    var mesh = new T.InstancedMesh(boxGeo, mat, count);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    var colorObj = new T.Color();
    var colBase = new T.Color(data.theme.voxel);
    var colFinder = new T.Color(data.theme.finder);
    var colAcc = new T.Color(data.theme.accent);
    var half = data.s / 2;

    var voxels = [];
    for (var i = 0; i < count; i++) {
      var c = data.c[i];
      var t = data.t[i];
      var qx = c[0] - half + 0.5;
      var qz = c[1] - half + 0.5;
      var dist = Math.hypot(qx, qz);
      var delay = (dist / (half * 1.4)) * 0.45;

      voxels.push({
        qx: qx, qz: qz,
        tx: t[0], ty: t[1], tz: t[2], sy: t[3] || 1,
        delay: delay
      });

      if (c[2] === 1) colorObj.copy(colFinder);
      else if (i % 7 === 0) colorObj.copy(colAcc);
      else colorObj.copy(colBase);
      mesh.setColorAt(i, colorObj);
    }
    mesh.instanceColor.needsUpdate = true;
    scene.add(mesh);

    var dummy = new T.Object3D();
    var progress = 0, targetProgress = 0, rotX = 0, rotY = 0, targetRotX = 0, targetRotY = 0;
    var isDragging = false, startX = 0, startY = 0, prevX = 0, prevY = 0;

    function updateTransforms() {
      for (var i = 0; i < count; i++) {
        var v = voxels[i];
        var lt = Math.max(0, Math.min(1, (progress - v.delay) / (1 - v.delay || 0.001)));
        var ease = lt < 0.5 ? 4 * lt * lt * lt : 1 - Math.pow(-2 * lt + 2, 3) / 2;
        var arc = Math.sin(lt * Math.PI) * 5.0;

        var x = v.qx + (v.tx - v.qx) * ease;
        var y = 0.5 + (v.ty - 0.5) * ease + arc;
        var z = v.qz + (v.tz - v.qz) * ease;
        var sy = 1 + (v.sy - 1) * ease;
        // flat QR: the 0.88 cubes widen to a hair over one module, so no light seams show between them
        var sq = 1.142 + (1 - 1.142) * ease;

        dummy.position.set(x, y, z);
        dummy.scale.set(sq, sy, sq);
        if (lt > 0 && lt < 1) {
          dummy.rotation.x = lt * Math.PI * 2;
          dummy.rotation.y = lt * Math.PI;
        } else {
          dummy.rotation.set(0, 0, 0);
        }
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
    updateTransforms();

    var canvas = renderer.domElement;
    canvas.addEventListener("pointerdown", function(e) {
      isDragging = true;
      startX = prevX = e.clientX;
      startY = prevY = e.clientY;
    });
    window.addEventListener("pointermove", function(e) {
      if (isDragging) {
        targetRotY += (e.clientX - prevX) * 0.01;
        targetRotX += (e.clientY - prevY) * 0.01;
        targetRotX = Math.max(-0.6, Math.min(0.8, targetRotX));
        prevX = e.clientX;
        prevY = e.clientY;
      }
    });
    window.addEventListener("pointerup", function(e) {
      isDragging = false;
      var d = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (d < 6) {
        targetProgress = targetProgress === 0 ? 1 : 0;
      }
    });

    var isVisible = true;
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function(es) {
        isVisible = es[0].isIntersecting;
      }, { threshold: 0.05 });
      obs.observe(container);
    }

    function loop() {
      requestAnimationFrame(loop);
      if (!isVisible) return;

      var diff = targetProgress - progress;
      if (Math.abs(diff) > 0.001) {
        progress += diff * 0.08;
        updateTransforms();
      }

      if (targetProgress === 1 && !isDragging) {
        targetRotY += 0.005;
      }
      rotX += (targetRotX - rotX) * 0.1;
      rotY += (targetRotY - rotY) * 0.1;

      mesh.rotation.y = rotY;
      mesh.rotation.x = rotX;
      ground.rotation.y = rotY;
      ground.rotation.x = rotX;

      renderer.render(scene, camera);
    }
    loop();

    window.addEventListener("resize", function() {
      var rw = container.clientWidth || 400;
      var rh = container.clientHeight || ${height};
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
    });
  });
})();
</script>`;
}

// raw-file:E:\Programming\temka\apps\fx\src\embed\cardRuntime.js
var cardRuntime_default = "/* Gridika \xB7 \u0412\u0438\u0437\u0438\u0442\u043A\u0430 \u0441 QR \u2014 runtime shared by the studio and the Tilda snippet.\n * Plain JS without imports: three.js is passed in, so the same text can be inlined into the embed.\n * Everything the card needs (contact text, links, the precomputed QR matrix) comes in `data`. */\n\nexport const CARD_PALETTES = {\n  emerald: { body: '#0f4d3a', edge: '#0b3b2d', bgA: '#14684f', bgB: '#0a3326', text: '#f4f1ec', sub: '#a9dcc6', accent: '#8BF0C2', panel: '#f6f2ea', module: '#0b2a20', cube: '#19C37D', cubeIcon: '#0a3326', metal: 0.1 },\n  graphite: { body: '#2a2f37', edge: '#1c2026', bgA: '#3a414c', bgB: '#1b1f25', text: '#eef1f5', sub: '#a7b0bd', accent: '#d4dbe5', panel: '#f1efeb', module: '#15181d', cube: '#e6e9ee', cubeIcon: '#22272e', metal: 0.25 },\n  gold: { body: '#15120d', edge: '#b8933f', bgA: '#211c14', bgB: '#0c0a07', text: '#ecd9a4', sub: '#b7a274', accent: '#d9b45f', panel: '#f5ecd6', module: '#16130d', cube: '#d9b45f', cubeIcon: '#15120d', metal: 0.7 },\n  ocean: { body: '#0d2f4f', edge: '#0a2540', bgA: '#164a7a', bgB: '#0a2540', text: '#eef6ff', sub: '#9cc3e6', accent: '#6fd3ff', panel: '#f1f6fb', module: '#0a1f33', cube: '#6fd3ff', cubeIcon: '#0a2540', metal: 0.15 },\n  berry: { body: '#4a1026', edge: '#3a0c1e', bgA: '#6e1838', bgB: '#2e0918', text: '#fff0f4', sub: '#e3a3b8', accent: '#ff8fb1', panel: '#fbf1f4', module: '#2a0814', cube: '#ff8fb1', cubeIcon: '#3a0c1e', metal: 0.1 },\n  amethyst: { body: '#2a1a52', edge: '#1f1340', bgA: '#41297e', bgB: '#1a1036', text: '#f4f0ff', sub: '#b9a8e8', accent: '#b69cff', panel: '#f5f2fc', module: '#160d2e', cube: '#b69cff', cubeIcon: '#1f1340', metal: 0.15 },\n  terracotta: { body: '#7a3420', edge: '#5e2717', bgA: '#9c4a2c', bgB: '#5a2414', text: '#fff4ea', sub: '#f0c2a4', accent: '#ffd2a8', panel: '#fbf3ea', module: '#3a160b', cube: '#ffd2a8', cubeIcon: '#5a2414', metal: 0.05 },\n  snow: { body: '#f2efe9', edge: '#d9d3c7', bgA: '#ffffff', bgB: '#ebe6dc', text: '#1d1f22', sub: '#6b6560', accent: '#1f6f54', panel: '#ffffff', module: '#111312', cube: '#1d1f22', cubeIcon: '#ffffff', metal: 0.05 },\n};\n\nexport const CARD_STYLES = ['classic', 'minimal', 'pixel', 'wave', 'split', 'diagonal', 'grid'];\n\nexport function createCardViewer(THREE, container, init) {\n  var W = 5.4, H = 8.6, D = 0.24, R = 0.38, FACE_Z = D / 2 + 0.035;\n  var FONT = \"'Nunito', system-ui, sans-serif\";\n  var state = { data: init.data, mode: init.mode || 'graphite', style: init.style || 'classic', logo: init.logo || null };\n  var api = { onFlip: null };\n\n  // ---------- helpers ----------\n  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }\n  function easeOutBack(t) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }\n  function pal() { return CARD_PALETTES[state.mode] || CARD_PALETTES.graphite; }\n  function rrShape(w, h, r) {\n    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;\n    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);\n    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);\n    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);\n    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);\n    return s;\n  }\n  function faceGeo(w, h, r) {\n    var g = new THREE.ShapeGeometry(rrShape(w, h, r), 10), p = g.attributes.position, uv = g.attributes.uv;\n    for (var i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);\n    return g;\n  }\n  /** rounded cube: extruded rounded square; caps (group 0) get 0..1 UVs for an icon */\n  function roundCube(size, depth, r) {\n    var b = Math.min(0.05, depth * 0.2);\n    var g = new THREE.ExtrudeGeometry(rrShape(size - b * 2, size - b * 2, r), { depth: depth - b * 2, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 6 });\n    g.translate(0, 0, -depth / 2 + b);\n    var p = g.attributes.position, uv = g.attributes.uv, cap = g.groups[0];\n    for (var i = cap.start; i < cap.start + cap.count; i++) uv.setXY(i, (p.getX(i) + size / 2) / size, (p.getY(i) + size / 2) / size);\n    return g;\n  }\n  function rr(ctx, x, y, w, h, r) {\n    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);\n    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();\n  }\n  function fit(ctx, text, weight, size, maxW) {\n    var s = size;\n    var minS = Math.max(24, Math.round(size * 0.45)); // below this the line stops reading: cut it instead\n    do { ctx.font = weight + ' ' + s + 'px ' + FONT; if (ctx.measureText(text).width <= maxW) break; s -= 4; } while (s > minS);\n    return s;\n  }\n  /** fit() and, if even the smallest size is too wide, cut the end off with an ellipsis */\n  function fitStr(ctx, text, weight, size, maxW) {\n    fit(ctx, text, weight, size, maxW);\n    if (ctx.measureText(text).width <= maxW) return text;\n    var t = text;\n    while (t.length > 1 && ctx.measureText(t + '\u2026').width > maxW) t = t.slice(0, -1);\n    return t.replace(/\\s+$/, '') + '\u2026';\n  }\n  function hash(x, y) { var n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return n - Math.floor(n); }\n  function mix(a, b, t) {\n    var A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);\n    var r = Math.round(((A >> 16) & 255) * (1 - t) + ((B >> 16) & 255) * t);\n    var g = Math.round(((A >> 8) & 255) * (1 - t) + ((B >> 8) & 255) * t);\n    var bl = Math.round((A & 255) * (1 - t) + (B & 255) * t);\n    return 'rgb(' + r + ',' + g + ',' + bl + ')';\n  }\n  function icon(ctx, kind, cx, cy, s, color) {\n    ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 24, s / 24); ctx.translate(-12, -12);\n    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';\n    if (kind === 'telegram') {\n      ctx.beginPath(); ctx.moveTo(21.5, 3.5); ctx.lineTo(2.5, 11); ctx.lineTo(9.5, 13.5); ctx.lineTo(12, 20.5); ctx.lineTo(15, 15.5); ctx.lineTo(19.5, 19); ctx.closePath(); ctx.fill();\n    } else if (kind === 'whatsapp') {\n      ctx.beginPath(); ctx.arc(12, 11.5, 8.5, 0.7 * Math.PI, 2.55 * Math.PI); ctx.lineTo(4.2, 20.5); ctx.closePath(); ctx.stroke();\n      ctx.beginPath(); ctx.moveTo(9, 8.5); ctx.quadraticCurveTo(9, 14.5, 15.5, 15); ctx.stroke();\n    } else if (kind === 'site') {\n      ctx.beginPath(); ctx.arc(12, 12, 9, 0, Math.PI * 2); ctx.stroke();\n      ctx.beginPath(); ctx.ellipse(12, 12, 4, 9, 0, 0, Math.PI * 2); ctx.stroke();\n      ctx.beginPath(); ctx.moveTo(3, 12); ctx.lineTo(21, 12); ctx.stroke();\n    } else if (kind === 'phone') {\n      ctx.beginPath(); ctx.moveTo(6, 3.5); ctx.lineTo(9.5, 3.5); ctx.lineTo(11, 8); ctx.lineTo(8.8, 9.6); ctx.quadraticCurveTo(10.5, 13.5, 14.4, 15.2);\n      ctx.lineTo(16, 13); ctx.lineTo(20.5, 14.5); ctx.lineTo(20.5, 18); ctx.quadraticCurveTo(20.5, 20.5, 18, 20.5); ctx.quadraticCurveTo(3.5, 19.5, 3.5, 6); ctx.quadraticCurveTo(3.5, 3.5, 6, 3.5); ctx.fill();\n    } else {\n      rr(ctx, 3, 5.5, 18, 13, 2.5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(3.5, 7); ctx.lineTo(12, 13); ctx.lineTo(20.5, 7); ctx.stroke();\n    }\n    ctx.restore();\n  }\n  function tex(canvas) {\n    var t = new THREE.CanvasTexture(canvas);\n    if ('colorSpace' in t) t.colorSpace = THREE.SRGBColorSpace;\n    t.anisotropy = 8;\n    return t;\n  }\n\n  // ---------- scene ----------\n  var renderer;\n  try {\n    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });\n  } catch (e1) {\n    try {\n      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });\n    } catch (e2) {\n      console.warn('Card WebGLRenderer init failed:', e2);\n      return {\n        domElement: document.createElement('div'),\n        setContact: function() {},\n        setMode: function() {},\n        setStyle: function() {},\n        setLogo: function() {},\n        setFlipped: function() {},\n        setPaused: function() {},\n        checkScan: function() { return { ok: false }; },\n        dispose: function() {}\n      };\n    }\n  }\n  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));\n  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;\n  container.appendChild(renderer.domElement);\n  var cv = renderer.domElement;\n  cv.style.display = 'block'; cv.style.width = '100%'; cv.style.height = '100%'; cv.style.touchAction = 'pan-y';\n\n  var scene = new THREE.Scene();\n  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);\n  scene.add(new THREE.AmbientLight(0xffffff, 1.5));\n  var key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-4, 6, 10); scene.add(key);\n  var rim = new THREE.DirectionalLight(0xffffff, 0.6); rim.position.set(6, -3, 4); scene.add(rim);\n\n  var floatG = new THREE.Group(), pivot = new THREE.Group();\n  floatG.add(pivot); scene.add(floatG);\n\n  var bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.55 });\n  var frontCanvas = document.createElement('canvas'); frontCanvas.width = 1080; frontCanvas.height = 1720;\n  var backCanvas = document.createElement('canvas'); backCanvas.width = 1080; backCanvas.height = 1720;\n  var frontTex = tex(frontCanvas), backTex = tex(backCanvas);\n  var frontMat = new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.62 });\n  var backMat = new THREE.MeshBasicMaterial({ map: backTex });\n\n  var body = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(W, H, R), { depth: D, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 14 }), bodyMat);\n  body.position.z = -D / 2; pivot.add(body);\n  var front = new THREE.Mesh(faceGeo(W, H, R), frontMat); front.position.z = FACE_Z; pivot.add(front);\n  var back = new THREE.Mesh(faceGeo(W, H, R), backMat); back.rotation.y = Math.PI; back.position.z = -FACE_Z; pivot.add(back);\n  var qrGroup = new THREE.Group(); qrGroup.rotation.y = Math.PI; qrGroup.position.z = -FACE_Z; pivot.add(qrGroup);\n  var cubeGroup = new THREE.Group(); cubeGroup.position.z = FACE_Z; pivot.add(cubeGroup);\n\n  var glareMat = new THREE.ShaderMaterial({\n    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,\n    uniforms: { uPos: { value: new THREE.Vector2(0.3, 0.7) }, uStrength: { value: 0 }, uAspect: { value: W / H } },\n    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',\n    fragmentShader: 'varying vec2 vUv; uniform vec2 uPos; uniform float uStrength; uniform float uAspect;' +\n      'void main(){ vec2 p = vUv - uPos; p.x *= uAspect; float spot = exp(-dot(p,p) * 7.0);' +\n      'float band = exp(-pow((vUv.x + vUv.y) - (uPos.x + uPos.y), 2.0) * 22.0) * 0.45;' +\n      'gl_FragColor = vec4(vec3(1.0), (spot * 0.55 + band) * uStrength); }',\n  });\n  var glare = new THREE.Mesh(faceGeo(W, H, R), glareMat); glare.position.z = FACE_Z + 0.004; pivot.add(glare);\n\n  var sc = document.createElement('canvas'); sc.width = 256; sc.height = 384;\n  var sctx = sc.getContext('2d'); sctx.filter = 'blur(22px)'; sctx.fillStyle = 'rgba(30,25,20,0.55)'; rr(sctx, 50, 50, 156, 284, 26); sctx.fill();\n  var shadow = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.55, H * 1.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, opacity: 0.55 }));\n  shadow.position.set(0.45, -0.7, -2.2); scene.add(shadow);\n\n  var moduleMat = new THREE.MeshStandardMaterial({ roughness: 0.7 });\n  var qrMesh = null, qrCells = [], qrModule = 0.08;\n  var cubes = [];\n\n  // ---------- drawing ----------\n  function drawMonogram(ctx, x, y, s, p, invert) {\n    var c = state.data.contact;\n    if (state.logo && state.logo.width) {\n      var k = Math.min(s / state.logo.width, s / state.logo.height);\n      ctx.drawImage(state.logo, x, y + (s - state.logo.height * k) / 2, state.logo.width * k, state.logo.height * k);\n      return;\n    }\n    var initials = (c.name.trim() || '\u0412\u0430\u0448\u0435 \u0418\u043C\u044F').split(/\\s+/).slice(0, 2).map(function (w) { return (w[0] || '').toUpperCase(); }).join('');\n    ctx.fillStyle = invert ? p.bgB : p.accent; rr(ctx, x, y, s, s, s * 0.23); ctx.fill();\n    ctx.fillStyle = invert ? p.accent : p.bgB; ctx.font = '900 ' + Math.round(s * 0.48) + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';\n    ctx.fillText(initials, x + s / 2, y + s / 2 + s * 0.03);\n    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';\n  }\n  function contactRows() {\n    var c = state.data.contact, rows = [];\n    if (c.phone.trim()) rows.push(['phone', c.phone.trim()]);\n    if (c.email.trim()) rows.push(['email', c.email.trim()]);\n    if (state.data.siteLabel) rows.push(['site', state.data.siteLabel]);\n    return rows;\n  }\n  function nameLines() {\n    var n = state.data.contact.name.trim() || '\u0412\u0430\u0448\u0435 \u0418\u043C\u044F', w = n.split(/\\s+/);\n    return w.length > 1 ? [w[0], w.slice(1).join(' ')] : [n];\n  }\n\n  function drawFront() {\n    var p = pal(), c = state.data.contact, ctx = frontCanvas.getContext('2d'), cw = 1080, ch = 1720, maxW = cw - 180;\n    var g = ctx.createLinearGradient(0, 0, cw, ch); g.addColorStop(0, p.bgA); g.addColorStop(1, p.bgB);\n    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);\n    var st = state.style, rows = contactRows(), lines = nameLines(), y, i;\n\n    if (st === 'minimal') {\n      ctx.strokeStyle = p.accent; ctx.globalAlpha = 0.35; ctx.lineWidth = 4; rr(ctx, 50, 50, cw - 100, ch - 100, 46); ctx.stroke(); ctx.globalAlpha = 1;\n      drawMonogram(ctx, cw / 2 - 70, 170, 140, p);\n      ctx.textAlign = 'center'; ctx.fillStyle = p.text; y = 640;\n      for (i = 0; i < lines.length; i++) { ctx.fillText(fitStr(ctx, lines[i], 900, 120, maxW), cw / 2, y); y += 126; }\n      ctx.fillStyle = p.accent; ctx.fillRect(cw / 2 - 50, y - 40, 100, 6); y += 50;\n      if (c.role.trim()) { ctx.fillStyle = p.accent; ctx.fillText(fitStr(ctx, c.role.trim(), 800, 52, maxW), cw / 2, y); y += 62; }\n      if (c.company.trim()) { ctx.fillStyle = p.sub; ctx.fillText(fitStr(ctx, c.company.trim(), 700, 44, maxW), cw / 2, y); }\n      y = 1200;\n      for (i = 0; i < rows.length; i++) { ctx.fillStyle = p.text; ctx.fillText(fitStr(ctx, rows[i][1], 700, 44, maxW), cw / 2, y); y += 66; }\n      ctx.textAlign = 'left';\n    } else {\n      var top = 110;\n      if (st === 'pixel') {\n        // voxel mosaic across the top half, monogram sitting on it\n        var cell = 60;\n        for (var gy = 0; gy < 11; gy++) for (var gx = 0; gx < 18; gx++) {\n          var h = hash(gx, gy), fade = 1 - gy / 11;\n          if (h > 0.3 + fade * 0.55) continue;\n          ctx.globalAlpha = 0.18 + fade * 0.62;\n          ctx.fillStyle = mix(p.accent, p.bgA, 0.1 + h * 0.55);\n          rr(ctx, 20 + gx * cell, 20 + gy * cell, cell - 8, cell - 8, 8); ctx.fill();\n        }\n        ctx.globalAlpha = 1; top = 470;\n        drawMonogram(ctx, 90, 140, 210, p);\n      } else if (st === 'wave') {\n        // the Gridika wave washing in from the bottom-left\n        ctx.fillStyle = p.accent; ctx.globalAlpha = 0.18;\n        ctx.beginPath(); ctx.moveTo(0, ch); ctx.lineTo(0, 1020);\n        ctx.bezierCurveTo(260, 900, 420, 1180, 640, 1120); ctx.bezierCurveTo(860, 1060, 940, 1240, cw, 1200); ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill();\n        ctx.globalAlpha = 0.32;\n        ctx.beginPath(); ctx.moveTo(0, ch); ctx.lineTo(0, 1260); ctx.bezierCurveTo(300, 1150, 520, 1420, 760, 1340); ctx.bezierCurveTo(900, 1290, 980, 1380, cw, 1360); ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill();\n        ctx.globalAlpha = 1;\n        drawMonogram(ctx, 90, 110, 190, p);\n      } else if (st === 'split') {\n        // two-tone: a solid accent block with the name, the dark half below\n        var sg = ctx.createLinearGradient(0, 0, cw, 900); sg.addColorStop(0, p.accent); sg.addColorStop(1, mix(p.accent, p.bgA, 0.25));\n        ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(cw, 0); ctx.lineTo(cw, 860); ctx.bezierCurveTo(760, 930, 320, 830, 0, 900); ctx.closePath(); ctx.fill();\n        drawMonogram(ctx, 90, 110, 170, p, true);\n      } else if (st === 'diagonal') {\n        // a bold diagonal band with thin echoes\n        // kept above the name: at the left edge the band ends well before the first line of text\n        ctx.save(); ctx.translate(cw * 0.8, 40); ctx.rotate(-0.45);\n        ctx.fillStyle = p.accent; ctx.globalAlpha = 0.9; ctx.fillRect(-1100, -70, 2200, 140);\n        ctx.globalAlpha = 0.35; ctx.fillRect(-1100, -126, 2200, 16); ctx.fillRect(-1100, -160, 2200, 6);\n        ctx.restore(); ctx.globalAlpha = 1;\n        drawMonogram(ctx, 90, 110, 190, p);\n      } else if (st === 'grid') {\n        // blueprint: a fine grid and crop marks\n        ctx.strokeStyle = p.accent; ctx.lineWidth = 2; ctx.globalAlpha = 0.12;\n        for (gx = 60; gx < cw; gx += 60) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, ch); ctx.stroke(); }\n        for (gy = 60; gy < ch; gy += 60) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cw, gy); ctx.stroke(); }\n        ctx.globalAlpha = 0.8; ctx.lineWidth = 5;\n        [[50, 50, 1, 1], [cw - 50, 50, -1, 1], [50, ch - 50, 1, -1], [cw - 50, ch - 50, -1, -1]].forEach(function (k) {\n          ctx.beginPath(); ctx.moveTo(k[0], k[1] + k[3] * 70); ctx.lineTo(k[0], k[1]); ctx.lineTo(k[0] + k[2] * 70, k[1]); ctx.stroke();\n        });\n        ctx.globalAlpha = 1; ctx.lineWidth = 6; rr(ctx, 90, 110, 190, 190, 44); ctx.stroke();\n        var gi = (c.name.trim() || '\u0412\u0430\u0448\u0435 \u0418\u043C\u044F').split(/\\s+/).slice(0, 2).map(function (w) { return (w[0] || '').toUpperCase(); }).join('');\n        if (state.logo && state.logo.width) drawMonogram(ctx, 105, 125, 160, p);\n        else { ctx.fillStyle = p.accent; ctx.font = '900 88px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(gi, 185, 212); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; }\n      } else {\n        // classic: a few cubes fading out of the top-right corner\n        for (gy = 0; gy < 9; gy++) for (gx = 0; gx < 9; gx++) {\n          var d = Math.hypot(gx, gy) / 9;\n          if (hash(gx, gy) > 0.82 - d * 0.5 || d > 1.05) continue;\n          ctx.globalAlpha = 0.22 * (1 - d); ctx.fillStyle = p.accent;\n          rr(ctx, cw - 70 - (gx + 1) * 46, 70 + gy * 46, 38, 38, 7); ctx.fill();\n        }\n        ctx.globalAlpha = 1;\n        drawMonogram(ctx, 90, 110, 190, p);\n      }\n      y = st === 'pixel' ? 820 : st === 'split' ? 500 : 720;\n      ctx.fillStyle = st === 'split' ? p.bgB : p.text;\n      for (i = 0; i < lines.length; i++) { ctx.fillText(fitStr(ctx, lines[i], 900, 128, maxW), 90, y); y += 132; }\n      y += st === 'split' ? 170 : 10;\n      if (c.role.trim()) { ctx.fillStyle = p.accent; ctx.fillText(fitStr(ctx, c.role.trim(), 800, 56, maxW), 92, y); y += 64; }\n      if (c.company.trim()) { ctx.fillStyle = p.sub; ctx.fillText(fitStr(ctx, c.company.trim(), 700, 46, maxW), 92, y); }\n      var ry = st === 'pixel' ? 1290 : 1220;\n      ctx.fillStyle = p.accent; ctx.fillRect(92, ry - 90, 90, 8);\n      for (i = 0; i < rows.length; i++) {\n        icon(ctx, rows[i][0], 112, ry - 16, 40, p.accent); ctx.fillStyle = p.text;\n        ctx.fillText(fitStr(ctx, rows[i][1], 700, 46, maxW - 80), 160, ry); ry += 72;\n      }\n      void top;\n    }\n    ctx.fillStyle = p.sub; ctx.globalAlpha = 0.7; ctx.font = '700 34px ' + FONT; ctx.textAlign = 'right';\n    ctx.fillText('QR \u043D\u0430 \u043E\u0431\u043E\u0440\u043E\u0442\u0435 \u21BB', cw - 90, ch - 92); ctx.textAlign = 'left'; ctx.globalAlpha = 1;\n    frontTex.needsUpdate = true;\n  }\n\n  function drawBack() {\n    var p = pal(), ctx = backCanvas.getContext('2d'), cw = 1080, ch = 1720;\n    var g = ctx.createLinearGradient(cw, 0, 0, ch); g.addColorStop(0, p.bgA); g.addColorStop(1, p.bgB);\n    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);\n    if (state.style === 'pixel') {\n      for (var gx = 0; gx < 18; gx++) for (var gy = 0; gy < 3; gy++) {\n        var h = hash(gx + 40, gy); if (h > 0.55) continue;\n        ctx.globalAlpha = 0.18 + h * 0.3; ctx.fillStyle = p.accent; rr(ctx, 20 + gx * 60, ch - 200 + gy * 60, 52, 52, 8); ctx.fill();\n      }\n      ctx.globalAlpha = 1;\n    } else if (state.style === 'wave') {\n      ctx.fillStyle = p.accent; ctx.globalAlpha = 0.2;\n      ctx.beginPath(); ctx.moveTo(0, ch); ctx.lineTo(0, 1500); ctx.bezierCurveTo(300, 1420, 600, 1600, cw, 1480); ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill();\n      ctx.globalAlpha = 1;\n    }\n    var m = 70;\n    ctx.fillStyle = p.panel; rr(ctx, m, m + 40, cw - m * 2, cw - m * 2, 48); ctx.fill();\n    ctx.textAlign = 'center';\n    ctx.fillStyle = p.text; ctx.font = '900 72px ' + FONT; ctx.fillText('\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043A\u043E\u043D\u0442\u0430\u043A\u0442', cw / 2, cw + 180);\n    ctx.fillStyle = p.sub; ctx.font = '700 42px ' + FONT;\n    ctx.fillText('\u041D\u0430\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u0430\u043C\u0435\u0440\u0443 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430', cw / 2, cw + 250); ctx.fillText('\u043D\u0430 QR-\u043A\u043E\u0434', cw / 2, cw + 300);\n    var n = state.data.contact.name.trim();\n    if (n) { ctx.fillStyle = p.accent; ctx.fillText(fitStr(ctx, n, 800, 52, cw - 200), cw / 2, ch - (state.style === 'pixel' ? 250 : 150)); }\n    ctx.textAlign = 'left';\n    backTex.needsUpdate = true;\n  }\n\n  function buildQr() {\n    if (qrMesh) { qrGroup.remove(qrMesh); qrMesh.geometry.dispose(); }\n    var q = state.data.qr, size = q.size, quiet = 3, unit = W / 1080, panelPx = 1080 - 140;\n    var mod = (panelPx * unit) / (size + quiet * 2), cy = H / 2 - (70 + 40 + panelPx / 2) * unit;\n    qrModule = mod; qrCells = [];\n    for (var i = 0; i < q.cells.length; i++) {\n      var c = q.cells[i][0], r = q.cells[i][1];\n      var dc = Math.hypot(c - size / 2, r - size / 2) / (size * 0.71);\n      qrCells.push({ x: (c - (size - 1) / 2) * mod, y: cy - (r - (size - 1) / 2) * mod, delay: dc * 0.55 + ((r * 7 + c * 13) % 10) * 0.012 });\n    }\n    qrMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(mod * 1.04, mod * 1.04, mod * 0.9), moduleMat, qrCells.length);\n    qrGroup.add(qrMesh);\n    assembleStart = flipped ? -2 : -1;\n    updateQr(1e9);\n  }\n\n  var mtx = new THREE.Matrix4(), quat = new THREE.Quaternion(), scl = new THREE.Vector3(), vec = new THREE.Vector3();\n  function updateQr(now) {\n    if (!qrMesh) return;\n    var h = qrModule * 0.9;\n    for (var i = 0; i < qrCells.length; i++) {\n      var cell = qrCells[i], k;\n      if (assembleStart === -1) k = 0; else if (assembleStart === -2) k = 1; else k = (now - assembleStart - cell.delay) / 0.45;\n      k = Math.min(1, Math.max(0, k));\n      var e = easeOutBack(k), s = Math.max(0.0001, Math.min(1.08, e));\n      vec.set(cell.x, cell.y, h / 2 + (1 - Math.min(1, e)) * 2.2); scl.set(s, s, s);\n      mtx.compose(vec, quat, scl); qrMesh.setMatrixAt(i, mtx);\n    }\n    qrMesh.instanceMatrix.needsUpdate = true;\n  }\n\n  function cubeTex(kind) {\n    var p = pal(), c = document.createElement('canvas'); c.width = c.height = 128;\n    var ctx = c.getContext('2d'); ctx.fillStyle = p.cube; ctx.fillRect(0, 0, 128, 128); icon(ctx, kind, 64, 64, 62, p.cubeIcon);\n    return tex(c);\n  }\n  function buildCubes() {\n    cubes.forEach(function (cb) { cubeGroup.remove(cb.mesh); cb.mesh.geometry.dispose(); cb.mesh.material.forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); }); });\n    cubes = [];\n    var size = 0.66, links = (state.data.links || []).slice(0, 3), p = pal(), metal = state.mode === 'gold' ? 0.5 : 0.05;\n    links.forEach(function (l, i) {\n      var face = new THREE.MeshStandardMaterial({ map: cubeTex(l.kind), roughness: 0.5, metalness: metal * 0.8 });\n      var side = new THREE.MeshStandardMaterial({ color: p.cube, roughness: 0.5, metalness: metal });\n      var mesh = new THREE.Mesh(roundCube(size, size * 0.55, 0.1), [face, side]);\n      var bx = state.style === 'minimal' ? (i - (links.length - 1) / 2) * (size + 0.22) : -W / 2 + 0.62 + size / 2 + i * (size + 0.22);\n      mesh.position.set(bx, -H / 2 + 0.62 + size / 2, size * 0.275);\n      cubeGroup.add(mesh);\n      cubes.push({ mesh: mesh, url: l.url, lift: 0 });\n    });\n  }\n\n  function applyMode() {\n    var p = pal();\n    bodyMat.color.set(p.edge); bodyMat.metalness = p.metal; bodyMat.roughness = p.metal > 0.5 ? 0.35 : 0.55;\n    moduleMat.color.set(p.module);\n  }\n  function redraw() { drawFront(); drawBack(); buildCubes(); }\n\n  // ---------- interaction ----------\n  var raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(), inside = false, hovered = null, down = null;\n  var flipped = false, flipFrom = 0, flipTo = 0, flipStart = -1, assembleStart = -1;\n  var tiltX = 0, tiltY = 0, distFront = 20, distBack = 18, visible = true, paused = false, raf = 0, disposed = false;\n  var t0 = performance.now();\n  function now() { return (performance.now() - t0) / 1000; }\n  var gyro = null;\n\n  function flipAngle(t) {\n    if (flipStart < 0) return flipTo;\n    var k = Math.min(1, (t - flipStart) / 0.9);\n    return flipFrom + (flipTo - flipFrom) * easeInOut(k);\n  }\n  function setFlipped(f) {\n    if (f === flipped) return;\n    var t = now(); flipFrom = flipAngle(t); flipped = f; flipTo = f ? Math.PI : 0; flipStart = t;\n    if (f) assembleStart = t + 0.55;\n    if (api.onFlip) api.onFlip(f);\n  }\n  cv.addEventListener('pointermove', function (e) {\n    var r = cv.getBoundingClientRect();\n    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); inside = true;\n  });\n  cv.addEventListener('pointerleave', function () { inside = false; hovered = null; cv.style.cursor = ''; });\n  cv.addEventListener('pointerdown', function (e) { down = { x: e.clientX, y: e.clientY }; });\n  cv.addEventListener('pointerup', function (e) {\n    if (!down) return;\n    var dx = e.clientX - down.x, dy = e.clientY - down.y; down = null;\n    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { setFlipped(!flipped); return; }\n    if (Math.hypot(dx, dy) > 8) return;\n    if (hovered && !flipped) { window.open(hovered.url, '_blank', 'noopener'); return; }\n    raycaster.setFromCamera(pointer, camera);\n    if (raycaster.intersectObject(pivot, true).length) setFlipped(!flipped);\n  });\n  // phones: tilt with the gyroscope once the page gets orientation events\n  window.addEventListener('deviceorientation', function (e) {\n    if (e.beta == null || e.gamma == null) return;\n    gyro = { x: Math.max(-1, Math.min(1, (e.beta - 40) / 30)), y: Math.max(-1, Math.min(1, e.gamma / 30)) };\n  });\n\n  function resize() {\n    var w = container.clientWidth || 400, h = container.clientHeight || 500;\n    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';\n    camera.aspect = w / h;\n    var fov = THREE.MathUtils.degToRad(camera.fov);\n    function fitD(pw, ph) { return Math.max((H * ph) / 2 / Math.tan(fov / 2), (W * pw) / 2 / Math.tan(fov / 2) / camera.aspect); }\n    distFront = fitD(1.3, 1.18); distBack = distFront; // the QR side keeps the same size as the front\n    camera.position.set(0, 0, flipped ? distBack : distFront); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();\n  }\n\n  function frame(t) {\n    var angle = flipAngle(t), fk = flipStart < 0 ? 1 : Math.min(1, (t - flipStart) / 0.9), lift = Math.sin(fk * Math.PI) * 0.9;\n    camera.position.z += ((flipped ? distBack : distFront) - camera.position.z) * 0.06;\n    var amp = flipped ? 0.25 : 1, px = inside ? pointer.x : gyro ? gyro.y : null, py = inside ? pointer.y : gyro ? -gyro.x : null;\n    var tx = py !== null ? -py * 0.2 * amp : Math.sin(t * 0.7) * 0.03 * amp;\n    var ty = px !== null ? px * 0.28 * amp : Math.sin(t * 0.5) * 0.06 * amp;\n    tiltX += (tx - tiltX) * 0.08; tiltY += (ty - tiltY) * 0.08;\n    pivot.rotation.set(tiltX, angle + tiltY, 0); pivot.position.z = lift;\n    floatG.position.y = Math.sin(t * 1.1) * 0.06;\n    shadow.scale.x = Math.max(0.12, Math.abs(Math.cos(angle)));\n    shadow.position.x = 0.45 - tiltY * 1.2; shadow.position.y = -0.7 + tiltX * 1.2;\n    var u = glareMat.uniforms; u.uPos.value.set(0.5 - tiltY * 1.6, 0.5 + tiltX * 2.0);\n    u.uStrength.value = (flipped ? 0 : 0.18 + Math.min(1, Math.hypot(tiltX, tiltY) * 5) * 0.35) * (1 - Math.sin(fk * Math.PI));\n    if (assembleStart >= 0 && t - assembleStart < 1.4) updateQr(t);\n    hovered = null;\n    if (inside && !flipped && fk >= 1) {\n      raycaster.setFromCamera(pointer, camera);\n      var hit = raycaster.intersectObjects(cubes.map(function (c) { return c.mesh; }), false)[0];\n      if (hit) for (var i = 0; i < cubes.length; i++) if (cubes[i].mesh === hit.object) hovered = cubes[i];\n    }\n    cv.style.cursor = inside ? 'pointer' : '';\n    cubes.forEach(function (cb) {\n      cb.lift += ((cb === hovered ? 1 : 0) - cb.lift) * 0.18;\n      cb.mesh.position.z = 0.66 * 0.275 + cb.lift * 0.32; cb.mesh.scale.setScalar(1 + cb.lift * 0.1);\n      cb.mesh.rotation.set(cb.lift * 0.18, -cb.lift * 0.22, 0);\n    });\n  }\n  function loop() {\n    raf = requestAnimationFrame(loop);\n    if (!visible || paused) return;\n    frame(now()); renderer.render(scene, camera);\n  }\n\n  var ro = new ResizeObserver(resize); ro.observe(container);\n  var io = null;\n  if ('IntersectionObserver' in window) { io = new IntersectionObserver(function (e) { visible = e[0] ? e[0].isIntersecting : true; }, { threshold: 0.02 }); io.observe(container); }\n\n  applyMode(); drawFront(); drawBack(); buildQr(); buildCubes(); resize(); loop();\n  if (document.fonts && document.fonts.load) {\n    Promise.all([document.fonts.load('900 64px Nunito'), document.fonts.load('700 40px Nunito')]).then(function () { if (!disposed) { drawFront(); drawBack(); } });\n  }\n\n  // ---------- public ----------\n  api.setData = function (d) { state.data = d; drawFront(); drawBack(); buildQr(); buildCubes(); };\n  api.setMode = function (m) { state.mode = m; applyMode(); redraw(); };\n  api.setStyle = function (s) { state.style = s; redraw(); };\n  api.setLogo = function (img) { state.logo = img; drawFront(); };\n  api.setFlipped = setFlipped;\n  api.isFlipped = function () { return flipped; };\n  api.setPaused = function (p) { paused = p; };\n  /** render the current frame into a 2D canvas (works without preserveDrawingBuffer) */\n  api.snapshot = function () {\n    frame(now()); renderer.render(scene, camera);\n    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;\n    var c = out.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, out.width, out.height); c.drawImage(cv, 0, 0);\n    return out;\n  };\n  api.dispose = function () {\n    disposed = true; cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect();\n    scene.traverse(function (o) {\n      if (o.geometry) o.geometry.dispose();\n      var m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(function (x) { if (x.map) x.map.dispose(); x.dispose(); });\n    });\n    renderer.dispose(); cv.remove();\n  };\n  return api;\n}\n";

// src/engine/cardScene.ts
var import_jsqr = __toESM(require_jsQR(), 1);

// src/engine/vcard.ts
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

// src/engine/cardScene.ts
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

// src/engine/cardEmbedGenerator.ts
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
<div id="${id}" style="position:relative;width:100%;max-width:440px;height:${height}px;margin:0 auto;">${badge}</div>
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
var giftRuntime_default = "/* Gridika \xB7 \u041F\u043E\u0434\u0430\u0440\u043E\u043A \u0441 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\u043E\u043C \u2014 runtime shared by the studio and the site snippet.\n * Plain JS without imports: three.js is passed in. The reward (promo code / discount / QR coupon)\n * comes precomputed as a grid of cells, so the snippet needs no fonts or QR library for it. */\n\nexport const GIFT_PALETTES = {\n  festive: { box: '#d6333f', ribbon: '#f2c14e', pattern: '#f6d26b', podium: '#f6efe4', podiumEdge: '#e4d8c4', reward: '#d6333f', plate: '#fff8ec', badge: '#d6333f', badgeText: '#fff8ec', confetti: ['#d6333f', '#f2c14e', '#ffffff', '#19C37D', '#ff8fb1', '#5b8def'], neon: false, metal: 0.25, btn: '#d6333f', btnText: '#ffffff' },\n  kraft: { box: '#c9a27a', ribbon: '#6b4a2e', pattern: '#efe3cf', podium: '#f1e8da', podiumEdge: '#ddcfb8', reward: '#6b4a2e', plate: '#fbf4e8', badge: '#6b4a2e', badgeText: '#fbf4e8', confetti: ['#c9a27a', '#6b4a2e', '#efe3cf', '#a3c49a', '#d98a5a'], neon: false, metal: 0, btn: '#6b4a2e', btnText: '#fff7ec' },\n  neon: { box: '#1b1b22', ribbon: '#ff2e88', pattern: '#2ef2ff', podium: '#2a2a33', podiumEdge: '#1c1c23', reward: '#ff2e88', plate: '#22222b', badge: '#ff2e88', badgeText: '#ffffff', confetti: ['#ff2e88', '#2ef2ff', '#f7ff2e', '#ffffff', '#9d4bff'], neon: true, metal: 0.1, btn: '#ff2e88', btnText: '#ffffff' },\n  mint: { box: '#7fd6b4', ribbon: '#ff7aa8', pattern: '#ffffff', podium: '#f4f1ea', podiumEdge: '#e2dccf', reward: '#e0457b', plate: '#ffffff', badge: '#ff7aa8', badgeText: '#ffffff', confetti: ['#7fd6b4', '#ff7aa8', '#ffffff', '#ffd166', '#a78bfa'], neon: false, metal: 0.05, btn: '#e0457b', btnText: '#ffffff' },\n  royal: { box: '#24356b', ribbon: '#dfe3ec', pattern: '#f2c14e', podium: '#eef0f5', podiumEdge: '#d6dae4', reward: '#24356b', plate: '#ffffff', badge: '#24356b', badgeText: '#f2c14e', confetti: ['#24356b', '#dfe3ec', '#f2c14e', '#ffffff', '#5b8def'], neon: false, metal: 0.55, btn: '#24356b', btnText: '#ffffff' },\n  sunny: { box: '#ffc83d', ribbon: '#3b6fe0', pattern: '#ffffff', podium: '#f7f2e8', podiumEdge: '#e6dcc8', reward: '#3b6fe0', plate: '#ffffff', badge: '#3b6fe0', badgeText: '#ffffff', confetti: ['#ffc83d', '#3b6fe0', '#ffffff', '#ff6b6b', '#19C37D'], neon: false, metal: 0.1, btn: '#3b6fe0', btnText: '#ffffff' },\n};\n\n/** box proportions in voxels: width, height */\nvar SHAPES = { cube: [8, 6], tall: [6, 9], flat: [10, 4] };\n\nexport function createGiftViewer(THREE, container, init) {\n  var U = 0.5; // voxel size\n  var state = { data: init.data, mode: init.mode || 'festive' };\n  var api = { onOpen: null };\n  function pal() { return GIFT_PALETTES[state.mode] || GIFT_PALETTES.festive; }\n  function easeOutBack(t) { var c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }\n  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }\n  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }\n  function rnd(i) { var n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }\n\n  // ---------- renderer / scene ----------\n  var renderer;\n  try {\n    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });\n  } catch (e1) {\n    try {\n      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });\n    } catch (e2) {\n      console.warn('Gift WebGLRenderer init failed:', e2);\n      return {\n        domElement: document.createElement('div'),\n        setSettings: function() {},\n        setMode: function() {},\n        open: function() {},\n        close: function() {},\n        setPaused: function() {},\n        checkScan: function() { return { ok: false }; },\n        dispose: function() {}\n      };\n    }\n  }\n  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));\n  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;\n  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';\n  container.appendChild(renderer.domElement);\n  var cv = renderer.domElement;\n  cv.style.display = 'block'; cv.style.width = '100%'; cv.style.height = '100%'; cv.style.cursor = 'pointer';\n\n  var scene = new THREE.Scene();\n  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);\n  var hemi = new THREE.HemisphereLight(0xffffff, 0xd8cfc0, 1.6); scene.add(hemi);\n  var sun = new THREE.DirectionalLight(0xffffff, 1.7); sun.position.set(6, 12, 8); scene.add(sun);\n  var world = new THREE.Group(); scene.add(world);\n  var cube = new THREE.BoxGeometry(U * 0.96, U * 0.96, U * 0.96);\n  var mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), sc = new THREE.Vector3(), vp = new THREE.Vector3(), col = new THREE.Color();\n\n  // podium\n  var podiumMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });\n  var podiumEdgeMat = new THREE.MeshStandardMaterial({ roughness: 0.85 });\n  var podium = new THREE.Mesh(new THREE.BoxGeometry(9, 0.5, 9), [podiumEdgeMat, podiumEdgeMat, podiumMat, podiumEdgeMat, podiumEdgeMat, podiumEdgeMat]);\n  podium.position.y = -0.25; world.add(podium);\n  var shc = document.createElement('canvas'); shc.width = shc.height = 128;\n  var sx = shc.getContext('2d'); var sg = sx.createRadialGradient(64, 64, 8, 64, 64, 62);\n  sg.addColorStop(0, 'rgba(40,30,20,0.45)'); sg.addColorStop(1, 'rgba(40,30,20,0)'); sx.fillStyle = sg; sx.fillRect(0, 0, 128, 128);\n  var shadowTex = new THREE.CanvasTexture(shc);\n  var shadow = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));\n  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.005; world.add(shadow);\n  var lidShadow = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 }));\n  lidShadow.rotation.x = -Math.PI / 2; lidShadow.position.y = 0.006; world.add(lidShadow);\n\n  // ---------- the box (rebuilt when shape / pattern / colours change) ----------\n  var boxG = new THREE.Group(); world.add(boxG);\n  var bodyG = new THREE.Group(); boxG.add(bodyG);\n  var lidG = new THREE.Group(); boxG.add(lidG);\n  var paintMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.55 }); // colours come per cube\n  var ribbonMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.2 });\n  var N = 8, HB = 6, LN = 10, LID_Y = 3.5;\n  var bodyMesh, bodyRibbonMesh, lidMesh, lidRibbonMesh, bowMesh, bodyCells = [], bodyRibbon = [], lidCells = [], lidRibbon = [], bowCells = [];\n\n  function patternAt(u, v) {\n    var pat = state.data.pattern || 'plain';\n    if (pat === 'dots') return u % 3 === 1 && v % 3 === 1;\n    if (pat === 'stripes') return ((u + v) % 4) < 1;\n    return false;\n  }\n  function disposeBox() {\n    [bodyMesh, bodyRibbonMesh, lidMesh, lidRibbonMesh, bowMesh].forEach(function (m) { if (m) { m.parent.remove(m); if (m.dispose) m.dispose(); } });\n  }\n  function instanced(cells, mat, parent) {\n    var m = new THREE.InstancedMesh(cube, mat, Math.max(1, cells.length));\n    m.count = cells.length;\n    cells.forEach(function (c, i) { mtx.makeTranslation(c[0], c[1], c[2]); m.setMatrixAt(i, mtx); });\n    parent.add(m);\n    return m;\n  }\n  function buildBox() {\n    disposeBox();\n    var dims = SHAPES[state.data.shape] || SHAPES.cube, p = pal();\n    N = dims[0]; HB = dims[1]; LN = N + 2;\n    var mid0 = N / 2 - 1, mid1 = N / 2, lm0 = LN / 2 - 1, lm1 = LN / 2;\n    bodyCells = []; bodyRibbon = []; lidCells = []; lidRibbon = []; bowCells = [];\n    var bodyCol = [], lidCol = [];\n    for (var y = 0; y < HB; y++) for (var x = 0; x < N; x++) for (var z = 0; z < N; z++) {\n      if (!(x === 0 || x === N - 1 || z === 0 || z === N - 1 || y === 0)) continue;\n      var pos = [(x - (N - 1) / 2) * U, (y + 0.5) * U, (z - (N - 1) / 2) * U];\n      bodyCells.push(pos);\n      var u = (z === 0 || z === N - 1) ? x : z; // horizontal coordinate along the face\n      bodyCol.push(y > 0 && patternAt(u, y) ? p.pattern : p.box);\n      if (y === 0) continue;\n      if ((x === mid0 || x === mid1) && (z === 0 || z === N - 1)) bodyRibbon.push([pos[0], pos[1], pos[2] + (z === 0 ? -1 : 1) * U * 0.56, 2]);\n      if ((z === mid0 || z === mid1) && (x === 0 || x === N - 1)) bodyRibbon.push([pos[0] + (x === 0 ? -1 : 1) * U * 0.56, pos[1], pos[2], 0]);\n    }\n    for (y = 0; y < 2; y++) for (x = 0; x < LN; x++) for (z = 0; z < LN; z++) {\n      if (y === 0 && x > 0 && x < LN - 1 && z > 0 && z < LN - 1) continue;\n      var lp = [(x - (LN - 1) / 2) * U, (y - 0.5) * U, (z - (LN - 1) / 2) * U];\n      if (x === lm0 || x === lm1 || z === lm0 || z === lm1) lidRibbon.push(lp);\n      else { lidCells.push(lp); lidCol.push(y === 1 && patternAt(x, z) ? p.pattern : p.box); }\n    }\n    var BOW = ['.XX....XX.', 'X..X..X..X', 'X..XXXX..X', '.XXXXXXXX.'];\n    for (var r = 0; r < BOW.length; r++) for (x = 0; x < BOW[r].length; x++) {\n      if (BOW[r][x] !== 'X') continue;\n      for (z = 0; z < 2; z++) bowCells.push([(x - 4.5) * U, (BOW.length - r + 0.5) * U, (z - 0.5) * U]);\n    }\n    bodyMesh = instanced(bodyCells, paintMat, bodyG);\n    bodyRibbonMesh = instanced(bodyRibbon, ribbonMat, bodyG);\n    lidMesh = instanced(lidCells, paintMat, lidG);\n    lidRibbonMesh = instanced(lidRibbon, ribbonMat, lidG);\n    bowMesh = instanced(bowCells, ribbonMat, lidG);\n    // colours with a subtle per-cube shade so the voxels read\n    [[bodyMesh, bodyCol, 1], [lidMesh, lidCol, 2]].forEach(function (a) {\n      a[1].forEach(function (hex, i) { col.set(hex); col.multiplyScalar(0.93 + rnd(i + a[2] * 1000) * 0.1); a[0].setColorAt(i, col); });\n      if (a[0].instanceColor) a[0].instanceColor.needsUpdate = true;\n    });\n    LID_Y = HB * U + U;\n    computeLidRest();\n    setBow(openT < 0 ? -1 : 9); setBodyRibbon(openT < 0 ? -1 : 9);\n  }\n\n  // The lid ends up leaning against the box corner on the camera's left, standing on the podium.\n  // Computed from the box size so it never sinks into the podium, the box or the reward above.\n  var lidRest = { pos: new THREE.Vector3(), yaw: 0, tilt: 0, top: 0 };\n  function computeLidRest() {\n    var th = 0.7, phi = camYaw - 0.35; // lean angle and the direction it leans towards the box\n    var W2 = (LN * U) / 2, T2 = U, sn = Math.sin(th), cs = Math.cos(th);\n    var yc = W2 * sn + T2 * cs + 0.03;                      // lowest corner just above the podium\n    var yb = HB * U;                                         // box top\n    var lx = (yb - yc + T2 * cs) / sn;                       // where the lid face reaches the box top\n    var reach = Math.min(lx, W2) * cs + T2 * sn;              // how far the lid extends towards the box\n    var support = (N * U / 2) * (Math.abs(Math.cos(phi)) + Math.abs(Math.sin(phi))); // box corner along that direction\n    var dist = support + reach + 0.12;\n    lidRest.pos.set(-Math.cos(phi) * dist, yc, Math.sin(phi) * dist);\n    lidRest.yaw = phi; lidRest.tilt = th;\n    lidRest.top = yc + W2 * sn + T2 * cs;\n  }\n  lidG.rotation.order = 'YZX';\n\n  // ---------- reward on a plate: ticket (code), star badge (discount), framed card (QR) ----------\n  var rewardG = new THREE.Group(); world.add(rewardG);\n  var letterMat = new THREE.MeshStandardMaterial({ roughness: 0.45 });\n  var qrModMat = new THREE.MeshBasicMaterial({ color: '#141414' });\n  var plateMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7 });\n  var plateWhiteMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });\n  var rewardMesh = null, plateMesh = null, plateWhite = null, rewardCells = [], plateCells = [], plateWhiteCells = [];\n  var rewardCell = 0.14, plateW = 0, plateH = 0, REWARD_Y = 6;\n\n  function plateLayout(d) {\n    // cells: [x, y, kind] \u2014 kind 0 = edge colour, 1 = plate colour, 2 = white (behind the QR)\n    var cells = [], W, H, x, y;\n    if (d.kind === 'percent') {\n      var D = Math.ceil(Math.sqrt(d.w * d.w + d.h * d.h)) + 7, R = D / 2, c0 = (D - 1) / 2;\n      for (y = 0; y < D; y++) for (x = 0; x < D; x++) {\n        var dx = x - c0, dy = y - c0, rr = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);\n        var lim = R * (0.88 + 0.12 * Math.cos(a * 12));\n        if (rr <= lim) cells.push([x, y, rr > lim - 1.2 ? 0 : 1]);\n      }\n      return { W: D, H: D, ox: Math.floor((D - d.w) / 2), oy: Math.floor((D - d.h) / 2), cells: cells };\n    }\n    var pad = 4, padY = d.kind === 'qr' ? 4 : 3, rad = 2;\n    W = d.w + pad * 2; H = d.h + padY * 2;\n    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {\n      var cx = x < rad ? rad - x : x > W - 1 - rad ? x - (W - 1 - rad) : 0;\n      var cy = y < rad ? rad - y : y > H - 1 - rad ? y - (H - 1 - rad) : 0;\n      if (cx * cx + cy * cy > rad * rad + 0.5) continue; // rounded corners\n      if (d.kind === 'code') { var my = (H - 1) / 2; if ((x < 2 || x > W - 3) && Math.abs(y - my) < 1.6 - (x < 2 ? x : W - 1 - x) * 0.5) continue; } // ticket notches\n      var edge = x === 0 || y === 0 || x === W - 1 || y === H - 1 || cx * cx + cy * cy > (rad - 1) * (rad - 1) + 0.5;\n      cells.push([x, y, edge ? 0 : d.kind === 'qr' ? 2 : 1]);\n    }\n    return { W: W, H: H, ox: pad, oy: padY, cells: cells };\n  }\n\n  function buildReward() {\n    [rewardMesh, plateMesh, plateWhite].forEach(function (m) { if (m) { rewardG.remove(m); m.geometry.dispose(); } });\n    var d = state.data.reward, isQr = d.kind === 'qr';\n    var L = plateLayout(d);\n    rewardCell = Math.min(isQr ? 0.17 : 0.15, (isQr ? 6.0 : 6.6) / L.W);\n    plateW = L.W * rewardCell; plateH = L.H * rewardCell;\n    REWARD_Y = Math.max(HB * U + 1.6, lidRest.top + 0.5) + plateH / 2;\n    var cx = (L.W - 1) / 2, cy = (L.H - 1) / 2;\n    rewardCells = d.cells.map(function (c, i) {\n      return { x: (c[0] + L.ox - cx) * rewardCell, y: -(c[1] + L.oy - cy) * rewardCell, delay: 1.4 + (c[0] / d.w) * 0.5 + rnd(i) * 0.1, seed: i };\n    });\n    plateCells = []; plateWhiteCells = [];\n    L.cells.forEach(function (c, i) {\n      var cell = { x: (c[0] - cx) * rewardCell, y: -(c[1] - cy) * rewardCell, delay: 1.1 + Math.hypot(c[0] - cx, c[1] - cy) / L.W * 0.35, seed: i + 5000, k: c[2] };\n      (c[2] === 2 ? plateWhiteCells : plateCells).push(cell);\n    });\n    var front = rewardCell * (isQr ? 0.5 : 1.3), back = rewardCell * 0.7;\n    rewardMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(rewardCell * 1.02, rewardCell * 1.02, front), isQr ? qrModMat : letterMat, rewardCells.length);\n    plateMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(rewardCell * 1.02, rewardCell * 1.02, back), plateMat, Math.max(1, plateCells.length));\n    plateMesh.count = plateCells.length;\n    plateWhite = new THREE.InstancedMesh(new THREE.BoxGeometry(rewardCell * 1.02, rewardCell * 1.02, back), plateWhiteMat, Math.max(1, plateWhiteCells.length));\n    plateWhite.count = plateWhiteCells.length;\n    rewardMesh.userData.z = front / 2 + back / 2;\n    rewardG.add(plateMesh); rewardG.add(plateWhite); rewardG.add(rewardMesh);\n    colorPlate();\n    updateReward(openT < 0 ? -1 : now() - openT);\n  }\n  function colorPlate() {\n    var p = pal(), d = state.data.reward;\n    var edge = p.ribbon, body = d.kind === 'percent' ? p.badge : p.plate;\n    plateCells.forEach(function (c, i) { col.set(c.k === 0 ? edge : body); col.multiplyScalar(0.95 + rnd(c.seed) * 0.08); plateMesh.setColorAt(i, col); });\n    if (plateMesh.instanceColor) plateMesh.instanceColor.needsUpdate = true;\n    letterMat.color.set(d.kind === 'percent' ? p.badgeText : p.reward);\n    letterMat.emissive.set(p.neon ? (d.kind === 'percent' ? '#ffffff' : p.reward) : '#000000'); letterMat.emissiveIntensity = p.neon ? 0.6 : 0;\n    plateMat.emissive.set(p.neon && d.kind === 'percent' ? p.badge : '#000000'); plateMat.emissiveIntensity = p.neon && d.kind === 'percent' ? 0.35 : 0;\n  }\n\n  function placeCells(mesh, cells, t, z, from) {\n    for (var i = 0; i < cells.length; i++) {\n      var c = cells[i], k = t < 0 ? 0 : clamp01((t - c.delay) / 0.5), e = easeOutBack(k), m1 = Math.min(1, e);\n      var s = Math.max(0.0001, Math.min(1.1, e));\n      vp.set(from.x + (c.x - from.x) * m1, from.y + (c.y - from.y) * m1 + Math.sin(k * Math.PI) * 0.5, z + (1 - m1) * 1.2);\n      e3.set((1 - k) * 2.4 * (rnd(c.seed) - 0.5), (1 - k) * 3 * (rnd(c.seed + 7) - 0.5), 0); q.setFromEuler(e3);\n      sc.set(s, s, s); mtx.compose(vp, q, sc); mesh.setMatrixAt(i, mtx);\n    }\n    mesh.instanceMatrix.needsUpdate = true;\n  }\n  function updateReward(t) {\n    if (!rewardMesh) return;\n    var from = new THREE.Vector3(0, -(REWARD_Y - HB * U * 0.6), 0); // inside the box, in reward space\n    placeCells(plateMesh, plateCells, t, -rewardCell * 0.2, from);\n    placeCells(plateWhite, plateWhiteCells, t, -rewardCell * 0.2, from);\n    placeCells(rewardMesh, rewardCells, t, rewardMesh.userData.z - rewardCell * 0.2, from);\n  }\n\n  // ---------- confetti ----------\n  var CN = 140;\n  var confetti = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.16, 0.09), new THREE.MeshStandardMaterial({ roughness: 0.6, side: THREE.DoubleSide }), CN);\n  confetti.frustumCulled = false; world.add(confetti);\n  var conf = [];\n  for (var ci = 0; ci < CN; ci++) conf.push({ p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), w: new THREE.Vector3(), alive: false });\n  function colorConfetti() {\n    var cols = pal().confetti;\n    for (var i = 0; i < CN; i++) { col.set(cols[i % cols.length]); confetti.setColorAt(i, col); }\n    if (confetti.instanceColor) confetti.instanceColor.needsUpdate = true;\n  }\n  function burst() {\n    for (var i = 0; i < CN; i++) {\n      var a = rnd(i * 3) * Math.PI * 2, sp = 2.5 + rnd(i * 5) * 4;\n      conf[i].p.set((rnd(i) - 0.5) * N * U * 0.6, HB * U + 0.4, (rnd(i + 9) - 0.5) * N * U * 0.6);\n      conf[i].v.set(Math.cos(a) * sp * 0.55, 6 + rnd(i * 7) * 5, Math.sin(a) * sp * 0.55);\n      conf[i].w.set(rnd(i + 1) * 12 - 6, rnd(i + 2) * 12 - 6, rnd(i + 3) * 12 - 6);\n      conf[i].alive = true;\n    }\n  }\n  function updateConfetti(dt) {\n    for (var i = 0; i < CN; i++) {\n      var c = conf[i];\n      if (c.alive) {\n        c.v.y -= 9.8 * dt; c.v.multiplyScalar(1 - 0.9 * dt);\n        if (c.v.y < -2.2) c.v.y = -2.2;\n        c.p.addScaledVector(c.v, dt);\n        c.r.x += c.w.x * dt; c.r.y += c.w.y * dt; c.r.z += c.w.z * dt;\n        // rest on the podium, or keep falling past its edge\n        var onPodium = Math.abs(c.p.x) < 4.5 && Math.abs(c.p.z) < 4.5;\n        if (onPodium && c.p.y < 0.03) { c.p.y = 0.03; c.v.set(0, 0, 0); c.w.set(0, 0, 0); c.r.x = -Math.PI / 2; }\n        if (c.p.y < -6) c.alive = false;\n      }\n      var fade = closeT >= 0 ? Math.max(0.0001, 1 - (now() - closeT) / 0.6) : 1;\n      q.setFromEuler(c.r); sc.setScalar(c.alive ? fade : 0.0001); mtx.compose(c.p, q, sc); confetti.setMatrixAt(i, mtx);\n    }\n    confetti.instanceMatrix.needsUpdate = true;\n  }\n\n  // ---------- overlay (caption + button): plain DOM so it works on any site ----------\n  var ov = document.createElement('div');\n  ov.style.cssText = 'position:absolute;left:50%;bottom:14px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;font-family:Nunito,system-ui,sans-serif;width:max-content;max-width:92%';\n  var hint = document.createElement('div');\n  hint.style.cssText = 'padding:7px 14px;border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 6px 18px -8px rgba(0,0,0,.35);font-weight:800;font-size:13px;color:#2b2622';\n  hint.textContent = '\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u043F\u043E\u0434\u0430\u0440\u043E\u043A \u{1F381}';\n  var caption = document.createElement('div');\n  caption.style.cssText = 'padding:6px 14px;border-radius:12px;background:rgba(255,255,255,.92);font-weight:800;font-size:13px;color:#2b2622;text-align:center;display:none;max-width:calc(100% - 24px);overflow-wrap:anywhere;box-sizing:border-box';\n  var btn = document.createElement('button');\n  btn.type = 'button';\n  btn.style.cssText = 'pointer-events:auto;border:0;cursor:pointer;padding:10px 18px;border-radius:999px;font:800 13px Nunito,system-ui,sans-serif;box-shadow:0 10px 22px -10px rgba(0,0,0,.45);display:none';\n  ov.appendChild(hint); ov.appendChild(caption); ov.appendChild(btn);\n  container.appendChild(ov);\n  btn.addEventListener('click', function (e) {\n    e.stopPropagation();\n    var d = state.data;\n    if (d.reward.kind === 'qr' && d.url) { window.open(d.url, '_blank', 'noopener'); return; }\n    var done = function () { btn.textContent = '\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u2713'; jiggle = now(); setTimeout(applyOverlay, 1800); };\n    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(d.code).then(done, done); else done();\n  });\n  function applyOverlay() {\n    var d = state.data, p = pal(), opened = openT >= 0 && closeT < 0;\n    hint.style.display = opened || d.trigger === 'scroll' ? 'none' : '';\n    caption.textContent = d.caption || '';\n    caption.style.display = opened && d.caption ? '' : 'none';\n    btn.style.display = opened && (d.reward.kind === 'code' || (d.reward.kind === 'qr' && d.url)) ? '' : 'none';\n    btn.textContent = d.reward.kind === 'qr' ? '\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443' : '\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434';\n    btn.style.background = p.btn; btn.style.color = p.btnText;\n  }\n\n  // ---------- state & animation ----------\n  var t0 = performance.now();\n  function now() { return (performance.now() - t0) / 1000; }\n  var openT = -1, jiggle = -10, visible = true, paused = false, raf = 0, last = now(), burstDone = false;\n  // closing plays the opening timeline backwards (from where it is, a bit faster)\n  var closeT = -1, closeFrom = 0, CLOSE_SPEED = 1.35, OPEN_END = 2.6, curOt = -1;\n  function timeline(t) {\n    if (closeT >= 0) {\n      var ot = closeFrom - (t - closeT) * CLOSE_SPEED;\n      if (ot <= 0) { finishClose(); return -1; }\n      return ot;\n    }\n    return openT >= 0 ? t - openT : -1;\n  }\n  function finishClose() {\n    openT = -1; closeT = -1;\n    for (var i = 0; i < CN; i++) conf[i].alive = false;\n    applyOverlay();\n  }\n\n  function applyMode() {\n    var p = pal();\n    ribbonMat.color.set(p.ribbon); ribbonMat.metalness = p.metal;\n    ribbonMat.emissive.set(p.neon ? p.ribbon : '#000000'); ribbonMat.emissiveIntensity = p.neon ? 0.85 : 0;\n    podiumMat.color.set(p.podium); podiumEdgeMat.color.set(p.podiumEdge);\n    hemi.groundColor.set(p.neon ? '#3a3040' : '#d8cfc0');\n    buildBox(); colorConfetti(); if (plateMesh) colorPlate(); applyOverlay();\n  }\n  function open() {\n    var t = now();\n    if (closeT >= 0) { var ot = Math.max(0, timeline(t)); closeT = -1; openT = t - ot; } // reopen mid-close: continue from here\n    else if (openT >= 0) return;\n    else { openT = t; burstDone = false; }\n    applyOverlay();\n    if (api.onOpen) api.onOpen(true);\n  }\n  function close() {\n    if (openT < 0 || closeT >= 0) return;\n    var t = now();\n    closeFrom = Math.min(t - openT, OPEN_END);\n    closeT = t;\n    applyOverlay();\n    if (api.onOpen) api.onOpen(false);\n  }\n\n  function ribbonScale(c, s) { return [c[3] === 0 ? 0.22 * s : s, s, c[3] === 2 ? 0.22 * s : s]; }\n  function setBodyRibbon(t) {\n    for (var i = 0; i < bodyRibbon.length; i++) {\n      var c = bodyRibbon[i], k = t < 0 ? 0 : clamp01((t - 0.1 - (HB * U - c[1]) * 0.08) / 0.35), s = Math.max(0.0001, 1 - k), rs = ribbonScale(c, s);\n      mtx.makeScale(rs[0], rs[1], rs[2]); mtx.setPosition(c[0], c[1] - k * 0.4, c[2]); bodyRibbonMesh.setMatrixAt(i, mtx);\n    }\n    bodyRibbonMesh.instanceMatrix.needsUpdate = true;\n  }\n  function setBow(t) {\n    for (var i = 0; i < bowCells.length; i++) {\n      var c = bowCells[i], k = t < 0 ? 0 : clamp01((t - rnd(i) * 0.12) / 0.4), s = Math.max(0.0001, 1 - k);\n      mtx.makeScale(s, s, s); mtx.setPosition(c[0] + c[0] * 2.2 * k + (rnd(i + 3) - 0.5) * k, c[1] + k * 4.8 * (1 - k), c[2] + (rnd(i + 5) - 0.5) * 2.4 * k); bowMesh.setMatrixAt(i, mtx);\n    }\n    bowMesh.instanceMatrix.needsUpdate = true;\n  }\n\n  // the lid flips over and then hovers to the left of the box (it never touches the podium)\n  var camYaw = 0.72, camPitch = 0.42, camDist = 20, camLook = new THREE.Vector3(0, 1.8, 0);\n  // Frame the camera on the actual corners of what is visible: the box, the lid (on top or\n  // leaning at the side) and, once open, the reward plate. Keeps everything in view at any size.\n  var tmpM = new THREE.Matrix4(), tmpE = new THREE.Euler(0, 0, 0, 'YZX'), tmpV = new THREE.Vector3();\n  function keyPoints(opened) {\n    var pts = [], bh = N * U / 2, top = HB * U, i;\n    for (i = 0; i < 8; i++) pts.push(new THREE.Vector3(i & 1 ? bh : -bh, i & 2 ? top : 0, i & 4 ? bh : -bh));\n    for (i = 0; i < 4; i++) pts.push(new THREE.Vector3(i & 1 ? 4.5 : -4.5, -0.5, i & 2 ? 4.5 : -4.5)); // podium corners\n    var W2 = LN * U / 2;\n    if (!opened) {\n      for (i = 0; i < 4; i++) pts.push(new THREE.Vector3(i & 1 ? W2 : -W2, LID_Y + U * 5.5, i & 2 ? W2 : -W2)); // lid + bow\n      return pts;\n    }\n    tmpE.set(0, lidRest.yaw, lidRest.tilt); tmpM.makeRotationFromEuler(tmpE); tmpM.setPosition(lidRest.pos);\n    for (i = 0; i < 8; i++) pts.push(new THREE.Vector3(i & 1 ? W2 : -W2, i & 2 ? U : -U, i & 4 ? W2 : -W2).applyMatrix4(tmpM));\n    var r = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion), u = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);\n    for (i = 0; i < 4; i++) pts.push(new THREE.Vector3(0, REWARD_Y, 0).addScaledVector(r, (i & 1 ? 1 : -1) * plateW / 2).addScaledVector(u, (i & 2 ? 1 : -1) * plateH / 2 + 0.15));\n    return pts;\n  }\n  function camTargets() {\n    var opened = closeT >= 0 ? curOt > 1.0 : openT >= 0, pts = keyPoints(opened);\n    var f = new THREE.Vector3(Math.sin(camYaw) * Math.cos(camPitch), Math.sin(camPitch), Math.cos(camYaw) * Math.cos(camPitch));\n    var r = new THREE.Vector3(Math.cos(camYaw), 0, -Math.sin(camYaw)), u = new THREE.Vector3().crossVectors(f, r).normalize();\n    var tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2), tanH = tanV * camera.aspect;\n    // centre: middle of the projected extents (plus room at the bottom for the caption and button)\n    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;\n    pts.forEach(function (p) { var x = p.dot(r), y = p.dot(u); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });\n    y0 -= opened ? 1.1 : 0.7;\n    var look = new THREE.Vector3().addScaledVector(r, (x0 + x1) / 2).addScaledVector(u, (y0 + y1) / 2);\n    // distance: every point must fit within the field of view\n    var dist = 0;\n    pts.forEach(function (p) {\n      tmpV.copy(p).sub(look);\n      var x = Math.abs(tmpV.dot(r)), y = tmpV.dot(u), z = tmpV.dot(f);\n      if (y < 0) y = Math.max(-y, Math.abs(y0 - look.dot(u)) * 0); else y = Math.abs(y);\n      dist = Math.max(dist, z + x / tanH, z + y / tanV);\n    });\n    dist = Math.max(dist, z0dist(look, y0, u, f, tanV));\n    return { look: look, dist: dist * 1.06 };\n  }\n  // keep the extra caption room at the bottom inside the frame\n  function z0dist(look, y0, u, f, tanV) { return Math.abs(y0 - look.dot(u)) / tanV; }\n  function placeCamera(snap) {\n    var tg = camTargets();\n    if (snap) { camLook.copy(tg.look); camDist = tg.dist; } else { camLook.lerp(tg.look, 0.05); camDist += (tg.dist - camDist) * 0.05; }\n    camera.position.set(camLook.x + Math.sin(camYaw) * Math.cos(camPitch) * camDist, camLook.y + Math.sin(camPitch) * camDist, camLook.z + Math.cos(camYaw) * Math.cos(camPitch) * camDist);\n    camera.lookAt(camLook);\n  }\n\n  function frame(t, dt) {\n    var ot = timeline(t), opened = ot >= 0;\n    curOt = ot;\n    if (!opened) {\n      var phase = t % 3.2, jump = phase < 0.5 ? Math.sin(phase / 0.5 * Math.PI) * 0.35 : 0, squash = phase < 0.08 ? 1 : 0;\n      boxG.rotation.z = Math.sin(t * 1.6) * 0.035; boxG.rotation.x = Math.sin(t * 1.3 + 1) * 0.02;\n      boxG.position.y = jump; boxG.scale.set(1 + squash * 0.04, 1 - squash * 0.05, 1 + squash * 0.04);\n      lidG.position.set(0, LID_Y, 0); lidG.rotation.set(0, 0, 0);\n      setBow(-1); setBodyRibbon(-1); updateReward(-1);\n      shadow.scale.setScalar((N / 8) * (1 - jump * 0.4)); lidShadow.material.opacity = 0;\n    } else {\n      boxG.rotation.z *= 0.9; boxG.rotation.x *= 0.9; boxG.position.y *= 0.85;\n      var sq = ot < 0.22 ? Math.sin(ot / 0.22 * Math.PI) : 0;\n      boxG.scale.set(1 + sq * 0.05, 1 - sq * 0.08, 1 + sq * 0.05);\n      setBow(ot - 0.12); setBodyRibbon(ot);\n      // three phases, so it never cuts through anything:\n      // 1) straight up above the box, 2) out to the side tilting while high, 3) straight down onto the podium\n      var lk = clamp01((ot - 0.15) / 0.9);\n      var up = easeInOut(clamp01(lk / 0.3)), out = easeInOut(clamp01((lk - 0.2) / 0.45)), down = easeInOut(clamp01((lk - 0.62) / 0.38));\n      var highY = LID_Y + 1.7;\n      var y = lk < 0.62 ? LID_Y + (highY - LID_Y) * up : highY + (lidRest.pos.y - highY) * down;\n      var settle = lk >= 1 ? Math.sin(Math.min(1, (ot - 1.05) / 0.25) * Math.PI) * 0.05 : 0;\n      lidG.position.set(lidRest.pos.x * out, y + settle, lidRest.pos.z * out);\n      lidG.rotation.set(0, lidRest.yaw * out, lidRest.tilt * out);\n      var le = out;\n      lidShadow.position.x = lidG.position.x; lidShadow.position.z = lidG.position.z;\n      lidShadow.material.opacity = 0.5 * le;\n      if (!burstDone && ot > 0.3) { burst(); burstDone = true; }\n      updateReward(ot);\n    }\n    updateConfetti(Math.min(dt, 0.05));\n    var bounce = Math.max(0, Math.sin(Math.min(1, (t - jiggle) / 0.35) * Math.PI)) * 0.25;\n    rewardG.position.set(0, REWARD_Y + (opened ? Math.sin(t * 1.3) * 0.08 : 0) + bounce, 0);\n    rewardG.quaternion.copy(camera.quaternion);\n    placeCamera(false);\n  }\n\n  function loop() {\n    raf = requestAnimationFrame(loop);\n    var t = now(), dt = t - last; last = t;\n    if (!visible || paused) return;\n    frame(t, dt); renderer.render(scene, camera);\n  }\n  function resize() {\n    var w = container.clientWidth || 400, h = container.clientHeight || 500;\n    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';\n    camera.aspect = w / h; camera.updateProjectionMatrix(); placeCamera(true);\n  }\n\n  cv.addEventListener('click', function () { if (openT < 0) open(); });\n  var ro = new ResizeObserver(resize); ro.observe(container);\n  var io = null;\n  if ('IntersectionObserver' in window) {\n    io = new IntersectionObserver(function (es) {\n      var e = es[0]; visible = e ? e.isIntersecting : true;\n      if (e && state.data.trigger === 'scroll' && e.intersectionRatio >= 0.6 && openT < 0) setTimeout(open, 350);\n    }, { threshold: [0, 0.02, 0.6] });\n    io.observe(container);\n  }\n\n  applyMode(); buildReward(); resize(); loop();\n\n  // ---------- public ----------\n  api.setData = function (d) {\n    var rebuildBox = d.shape !== state.data.shape || d.pattern !== state.data.pattern;\n    state.data = d; if (rebuildBox) buildBox(); buildReward(); applyOverlay();\n  };\n  api.setMode = function (m) { state.mode = m; applyMode(); };\n  api.open = open;\n  api.close = close;\n  api.isOpen = function () { return openT >= 0 && closeT < 0; };\n  api.setPaused = function (p) { paused = p; };\n  api.snapshot = function () {\n    var t = now(); frame(t, 1 / 60); renderer.render(scene, camera);\n    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;\n    var c = out.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, out.width, out.height); c.drawImage(cv, 0, 0);\n    return out;\n  };\n  /** for checks: jump the camera to its target framing */\n  api.snapCamera = function () { placeCamera(true); };\n  /** for checks: screen extents (NDC) of the framing points and of the real lid */\n  api.debugFrame = function () {\n    lidG.updateMatrixWorld(true); camera.updateMatrixWorld(true);\n    var ext = function (pts) { var e = { x0: 9, x1: -9, y0: 9, y1: -9 }; pts.forEach(function (p) { var v = p.clone().project(camera); e.x0 = Math.min(e.x0, v.x); e.x1 = Math.max(e.x1, v.x); e.y0 = Math.min(e.y0, v.y); e.y1 = Math.max(e.y1, v.y); }); return e; };\n    var lid = [], h = U / 2;\n    lidCells.forEach(function (c) { for (var i = 0; i < 8; i++) lid.push(new THREE.Vector3(c[0] + (i & 1 ? h : -h), c[1] + (i & 2 ? h : -h), c[2] + (i & 4 ? h : -h)).applyMatrix4(lidG.matrixWorld)); });\n    return { key: ext(keyPoints(openT >= 0)), lid: ext(lid), lidPos: lidG.position.toArray(), rest: lidRest.pos.toArray(), rot: [lidG.rotation.x, lidG.rotation.y, lidG.rotation.z, lidG.rotation.order] };\n  };\n  /** for checks: how many lid cube corners are inside the box, below the podium or inside the reward plate */\n  api.collisions = function () {\n    lidG.updateMatrixWorld(true); rewardG.updateMatrixWorld(true);\n    var inv = new THREE.Matrix4().copy(rewardG.matrixWorld).invert(), v = new THREE.Vector3(), r = new THREE.Vector3(), h = U / 2;\n    var bh = N * U / 2, out = { box: 0, floor: 0, reward: 0 };\n    lidCells.concat(lidRibbon).forEach(function (c) {\n      for (var i = 0; i < 8; i++) {\n        v.set(c[0] + (i & 1 ? h : -h), c[1] + (i & 2 ? h : -h), c[2] + (i & 4 ? h : -h)).applyMatrix4(lidG.matrixWorld);\n        if (v.y < -0.01) out.floor++;\n        if (Math.abs(v.x) < bh - 0.02 && Math.abs(v.z) < bh - 0.02 && v.y < HB * U - 0.02) out.box++;\n        r.copy(v).applyMatrix4(inv);\n        if (openT >= 0 && now() - openT > 1.1 && Math.abs(r.x) < plateW / 2 && Math.abs(r.y) < plateH / 2 && Math.abs(r.z) < 0.4) out.reward++;\n      }\n    });\n    return out;\n  };\n  /** lowest point of the lid (for checks: it must stay above the podium) */\n  api.lidBottom = function () {\n    lidG.updateMatrixWorld(true);\n    var min = Infinity, v = new THREE.Vector3(), h = U / 2;\n    lidCells.concat(lidRibbon).forEach(function (c) {\n      for (var i = 0; i < 8; i++) {\n        v.set(c[0] + (i & 1 ? h : -h), c[1] + (i & 2 ? h : -h), c[2] + (i & 4 ? h : -h)).applyMatrix4(lidG.matrixWorld);\n        if (v.y < min) min = v.y;\n      }\n    });\n    return min;\n  };\n  api.dispose = function () {\n    cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect();\n    scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); var m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(function (x) { if (x.map) x.map.dispose(); x.dispose(); }); });\n    renderer.dispose(); cv.remove(); ov.remove();\n  };\n  return api;\n}\n";

// src/engine/giftScene.ts
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

// src/engine/giftEmbedGenerator.ts
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
  const d = buildGiftData(o.settings);
  const data = { reward: d.reward, code: d.code, url: d.url, caption: d.caption, trigger: d.trigger, shape: d.shape, pattern: d.pattern };
  const badge = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;right:12px;top:12px;z-index:5;font:600 11px system-ui,-apple-system,sans-serif;color:#64748b;text-decoration:none;background:rgba(255,255,255,0.85);padding:4px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)">Gridika</a>`;
  const runtime = giftRuntime_default.replace(/^export /gm, "");
  return `${codeHeader("\u043F\u043E\u0434\u0430\u0440\u043E\u043A \u0441 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\u043E\u043C", o.license)}
<div id="${id}" style="position:relative;width:100%;max-width:560px;height:${height}px;margin:0 auto;">${badge}</div>
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
    // spinning: the widest the logo gets is its diagonal with the depth
    var halfW = (state.data.motion === 'spin' ? Math.hypot(size.w, size.d) : size.w) / 2, halfH = size.h / 2;
    var dist = Math.max(halfH / tanV, halfW / (tanV * aspect)) * 1.42 + size.d / 2;
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

// src/engine/logoEmbedGenerator.ts
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
  const badge = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;right:12px;bottom:12px;z-index:5;font:600 11px system-ui,-apple-system,sans-serif;color:#64748b;text-decoration:none;background:rgba(255,255,255,0.85);padding:4px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)">Gridika</a>`;
  const runtime = logoRuntime_default.replace(/^export /gm, "");
  return `${codeHeader("3D-\u043B\u043E\u0433\u043E\u0442\u0438\u043F \u0438\u0437 \u0432\u043E\u043A\u0441\u0435\u043B\u0435\u0439", o.license)}
<div id="${id}" style="position:relative;width:100%;height:${height}px;margin:0 auto;">${badge}</div>
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

// src/engine/morphEmbedGenerator.ts
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
  const maxW = o.maxWidth ?? 760;
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
var timerRuntime_default = `/* Gridika \xB7 \u0422\u0430\u0439\u043C\u0435\u0440 \u0430\u043A\u0446\u0438\u0438 \u2014 runtime shared by the studio and the site snippet.
 * Plain JS without imports: three.js is passed in. Digits are a 5\xD77 pixel font turned into cubes;
 * when a digit changes, the cubes the new digit does not need fly away, the missing ones fly in,
 * the shared ones stay. Time is counted from an absolute moment (UTC ms), not from page load.
 *
 * data: { end: <UTC ms>, format: 'dhms' | 'hms' | 'dhm', title: '', button: { text, url } | null,
 *         personal: <hours> | 0 \u2014 "N hours from this visitor's first visit" (remembered in their browser), pid: '<id>',
 *         endAction: 'text' | 'link' | 'hide', endText: '', endUrl: '', mode: 'sale' | 'launch' | 'newyear' }
 */

export var TIMER_MODES = {
  sale: { label: '\u0420\u0430\u0441\u043F\u0440\u043E\u0434\u0430\u0436\u0430', digit: '#e8343f', colon: '#ffc83d', podium: '#ffc83d', podiumEdge: '#f0a91b', title: '#2a1416', btn: '#e8343f', btnText: '#ffffff', confetti: ['#e8343f', '#ffc83d', '#ffffff', '#ff8a3d'] },
  launch: { label: '\u0417\u0430\u043F\u0443\u0441\u043A', digit: '#35e0b0', colon: '#7c8cff', podium: '#1f2a33', podiumEdge: '#2c3b47', title: '#0f2a24', btn: '#16a37f', btnText: '#ffffff', confetti: ['#35e0b0', '#7c8cff', '#ffffff', '#c7f9ea'] },
  newyear: { label: '\u041D\u043E\u0432\u044B\u0439 \u0433\u043E\u0434', digit: '#1f9a57', colon: '#f2c14e', podium: '#f2c14e', podiumEdge: '#d9a630', title: '#123222', btn: '#1f9a57', btnText: '#ffffff', confetti: ['#1f9a57', '#f2c14e', '#ffffff', '#e8343f'], fall: '#ffffff' },
  blackfriday: { label: '\u0427\u0451\u0440\u043D\u0430\u044F \u043F\u044F\u0442\u043D\u0438\u0446\u0430', digit: '#17171d', colon: '#ff2e88', podium: '#ff2e88', podiumEdge: '#e0207a', title: '#17171d', btn: '#17171d', btnText: '#ffffff', confetti: ['#ff2e88', '#17171d', '#ffffff', '#ffd23f'] },
  minimal: { label: '\u041C\u0438\u043D\u0438\u043C\u0430\u043B', digit: '#2b2b33', colon: '#b9b2a6', podium: '#ece6da', podiumEdge: '#ddd5c6', title: '#2b2b33', btn: '#2b2b33', btnText: '#ffffff', confetti: ['#2b2b33', '#b9b2a6', '#ffffff'] },
  spring: { label: '\u0412\u0435\u0441\u043D\u0430', digit: '#ec5c9a', colon: '#a78bfa', podium: '#fde2ef', podiumEdge: '#f7c6dc', title: '#5b1f45', btn: '#ec4899', btnText: '#ffffff', confetti: ['#ec5c9a', '#a78bfa', '#ffffff', '#fbcfe8'], fall: '#fbcfe8' },
};

var FONT = {
  0: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  6: ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
};
function bit(d, c) { return FONT[d][Math.floor(c / 5)][c % 5] === '1'; }

/** time left as digits: [[d,d],[h,h],[m,m],[s,s]] (days left out for 'hms') */
export function timerParts(endMs, nowMs, format) {
  var s = Math.max(0, Math.floor((endMs - nowMs) / 1000));
  var d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  var two = function (v) { v = Math.min(99, v); return [Math.floor(v / 10), v % 10]; };
  if (format === 'hms') return { left: s, groups: [two(Math.min(99, Math.floor(s / 3600))), two(m), two(sec)] };
  if (format === 'dhm') return { left: s, groups: [two(d), two(h), two(m)] };
  return { left: s, groups: [two(d), two(h), two(m), two(sec)] };
}

var GROUP_LABELS = { dhms: ['\u0434\u043D\u0435\u0439', '\u0447\u0430\u0441\u043E\u0432', '\u043C\u0438\u043D\u0443\u0442', '\u0441\u0435\u043A\u0443\u043D\u0434'], hms: ['\u0447\u0430\u0441\u043E\u0432', '\u043C\u0438\u043D\u0443\u0442', '\u0441\u0435\u043A\u0443\u043D\u0434'], dhm: ['\u0434\u043D\u0435\u0439', '\u0447\u0430\u0441\u043E\u0432', '\u043C\u0438\u043D\u0443\u0442'] };

/** personal countdown: the end is this visitor's first visit + N hours (kept in their browser) */
function personalEnd(data, studio, studioStart) {
  var span = data.personal * 3600000;
  if (studio) return studioStart + span;
  var key = 'gridika-timer-' + (data.pid || 'x'), first = 0;
  try { first = parseInt(localStorage.getItem(key) || '0', 10) || 0; } catch (e) {}
  if (!first) { first = Date.now(); try { localStorage.setItem(key, String(first)); } catch (e) {} }
  return first + span;
}

export function createTimerViewer(THREE, container, init) {
  var U = 0.5;
  var state = { data: init.data, previewEnd: false, studio: !!init.studio };
  var api = {};
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeOutBack(t) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  function rnd(i) { var n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
  function pal() { return TIMER_MODES[state.data.mode] || TIMER_MODES.sale; }

  // ---------- DOM: title / stage (canvas + labels + final text) / button ----------
  var css = [
    '.gtm{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:center}',
    '.gtm-title{font-weight:800;font-size:clamp(16px,2.6vw,24px);line-height:1.2;margin:0 0 6px;letter-spacing:-.01em;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;padding:0 8px}',
    '.gtm-stage{position:relative;width:100%}',
    '.gtm-stage canvas{display:block;width:100%;height:100%}',
    '.gtm-labels{position:absolute;inset:0;pointer-events:none}',
    '.gtm-labels span{position:absolute;transform:translateX(-50%);font-size:clamp(10px,1.5vw,13px);font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.55;transition:opacity .4s}',
    '.gtm-end{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 16px;overflow-wrap:anywhere;text-align:center;font-weight:900;font-size:clamp(22px,5vw,46px);letter-spacing:-.02em;line-height:1.1;opacity:0;transform:scale(.9);transition:opacity .6s,transform .7s cubic-bezier(.34,1.56,.64,1);pointer-events:none}',
    '.gtm-flash{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(255,255,255,.95),rgba(255,255,255,0) 70%);opacity:0;pointer-events:none}',
    '.gtm-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;padding:13px 24px;max-width:calc(100% - 16px);overflow-wrap:anywhere;text-align:center;border-radius:999px;font-weight:800;font-size:15px;text-decoration:none;box-shadow:0 10px 24px -10px rgba(0,0,0,.45);transition:transform .2s,filter .2s}',
    '.gtm-btn:hover{transform:translateY(-1px);filter:brightness(1.06)}',
  ].join('');
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  var root = document.createElement('div');
  root.className = 'gtm';
  root.innerHTML = '<style>' + css + '</style><div class="gtm-title"></div><div class="gtm-stage"><div class="gtm-labels"></div><div class="gtm-flash"></div><div class="gtm-end"></div></div><a class="gtm-btn" target="_top"></a>';
  container.appendChild(root);
  var titleEl = root.querySelector('.gtm-title'), stage = root.querySelector('.gtm-stage'), labelsEl = root.querySelector('.gtm-labels');
  var flashEl = root.querySelector('.gtm-flash'), endEl = root.querySelector('.gtm-end'), btnEl = root.querySelector('.gtm-btn');

  // ---------- renderer / scene ----------
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
  } catch (e1) {
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true }); } catch (e2) {
      console.warn('Timer WebGLRenderer init failed:', e2);
      var noop = function () {};
      return { setData: noop, previewEnd: noop, setPaused: noop, snapshot: function () { return document.createElement('canvas'); }, dispose: noop };
    }
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.insertBefore(renderer.domElement, labelsEl);
  var cv = renderer.domElement;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(26, 2.4, 0.1, 500);
  var hemi = new THREE.HemisphereLight(0xffffff, 0xd9d2c5, 1.5); scene.add(hemi);
  var key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(-4, 9, 10); scene.add(key);
  var group = new THREE.Group(); scene.add(group);
  // a fixed slight tilt shows the tops of the cubes and the podium (labels are placed for this view)
  group.rotation.x = 0.16;
  var cube = new THREE.BoxGeometry(U * 0.9, U * 0.9, U * 1.3);
  var digitMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.05, emissive: 0x000000 });
  var podiumMat = new THREE.MeshStandardMaterial({ roughness: 0.6 });
  var bitMat = new THREE.MeshStandardMaterial({ roughness: 0.5 });

  // ---------- layout ----------
  var slots = [], N = 0, digitMesh = null, colonMesh = null, podium = null, layout = null;
  var on, kind, tC, cur, groupsNow = null;
  // narrow blocks (phones, small columns): days : hours over minutes : seconds, twice the size
  var ROW_GAP = 13;
  function wantTwoRows() {
    var w = stage.clientWidth || container.clientWidth || 600;
    return state.data.format === 'dhms' && w < 480;
  }
  function buildLayout() {
    [digitMesh, colonMesh].forEach(function (m) { if (m) { group.remove(m); m.dispose(); } });
    if (podium) { group.remove(podium); podium.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); }
    var nGroups = state.data.format === 'dhms' ? 4 : 3;
    var twoRows = nGroups === 4 && wantTwoRows();
    var rows = twoRows ? [[0, 1], [2, 3]] : [nGroups === 3 ? [0, 1, 2] : [0, 1, 2, 3]];
    slots = []; var colons = [], groupCenters = [], maxCols = 0;
    podium = new THREE.Group();
    rows.forEach(function (gs, r) {
      var cols = gs.length * 11 + (gs.length - 1) * 3, x0 = -(cols - 1) / 2, yOff = (rows.length - 1) * ROW_GAP / 2 - r * ROW_GAP;
      maxCols = Math.max(maxCols, cols);
      var x = 0;
      gs.forEach(function (g, k) {
        groupCenters[g] = { x: (x0 + x + 5) * U, y: (yOff - 5.4) * U };
        slots.push({ x: x0 + x, y: yOff }); slots.push({ x: x0 + x + 6, y: yOff });
        x += 11;
        if (k < gs.length - 1) { colons.push({ x: x0 + x + 1, y: yOff }); x += 3; }
      });
      // podium under each row
      var slab = new THREE.Mesh(new THREE.BoxGeometry((cols + 4) * U, U * 1.1, U * 5), podiumMat);
      slab.position.set(0, (yOff - 4.2) * U, -U * 1.2);
      podium.add(slab);
    });
    group.add(podium);
    N = slots.length * 35;
    digitMesh = new THREE.InstancedMesh(cube, digitMat, N);
    digitMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    on = new Uint8Array(N); kind = new Uint8Array(N); tC = new Float32Array(N); cur = slots.map(function () { return -1; });
    var m4 = new THREE.Matrix4();
    for (var i = 0; i < N; i++) { m4.makeScale(0, 0, 0); digitMesh.setMatrixAt(i, m4); }
    group.add(digitMesh);
    // colons: two cubes each
    colonMesh = new THREE.InstancedMesh(cube, bitMat, Math.max(1, colons.length * 2));
    colonMesh.count = colons.length * 2;
    colons.forEach(function (c, k) {
      [2, 4].forEach(function (row, j) { m4.makeTranslation(c.x * U, (c.y + 3 - row) * U, 0); colonMesh.setMatrixAt(k * 2 + j, m4); });
    });
    group.add(colonMesh);
    layout = { cols: maxCols, rows: rows.length, groupCenters: groupCenters, nGroups: nGroups, twoRows: twoRows };
    groupsNow = null;
    if (ended) { podium.visible = colonMesh.visible = false; }
    applyColors();
    buildLabels();
    fit();
  }
  function home(slot, c, out) {
    out.set((slots[slot].x + (c % 5)) * U, (slots[slot].y + 3 - Math.floor(c / 5)) * U, 0);
    return out;
  }

  function applyColors() {
    var p = pal();
    digitMat.color.set(p.digit); digitMat.emissive.set(p.digit);
    bitMat.color.set(p.colon);
    podiumMat.color.set(p.podium);
    titleEl.style.color = p.title; endEl.style.color = p.digit;
    labelsEl.style.color = p.title;
    btnEl.style.background = p.btn; btnEl.style.color = p.btnText;
    if (confMesh) colorConfetti();
  }

  // ---------- digits changing ----------
  var tmp = new THREE.Vector3(), q = new THREE.Quaternion(), e = new THREE.Euler(), sv = new THREE.Vector3(), m4b = new THREE.Matrix4();
  var dirtyUntil = 0;
  function setDigit(slot, d, t, first) {
    if (cur[slot] === d) return;
    var base = slot * 35;
    for (var c = 0; c < 35; c++) {
      var i = base + c, want = d >= 0 && bit(d, c) ? 1 : 0;
      if (want && !on[i]) { kind[i] = 1; tC[i] = t + (first ? slot * 0.06 + rnd(i) * 0.25 : rnd(i + t) * 0.12); }
      else if (!want && on[i]) { kind[i] = 2; tC[i] = t + rnd(i + 3) * 0.08; }
      on[i] = want;
    }
    cur[slot] = d;
    dirtyUntil = Math.max(dirtyUntil, t + (first ? 1.6 : 0.8));
  }
  var APPEAR = 0.45, LEAVE = 0.38;
  function placeDigits(t) {
    if (t > dirtyUntil + 0.05) return;
    for (var i = 0; i < N; i++) {
      var slot = Math.floor(i / 35), c = i % 35;
      home(slot, c, tmp);
      var sc = on[i] ? 1 : 0, ax = 0, ay = 0;
      if (kind[i] === 1) {
        var k = reduced ? 1 : clamp01((t - tC[i]) / APPEAR), ek = easeOutBack(k);
        tmp.y += (1 - easeOut(k)) * U * (2.5 + rnd(i) * 2); tmp.z += (1 - easeOut(k)) * U * 3;
        tmp.x += (1 - easeOut(k)) * (rnd(i + 5) - 0.5) * U * 2;
        sc = Math.max(0, ek); ax = (1 - k) * 2;
        if (k >= 1) kind[i] = 0;
      } else if (kind[i] === 2) {
        var k2 = reduced ? 1 : clamp01((t - tC[i]) / LEAVE);
        tmp.x += (rnd(i + 9) - 0.5) * U * 3 * k2; tmp.y -= U * 1.5 * k2 * k2; tmp.z += U * 2.5 * k2;
        sc = 1 - easeOut(k2); ay = k2 * 3;
        if (k2 >= 1) { kind[i] = 0; sc = 0; }
      }
      e.set(ax, ay, 0); q.setFromEuler(e); sv.setScalar(Math.max(0.0001, sc));
      m4b.compose(tmp, q, sv); digitMesh.setMatrixAt(i, m4b);
    }
    digitMesh.instanceMatrix.needsUpdate = true;
  }

  // ---------- labels under the groups ----------
  function buildLabels() {
    var names = GROUP_LABELS[state.data.format] || GROUP_LABELS.dhms;
    labelsEl.innerHTML = names.map(function (n) { return '<span>' + n + '</span>'; }).join('');
    placeLabels();
  }
  function placeLabels() {
    if (!layout) return;
    var w = stage.clientWidth, h = stage.clientHeight;
    var spans = labelsEl.children;
    for (var g = 0; g < spans.length; g++) {
      tmp.set(layout.groupCenters[g].x, layout.groupCenters[g].y, U * 1.3).applyMatrix4(group.matrixWorld).project(camera);
      spans[g].style.left = ((tmp.x + 1) / 2 * w).toFixed(1) + 'px';
      spans[g].style.top = ((1 - tmp.y) / 2 * h).toFixed(1) + 'px';
    }
  }

  // ---------- confetti and snow ----------
  var confMesh = null, conf = null, confT = -10;
  var CN = 160;
  function colorConfetti() {
    var p = pal(), col = new THREE.Color();
    for (var i = 0; i < CN; i++) { col.set(p.confetti[i % p.confetti.length]); confMesh.setColorAt(i, col); }
    if (confMesh.instanceColor) confMesh.instanceColor.needsUpdate = true;
  }
  confMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(U * 0.42, U * 0.42, U * 0.16), new THREE.MeshStandardMaterial({ roughness: 0.5 }), CN);
  confMesh.frustumCulled = false;
  conf = new Float32Array(CN * 9);
  (function () { var m = new THREE.Matrix4().makeScale(0, 0, 0); for (var i = 0; i < CN; i++) confMesh.setMatrixAt(i, m); })();
  colorConfetti();
  scene.add(confMesh);
  function burst() {
    confT = now();
    for (var i = 0; i < CN; i++) {
      var o = i * 9, a = rnd(i) * Math.PI * 2, sp = 6 + rnd(i + 1) * 10;
      conf[o] = (rnd(i + 2) - 0.5) * layout.cols * U * 0.6; conf[o + 1] = 0; conf[o + 2] = U * 2;
      conf[o + 3] = Math.cos(a) * sp * 0.6; conf[o + 4] = 6 + rnd(i + 3) * 9; conf[o + 5] = Math.sin(a) * sp * 0.3 + 2;
      conf[o + 6] = rnd(i + 4) * 6; conf[o + 7] = rnd(i + 5) * 6; conf[o + 8] = 0;
    }
  }
  var lastConfT = 0;
  function updateConfetti(t) {
    var age = t - confT;
    if (age > 3.6) { if (age < 3.8) { var m = new THREE.Matrix4().makeScale(0, 0, 0); for (var j = 0; j < CN; j++) confMesh.setMatrixAt(j, m); confMesh.instanceMatrix.needsUpdate = true; } return; }
    var dt = Math.min(0.05, Math.max(0, t - lastConfT)); lastConfT = t;
    for (var i = 0; i < CN; i++) {
      var o = i * 9;
      conf[o + 4] -= 18 * dt; conf[o + 3] *= 0.99; conf[o + 5] *= 0.99;
      conf[o] += conf[o + 3] * dt; conf[o + 1] += conf[o + 4] * dt; conf[o + 2] += conf[o + 5] * dt;
      conf[o + 6] += dt * 7; conf[o + 7] += dt * 5;
      tmp.set(conf[o], conf[o + 1], conf[o + 2]); e.set(conf[o + 6], conf[o + 7], 0); q.setFromEuler(e);
      sv.setScalar(age > 2.8 ? Math.max(0.0001, 1 - (age - 2.8) / 0.8) : 1);
      m4b.compose(tmp, q, sv); confMesh.setMatrixAt(i, m4b);
    }
    confMesh.instanceMatrix.needsUpdate = true;
  }

  var SN = 70, snow = new THREE.InstancedMesh(new THREE.BoxGeometry(U * 0.28, U * 0.28, U * 0.28), new THREE.MeshBasicMaterial({ color: 0xffffff }), SN);
  snow.frustumCulled = false; scene.add(snow);
  function updateSnow(t) {
    var fall = pal().fall, show = !!fall && !reduced;
    if (show) snow.material.color.set(fall);
    snow.visible = show;
    if (!show || !layout) return;
    var W = (layout.cols + 10) * U, H = (layout.rows * ROW_GAP + 4) * U;
    for (var i = 0; i < SN; i++) {
      var sp = 0.5 + rnd(i) * 0.7, y = H / 2 - (((t * sp * 1.6 + rnd(i + 1) * H) % H));
      tmp.set((rnd(i + 2) - 0.5) * W + Math.sin(t * 0.8 + i) * 0.3, y + 1, (rnd(i + 3) - 0.3) * 6);
      e.set(t * sp, t * sp * 0.7, 0); q.setFromEuler(e); sv.setScalar(0.6 + rnd(i + 4) * 0.8);
      m4b.compose(tmp, q, sv); snow.setMatrixAt(i, m4b);
    }
    snow.instanceMatrix.needsUpdate = true;
  }

  // ---------- the end ----------
  var ended = false;
  function showEnd(animated) {
    var d = state.data, preview = state.previewEnd;
    ended = true;
    var t = now();
    for (var s = 0; s < slots.length; s++) setDigit(s, -1, t, false);
    podium.visible = colonMesh.visible = false;
    labelsEl.style.opacity = '0';
    var text = d.endText || '\u0410\u043A\u0446\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u0430\u0441\u044C!';
    if (d.endAction === 'hide' && !preview && !state.studio) { container.style.display = 'none'; return; }
    if (d.endAction === 'hide') text = '\u0411\u043B\u043E\u043A \u0441\u043A\u0440\u043E\u0435\u0442\u0441\u044F';
    if (d.endAction === 'link' && d.endUrl) {
      if (!preview && !state.studio && animated) setTimeout(function () { try { window.top.location.href = d.endUrl; } catch (er) { location.href = d.endUrl; } }, 1800);
      else if (preview || state.studio) text = (d.endText || '\u0410\u043A\u0446\u0438\u044F \u043D\u0430\u0447\u0430\u043B\u0430\u0441\u044C!') + ' \u2192';
    }
    endEl.textContent = text;
    endEl.style.opacity = '1'; endEl.style.transform = 'scale(1)';
    if (animated && !reduced) {
      burst();
      flashEl.animate([{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 0 }], { duration: 900, easing: 'ease-out' });
    }
  }
  function hideEnd() {
    ended = false;
    podium.visible = colonMesh.visible = true;
    labelsEl.style.opacity = '';
    endEl.style.opacity = '0'; endEl.style.transform = 'scale(.9)';
    groupsNow = null;
  }

  var studioStart = Date.now();
  function tick(t) {
    if (state.previewEnd) { if (!ended) showEnd(true); return; }
    var endMs = state.data.personal > 0 ? personalEnd(state.data, state.studio, studioStart) : state.data.end;
    var parts = timerParts(endMs, Date.now(), state.data.format);
    if (parts.left <= 0) { if (!ended) showEnd(groupsNow !== null); return; }
    if (ended) hideEnd();
    var first = groupsNow === null;
    var flat = [];
    parts.groups.forEach(function (g) { flat.push(g[0], g[1]); });
    for (var s = 0; s < slots.length; s++) setDigit(s, flat[s], t, first);
    groupsNow = parts.groups;
  }

  // ---------- frame ----------
  var t0 = performance.now(), last = 0, raf = 0, paused = false, visible = true;
  function now() { return (performance.now() - t0) / 1000; }
  function frame(t) {
    if (!layout) return;
    tick(t);
    placeDigits(t);
    // the standing digits breathe a little
    digitMat.emissiveIntensity = (reduced ? 0.06 : 0.05 + 0.05 * (0.5 + 0.5 * Math.sin(t * 2.2))) + (pal().glow || 0);
    updateConfetti(t); updateSnow(t);
  }
  function loop() {
    raf = requestAnimationFrame(loop);
    var t = now(); last = t;
    if (!visible || paused) return;
    frame(t); renderer.render(scene, camera);
  }
  function fit() {
    if (!layout) return;
    if (layout.twoRows !== wantTwoRows()) return buildLayout();
    var w = stage.clientWidth || 600;
    // the stage keeps the timer's proportions: digits, podium and labels with a little air
    var worldW = (layout.cols + 5) * U, worldH = (layout.rows * ROW_GAP + 3) * U;
    var h = Math.round(w * worldH / worldW);
    stage.style.height = h + 'px';
    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';
    camera.aspect = w / h;
    var tanV = Math.tan((camera.fov * Math.PI) / 360);
    var halfW = worldW / 2, halfH = worldH / 2;
    var dist = Math.max(halfH / tanV, halfW / (tanV * camera.aspect)) * 1.04 + U * 3;
    camera.position.set(0, U * 0.4, dist); camera.lookAt(0, -U * 1.2, 0);
    camera.near = dist / 40; camera.far = dist * 4; camera.updateProjectionMatrix();
    group.updateMatrixWorld(true);
    placeLabels();
  }

  function applyText() {
    var d = state.data;
    titleEl.textContent = d.title || '';
    titleEl.style.display = d.title ? '' : 'none';
    if (d.button && d.button.text) {
      btnEl.style.display = ''; btnEl.textContent = d.button.text;
      if (d.button.url) btnEl.href = d.button.url; else btnEl.removeAttribute('href');
    } else btnEl.style.display = 'none';
  }

  var ro = new ResizeObserver(fit); ro.observe(stage);
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) { var en = es[0]; visible = en ? en.isIntersecting : true; }, { threshold: [0, 0.01] });
    io.observe(container);
  }

  applyText(); buildLayout(); loop();

  // ---------- public ----------
  api.setData = function (d) {
    var prev = state.data;
    state.data = d;
    applyText(); applyColors();
    if (d.personal !== prev.personal) studioStart = Date.now();
    if (d.format !== prev.format) { buildLayout(); hideEnd(); }
    else if (d.end !== prev.end || d.personal !== prev.personal || d.endAction !== prev.endAction || d.endText !== prev.endText) { if (ended) hideEnd(); }
  };
  /** studio: show what happens at the end */
  api.previewEnd = function (v) { state.previewEnd = !!v; if (!v && ended) hideEnd(); };
  api.setPaused = function (p) { paused = p; };
  api.snapshot = function () {
    frame(now()); renderer.render(scene, camera);
    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;
    out.getContext('2d').drawImage(cv, 0, 0);
    return out;
  };
  /** for checks: skip the fly-in */
  api.settle = function () { dirtyUntil = now() + 0.05; for (var i = 0; i < N; i++) { tC[i] = -100; } };
  api.dispose = function () {
    cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect();
    scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
    [digitMat, podiumMat, bitMat].forEach(function (m) { m.dispose(); });
    renderer.dispose(); root.remove();
  };
  return api;
}
`;

// src/engine/timerEmbedGenerator.ts
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
  const badge = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;right:8px;top:8px;z-index:5;font:600 11px system-ui,-apple-system,sans-serif;color:#64748b;text-decoration:none;background:rgba(255,255,255,0.85);padding:4px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)">Gridika</a>`;
  const runtime = timerRuntime_default.replace(/^export /gm, "");
  const ends = o.data.personal ? `\u043B\u0438\u0447\u043D\u044B\u0439, ${o.data.personal} \u0447 \u0441 \u043F\u0435\u0440\u0432\u043E\u0433\u043E \u0432\u0438\u0437\u0438\u0442\u0430` : `\u0434\u043E ${new Date(o.data.end).toISOString().replace("T", " ").slice(0, 16)} UTC`;
  return `${codeHeader(`\u0442\u0430\u0439\u043C\u0435\u0440 \u0430\u043A\u0446\u0438\u0438 \xB7 ${ends}`, o.license)}
<div id="${id}" style="position:relative;width:100%;max-width:900px;margin:0 auto;">${badge}</div>
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

// src/engine/timerScene.ts
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

// src/engine/purchaseCode.ts
function buildPurchaseCode(c, license) {
  if (c.p === "qr-morph" && c.qr) {
    return generateEmbedCode({ text: c.qr.text, shape: c.qr.shape, themeId: c.qr.themeId, height: 480, license });
  }
  if (c.p === "qr-card" && c.card) {
    const hidden = new Set(c.card.hidden);
    const contact = Object.fromEntries(Object.entries(c.card.contact).map(([k, v]) => [k, hidden.has(k) ? "" : v]));
    return generateCardEmbedCode({ contact, mode: c.card.mode, style: c.card.style, logo: null, license });
  }
  if (c.p === "gift-box" && c.gift) {
    return generateGiftEmbedCode({ settings: c.gift.settings, mode: c.gift.mode, license });
  }
  if (c.p === "sale-timer" && c.timer) {
    const data = buildTimerData(c.timer.settings, c.timer.mode);
    return data ? generateTimerEmbedCode({ data, license }) : null;
  }
  if (c.p === "voxel-morph" && c.morph) {
    return generateMorphEmbedCode({ data: c.morph.data, license });
  }
  if (c.p === "voxel-logo" && c.logo) {
    return generateLogoEmbedCode({ data: c.logo.data, mode: c.logo.mode, license });
  }
  return null;
}
export {
  buildPurchaseCode
};
