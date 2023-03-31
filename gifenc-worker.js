/// https://github.com/mattdesl/gifenc/blob/-/test/worker.js
/// https://github.com/mattdesl/looom-tools/blob/-/site/components/gifworker.js

import {
  quantize,
  applyPalette,
  prequantize,
  GIFEncoder,
  nearestColorIndexWithDistance,
} from "https://cdn.jsdelivr.net/npm/gifenc@1.0.3/dist/gifenc.esm.js";

const DEFAULT_BACKGROUND = [0, 0, 0];

onmessage = function onmessage(ev) {
  const opts = ev.data;
  const data = opts.data;

  const {
    frame,
    width,
    height,
    delay,
    quantizeWithAlpha = true,
    backgroundColor = DEFAULT_BACKGROUND,
  } = opts;

  let transparent = Boolean(opts.transparent);

  const maxColors = 256;

  let format = "rgb565";
  if (transparent && quantizeWithAlpha) {
    format = "rgba4444";
  }

  const uint8 = new Uint8Array(data.buffer);

  prequantize(uint8, { roundRGB: 1, oneBitAlpha: true });

  const palette = quantize(uint8, maxColors, { format, oneBitAlpha: true });

  let transparentIndex = 0;
  if (transparent) {
    if (quantizeWithAlpha) {
      transparentIndex = palette.findIndex((p) => p[3] === 0);
    } else {
      const result = nearestColorIndexWithDistance(palette, backgroundColor);
      const dist = Math.sqrt(result[1]);
      if (dist <= 5) {
        transparentIndex = result[0];
      } else {
        transparent = false;
      }
    }
  }

  const index = applyPalette(uint8, palette, format);

  const gif = GIFEncoder({ auto: false });
  gif.writeFrame(index, width, height, {
    first: frame === 0,
    repeat: 0,
    delay,
    transparent,
    transparentIndex,
    palette,
  });
  const output = gif.bytesView();
  postMessage({ frame, data: output }, [output.buffer]);
};
