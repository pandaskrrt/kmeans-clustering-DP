import { z } from 'zod'

export const JumlahKeluargaSchema = z.object({
	jumlahKeluarga: z.string().min(1, 'Jumlah Keluarga diperlukan!'),
	bobot: z.number().min(1, 'Bobot tidak boleh negatif')
})

export default JumlahKeluargaSchema
