import { defineConfig } from 'sponsorkit'

// prettier-ignore
const astroLogo = (width, y) => `
<a xlink:href="https://astro.build" class="sponsorkit-link" target="_blank">
<svg x="${(width-234)/2}" y="${y}" xmlns="http://www.w3.org/2000/svg" width="234" height="79" viewBox="0 0 330 104" version="1.2"><defs><linearGradient id="g1" x2="1" gradientTransform="matrix(34.289 -16.241 17.459 36.86 31.522 90.48)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d83333"/><stop offset="1" stop-color="#f041ff"/></linearGradient><clipPath id="cp1" clipPathUnits="userSpaceOnUse"><path d="M15 12h300v79H15z"/></clipPath></defs><style>.s2{fill:#fff}</style><path id="Shape 1" d="M0 16C0 7.2 7.2 0 16 0h298c8.8 0 16 7.2 16 16v72c0 8.8-7.2 16-16 16H16c-8.8 0-16-7.2-16-16z" style="fill:#222"/><g id="Layer"><path d="M35.3 78.8c-3.6-3.2-4.6-10-3.1-14.9 2.5 3.1 6.1 4.1 9.8 4.6 5.7.9 11.3.6 16.5-2 .7-.3 1.2-.7 1.9-1.1.5 1.4.6 2.8.4 4.3-.4 3.6-2.2 6.4-5 8.5l-3.6 2.4C48.6 83 47.6 85.9 49 90c0 .1.1.2.1.5-1.8-.8-3.2-2-4.2-3.6-1.1-1.7-1.6-3.5-1.6-5.5 0-1 0-2-.2-2.9-.3-2.4-1.4-3.4-3.4-3.5-2.2 0-3.8 1.3-4.3 3.3q0 .3-.1.5z" style="fill:url(#g1)"/><path d="M15 63s10.5-5.1 21.1-5.1L44 33.4c.3-1.2 1.2-2 2.2-2 1 0 1.8.8 2.1 2l8 24.5c12.5 0 21.1 5.1 21.1 5.1S59.5 14.5 59.5 14.4c-.6-1.5-1.4-2.4-2.6-2.4H35.5c-1.2 0-2 .9-2.6 2.4C32.9 14.5 15 63 15 63z" class="s2"/><path fill-rule="evenodd" d="M126 49.1c0-3.7-2.2-5.6-10.4-5.6-5.9 0-13.5 1.1-18.8 3.6-.4-3.2-1.3-8.2-1.9-10.6 6.2-1.9 14.4-3.1 21.7-3.1 17 0 22.4 5.7 22.4 14.7 0 4.5-.2 7.7-.2 12.1 0 4.1.4 8.8 1 10.5h-10.9c-2.3 0-2.8-.3-2.8-3.1 0-1 .1-2.3.2-3.6h-.4c-2.2 5.4-8.1 7.6-16.9 7.6-10.4 0-14.9-3-14.9-11 0-7.6 6.6-10.9 20.5-10.9 4.8 0 8.8.3 11.4.9zm0 6.7c-4.3-.5-8.1-.6-12.4-.6-4.9 0-7 1.3-7 3.9 0 2.5 1.7 3.7 6.6 3.7 7.4 0 12.8-2.5 12.8-6.8z" class="s2"/><path d="M155.8 58.5c-1.5.2-3.5.2-5.5.2-2.2 0-4.2-.1-5.6-.3v1.5c0 7.5 4.9 11.8 22.1 11.8 16.2 0 21.5-4.3 21.5-11.8 0-7.2-3.5-10.8-18.9-11.5-12-.6-13.1-1.9-13.1-3.4 0-1.7 1.6-2.6 9.6-2.6 8.3 0 10.6 1.1 10.6 3.5v.6c1.1-.1 3.3-.2 5.4-.2 2.1 0 4.3.1 5.6.2 0-.5.1-1 .1-1.4 0-8.8-7.3-11.7-21.5-11.7-15.9 0-21.3 3.9-21.3 11.5 0 6.8 4.3 11.1 19.6 11.7 11.3.4 12.5 1.6 12.5 3.4 0 1.8-1.8 2.7-9.7 2.7-9.1 0-11.4-1.3-11.4-3.9zM207.7 27c-4.3 4-12 8-16.3 9.1v8.4l4 .1c-.1 4.3-.1 9.4-.1 12.8 0 8 4.2 13.9 17.2 13.9 5.5 0 9.1-.6 13.7-1.5-.5-3-1-7.4-1.2-10.8-2.7.9-6.1 1.3-9.9 1.3-5.3 0-7.4-1.4-7.4-5.5q0-5.4.1-10.1c6.7.1 13.4.2 17.4.3-.1-3.1 0-7.6.2-10.6-5.7.2-12.1.2-17.4.2 0-2.6.1-5.1.1-7.6zM243 42.8c0-3.2.1-5.8.1-8.4h-11.8c.2 5.2.2 10.4.2 18.2 0 7.7-.1 13-.2 18.1h13.5c-.2-3.6-.3-9.7-.3-14.8 0-8.1 3.4-10.5 10.8-10.5 3.5 0 6 .5 8.2 1.2 0-3 .6-8.9 1-11.6-2.3-.6-4.7-1-7.7-1-6.5-.1-11.2 2.5-13.4 8.8z" class="s2"/><path fill-rule="evenodd" d="M289.8 71.9c-15 0-24.1-7-24.1-19.9 0-13 9.8-18.8 24.2-18.8 14.3 0 24.4 5.8 24.4 18.8 0 12.9-9.4 19.9-24.5 19.9zm.1-28.8c-7.3 0-12.1 2.5-12.1 9.2 0 6.7 4.7 9.6 12.1 9.6 7.4 0 12.1-3.1 12.1-9.6s-4.8-9.2-12.1-9.2z" class="s2"/></g></svg>
</a>`

export default defineConfig({
  tiers: [
    {
      title: 'Mini Sponsor',
      preset: {
        avatar: {
          size: 35
        },
        boxWidth: 40,
        boxHeight: 48,
        container: {
          sidePadding: 30
        }
      }
    },
    {
      title: 'The Sponsor',
      monthlyDollars: 10,
      preset: {
        avatar: {
          size: 45
        },
        boxWidth: 50,
        boxHeight: 56,
        container: {
          sidePadding: 30
        }
      }
    },
    {
      title: 'Air Sponsor',
      monthlyDollars: 50,
      preset: {
        avatar: {
          size: 50
        },
        boxWidth: 60,
        boxHeight: 70,
        container: {
          sidePadding: 20
        },
        name: {
          maxLength: 10
        }
      }
    },
    {
      title: 'Pro Sponsor',
      monthlyDollars: 200,
      preset: {
        avatar: {
          size: 60
        },
        boxWidth: 70,
        boxHeight: 80,
        container: {
          sidePadding: 20
        },
        name: {
          maxLength: 10
        }
      }
    },
    {
      title: 'Max Sponsor',
      monthlyDollars: 500,
      preset: {
        avatar: {
          size: 70
        },
        boxWidth: 80,
        boxHeight: 90,
        container: {
          sidePadding: 20
        },
        name: {
          maxLength: 16
        }
      }
    },
    {
      title: 'Special Sponsor',
      monthlyDollars: Infinity,
      composeAfter(compose, _, config) {
        compose
          .addSpan(20)
          .addText('Special Sponsor', 'sponsorkit-tier-title')
          .addSpan(0)
          .addRaw(astroLogo(config.width, compose.height))
          .addSpan(90)
      }
    }
  ]
})
