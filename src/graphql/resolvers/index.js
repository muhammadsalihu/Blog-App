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
    posts: (_, __) => Post.find({ _id: _.posts })
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
    employee_login: employeeResolver.employee_login,
    view_employees: adminResolver.view_employees,
    view_posts: postResolver.view_posts,
    post_with_id: postResolver.post_with_id,
    view_own_posts: postResolver.view_own_posts,
    view_post_by_category: postResolver.view_post_by_category
  },
  Mutation: {
    create_admin: adminResolver.create_admin,
    create_employee: adminResolver.create_employee,
    delete_employee: adminResolver.delete_employee,
    update_employee_profile: employeeResolver.update_employee_profile,
    employee_change_password: employeeResolver.employee_change_password,
    create_post: postResolver.create_post,
    update_post: postResolver.update_post,
    delete_post: postResolver.delete_post,
    post_comment: postResolver.post_comment
  },
  Subscription: {
    post_updates: postResolver.post_updates,
    comment_updates: postResolver.comment_updates
  }
};
