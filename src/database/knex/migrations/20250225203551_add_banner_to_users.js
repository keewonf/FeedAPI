exports.up = knex => knex.schema.table("users", table => {
    table.string('banner').nullable()
 
});

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('banner');  // Remove a coluna 'banner' se a migration for revertida
  });
};