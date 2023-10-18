# sponsors

Using https://github.com/antfu/sponsorkit

## Usage

```
pnpm i

pnpm gen
```

## Serving the SVG

The `gist.sh` script uses GitHub gist as a static file host. Go to https://gist.github.com and create a public gist. Give any description and create a `sponsors.svg` file with `<svg></svg>` as the content (temporary only). Click on the `embed` button, change to `Clone via SSH`, and take note of the SSH URL.

Update the `.env` file with the SSH URL:

```ini
SPONSORS_GIST=<ssh_url>
```

Make sure there's an existing `sponsorkit/sponsors.svg` file locally before continuing to the next step.

To update the `sponsors.svg` file of the gist, run `pnpm gist`. It will create a temporary `gist` folder, copy over the `sponsors.svg` file, and force push to the remote gist to ensure only one commit exists.

Now you can access the SVG file with a URL like https://gist.github.com/user/gist_id/raw/sponsors.svg. Serving directly from this endpoint is not ideal as GitHub doesn't send the proper `Content-Type`, for me I've set a [custom proxy](https://github.com/bluwy/website/blob/master/src/routes/sponsors.svg.js) to acheive so. There are options like http://raw.githack.com but it's `Cache-Control` is too long.

> Note: The guide has the following assumptions:
>
> 1. You have set up SSH. See [GitHub docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).
> 2. The default git branch is `master`.

## Sponsors

<p align="center">
  <a href="https://bjornlu.com/sponsor">
    <img src="https://bjornlu.com/sponsors.svg" alt="Sponsors" />
  </a>
</p>

## License

MIT
