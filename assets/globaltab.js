/* GlobalTab - Author: Miguel Nunes */

var firefox = navigator.vendor == 'Google Inc.' ? false : true;

var colors = [
  '#168FC7',
  '#C61746',
  '#17C692',
  '#B8C617',
  '#9E17C6',
  '#C66617',
  '#9B9B9B',
  '#174FC6',
  '#4AA82B',
  '#C6177D',
  '#C14545',
];

/**
 * Returns element with certain query
 * @param {string} query
 * @return {object}
 */
function $(query) {
  return document.querySelector(query);
}

/**
 * Returns a bookmark icon
 * @param {string} url
 * @return {string}
 */
function getIcon(url) {
  if (firefox !== true) {
    return '<img src="chrome://favicon/' + url + '" width="16" height="16" alt="&#9654;">';
  } else {
    return '<img src="https://s2.googleusercontent.com/s2/favicons?domain_url=' + url + '" width="16" height="16" alt="&#9654;">';
  }
}

/**
 * Auto div placement with Masonry
 */
function formatFolders() {
  new Masonry($('.grid'), {
    columnWidth: '.grid-sizer',
    gutter: 24,
    itemSelector: '.grid-item',
    percentPosition: true,
  });
}

/**
 * List bookmarks
 * @param {object} bookmarks
 * @return {string}
 */
function listBookmarks(bookmarks) {
  var bookmarkItems = '<ul>';
  _.forEach(bookmarks, function(mark) {
    bookmarkItems += '<a href="' + mark.url + '"><li>' +
    getIcon(mark.url) + '' + mark.title + '</li></a>';
  });
  return bookmarkItems + '</ul>';
}

/**
 * List bookmark folders
 * @param {object} bookmarkFolders
 */
function listFolders(bookmarkFolders) {
  var i = 0;
  _.forOwn(bookmarkFolders.children, function(folder) {
    $('.grid').innerHTML +=
      '<div class="grid-item"><div class="title" style="border-top:4px solid ' +
      colors[i] + ';">' + folder.title +
      '<span class="all" title="Open all links">&#9656; All</span>' +
      '</div><div class="links">' +
      listBookmarks(folder.children) + '</div></div>';
    i++;
  });
  formatFolders();
  _.forEach(document.querySelectorAll('.all'), function(button) {
    button.addEventListener('click', function() {
      _.forEach(
        this.parentNode.parentNode.children[1].children[0].children,
        function(link) {
          chrome.tabs.create({
            url: link.href,
          });
        }
      );
    });
  });
}

/**
 * Add sample bookmarks
 */
function addSample() {
  chrome.bookmarks.create({
    'parentId': firefox === true ? '0' : '2', // TEST IN FIREFOX
    'title': 'GlobalTab',
  }, function(globalTabFolder) {
    chrome.bookmarks.create({
      'parentId': globalTabFolder.id,
      'title': 'Google Services',
    }, function(googleFolder) {
      chrome.bookmarks.create({
        'parentId': googleFolder.id,
        'title': 'Google Search',
        'url': 'https://www.google.com/',
      });
      chrome.bookmarks.create({
        'parentId': googleFolder.id,
        'title': 'Google Drive',
        'url': 'https://drive.google.com/',
      });
      chrome.bookmarks.create({
        'parentId': googleFolder.id,
        'title': 'Google Maps',
        'url': 'https://maps.google.com/',
      });
      chrome.bookmarks.create({
        'parentId': googleFolder.id,
        'title': 'YouTube',
        'url': 'https://www.youtube.com/',
      });
    });
    location.reload();
  });
}

/**
 * Show a welcome message when no bookmarks available
 */
function showWelcome() {
  $('.grid').innerHTML = '<div><img src="https://i.giphy.com/media/MJ0sxcBzT3mTu/giphy.webp" width="500" height="264"><h1>Woops!</h1><p>Seems like you have not configured GlobalTab with bookmarks yet!</p><p>Click <a href="#" class="sample"><b>here</b></a> to add some example folders and links.<br />These can be changed in your browser\'s bookmark manager inside the GlobalTab folder.</p><p><small>If you have synchronized your browser bookmarks, login to your account to download the synchronized data and reload this page.</small></p></div>';
  $('.sample').addEventListener('click', addSample);
}

/**
 * Get bookmarks
 */
function start() {
  chrome.bookmarks.getTree(
    function(bookmark) {
      var all = bookmark[0].children[firefox === true ? 0 : 1].children;
      var globalKey = _.findKey(all, {title: 'GlobalTab'});
      var folders = all[globalKey];
      if (globalKey !== undefined && folders.children.length > 0) {
        listFolders(folders);
      } else {
        showWelcome();
      }
    }
  );
}

document.addEventListener('DOMContentLoaded', function() {
  start();
  $('.manage').addEventListener('click', function() {
    chrome.tabs.create({
      url: 'chrome://bookmarks/', // TEST IN FIREFOX
    });
  });
});
