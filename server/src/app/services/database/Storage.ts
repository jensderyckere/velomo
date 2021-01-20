import { default as mongoose } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { default as path } from "path";
import { default as crypto } from "crypto";
import { default as sharp } from "sharp";
import { default as stream } from "stream";

interface MulterRequest extends Request {
  file: any;
};

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

  public uploadAvatar = async (req: MulterRequest, res: Response, next: NextFunction): Promise<Response> => {
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
        sharp(input.buffer).resize(dimensionX, dimensionY, {fit: 'cover'}).toFormat('jpeg').jpeg({quality: 80}).toBuffer((e: any, data: any, info: any) => {
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

  public pipeAvatar (req: MulterRequest, res: Response) {
    this.bucket.find({filename: req.params.avatar}).toArray((e: any, files: any) => {
      if (!files || files.length === 0) return res.status(404).json({
        message: "Deze afbeelding bestaat niet",
        redirect: false,
        status: 404,
      });

      this.bucket.openDownloadStreamByName(req.params.avatar).pipe(res);
    });
  };
};

export default new Storage();
