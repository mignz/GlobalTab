# GlobalTab

![GlobalTab](assets/img/icon_48.png)

New tab page showing your favorite bookmarks.

Change your New Tab page into a useful area where you can see your favorite bookmarks categorized into panels.

**Features:**

- Extremely light, opens really fast
- Bookmarks are categorized into panels
- Add/edit/order/delete bookmarks in the extension
- Open all links on a panel at one click
- Bookmarks are synchronized using the browser's native bookmarks manager

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
