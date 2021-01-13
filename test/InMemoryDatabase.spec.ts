import assert from 'assert'
import InMemoryDatabase from '../lib/InMemoryDatabase'

describe('InMemoryDatabase', function () {
	describe('#get()', function () {
		it('should return null for a key that does not exist in the database', function () {
			const database = new InMemoryDatabase<string, string>()

			assert.equal(database.get('foo'), null)
		})
	})
})
