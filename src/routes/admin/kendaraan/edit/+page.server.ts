import KendaraanSchema from '$lib/schemas/kendaraan-schema'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const kendaraan = await db.kendaraan.findUnique({ where: { id } })

	return { kendaraan, form: await superValidate(zod(KendaraanSchema)) }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(KendaraanSchema))

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

		const { kendaraan, bobot } = form.data

		await db.kendaraan.update({
			where: { id: existingData.id },
			data: { kendaraan, bobot }
		})

		redirect(303, '/admin/kendaraan')
	}
}
