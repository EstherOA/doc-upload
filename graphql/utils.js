const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const districtResolver = require("./resolvers/district");
const { User } = require("../models").models;
var path = require("path");
var fs = require("fs");
const AWS = require("aws-sdk");
const { rejects } = require("assert");

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

const saveDocumentToS3 = (dataUrl, region, district, key) => {
  let s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  });
  var uploadParams = { Bucket: "chaos-luspa-data", Key: "", Body: "" };
  // var file = "/home/nana/Downloads/tenancy_ratio.png";

  // Configure the file stream and obtain the upload parameters
  // var fileStream = fs.createReadStream(file);
  // fileStream.on("error", function (err) {
  //   console.log("File Error", err);
  // });

  var data = dataUrl.split(",")[1];
  var buf = Buffer.from(data).toString("base64");
  uploadParams.Body = buf;
  uploadParams.Key = region + "/" + district + "/" + key;

  // call S3 to retrieve upload file to specified bucket
  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        console.log("Error", err);
        return reject(err);
      }
      if (data) {
        console.log("Upload Success", data.Location);
        return resolve(data);
      }
    });
  });
};

const listDocumentsFromS3 = (region, district) => {
  s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  });

  // Create the parameters for calling listObjects
  var bucketParams = {
    Bucket: "chaos-luspa-data",
    Prefix: `${region}/${district ? district : ""}`,
  };

  s3.listObjects(bucketParams, (err, data) => {
    if (err) {
      console.log("Error", err);
      throw new Error(err);
    } else {
      console.log("Success", data);
      return data;
    }
  });
};

const getDocumentFromS3 = (key) => {
  let s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  });

  var fileParams = {
    Bucket: "chaos-luspa-data",
    Key: key,
  };
  s3.getObject(fileParams, (err, data) => {
    if (err) {
      console.log("Error fetching file: ", err);
      throw new Error(err);
    } else {
      console.log("File: ", data);
      return data;
    }
  });
};

const updateS3Document = (region, district, key, data) => {};

const deleteDocumentFromS3 = (key) => {
  let s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  });

  var fileParams = {
    Bucket: "chaos-luspa-data",
    Key: key,
  };
  s3.deleteObject(fileParams, (err, data) => {
    if (err) {
      console.log("Error deleting file: ", err);
      throw new Error(err);
    } else {
      return true;
    }
  });
};

module.exports = {
  getUserFromToken,
  verifyToken,
  createToken,
  isAuthorisedUser,
  isAuthenticatedUser,
  getUserDistrictIds,
  saveDocumentToS3,
  getDocumentFromS3,
  listDocumentsFromS3,
  deleteDocumentFromS3,
};
