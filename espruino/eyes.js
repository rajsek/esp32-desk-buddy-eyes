console.log('Hello ESP32!');
var oled;
var timer;
var started;
var lastFrame;
var heights = [34, 42, 22];
var looks = [0, -8, 0, 8];

// Rounded rectangle using Espruino graphics primitives.
function roundRect(x, y, w, h, radius) {
  var r = Math.min(radius, Math.floor(h / 2));
  oled.fillRect(x + r, y, x + w - r - 1, y + h - 1);
  oled.fillRect(x, y + r, x + w - 1, y + h - r - 1);

  if (r > 0) {
    oled.fillCircle(x + r, y + r, r);
    oled.fillCircle(x + w - r - 1, y + r, r);
    oled.fillCircle(x + r, y + h - r - 1, r);
    oled.fillCircle(x + w - r - 1, y + h - r - 1, r);
  }
}

function drawEyes() {
  var now = Math.floor((getTime() - started) * 1000);
  var mood = Math.floor(now / 4500) % 3;
  var look = looks[Math.floor(now / 750) % 4];
  var phase = now % 3000;
  var openness =
    phase < 2820 ? 3 :
    phase < 2870 ? 2 :
    phase < 2950 ? 0 : 2;

  var frame = openness === 0 ? 0 :
    1 + openness * 100 + mood * 20 + look + 8;

  if (frame === lastFrame) return;
  lastFrame = frame;

  oled.clear();
  for (var x = 16; x <= 74; x += 58) {
    var h = openness === 0 ? 3 :
      Math.floor(heights[mood] * openness / 3);
    var y = 32 - Math.floor(h / 2);

    oled.setColor(1);
    roundRect(x, y, 38, h, h < 16 ? 2 : 8);

    if (openness !== 0) {
      oled.setColor(0);
      oled.fillCircle(x + 19 + look, 32, h < 20 ? 4 : 7);
      oled.setColor(1);
      oled.setPixel(x + 17 + look, 30);
    }
  }
  oled.flip();
}

function onInit() {
  if (timer !== undefined) clearInterval(timer);

  I2C1.setup({sda: D21, scl: D22, bitrate: 400000});
  oled = require("SSD1306").connect(I2C1, function () {
    started = getTime();
    lastFrame = -1;
    drawEyes();
    timer = setInterval(drawEyes, 20);
    console.log("OLED eyes started");
  }, {width: 128, height: 64, address: 0x3C});
}

onInit();
