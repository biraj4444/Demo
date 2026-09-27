#!/usr/bin/env python3
"""
Upload the demo video to Cloudinary from Termux (or any machine with Python).

Why: Cloudflare Pages works best with small repos. Rather than committing a
large .mp4 to git, this uploads it to Cloudinary and gives you back a CDN URL
to paste into assets/js/config.js as `demoVideoSrc`.

Setup (one time):
  1. Create a free account at https://cloudinary.com
  2. In the dashboard, note your "Cloud name".
  3. Go to Settings -> Upload -> Upload presets -> Add upload preset.
     Set "Signing Mode" to "Unsigned" and save. Note the preset name.
     (Unsigned presets mean you never need to store a secret key on your phone.)

Usage in Termux:
  pip install requests --break-system-packages
  export CLOUDINARY_CLOUD_NAME="your-cloud-name"
  export CLOUDINARY_UPLOAD_PRESET="your-preset-name"
  python3 scripts/upload_to_cloudinary.py path/to/demo.mp4

This prints the resulting secure_url. Copy it into config.js:
  demoVideoSrc: "https://res.cloudinary.com/.../video/upload/....mp4"
"""

import os
import sys
import json

try:
    import requests
except ImportError:
    sys.exit(
        "The 'requests' package is required.\n"
        "Install it with: pip install requests --break-system-packages"
    )


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python3 upload_to_cloudinary.py path/to/demo.mp4")

    video_path = sys.argv[1]
    if not os.path.isfile(video_path):
        sys.exit("File not found: {}".format(video_path))

    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME")
    upload_preset = os.environ.get("CLOUDINARY_UPLOAD_PRESET")

    if not cloud_name or not upload_preset:
        sys.exit(
            "Missing environment variables.\n"
            "Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET first "
            "(see the comment at the top of this script)."
        )

    url = "https://api.cloudinary.com/v1_1/{}/video/upload".format(cloud_name)

    print("Uploading {} to Cloudinary...".format(video_path))
    with open(video_path, "rb") as f:
        response = requests.post(
            url,
            data={"upload_preset": upload_preset},
            files={"file": f},
            timeout=300,
        )

    if response.status_code != 200:
        sys.exit(
            "Upload failed ({}):\n{}".format(response.status_code, response.text)
        )

    data = response.json()
    secure_url = data.get("secure_url")

    if not secure_url:
        sys.exit("Upload succeeded but no secure_url was returned:\n" + json.dumps(data, indent=2))

    print("\nUpload complete.")
    print("secure_url:", secure_url)
    print("\nNext step: paste this into assets/js/config.js as demoVideoSrc.")


if __name__ == "__main__":
    main()
