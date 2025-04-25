import JumlahKeluargaSchema from '$lib/schemas/jumlah-keluarga-schema'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const jumlahKeluarga = await db.jumlahKeluarga.findUnique({ where: { id } })

	return { jumlahKeluarga, form: await superValidate(zod(JumlahKeluargaSchema)) }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(JumlahKeluargaSchema))

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

		const { jumlahKeluarga, bobot } = form.data

		await db.jumlahKeluarga.update({
			where: { id: existingData.id },
			data: { jumlahKeluarga, bobot }
		})

		redirect(303, '/admin/data-jumlah-keluarga')
	}
}
