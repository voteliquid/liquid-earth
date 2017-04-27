var postal = require('node-postal');

var testInput = 
  ['Barboncino 781 Franklin Ave, Crown Heights, Brooklyn, NY 11238',
  "80 Jones Street Affordable Housing Fund",
  "974 Market Street Project"
  ]
var addresses = testInput.map((address) =>
  postal.parser.parse_address(address)
    .filter(val => 
      true
      //val.component==="house_number" || 
      //val.component==="road"
    ))

console.log(addresses);

