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

  // Resolver to comment on a post
  post_comment: combineResolvers(
    isEmployee,
    async (_, { postId, comment }, { Id }) => {
      try {
        // find the post
        const findPost = await Post.findById(postId);

        if (!findPost) {
          throw new ApolloError("Post not found");
        }

        // create and save the comment
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

        // Update the user account with the comment
        await Employee.findByIdAndUpdate(
          Id,
          {
            $push: { comments: savedComment }
          },
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
