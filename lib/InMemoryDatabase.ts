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

}
