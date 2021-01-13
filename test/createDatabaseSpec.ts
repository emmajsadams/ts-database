import assert from 'assert'
import Database from '../types/Database'

/**
 * A generic set of string database tests that can be applied to any implementation of Database.
 */
export function createStringDatabaseSpec(
	createDatabase: () => Database<string, string>,
	databaseImplementationName: string,
) {
	describe(databaseImplementationName, function () {
		describe('#get()', function () {
			it('should return null for a key that does not exist in the database', function () {
				const database = createDatabase()

				assert.strictEqual(database.get('foo'), null)
			})
		})
	})
}
