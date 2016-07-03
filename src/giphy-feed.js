(function () {

  this.GiphyFeed = function(options, appContainer) {
    this.appContainer = appContainer;
    this.apiKey = options.apiKey;
    this.minColumnWidth = options.minColumnWidth;
    this.searchTerm = options.searchTerm.split(' ').join('+');
    this.photoData;
    this.columns = {
      elements: [],
      heights: [],
      count: 0
    };
    this.appendedPhotos = 0;
    this.windowResizeHandler();
    this.getPhotos();
  }

  this.GiphyFeed.prototype.getPhotos = function() {
    var url = 'http://api.giphy.com/v1/gifs/search?q=' + '' + 't&api_key='+ this.apiKey + '&limit=22'
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var data = JSON.parse(xmlHttp.responseText).data
        this.displayPhotos(data);
      }
    }.bind(this);
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
  }

  this.GiphyFeed.prototype.displayPhotos = function(data) {
    if (data) { this.photoData = data; }
    this.makeColumnElements();
    for(var i = 0; i < this.photoData.length; i++) {
      var smallestColumnIndex = this.columns.heights.indexOf(Math.min.apply(Math, this.columns.heights));

      this.makePhotoElement(this.photoData[i], smallestColumnIndex);
    }
  }

  this.GiphyFeed.prototype.makeColumnElements = function() {
    this.columns.heights = [];
    this.columns.elements = [];
    this.appendedPhotos = 0;
    this.clearElements()
    var numberOfColumns = Math.floor(this.appContainer.offsetWidth / this.minColumnWidth);
    for(var i = 0; i < numberOfColumns; i++) {
      var div = document.createElement('div');
      div.className = 'column';
      div.style.width = 100 / numberOfColumns + '%';
      this.columns.elements.push(div);
      this.columns.heights.push(0);
      this.appContainer.appendChild(div);
    }
  }

  this.GiphyFeed.prototype.makePhotoElement = function(photoData, columnIndex) {
    var imageThumbnail = photoData.images.original_still;
    var imageFull = photoData.images.original;
    var caption = this.makeCaption(photoData.slug)
    var div = document.createElement('div')
    var a = document.createElement('a');
    var img = document.createElement('img');

    div.className='photo-container';
    div.appendChild(a);
    a.href = imageFull.url;
    a.title = caption;
    a.className ='pure-box';
    a.setAttribute('data-index', this.appendedPhotos++)
    a.appendChild(img);
    img.src = imageThumbnail.url;

    this.columns.heights[columnIndex] += parseInt(imageThumbnail.height);
    this.columns.elements[columnIndex].appendChild(div);
  }

  this.GiphyFeed.prototype.makeCaption = function(slug) {
    var tags = slug.split('-')
    tags = tags.slice(0, tags.length - 1);
    return tags.map(function(tag) {return '#' + tag }).join(' ')
  }

  this.GiphyFeed.prototype.clearElements = function() {
    while (this.appContainer.firstChild) {
      this.appContainer.removeChild(this.appContainer.firstChild);
    }
  }

  this.GiphyFeed.prototype.windowResizeHandler = function() {
    window.onresize = function(e) {
      var numberOfColumns = Math.floor(this.appContainer.offsetWidth / this.minColumnWidth);
      if(this.columns.count !== numberOfColumns) {
        this.columns.count = numberOfColumns;
        this.displayPhotos()
      }
    }.bind(this);
  }

}());