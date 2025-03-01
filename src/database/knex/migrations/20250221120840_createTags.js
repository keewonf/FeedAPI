exports.up = knex => knex.schema.createTable("tags", table => {
  table.increments('id');
  table.text('name').notNullable();
  
  table.integer('user_id').references('id').inTable('users')
  table.integer('post_id').references('id').inTable('posts').onDelete("CASCADE");
});

exports.down = knex => knex.schema.dropTable("tags");
