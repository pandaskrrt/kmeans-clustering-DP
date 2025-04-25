import { z } from 'zod'

export const PenghasilanSchema = z.object({
	penghasilan: z.string().min(1, 'Range penghasilan harus diisi'),
	bobot: z.number().min(0, 'Bobot tidak boleh negatif')
})

export default PenghasilanSchema
