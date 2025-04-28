import PenghasilanSchema from '$lib/schemas/penghasilan-schema'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(PenghasilanSchema)) }
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

		const { penghasilan, bobot } = form.data

		await db.penghasilan.create({ data: { penghasilan, bobot } })

		redirect(303, '/admin/penghasilan')
	}
}
