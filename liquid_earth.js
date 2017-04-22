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

const {Builder, By, until} = require('selenium-webdriver');

//A bunch of custom WebComponent selectors and actions becuse new Google Earth is built in polymer, so simple selectors are tricky
//TODO: Refactor selector actions to separate file
const closeIntroScript = "document.querySelector('earth-app').shadowRoot.querySelector('earth-balloon /deep/ paper-material paper-icon-button').click(); return true;"

const openPanel = "document.querySelector('earth-app').shadowRoot.querySelector('paper-drawer-panel div earth-toolbar').shadowRoot.querySelector('paper-material paper-icon-button#search').click();"

const selectInput = "document.querySelector('earth-app').shadowRoot.querySelector('paper-drawer-panel div earth-drawer').shadowRoot.querySelector('neon-animated-pages earth-search').shadowRoot.querySelector('paper-header-panel div earth-omnibox').shadowRoot.querySelector('paper-material div paper-input-container input')"

const toggleAll = "document.querySelectorAll('earth-app /deep/ paper-drawer-panel#drawerPanel div.layout.horizontal earth-drawer#drawerContainer /deep/ neon-animated-pages#pages earth-base-layer-styles /deep/ app-header-layout div#baseLayerStyles earth-base-layer-styles-item /deep/ div#baseLayerStylesItem earth-toggle-icon-button')[2].click()"

const fly = "document.querySelector('earth-app /deep/ paper-drawer-panel div earth-knowledge-card#knowledgeCard /deep/ neon-animated-pages#pages neon-animatable#cardStack earth-normal-card#topCard /deep/ paper-card#card paper-fab#fly').click()"

const topResult = "document.querySelector('earth-app /deep/ paper-drawer-panel#drawerPanel div earth-drawer#drawerContainer /deep/ earth-search#search /deep/ paper-header-panel div#resultsPanel div#organicResults iron-selector earth-search-result-item')"

const clickTopResult = "document.querySelector('earth-app /deep/ paper-drawer-panel#drawerPanel div earth-drawer#drawerContainer /deep/ earth-search#search /deep/ paper-header-panel div#resultsPanel div#organicResults iron-selector earth-search-result-item').click()"

const hideSearch = "document.querySelector('earth-app /deep/ paper-drawer-panel#drawerPanel div earth-drawer#drawerContainer /deep/ earth-search#search /deep/ paper-header-panel div#toolbar paper-icon-button#hideButton').click()"

const clearSearch = "document.querySelector('earth-app /deep/ paper-drawer-panel#drawerPanel div earth-drawer#drawerContainer /deep/ earth-search#search /deep/ paper-header-panel div#toolbar earth-omnibox#omnibox /deep/ paper-material#searchBox div#searchInput paper-input-container#query div#buttonDiv paper-icon-button#clearIcon').click()"

const toggleDimension = "document.querySelector('earth-app /deep/ paper-drawer-panel div div#earthRelativeElements div#earthNavigationElements earth-hover-button#hoverButton').click()"

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
  .then(() =>{
    driver.executeScript(closeIntroScript);
    driver.executeScript(toggleAll);
  });


//Collect urls for app linking
function getEarthUrl(fullAddress,index,collection) {
  
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
    locationData[index] = Object.assign(
      {earthFoundUrl: url},
      locationData[index])

  })

}


//Navigate to each location 
function navigate(address,index,collection){
  let city = ', San Francisco'
  let fullAddress = address + city;
 
  driver.executeScript(clearSearch);
  driver.executeScript(openPanel);

  let activeElement = driver.switchTo().activeElement();

  if(!activeElement.getText() === ""){
    console.log('active element text');
    console.log(activeElement.getText());
    activeElement.clear();  
  }

  driver.switchTo().activeElement().sendKeys(fullAddress, '\uE006');
 
  driver.sleep(1000);

  //If multiple search items, select first, hide, toggle 3d
  driver.executeScript('return ' + topResult)
    .then((result)=>{
      console.log('checking if multiple items');
      if(result){
        console.log('selecting first result, hiding and clearing...')
        driver.executeScript(clickTopResult);
        driver.executeScript(hideSearch);
        driver.sleep(5000).then(() => {driver.executeScript(toggleDimension)});
      }
      
      //Loop infinitely; mediate
      if(index === collection.length-1){
        driver.sleep(pauseTime).then(() => {
          console.log('starting to loop infinite')
          collection.forEach((bill,index,collection) => {
            navigate(bill.matchedStrings[0],index,collection)});
        })
      }

    })

  //grab url, pause before next navigation
  getEarthUrl(fullAddress,index); 
  driver.sleep(pauseTime);
  
}


function latestDate(bill){
  
  return bill.date === "2017-04-25" || bill.date === "2017-04-18";
}

requestAddresses(null,latestDate).then( (addresses) => {
  driver.sleep(15000);

  let seen = {};
  addresses
    .filter((bill,index,collection) => {
      let billAddress = bill.matchedStrings[0];
      return seen.hasOwnProperty(billAddress) ? false : (seen[billAddress]=true);
    })
    .sort((a,b) => {
      return new Date(a.date).getDate() > new Date(b.date).getDate() ? -1 : 1; 
    })
    .forEach( (bill,index,collection) => {
    console.log(bill.matchedStrings[0], bill.date);
    let address = bill.matchedStrings[0]; 
    navigate(address,index,collection)
  })
})

