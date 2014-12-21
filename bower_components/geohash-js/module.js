var path = require('path');
var fs = require('fs');

var filedata = fs.readFileSync(path.join(__dirname,'geohash.js'),'utf8');
eval(filedata);

module.exports = {
    refine_interval: refine_interval,
    calculateAdjacent: calculateAdjacent,
    decode: decodeGeoHash,
    encode: encodeGeoHash
};
