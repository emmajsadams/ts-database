import Database from '../types/Database'

interface InMemoryDatabaseInstance<K, V> {
	values: Map<K, V>
	valueCounts: Map<K, number>
}

export default class InMemoryDatabase<K, V> implements Database<K, V> {
}
