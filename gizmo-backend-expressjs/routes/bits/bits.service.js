const config = require('../../config.json');
// const jwt = require('jsonwebtoken');

// XXX TODO: replace with DB
// XXX TODO: hotreload
// bits and devices hardcoded for simplicity, store in a db for production applications
const bits = require('../../gizmobits.json');
//                                      UTC
// serial number - bitid - swversion - release date timestamp - uripath to binary file name, hash of binary
/*
[
    { id: 1, swversion: '1.1.32', releasedate: 'Sun, 20 Jun 2024 21:49:36 GMT', path: 'https://razortooth.biz/device/2/application.bin', hash: '9d7998d8ece845bc33b726f6f895338d69c74e0e3cecbeecbe356a1823ddd580' },
    { id: 2, swversion: '1.1.33', releasedate: 'Sun, 30 Jun 2024 21:49:36 GMT', path: 'https://razortooth.biz/device/1/application.bin', hash: '4c768cdb6505dbb591ad6db8f0d00bb909e3a41814c89c59f6c7edebf1ad1cc7' }
];
*/

const devices = require('../../gizmodevices.json');
/*
[
    { id: 1, serialno="H1100500", swversion: '1.1.33', modifieddate: 'Sun, 30 Jun 2024 21:49:36 GMT'},
    { id: 2, serialno="H1100499", swversion: '1.1.32', modifieddate: 'Sun, 20 Jun 2024 21:49:36 GMT'}
];
*/
module.exports = {
    checkforupdatesbyserialno,
    downloadBitsDescriptor,
    getAllBits
};

async function checkforupdatesbyserialno(serialno, version) {
    console.log("Lookup bits by serialno:", serialno)
    // const user = users.find(u => u.username === username && u.password === password);

    // We can't handle a situation where serialNo is missing, so this is an exception
    if (!serialno) throw 'SerialNo is missing';
    
    // First check if device is in list of managed devices
    const device = devices.find(d => d.serialno === serialno);
    if (device) {
        if (version && version !== ",") {
            // If found, check that the swversion matches the passed in swversion
            //
            // Rules
            // If the version matches, then we don't need to upgrade, return empty
            // If the version doesn't match, we need an upgrade, return the swbit
            var swbit = bits.find(b => b.swversion == version);
            if (swbit) {
                // nothing to upgrade
                return({});
            } else {
                // Find the bits for the serialno since we aren't at the current managed version
                swbit = bits.find(b => b.swversion == device.swversion);
                return ({});
            }
        } else {
            // If no version provided, assume we always want to update to latest available
            if (bits.length) {
                return bits[bits.length-1];
            } else {
                return ({}); // XXX This seems like a failure
            }
        }
    } else {
        // If no managed device found, assume we always want to update to latest available
        // If no version provided, assume we always want to update to latest available
        if (bits.length) {
            return bits[bits.length-1];
        } else {
            return ({}); // XXX This seems like a failure
        }
    }
}

async function downloadBitsDescriptor(bitid) {
    if (bitid) {
        const swbit = bits.find(b => b.id == bitid);
        if (swbit) {
            return (swbit);
        } return({});
    } else {
        return({});
    }
}

async function getAllBits() {
    return bits;
}