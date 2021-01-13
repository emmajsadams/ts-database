import { InMemoryDatabase } from '../lib/InMemoryDatabase'
import { connect } from './connect'

connect(new InMemoryDatabase<string, string>())
