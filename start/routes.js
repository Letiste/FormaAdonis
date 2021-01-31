"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.on("/").render("index");

Route.get("/posts", "PostController.index");
Route.get("/posts/new", "PostController.new").middleware("auth");
Route.post("/posts", "PostController.create").middleware("auth");
Route.get("/posts/:id", "PostController.show");
Route.get("/posts/:id/edit", "PostController.edit").middleware("auth");
Route.put("/posts/:id", "PostController.update").middleware("auth");
Route.delete("/posts/:id", "PostController.destroy").middleware("auth");

Route.get("/signup", "UserController.new");
Route.post("/users", "UserController.create");
Route.get("/users/:id", "UserController.show");

Route.get("/login", "SessionController.new");
Route.post("/login", "SessionController.create");
Route.delete("/session", "SessionController.destroy");

Route.on("/contact").render("contact");
