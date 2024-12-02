/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
	return knex.schema.createTable("wishlist", (table) => {
		table.increments("id").primary();
		table
			.integer("user_id")
			.unsigned()
			.notNullable()
			.references("users.id")
			.onDelete("CASCADE")
			.onUpdate("CASCADE");
		table.integer("product_id").unsigned().notNullable();
		table.string("name").notNullable();
		table.string("image").notNullable();
		table.string("brand").notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
	return knex.schema.dropTable("wishlist");
}
