import { gql } from "apollo-server-express";

export default gql`
  scalar Date

  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    admin_login(email: String!, password: String!): Status
    employee_login(employee_id: String!, password: String!): Status
  }

  type Mutation {
    create_admin(full_name: String!, email: String!, password: String!): Status

    create_employee(employee_id: String!, password: String!): Status

    employee_change_password(
      employee_id: ID!
      old_password: String!
      new_password: String!
      confirm_password: String!
    ): Status

    create_post(title: String!, content: String!, category: String!): Post!

    post_comment(postId: ID!, comment: String!): Comment!
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
    comments: [Comment!]
    createdAt: Date
  }

  type Post {
    _id: ID!
    title: String!
    content: String!
    category: String!
    creator: Employee!
    comments: [Comment!]
    createdAt: Date
    updatedAt: Date
  }

  type Comment {
    _id: ID!
    comment: String!
    creator: Employee!
    createdAt: Date
    updatedAt: Date
  }
`;
