/*******************************************************************************

Highcharts Export Server

Copyright (c) 2016-2022, Highsoft

Licenced under the MIT licence.

Additionally a valid Highcharts license is required for use.

See LICENSE file in root for details.

*******************************************************************************/

const puppeteer = require('puppeteer');

const users = {};
let browserPromise;

module.exports = {
  get: (id, puppeteerArgs) => {
    users[id] = true;

    puppeteerArgs = puppeteerArgs || [];
    puppeteerArgs.push('--no-sandbox');

    // Create a browser promise
    if (!browserPromise) {
      browserPromise = puppeteer.launch({
        headless: true,
        args: puppeteerArgs || []
      });
    }

    // Return a browser promise
    return browserPromise;
  },
  close: async (id) => {
    delete users[id];

    // Close the browser if there are no users left
    if (Object.keys(users).length === 0) {
      return (browserPromise = (await browserPromise).close());
    }
  }
};
