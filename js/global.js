var RadioAtanPlayer = {
  background: null,
  actions: null,
  player: null,
  controlbar: null,
  counterMin: 0,
  counterMax: 10,
  intervalId: 0,
  streamUrl: 'http://146.185.253.127:8000',
  dataUrl: 'http://146.185.253.127:8000',
  elCurrentPlaying: null,
  currentData: null,
  xhr: null,
  musicTitle: null,
  artistTitle: null,
  albumCover: null,
  requestTimer: null,

  init: function(){
    this.background = chrome.extension.getBackgroundPage();
    this.actions = chrome.browserAction;
    this.player = this.background.document.getElementById('rjplayer');
    this.wrapper = document.getElementById('main');
    this.controlbar = document.getElementById('controls');
    this.elCurrentPlaying = document.getElementById('playing-info');
    this.artistTitle = document.getElementById('artist-title');
    this.musicTitle = document.getElementById('music-title');
    this.albumCover = document.getElementById('album-cover');

    this.wrapper.onclick = function(e){
      e.preventDefault();
      RadioAtanPlayer.changeState.call(RadioAtanPlayer);
    };

    if(this.requestTimer){
      clearTimeout(this.requestTimer);
    }

    this.getCurrentData();

    this.setClass();

    this.initGA();
  },
  play: function(){
    this.player.setAttribute('src', this.streamUrl);
    this.player.play();
  },
  pause: function(){
    this.player.pause();
    this.player.setAttribute('src', null);
  },
  changeState: function(){
    if(this.player.paused){
      this.play();
    }
    else{
      this.pause();
    }
    this.setClass();
  },
  setClass: function(){
    if(this.player.paused){
      this.controlbar.className = "play";
    }
    else{
      this.controlbar.className = "pause";
    }
  },
  getCurrentData: function(){
    this.xhr = new XMLHttpRequest();
    this.xhr.onreadystatechange = this.onCurrentDataCallback;
    this.xhr.open("GET", this.dataUrl, true);
    this.xhr.send();
  },
  onCurrentDataCallback: function(currentData){
    var that = RadioAtanPlayer;
    clearTimeout(this.requestTimer);

    if (that.xhr.readyState == 4) {
      that.currentData = JSON.parse(RadioAtanPlayer.xhr.responseText);
      if(typeof(that.currentData) !== 'undefined' && typeof(that.currentData['data']) !== "undefined"){
        that.artistTitle.innerHTML = that.currentData.data.artist;
        that.musicTitle.innerHTML = that.currentData.data.song;
        if(that.currentData.data.photo) {
          if(that.currentData.data.photo.indexOf('?size=') > 0) {
            that.albumCover.style.background = '#000 url(' + that.currentData.data.photo.split('=')[0] + '=300) no-repeat top left';
          }
          else {
            that.clearCover();
          }
        }
        else {
          that.clearCover();
        }
      }
    }

    this.requestTimer = setTimeout(function() {
      that.getCurrentData.call(that);
    }, 30000);
  },
  clearCover: function(){
    this.albumCover.style.background = '#000 url(img/default-album-cover.jpg) no-repeat top left';
  },
  initGA: function(){
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-21818136-7']);
    _gaq.push(['_trackPageview']);
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  }
};
RadioAtanPlayer.init();
