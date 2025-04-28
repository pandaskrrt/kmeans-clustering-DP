<script lang="ts">
	import type { PageData } from './$types'
	import FormEdit from './FormEdit.svelte'

	export let data: PageData

	if (data.penghasilan) {
		data.form.data.penghasilan = data.penghasilan.penghasilan
		data.form.data.bobot = data.penghasilan.bobot
	}
</script>

{#if !data.penghasilan}
	<p>Data barang tidak ditemukan</p>
{:else}
	<div class="flex justify-center">
		<FormEdit data={data.form} id={data.penghasilan.id} />
	</div>
{/if}
