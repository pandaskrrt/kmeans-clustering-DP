import { z } from 'zod'

const DataWargaSchema = z.object({
	id: z.number().optional(),
	nama_warga: z.string().min(1, 'Nama warga diperlukan!'),
	nik: z.string().min(1, 'Nama warga diperlukan!'),
	jumlahKeluargaId: z.coerce.number({ message: 'ID jumlah keluarga diperlukan!' }),
	bangunanRumahId: z.coerce.number({ message: 'ID bangunan rumah diperlukan!' }),
	peternakanId: z.coerce.number({ message: 'ID peternakan diperlukan!' }),
	kendaraanId: z.coerce.number({ message: 'ID kendaraan diperlukan!' }),
	PertanianId: z.coerce.number({ message: 'ID pertanian diperlukan!' }),
	penghasilanId: z.coerce.number({ message: 'ID penghasilan diperlukan!' }),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional()
})

export default DataWargaSchema
