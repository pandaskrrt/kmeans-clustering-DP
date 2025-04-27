import { z } from 'zod'

export const PertanianSchema = z.object({
	lahanSawah: z.string().min(1, 'Range lahanSawah harus diisi'),
	bobot: z.number().min(0, 'Bobot tidak boleh negatif')
})

export default PertanianSchema
