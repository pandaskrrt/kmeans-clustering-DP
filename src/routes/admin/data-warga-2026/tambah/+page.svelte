<script lang="ts">
	import type { ActionData, PageData } from './$types'
	import FormTambah from './FormTambah.svelte'

	export let data: PageData
	export let form: ActionData
</script>

<div class="flex justify-center">
	<FormTambah
		data={data.form}
		jumlahkeluarga={data.jumlahKeluarga}
		bangunanRumah={data.bangunanRumah}
		peternakan={data.peternakan}
		pertanian={data.pertanian}
		kendaraan={data.kendaraan}
		penghasilan={data.penghasilan}
		message={form?.message}
	/>
</div>
