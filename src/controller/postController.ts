import Post from "../models/postModel";
import factory = require ('./factory');


export const getAllPosts = factory.getAll (Post);
export const createPost = factory.createOne (Post);
export const getPost = factory.getOne (Post);
export const updatePost = factory.updateOne (Post);
export const deletePost = factory.deleteOne (Post);