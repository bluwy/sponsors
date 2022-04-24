# sponsors

A zero-dependencies script to generate sponsors SVG from [Patreon](https://patreon.com).

## Usage

Go to https://www.patreon.com/portal/registration/register-clients to create an API Key. Once done, take note of your `Creator's Access Token`. It would be used to fetch data from the [Patreon API](https://docs.patreon.com).

Create an `.env` file, replace `<creators_access_token>` with the token above:

```ini
PATREON_ACCESS_TOKEN=<creators_access_token>
```

Run `npm run gen` to generate the SVG.

## Serving the SVG

The `gist.sh` script uses GitHub gist as a static file host. Go to https://gist.github.com and create a public gist. Give any description and create a `sponsors.svg` file with `<svg></svg>` as the content (temporary only). Click on the `embed` button, change to `Clone via HTTPS`, and take note of the git URL.

Update the `.env` file with the git URL:

```ini
SPONSORS_GIST=<git_url>
```

Make sure there's an existing `sponsors.svg` file locally before continuing to the next step.

To update the `sponsors.svg` file of the gist, run `npm run gist`. It will create a temporary `gist` folder, copy over the `sponsors.svg` file, and force push to the remote gist to ensure only one commit exists.

Next, go to http://raw.githack.com to retrieve a link to the SVG. You should paste in something like https://gist.github.com/user/gist_id/raw/sponsors.svg to retrieve a prod and dev URL.

You can now use these URLs anywhere. For my case, I've setup https://bjornlu.com/sponsors.svg to redirect to the URL.

> Note the guide has the following assumptions:
>
> 1. The git remote uses HTTPS.
> 2. You have credentials to update gists. Create a [personal access token](https://github.com/settings/tokens) otherwise.
> 3. The default git branch is `master`.

## Todo

- Pre-round the images to produce smaller SVG size
- Use CSS `style` to group some styles
- More configuration options

## Attribution

- https://github.com/antfu/sponsorkit

## Sponsors

<p align="center">
  <a href="https://bjornlu.com/sponsors.svg">
    <img src="https://bjornlu.com/sponsors.svg" alt="Sponsors" />
  </a>
</p>

## License

MIT
