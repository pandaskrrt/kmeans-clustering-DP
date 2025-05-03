import { hash } from '@node-rs/argon2'
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
	// Hash password for admin
	const adminHashedPassword = await hash('asdfasdf', {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	})

	// Hash password for kepala desa
	const kepalaDesaHashedPassword = await hash('kepaladesabisa', {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	})

	await db.user.create({
		data: {
			name: 'Arshee Vincent',
			username: 'admin',
			password: adminHashedPassword,
			role: 'ADMIN',
			verified: true
		}
	})

	// Create kepala desa user
	await db.user.create({
		data: {
			name: 'Kepala Desa',
			username: 'kepaladesa',
			password: kepalaDesaHashedPassword,
			role: 'KADES',
			verified: true
		}
	})
}

main()
	.then(async () => {
		await db.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await db.$disconnect()
		process.exit(1)
	})
