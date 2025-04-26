<script lang="ts">
	import type { PageData } from './$types'
	import FormEdit from './FormEdit.svelte'

	export let data: PageData

	if (data.peternakan) {
		data.form.data.peternakan = data.peternakan.peternakan
		data.form.data.bobot = data.peternakan.bobot
	}
</script>

{#if !data.peternakan}
	<p>Data barang tidak ditemukan</p>
{:else}
	<div class="flex justify-center">
		<FormEdit data={data.form} id={data.peternakan.id} />
	</div>
{/if}
