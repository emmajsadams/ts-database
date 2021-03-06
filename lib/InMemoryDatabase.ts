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

	/**
	 * O(1) runtime where n is the number of keys.
	 * O(1) runtime where n is the number of keys in the transaction, if a transaction exists.
	 * O(1) runtime where n is the number of transactions.
	 */
	set(key: K, value: V): V | null {
		const overwrittenValue = this.get(key)
		const values = this.getCurrentValues()
		const valueCounts = this.getCurrentValueCounts()

		// If a previous value for the given key exists we need to update the valueCounts
		if (overwrittenValue) {
			const overwrittenValueCount = valueCounts.has(overwrittenValue)
				? valueCounts.get(overwrittenValue) - 1
				: -1

			// In transactions we allow negative value counts due to how count sums transaction + database valueCounts,
			// but if we have no transaction we should just remove the value key from the database valueCounts
			if (this.inTransaction() || overwrittenValueCount > 0) {
				valueCounts.set(overwrittenValue, overwrittenValueCount)
			} else {
				valueCounts.delete(overwrittenValue)
			}
		}

		// Finally, the valueCounts must be updated on each set for the newly set value in order for count() to return the correct value
		const previousValueCount = valueCounts.has(value)
			? valueCounts.get(value)
			: 0
		valueCounts.set(value, previousValueCount + 1)
		values.set(key, value)

		return overwrittenValue
	}

	/**
	 * O(1) runtime where n is the number of keys.
	 * O(1) runtime where n is the number of keys in the transaction, if a transaction exists.
	 * O(1) runtime where n is the number of transactions.
	 */
	delete(key: K): V | null {
		// For a key that does not exist we can safely do nothing since values and valueCounts will remain the same.
		const value = this.get(key)
		if (!value) {
			return null
		}

		const values = this.getCurrentValues()
		const valueCounts = this.getCurrentValueCounts()
		const valueCount = valueCounts.has(value) ? valueCounts.get(value) - 1 : -1

		// In transactions we allow negative value counts due to how count sums transaction + database value counts,
		// but if we have no transaction we should just remove the value key from the database valueCounts
		if (this.inTransaction() || valueCount > 0) {
			valueCounts.set(value, valueCount)
		} else {
			valueCounts.delete(value)
		}

		// In transactions we want to explicitly set the key to null so that if the transaction is committed we know that
		// the value should be removed from the database. If we are not in a transaction than we can just delete the key.
		if (this.inTransaction()) {
			values.set(key, null)
		} else {
			values.delete(key)
		}

		return value
	}

	/**
	 * O(1) runtime where n is the number of keys.
	 * O(1) runtime where n is the number of keys in the transaction, if a transaction exists.
	 * O(1) runtime where n is the number of transactions.
	 */
	count(value: V): number {
		const databaseCount = this.databaseInstance.valueCounts.has(value)
			? this.databaseInstance.valueCounts.get(value)
			: 0

		// If there is no transaction we know the database count is accurate
		if (!this.inTransaction()) {
			return databaseCount
		}

		// If there is a transaction we need to add the database value count to the transaction value count since
		// count must reflect the current state of the transaction
		const valueCounts = this.getCurrentValueCounts()
		const transactionCount = valueCounts.has(value) ? valueCounts.get(value) : 0

		return databaseCount + transactionCount
	}

	/**
	 * Database state is not copied upon creating a new transaction, but the current transaction state if it exists is copied.
	 * O(1) runtime where n is the number of items.
	 * O(n) runtime where n is the number of items in the transaction, if a transaction exists.
	 * O(1) runtime where n is the number of transactions.
	 */
	beginTransaction(): void {
		let newTransactionValues: Map<K, V>
		let newTransactionValueCounts: Map<V, number>

		// If we are in a transaction we copy the previous transaction state to avoid the need to iterate through
		// the whole transactions array to get the current state of all transactions. Otherwise we create empty maps
		// since we do not want to copy the full database instance into the first transaction due to the space concerns.
		if (this.inTransaction()) {
			newTransactionValues = new Map<K, V>(this.getCurrentValues())
			newTransactionValueCounts = new Map<V, number>(
				this.getCurrentValueCounts(),
			)
		} else {
			newTransactionValues = new Map<K, V>()
			newTransactionValueCounts = new Map<V, number>()
		}

		this.transactions.push({
			values: newTransactionValues,
			valueCounts: newTransactionValueCounts,
		})
	}

	/**
	 * O(1) runtime where n is the number of items.
	 * O(1) runtime where n is the number of items in the transaction, if a transaction exists.
	 * O(1) runtime where n is the number of transactions.
	 */
	rollbackTransaction(): boolean {
		if (!this.inTransaction()) {
			return false
		}

		this.transactions.pop()

		return true
	}

	/**
	 * O(1) runtime where n is the number of items.
	 * O(n) runtime where n is the number of items in the transaction, if a transaction exists.
	 * O(1) runtime where n is the number of transactions.
	 */
	commitTransactions(): boolean {
		if (!this.inTransaction()) {
			return false
		}

		// Since the current transaction state contains the state from previous transactions we only need to focus
		// on committing the current transaction.

		const values = this.getCurrentValues()
		for (const [key, transactionValue] of values) {
			if (transactionValue === null) {
				this.databaseInstance.values.delete(key)
			} else {
				this.databaseInstance.values.set(key, transactionValue)
			}
		}

		const valueCounts = this.getCurrentValueCounts()
		for (const [value, transactionValueCount] of valueCounts) {
			const databaseValueCount = this.databaseInstance.valueCounts.has(value)
				? this.databaseInstance.valueCounts.get(value)
				: 0
			const finalValueCount = databaseValueCount + transactionValueCount

			// We want to remove valueCounts below zero because that indicates the item was deleted. Otherwise
			// our valueCounts would slowly grow over time from deleted keys in transactions no longer used.
			if (finalValueCount > 0) {
				this.databaseInstance.valueCounts.set(value, finalValueCount)
			} else {
				this.databaseInstance.valueCounts.delete(value)
			}
		}

		// Once we have committed the current transaction we want to be sure to remove all transactions
		// so that if commit is called again the same transactions will not be committed again.
		this.transactions = []

		return true
	}

	/**
	 * O(1) runtime where n is the number of items.
	 * O(1) runtime where n is the number of items in the transaction, if a transaction exists.
	 * O(1) runtime where n is the number of transactions.
	 */
	private getCurrentValues(): Map<K, V> {
		if (this.inTransaction()) {
			return this.transactions[this.transactions.length - 1].values
		}

		return this.databaseInstance.values
	}

	/**
	 * O(1) runtime where n is the number of items.
	 * O(1) runtime where n is the number of items in the transaction, if a transaction exists.
	 * O(1) runtime where n is the number of transactions.
	 */
	private getCurrentValueCounts(): Map<V, number> {
		if (this.inTransaction()) {
			return this.transactions[this.transactions.length - 1].valueCounts
		}

		return this.databaseInstance.valueCounts
	}

	/**
	 * O(1) runtime where n is the number of items.
	 * O(1) runtime where n is the number of items in the transaction, if a transaction exists.
	 * O(1) runtime where n is the number of transactions.
	 */
	private inTransaction(): boolean {
		return this.transactions.length > 0
	}
}
