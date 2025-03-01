exports.up = knex => knex.schema.createTable("likes", table => {
  table.increments('id');
  table.integer('user_id').references('id').inTable('users').onDelete("CASCADE");
  table.integer('post_id').references('id').inTable('posts').onDelete("CASCADE").nullable();
  table.integer('comment_id').references('id').inTable('comments').onDelete("CASCADE").nullable();
});

exports.down = knex => knex.schema.dropTable("likes");