import readline from 'readline'
import { executeCommand } from '../lib/executeCommand'
import { Database } from '../types/Database'

export function connect(database: Database<string, string>): void {
	const readlineInterface = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})
	readlineInterface.on('close', () => {
		console.log('\nEnding connection!')
		process.exit(0)
	})

	promptCommand(database, readlineInterface)
}

function promptCommand(
	database: Database<string, string>,
	readlineInterface: readline.Interface,
): void {
	readlineInterface.question('>> ', (input) => {
		if (input === 'END') {
			process.exit(0)
		} else {
			const output = executeCommand(database, input)
			if (output) {
				console.log(output)
			}
			promptCommand(database, readlineInterface)
		}
	})
}
