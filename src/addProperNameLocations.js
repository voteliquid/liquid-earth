const fetch = require('node-fetch');

//This one is build just on an inclusion list
//Proper names aren't regular enough for regex
//Number of proper name locations is likely to be tractable in the short run
function addProperNameLocations(bills, customFilter, url) {
    url = url || "https://api.liquid.vote/bills";
    customFilter = customFilter || (bill => true);
    return bills ? add(bills) : fetch(url).then(response => response.json()).then(add)

    function add(bills) {

        let inclusionList = {
            "Laguna Honda Hospital": true,
            "George R. Moscone Convention Center": true,
        }


        let billsWithProperNameLocations = bills
            .map((bill) => {
                bill["properNameLocation"] = null;
                for (let locationName in inclusionList) {
                    bill.title.includes(locationName) ? bill["properNameLocation"] = locationName : null
                }
                return bill;
            })
            .filter(customFilter);
        return billsWithProperNameLocations;
    }
}


addProperNameLocations(null, bill => bill.properNameLocation).then(bills => console.log(bills));

module.exports = addProperNameLocations;
