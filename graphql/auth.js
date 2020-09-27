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
  try {
    if (!token || token.length < 1) {
      return null;
    }
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    return id;
  } catch (e) {
    console.log("Error verifying token");
    return null;
  }
};

const createToken = ({ email, id }) => {
  return jwt.sign({ email: email, id: id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
};

const isAuthorisedUser = (user, districtId) => {
  let authorised = false;
  const districts = user.getUserDistricts();
  if (districts && districts.length > 0) {
    districts.map((district) => {
      if (district.id === districtId) {
        authorised = true;
      }
    });
  }
  return authorised;
};

const isAuthenticatedUser = (user) => {
  if (!user) throw new AuthenticationError("You need to be signed in");
};

module.exports = {
  getUserFromToken,
  verifyToken,
  createToken,
  isAuthorisedUser,
  isAuthenticatedUser,
};
