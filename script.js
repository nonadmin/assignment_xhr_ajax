var $ = (function(){

  var _opt;
  var _postData;
  var _xhr = new XMLHttpRequest();

  var ajax = function(opt){
    _setOpt(opt);
    _events();
    _parseData();

    _xhr.open(_opt.method, _opt.url);
    _addHeaders();
    _xhr.send(_postData);
  };

  var get = function(opt){
    opt.method = "GET";
    ajax(opt);
  };

  var post = function(opt){
    opt.method = "POST";
    ajax(opt);
  };

  var _setOpt = function(opt){
    _opt = opt;
    // setup default, blank functions to avoid callback errors
    _opt.error = _opt.error || function(){};
    _opt.success = _opt.success || function(){}; // probably should be required
    _opt.complete = _opt.complete || function(){};
  };

  var _events = function(){
    _xhr.addEventListener("load", function loadCallback(){
      // range between 200 and 300?
      if (this.status >= 200 && this.status < 300){
        _opt.success(this.response, _xhr.statusText, _xhr);
      } else {
        _opt.error(this, _xhr.status, _xhr.statusText);
      }

      _opt.complete(this, _xhr.statusText);
    }, _opt.async);
  };

  var _addHeaders = function(){ 
    for(var k in _opt.headers){
      if (_opt.headers.hasOwnProperty(k)){
        _xhr.setRequestHeader(k, _opt.headers[k]);
      }
    }
  };

  var _parseData = function(){
    if (_opt.data){
      var data = [];

      for(var k in _opt.data){
        if (_opt.data.hasOwnProperty(k)){
          data.push(encodeURIComponent(k) + "=" + encodeURIComponent(_opt.data[k]));
        }
      }
      
      if (_opt.method === 'GET'){
        _opt.url += ("?" + data.join('&'));
      } else {
        _postData = data.join('&');
      }
    }
  };

  return {
    ajax: ajax,
    get: get,
    post: post
  };

})();

var testOpts = { 
  complete: function(xhr, statusText){
    console.log('request complete!');
    console.log(statusText);
  },

  success: function(response, statusText, xhr){
    console.log("success!");
    console.log(response);
  },

  error: function(xhr, status, statusText){
    console.log("error!");
    console.log(status);
    console.log(statusText);
  },

  headers: {'blah': 1234, 'x-blah': 'foo'},
  data: {'userId': 1},

  url: "http://jsonplaceholder.typicode.com/posts",
  method: "GET",
  async: true

};

var testGetPost = {
  url: "http://jsonplaceholder.typicode.com/posts",
  data: {'userId': 1},

  success: function(response, statusText, xhr){
    console.log("success!");
    console.log(response);
  }
};