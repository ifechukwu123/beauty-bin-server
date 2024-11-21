/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
	return knex.schema.createTable("products", (table) => {
		table.increments("id").primary();
		table
			.integer("user_id")
			.unsigned()
			.references("users.id")
			.notNullable()
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table
			.integer("category_id")
			.unsigned()
			.references("categories.id")
			.notNullable()
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.string("name").notNullable();
		table.string("brand").notNullable();
		table.string("batchNumber");
		table.date("dateOpened").notNullable();
		table.date("expirationDate");
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
	return knex.schema.dropTable("products");
}
