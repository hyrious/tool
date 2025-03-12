var __toBinary = /* @__PURE__ */ (() => {
  var table = new Uint8Array(128);
  for (var i = 0; i < 64; i++) table[i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i * 4 - 205] = i;
  return (base64) => {
    var n = base64.length, bytes = new Uint8Array((n - (base64[n - 1] == "=") - (base64[n - 2] == "=")) * 3 / 4 | 0);
    for (var i2 = 0, j = 0; i2 < n; ) {
      var c0 = table[base64.charCodeAt(i2++)], c1 = table[base64.charCodeAt(i2++)];
      var c2 = table[base64.charCodeAt(i2++)], c3 = table[base64.charCodeAt(i2++)];
      bytes[j++] = c0 << 2 | c1 >> 4;
      bytes[j++] = c1 << 4 | c2 >> 2;
      bytes[j++] = c2 << 6 | c3;
    }
    return bytes;
  };
})();

// target/wasm-gc/release/build/lib/lib.wasm
var lib_default = __toBinary("AGFzbQEAAAABzwZlUABfAX8AXncBXngBXwJ/AGRvAF5jAwFfAmQEAX8BTgJgAmQHZG8Bf1AAXwFjBgFOAmACZAlkBwF/UABfAWMIAVABCV8FYwgBbwF/AW8BfwFOBVAAXwRkDABkDQBkDgBkDwBgAmQLZG8Bf2AEZAtkb39/AX9gBGQLZG9/fwF/YAJkC38Bf18CZAIBfwFQAQtfBWQMAGQNAGQOAGQPAGQQAF5/AV8CZBIBfwFfAmQTAH8AXwF/AVABB18DYwYBYxUBYwUBTgJgAmQYfwF/UABfAWMXAU4CYAJkGmQYAX9QAF8BYxkBTwEAXwJ/AGQDAE8BAF8DfwBkAwBkAwBQARpfAmMZAW8BUAEJXwJjCAFjGgFQARhfAmMXAWMCAU8BAF8CfwBkAwBeYxQBXwJkIQF/AVABGF8CYxcBYwcBXwJkCwB/AF5kAAFfA2QCAX8BZAIAXwJkJQF/AWABbwF/YAJvfwF/YAJvbwF/YAJvbwFkb2ABfwFkb2ADYwF/fwFkb2ADZAJ/fwFkb2ACZAJ+AWQCYAF/AX9gAn9/AX9gAWRvAWQaYANkb2RvfwF/YAF/AGACZG9kbwFkCWABZG8Bf2ABZG8BZCJgAAF/YAF/AWQQYAJkAn8Bf2ABZBABZG9gA2QCf38Bf2ACZBB/AX9gAWQiAWQhYAFkJwFkJWABZAUBZARgBWQCf2Rvf38Bf2ACf38AYAJkEGRvAX9gAn9kGAFkAmACZCR/AX9gA39kC38Bf2ADZG9/fwFkb2ADZG9/fgFkb2AEZBBkb39/AX9gAWQaAWQaYAFkCQFkCWABfwFkE2ABfwFkBWABfwFkJ2AFZCF/ZCF/fwF/YAVkJX9kJX9/AX9gBWQEf2QEf38Bf2ACZAV/AX9gAmQnfwF/YAJkIn8Bf2ABZCIBf2ABZCcBf2ABZAUBf2ACZAVkAwF/YAJkJ2QAAX9gAmQiZBQBf2ACf38BZG9gAn9/AWQTYAJkJn8Bf2ABZCYBZAJgAX8BZCZgAmQmZG8Bf2ACf2RvAWQDYAFkbwFkBWABZBMBZBNgAmQTfwF/YANkE39/AX9gAmQFZAUBZCJgAX8BZCJgA2QFZAVkIgFkJ2ABZAABZG9gAWQnAWRvYAJkb2RvAWRvYAAAAs4CDwFfAjEgA2RvAAFfJDAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5egNkbwABXwEgA2RvAAFfAQoDZG8AAV8ecmFkaXggbXVzdCBiZSBiZXR3ZWVuIDIgYW5kIDM2A2RvAAFfDXNob3J0ZXN0X2VkaXQDZG8AAV8CMCADZG8AAV8CMiADZG8AAV8RQ2hhciBvdXQgb2YgcmFuZ2UDZG8ADndhc206anMtc3RyaW5nBmxlbmd0aAAoDndhc206anMtc3RyaW5nCmNoYXJDb2RlQXQAKQ53YXNtOmpzLXN0cmluZwZlcXVhbHMAKg53YXNtOmpzLXN0cmluZwZjb25jYXQAKw53YXNtOmpzLXN0cmluZw1mcm9tQ29kZVBvaW50ACwOd2FzbTpqcy1zdHJpbmcRZnJvbUNoYXJDb2RlQXJyYXkALQOEAVUuLxcvMDAxMhkzNQgIFzE2Nzg5Li44OjswMDw9PT4/wADBAMMAxAAwxQDGADDHAMgAyQDKAMsAzADNAM4AzwDQANEA0gDTANQA1QDWANcA2ADZANoA2wAs3ADJAN0A3gDfAOAA3QDhAOIABtwA4wDkAOUA5gDoAOkA6gDrAA8ODQzsAAQBAAUDAQABBhICZAIA+wgCAAtkAABBf/sAAAsHCQEEZGlmZgDVAAgC2gAJEwEDAAoSDtYAE9cAEdgACNkAzAAMAQAKoydVXQIBZAEEfyACQQF1IQRBACAE+wYBIQMDQCAGIARIBEAgASAGQQF0aiEHIAAgB/sNAiAAIAdBAWr7DQJBCHRyIQUgAyAGIAX7DgEgBkEBaiEGDAELCyADQQAgBBAFCysDAX8BfgF/IAFCgICAgBBRBH8gAPsPBSABIgOnIgQLIgLSCCAA+wAfECgLGwIBZAIBZB8gAPsWHyID+wIfAdQiAiAB+w0CCwgAIAAgARAHCxYAQYCwAyAATAR/IABB/7cDTAVBAAsLFgBBgLgDIABMBH8gAEH/vwNMBUEACwsaACAAQYCwA2tBgAhsIAFqQYC4A2tBgIAEagsLANIOIAD7AB0QMAukAQQBfwFkbwZ/AWQdIAD7Fh0iCvsCHQHUIgMQACECAn9BAAMwIgQgAkgEfyADIAQQASIFEAoEfyAEQQFqIAJIBUEACwRAIAMgBEEBahABIgYQCwRAIAUgBhAMIQcgASAHIAH7AhgAFBciCEEBRgRAIARBAmoMBAVBAAwFCwsLIAEgBSAB+wIYABQXIglBAUYEQAVBAAwDCyAEQQFqDAEFQQELCwsL5gEBB38gABAAIQMgARAAIgRBAEYEQCADQQBGBEBBAA8LIAJBAEgEf0EABSACIANOBH8gAwUgAgsLDwsgBCADSgRAQX8PCyACQQBIBH9BAAUgAiADTgR/IANBAWsFIAILCyEFIAMgBGshBiABQQAQASEHIAUhCANAIAggBkwEQANAIAggA0gEfyAAIAgQASAHRwVBAAsEQCAIQQFqIQgMAQsLIAggBkwEQAJAQQEDNCIJIARIBEAgACAIIAlqEAEgASAJEAFHBEAMAwsgCUEBagwBBSAIDwsLCwsgCEEBaiEIDAELC0F/CzYCAn8BZBogABAAIQIgARAAIgNBAEYEQCAAEA0hBNISIAT7AB4PC9IRIAEgAyAAIAL7AAoQMQupAQYBfwFkbwF/AWRvAn8BZAogAPsWCiII+wIKBCECIAj7AgoD1CEDIAj7AgoCIQQgCPsCCgHUIQVBACEGAn8DfyAGIAJIBH8gAyAFIAYQDyIHQQBIBEAgASADIAZCgICAgBAQLiAB+wIHABQGQQAQFARAQQAMBAtBAQwDCyABIAMgBiAHrBAuIAH7AgcAFAZBABAUBEBBAAwDCyAHIARqIQYMAQVBAQsLCwslAgFkGgFkHiAA+xYeIgP7Ah4B1CIC0hMgAfsAIyAC+wIaABQZCyICAWQHAWQjIAD7FiMiA/sCIwHUIgIgARAEIAL7AgcAFAYLJQAgAEEARgR/IAFBAEYEf0EBBUEACwUgAUEBRgR/QQEFQQALCwsDAAALAwAACwQAQQALJAIBfwFkAiAAQQFIBH9BAQUgAAshAUEAIAH7BgIiAkEA+wAQCwoAIAAgASACEAYLNgEBfyAA+w8hAyABQQBOBH8gAkEATgR/IAEgAmogA0wFQQALBUEACwRkbyAAIAEgAhAZBQALCwQAQQALCQAgAPsPIAFrCxIAIAD7AhAAQQAgAPsCEAEQGgsEACAACwgAIABB/wFxC6oBAQR/IAIQHiIDQYCABEkEfyAAIAEgA0H/AXEQH/sOAiAAIAFBAWogA0EIdhAf+w4CQQIFIANBgIDEAEkEfyADQYCABGsiBEEKdkGAsANyIQUgBEH/B3FBgLgDciEGIAAgASAFQf8BcRAf+w4CIAAgAUEBaiAFQQh2EB/7DgIgACABQQJqIAZB/wFxEB/7DgIgACABQQNqIAZBCHYQH/sOAkEEBSMIEBULCwtbAgJ/AWQCIAD7AhAA+w8hAiABIAJMBEBBAA8LIAIhAwNAIAMgAUgEQCADQQJsIQMMAQsLIAAQFyAD+wYCIgRBACAA+wIQAEEAIAD7AhAB+xECAiAE+wUQAEEACzUBAX8gACAA+wIQAUEEahAhGiAA+wIQACAA+wIQASABECAhAiAAIAD7AhABIAJq+wUQAUEACwgAIAD7AiIACwgAIAD7AicACwgAIAD7AgUAC6sBAQh/IAEgBGpBAWshBSADIARqQQFrIQYgAPsPIQcgAhAAIQggBEEATgR/IAFBAE4EfyAFIAdIBH8gA0EATgR/IAYgCEgFQQALBUEACwVBAAsFQQALBH8gAyAEaiEJIAMgAQPCACELIgogCUgEQCACIAoQARAeIQwgACALIAxB/wFxEB/7DgIgACALQQFqIAxBCHYQH/sOAiAKQQFqIAtBAmoMAQsLQQAFAAsLQgAgACAA+wIQASABEABBAmxqECEaIAD7AhAAIAD7AhABIAFBACABEAAQJhogACAA+wIQASABEABBAmxq+wUQAUEAC04CAWQCAX8gAEEATARAIwkPCyABQQAgAfsCGAAUFyAA+wYCIQJBAQM0IgMgAEgEQCACIAMgASADIAH7AhgAFBf7DgIgA0EBagwBCwsgAgsSACAAQQBIBH9BACAAawUgAAsLQgMBfwFkCwF/IAD7AiQBIQIgAPsCJAAhAyABIAJtIgRBAEcEQCAAIAQQKhoLIAMjASABIAJvECkQASAD+wILAxQPCykBAWQkIABBAEgEQCABQS0gAfsCCwMUDxoLIAEgAvsAJCIDIAAQKRAqC0gAQQIgAEwEfyAAQQdIBUEACwR/QSQFQQggAEwEfyAAQQ9IBUEACwR/QRIFQRAgAEwEfyAAQSRMBUEACwR/QQoFIwQQFQsLCws/AwF/AmQCAn8gAiABayEDEBcgA0ECbPsGAiIEQQAgACABIAMQJhogBCEFEBshBiAFIAYQHCEHIAUgBiAHEBoLTwMCfwF+AX8gABAAIQMgAkKAgICAEFEEfyADBSACIgWnIgYLIQQgAUEATgR/IAEgBEwEfyAEIANMBUEACwVBAAsEZG8gACABIAQQLQUACwthACACQQBOBH8gA0EATgR/IAIgA2ogARAATAVBAAsFQQALBH8gACAA+wIQASADQQJsahAhGiAA+wIQACAA+wIQASABIAIgAxAmGiAAIAD7AhABIANBAmxq+wUQAUEABQALCwQAIAALBAAgAAsMACAA+wcSIAD7ABMLHwAgAEEARgRkBfsIBABBAPsABQUgAPsHBEEA+wAFCwshACAAQQBGBGQn+wglAEEA+wAnBSMKIAD7BiVBAPsAJwsLEgAgACABIAIgAyAE+xEhIUEACxIAIAAgASACIAMgBPsRJSVBAAsSACAAIAEgAiADIAT7EQQEQQALPgICZAQCfyAB+wcEIQIgAPsCBQAiA/sPIgQgAUgEfyAEBSABCyEFIAJBACADQQAgBRA3GiAAIAL7BQUAQQALQAICZCUCfyMKIAH7BiUhAiAA+wInACID+w8iBCABSAR/IAQFIAELIQUgAkEAIANBACAFEDYaIAAgAvsFJwBBAAs+AgJkIQJ/IAH7ByEhAiAA+wIiACID+w8iBCABSAR/IAQFIAELIQUgAkEAIANBACAFEDUaIAAgAvsFIgBBAAsiAQJ/IAD7AiIBIgFBAEYEf0EIBSABQQJsCyECIAAgAhA6CyIBAn8gAPsCJwEiAUEARgR/QQgFIAFBAmwLIQIgACACEDkLIgECfyAA+wIFASIBQQBGBH9BCAUgAUECbAshAiAAIAIQOAs7AQF/IAD7AgUBIAAQJfsPRgRAIAAQPRoLIAD7AgUBIQIgAPsCBQAgAiAB+w4EIAAgAkEBavsFBQFBAAs7AQF/IAD7AicBIAAQJPsPRgRAIAAQPBoLIAD7AicBIQIgAPsCJwAgAiAB+w4lIAAgAkEBavsFJwFBAAs7AQF/IAD7AiIBIAAQI/sPRgRAIAAQOxoLIAD7AiIBIQIgAPsCIgAgAiAB+w4hIAAgAkEBavsFIgFBAAspAQFkECABECwQGCECIADS2QDS2ADS1wDS1gAgAvsAESABECsaIAIQHQsJACAAQQoQwQALMAIBZBMBfyAAEDIhAkEAAzQiAyAASARAIAL7AhMAIAMgAfsOEiADQQFqDAELCyACCwwAIAAgASACIAMQLwtnAgF/AWQCIAD7AiYA+w8iAkEATARAQQEhAgsDQCACIAFIBEAgAkECbCECDAELCyACIAD7AiYA+w9HBH8gABAXIAL7BgIiA0EAIAD7AiYAQQAgAPsCJgH7EQICIAP7BSYAQQAFQQALCxEAIAD7AiYAIAD7AiYBrBAJCyYCAX8BZAIgAEEBSAR/QQEFIAALIQEQFyAB+wYCIgJBACAC+wAmC0MAIAAgAPsCJgEgARAAQQJsahDFABogAPsCJgAgAPsCJgEgAUEAIAEQABAmGiAAIAD7AiYBIAEQAEECbGr7BSYBQQALNgEBfyAAIAD7AiYBQQRqEMUAGiAA+wImACAA+wImASABECAhAiAAIAD7AiYBIAJq+wUmAUEACwkAIAAgAfsAAws1AwFkBQFkFQFkCUEyEDMhAUEA+wAVIQIgACMDEBAiA9LMACACIAH7ABYgA/sCCQAUCBogAQtBAwFkBQFkFQFkFiAA+xYWIgT7AhYC1CECIAT7AhYB1CIDIAP7AhUAQQFq+wUVACACIAP7AhUAIAEQygAQPhpBAQsJACAAIAEQwwALfQICZBMCfyAAIgH7AhMBQQAQwwAhAkEAA8wAIgMgAfsCEwFIBGQTIANBAEgEf0EBBSADIAH7AhMBTgsEQAALIAH7AhMAIAP7CxIhBCADQQBIBH9BAQUgAyAC+wITAU4LBEAACyAC+wITACADIAT7DhIgA0EBagwBBSACCwsLYwIBZBMBfyAAIQIgAUEASAR/IAL7AhMBIAFqIgNBAEgEf0EBBSADIAL7AhMBTgsEQAALIAL7AhMAIAP7CxIFIAFBAEgEf0EBBSABIAL7AhMBTgsEQAALIAL7AhMAIAH7CxILC2sCAWQTAX8gACEDIAFBAEgEfyAD+wITASABaiIEQQBIBH9BAQUgBCAD+wITAU4LBEAACyAD+wITACAEIAL7DhJBAAUgAUEASAR/QQEFIAEgA/sCEwFOCwRAAAsgA/sCEwAgASAC+w4SQQALC4wDBgN/AWQTAWQiAX8BZBMFfyAA+wIFASECIAH7AgUBIQMgAiADaiEEQQIgBGxBAWpBABDNACEF+wghAEEA+wAiIQZBAAPnACIHIARBAWpIBGQiIAUQzgAhCCAGIAggB/sAFBDAABpBACAHawM0IgkgB0EBakgEQEEAIQpBACELIAlBACAHa0YEf0EBBSAJIAdHBH8gBSAJQQFrEM8AIAUgCUEBahDPAEgFQQALCwRAIAUgCUEBahDPACEKBSAFIAlBAWsQzwBBAWohCgsgCiAJayELA0AgCiACSAR/IAsgA0gEfyAKIgxBAEgEf0EBBSAMIAD7AgUBTgsEQAALIAD7AgUAIAz7CwTU+wIDASALIg1BAEgEf0EBBSANIAH7AgUBTgsEQAALIAH7AgUAIA37CwTU+wIDARACBUEACwVBAAsEQCAKQQFqIQogC0EBaiELDAELCyAFIAkgChDQABogCiACTgR/IAsgA04FQQALBEAgBg8LIAlBAmoMAQsLIAdBAWoMAQUjBRAWCwsLyQMGAn8BZCcBfwFkFAFkEwd/IAH7AgUBIQMgAPsCBQEhBCAC+wIiARA0IQUgAvsCIgFBAWsDzgAiBkEATgRkJyAGQQBIBH9BAQUgBiAC+wIiAU4LBEAACyAC+wIiACAG+wsh1CIH+wIUACEIIAf7AhQBIQkgAyAEayIKQQAgCWtGBH9BAQUgCiAJRwR/IAggCkEBaxDPACAIIApBAWoQzwBIBUEACwsEfyAKQQFqBSAKQQFrCyELIAggCxDPACIMIAtrIQ0DQCADIAxKBH8gBCANSgVBAAsEQCADQQFrIQMgBEEBayEEIAVBAiADIg5BAEgEf0EBBSAOIAH7AgUBTgsEQAALIAH7AgUAIA77CwTUIAQiD0EASAR/QQEFIA8gAPsCBQFOCwRAAAsgAPsCBQAgD/sLBNT7ABwQPxoMAQsLIAlBAEoEQCADIAxGBEAgBUEAIA1BAEgEf0EBBSANIAD7AgUBTgsEQAALIAD7AgUAIA37CwTU+wAbED8aBSAEIA1GBEAgBUEBIAxBAEgEf0EBBSAMIAH7AgUBTgsEQAALIAH7AgUAIAz7CwTU+wAgED8aCwsgDCEDIA0hBAsgBkEBawwBBSAFCwsLggEEAWQcAWQbAWQgAX8gAPsCAAAiBEECRgRkbyAA+xYcIQEjBiAB+wIcAfsCAwAQwgAQAyMCEAMgAfsCHAL7AgMAEMIAEAMFIARBAEYEZG8gAPsWGyECIwAgAvsCGwH7AgMAEMIAEAMFIAD7FiAhAyMHIAP7AiAB+wIDABDCABADCwsLggEEAWQmAn8BZAICf0HkABDHACEBIAD7AicBAywiAkEASgRkbyABIAJBAWsiA0EASAR/QQEFIAMgAPsCJwFOCwRAAAsgAPsCJwAgA/sLJRDTABDIABogAUEKEMkAGiACQQFrDAEFIAEQxgAhBBAbIQUgBCAFEBwhBiAEIAUgBhAaCwsLMAMCZAUBZCIBZCcgABDLACECIAEQywAhAyACIAMQ0QAhBCADIAIgBBDSACIFENQACxQBAWQQIAD7FhH7AhEEIgIgARAiCxkBAWQQIAD7FhH7AhEEIgQgASACIAMQxAALGAEBZBAgAPsWEfsCEQQiBCABIAIgAxAvCxQBAWQQIAD7FhH7AhEEIgIgARAnCwIACwsBAA==");

// src/mod.ts
var mod_default = (imports = {}) => WebAssembly.instantiate(lib_default, imports, { builtins: ["js-string"], importedStringConstants: "_" }).then((result) => result.instance.exports);
export {
  mod_default as default
};
