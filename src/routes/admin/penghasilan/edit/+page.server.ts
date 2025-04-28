import PenghasilanSchema from '$lib/schemas/penghasilan-schema'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const penghasilan = await db.penghasilan.findUnique({ where: { id } })

	return { penghasilan, form: await superValidate(zod(PenghasilanSchema)) }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(PenghasilanSchema))

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

		const { penghasilan, bobot } = form.data

		await db.penghasilan.update({
			where: { id: existingData.id },
			data: { penghasilan, bobot }
		})

		redirect(303, '/admin/penghasilan')
	}
}
