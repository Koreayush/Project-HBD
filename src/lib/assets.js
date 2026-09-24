// Photos placed in src/assets/photos are bundled and resolved by file name.
const photoModules = import.meta.glob(
  '/src/assets/photos/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' }
)
const byName = {}
for (const [path, url] of Object.entries(photoModules)) {
  byName[path.split('/').pop().toLowerCase()] = url
}

export function resolvePhoto(name) {
  if (!name) return null
  if (/^(https?:|data:|\/)/.test(name)) return name // public/ path or full URL
  return byName[name.toLowerCase()] ?? null
}

const musicModules = import.meta.glob('/src/assets/music/*.{mp3,m4a,ogg,wav,aac}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const musicEntries = Object.entries(musicModules)
const preferred = musicEntries.find(([p]) => p.includes('birthday-song'))
export const musicUrl = (preferred ?? musicEntries[0])?.[1] ?? null
