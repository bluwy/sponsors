import { defineConfig, generateBadge, partitionTiers } from 'sponsorkit'

// Custom config for compact composer
const badgeSize = 35
const badgeBorderSize = 2
const badgeGap = 6

/** @type {import('sponsorkit').BadgePreset} */
const badgePreset = {
  avatar: { size: badgeSize },
  boxWidth: badgeSize + badgeGap,
  boxHeight: badgeSize + badgeGap,
}

/**
 * @typedef Legend
 * @property {string} color
 * @property {string} title
 * @property {number} titleLength
 */

export default defineConfig({
  formats: ['svg', 'png'],
  svgInlineCSS: `\
text {
  font-size: 14px;
  fill: #777777;
  font-family: system-ui, sans-serif;
}
.sponsorkit-link {
  cursor: pointer;
}`,
  customComposer: compactComposer,
  tiers: [
    {
      title: 'Mini',
      preset: {
        ...badgePreset,
        color: '#a1a1a1', // dark-gray-ish
        titleLength: 40,
      },
    },
    {
      title: 'The',
      monthlyDollars: 10,
      preset: {
        ...badgePreset,
        color: '#d6b492', // bronze
        titleLength: 37,
      },
    },
    {
      title: 'Air',
      monthlyDollars: 50,
      preset: {
        ...badgePreset,
        color: '#dbdbdb', // silver
        titleLength: 31,
      },
    },
    {
      title: 'Pro',
      monthlyDollars: 200,
      preset: {
        ...badgePreset,
        color: '#ffea73', // gold
        titleLength: 35,
      },
    },
    {
      title: 'Max',
      monthlyDollars: 500,
      preset: {
        ...badgePreset,
        color: '#af8bcc', // sapphire purple-ish
        titleLength: 40,
      },
    },
  ],
})

/**
 * @param {import('sponsorkit').SvgComposer} composer
 * @param {import('sponsorkit').Sponsor[]} sponsors
 * @param {import('sponsorkit').SponsorkitConfig} config
 */
async function compactComposer(composer, sponsors, config) {
  const tierPartitions = partitionTiers(
    sponsors,
    config.tiers,
    config.includePastSponsors
  )

  /** @type {Legend[]} */
  const tierLegends = []
  /** @type {import('sponsorkit').Sponsorship[]} */
  const sponsorships = []
  for (const { tier, sponsors } of tierPartitions) {
    const preset = tier.preset
    if (preset && sponsors.length) {
      tierLegends.push({
        color: preset.color,
        title: tier.title,
        titleLength: preset.titleLength,
      })
      sponsorships.push(...sponsors)
      // Hack. Pass preset info for each sponsor
      sponsors.forEach((sponsor) => {
        sponsor.preset = preset
      })
    }
  }

  const paddingTop = config.padding?.top ?? 20
  const paddingBottom = config.padding?.bottom ?? 15

  composer.addSpan(paddingTop)
  await generateBadgeGrid(composer, sponsorships, config.imageFormat)
  composer.addSpan(paddingBottom)
  generateLegendLine(composer, tierLegends)
  composer.addSpan(paddingBottom)
}

/**
 * @param {import('sponsorkit').SvgComposer} composer
 * @param {import('sponsorkit').Sponsor[]} sponsors
 * @param {import('sponsorkit').ImageFormat} imageFormat
 */
async function generateBadgeGrid(composer, sponsors, imageFormat) {
  const maxWidth = composer.config.width
  const maxAllowedBadgesPerLine = Math.floor(maxWidth / badgePreset.boxWidth)

  for (let i = 0; i < sponsors.length; i += maxAllowedBadgesPerLine) {
    const sponsorsLine = sponsors.slice(i, i + maxAllowedBadgesPerLine)
    await generateBadgeLine(composer, sponsorsLine, imageFormat)
  }
}

/**
 * @param {import('sponsorkit').SvgComposer} composer
 * @param {import('sponsorkit').Sponsor[]} sponsors
 * @param {import('sponsorkit').ImageFormat} imageFormat
 */
async function generateBadgeLine(composer, sponsors, imageFormat) {
  const maxWidth = composer.config.width

  let x = (maxWidth - badgePreset.boxWidth * sponsors.length) / 2
  let y = composer.height
  for (const sponsor of sponsors) {
    composer.body += await generateBadgeSvg(
      x,
      y,
      sponsor.sponsor,
      sponsor.preset, // Hack, retrieve preset for this sponsor
      imageFormat
    )
    x += badgePreset.boxWidth
  }
  composer.height += badgePreset.boxHeight
}

/**
 * @param {number} x
 * @param {number} y
 * @param {import('sponsorkit').Sponsor} sponsor
 * @param {import('sponsorkit').BadgePreset} preset
 * @param {import('sponsorkit').ImageFormat} imageFormat
 */
async function generateBadgeSvg(x, y, sponsor, preset, imageFormat) {
  const badge = await generateBadge(x, y, sponsor, preset, 0.5, imageFormat)

  // add circle border around badge
  const r = preset.avatar.size / 2
  const cx = x + r
  const cy = y + r
  const circle = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${preset.color}" stroke-width="${badgeBorderSize}" />`

  // Concat badge and circle, but formatted to look nicer for debugging
  return badge.replace('>\n', '>').replace('</a>', `  ${circle}\n</a>\n\n`)
}

/**
 * @param {import('sponsorkit').SvgComposer} composer
 * @param {Legend[]} legends
 */
function generateLegendLine(composer, legends) {
  const maxWidth = composer.config.width
  const iconSize = 10
  const averageLegendHeight = 10
  const totalLegendWidth = legends.reduce(
    (acc, { titleLength }) => acc + titleLength + iconSize,
    0
  )

  let x = (maxWidth - totalLegendWidth) / 2
  let y = composer.height

  for (const { color, title, titleLength } of legends) {
    composer.body += generateLegendSvg(x, y, color, title)
    x += titleLength + iconSize
  }
  composer.height += averageLegendHeight
}

function generateLegendSvg(x, y, color, title) {
  const circle = `<circle cx="${x}" cy="${y}" r="5" fill="${color}" stroke="none" />`
  const text = `<text x="${x + 10}" y="${y + 5}" class="text">${title}</text>`
  // Concat circle and text, but formatted to look nicer for debugging
  return `${circle}${text}\n`
}
