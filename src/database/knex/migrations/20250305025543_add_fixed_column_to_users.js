exports.up = knex => knex.schema.table("posts", table => {
  table.boolean("isFixed").defaultTo(false);
});

exports.down = knex => knex.schema.table("posts", table => {
  table.dropColumn("isFixed");
});