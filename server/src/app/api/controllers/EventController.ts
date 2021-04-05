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

      // Filter events
      const events = await Event.find().populate({
        path: '_creatorId'
      }).sort({
        'details.date': -1
      }).exec();

      let arrayOfEvents = [];

      let user = await User.findById(userId).exec();

      if (user.role === 'cyclist') {
        user = await User.findById(userId).populate({path: 'cyclist', populate: {path: '_clubId'}});

        for (let event of events) {
          if (String(event._creatorId._id) === String(user._id)) {
            arrayOfEvents.push(event);
          };

          if (event._creatorId.role === 'cyclist' && String(event._creatorId.cyclist._clubId._userId) === String(user.cyclist._clubId._userId)) {
            arrayOfEvents.push(event);
          };

          if (event._creatorId.role === 'clubmember' && String(event._creatorId.member._clubId._userId) === String(user.cyclist._clubId._userId)) {
            arrayOfEvents.push(event);
          };

          if (event._creatorId.role === 'club' && String(event._creatorId._id) === String(user.cyclist._clubId._userId)) {
            arrayOfEvents.push(event);
          };
        };
      };

      if (user.role === 'club') {
        user = await User.findById(userId).populate({path: 'club', populate: {path: '_cyclistIds'}}).populate({path: 'club', populate: {path: '_memberIds'}});

        const clubCyclist = user.club._cyclistIds;
        const clubMembers = user.club._memberIds;

        for (let event of events) {
          if (String(event._creatorId._id) === String(userId)) {
            arrayOfEvents.push(event);
          };

          for (let cyclist of clubCyclist) {
            if (String(event._creatorId._id) === String(cyclist._userId)) {
              arrayOfEvents.push(event);
            };
          };

          for (let member of clubMembers) {
            if (String(event._creatorId._id) === String(member._userId)) {
              arrayOfEvents.push(event);
            };
          };
        };
      };

      if (user.role === 'clubmember') {
        const club = await User.findById(user.member._clubId).exec();

        for (let event of events) {
          if (String(event._creatorId) === String(club._id)) {
            arrayOfEvents.push(event);
          };

          if (club.club._cyclistIds.includes(event._creatorId)) {
            arrayOfEvents.push(event);
          };
        };
      };

      if (user.role === 'parent') {
        user = await User.findById(userId).populate({path: 'parent', populate: {path: '_cyclistIds'}});

        let arrayOfKidsEvents = [];

        for (let kid of user.parent._cyclistIds) {
          let arrayOfKidEvents = [];
          const detailedKid = await User.findById(kid._userId).exec();

          for (let event of events) {
            for (let participant of event.participants) {
              if (String(participant._userId) === String(kid._userId)) {
                arrayOfKidEvents.push(event);
              };
            }
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

  getParticipatedEvents = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const userId = this.auth.checkId(req, res);

      let result = [];

      const events = await Event.find().sort({
        _createdAt: -1
      }).exec();

      for (let i = 0; i < events.length; i++) {
        for (let participant of events[i].participants) {
          if (String(participant._userId) === String(userId)) {
            result.push(events[i]);
          };
        };
      };

      return res.status(200).json(result);
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
        path: 'participants',
        populate: {
          path: '_userId',
        }
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
          _creatorId: userId,
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
          _creatorId: userId,
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
      const {
        eventId
      } = req.params;

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

      if (String(event._creatorId) !== String(userId)) return res.status(401).json({
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
    } catch (e) {
      next(e);
    };
  };

  deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        eventId
      } = req.params;

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

      console.log(event)

      if (!event) return res.status(404).json({
        message: "No event has been found",
        redirect: false,
        status: 404,
      });

      for (let participant of event.participants) {
        if (String(participant._userId._id === String(userId))) {
          return res.status(400).json({
            message: "Already participating",
            redirect: false,
            status: 400,
          });
        };
      };

      const updatedEvent = await Event.findByIdAndUpdate(eventId, {
        $push: {
          participants: {
            _userId: userId,
            present: false,
          },
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

      const updatedEvent = await Event.findByIdAndUpdate(eventId, {
        $pull: {
          participants: {
            _userId: user._id,
          },
        },
      }).exec();

      return res.status(200).json(updatedEvent);
    } catch (e) {
      next(e);
    };
  };

  approvePresence = async (req: Request, res: Response, next: NextFunction): Promise < Response > => {
    try {
      const {
        eventId,
        userId,
      } = req.params;

      const creatorId = this.auth.checkId(req, res);

      const event = await Event.findById(eventId)
        .exec();

      if (!event) {
        return res.status(404).json({
          message: "No event has been found",
          redirect: false,
          status: 404,
        });
      };

      if (String(creatorId) !== String(event._creatorId)) {
        return res.status(401).json({
          message: "Unauthorized",
          redirect: false,
          status: 401,
        });
      };

      const updatedEvent = await Event.findOneAndUpdate({
        _id: eventId,
        'participants._userId': userId
      }, {
        $set: {
          'participants.$.present': true,
        }
      }).exec();

      return res.status(400).json(updatedEvent);
    } catch (e) {
      next(e);
    };
  };
};