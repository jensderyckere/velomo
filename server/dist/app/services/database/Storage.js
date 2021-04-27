"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const sharp_1 = __importDefault(require("sharp"));
const stream_1 = __importDefault(require("stream"));
const fs_1 = __importDefault(require("fs"));
const xml_js_1 = __importDefault(require("xml-js"));
const moment_1 = __importDefault(require("moment"));
require("moment/locale/nl-be");
const utils_1 = require("../../utils");
;
const calculate = new utils_1.Calculator();
class Storage {
    constructor() {
        this.uploadGPX = async (req, res, next) => {
            try {
                const input = req.file.buffer;
                fs_1.default.readFile(input, (e, data) => {
                    const xml = e.path;
                    const result = xml_js_1.default.xml2json(xml);
                    const resultInJson = JSON.parse(result);
                    const coordinates = resultInJson.elements[0].elements[1].elements[2].elements;
                    let arrayOfSpeed = [];
                    let arrayOfCheckpoints = [];
                    let numberOfSpeed = 0;
                    let numberOfDistance = 0;
                    let numberOfSeconds = 0;
                    for (let i = 0; i < coordinates.length; i++) {
                        if (coordinates[i + 1]) {
                            const distanceBetween = calculate.calculateDistanceBetween(coordinates[i].attributes.lat, coordinates[i].attributes.lon, coordinates[i + 1].attributes.lat, coordinates[i + 1].attributes.lon);
                            numberOfDistance = numberOfDistance + distanceBetween;
                            const timeBetween = (Date.parse(coordinates[i + 1].elements[1].elements[0].text) - Date.parse(coordinates[i].elements[1].elements[0].text)) / 1000;
                            numberOfSeconds += timeBetween;
                            const speed_mph = distanceBetween / timeBetween;
                            const speed_kph = (speed_mph * 3600) / 1000;
                            numberOfSpeed = numberOfSpeed + speed_kph;
                            arrayOfSpeed.push(speed_kph);
                            const object = {
                                "lat": coordinates[i].attributes.lat,
                                "lon": coordinates[i].attributes.lon,
                                "speedBetween": speed_kph,
                                "distanceBetween": distanceBetween,
                            };
                            arrayOfCheckpoints.push(object);
                        }
                        ;
                    }
                    ;
                    const totalDuration = moment_1.default.utc(moment_1.default.duration(numberOfSeconds, 'seconds').as('milliseconds')).format('HH:mm:ss');
                    const totalDistance = numberOfDistance / 1000;
                    const avgSpeed = numberOfSpeed / arrayOfSpeed.length;
                    const activity = {
                        "total_distance": totalDistance,
                        "total_duration": totalDuration,
                        "avg_speed": avgSpeed,
                        "starting_time": coordinates[0].elements[1].elements[0].text,
                        "checkpoints": arrayOfCheckpoints,
                    };
                    req.body.object = activity;
                    next();
                });
            }
            catch (e) {
                next();
            }
            ;
        };
        this.uploadAvatar = async (req, res, next) => {
            try {
                const input = req.file;
                if (!input)
                    return res.status(404).json({
                        message: "Bestand kon niet gevonden worden",
                        redirect: false,
                        status: 404,
                    });
                const dimensionX = (req.body.width && parseInt(req.body.width) <= 600) ? parseInt(req.body.width) : 600;
                const dimensionY = (req.body.height && parseInt(req.body.height) <= 600) ? parseInt(req.body.height) : 600;
                if (dimensionX !== dimensionY)
                    return res.status(400).json({
                        message: "Afmeting zijn niet toepasbaar voor het uploaden",
                        redirect: false,
                        status: 400,
                    });
                crypto_1.default.randomBytes(16, (e, buf) => {
                    sharp_1.default(input.buffer).resize(dimensionX, dimensionY, {
                        fit: 'cover'
                    }).toFormat('jpeg').jpeg({
                        quality: 80
                    }).toBuffer((e, data, info) => {
                        const name = buf.toString('hex') + path_1.default.extname(input.originalname);
                        const bufStream = new stream_1.default.PassThrough();
                        bufStream.end(data);
                        bufStream.pipe(this.bucket.openUploadStream(name).on('error', (err) => {
                            console.log('Error while uploading');
                            return res.status(500).json({
                                message: "Afbeeldingen kon niet worden upgeload",
                                redirect: false,
                                status: 500,
                            });
                        }).on('finish', () => {
                            req.file.filename = name;
                            next();
                        }));
                    });
                });
            }
            catch (e) {
                next(e);
            }
            ;
        };
        this.uploadVideo = async (req, res, next) => {
            try {
                const input = req.file;
                if (!input)
                    return res.status(404).json({
                        message: "Bestand kon niet gevonden worden",
                        redirect: false,
                        status: 404,
                    });
                crypto_1.default.randomBytes(16, async (e, buf) => {
                    const name = buf.toString('hex') + path_1.default.extname(input.originalname);
                    const bufferstream = new stream_1.default.PassThrough();
                    bufferstream.end(input.buffer);
                    bufferstream.pipe(this.bucket.openUploadStream(name).on('error', (error) => {
                        return res.status(500).json({
                            'error': 'Upload niet gelukt',
                        });
                    }).on('finish', () => {
                        req.file.filename = name;
                        next();
                    }));
                });
            }
            catch (e) {
                next(e);
            }
            ;
        };
    }
    initStream(bucketName) {
        if (mongoose_1.default.connection.readyState === 1) {
            this.bucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db, {
                bucketName: bucketName,
            });
            console.log('Stream initialized');
        }
        else {
            console.log('Stream not initialized');
        }
        ;
    }
    ;
    pipeAvatar(req, res) {
        this.bucket.find({
            filename: req.params.avatar
        }).toArray((e, files) => {
            if (!files || files.length === 0)
                return res.status(404).json({
                    message: "Deze afbeelding bestaat niet",
                    redirect: false,
                    status: 404,
                });
            this.bucket.openDownloadStreamByName(req.params.avatar).pipe(res);
        });
    }
    ;
    pipeVideo(req, res) {
        this.bucket.find({
            filename: req.params.video
        }).toArray((e, files) => {
            if (!files || files.length === 0)
                return res.status(404).json({
                    message: "Deze video bestaat niet",
                    redirect: false,
                    status: 404,
                });
            this.bucket.openDownloadStreamByName(req.params.video).pipe(res);
        });
    }
    ;
}
;
exports.default = new Storage();
//# sourceMappingURL=Storage.js.map