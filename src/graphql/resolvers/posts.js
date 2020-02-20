import { ApolloError } from "apollo-server-express";
import dotenv from "dotenv";
import { combineResolvers } from "graphql-resolvers";

import Employee from "../../models/user-type/employee";
import Post from "../../models/posts";
import Comment from "../../models/comments";
import { isEmployee, isAuthenticated } from "../../services/authorization";
import { pubsub } from "../../config/pubsub";

// Subscription Variables
const POST_UPDATES = "post_updates";
const COMMENT_UPDATES = "comment_updates";
// const LIKE_UPDATES = "like_updates";

dotenv.config();

export default {
  // Create a post
  create_post: combineResolvers(
    isEmployee,
    async (_, { title, content, category }, { Id }) => {
      try {
        // User should finish updating their profile
        const employCheck = await Employee.findById(Id);

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

        // Save post to database
        const savedPost = await newPosts.save();

        // Update user profile with posts
        await Employee.findByIdAndUpdate(
          Id,
          { $push: { posts: savedPost } },
          { new: true }
        );

        // Post Subscription (push live updates)
        pubsub.publish(POST_UPDATES, {
          [POST_UPDATES]: savedPost
        });

        // Response
        return savedPost;
      } catch (err) {
        throw err;
      }
    }
  ),

  // Edit a post
  update_post: combineResolvers(isEmployee, async (_, args, { Id }) => {
    try {
      const updatedPost = await Employee.findByIdAndUpdate(Id, args, {
        new: true
      });

      // If no post was found
      if (!updatedPost) {
        throw new ApolloError("Post was not found");
      }

      // Update Posts (Subscription)
      pubsub.publish(POST_UPDATES, {
        [POST_UPDATES]: updatedPost
      });

      // Response
      return updatedPost;
    } catch (err) {
      throw err;
    }
  }),

  // View all posts
  view_posts: combineResolvers(isAuthenticated, async () => {
    try {
      const posts = await Post.find();

      if (!posts) {
        throw new ApolloError("No Post found in the database");
      }
      return posts;
    } catch (err) {
      throw err;
    }
  }),

  // Resolver to view a single post
  post_with_id: combineResolvers(isAuthenticated, async (_, { postId }) => {
    try {
      // Check for post
      const checkPost = await Post.findById(postId);

      if (!checkPost) {
        throw new ApolloError("Post does not exists");
      }

      return checkPost;
    } catch (err) {
      throw err;
    }
  }),

  // View personal posts
  view_own_posts: combineResolvers(isEmployee, async (_, __, { Id }) => {
    try {
      const posts = await Post.find({
        creator: Id
      });

      if (!posts) {
        throw new ApolloError("No Post found in the database");
      }
      return posts;
    } catch (err) {
      throw err;
    }
  }),

  // View post by catergory
  view_post_by_category: combineResolvers(
    isEmployee,
    async (_, { category }) => {
      try {
        const posts = await Post.find({
          category
        });

        if (!posts) {
          throw new ApolloError("No Post found in this category");
        }
        return posts;
      } catch (err) {
        throw err;
      }
    }
  ),

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

        // Update comments
        pubsub.publish(COMMENT_UPDATES, {
          [COMMENT_UPDATES]: savedComment
        });

        // Response
        return savedComment;
      } catch (err) {
        throw err;
      }
    }
  ),

  // Like Post
  like_post: combineResolvers(isEmployee, async (_, { postId }, { Id }) => {
    try {
      // const singlePost = await Post.findById(postId);

      // const findUser = await singlePost.dis_likes.console.log(findUser);

      // // Unlike a post if a user has aleready liked a post
      // if (findUser) {
      //   await Post.findByIdAndUpdate(
      //     postId,
      //     { $pull: { likes: Id }, $inc: { likes_count: -1 } },
      //     { new: true }
      //   );

      //   return {
      //     message: "Post Unliked",
      //     value: true
      //   };
      // }

      await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: Id }, $inc: { likes_count: +1 } },
        { new: true }
      );

      return {
        message: "Post liked",
        value: true
      };
    } catch (err) {
      throw err;
    }
  }),

  //Dislike Post
  dislike_post: combineResolvers(isEmployee, async (_, { postId }, { Id }) => {
    try {
      // const singlePost = await Post.findById(postId);

      await Post.findByIdAndUpdate(
        postId,
        { $push: { dis_likes: Id }, $inc: { dislikes_count: +1 } },
        { new: true }
      );

      return {
        message: "Post disliked",
        value: true
      };
    } catch (err) {
      throw err;
    }
  }),

  /*********************************************************************
   * Subscriptions
   ********************************************************************/

  // To return a new new post
  post_updates: {
    subscribe: () => {
      return pubsub.asyncIterator([POST_UPDATES]);
    }
  },
  comment_updates: {
    subscribe: () => {
      return pubsub.asyncIterator([COMMENT_UPDATES]);
    }
  }
  // like_updates: {
  //   subscribe: () => {
  //     return pubsub.asyncIterator([LIKE_UPDATES]);
  //   }
  // }
};
