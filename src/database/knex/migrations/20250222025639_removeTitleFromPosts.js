exports.up = knex => knex.schema.table("posts", table => {
  table.dropColumn("title");
});

exports.down = knex => knex.schema.table("posts", table => {
  table.text("title");
});
