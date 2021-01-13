import assert from 'assert'
import { Database } from '../types/Database'

/**
 * A generic set of string database tests that can be applied to any implementation of Database.
 */
export function createStringDatabaseSpec(
	createDatabase: () => Database<string, string>,
	databaseImplementationName: string,
) {
	describe(databaseImplementationName, () => {
		let database: Database<string, string>

		beforeEach(() => {
			database = createDatabase()
		})

		it('should return null for a key that does not exist in the database', () => {
			assert.strictEqual(database.get('key'), null)
		})

		it('should return null for a key that does not exist in the database or the active transaction', () => {
			database.beginTransaction()

			assert.strictEqual(database.get('key'), null)
		})

		it('should return value for a key that does exist in the database', () => {
			database.set('key', 'value')

			assert.strictEqual(database.get('key'), 'value')
		})

		it('should return transaction value for a key that does exist in the database and the transaction', () => {
			database.set('key', 'value')
			database.beginTransaction()
			database.set('key', 'value2')

			assert.strictEqual(database.get('key'), 'value2')
		})

		it('should return the last value for a set key', () => {
			database.set('key', 'value')
			database.set('key', 'value3')

			assert.strictEqual(database.get('key'), 'value3')
		})

		it('should return value for a set key in a transaction', () => {
			database.beginTransaction()
			database.set('key', 'value')

			assert.strictEqual(database.get('key'), 'value')
		})

		it('should return database value after committing a transaction value', () => {
			database.set('key', 'value2')
			database.beginTransaction()
			database.set('key', 'value')
			database.commitTransactions()

			assert.strictEqual(database.get('key'), 'value')
		})

		it('should return database value after setting a value in a rolled back transaction', () => {
			database.set('key', 'value2')
			database.beginTransaction()
			database.set('key', 'value')
			database.rollbackTransaction()

			assert.strictEqual(database.get('key'), 'value2')
		})

		it('should return database value after setting a value in multiple rolled back transactions', () => {
			database.set('key', 'value2')
			database.beginTransaction()
			database.set('key', 'value')
			database.beginTransaction()
			database.set('key', 'value3')
			database.rollbackTransaction()
			database.rollbackTransaction()

			assert.strictEqual(database.get('key'), 'value2')
		})

		it('should delete database value', () => {
			database.set('key', 'value2')
			database.delete('key')

			assert.strictEqual(database.get('key'), null)
		})

		it('should delete transaction value if in transaction', () => {
			database.set('key', 'value2')
			database.beginTransaction()
			database.delete('key')

			assert.strictEqual(database.get('key'), null)
		})

		it('should rollback delete if in transaction and transaction is rolled back', () => {
			database.set('key', 'value2')
			database.beginTransaction()
			database.delete('key')
			database.rollbackTransaction()

			assert.strictEqual(database.get('key'), 'value2')
		})

		it('should commit delete from transaction', () => {
			database.set('key', 'value2')
			database.beginTransaction()
			database.delete('key')
			database.commitTransactions()

			assert.strictEqual(database.get('key'), null)
		})

		it('should commit nothing from transaction where value was set and deleted ', () => {
			database.beginTransaction()
			database.set('key', 'value')
			database.delete('key')
			database.commitTransactions()

			assert.strictEqual(database.get('key'), null)
		})

		it('should do nothing if the key does not exist when calling delete', () => {
			database.delete('key')

			assert.strictEqual(database.get('key'), null)
		})

		it('delete() should return previous value when deleting a set value', () => {
			database.set('key', 'value')

			assert.strictEqual(database.delete('key'), 'value')
		})

		it('set() should return previous value when setting a set value', () => {
			database.set('key', 'value')

			assert.strictEqual(database.set('key', 'value2'), 'value')
		})

		it('count should equal 0 for a unset value', () => {
			database.set('key', 'value2')

			assert.strictEqual(database.count('value'), 0)
		})

		it('count should equal 0 for a unset value in a transaction', () => {
			database.set('key', 'value2')
			database.beginTransaction()

			assert.strictEqual(database.count('value'), 0)
		})

		it('count should equal 1 for a set value', () => {
			database.set('key', 'value')

			assert.strictEqual(database.count('value'), 1)
		})

		it('count should equal 2 for a value set twice', () => {
			database.set('key', 'value')
			database.set('value2', 'value')

			assert.strictEqual(database.count('value'), 2)
		})

		it('count should equal 0 for a value overwritten in a transaction', () => {
			database.set('key', 'value')
			database.beginTransaction()
			database.set('key', 'value2')

			assert.strictEqual(database.count('value'), 0)
		})

		it('count should equal 1 for a value overwritten', () => {
			database.set('key', 'value')
			database.set('key', 'value2')

			assert.strictEqual(database.count('value'), 0)
			assert.strictEqual(database.count('value2'), 1)
		})

		it('count should equal 1 for a value overwritten in a transaction', () => {
			database.beginTransaction()
			database.set('key', 'value')
			database.set('key', 'value2')

			assert.strictEqual(database.count('value'), 0)
			assert.strictEqual(database.count('value2'), 1)
		})

		it('count should equal 0 for a value deleted in a transaction', () => {
			database.set('key', 'value')
			database.beginTransaction()
			database.delete('key')

			assert.strictEqual(database.count('value'), 0)
		})

		it('count should equal 1 for a value overwritten in a transaction', () => {
			database.beginTransaction()
			database.set('key', 'value')
			database.set('key', 'value2')
			database.commitTransactions()

			assert.strictEqual(database.count('value'), 0)
			assert.strictEqual(database.count('value2'), 1)
		})

		it('rollbackTransaction should do nothing if no transaction is active', () => {
			assert.strictEqual(database.rollbackTransaction(), false)
		})

		it('rollbackTransaction should return true if a transaction is active', () => {
			database.beginTransaction()

			assert.strictEqual(database.rollbackTransaction(), true)
		})

		it('commitTransactions should do nothing if no transaction is active', () => {
			assert.strictEqual(database.commitTransactions(), false)
		})

		it('commitTransactions should return true if a transaction is active', () => {
			database.beginTransaction()

			assert.strictEqual(database.commitTransactions(), true)
		})

		it('commitTransactions should remove all active transactions', () => {
			database.beginTransaction()
			database.set('key', 'value')
			database.set('key', 'value2')
			database.commitTransactions()

			assert.strictEqual(database.commitTransactions(), false)
		})
	})
}
