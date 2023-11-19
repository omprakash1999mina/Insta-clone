const Chat = require("../models/chatModel");

const ChatController = {
  async fetchOne2OneChats(req, res, next) {
    const { userId } = req.body;

    var chat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        {
          users: { $elemMatch: { $eq: req.user._id } },
        },
        {
          users: { $elemMatch: { $eq: userId } },
        },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    if (chat && Object.keys(chat).length > 0) {
      return res.status(200).json({ data: chat });
    } else {
      const newChat = {
        users: [req.user._id, userId],
        isGroupChat: false,
        chatName: "sender",
      };

      const createdChat = await Chat.create(newChat)
      const updatedChat = await Chat.findById(createdChat._id).populate("users", "-password");
      return res.status(201).json({ data: updatedChat });
    }
  },

  async fetchAllChats(req, res, next) {
    const userId = req.user._id;
    // console.log(userId)
    Chat.find({ users: { $elemMatch: { $eq: userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then((response) => {
        return res.status(200).json({ data: response });
      })
      .catch((err) => {
        console.log(err)
      });
  },

  async createGroupChat(req, res, next) {
    const users = req.body.users;
    if (users && users.length < 2) {
      return res.status(400).json({ message: "You need at least 2 users to create a group chat" });
    }
    // console.log(users)
    const newChat = {
      users: users,
      isGroupChat: true,
      chatName: req.body.chatName,
      groupAdmin: req.user._id,
    };

    const grpChat = await Chat.create(newChat)
    const popChat = await Chat.findById(grpChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
    return res.status(201).json({ data: popChat });
  },

  async renameGroupChat(req, res, next) {
    const { chatId, name } = req.params.chatId;

    const updatedChat = await Chat.findOneAndUpdate({ _id: chatId }, { $set: { chatName: name } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json({ data: updatedChat });
  },

  async addUserToGroup(req, res, next) {
    const { chatId, userId } = req.body;
    const added = await Chat.findOneAndUpdate({ _id: chatId }, { $addToSet: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json({ data: added });
  },

  async removeUserFromGroup(req, res, next) {
    const { chatId, userId } = req.body;
    const removed = await Chat.findOneAndUpdate({ _id: chatId }, { $pull: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
      return res.status(200).json({ data: removed });
  },
};

module.exports = ChatController;
