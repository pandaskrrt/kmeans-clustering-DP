<script lang="ts">
	import type { PageData } from './$types'
	import FormEdit from './FormEdit.svelte'

	export let data: PageData

	if (data.kendaraan) {
		data.form.data.kendaraan = data.kendaraan.kendaraan
		data.form.data.bobot = data.kendaraan.bobot
	}
</script>

{#if !data.kendaraan}
	<p>Data barang tidak ditemukan</p>
{:else}
	<div class="flex justify-center">
		<FormEdit data={data.form} id={data.kendaraan.id} />
	</div>
{/if}
