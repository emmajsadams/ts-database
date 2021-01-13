import Database from '../types/Database'

interface InMemoryDatabaseInstance<K, V> {
	values: Map<K, V>
	valueCounts: Map<K, number>
}

export default class InMemoryDatabase<K, V> implements Database<K, V> {

	get(key: K): V | null {
		// if currentTransaction exists get the value from the transaction first. if the value in the transaction is null be sure to return null since that means the key will be removed from the database instance if present.
		// if no transaction get the value from the databaseInstance.
		// if no value exists in either the transaction or the databaseInstance return null
		return null
	}
	set(key: K, value: V): V | null {
		// if currentTransaction exists set the value in the transaction
		// if no transaction set the value in the databaseInstance
		// for both cases if there is an existing value add one from the valueCounts for either the transaction or the dataabaseInstance
		// for both cases return the existing value if it exists

		return null
	}

	delete(key: K): V | null {
		// if currentTransaction exists set the value to null. a null value for a key means that it should be removed from the databaseInstance once committed and that it does not exist when using set or count
		// if no transaction call delete on databaseInstance.
		// for both cases if there is an existing value subtract one from the valueCounts for either the transaction or the dataabaseInstance
		// for both cases return the existing value
		return null
	}

	count(value: V): number {
		// if currentTransaction exists add the valueCounts from the transaction to the databaseInstance valueCounts
		// if no transaction get the databaseInstance.valueCounts
		// in either case if the value does not exist in the Database then return zero.

		return 0
	}
}
