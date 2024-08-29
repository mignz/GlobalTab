/*! GlobalTab by Miguel Nunes - https://github.com/mignz/GlobalTab */

class GlobalTab {
  constructor() {
    this.browser = navigator.userAgent.indexOf('Chrome') > -1 ? 1 : 0
    this.globalTabId = -1
    this.otherBookmarksId = 'unfiled_____'
    this.dragLi = null
    const that = this
    if (this.browser === 1) {
      chrome.bookmarks.getTree(function(tree) {
        that.otherBookmarksId = tree[0].children[1].id
        that.populateBookmarks(that.otherBookmarksId)
      })
    } else {
      that.populateBookmarks(that.otherBookmarksId)
    }
  }
  launchMasonry() {
    return new MiniMasonry({
      container: '.grid',
      gutter: 0
    })
  }
  findGlobalTabId(tree) {
    for (let i = 0; i < tree.length; i++) {
      if ('GlobalTab' === tree[i].title) {
        if (tree[i].url) {
          continue
        }
        return tree[i].id
      }
    }
    return
  }
  populateBookmarks(parentId) {
    const that = this
    chrome.bookmarks.getChildren(parentId.toString(), function(generalBookmarks) {
      if (generalBookmarks === undefined) {
        alert('Unable to find "Other Bookmarks" folder with ID:' + parentId + '.')
      }
      that.globalTabId = that.findGlobalTabId(generalBookmarks)
      if (that.globalTabId !== undefined && that.globalTabId !== -1) {
        chrome.bookmarks.getChildren(that.globalTabId, function(bookmarkFolder) {
          const cbf = bookmarkFolder.length
          for (let i = 0; i < cbf; i++) {
            chrome.bookmarks.getChildren(bookmarkFolder[i].id, function(bookmarks) {
              const cb = bookmarks.length
              const items = []
              let c = 0
              for (let x = 0; x < cb; x++) {
                items.push({
                  title: bookmarks[x].title,
                  url: bookmarks[x].url,
                  id: bookmarks[x].id
                })
                c = x
              }
              if (cb > 0) {
                that.addBox(bookmarkFolder[i].title, items, bookmarks[c].parentId)
              }
              if (i == cbf - 1 && (c == cb - 1 || cb < 1)) {
                that.launchMasonry()
                that.addOpenAllEvent()
                if (that.browser === 1) {
                  that.addManageEvent()
                }
              }
            })
          }
        })
      } else {
        that.welcome()
      }
    })
  }
  addBox(title, items, parentId) {
    const gridItem = document.createElement('div')
    gridItem.className = 'box'
    const inner = document.createElement('div')
    inner.className = 'inner'
    const h1 = document.createElement('h1')
    h1.innerText = title
    h1.title = 'Open all bookmarks'
    const sm = document.createElement('div')
    if (this.browser === 1) {
      sm.className = 'button button-manage'
      sm.innerText = 'Manage'
      sm.pid = parentId
      inner.appendChild(sm)
    }
    const ul = document.createElement('ul')
    for (let i = 0; i < items.length; i++) {
      const li = document.createElement('li')
      li.bid = items[i].id
      li.title = items[i].title
      const a = document.createElement('a')
      if (items[i].title == '') {
        a.innerText = ''
        li.className = 'spacer'
      } else {
        a.appendChild(this.getFavicon(items[i].url))
        a.appendChild(document.createTextNode(items[i].title))
      }
      a.href = items[i].url
      a.bid = items[i].id
      li.appendChild(a)
      ul.appendChild(li)
    }
    inner.appendChild(h1)
    inner.appendChild(ul)
    gridItem.appendChild(inner)
    document.querySelector('.grid').appendChild(gridItem)
  }
  getFavicon(url) {
    if (this.browser === 1) {
      const iconUrl = new URL(chrome.runtime.getURL('/_favicon/'))
      iconUrl.searchParams.set('pageUrl', url)
      iconUrl.searchParams.set('size', '32')
      url = iconUrl.toString()
    } else {
      url = 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + url
    }
    const div = document.createElement('div')
    div.className = 'img'
    const img = document.createElement('img')
    img.src = url
    img.width = 16
    img.height = 16
    img.alt = '&#9737;'
    div.appendChild(img)
    return div
  }
  addOpenAllEvent() {
    const titles = document.querySelectorAll('h1')
    for (let i = 0; i < titles.length; i++) {
      titles[i].addEventListener('click', function(e) {
        for (let x = 0; x < e.target.nextSibling.children.length; x++) {
          chrome.tabs.create({
            url: e.target.nextSibling.children[x].children[0].href,
          })
        }
      }, false)
    }
  }
  addManageEvent() {
    const btns = document.querySelectorAll('.button-manage')
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        chrome.tabs.create({
          url: 'chrome://bookmarks/?id=' + Number(e.target.pid)
        })
      }, false)
    }
  }
  welcome() {
    chrome.bookmarks.create({parentId: this.otherBookmarksId, title: 'GlobalTab'}, function(gtmain) {
      chrome.bookmarks.create({parentId: gtmain.id, title: 'Google'}, function(google) {
        chrome.bookmarks.create({parentId: google.id, title: 'Google Search', url: 'https://www.google.com/'}, function() {
          chrome.bookmarks.create({parentId: google.id, title: 'Google Play', url: 'https://play.google.com/'}, function() {
            chrome.bookmarks.create({parentId: google.id, title: 'Google Maps', url: 'https://www.google.com/maps'}, function() {
              alert('Hi, welcome to GlobalTab!\n\nI have created an example bookmark panel for you.\nYou can create more bookmark panels using your browser\'s native bookmark manager by adding and organizing folders and bookmarks inside a folder called GlobalTab.')
              location.reload()
            })
          })
        })
      })
    })
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new GlobalTab()
})
