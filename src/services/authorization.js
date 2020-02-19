import { AuthenticationError } from "apollo-server-express";
import { combineResolvers, skip } from "graphql-resolvers";

/*
    Functions to protect Various resolvers based on permission levels
*/

// Check if user is logged in
export const isAuthenticated = (_, __, { logged_in_user }) =>
  logged_in_user ? skip : new AuthenticationError("Authorization Denied");

// Check if user is an admin (Role based authentication)
export const isAdmin = combineResolvers(isAuthenticated, (_, __, { admin }) =>
  admin === true ? skip : new AuthenticationError("Not Authorized as an Admin")
);

// Check if user is an employee (Role based authentication)
export const isEmployee = combineResolvers(
  isAuthenticated,
  (_, __, { employee }) =>
    employee === true
      ? skip
      : new AuthenticationError("Not Authorized as an Employee")
);

// export const isAny = (_, __, { admin, employee }) => {
//   if (admin === true || employee === true) {
//     skip;
//     console.log("somethinsfg");
//   } else {
//     new AuthenticationError("Not Authorized as something");
//   }
// };
