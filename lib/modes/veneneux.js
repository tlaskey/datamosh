'use strict'

module.exports = function (original) {
  const rand = Math.random
  const max = Math.max

  const bitmapData = original.bitmap.data
  const data = Buffer.from(bitmapData)

  const { width, height } = original.bitmap

  function giveSeed () {
    const seed = [0, 0, 0]

    const ind1 = Math.floor(rand() * 3)
    const ind2 = Math.floor(rand() * 3)

    seed[ind1] = max(rand(), 0.1)
    if (rand() > 0.5) seed[ind2] = max(rand(), 0.1)

    return seed
  }

  let pixel = 0
  let seed = giveSeed()
  let seedChange = 2

  for (let i = 0; i < data.length; i += 4) {
    if (pixel % (width * 4) === 0) {
      seedChange--
      if (seedChange === 0) {
        seed = giveSeed()
        seedChange = Math.floor((rand() * height) / 4)
      }
    }

    data[i + 0] = data[i + 0] * seed[0] + 1000 * seed[2]
    data[i + 1] = data[i + 1] * seed[1] + 1000 * seed[1]
    data[i + 2] = data[i + 2] * seed[2] + 1000 * seed[0]
    data[i + 3] = 1

    pixel++
  }

  original.bitmap.data = data
  return original
}
