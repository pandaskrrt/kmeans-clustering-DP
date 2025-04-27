<script lang="ts">
	import type { PageData } from './$types'
	import FormEdit from './TambahEdit.svelte'

	export let data: PageData

	if (data.pertanian) {
		data.form.data.lahanSawah = data.pertanian.lahanSawah
		data.form.data.bobot = data.pertanian.bobot
	}
</script>

{#if !data.pertanian}
	<p>Data barang tidak ditemukan</p>
{:else}
	<div class="flex justify-center">
		<FormEdit data={data.form} id={data.pertanian.id} />
	</div>
{/if}
