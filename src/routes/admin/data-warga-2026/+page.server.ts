import db from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const startDate = new Date('2026-01-01')
	const endDate = new Date('2026-12-31')

	const dataWarga = await db.dataWarga.findMany({
		where: {
			createdAt: {
				gte: startDate,
				lte: endDate
			}
		},
		include: {
			jumlahKeluarga: true,
			bangunanRumah: true,
			peternakan: true,
			Pertanian: true,
			kendaraan: true,
			penghasilan: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	})

	return { dataWarga }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const id = Number(formData.get('id'))

		try {
			await db.dataWarga.delete({ where: { id } })

			return { success: 'Data warga berhasil dihapus!' }
		} catch {
			return { error: 'Data warga gagal dihapus!' }
		}
	}
}
