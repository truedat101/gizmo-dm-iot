const express = require('express');
const router = express.Router();
const bitsService = require('./bits.service');

/**
 * @swagger
 * tags:
 *   name: Bits
 *   description: The bits API for retrieving firmware
 */

// routes
/**
 * @swagger
 * /bits/checkforupdatesbyserialno/{serialno}/{version}:
 *  get:
 *      summary: Get the available BITS by /SERIALNO/VERSION
 *      parameters:
 *      - in: path
 *        name: serialno
 *        schema:
 *           type: string
 *        required: true
 *        description: String Serial no ID of the device to check
 *      - in: path
 *        name: version
 *        schema:
 *              type: string
 *        required: false
 *        description: String version no ID of the bits to check
 *      responses:
 *          200:
 *              description: this returns JSON for the releases available if any. Defaults to just one release, with an ID of the release, version, release date, and a hash. If the current software VERSION is not provided, the app assumes no version is installed or the user's app doesn't about the current version. If the VERSION is provided, this instructs the service on the installed version, and will return whether there is a newer version.
 */
router.get('/checkforupdatesbyserialno/:serialno/:version', checkforupdatesbyserialno);


/**
 * @swagger
 *  /bits/downloadbitsdescriptor/{bitid}:
 *  get:
 *      summary: where bitid is the identifier of the release hash or arbitrary identifier of a release. It will return the descriptor of the binary file and hash, or 404 if not found or 500 if there is a server error, or 410 if the parameter is missing. Descriptor will include binaryurl, binaryhashurl, hash, bitid, releasedate
 *      parameters:
 *      - in: path
 *        name: bitid
 *        schema:
 *           type: string
 *        required: true
 *        description: string bitid of the device to check
 *      responses:
 *          200:
 *              description: his returns JSON for the releases available if any. Defaults to just one release, with an ID of the release, version, release date, and a hash. If the current software VERSION is not provided, the app assumes no version is installed or the user's app doesn't about the current version. If the VERSION is provided, this instructs the service on the installed version, and will return whether there is a newer version.
 */
router.get('/downloadbitsdescriptor/:bitid', downloadBitsDescriptor);


/**
 * @swagger
 *  /bits/getall:
 *  get:
 *      summary: get all bits descriptors
 *      responses:
 *          200:
 *              description: his returns JSON for all of the releases available if any. Defaults to just one release, with an ID of the release, version, release date, and a hash. If the current software VERSION is not provided, the app assumes no version is installed or the user's app doesn't about the current version.
 */
router.get('/getall', getAllBits);

module.exports = router;

function checkforupdatesbyserialno(req, res, next) {
    console.log(req.params);
    bitsService.checkforupdatesbyserialno(req.params.serialno, req.params.version).then(bits => res.json(bits))
        .catch(next);
}

function downloadBitsDescriptor(req, res, next) {
    bitsService.downloadBitsDescriptor(req.params.bitid).then(bits => res.json(bits))
        .catch(next);
}

function getAllBits(req, res, next) {
    bitsService.getAllBits().then(bits => res.json(bits))
        .catch(next);
}