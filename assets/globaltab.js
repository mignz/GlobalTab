/*! GlobalTab by Miguel Nunes - https://github.com/mignz/GlobalTab */

class GlobalTab {
  constructor() {
    this.browser = navigator.vendor == 'Google Inc.' ? 1 : 0
    this.globalTabId = -1
    this.dragLi = null
    this.populateBookmarks(this.browser == 1 ? '2' : 'unfiled_____')
  }
  launchMasonry() {
    return new Masonry('.grid', {
      itemSelector: '.box',
      columnWidth: '.sizer',
      percentPosition: true,
    })
  }
  populateBookmarks(parentId) {
    const that = this
    chrome.bookmarks.getChildren(parentId.toString(), function(generalBookmarks) {
      if (generalBookmarks === undefined) {
        alert('Unable to find "Other Bookmarks" folder with ID:' + parentId + '.')
      }
      for (let i = 0; i < generalBookmarks.length; i++) {
        if ('GlobalTab' == generalBookmarks[i].title) {
          that.globalTabId = generalBookmarks[i].id
          break
        }
      }
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
                  id: bookmarks[x].id,
                })
                c = x
              }
              that.addBox(bookmarkFolder[i].title, items, bookmarks[c].parentId)
              if (i == cbf - 1 && c == cb - 1) {
                that.launchMasonry()
                that.addEvents()
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
    const griditem = document.createElement('div')
    griditem.className = 'box'
    const inner = document.createElement('div')
    inner.className = 'inner'
    const h1 = document.createElement('h1')
    h1.innerHTML = title
    h1.title = 'Open all links'
    const sa = document.createElement('div')
    sa.className = 'button button-add'
    sa.innerHTML = 'ADD'
    sa.pid = parentId
    inner.appendChild(sa)
    const ul = document.createElement('ul')
    for (let i = 0; i < items.length; i++) {
      let li = document.createElement('li')
      li.bid = items[i].id
      li.draggable = true
      let a = document.createElement('a')
      if (items[i].title == '') {
        a.innerHTML = ''
        li.className = 'spacer'
      } else {
        a.innerHTML = this.getIcon(items[i].url) + ' ' + items[i].title
      }
      a.href = items[i].url
      a.bid = items[i].id
      let st = document.createElement('span')
      st.className = 'button button-trash'
      st.innerHTML = 'TRASH'
      st.title = 'Remove'
      let se = document.createElement('span')
      se.className = 'button button-edit'
      se.innerHTML = 'EDIT'
      se.title = 'Edit'
      a.appendChild(st)
      a.appendChild(se)
      li.appendChild(a)
      ul.appendChild(li)
    }
    inner.appendChild(h1)
    inner.appendChild(ul)
    griditem.appendChild(inner)
    document.querySelector('.grid').appendChild(griditem)
  }
  getIcon(url) {
    if (this.browser == 1) {
      const iconUrl = new URL(chrome.runtime.getURL('/_favicon/'))
      iconUrl.searchParams.set('pageUrl', url)
      iconUrl.searchParams.set('size', '32')
      url = iconUrl.toString()
    } else {
      url = 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + url
    }
    return '<div class="img"><img src="' + url + '" width="16" height="16" alt="&#9737;"></div>';
  }
  addEvents() {
    this.addOpenAllEvent()
    this.addAddEvent()
    this.addEditEvent()
    this.addRemoveEvent()
    this.addDragEvents()
  }
  addOpenAllEvent() {
    const btns = document.querySelectorAll('h1')
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function(e) {
        for (let x = 0; x < e.target.nextSibling.children.length; x++) {
          chrome.tabs.create({
            url: e.target.nextSibling.children[x].children[0].href,
          });
        }
      }, false)
    }
  }
  addAddEvent() {
    const btns = document.querySelectorAll('.button-add')
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', this.handleAddEvent, false)
    }
  }
  handleAddEvent(e) {
    e.preventDefault()
    const newTitle = prompt('Bookmark Title')
    const newUrl = prompt('Address', 'https://')
    if (newTitle != null && newTitle != '' && newUrl != '') {
      chrome.bookmarks.create({
        parentId: e.target.pid,
        title: newTitle,
        url: newUrl,
      }, function() {
        location.reload()
      })
    } else {
      alert('Empty or invalid title or URL.')
    }
  }
  addEditEvent() {
    const btns = document.querySelectorAll('.button-edit')
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', this.handleEditEvent, false)
    }
  }
  handleEditEvent(e) {
    e.preventDefault()
    chrome.bookmarks.get(e.target.parentNode.bid, function(bookmark) {
      const newTitle = prompt('Bookmark Title', bookmark[0].title)
      const newUrl = prompt('Address', bookmark[0].url)
      if (newTitle != '' && newUrl != '') {
        chrome.bookmarks.update(e.target.parentNode.bid, {title: newTitle, url: newUrl}, function() {
          location.reload()
        })
      } else {
        alert('You didn\'t fill the title or URL.')
      }
    })
  }
  addRemoveEvent() {
    const btns = document.querySelectorAll('.button-trash')
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', this.handleRemoveEvent, false)
    }
  }
  handleRemoveEvent(e) {
    e.preventDefault()
    if (confirm('Remove the bookmark?')) {
      chrome.bookmarks.remove(e.target.parentNode.bid, function() {
        location.reload()
      })
    }
  }
  addDragEvents() {
    const that = this
    const lis = document.querySelectorAll('li')
    for (let i = 0; i < lis.length; i++) {
      lis[i].addEventListener('dragstart', function(e) {
        if (that.browser != 1) {
          e.dataTransfer.setData('Text', null);
        }
        e.target.style.opacity = '.3'
        that.dragLi = e.target
      }, false)
      lis[i].addEventListener('dragenter', function(e) {
        e.target.classList.add('over')
      }, false)
      lis[i].addEventListener('dragover', function(e) {
        if (e.preventDefault) {
          e.preventDefault()
        }
        e.dataTransfer.dropEffect = 'move'
      }, false)
      lis[i].addEventListener('dragleave', function(e) {
        e.target.classList.remove('over')
      }, false)
      lis[i].addEventListener('drop', function(e) {
        e.preventDefault()
        if (e.stopPropagation) {
          e.stopPropagation()
        }
        if (that.dragLi != e.target) {
          chrome.bookmarks.get(e.target.bid, function(n) {
            chrome.bookmarks.get(that.dragLi.bid, function(o) {
              let newIndex = n[0].index
              if (n[0].parentId == o[0].parentId && n[0].index > o[0].index && that.browser != 1) {
                newIndex += 1
              }
              chrome.bookmarks.move(o[0].id, {parentId: n[0].parentId, index: newIndex}, function() {
                location.reload()
              })
            })
          })
        }
        return false
      }, false)
      lis[i].addEventListener('dragend', function(e) {
        e.preventDefault()
        e.stopPropagation()
        e.target.style.opacity = '1'
      }, false)
    }
  }
  welcome() {
    chrome.bookmarks.create({parentId: this.browser == 1 ? '2' : 'unfiled_____', title: 'GlobalTab'}, function(gtmain) {
      chrome.bookmarks.create({parentId: gtmain.id, title: 'Google'}, function(google) {
        chrome.bookmarks.create({parentId: google.id, title: 'Google Search', url: 'https://www.google.com/'}, function() {
          chrome.bookmarks.create({parentId: google.id, title: 'Google Play', url: 'https://play.google.com/'}, function() {
            chrome.bookmarks.create({parentId: google.id, title: 'Google Maps', url: 'https://www.google.com/maps'}, function() {
              alert('Welcome to GlobalTab!\n\nWe have created an example bookmark panel for you.\nYou can create more bookmark panels using your browser\'s native bookmark manager.\nAdd and organise folders inside GlobalTab.')
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
