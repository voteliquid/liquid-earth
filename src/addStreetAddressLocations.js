const fetch = require('node-fetch');
//const postal = require('node-postal');

//digits followed by any number of capitalized words
const reStreetAddress = /\d+\s([A-Z][a-zA-Z]*\s*)+/g;

function addAddresses(bills, url) {
    url = url || "https://api.liquid.vote/bills";
    return bills ? add(bills) : fetch(url).then(response => response.json()).then(add)

    function add(bills) {

        let billsWithAddresses = bills
            .map((bill) => {
                let matchedStrings = bill.title.match(reStreetAddress);
                bill["streetAddresses"] = matchedStrings;
                return bill;
            })
            .filter((bill) => {
                //console.log(bill);
                return bill.streetAddresses;
            })
            .filter((matchedBill) => {
                let exclusionTerms = {
                    "2013 Code": true,
                    "2016 Election": true,
                    "2017 Emergency Preparedness Grants": true,
                    "2017 Budget": true,
                    "2017 Taxi": true,
                    "02 Credit": true,
                    "Annual Base Rent": true,
                    "2017 Calendar Year": true,
                    "2004 Calendar Year": true,
                    "2012 MOE": true,
                    "2004 Trust": true,
                    "2016 Edition": true,
                    "Initial Annual Base Rent": true,
                    "000 Payment": true,
                    "2016 Issuance Water":true,
                    "2011 Lease":true,
                    "2004 Trust": true,
                    "098 Settlement": true,
                    "156 Hertz Corporation": true,
                    "60 Days": true,


                };

                let excludedMatches = matchedBill.streetAddresses.filter((string) => {

                    let hasMatched = false;
                    for (let key in exclusionTerms) {

                        hasMatched = string.includes(key);
                        if (hasMatched) {
                            return !hasMatched;
                        }
                    }

                    return !hasMatched;
                });

                //if any addresses remain in the array
                //then that bill contains a valid address
                return excludedMatches.length;

            })

        return billsWithAddresses
    }
}
//addAddresses(null, bill => bill.streetAddresses).then(bills => console.log(bills));

module.exports = addAddresses;
