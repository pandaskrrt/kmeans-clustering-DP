import db from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const dataWarga = await db.dataWarga.findMany({
		include: {
			jumlahKeluarga: true,
			bangunanRumah: true,
			peternakan: true,
			Pertanian: true,
			kendaraan: true,
			penghasilan: true
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

			return { success: 'Barang berhasil dihapus!' }
		} catch {
			return { error: 'Barang gagal dihapus!' }
		}
	}
}
