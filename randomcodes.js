// //Schema.js

// import { gql } from "apollo-server-express";

// export default gql`
//   scalar Date

//   schema {
//     query: Query
//     mutation: Mutation
//   }

//   type Query {
//     admin_login(email: String!, password: String!): Status
//     user_login(user_id: String!, password: String!): Status
//     admin_profile(adminId: ID!): Admin!
//     user_profile(userId: ID!): User!
//     post_with_id(postId: ID!): Post!
//     view_all_posts(cursor: String, limit: Int): PostConnection!
//     view_personal_posts(cursor: String, limit: Int): PostConnection!
//     view_post_by_category(
//       category: String!
//       cursor: String
//       limit: Int
//     ): PostConnection!
//     view_users(cursor: String, limit: Int): UserConnection!
//   }

//   type Mutation {
//     create_admin(full_name: String!, email: String!, password: String!): Status

//     create_user(user_id: String!, password: String!): Status

//     edit_admin_profile(
//       full_name: String
//       email: String
//       phone_number: String
//       password: String
//       file: Upload
//     ): Status

//     user_change_password(
//       userId: ID!
//       old_password: String!
//       new_password: String!
//       confirm_password: String!
//     ): Status

//     update_user_profile(
//       full_name: String
//       email: String
//       job_title: String
//       avatar: String
//       file: Upload
//     ): Status

//     create_post(
//       title: String!
//       content: String!
//       file: Upload
//       category: String!
//     ): Post!
//     edit_post(
//       title: String
//       content: String
//       file: Upload
//       category: String
//     ): Post!
//     post_comment(postId: ID!, comment: String!): Comment!
//     delete_post(postId: ID!): Status
//   }

//   type Status {
//     message: String
//     value: Boolean
//     user: Admin
//     user_1: User
//   }

//   type Admin {
//     _id: ID!
//     full_name: String!
//     email: String!
//     password: String!
//     users: [User!]
//     no_of_users: Int
//     user_type: String
//     avatar: String
//   }

//   type User {
//     _id: ID!
//     full_name: String
//     email: String
//     password: String!
//     user_id: String!
//     job_title: String
//     posts: [Post!]
//     comments: [Comment!]
//     no_of_posts: Int
//     user_type: String
//     avatar: String
//     createdAt: Date
//   }

//   type Post {
//     _id: ID!
//     title: String!
//     content: String!
//     image: String
//     category: String!
//     creator: Employee!
//     comments: [Comment!]
//     createdAt: Date
//     updatedAt: Date
//   }

//   type Comment {
//     _id: ID!
//     comment: String!
//     creator: User!
//     createdAt: Date
//     updatedAt: Date
//   }

//   type UserConnection {
//     edges: [User!]
//     pageInfo: PageInfo!
//   }

//   type PostConnection {
//     edges: [Post!]
//     pageInfo: PageInfo!
//   }

//   type CommentConnection {
//     edges: [Comment!]
//     pageInfo: PageInfo!
//   }

//   type PageInfo {
//     hasNextPage: Boolean!
//     endCursor: Date!
//   }
// `;
