import { z } from 'zod'

export const KendaraansSchema = z.object({
	kendaraan: z.string().min(1, 'Jenis kendaraan harus diisi'),
	bobot: z.number().min(0, 'Bobot tidak boleh negatif')
})

export default KendaraansSchema
