import { z } from 'zod'

export const PeternakanSchema = z.object({
	peternakan: z.string().min(1, 'Jenis peternakan harus diisi'),
	bobot: z.number().min(0, 'Bobot tidak boleh negatif')
})

export default PeternakanSchema
