// SPDX-License-Identifier: AGPL-3.0-or-later
// The gifski-wasm source is at https://github.com/jamsinclair/gifski-wasm/tree/2.2.0.
// The pinned gifski-lite source is at https://github.com/jamsinclair/gifski-lite/tree/c04e3f28f5b9bed51d141789ce54619caf5b7495.

const GIFSKI_URL = 'https://cdn.jsdelivr.net/npm/gifski-wasm@2.2.0/pkg/gifski_wasm.js'
const MP4BOX_URL = 'https://cdn.jsdelivr.net/npm/mp4box@0.5.2/dist/mp4box.all.min.js'
const MAX_FRAME_BYTES = 512 * 1024 * 1024

let mp4boxLoaded = false

class FrameCollector {
  constructor(width, height, fps, duration, sourceFrameCount) {
    this.width = Math.max(1, Math.round(width))
    this.height = Math.max(1, Math.round(height))
    this.fps = fps
    this.duration = duration
    this.sourceFrameCount = sourceFrameCount
    this.interval = 1e6 / fps
    this.firstTimestamp = undefined
    this.nextTimestamp = undefined
    this.canvas = undefined
    this.context = undefined
    this.frames = undefined
    this.frameBytes = 0
    this.frameCount = 0
    this.timestamps = []
  }

  add(frame) {
    try {
      if (this.firstTimestamp == null) {
        this.firstTimestamp = frame.timestamp
        this.nextTimestamp = frame.timestamp
      }

      if (frame.timestamp + 1 < this.nextTimestamp) return

      while (this.nextTimestamp <= frame.timestamp + 1) {
        this.nextTimestamp += this.interval
      }

      if (!this.canvas) this.initialize()
      this.ensureCapacity(this.frameCount + 1)
      this.context.drawImage(frame, 0, 0, this.width, this.height)
      const imageData = this.context.getImageData(0, 0, this.width, this.height)
      this.frames.set(imageData.data, this.frameCount * this.frameBytes)
      this.timestamps.push(frame.timestamp)
      this.frameCount++
    } finally {
      frame.close()
    }
  }

  initialize() {
    this.frameBytes = this.width * this.height * 4

    const durationFrames = Math.ceil(this.duration * this.fps) + 2
    const initialFrames = Math.max(2, Math.min(this.sourceFrameCount || durationFrames, durationFrames))
    this.assertFrameBytes(initialFrames)
    this.frames = new Uint8Array(this.frameBytes * initialFrames)
    this.canvas = new OffscreenCanvas(this.width, this.height)
    this.context = this.canvas.getContext('2d', { alpha: false, willReadFrequently: true })
    if (!this.context) throw new Error('Could not create a 2D canvas context.')
  }

  ensureCapacity(requiredFrames) {
    if (requiredFrames * this.frameBytes <= this.frames.byteLength) return

    const currentFrames = this.frames.byteLength / this.frameBytes
    const nextFrames = Math.max(requiredFrames, Math.ceil(currentFrames * 1.5))
    this.assertFrameBytes(nextFrames)
    const frames = new Uint8Array(this.frameBytes * nextFrames)
    frames.set(this.frames)
    this.frames = frames
  }

  assertFrameBytes(frameCount) {
    const bytes = this.frameBytes * frameCount
    if (bytes > MAX_FRAME_BYTES) {
      throw new Error('The selected size and frame rate need more than 512 MiB of frame memory. Reduce size or FPS.')
    }
  }

  finish() {
    if (!this.frames || this.frameCount === 0) throw new Error('The video did not produce any frames.')

    if (this.frameCount === 1) {
      this.ensureCapacity(2)
      this.frames.copyWithin(this.frameBytes, 0, this.frameBytes)
      const duplicateOffset = Math.max(10000, Math.min(this.interval, this.duration * 5e5))
      this.timestamps.push(this.timestamps[0] + duplicateOffset)
      this.frameCount = 2
    }

    return {
      data: this.frames.subarray(0, this.frameCount * this.frameBytes),
      durations: this.getFrameDurations(),
      frameCount: this.frameCount,
      width: this.width,
      height: this.height,
    }
  }

  getFrameDurations() {
    const durations = new Uint32Array(this.frameCount)
    let assignedDuration = 0
    for (let index = 0; index + 1 < this.frameCount; index++) {
      const elapsed = Math.round((this.timestamps[index + 1] - this.timestamps[0]) / 1000)
      durations[index] = Math.max(10, elapsed - assignedDuration)
      assignedDuration += durations[index]
    }

    durations[this.frameCount - 1] = Math.max(10, Math.round(this.duration * 1000) - assignedDuration)
    return durations
  }
}

self.onmessage = async function onmessage(event) {
  if (event.data?.type != 'convert') return

  try {
    const { buffer, width, height, fps, quality } = event.data
    postStatus('loading', 'Loading GIF encoder…')

    const gifskiPromise = loadGifski()
    const decodedPromise = decodeMp4(buffer, { width, height, fps })
    const [gifski, decoded] = await Promise.all([gifskiPromise, decodedPromise])

    postStatus('encoding', `Encoding ${decoded.frameCount} frames…`, {
      frameCount: decoded.frameCount,
      width: decoded.width,
      height: decoded.height,
    })

    const output = gifski.encode(
      decoded.data,
      decoded.frameCount,
      decoded.width,
      decoded.height,
      undefined,
      decoded.durations,
      quality,
      1,
      undefined,
      undefined,
    )
    enableInfiniteLoop(output)

    postMessage({
      type: 'done',
      buffer: output.buffer,
      frameCount: decoded.frameCount,
      width: decoded.width,
      height: decoded.height,
    }, [output.buffer])
  } catch (error) {
    postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) })
  }
}

async function loadGifski() {
  const module = await import(GIFSKI_URL)
  await module.default()
  return module
}

function enableInfiniteLoop(data) {
  const signature = [0x21, 0xff, 0x0b, 0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2e, 0x30]
  for (let index = 0; index + signature.length + 5 <= data.length; index++) {
    if (!signature.every((byte, offset) => data[index + offset] == byte)) continue

    const block = index + signature.length
    if (data[block] == 3 && data[block + 1] == 1 && data[block + 4] == 0) {
      data[block + 2] = 0
      data[block + 3] = 0
      return
    }
  }
  throw new Error('The GIF encoder did not produce loop metadata.')
}

function loadMp4Box() {
  if (!mp4boxLoaded) {
    importScripts(MP4BOX_URL)
    mp4boxLoaded = true
  }
}

function decodeMp4(buffer, options) {
  loadMp4Box()
  postStatus('decoding', 'Reading video…')

  return new Promise((resolve, reject) => {
    const mp4file = MP4Box.createFile()
    let decoder = undefined
    let collector = undefined
    let decodeError = undefined
    let totalSamples = 0
    let queuedSamples = 0

    mp4file.onError = error => reject(new Error(`Could not read MP4: ${error}`))
    mp4file.onSamples = function onSamples(trackId, ref, samples) {
      try {
        for (const sample of samples) {
          decoder.decode(new EncodedVideoChunk({
            type: sample.is_sync ? 'key' : 'delta',
            timestamp: 1e6 * sample.cts / sample.timescale,
            duration: 1e6 * sample.duration / sample.timescale,
            data: sample.data,
          }))
          queuedSamples++
        }

        postProgress('decoding', totalSamples > 0 ? queuedSamples / totalSamples : 0, `Decoding ${queuedSamples}/${totalSamples || '?'} frames…`)
      } catch (error) {
        decodeError = error
      }
    }

    mp4file.onReady = async function onReady(info) {
      try {
        const track = info.videoTracks[0]
        if (!track) throw new Error('The MP4 does not contain a video track.')

        totalSamples = track.nb_samples || 0
        const duration = track.duration / track.timescale
        collector = new FrameCollector(options.width, options.height, options.fps, duration, totalSamples)

        const config = {
          codec: track.codec,
          codedWidth: track.video.width,
          codedHeight: track.video.height,
          description: getDescription(mp4file, track),
        }
        const support = await VideoDecoder.isConfigSupported(config)
        if (!support.supported) throw new Error(`The browser cannot decode ${track.codec}.`)

        decoder = new VideoDecoder({
          output(frame) {
            if (decodeError) {
              frame.close()
            } else {
              try {
                collector.add(frame)
              } catch (error) {
                decodeError = error
              }
            }
          },
          error(error) {
            decodeError = error
          },
        })
        decoder.configure(support.config)

        mp4file.setExtractionOptions(track.id, null, { nbSamples: 20 })
        mp4file.start()
        mp4file.flush()
        await decoder.flush()
        decoder.close()

        if (decodeError) throw decodeError
        resolve(collector.finish())
      } catch (error) {
        if (decoder?.state != 'closed') decoder?.close()
        reject(error)
      }
    }

    buffer.fileStart = 0
    mp4file.appendBuffer(buffer)
    mp4file.flush()
  })
}

function getDescription(mp4file, track) {
  const trak = mp4file.getTrackById(track.id)
  for (const entry of trak.mdia.minf.stbl.stsd.entries) {
    if (entry.avcC || entry.hvcC) {
      const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN)
      if (entry.avcC) {
        entry.avcC.write(stream)
      } else {
        entry.hvcC.write(stream)
      }
      return new Uint8Array(stream.buffer, 8)
    }
  }
  return undefined
}

function postStatus(phase, message, details = undefined) {
  postMessage({ type: 'status', phase, message, details })
}

function postProgress(phase, value, message) {
  postMessage({ type: 'progress', phase, value, message })
}
