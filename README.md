# GlobalTab

![GlobalTab](assets/img/icon_128.png)

New tab page showing your favorite bookmarks.

Change your browser's New Tab page into a useful area where you can see your favorite bookmarks categorized into panels.

**Features:**

- Extremely light, opens really fast
- Bookmarks are categorized into panels
- Open all links on a panel at one click
- Bookmarks are synchronized using the browser's native bookmarks manager

## Stores

- Chrome: [https://chrome.google.com/webstore/detail/globaltab/cdedjljihjmdenpcifdbeafmjnpafplg](https://chrome.google.com/webstore/detail/globaltab/cdedjljihjmdenpcifdbeafmjnpafplg)
- Firefox: [https://addons.mozilla.org/firefox/addon/globaltab/](https://addons.mozilla.org/firefox/addon/globaltab/)

---

## Minify JS and CSS files

```
$ npm install
$ npm run gulp
```

This creates a watch for both JS and CSS source files.

## Current limitations

- Firefox doesn't provide a method of opening the Bookmarks Manager from an extension. Right now, this is only possible in the Chrome version of GlobalTab. For this reason, only Chrome shows the "MANAGE" button when hovering a category box.
