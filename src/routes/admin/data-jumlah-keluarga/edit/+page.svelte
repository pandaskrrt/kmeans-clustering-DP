<script lang="ts">
	import type { PageData } from './$types'
	import FormEdit from './FormEdit.svelte'

	export let data: PageData

	if (data.jumlahKeluarga) {
		data.form.data.jumlahKeluarga = data.jumlahKeluarga.jumlahKeluarga
		data.form.data.bobot = data.jumlahKeluarga.bobot
	}
</script>

{#if !data.jumlahKeluarga}
	<p>Data barang tidak ditemukan</p>
{:else}
	<div class="flex justify-center">
		<FormEdit data={data.form} id={data.jumlahKeluarga.id} />
	</div>
{/if}
