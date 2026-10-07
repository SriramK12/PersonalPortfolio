# Personal media

`portrait.webp` is the complete owner-supplied photograph, converted to WebP with embedded metadata omitted.

`avatar.jpg` is a 480px square crop of that photograph, centered on the owner's face with no other people in frame. It is shown as a round profile picture across the site.

`photos/` holds the Activities photos listed in `content/photos.ts`. Each `<id>.jpg` is at most 1600px and each `<id>-thumb.jpg` at most 480px. Every image is re-encoded with no EXIF, GPS, camera or date metadata. `<id>.mp4` files are silent H.264 loops (Live Photo clips or short videos) with no location metadata. Map pins are placed by hand from the photo's GPS, date or the owner's description, and rounded to about 1 km. The originals are not kept in the repository.

Use owner-supplied images only. Remove embedded location metadata and provide descriptive alt text.
