import fs from 'node:fs/promises'
import https from 'node:https'

// assuming 5 tiers (change if needed)
const sponsorImgSizePx = [68, 60, 50, 45, 35]
const svgWidthPx = 768
const paddingPx = 16
const titlePx = 16

// hardcode map of patreon id to github username for image
const patreonToGithub = {
  2341390: 'yyx990803',
  5300231: 'patak-dev',
  30396097: 'DannyFeliz',
  36653529: 'soetz',
  21723645: 'fwouts',
  55198421: 'Jutanium',
  64905238: 'PuruVJ',
  81366083: 'danfry1',
  88859138: 'fi3ework'
}

const patreonCustomUrl = {
  87202845: 'https://easygo.io'
}

/** @type {Tier} */
const specialTier = {
  id: 'special',
  name: 'Special Sponsor',
  sponsors: [
    {
      name: 'Astro',
      url: 'https://astro.build',
      img: './images/astro.png'
    }
  ],
  imgSize: 70,
  aspect: 3.82
}

await dotenv()
const tiers = await fetchTiers()
const sponsorImgMap = await optimizeSponsorImages(tiers)
const svg = createSvg(tiers, sponsorImgMap)
await fs.writeFile('sponsors.svg', svg)
console.log('Generated sponsors.svg')

// Aspect = width / height (default 1)

/**
 * @typedef {{
 *  name: string,
 *  url: string,
 *  img: string
 * }} Sponsor
 */

/**
 * @typedef {{
 *  id: string,
 *  name: string,
 *  sponsors: Sponsor[],
 *  imgSize: number,
 *  aspect?: number
 * }} Tier
 */

/**
 * @returns {Promise<Tier[]>}
 */
async function fetchTiers() {
  // Get current authenticated user's compaign ID
  // (Everyone has one default campaign)
  const campaignResult = await doFetch({
    method: 'GET',
    hostname: 'www.patreon.com',
    path: '/api/oauth2/api/current_user/campaigns?include=rewards.null',
    headers: {
      Authorization: `Bearer ${process.env.PATREON_ACCESS_TOKEN}`
    }
  })
  const campaignResultJson = JSON.parse(campaignResult.toString())
  /** @type {string} */
  const campaignId = campaignResultJson.data[0].id
  /** @type {string[]} */
  const allTierIds = campaignResultJson.included
    .filter((v) => v.type === 'reward' && v.id !== '-1' && v.id !== '0')
    .map((v) => v.id)
    .reverse() // highest to lowest tier

  // Get pledges from the campaign
  const pledgesResult = await doFetch({
    method: 'GET',
    hostname: 'www.patreon.com',
    path: `/api/oauth2/api/campaigns/${campaignId}/pledges?include=patron.null,reward.null&page%5Bcount%5D=100`,
    headers: {
      Authorization: `Bearer ${process.env.PATREON_ACCESS_TOKEN}`
    }
  })
  const pledgesResultJson = JSON.parse(pledgesResult.toString())

  // debug
  // await fs.writeFile('pledges.json', JSON.stringify(pledgesResultJson, null, 2))

  /** @type {Tier[]} */
  const tiers = pledgesResultJson.included
    .filter((v) => v.type === 'reward')
    .sort((a, b) => b.attributes.amount_cents - a.attributes.amount_cents)
    .map((v) => ({
      id: v.id,
      name: v.attributes.title,
      sponsors: [],
      imgSize:
        sponsorImgSizePx[allTierIds.findIndex((id) => id === v.id)] ??
        2 * paddingPx
    }))

  for (const pledge of pledgesResultJson.data) {
    if (pledge.attributes.declined_since) continue

    const tierId = pledge.relationships.reward.data.id
    const tier = tiers.find((v) => v.id === tierId)
    if (!tierId) {
      console.log(`Unable to find tier of id: ${tierId}`)
      continue
    }

    const sponsorId = pledge.relationships.patron.data.id
    const sponsor = pledgesResultJson.included.find((v) => v.id === sponsorId)
    if (!sponsor) {
      console.log(`Unable to find sponsor of id: ${sponsorId}`)
      continue
    }

    const gh = patreonToGithub[sponsorId]

    tier.sponsors.push({
      name: sponsor.attributes.full_name,
      img: gh ? `https://github.com/${gh}.png` : sponsor.attributes.thumb_url,
      url: gh
        ? `https://github.com/${gh}`
        : patreonCustomUrl[sponsorId] || sponsor.attributes.url
    })
  }

  tiers.unshift(specialTier)

  return tiers.filter((t) => t.sponsors.length > 0)
}

/**
 * @param {Tier[]} tiers
 * @param {Record<string, string>} sponsorImgMap
 */
function createSvg(tiers, sponsorImgMap) {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidthPx}" height="__SVG_HEIGHT__" viewBox="0 0 ${svgWidthPx} __SVG_HEIGHT__">`
  svg += `<clipPath id="clip-circle" clipPathUnits="objectBoundingBox"><circle r=".5" cx=".5" cy=".5"/></clipPath>`
  svg +=
    `<style>` +
    `text { fill: #777777; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;}` +
    `</style>`

  let y = paddingPx

  for (const tier of tiers) {
    const titleX = svgWidthPx / 2
    y += titlePx
    svg += `<text x="${titleX}" y="${y}" text-anchor="middle" font-size="${titlePx}px" font-weight="500">${tier.name}</text>`
    y += paddingPx

    // let x be img per row, s be img size,
    //   1024 be svg width, 16 be padding
    //
    // x * s + (x + 1) * 16 <= 1024
    // x * s + 16x + 16 <= 1024
    // x * s + 16x <= 1024 - 16
    // x * (s + 16) <= 1024 - 16
    // x <= (1024 - 16) / (s+16)

    const imgWidth = tier.imgSize * (tier.aspect ?? 1)
    const imgHeight = tier.imgSize

    const maxSponsorCountPerRow = Math.floor(
      (svgWidthPx - paddingPx) / (imgWidth + paddingPx)
    )

    for (let i = 0; i < tier.sponsors.length; i += maxSponsorCountPerRow) {
      const max = Math.min(maxSponsorCountPerRow, tier.sponsors.length - i)

      // let x be row item count, s be img size,
      //   1024 be svg width, 16 be padding
      //
      // (1024 - (x * s + (x + 1) * 16)) / 2

      let x = (svgWidthPx - (max * imgWidth + (max - 1) * paddingPx)) / 2

      for (let j = i; j < max; j++) {
        const sponsor = tier.sponsors[j]
        const img = `data:image/png;base64,${sponsorImgMap[sponsor.img]}`
        const clipPath =
          tier.id === 'special' ? '' : ' clip-path="url(#clip-circle)"'
        svg += `<a href="${sponsor.url}" target="_blank"><image${clipPath} x="${x}" y="${y}" width="${imgWidth}" height="${imgHeight}" href="${img}"/></a>`
        x += imgWidth + paddingPx
      }

      y += imgHeight + paddingPx / 2
    }

    y += paddingPx
  }

  svg += `</svg>`
  svg = svg.replace(/__SVG_HEIGHT__/g, y)

  return svg
}

/**
 * Fetch all sponsors images and base64 them to inline into SVG
 * @param {Tier[]} tiers
 */
async function optimizeSponsorImages(tiers) {
  // map of sponsor image url to base64 image
  // (avoid Map constructor to easily serialize as JSON)
  let resultMap = {}
  try {
    const cache = await fs.readFile('cache.json', 'utf8')
    resultMap = JSON.parse(cache)
  } catch {}

  const promises = []

  for (const tier of tiers) {
    for (const sponsor of tier.sponsors) {
      if (!resultMap[sponsor.img]) {
        if (sponsor.img.startsWith('.')) {
          promises.push(
            fs.readFile(sponsor.img, 'base64').then((result) => {
              resultMap[sponsor.img] = result
            })
          )
        } else {
          promises.push(
            doFetch(sponsor.img).then((result) => {
              resultMap[sponsor.img] = result.toString('base64')
            })
          )
        }
      }
    }
  }

  await Promise.all(promises)
  await fs.writeFile('cache.json', JSON.stringify(resultMap, null, 2))

  return resultMap
}

/**
 * Mini dotenv :)
 */
async function dotenv() {
  const env = await fs.readFile('.env', 'utf8')
  for (const line of env.split('\n')) {
    const r = line.split('=', 2)
    process.env[r[0]] = r[1]
  }
}

/**
 * Mini fetch :)
 * @param {string | URL | import('https').RequestOptions} options
 * @param {any} [postData]
 * @returns {Promise<Buffer>}
 */
function doFetch(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        const newURL = new URL(res.headers.location)
        if (typeof options === 'object' && !(options instanceof URL)) {
          options.hostname = newURL.host
          options.path = newURL.pathname
        } else {
          options = newURL
        }
        doFetch(options, postData).then(resolve, reject)
        return
      }
      let chunks = []
      res.on('data', (d) => chunks.push(d))
      res.on('error', (e) => reject(e))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    })
    req.on('error', (e) => reject(e))
    req.end(postData)
  })
}
