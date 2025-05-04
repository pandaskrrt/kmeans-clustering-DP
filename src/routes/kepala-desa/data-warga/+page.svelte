<script lang="ts">
	import { Input } from '$lib/components/ui/input'
	import * as Table from '$lib/components/ui/table'
	import type { PageData } from './$types'
	import * as Pagination from '$lib/components/ui/pagination'

	let { data }: { data: PageData } = $props()
	let search = $state<string>('')
</script>

<div class="container mx-auto mt-10 max-w-7xl">
	<h2 class="title">Data Warga</h2>
	<div class="table-header">
		<div class="right-search">
			<Input type="text" placeholder="Cari Nama" bind:value={search} />
		</div>
	</div>

	<div class="table-wrapper">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[50px] text-center">No</Table.Head>
					<Table.Head>Nama Kepala</Table.Head>
					<Table.Head>NIK</Table.Head>
					<Table.Head>Jumlah Keluarga</Table.Head>
					<Table.Head>Peternakan</Table.Head>
					<Table.Head>Kendaraan</Table.Head>
					<Table.Head>Pertanian</Table.Head>
					<Table.Head>Penghasilan</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if data.dataWarga.length > 0}
					{#each data.dataWarga.filter((item) => item.nama_warga
							.toString()
							.toLowerCase()
							.includes(search.toLowerCase())) as item, index (item.id)}
						<Table.Row>
							<Table.Cell class="text-center">{index + 1}</Table.Cell>
							<Table.Cell>{item.nama_warga}</Table.Cell>
							<Table.Cell>{item.nik}</Table.Cell>
							<Table.Cell>{item.jumlahKeluarga?.jumlahKeluarga}</Table.Cell>
							<Table.Cell>{item.peternakan?.peternakan}</Table.Cell>
							<Table.Cell>{item.kendaraan?.kendaraan}</Table.Cell>
							<Table.Cell>{item.Pertanian?.lahanSawah}</Table.Cell>
							<Table.Cell>{item.penghasilan?.penghasilan}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={4} class="no-data text-center"
							>Data masih belum tersedia</Table.Cell
						>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

	.container {
		font-family: 'Poppins', sans-serif;
	}

	.title {
		margin-bottom: 1rem;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.table-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.right-search {
		display: flex;
		align-items: center;
		min-width: 250px;
	}

	.table-wrapper {
		overflow-x: auto;
		border-radius: 0.5rem;
	}

	@media (max-width: 768px) {
		.table-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.right-search {
			width: 100%;
		}
	}
</style>
