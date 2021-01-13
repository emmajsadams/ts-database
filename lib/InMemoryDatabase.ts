import { Database } from '../types/Database'

interface InMemoryDatabaseInstance<K, V> {
	values: Map<K, V>
	valueCounts: Map<V, number>
}

export class InMemoryDatabase<K, V> implements Database<K, V> {
	private databaseInstance: InMemoryDatabaseInstance<K, V>
	private transactions: InMemoryDatabaseInstance<K, V>[]

	constructor() {
		this.databaseInstance = {
			values: new Map<K, V>(),
			valueCounts: new Map<V, number>(),
		}
		this.transactions = []
	}

	/**
	 * O(1) runtime where n is the number of keys.
	 * O(1) runtime where n is the number of keys in the transaction, if a transaction exists.
	 * O(1) runtime where n is the number of transactions.
	 */
	get(key: K): V | null {
		// Get the database value for the key if it exists.
		let value = this.databaseInstance.values.has(key)
			? this.databaseInstance.values.get(key)
			: null

		// Get the transaction value for the key if in a transaction, defaulting to the database value if the key does not exist.
		if (this.inTransaction()) {
			const values = this.getCurrentValues()
			value = values.has(key) ? values.get(key) : value
	}

		return value
	}

	set(key: K, value: V): V | null {
		// if currentTransaction exists set the value in the transaction
		// if no transaction set the value in the databaseInstance
		// for both cases if there is an existing value add one from the valueCounts for either the transaction or the databaseInstance
		// for both cases return the existing value if it exists

		return null
	}

	delete(key: K): V | null {
		// if currentTransaction exists set the value to null. a null value for a key means that it should be removed from the databaseInstance once committed and that it does not exist when using set or count
		// if no transaction call delete on databaseInstance.
		// for both cases if there is an existing value subtract one from the valueCounts for either the transaction or the databaseInstance
		// for both cases return the existing value

		return null
	}

	count(value: V): number {
		// if currentTransaction exists add the valueCounts from the transaction to the databaseInstance valueCounts
		// if no transaction get the databaseInstance.valueCounts
		// in either case if the value does not exist in the Database then return zero.

		return 0
	}

	beginTransaction(): void {
		// copy the previous transaction. if none create a new map. DO NOT COPY THE FULL DATABASE INSTANCE
		// add to transactions array as last transaction
	}

	rollbackTransaction(): boolean {
		// if in transaction then remove the last transaction from the list.
		// this makes the currentTransaction now the previousTransaction or reverts to no transaction mode
		return false
	}

	commitTransactions(): number {
		// if in transaction iterate through all keys in the transaction.values and transaction.valueCounts setting them in the database.
		// note this only needs to occur for the current transaction since it has all the state of the previous transaction.
		return 0
	}

	private getCurrentTransaction(): InMemoryDatabaseInstance<K, V> | null {
		// if inTransaction then return last transaction in the transactions array
		// else return null

		if (this.inTransaction()) {
			return this.transactions[this.transactions.length - 1]
		}

		return null
	}

	private inTransaction(): boolean {
		return this.transactions.length > 0
	}
}
