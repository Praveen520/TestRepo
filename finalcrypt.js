// NodeJS implementation of crypto, I'm sure google's 
// cryptoJS would work equally well.
var crypto = require('crypto');

// The value stored in [dbo].[AspNetUsers].[PasswordHash]
var hashedPwd = "ADOEtXqGCnWCuuc5UOAVIvMVJWjANOA/LoVy0E4XCyUHIfJ7dfSY0Id+uJ20DTtG+A==";
//var hashedPwd = "WqVdgzBo+C08cPyp2/34EC0kWE5uEC3gjXoZVUFdDu8=";
var hashedPasswordBytes = new Buffer(hashedPwd, 'base64');

//var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

//var hexChar = ["0x49", "0x76", "0x61", "0x6e", "0x20", "0x4d", "0x65", "0x64", "0x76", "0x65", "0x64", "0x65", "0x76"];
var hexChar = ["73", "118", "97", "110", "32", "77", "101", "100", "118", "101", "100", "101", "118"];

var saltString = "";
var storedSubKeyString = "";

// build strings of octets for the salt and the stored key
for (var i = 1; i < hashedPasswordBytes.length; i++) {
    if (i > 0 && i <= 16) {
        saltString += hexChar[(hashedPasswordBytes[i] >> 4) & 0x0f] + hexChar[hashedPasswordBytes[i] & 0x0f]
    }
    if (i > 0 && i > 16) {
        storedSubKeyString += hexChar[(hashedPasswordBytes[i] >> 4) & 0x0f] + hexChar[hashedPasswordBytes[i] & 0x0f];
    }
}

// password provided by the user
var password = 'achutha@520';

// TODO remove debug - logging passwords in prod is considered 
// tasteless for some odd reason
console.log('cleartext: ' + password);
console.log('saltString: ' + saltString);
console.log('storedSubKeyString: ' + storedSubKeyString);

// This is where the magic happens. 
// If you are doing your own hashing, you can (and maybe should)
// perform more iterations of applying the salt and perhaps
// use a stronger hash than sha1, but if you want it to work
// with the [as of 2015] Microsoft Identity framework, keep
// these settings.
var nodeCrypto = crypto.pbkdf2Sync(new Buffer(password), new Buffer(saltString, 'hex'), 1000, 256, 'sha1');

// get a hex string of the derived bytes
var derivedKeyOctets = nodeCrypto.toString('hex').toUpperCase();

console.log("hex of derived key octets: " + derivedKeyOctets);

// The first 64 bytes of the derived key should
// match the stored sub key
if (derivedKeyOctets.indexOf(storedSubKeyString) === 0) {
    console.info("passwords match!");
} else {
    console.warn("passwords DO NOT match!");
}