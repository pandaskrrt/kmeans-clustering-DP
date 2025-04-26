import BangunanRumahSchema from '$lib/schemas/bangunan-rumah-schema'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const bangunanRumah = await db.bangunanRumah.findUnique({ where: { id } })

	return { bangunanRumah, form: await superValidate(zod(BangunanRumahSchema)) }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(BangunanRumahSchema))

		if (!form.valid) {
			return fail(400, {
				form,
				message: ''
			})
		}

		const id = Number(event.url.searchParams.get('id'))
		const existingData = await db.jumlahKeluarga.findUnique({ where: { id } })

		if (!existingData) {
			return fail(404, {
				form,
				message: 'Data tidak ditemukan!'
			})
		}

		const { bangunan, bobot } = form.data

		await db.bangunanRumah.update({
			where: { id: existingData.id },
			data: { bangunan, bobot }
		})

		redirect(303, '/admin/data-jumlah-keluarga')
	}
}
