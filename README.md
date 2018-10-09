# GlobalTab

![GlobalTab](assets/img/icon_48.png)

New tab page showing your favorite bookmarks.

Changes your New Tab page to a useful area where you can see your favorite bookmarks categorised in panels.

**Features:**

- Extremely light, opens really fast
- Organise bookmarks in panels
- Add/edit/re-order/remove bookmarks in the extension
- Open all links in a panel in one click
- Bookmarks synchronised using browser's native bookmarks manager

## Stores

- Chrome: [https://chrome.google.com/webstore/detail/globaltab/cdedjljihjmdenpcifdbeafmjnpafplg](https://chrome.google.com/webstore/detail/globaltab/cdedjljihjmdenpcifdbeafmjnpafplg)
- Firefox: [https://addons.mozilla.org/pt-PT/firefox/addon/globaltab/](https://addons.mozilla.org/pt-PT/firefox/addon/globaltab/)

---

## Publishing

Zip the following content:

```plain
.
├── assets
│   ├── img
│   │   ├── icon_16.png
│   │   ├── icon_24.png
│   │   ├── icon_48.png
│   │   └── icon_128.png
│   ├── globaltab.js
│   ├── globaltab.min.css
│   ├── globaltab.min.js
│   └── globaltab.css
├── lib
│   └── masonry.pkgd.min.js
├── globaltab.html
├── LICENSE
└── manifest.json
```

## Changing browser

This repository contains the manifest for both Google Chrome and Firefox. To change between the two, rename to `manifest.json` the manifest of the prentended browser.
