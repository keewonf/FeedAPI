exports.up = knex => knex.schema.table("users", table => {
  table.enum("permission", ["owner", "mod", "member"], { useNative: true, enumName: "permissions"}).notNullable().default('member')

});

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('permission'); 
  });
};
