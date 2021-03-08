import {
  default as mongoose
} from "mongoose";

import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  default as path
} from "path";

import {
  default as crypto
} from "crypto";

import {
  default as sharp
} from "sharp";

import {
  default as stream
} from "stream";

import {
  default as fs
} from "fs";

import {
  default as converter
} from "xml-js";

import {
  default as Moment
} from "moment";

import 'moment/locale/nl-be';

import {
  Calculator
} from "../../utils";

interface MulterRequest extends Request {
  file: any;
};

const calculate = new Calculator();

class Storage {
  private bucket: any;

  public initStream(bucketName: string) {
    if (mongoose.connection.readyState === 1) {
      this.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: bucketName,
      });

      console.log('Stream initialized');
    } else {
      console.log('Stream not initialized');
    };
  };

  public uploadGPX = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      const input = req.file.buffer;

      fs.readFile(input, (e: any, data: any) => {
        const xml = e.path;
        const result = converter.xml2json(xml);
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
          };
        };

        const totalDuration = Moment.utc(Moment.duration(numberOfSeconds, 'seconds').as('milliseconds')).format('HH:mm:ss');
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
    } catch (e) {
      next();
    };
  };

  public uploadAvatar = async (req: MulterRequest, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const input = req.file;
      if (!input) return res.status(404).json({
        message: "Bestand kon niet gevonden worden",
        redirect: false,
        status: 404,
      });

      const dimensionX = (req.body.width && parseInt(req.body.width) <= 600) ? parseInt(req.body.width) : 600;
      const dimensionY = (req.body.height && parseInt(req.body.height) <= 600) ? parseInt(req.body.height) : 600;

      if (dimensionX !== dimensionY) return res.status(400).json({
        message: "Afmeting zijn niet toepasbaar voor het uploaden",
        redirect: false,
        status: 400,
      });

      crypto.randomBytes(16, (e, buf) => {
        sharp(input.buffer).resize(dimensionX, dimensionY, {
          fit: 'cover'
        }).toFormat('jpeg').jpeg({
          quality: 80
        }).toBuffer((e: any, data: any, info: any) => {
          const name = buf.toString('hex') + path.extname(input.originalname);
          const bufStream = new stream.PassThrough();

          bufStream.end(data);
          bufStream.pipe(this.bucket.openUploadStream(name).on('error', (err: any) => {
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
    } catch (e) {
      next(e);
    };
  };

  public uploadVideo = async (req: MulterRequest, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const input = req.file;

      if (!input) return res.status(404).json({
        message: "Bestand kon niet gevonden worden",
        redirect: false,
        status: 404,
      });

      crypto.randomBytes(16, async (e, buf) => {
        const name = buf.toString('hex') + path.extname(input.originalname);
        const bufferstream = new stream.PassThrough();

        bufferstream.end(input.buffer);
        bufferstream.pipe(this.bucket.openUploadStream(name).on('error', (error: any) => {
          return res.status(500).json({
            'error': 'Upload niet gelukt',
          });
        }).on('finish', () => {
          req.file.filename = name;
          next();
        }));
      });
    } catch (e) {
      next(e);
    };
  };

  public pipeAvatar(req: MulterRequest, res: Response) {
    this.bucket.find({
      filename: req.params.avatar
    }).toArray((e: any, files: any) => {
      if (!files || files.length === 0) return res.status(404).json({
        message: "Deze afbeelding bestaat niet",
        redirect: false,
        status: 404,
      });

      this.bucket.openDownloadStreamByName(req.params.avatar).pipe(res);
    });
  };

  public pipeVideo(req: MulterRequest, res: Response) {
    this.bucket.find({
      filename: req.params.video
    }).toArray((e: any, files: any) => {
      if (!files || files.length === 0) return res.status(404).json({
        message: "Deze video bestaat niet",
        redirect: false,
        status: 404,
      });

      this.bucket.openDownloadStreamByName(req.params.video).pipe(res);
    });
  };
};

export default new Storage();