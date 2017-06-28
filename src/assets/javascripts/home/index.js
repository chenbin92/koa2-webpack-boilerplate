(function() {
  this.Home = (function() {
    function Home() {
      this.init();
    }

    Home.prototype.init = function() {
      console.log('init home Page');
    };

    return Home;
  })();
}).call(window);
