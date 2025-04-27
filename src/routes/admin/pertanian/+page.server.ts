import db from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const pertanian = await db.pertanian.findMany()

	return { pertanian }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const id = Number(formData.get('id'))

		try {
			await db.pertanian.delete({ where: { id } })

			return { success: 'Barang berhasil dihapus!' }
		} catch {
			return { error: 'Barang gagal dihapus!' }
		}
	}
}
