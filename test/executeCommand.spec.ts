import assert from 'assert'
import sinon from 'sinon'
import { executeCommand } from '../lib/executeCommand'
import { InMemoryDatabase } from '../lib/InMemoryDatabase'
import { Database } from '../types/Database'

describe('executeCommand', function () {
	let database: Database<string, string>

	beforeEach(function () {
		database = new InMemoryDatabase<string, string>()
	})

	it('calls database.set when input is "SET"', function () {
		executeCommand(database, 'SET foo bar')

		assert.strictEqual(database.get('foo'), 'bar')
	})

	it('returns error when input starts with "SET" but contains invalid parameters', function () {
		const actualReturn = executeCommand(database, 'SET foo')

		assert.strictEqual(
			actualReturn,
			'Recognized command SET, but invalid number of parameters specified',
		)
	})

	it('calls database.get when input is "GET"', function () {
		database.set('foo', 'bar')

		const actualReturn = executeCommand(database, 'GET foo')

		assert.strictEqual(actualReturn, 'bar')
	})

	it('returns error when input starts with "GET" but contains invalid parameters', function () {
		const actualReturn = executeCommand(database, 'GET foo bar')

		assert.strictEqual(
			actualReturn,
			'Recognized command GET, but invalid number of parameters specified',
		)
	})

	it('calls database.delete when input is "DELETE"', function () {
		database.set('foo', 'bar')

		executeCommand(database, 'DELETE foo')

		assert.strictEqual(database.get('foo'), null)
	})

	it('returns error when input starts with "DELETE" but contains invalid parameters', function () {
		const actualReturn = executeCommand(database, 'DELETE foo bar')

		assert.strictEqual(
			actualReturn,
			'Recognized command DELETE, but invalid number of parameters specified',
		)
	})

	it('calls database.count when input is "COUNT"', function () {
		database.set('foo', 'bar')
		database.set('emma', 'bar')

		const actualReturn = executeCommand(database, 'COUNT bar')

		assert.strictEqual(actualReturn, '2')
	})

	it('returns error when input starts with "COUNT" but contains invalid parameters', function () {
		const actualReturn = executeCommand(database, 'COUNT foo bar')

		assert.strictEqual(
			actualReturn,
			'Recognized command COUNT, but invalid number of parameters specified',
		)
	})

	it('calls database.beginTransaction when input is "BEGIN"', function () {
		sinon.spy(database)

		executeCommand(database, 'BEGIN')

		assert.ok((database.beginTransaction as sinon.spy).calledOnceWith())
	})

	it('calls database.rollbackTransaction when input is "BEGIN"', function () {
		sinon.spy(database)

		executeCommand(database, 'ROLLBACK')

		assert.ok((database.rollbackTransaction as sinon.spy).calledOnceWith())
	})

	it('calls database.commitTransactions when input is "COMMIT"', function () {
		sinon.spy(database)

		executeCommand(database, 'COMMIT')

		assert.ok((database.commitTransactions as sinon.spy).calledOnceWith())
	})

	it('returns error when command is not recognized', function () {
		const actualReturn = executeCommand(database, 'EMMA foo bar')

		assert.strictEqual(actualReturn, 'Unexpected Input. Nothing happened.')
	})
})
