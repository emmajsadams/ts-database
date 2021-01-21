import { Database } from '../types/Database'

/**
 * Executes database functions based on CLI input
 */
export function executeCommand(
	database: Database<string, string>,
	input: string,
): string {
	if (input.startsWith('SET')) {
		const parameters = input.split(' ')
		if (parameters.length !== 3) {
			return 'Recognized command SET, but invalid number of parameters specified'
		}

		const key = parameters[1]
		const value = parameters[2]

		database.set(key, value)

		return null
	}

	if (input.startsWith('GET')) {
		const parameters = input.split(' ')
		if (parameters.length !== 2) {
			return 'Recognized command GET, but invalid number of parameters specified'
		}

		const key = parameters[1]

		return database.get(key)
	}

	if (input.startsWith('DELETE')) {
		const parameters = input.split(' ')
		if (parameters.length !== 2) {
			return 'Recognized command DELETE, but invalid number of parameters specified'
		}

		const key = parameters[1]

		database.delete(key)
		return
	}

	if (input.startsWith('COUNT')) {
		const parameters = input.split(' ')
		if (parameters.length !== 2) {
			return 'Recognized command COUNT, but invalid number of parameters specified'
		}

		const value = parameters[1]

		return database.count(value).toString()
	}

	if (input === 'BEGIN') {
		database.beginTransaction()
		return null
	}

	if (input === 'ROLLBACK') {
		database.rollbackTransaction()
		return null
	}

	if (input === 'COMMIT') {
		database.commitTransactions()
		return null
	}

	return 'Unexpected Input. Nothing happened.'
}
