import InMemoryDatabase from '../lib/InMemoryDatabase'
import { createStringDatabaseSpec } from './createDatabaseSpec'

createStringDatabaseSpec(
	() => new InMemoryDatabase<string, string>(),
	'InMemoryDatabase',
)
