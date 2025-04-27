import PertanianSchema from '$lib/schemas/pertanian-schema'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const pertanian = await db.pertanian.findUnique({ where: { id } })

	return { pertanian, form: await superValidate(zod(PertanianSchema)) }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(PertanianSchema))

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

		const { lahanSawah, bobot } = form.data

		await db.pertanian.update({
			where: { id: existingData.id },
			data: { lahanSawah, bobot }
		})

		redirect(303, '/admin/pertanian')
	}
}
