import { z } from 'zod'

export const BangunanRumahSchema = z.object({
	bangunan: z.string().min(1, 'Jenis bangunan harus diisi'),
	bobot: z.number().min(0, 'Bobot tidak boleh negatif')
})

export default BangunanRumahSchema
