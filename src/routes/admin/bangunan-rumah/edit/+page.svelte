<script lang="ts">
	import type { PageData } from './$types'
	import FormEdit from './FormEdit.svelte'

	export let data: PageData

	if (data.bangunanRumah) {
		data.form.data.bangunan = data.bangunanRumah.bangunan
		data.form.data.bobot = data.bangunanRumah.bobot
	}
</script>

{#if !data.bangunanRumah}
	<p>Data barang tidak ditemukan</p>
{:else}
	<div class="flex justify-center">
		<FormEdit data={data.form} id={data.bangunanRumah.id} />
	</div>
{/if}
