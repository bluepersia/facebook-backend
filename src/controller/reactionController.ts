import { Request, Response } from "express";
import Reaction from "../models/reactionModel";
import factory = require ('./factory');


export const getAllReactions = factory.getAll (Reaction);