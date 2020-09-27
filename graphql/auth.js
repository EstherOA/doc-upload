const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const districtResolver = require("./resolvers/district");
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

const isAuthorisedUser = async (user, districtId) => {
  let authorised = false;
  const districts = await user.getDistricts();
  if (!districts) {
    throw new Error("You are not authorised to perform this action");
  }
  districts.map((district) => {
    if (district.id == districtId) {
      authorised = true;
    }
  });
  if (!authorised)
    throw new Error("You are not authorised to perform this action");
};

const isAuthenticatedUser = (user) => {
  if (!user) throw new AuthenticationError("You need to be signed in");
};

const getUserDistrictIds = async (user) => {
  let districtList = [];
  let districts = await user.getDistricts();
  if (districts) {
    districts.map((district) => {
      districtList.push(district.id);
    });
  }

  return districtList;
};

module.exports = {
  getUserFromToken,
  verifyToken,
  createToken,
  isAuthorisedUser,
  isAuthenticatedUser,
  getUserDistrictIds,
};
