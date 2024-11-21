/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
	return knex.schema.createTable("notifications", (table) => {
		table.increments("id").primary();
		table
			.integer("user_id")
			.unsigned()
			.notNullable()
			.references("users.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table
			.integer("product_id")
			.unsigned()
			.notNullable()
			.references("products.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.string("type").notNullable();
		table.string("status").notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table
			.timestamp("updated_at")
			.defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
	return knex.schema.dropTable("notifications");
}
