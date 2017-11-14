/* GlobalTab - Author: Miguel Nunes */

const colors = [
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
 * @param {*} query
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
  return '<img src="chrome://favicon/' + url + '" width="16" height="16" alt="">';
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
  let bookmarkItems = '<ul>';
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
  let i = 0;
  _.forOwn(bookmarkFolders.children, function(folder) {
    $('.grid').innerHTML +=
      '<div class="grid-item"><div class="title" style="border-top:4px solid ' +
      colors[i] + ';">' + folder.title +
      '<span class="all">&and;&angrt;&angrt;</span></div><div class="links">' +
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
 * Get bookmarks
 */
function start() {
  chrome.bookmarks.getTree(
    function(bookmark) {
      const allBookmarks = bookmark[0].children[1].children;
      const globalKey = _.findKey(allBookmarks, {title: 'GlobalTab'});
      const bookmarkFolders = allBookmarks[globalKey];
      listFolders(bookmarkFolders);
    }
  );
}

document.addEventListener('DOMContentLoaded', function() {
  start();
});
