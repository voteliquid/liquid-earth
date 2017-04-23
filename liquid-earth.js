/**
 * @fileoverview Liquid Earth: location survey of relevant Liquid Vote agenda items.
 *
 * Usage:
 *   // Default behavior
 *   node liquid-earth.js
 *
 */

require('chromedriver');
const requestAddresses = require("./parse-addresses.js");

const {
    Builder,
    By,
    until
} = require('selenium-webdriver');

const {
  closeIntroScript,
  openPanel,
selectInput, 
toggleAll, 
fly,
topResult, 
clickTopResult, 
hideSearch, 
clearSearch, 
toggleDimension 
} = require("./webcomponent-selectors.js");

//Empty array for output
const locationData = [];
const pauseTime = 5000;

//Set up driver
var driver = new Builder()
    .forBrowser('chrome')
    .build();


//Initial get, wait for load, exit intro, and toggleAll feature layers
driver.get('https://earth.google.com/web/')
driver.sleep(10000)
    .then(() => {
        driver.executeScript(closeIntroScript);
        driver.executeScript(toggleAll);
    });


//Collect urls for app linking
function getEarthUrl(fullAddress, index, collection) {

    //we're done, store the data
    //if(locationData.length === collection.length){
    //TODO: Put the data in a useful place
    //return;
    //}

    //store the data
    driver.getCurrentUrl().then((url) => {
        locationData[index] = {
            address: fullAddress,
            earthSearchUrl: url
        }
    })
    driver.sleep(1000);
    driver.getCurrentUrl().then((url) => {
        locationData[index] = Object.assign({
                earthFoundUrl: url
            },
            locationData[index])

    })

}


//Navigate to each location
function navigate(address, index, collection) {
    let city = ', San Francisco'
    let fullAddress = address + city;

    driver.executeScript(clearSearch);
    driver.executeScript(openPanel);

    let activeElement = driver.switchTo().activeElement();

    if (!activeElement.getText() === "") {
        console.log('active element text');
        console.log(activeElement.getText());
        activeElement.clear();
    }

    driver.switchTo().activeElement().sendKeys(fullAddress, '\uE006');

    driver.sleep(1000);

    //If multiple search items, select first, hide, toggle 3d
    driver.executeScript('return ' + topResult)
        .then((result) => {
            console.log('checking if multiple items');
            if (result) {
                console.log('selecting first result, hiding and clearing...')
                driver.executeScript(clickTopResult);
                driver.executeScript(hideSearch);
                driver.sleep(5000).then(() => {
                    driver.executeScript(toggleDimension)
                });
            }

            //Loop infinitely; mediate
            if (index === collection.length - 1) {
                driver.sleep(pauseTime).then(() => {
                    console.log('starting to loop infinite')
                    collection.forEach((bill, index, collection) => {
                        let address = bill.streetAddresses[0];
                        navigate(address, index, collection)
                    });
                })
            }

        })

    //grab url, pause before next navigation
    getEarthUrl(fullAddress, index);
    driver.sleep(pauseTime);

}


function latestDate(bill) {

    return bill.date === "2017-04-25" || bill.date === "2017-04-18";
}

requestAddresses(null, latestDate).then((addresses) => {
    driver.sleep(15000);

    let seen = {};
    addresses
        .filter((bill, index, collection) => {
            let billAddress = bill.streetAddresses[0];
            return seen.hasOwnProperty(billAddress) ? false : (seen[billAddress] = true);
        })
        .sort((a, b) => {
            return new Date(a.date).getDate() > new Date(b.date).getDate() ? -1 : 1;
        })
        .forEach((bill, index, collection) => {
            let address = bill.streetAddresses[0];
            console.log(address, bill.date);
            navigate(address, index, collection)
        })
})
