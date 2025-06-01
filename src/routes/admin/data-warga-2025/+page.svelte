<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import * as Table from '$lib/components/ui/table'
	import * as Pagination from '$lib/components/ui/pagination'
	import Plus from 'lucide-svelte/icons/plus'
	import ChevronLeftIcon from 'lucide-svelte/icons/chevron-left'
	import ChevronRightIcon from 'lucide-svelte/icons/chevron-right'
	import { enhance } from '$app/forms'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let search = $state<string>('')
	let currentPage = $state<number>(1)
	const perPage = 10
	const siblingCount = 1

	// Filter data based on search
	const filteredData = $derived(
		data.dataWarga.filter((item) =>
			item.nama_warga.toString().toLowerCase().includes(search.toLowerCase())
		)
	)
	// Total items for pagination
	const totalItems = $derived(filteredData.length)
	// Paginated data for current page
	const paginatedData = $derived(
		filteredData.slice((currentPage - 1) * perPage, currentPage * perPage)
	)
</script>

<div class="container">
	<h2 class="title">Data Warga</h2>

	<div class="table-header">
		<div class="left-toolbar">
			<Button href="/admin/data-warga-2025/tambah">
				<Plus class="icon" />
				<span>Tambahkan Data</span>
			</Button>
		</div>
		<div class="right-search">
			<Input type="text" placeholder="Cari Nama" bind:value={search} />
		</div>
	</div>

	<div class="table-wrapper">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[50px] text-center">No</Table.Head>
					<Table.Head>Tanggal Input</Table.Head>
					<Table.Head>Nama Kepala</Table.Head>
					<Table.Head>NIK</Table.Head>
					<Table.Head>Jumlah Keluarga</Table.Head>
					<Table.Head>Peternakan</Table.Head>
					<Table.Head>Kendaraan</Table.Head>
					<Table.Head>Pertanian</Table.Head>
					<Table.Head>Penghasilan</Table.Head>
					<Table.Head class="text-right">Aksi</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if paginatedData.length > 0}
					{#each paginatedData as item, index (item.id)}
						<Table.Row>
							<Table.Cell class="text-center">
								{index + 1 + (currentPage - 1) * perPage}
							</Table.Cell>
							<Table.Cell>
								{new Date(item.createdAt).toLocaleDateString('id-ID', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric'
								})}
							</Table.Cell>
							<Table.Cell>{item.nama_warga}</Table.Cell>
							<Table.Cell>{item.nik}</Table.Cell>
							<Table.Cell>{item.jumlahKeluarga?.jumlahKeluarga}</Table.Cell>
							<Table.Cell>{item.peternakan?.peternakan}</Table.Cell>
							<Table.Cell>{item.kendaraan?.kendaraan}</Table.Cell>
							<Table.Cell>{item.Pertanian?.lahanSawah}</Table.Cell>
							<Table.Cell>{item.penghasilan?.penghasilan}</Table.Cell>
							<Table.Cell class="text-right">
								{#if data.session?.role === 'ADMIN'}
									<div class="actions">
										<Button
											size="sm"
											variant="outline"
											href={`/admin/data-warga/edit?id=${item.id}`}
										>
											Edit
										</Button>
										<form method="POST" use:enhance>
											<input type="hidden" name="id" value={item.id} />
											<Button type="submit" size="sm" variant="destructive">Hapus</Button>
										</form>
									</div>
								{:else}
									<span class="no-action">-</span>
								{/if}
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={10} class="no-data text-center"
							>Tidak ada data warga untuk tahun 2025</Table.Cell
						>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Pagination -->
	{#if totalItems > perPage}
		<div class="pagination-wrapper">
			<Pagination.Root
				count={totalItems}
				{perPage}
				{siblingCount}
				page={currentPage}
				onPageChange={(page) => (currentPage = page)}
			>
				{#snippet children({ pages })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.PrevButton>
								<ChevronLeftIcon class="size-4" />
								<span class="hidden sm:block">Previous</span>
							</Pagination.PrevButton>
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.NextButton>
								<span class="hidden sm:block">Next</span>
								<ChevronRightIcon class="size-4" />
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		</div>
	{/if}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

	.container {
		font-family: 'Poppins', sans-serif;
		padding: 1rem;
		max-width: 100%;
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

	.left-toolbar {
		display: flex;
		gap: 0.5rem;
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

	.actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}

	.no-action {
		color: #64748b;
		font-style: italic;
	}

	.pagination-wrapper {
		margin-top: 1.5rem;
		display: flex;
		justify-content: center;
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
