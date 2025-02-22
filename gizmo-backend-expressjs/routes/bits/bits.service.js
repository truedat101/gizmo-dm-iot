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
const fs = require('fs');
const path = require('path');

/*
[
    { id: 1, serialno="H1100500", swversion: '1.1.33', modifieddate: 'Sun, 30 Jun 2024 21:49:36 GMT'},
    { id: 2, serialno="H1100499", swversion: '1.1.32', modifieddate: 'Sun, 20 Jun 2024 21:49:36 GMT'}
];
*/
module.exports = {
    checkforupdatesbyserialno,
    downloadBitsDescriptor,
    getAllBits,
    addBits
};

async function checkforupdatesbyserialno(serialno, version) {
    console.log("Lookup bits by serialno:" + serialno + " version: " + version);
    // const user = users.find(u => u.username === username && u.password === password);

    // We can't handle a situation where serialNo is missing, so this is an exception
    if (!serialno) throw 'SerialNo is missing';
    
    // First check if device is in list of managed devices
    const device = devices.find(d => d.serialno === serialno);
    if (device) {
        if (version && version !== ",") {
            console.log("device exists and version is set");
            // If found, check that the swversion matches the passed in swversion
            //
            // Rules
            // If the version matches, then we don't need to upgrade, return empty
            // If the version doesn't match, we need an upgrade, return the swbit
            var swbit = bits.find(b => b.swversion == version);
            if (swbit && (version === device.swversion)) {
                console.log("Nothing to upgrade");
                // nothing to upgrade
                return({});
            } else {
                console.log("swbits version: " + swbit.swversion + " device swversion: " + device.swversion);
                // Find the bits for the serialno since we aren't at the current managed version
                swbit = bits.find(b => b.swversion == device.swversion);
                return (swbit);
            }
        } else {
            // If no version provided, assume we always want to update to latest available
            if (bits.length) {
                console.log("No version provided so return latest bits");
                return bits[bits.length-1];
            } else {
                console.log("No bits found in the DB (0 records)");
                return ({}); // XXX This seems like a failure
            }
        }
    } else {
        // If no managed device found, assume we always want to update to latest available
        // but only return the latest version if it is not equal the current version
        // If no version provided, assume we always want to update to latest available
        if (bits.length) {
            if (version != bits[bits.length-1].swversion) {
                return bits[bits.length-1];
            } else {
                return ({});
            }
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

async function addBits(filename,hash,version,id,url,date) {
    // TODO; update the database
    var respobj = {};
    var newrecord = {};
    var errors = [];
    /*
    { "id": 5, "swversion": "3.1.46", 
     "releasedate": "Sun, 18 Oct 2024 5:49:36 GMT", 
     "path": "https://rtxb.biz/device/39/application.bin", 
     "hash": "abcd" }
     */
    if (filename) {
        // nothing to do, use this in the url
        
    } else {
        filename = "application.bin";
    }

    if (hash) {
        newrecord["hash"] = hash;
    } else {
        errors.push("Missing hash");
    }

    if (version) {
        newrecord["swversion"] = version;
    } else {
        errors.push("Missing version");
    }

    if (id) {
        // override id
    } else {
        id = bits.length + 1;
    }

    if (url) {
        // override url
    } else {
        url = config["bitsuri"] + "/" + id + "/" + filename;
    }

    if (date) {
        // override date
    } else {
        date = (new Date()).toISOString();
    }
    
    if (errors.length == 0) {
        newrecord = {
            "id": id,
            "swversion": version,
            "releasedate": date,
            "path": url,
            "hash": hash
        };
    }
    if (errors.length > 0) {
        return {"errors": errors};
    } else {
        // Write the new bits:
        bits.push(newrecord);
        fs.writeFile(path.join(__dirname,'../../gizmobits.json'), JSON.stringify(bits), 
            err => {
                if (err) throw err;
                console.log('File has been saved!');
        });
        return newrecord;
    }
}