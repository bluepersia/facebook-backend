import User from "../models/userModel";
import AppError from "../util/AppError";
import factory = require ('./factory');


export const getAllUsers = factory.getAll (User);
export const createUser = () => { throw new AppError ('Route not defined. Use /signup instead', 400)}
export const getUser = factory.getOne (User);
export const updateUser = factory.updateOne (User);
export const deleteUser = factory.deleteOne (User);