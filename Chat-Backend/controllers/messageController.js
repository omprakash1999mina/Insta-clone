const joi = require("joi");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

const MessageController = {
  async allMessages(req, res, next) {
    try {
      const chatId = req.params.chatId;
      // console.log(chatId)
      const doc = await Message.find({ chat: chatId }).populate("sender", "-password").populate("chat");
      return res.status(200).json({ data: doc });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async sendMessage(req, res, next) {
    const { content, chat } = req.body;
    const newMessage = {
      sender: req.user._id,
      content,
      chat,
    };
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await message.populate("chat.users", "name pic email");

    await Chat.findByIdAndUpdate(chat, { latestMessage: message._id });

    return res.status(201).json({ data: message });
  },
};


module.exports = MessageController;