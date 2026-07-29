#!/usr/bin/env python3
"""
Instagram gonderi gorselini indirir, 4:3 (veya istenen oranda) kirpar ve
assets/img/ altina kaydeder.

Instagram, giris yapmamis tarayicilara gorsel vermez; ancak gonderi
kalici baglantilari baglanti onizlemesi (link unfurl) tarayicilarina
og:image etiketini hala sunar. Bu betik onu kullanir.

Kullanim
--------
    python tools/ig-photo.py <instagram-post-url> <cikti-adi> [--ratio 4:3]

Ornek
-----
    python tools/ig-photo.py https://www.instagram.com/p/ABC123/ models/gts-super-300
    python tools/ig-photo.py https://www.instagram.com/p/XYZ789/ hero --ratio 5:4

Gereksinim: Pillow  (pip install Pillow)

Sinirlar
--------
* og:image en fazla 640 px kenar sunar; buyuk baski isleri icin yetmez.
* Reel/video gonderilerinin kapaginda oynat dugmesi gomulu gelir.
  Site icin normal fotograf gonderilerini tercih edin.
* Yalnizca kullanim hakkina sahip oldugunuz gorsellerle kullanin.
"""
import argparse
import html
import pathlib
import re
import sys
import urllib.request

# Baglanti onizlemesi tarayicisi: og:image'i doner.
CRAWLER_UA = ("facebookexternalhit/1.1 "
              "(+http://www.facebook.com/externalhit_uatext.php)")
ASSETS = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img"


def fetch(url, ua, timeout=60):
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    return urllib.request.urlopen(req, timeout=timeout).read()


def og_image_url(post_url):
    page = fetch(post_url, CRAWLER_UA).decode("utf-8", "ignore")
    m = re.search(r'<meta property="og:image" content="([^"]+)"', page)
    if not m:
        raise SystemExit(
            "og:image bulunamadi. Gonderi gizli/silinmis olabilir ya da "
            "Instagram bu baglantiyi onizlemeye kapatmis olabilir."
        )
    return html.unescape(m.group(1))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url", help="https://www.instagram.com/p/XXXX/")
    ap.add_argument("name", help="cikti adi, orn. models/gts-super-300")
    ap.add_argument("--ratio", default="4:3", help="en:boy, varsayilan 4:3")
    ap.add_argument("--width", type=int, default=1200, help="cikti genisligi")
    args = ap.parse_args()

    try:
        from PIL import Image
    except ImportError:
        raise SystemExit("Pillow gerekli:  pip install Pillow")

    rw, rh = (int(x) for x in args.ratio.split(":"))

    img_url = og_image_url(args.url)
    print("kaynak :", img_url.split("?")[0])

    tmp = ASSETS / ".ig-tmp"
    tmp.write_bytes(fetch(img_url, "Mozilla/5.0"))
    im = Image.open(tmp).convert("RGB")
    print("indirildi:", im.size)

    # Merkezden istenen orana kirp
    target = rw / rh
    w, h = im.size
    if w / h > target:
        nw = int(h * target)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))

    out_w = args.width
    im = im.resize((out_w, round(out_w * rh / rw)), Image.LANCZOS)

    dst = ASSETS / (args.name + ".jpg")
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, quality=82, optimize=True, progressive=True)
    tmp.unlink(missing_ok=True)

    kb = dst.stat().st_size / 1024
    print(f"yazildi: {dst.relative_to(ASSETS.parent.parent)}  "
          f"{im.size[0]}x{im.size[1]}  {kb:.0f} KB")
    if kb > 300:
        print("uyari: 300 KB ustu; --width degerini dusurmeyi dusunun.")


if __name__ == "__main__":
    sys.exit(main())
