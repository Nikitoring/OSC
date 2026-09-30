export const catPlaceholderPhotos = [
  '/placeholders/cats/cat-header-01.png',
  '/placeholders/cats/cat-header-02.png',
  '/placeholders/cats/cat-header-03.png',
  '/placeholders/cats/cat-header-04.png',
  '/placeholders/cats/cat-header-05.png',
  '/placeholders/cats/cat-header-06.png',
  '/placeholders/cats/cat-header-07.png',
  '/placeholders/cats/cat-header-08.png',
  '/placeholders/cats/cat-header-09.png',
]

export const currentPlaceholder = (id: number | undefined) =>
  id !== undefined
    ? catPlaceholderPhotos[id % catPlaceholderPhotos.length]
    : catPlaceholderPhotos[0]
