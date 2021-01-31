"use strict";

class SessionController {
  async new({ view, response, auth }) {
    try {
      await auth.check();
      response.route("UserController.show", { id: auth.user.id });
    } catch {
      return view.render("/login");
    }
  }

  async create({ request, auth, response, session }) {
    const { email, password } = request.post();

    try {
      await auth.attempt(email, password);
    } catch {
      console.log(email, password);
      session.flash({ notification: "Email or Password incorrect" });
      return response.redirect("back");
    }
    return response.route("UserController.show", { id: auth.user.id });
  }

  async destroy({ auth, response }) {
    try {
      await auth.check();
      await auth.logout();
      return response.redirect("/");
    } catch {
      return response.redirect("back");
    }
  }
}

module.exports = SessionController;
