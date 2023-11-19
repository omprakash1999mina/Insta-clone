const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../models/userModel");
const jwtServices = require("../services/jwtServices");
const refreshSecreat = process.env.REFRESH_SECRET;

const UserController = {
  async registerUser(req, res, next) {
    try {
      const { name, email, password, pic } = req.body;
      if (!email.includes("@")) {
        return res.status(400).json({ error: "Entered email address is not a valid email address." });
      }

      const isEmailExist = await User.exists({ email: email });
      if (isEmailExist) {
        return res.status(400).json({ error: "This user already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      User.create({ name: name, email: email, password: hashedPassword,pic:pic })
        .then(async () => {
          return res.status(201).json({ message: "User created successfully" });
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async login(req, res, next) {
    const userSchema = Joi.object({
      email: Joi.string().required(), //This email can be username or phonenumber also
      password: Joi.string().required(),
    });

    console.log(refreshSecreat)
    console.log("first")
    const { error } = userSchema.validate(req.body);

    if (error) {
      next(error);
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      // Incase email  field is filled with username

      if (user) {
        console.log(user);
        await bcrypt
          .compare(req.body.password, user.password)
          .then((isCorrect) => {
            console.log(isCorrect);
            if (isCorrect) {
              const refresh_token = jwtServices.sign({ id: user._id }, "7d", refreshSecreat);

              return res.status(200).json({ refresh_token });
            } else {
              return res.status(404).json({ error: "Invalid credentials3" });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(404).json({ error: "Invalid credentials2" });
          });
      } else {
        return res.status(404).json({ error: "Invalid credentials1" });
      }

      // .catch((err) => {
      //   console.log(err);
      //   return res.status(404).json({ error: "Invalid credentials1" });
      // });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
  },
};

module.exports = UserController;
