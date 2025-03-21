exports.up = knex => knex.schema.createTable("posts", table => {
  table.increments('id');
  table.text('content');
  table.integer('user_id').references('id').inTable('users').onDelete("CASCADE");
  table.timestamp('created_at').default(knex.fn.now())
  table.timestamp('updated_at').default(knex.fn.now())
});

exports.down = knex => knex.schema.dropTable("posts");
