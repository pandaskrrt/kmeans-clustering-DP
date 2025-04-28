import DataWargaSchema from '$lib/schemas/data-warga-schema'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const dataWarga = await db.dataWarga.findUnique({ where: { id } })
	const jumlahKeluarga = await db.jumlahKeluarga.findMany()
	const bangunanRumah = await db.bangunanRumah.findMany()
	const peternakan = await db.peternakan.findMany()
	const pertanian = await db.pertanian.findMany()
	const kendaraan = await db.kendaraan.findMany()
	const penghasilan = await db.penghasilan.findMany()

	return {
		dataWarga,
		jumlahKeluarga,
		bangunanRumah,
		peternakan,
		pertanian,
		kendaraan,
		penghasilan,
		form: await superValidate(zod(DataWargaSchema))
	}
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(DataWargaSchema))

		if (!form.valid) {
			return fail(400, {
				form,
				message: ''
			})
		}

		const id = Number(event.url.searchParams.get('id'))
		const existingData = await db.dataWarga.findUnique({ where: { id } })

		if (!existingData) {
			return fail(404, {
				form,
				message: 'Data tidak ditemukan!'
			})
		}

		const {
			nama_warga,
			nik,
			jumlahKeluargaId,
			bangunanRumahId,
			peternakanId,
			PertanianId,
			kendaraanId,
			penghasilanId
		} = form.data

		await db.dataWarga.update({
			where: { id: existingData.id },
			data: {
				nama_warga,
				nik,
				jumlahKeluargaId,
				bangunanRumahId,
				peternakanId,
				PertanianId,
				kendaraanId,
				penghasilanId
			}
		})

		redirect(303, '/admin/data-warga')
	}
}
