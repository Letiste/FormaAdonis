"use strict";

const { validate } = use("Validator");
const Post = use("App/Models/Post");

class UserController {
  async index({ view }) {
    const posts = await Post.all();

    return view.render("posts/index", { posts: posts.toJSON() });
  }

  new({ view }) {
    return view.render("posts/new");
  }

  async create({ request, response, session, auth }) {
    const user = await auth.getUser();
    const rules = {
      title: "required|unique:posts,title",
      content: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();

      return response.redirect("back");
    }

    const { title, content } = request.post();

    const post = new Post();

    post.title = title;
    post.content = content;

    await user.posts().save(post);
    session.flash({ notification: "Post has been created" });
    console.log(post);

    return response.redirect("/posts");
  }

  async show({ params, view, response, session }) {
    const post = await Post.find(params.id);

    if (post === null) {
      session.flash({ notification: "This Post does not exist" });
      return response.redirect("/posts");
    }

    return view.render("posts/show", { post: post });
  }

  async edit({ params, view, session }) {
    const post = await Post.find(params.id);

    if (post === null) {
      session.flash({ notification: "This Post does not exist" });
      return response.redirect("/posts");
    }

    return view.render("posts/edit", { post });
  }

  async update({ request, response, session, params }) {
    const post = await Post.find(params.id);

    if (post === null) {
      session.flash({ notification: "This Post does not exist" });
      return response.redirect("/posts");
    }

    const rules = {
      title: `required|unique:posts,title,id,${post.id}`,
      content: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();

      return response.redirect("back");
    }

    const { title, content } = request.post();

    post.title = title;
    post.content = content;

    await post.save();
    session.flash({ notification: "Post has been updated" });

    return response.redirect("/posts");
  }

  async destroy({ params, response, session }) {
    const post = await Post.find(params.id);

    if (post === null) {
      session.flash({ notification: "This Post does not exist" });
      return response.redirect("/posts");
    }

    await post.delete();
    session.flash({ notification: "Post has been deleted" });

    response.redirect("/posts");
  }
}

module.exports = UserController;
