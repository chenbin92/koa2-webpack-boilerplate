(function() {
  this.About = (function() {
    function About() {
      this.init();
    }

    About.prototype.init = function() {
      console.log('init about Page...');
    };

    return About;
  })();
}).call(window);
