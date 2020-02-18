import { GraphQLDateTime } from "graphql-iso-date";

import adminResolver from "./admin";
import postResolver from "./posts";
import employeeResolver from "./employee";

import Employee from "../../models/user-type/employee";
import Post from "../../models/posts";
import Comment from "../../models/comments";

export default {
  Date: GraphQLDateTime,

  Admin: {
    employees: (_, __) => Employee.find({ _id: _.employees })
  },
  Employee: {
    posts: (_, __) => Post.find({ _id: _.posts }),
    comments: (_, __) => Comment.find({ _id: _.comments })
  },
  Post: {
    creator: (_, __) => Employee.findById(_.creator),
    comments: (_, __) => Comment.find({ _id: _.comments })
  },
  Comment: {
    creator: (_, __) => Employee.findById(_.creator)
  },

  Query: {
    admin_login: adminResolver.admin_login,
    employee_login: employeeResolver.employee_login
  },

  Mutation: {
    create_admin: adminResolver.create_admin,
    create_employee: adminResolver.create_employee,
    employee_change_password: employeeResolver.employee_change_password,
    create_post: postResolver.create_post,
    post_comment: postResolver.post_comment
  }
};
