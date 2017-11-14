
let defaultOptions = {
  borderWidth: 2, 
  shadowColor: '#b4c7e7', 
  color: '#4472c4', 
  radius: 30, 
  percent: 0
};

var reqAE = function (callback) {
  return setTimeout(callback, 1000 / 60);
};

var cancelAE = function (id) {
  return clearTimeout(id);
};

function CircEaseInOut(p) {
  return ((p*=2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
}

function Linear(t) {
  return t;
}

var Tween = function(target, toAttrs, duration, ease, onUpdate, callback){
  var startTime = Date.now();
  var reqId;
  var originAttrs = Object.assign({}, target);

  function run(){
    reqId = reqAE(run);
    var percent = (Date.now() - startTime)/duration;
    if( percent >= 1 ) percent = 1;

    for(var i in toAttrs){
      target[i] = originAttrs[i] + (toAttrs[i] - originAttrs[i])*(ease||Linear)(percent);
    }

    onUpdate(percent);

    if( percent === 1 ){
      cancelAE(reqId);
      callback && callback();
    }
  }

  run();
};

var Circle = function(canvasId, options={}){
  this.context = wx.createCanvasContext(canvasId);
  this.options = Object.assign({}, defaultOptions, options);

  for(var i in this.options){
    Object.defineProperty(this, i, {
      set: function (newValue) {
        if( this.options[i] !== newValue ) {
          if( i === 'percent' ){
            Tween(this.options, {percent: newValue}, 600, Linear, this.render.bind(this));
          }
          else {
            this.options[i] = newValue;
            this.render();
          }
        }
      }
    });
  }

  this.render();
}

Circle.prototype = {
  render(){
    var context = this.context;
    var options = this.options;
    var borderWidth = options.borderWidth;
    var radius = options.radius;
    var width = radius*2 + borderWidth;
    var height = width

    context.clearRect(0, 0, width, height);

    context.setLineWidth(borderWidth);

    context.beginPath();
    context.setStrokeStyle(options.shadowColor);
    context.arc(radius + borderWidth/2, radius + borderWidth/2, radius, 0, 2 * Math.PI, false)
    context.stroke();

    context.save();
    context.beginPath();
    context.setStrokeStyle(options.color);
    context.translate(width/2, height/2);
    context.rotate(-90 * Math.PI / 180);
    context.arc(radius + borderWidth/2, radius + borderWidth/2, radius, 0, 2 * Math.PI*options.percent, false);
    context.translate(-width/2, -height/2);
    context.stroke();
    context.restore();

    context.draw();
  }
};

module.exports = Circle;