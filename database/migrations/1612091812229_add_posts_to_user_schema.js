"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddPostsToUserSchema extends Schema {
  up() {
    this.table("posts", (table) => {
      table.integer("user_id").unsigned().references("id").inTable("users");
    });
  }

  down() {
    this.table("posts", (table) => {
      table.dropColumn("user_id");
    });
  }
}

module.exports = AddPostsToUserSchema;
