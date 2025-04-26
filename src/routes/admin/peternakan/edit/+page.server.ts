import PetenrakanSchema from '$lib/schemas/peternakan-schema'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'
import PeternakanSchema from '$lib/schemas/kendaraan-schema'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const peternakan = await db.peternakan.findUnique({ where: { id } })

	return { peternakan, form: await superValidate(zod(PeternakanSchema)) }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(PeternakanSchema))

		if (!form.valid) {
			return fail(400, {
				form,
				message: ''
			})
		}

		const id = Number(event.url.searchParams.get('id'))
		const existingData = await db.peternakan.findUnique({ where: { id } })

		if (!existingData) {
			return fail(404, {
				form,
				message: 'Data tidak ditemukan!'
			})
		}

		const { peternakan, bobot } = form.data

		await db.peternakan.update({
			where: { id: existingData.id },
			data: { peternakan, bobot }
		})

		redirect(303, '/admin/peternakan')
	}
}
