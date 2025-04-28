import db from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const penghasilan = await db.penghasilan.findMany()

	return { penghasilan }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const id = Number(formData.get('id'))

		try {
			await db.penghasilan.delete({ where: { id } })

			return { success: 'Data berhasil dihapus!' }
		} catch {
			return { error: 'Data gagal dihapus!' }
		}
	}
}
