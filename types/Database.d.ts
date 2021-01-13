/**
 * A transactional database that can get, set, and delete key/value pairs. It can also count the number of values in those key/value pairs.
 * If a transaction is active then all CRUD operations apply to the current transaction, else they apply to the overall database.
 * Any number of transactions can be started or rolled back before committing them. Transactions are committed first in first out (FIFO).
 */
export interface Database<K, V> {
	/**
	 * Gets the value for the given key.
	 * If a transaction is active then this method gets the value from that transaction.
	 * If no transaction is active then this method gets the value from the database.
	 *
	 * @returns Value if it exists for the given key, else null.
	 */
	get(key: K): V | null

	/**
	 * Sets the given value for the given key.
	 * If a transaction is active then this method sets the value in that transaction.
	 * If no transaction is active then this method sets the value in the database.
	 * If a value exists in either case it is overwritten.
	 *
	 * @returns Overwritten value if it exists for the given key, else null.
	 */
	set(key: K, value: V): V | null

	/**
	 * Deletes the value for the given key.
	 * If a transaction is active then this method deletes the value in that transaction.
	 * If no transaction is active then this method deletes the value in the database.
	 * If no value exists in either case nothing will happen.
	 *
	 * @returns Deleted value if it exists, else null.
	 */
	delete(key: K): V | null

	/**
	 * Counts the number of keys that have the given value.
	 * If a transaction is active then the count occurs in that transaction.
	 * If no transaction is active then the count occurs in the database.
	 *
	 * @returns Number of keys that have the given value if the value exists at least once in the Database, else 0.
	 */
	count(value: V): number

	/**
	 * Begins a new transaction.
	 * If a transaction is active than that transaction is closed and a new transaction is opened with the state of that transaction.
	 * If no transaction exists then a new transaction is opened with the state of the database.
	 */
	beginTransaction(): void

	/**
	 * Discards all the changes in the current transaction and reverts to the previous transaction if it exists.
	 * If no previous transaction exists then reverts to no transaction normal database operations.
	 *
	 * @returns True if the current transaction was reverted, else false if no transaction is active.
	 */
	rollbackTransaction(): boolean

	/**
	 * Commits the changes of all existing transactions first in first out (FIFO) to the database and closes the current transaction.
	 *
	 * @returns True if transaction(s) were committed, else false if no transaction is active.
	 */
	commitTransactions(): boolean
}
