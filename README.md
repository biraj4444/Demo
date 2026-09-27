# Expressive Send — concept presentation site

A static, no-backend presentation site for the "Expressive Send" interaction
concept, plus the interactive prototype itself. Built to be reviewed by a
product/design team and deployed straight to Cloudflare Pages.

**This is an independent concept, not affiliated with Meta or Instagram.**
That disclaimer is shown on every page — do not remove it.

## Structure

```
index.html          Homepage / hero, demo video, "how it works", file links
case-study.html      Full case study: concept, decisions, considerations, limitations, background
prototype.html        The interactive prototype (unmodified animation/behavior, just a back button added)
assets/css/style.css   Shared styles for the homepage and case study
assets/js/config.js    Edit this to point at your own video / prototype / GitHub links
assets/js/site.js      Applies config.js values to the pages — no need to edit
assets/img/poster.svg  Placeholder video poster, shown until you add a real video
assets/video/          Put your demo.mp4 here (or use Cloudinary, see below)
scripts/upload_to_cloudinary.py   Termux-friendly uploader for the demo video
```

## Editing the three things you'll actually change

Open `assets/js/config.js`:

```js
window.SITE_CONFIG = {
  demoVideoSrc: "assets/video/demo.mp4",   // or a Cloudinary URL
  prototypeUrl: "prototype.html",
  githubUrl: "https://github.com/your-username/expressive-send",
  caseStudyUrl: "case-study.html",
  author: "Kaustav Khanikar"
};
```

That's the only file you need to touch to swap the video, the prototype
link, or the source-code link.

## Adding the demo video

**Option A — keep it local:** drop your file at `assets/video/demo.mp4`
(same name, or update `demoVideoSrc` in `config.js` to match).

**Option B — host it on Cloudinary** (recommended if the file is large,
since it keeps the git repo — and Cloudflare Pages deploy — small and fast).

In Termux:

```bash
pip install requests --break-system-packages

export CLOUDINARY_CLOUD_NAME="your-cloud-name"
export CLOUDINARY_UPLOAD_PRESET="your-unsigned-preset"

python3 scripts/upload_to_cloudinary.py /path/to/demo.mp4
```

This prints a `secure_url`. Paste it into `config.js` as `demoVideoSrc`.
See the comment at the top of `scripts/upload_to_cloudinary.py` for the
one-time Cloudinary setup (cloud name + an unsigned upload preset — no
API secret ever touches your phone).

## Previewing locally (Termux has Python already)

```bash
cd expressive-send
python3 run.py
```

Then open the printed `http://localhost:8000` link in a browser on the
same device. This is just for looking at the site before you deploy it —
Cloudflare Pages does not run this script; once deployed, it serves the
same HTML/CSS/JS files directly with no Python involved at all.

## Deploying to Cloudflare Pages

1. Push this folder to a GitHub repository.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Build settings: framework preset **None**, build command **(leave blank)**,
   build output directory **/** (project root).
5. Deploy. Cloudflare will give you a `*.pages.dev` URL you can share directly.

No build step, no dependencies, no server — it's plain HTML/CSS/JS the whole
way through.
