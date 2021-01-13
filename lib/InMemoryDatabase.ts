import Database from '../types/Database'

interface InMemoryDatabaseInstance<K, V> {
	values: Map<K, V>
	valueCounts: Map<K, number>
}
