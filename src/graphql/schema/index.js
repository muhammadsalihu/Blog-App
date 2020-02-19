import { gql } from "apollo-server-express";

export default gql`
  scalar Date

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  type Query {
    admin_login(email: String!, password: String!): Status
    employee_login(employee_id: String!, password: String!): Status
    view_employees: [Employee]
    view_posts: [Post]
    post_with_id(postId: ID!): Post!
    view_own_posts: [Post]
    view_post_by_category(category: String): [Post]
  }

  type Mutation {
    create_admin(full_name: String!, email: String!, password: String!): Status
    create_employee(employee_id: String!, password: String!): Status
    update_employee_profile(full_name: String, email: String): Status
    delete_employee(employeeId: String!): Status

    employee_change_password(
      old_password: String!
      new_password: String!
      confirm_password: String!
    ): Status

    create_post(title: String!, content: String!, category: String!): Post!
    update_post(post_id: ID!, title: String, content: String): Post
    delete_post(postId: ID!): Status
    post_comment(postId: ID!, comment: String!): Comment!
  }

  type Subscription {
    post_updates: Post
    comment_updates: Comment
  }

  type Status {
    message: String
    value: Boolean
    user: Admin
    user_1: Employee
  }

  type Admin {
    _id: ID!
    full_name: String!
    email: String!
    password: String!
    is_admin: Boolean
    employees: [Employee!]
  }

  type Employee {
    _id: ID!
    full_name: String
    email: String
    password: String!
    employee_id: String!
    is_employee: Boolean
    posts: [Post!]
  }

  type Post {
    _id: ID!
    title: String!
    content: String!
    category: String!
    creator: Employee!
    comments: [Comment!]
  }

  type Comment {
    _id: ID!
    comment: String!
    creator: Employee!
  }
`;
