/**
 * @fileoverview Liquid Earth: location survey of relevant Liquid Vote agenda items.
 *
 * Usage:
 *   // Default behavior
 *   node liquid-earth.js
 *
 */

require('chromedriver');
const fetch = require('node-fetch');
const _ = require('lodash');
const addStreetAddressLocations = require("./src/addStreetAddressLocations.js");
const addProperNameLocations = require("./src/addProperNameLocations.js");

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
const pauseTime = 10000;

//Set up driver
var driver = new Builder()
    .forBrowser('chrome')
    .build();


//Initial get, wait for load, exit intro, and toggleAll feature layers
driver.get('https://earth.google.com/web/')
  .then(driver.sleep(10000))
  .then( _ => {
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
      //this is the initial search url
        locationData[index] = {
            address: fullAddress,
            earthSearchUrl: url
        }
    })

  //after a 1 second sleep
  //We're able to get the search result url
    driver.sleep(1000);
    driver.getCurrentUrl().then((url) => {
        locationData[index] = Object.assign({
                earthFoundUrl: url
            },
            locationData[index])

    })
  //console.log("get earth url");
  //console.log(locationData);

}


function collectGoogleEarthUrl(bill, index, collection){
    
    if(!bill.properNamelocation && !bill.streetAddresses.length){
      return null;
    }

    let city = ', San Francisco'
    let address = bill.properNameLocation || bill.streetAddresses[0];
    console.log(bill.properNameLocation, bill.streetAddresses);
    let fullAddress = address + city;


    return new Promise((accept, reject) => {
    
  //clear search, open panel, make sure search is clear, as user could edit
    driver.executeScript(clearSearch)
      .then( _ => driver.executeScript(openPanel) )
      .then( _ => { 
        let activeElement = driver.switchTo().activeElement();
        if (!activeElement.getText() === "") {
            console.log('active element text');
            console.log(activeElement.getText());
            activeElement.clear();
        }
      })
      .then( _ => driver.switchTo().activeElement().sendKeys(fullAddress, '\uE006'))
      .then( _ => console.log(`Navigating to ${fullAddress} - ${bill.title} - ${bill.date} - ${bill.streetAddresses}`))


    //collect url after we've zoomed in
  //add to bill, and return bill
      .then(driver.sleep(pauseTime - 1000))
      .then(_ => driver.getCurrentUrl())
      .then(url => bill.googleEarthUrl = {location: fullAddress, url:url})
      .then(url => accept(bill));
  })
}

//Navigate to each location
function navigate(bill, index, collection) {
    let city = ', San Francisco'
    let address = bill.properNameLocation || bill.streetAddresses[0];
    let fullAddress = address + city;


  //clear search, open panel, make sure search is clear, as user could edit
    driver.executeScript(clearSearch)
      .then( _ => driver.executeScript(openPanel) )
      .then( _ => { 
        let activeElement = driver.switchTo().activeElement();
        if (!activeElement.getText() === "") {
            console.log('active element text');
            console.log(activeElement.getText());
            activeElement.clear();
        }
      })
    

    //collect url after we've zoomed in
  //add to bill, and return bill
    return driver.switchTo().activeElement().sendKeys(fullAddress, '\uE006')
      .then(driver.sleep(pauseTime - 1000))
      .then(_ => driver.getCurrentUrl())
      .then(url => bill[googleEarthUrlurl] = url);


  //this chain is more for visual survey rather than collection
  //It gracefully highlights searches that reveal 2 locations
  //And it loops infinitely
    //If multiple search items, select first, hide, toggle 3d
    driver.executeScript('return ' + topResult)
        .then((result) => {
            console.log(`navigating to ${fullAddress}`)
            console.log(bill.title)
            console.log('checking if multiple items');
            if (result) {
                console.log('selecting first result, hiding and clearing...')
                driver.executeScript(clickTopResult);
                driver.executeScript(hideSearch);
                driver.sleep(5000).then(() => {
                    driver.executeScript(toggleDimension)
                });
            }

            //Loop infinitely; meditate on the city
            if (index === collection.length - 1) {
                driver.sleep(pauseTime).then(() => {
                    console.log('starting to loop infinite')
                    collection.forEach((bill, index, collection) => {
                      navigate(bill, index, collection)
                    });
                })
            }

        })

    //grab url, pause before next navigation
    driver.sleep(pauseTime);

}


function latestDate(bill) {
    return bill.date === "2017-04-25" || bill.date === "2017-04-18";
}
function hasLocation(bill) {
    let location = bill.streetAddresses || bill.properNameLocation;
    return location; 
}

fetch("https://api.liquid.vote/bills")
  .then( response => response.json() ) 
  .then( bills => addStreetAddressLocations(bills) )
  .then( bills => addProperNameLocations(bills) )
  //.then( bills => bills.filter(latestDate) )
  //.then( bills => bills.filter(hasLocation) )
  //.then( bills => _.uniqBy(bills, bill => location = bill.properNameLocation || bill.streetAddresses[0]))
  .then( bills => _.sortBy(bills, bill => new Date(bill.date).getDate() ))
  .then( bills => driver.sleep(20000).then( _ => bills) )
  .then( bills => {
    return bills 
        .map((bill, index, collection) => {
            //console.log(bill.streetAddresses, bill.properNameLocation, bill.date);
            return collectGoogleEarthUrl(bill, index, collection)
        })
  })
  .then( bills => Promise.all(bills)
    .then(bills => {
      console.log(bills)
    }));
