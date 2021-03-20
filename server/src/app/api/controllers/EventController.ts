import {
  Request,
  Response,
  NextFunction
} from "express";

import {
  Auth
} from "../../services";

import {
  User,
  Event
} from "../models";

export default class EventController {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  };

  getEvents = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const userId = this.auth.checkId(req, res);

      const user = await User.findById(userId).exec();

      // Filter events
      const events = await Event.find().populate({
        path: '_creatorId'
      }).sort({
        _createdAt: -1
      }).exec();

      let arrayOfEvents = [];

      if (user.role === 'cyclist') {
        for (let event of events) {
          if (event._creatorId._id === user.cyclist._clubId) {
            arrayOfEvents.push(event);
          };

          if (event._creatorId.role === 'cyclist' && event._creatorId.cyclist._clubId === user.cyclist._clubId) {
            arrayOfEvents.push(event);
          };

          if (event._creatorId.role === 'clubmember' && event._creatorId.member._clubId === user.cyclist._clubId) {
            arrayOfEvents.push(event);
          };
        };
      };

      if (user.role === 'club') {
        const clubCyclist = user.club._cyclistIds;
        const clubMembers = user.club._memberIds;

        for (let event of events) {
          if (event._creatorId === userId) {
            arrayOfEvents.push(event);
          };

          for (let cyclist of clubCyclist) {
            if (event._creatorId === cyclist) {
              arrayOfEvents.push(event);
            };
          };

          for (let member of clubMembers) {
            if (event._creatorId === member) {
              arrayOfEvents.push(event);
            };
          };
        };
      };

      if (user.role === 'clubmember') {
        const club = await User.findById(user.member._clubId).exec();

        for (let event of events) {
          if (event._creatorId === club._id) {
            arrayOfEvents.push(event);
          };

          if (club.club._cyclistIds.includes(event._creatorId)) {
            arrayOfEvents.push(event);
          };
        };
      };

      if (user.role === 'parent') {
        let arrayOfKidsEvents = [];

        for (let kid of user.parent._cyclistIds) {
          let arrayOfKidEvents = [];
          const detailedKid = await User.findById(kid).exec();

          for (let event of events) {
            if (event.participants.includes(kid)) {
              arrayOfKidEvents.push(event);
            };
          };

          arrayOfKidsEvents.push({
            user: detailedKid,
            events: arrayOfKidEvents
          });
        };

        arrayOfEvents = arrayOfKidsEvents;
      };

      return res.status(200).json(arrayOfEvents);
    } catch (e) {
      next(e);
    };
  };

  getEvent = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        eventId
      } = req.params;

      const event = await Event.findById(eventId).populate({
        path: 'participants'
      }).populate({
        path: '_creatorId'
      }).exec();

      if (!event) return res.status(404).json({
        message: "No event has been found",
        redirect: false,
        status: 404,
      });

      return res.status(200).json(event);
    } catch (e) {
      next(e);
    };
  };

  createEvent = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      const {
        title,
        description,
        details,
        gpxFile,
        type
      } = req.body;

      let result;

      if (user.role === 'cyclist') {
        const newEvent = new Event({
          title: title,
          description: description,
          details: details,
          gpxFile: gpxFile || null,
          type: 'Ride',
        });

        result = await newEvent.save();
      };

      if (user.role === 'club' || user.role === 'clubmember') {
        const newEvent = new Event({
          title: title,
          description: description,
          details: details,
          gpxFile: gpxFile || null,
          type: type,
        });

        result = await newEvent.save();
      };

      if (user.role === 'parent') {
        return res.status(401).json({
          message: "You can't create an event",
          redirect: false,
          status: 401,
        });
      };

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    };
  };

  updateEvent = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const { eventId } = req.params;

      const {
        title,
        description,
        details,
        gpxFile,
        type
      } = req.body;

      const userId = this.auth.checkId(req, res);

      const event = await Event.findById(eventId).exec();

      if (!event) return res.status(404).json({
        message: "No event has been found",
        redirect: false,
        status: 404,
      });

      if (event._creatorId !== userId) return res.status(401).json({
        message: "Unauthorized",
        redirect: false,
        status: 401,
      });

      const updatedEvent = await Event.findByIdAndUpdate(eventId, {
        $set: {
          title: title,
          description: description,
          details: details,
          gpxFile: gpxFile || null,
          type: type,
        },
      }).exec();

      return res.status(200).json(updatedEvent);
    } catch(e) {
      next(e);
    };
  };

  deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const { eventId } = req.params;

      const userId = this.auth.checkId(req, res);

      const event = await Event.findById(eventId).exec();

      if (!event) return res.status(404).json({
        message: "No event has been found",
        redirect: false,
        status: 404,
      });

      if (event._creatorId !== userId) return res.status(401).json({
        message: "Unauthorized",
        redirect: false,
        status: 401,
      });

      const deletedEvent = await Event.findByIdAndDelete(eventId).exec();

      return res.status(200).json(deletedEvent);
    } catch (e) {
      next(e);
    };
  };

  participateEvent = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        eventId
      } = req.params;

      const userId = this.auth.checkId(req, res);

      const event = await Event.findById(eventId)
        .exec();

      if (!event) return res.status(404).json({
        message: "No event has been found",
        redirect: false,
        status: 404,
      });

      if (event.participants.includes(userId)) return res.status(400).json({
        message: "Already participating",
        redirect: false,
        status: 400,
      });

      const updatedEvent = await Event.findByIdAndUpdate(eventId, {
        $push: {
          participants: userId,
        },
      }).exec();

      return res.status(200).json(updatedEvent);
    } catch (e) {
      next(e);
    };
  };

  withdrawEvent = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        eventId
      } = req.params;

      const userId = this.auth.checkId(req, res);
      const user = await User.findById(userId).exec();

      const event = await Event.findById(eventId)
        .exec();

      if (!event) return res.status(404).json({
        message: "No event has been found",
        redirect: false,
        status: 404,
      });

      if (!event.participants.includes(userId)) return res.status(400).json({
        message: "Already not participating",
        redirect: false,
        status: 400,
      });

      const updatedEvent = await Event.findByIdAndUpdate(eventId, {
        $pull: {
          participants: user._id,
        },
      }).exec();

      return res.status(200).json(updatedEvent);
    } catch (e) {
      next(e);
    };
  };
};