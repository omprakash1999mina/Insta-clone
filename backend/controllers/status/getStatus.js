const Joi = require("joi");
const Status = require("../../models/status");
const User = require("../../models/user");

const getStatus = async (req, res, next) => {
  const userId = req.pathType == 1 ? req.userId : req.user.id;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    following = user.following;
    following = [userId, ...following];
    let resDoc = [];
    for (const id of following) {
      const document = await Status.find({ userId: id });
      if (document && document.length > 0) {
        const user_info = await User.findOne({ _id: id });
        if (user_info) {
          resultObj = {
            userId: id,
            userName: user_info.userName,
            profileImage: user_info.profileImageUrl,
          };
          statusFilesUrl = [];
          for (const doc of document) {
            statusFilesUrl.push(doc.fileUrl);
          }
          resultObj = { ...resultObj, statusUrls: statusFilesUrl };
          resDoc.push(resultObj);
        }
      }
    }

    return res.status(200).json({ status: resDoc });
  } catch (error) {
    return res.status(500).json({ eror:"Internal Server Error"})
  }
};

module.exports = getStatus;
