exports.up = knex => knex.schema.createTable("comments", table => {
  table.increments('id');
  table.text('content').notNullable();
  table.integer('user_id').references('id').inTable('users').onDelete("CASCADE");
  table.integer('post_id').references('id').inTable('posts').onDelete("CASCADE");
  table.timestamp('created_at').default(knex.fn.now())
  table.timestamp('updated_at').default(knex.fn.now())
});

exports.down = knex => knex.schema.dropTable("comments");
