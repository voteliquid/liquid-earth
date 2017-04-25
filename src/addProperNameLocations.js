const fetch = require('node-fetch');

//This one is build just on an inclusion list
//Proper names aren't regular enough for regex
//Number of proper name locations is likely to be tractable in the short run
function addProperNameLocations(bills, customFilter, url) {
    url = url || "https://api.liquid.vote/bills";
    customFilter = customFilter || (bill => true);
    return bills ? add(bills,customFilter) : fetch(url).then(response => response.json()).then(bills => {return add(bills,customFilter)})

    function add(bills,customFilter) {

      //to get a referenceable single location URL
      //certain location searches work better than others
      //ex. "Moscone Center" works better than "George R. Moscone Convention Center"
      //The former goes to a single correct location
      //The later also matches to an elementary school
      //Use the value associated with the key as the search term
        let inclusionList = {
            "Laguna Honda Hospital": "Laguna Honda Hospital",
            "George R. Moscone Convention Center": "Moscone Center",
        }


        let billsWithProperNameLocations = bills
            .map((bill) => {
                bill["properNameLocation"] = null;
                for (let locationName in inclusionList) {
                    bill.title.includes(locationName) ? bill["properNameLocation"] = inclusionList[locationName] : null
                }
                return bill;
            })
            .filter(customFilter);

        return billsWithProperNameLocations;
    }
}


//addProperNameLocations(null, bill => bill.properNameLocation).then(bills => console.log(bills));

module.exports = addProperNameLocations;
