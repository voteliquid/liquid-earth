const fetch = require('node-fetch');
//const postal = require('node-postal');

//digits followed by any number of capitalized words
const reStreetAddress = /\d+\s([A-Z][a-zA-Z]*\s*)+/g;

function addAddresses(bills, url) {
  url = url || "https://api.liquid.vote/bills";
  return bills ? add(bills) : fetch(url).then(response => response.json()).then(add)

  function add(bills) {

    return bills
      .map((bill) => {
        let matchedStrings = bill.title.match(reStreetAddress);
        bill["streetAddresses"] = matchedStrings || [];

        let exclusionTerms = {
          "2004 Trust": true,
          "2004 Calendar Year": true,
          "2011 Lease": true,
          "2012 MOE": true,
          "2013 Code": true,
          "2016 Election": true,
          "2016 Issuance Water": true,
          "2016 Edition": true,
          "2016 Housing Opportunities": true,
          "2016 Proposition": true,
          "2017 Emergency Preparedness Grants": true,
          "2017 Budget": true,
          "2017 Taxi": true,
          "2017 Calendar Year": true,
          "02 Credit": true,
          "Annual Base Rent": true,
          "Initial Annual Base Rent": true,
          "000 Payment": true,
          "098 Settlement": true,
          "156 Hertz Corporation": true,
          "60 Days": true,
          "Estimated Total Rent": true,
          "365 Subscription Service": true,
        };

        if(!bill.streetAddresses) return bill;

        let excludedMatches = bill.streetAddresses
          .filter((string) => {
            
            let hasMatched = false;
            for (let key in exclusionTerms) {
              //console.log(string, key)
              hasMatched = string.includes(key);
              if (hasMatched) {
                return !hasMatched;
              }
            }

            return !hasMatched;
          });
        bill.streetAddresses = excludedMatches;
        return bill;

      })
  }
}
//addAddresses(null).then(bills => bills.forEach(bill => console.log(bill.streetAddresses)));
module.exports = addAddresses;
