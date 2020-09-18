const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const { User } = require("../models").models;

const getUserFromToken = async (token) => {
  const id = await verifyToken(token);
  let user = null;
  try {
    user = await User.findOne({
      where: {
        id: id,
      },
    });
  } catch (e) {
    console.log(e);
  }

  return user;
};

const verifyToken = async (token) => {
  if (!token || token.length < 1) {
    return null;
  }
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  return id;
};

const createToken = ({ email, id }) => {
  return jwt.sign({ email: email, id: id }, process.env.JWT_SECRET, {
    expiresIn: "3m",
  });
};

const authoriseUser = (user, role) => {
  if (!user || !user.roles.includes(role)) {
    throw new AuthenticationError(
      "You do not have permission to access this resource"
    );
  }
};

module.exports = { getUserFromToken, verifyToken, createToken, authoriseUser };
