# ESP32 OLED Desk Buddy - Eyes

A small desk buddy: two animated eyes on a 0.96" OLED, built on an ESP32 DevKit
and a breadboard. The eyes blink, look around, and cycle through three moods
(curious, excited, sleepy).

The same project exists in two versions, so I could compare them:

- **C++ (Arduino)** in `src/main.cpp`
- **JavaScript (Espruino)** in `espruino/eyes.js`

![The build](media/wiring-overview.jpg)

## Parts

- ESP32 DevKit (ESP-WROOM-32, 30-pin, CP2102, Micro-USB)
- 0.96" SSD1306 OLED, 128x64, I2C (address 0x3C)
- Breadboard and 4 jumper wires

## Wiring

| OLED pin | ESP32 pin | Wire color in my build |
|----------|-----------|------------------------|
| VCC      | 3V3       | orange                 |
| GND      | GND       | black                  |
| SCL      | D22       | green                  |
| SDA      | D21       | blue                   |

Close-ups: [OLED pins](media/oled-closeup.jpg) and
[ESP32 pins](media/pin-closeup.jpg).

## Running it

### C++ version

Generated with [Schematik](https://www.schematik.io/) and deployed straight
from the browser over Web Serial. Uses the Adafruit GFX and Adafruit SSD1306
libraries. The two `Serial` lines in `setup()` are optional - they print the
free heap at boot (used for the comparison below); remove them and the program
runs silently.

### Espruino (JavaScript) version

1. Flash Espruino on the ESP32: https://www.espruino.com/ESP32
2. Open the Espruino Web IDE, connect to the board, and paste
   `espruino/eyes.js` (or upload it).
3. On this firmware the code comes back by itself after a power cycle
   (verified by unplugging and replugging USB). Note: typing `save()`
   returned `Cannot save: .bootcde file already exists` on my board, yet the
   program still started on its own after replugging.

## JS vs C++: what I measured

Same board, same OLED, same eye animation logic.

| | Espruino (JS) | C++ (Arduino) |
|---|---|---|
| Free memory | 2250 blocks x 14 B = ~31.5 KB | 327,988 B = ~320 KB |
| How it's measured | `process.memory()` in the Espruino console (its own JS pool) | `ESP.getFreeHeap()` at startup (whole chip's free heap) |
| Debug loop | Type a line in the console, it runs immediately | Edit, compile, upload, watch Serial |

Careful with the memory numbers: they measure different things.
`process.memory()` reports Espruino's fixed JavaScript pool only (2649
blocks total, about 37 KB; the eyes program plus the JS runtime state used
399 blocks, about 15% of that pool, leaving 2250 blocks / 31.5 KB free
inside it). `ESP.getFreeHeap()` reports the whole chip's free heap at
startup, after the OLED was initialized. Because the scopes are different,
the two numbers are not directly comparable and I am not quoting a ratio.

My takeaways:

- For learning and small gadgets like this one, Espruino is easier: the
  console works like browser devtools, no compile-upload cycle. The eyes
  fit comfortably in its JS pool (about 15% used).
- C++ gives access to the chip's full heap and has more ready libraries.
  If I later add WiFi, sensors and graphics together, that is the safer
  foundation.
- Both versions live here, and switching is just a re-flash, so I can move
  between them any time.

Video of the eyes running: [media/eyes-running.mp4](media/eyes-running.mp4)

![Eyes running](media/eyes-running.gif)

## References

- Espruino on ESP32: https://www.espruino.com/ESP32
- Adafruit SSD1306 library: https://github.com/adafruit/Adafruit_SSD1306
- Schematik (used to generate and deploy the C++ version): https://www.schematik.io/
