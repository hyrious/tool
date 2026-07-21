// SPDX-License-Identifier: AGPL-3.0-or-later

class GifTransferStore {
  constructor() {
    this.databaseName = 'hyrious-tool-gif-transfer'
    this.storeName = 'transfers'
    this.maxAge = 24 * 60 * 60 * 1000
    this.databasePromise = undefined
  }

  async put(blob, name) {
    const key = crypto.randomUUID()
    const database = await this.open()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const cutoff = Date.now() - this.maxAge
      const cursorRequest = store.openCursor()

      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result
        if (cursor) {
          if (cursor.value.createdAt < cutoff) cursor.delete()
          cursor.continue()
        }
      }
      store.put({ blob, name, createdAt: Date.now() }, key)
      transaction.oncomplete = () => resolve(key)
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
  }

  async take(key) {
    const database = await this.open()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(key)
      let record = undefined

      request.onsuccess = () => {
        record = request.result
        if (record) store.delete(key)
      }
      transaction.oncomplete = () => resolve(record)
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
  }

  open() {
    if (!this.databasePromise) {
      this.databasePromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(this.databaseName, 1)
        request.onupgradeneeded = () => request.result.createObjectStore(this.storeName)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    }
    return this.databasePromise
  }
}

globalThis.gifTransfer = new GifTransferStore()
