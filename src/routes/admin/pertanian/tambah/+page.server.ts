import PertanianSchema from '$lib/schemas/pertanian-schema'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(PertanianSchema)) }
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

		const { lahanSawah, bobot } = form.data

		await db.pertanian.create({ data: { lahanSawah, bobot } })

		redirect(303, '/admin/pertanian')
	}
}
