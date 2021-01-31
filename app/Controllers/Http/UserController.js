"use strict";

const { validate } = use("Validator");
const User = use("App/Models/User");

class UserController {
  new({ view }) {
    return view.render("users/new");
  }

  async create({ request, response, session, auth }) {
    const rules = {
      username: "required|unique:users,username",
      email: "required|email|unique:users,email",
      password: "required",
      password_confirmation: "required|same:password",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();

      return response.redirect("back");
    }

    const { username, email, password } = request.post();

    const user = new User();

    user.username = username;
    user.email = email;
    user.password = password;

    await user.save();
    await auth.login(user);

    return response.route("UserController.show", { id: user.id });
  }

  async show({ params, view }) {
    const user = await User.find(params.id);
    const posts = await user.posts().fetch();

    return view.render("users/show", {
      user: user.toJSON(),
      posts: posts?.toJSON(),
    });
  }
}

module.exports = UserController;
