import PeternakanSchema from '$lib/schemas/peternakan-schema'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(PeternakanSchema)) }
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

		const { peternakan, bobot } = form.data

		await db.peternakan.create({ data: { peternakan, bobot } })

		redirect(303, '/admin/peternakan')
	}
}
