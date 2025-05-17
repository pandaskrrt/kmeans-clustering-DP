<script lang="ts">
	import type { PageData } from './$types'
	import FormEdit from './FormEdit.svelte'

	export let data: PageData

	if (data.dataWarga) {
		data.form.data = {
			nama_warga: data.dataWarga.nama_warga,
			nik: data.dataWarga.nik,
			jumlahKeluargaId: data.dataWarga.jumlahKeluargaId,
			bangunanRumahId: data.dataWarga.bangunanRumahId,
			peternakanId: data.dataWarga.peternakanId,
			PertanianId: data.dataWarga.PertanianId,
			kendaraanId: data.dataWarga.kendaraanId,
			penghasilanId: data.dataWarga.penghasilanId
		}
	}
</script>

{#if !data.dataWarga}
	<p class="p-4 text-red-600">Data produk tidak ditemukan</p>
{:else}
	<div class="flex justify-center p-4">
		<FormEdit
			data={data.form}
			jumlahkeluarga={data.jumlahKeluarga}
			bangunanRumah={data.bangunanRumah}
			peternakan={data.peternakan}
			pertanian={data.pertanian}
			kendaraan={data.kendaraan}
			penghasilan={data.penghasilan}
			message={data.message}
		/>
	</div>
{/if}
