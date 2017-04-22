# liquid-earth
Tools for putting liquid votes in spatial context

![](https://github.com/liquidvote/liquid-earth/blob/master/LiquidEarthLoop.gif)

### Dependencies

Requires selenium, see https://www.npmjs.com/package/selenium-webdriver for basic setup.

Also experimentally uses libpostal, see https://github.com/openvenues/libpostal if you run into errors regarding libpostal.

### Development

On your first time:

```
git clone https://github.com/liquidvote/liquid-earth.git
cd liquid-earth
npm install
```

Then whenever you want to develop in the iOS simulator:

```
node liquid-earth.js
```

This should fire up an instance of chrome, and start navigating to addresses of liquid agenda items.

