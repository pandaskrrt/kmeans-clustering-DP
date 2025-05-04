import { SECRET_JWT_TOKEN } from '$env/static/private'
import LoginUserSchema from '$lib/schemas/login-user'
import db from '$lib/server/db'
import { verify } from '@node-rs/argon2'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) {
		switch (locals.session.role) {
			case 'ADMIN':
				redirect(302, '/admin')
			case 'KADES':
				redirect(302, '/kepala-desa')
			case 'USER':
				redirect(302, '/dashboard')
		}
	}

	return { form: await superValidate(zod(LoginUserSchema)) }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(LoginUserSchema))

		if (!form.valid) {
			return fail(400, {
				form,
				message: ''
			})
		}

		const { username, password } = form.data

		const userExist = await db.user.findUnique({ where: { username } })

		if (!userExist) {
			return fail(400, {
				form,
				message: 'Username atau password salah!'
			})
		}

		const isPasswordRight = await verify(userExist.password, password)

		if (!isPasswordRight) {
			return fail(400, {
				form,
				message: 'Username atau password salah!'
			})
		}

		const authToken = await jwt.sign(
			{
				id: userExist.id,
				username: userExist.username,
				role: userExist.role
			},
			SECRET_JWT_TOKEN,
			{ expiresIn: '24h' }
		)

		event.cookies.set('authToken', authToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 // 24 jam
		})

		// Redirect berdasarkan role
		switch (userExist.role) {
			case 'ADMIN':
				redirect(303, '/admin')
			case 'KADES':
				redirect(303, '/kepala-desa')
			default:
				redirect(303, '/dashboard')
		}
	}
}
