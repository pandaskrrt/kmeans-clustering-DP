import JumlahKeluargaSchema from '$lib/schemas/jumlah-keluarga-schema'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(JumlahKeluargaSchema)) }
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

		const { jumlahKeluarga, bobot } = form.data

		await db.jumlahKeluarga.create({ data: { jumlahKeluarga, bobot } })

		redirect(303, '/admin/data-jumlah-keluarga')
	}
}
