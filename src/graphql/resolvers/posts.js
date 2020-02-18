import { ApolloError } from "apollo-server-express";
import dotenv from "dotenv";
import { combineResolvers } from "graphql-resolvers";

import Employee from "../../models/user-type/employee";
import Post from "../../models/posts";
import Comment from "../../models/comments";
import { isEmployee } from "../../services/authorization";

dotenv.config();

export default {
  // Create a post
  create_post: combineResolvers(
    isEmployee,
    async (_, { title, content, category }, { Id }) => {
      try {
        // User should finish updating their profile
        const employCheck = await Employee.findById(Id);
        console.log(employCheck);

        if (!employCheck) {
          throw new ApolloError("Employee not found");
        }

        // Create a new post
        const newPosts = new Post({
          title,
          content,
          category,
          creator: Id
        });

        console.log(newPosts);

        // Save post to database
        const savedPost = await newPosts.save();

        // Update user profile with posts
        await Employee.findByIdAndUpdate(
          Id,
          { $push: { posts: savedPost } },
          { new: true }
        );

        // Response
        return savedPost;
      } catch (err) {
        throw err;
      }
    }
  ),

  // Edit a post
  edit_post: combineResolvers(isEmployee, async (_, args, { Id }) => {
    try {
      const updatedPost = await Employee.findByIdAndUpdate(Id, args, {
        new: true
      });

      // Response
      return updatedPost;
    } catch (err) {
      throw err;
    }
  }),

  // Delete a post
  delete_post: combineResolvers(isEmployee, async (_, { postId }, { Id }) => {
    try {
      // find post
      const findPost = await Post.findOne({
        _id: postId,
        creator: Id
      });

      if (!findPost) {
        throw new ApolloError("Post does not exist");
      }

      // Delete post
      const deletedPost = await Post.findByIdAndRemove(postId);

      await Employee.findByIdAndUpdate(
        Id,
        { $pull: { posts: deletedPost._id } },
        { new: true }
      );

      // Response
      return {
        message: "Post was deleted successfully",
        value: true
      };
    } catch (err) {
      throw err;
    }
  }),

  // Comment on a post
  post_comment: combineResolvers(
    isEmployee,
    async (_, { postId, comment }, { Id }) => {
      try {
        // find the post
        const findPost = await Post.findById(postId);

        if (!findPost) {
          throw new ApolloError("Post not found");
        }

        // Create and save the comment
        const newComment = new Comment({
          comment,
          creator: Id
        });

        const savedComment = await newComment.save();

        // Update the post with the comment
        await Post.findByIdAndUpdate(
          postId,
          { $push: { comments: savedComment } },
          { new: true }
        );

        // Response
        return savedComment;
      } catch (err) {
        throw err;
      }
    }
  )
};
