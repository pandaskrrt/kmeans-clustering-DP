<script lang="ts">
	import { Input } from '$lib/components/ui/input'
	import * as Table from '$lib/components/ui/table'
	import type { PageData } from './$types'
	import * as Pagination from '$lib/components/ui/pagination'
	import ChevronLeftIcon from 'lucide-svelte/icons/chevron-left'
	import ChevronRightIcon from 'lucide-svelte/icons/chevron-right'

	let { data }: { data: PageData } = $props()
	let search = $state<string>('')

	// Pagination for Data Warga
	let currentPageWarga = $state<number>(1)
	const perPageWarga = 10
	const siblingCount = 1

	// Pagination for Clustering Results
	let currentPageClustering = $state<number>(1)
	const perPageClustering = 10

	// Filter data based on search
	const filteredData = $derived(
		data.dataWarga.filter((item) =>
			item.nama_warga.toString().toLowerCase().includes(search.toLowerCase())
		)
	)
	// Total items for Data Warga pagination
	const totalItemsWarga = $derived(filteredData.length)
	// Paginated data for current page (Data Warga)
	const paginatedData = $derived(
		filteredData.slice((currentPageWarga - 1) * perPageWarga, currentPageWarga * perPageWarga)
	)

	// Filter clustering results based on search
	const filteredClusteringResults = $derived(
		data.clusteringResults?.filter((result) =>
			result.nama.toLowerCase().includes(search.toLowerCase())
		) || []
	)
	// Total items for Clustering Results pagination
	const totalItemsClustering = $derived(filteredClusteringResults.length)
	// Paginated clustering results for current page
	const paginatedClusteringResults = $derived(
		filteredClusteringResults.slice(
			(currentPageClustering - 1) * perPageClustering,
			currentPageClustering * perPageClustering
		)
	)

	// Nama kriteria untuk tampilan
	const criteriaNames = [
		'Jumlah Keluarga',
		'Bangunan Rumah',
		'Peternakan',
		'Kendaraan',
		'Pertanian',
		'Penghasilan'
	]

	// Data yang layak untuk iterasi terakhir
	const eligibleData = $derived(
		data.clusteringResults
			?.filter((result) => result.cluster === 0)
			?.sort((a, b) => a.distanceToC1 - b.distanceToC1) || []
	)
</script>

<div class="container">
	<h2 class="title">Data Warga</h2>

	<div class="search-box">
		<Input type="text" placeholder="Cari Nama Warga..." bind:value={search} />
	</div>

	<div class="card">
		<h3>Data Warga</h3>
		<div class="table-container">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-center">No</Table.Head>
						<Table.Head>Nama Kepala Keluarga</Table.Head>
						<Table.Head>Jumlah Keluarga</Table.Head>
						<Table.Head>Bangunan</Table.Head>
						<Table.Head>Peternakan</Table.Head>
						<Table.Head>Kendaraan</Table.Head>
						<Table.Head>Pertanian</Table.Head>
						<Table.Head>Penghasilan</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if paginatedData.length > 0}
						{#each paginatedData as item, index (item.id)}
							<Table.Row>
								<Table.Cell class="text-center">
									{index + 1 + (currentPageWarga - 1) * perPageWarga}
								</Table.Cell>
								<Table.Cell>{item.nama_warga}</Table.Cell>
								<Table.Cell>{item.jumlahKeluarga?.bobot}</Table.Cell>
								<Table.Cell>{item.bangunanRumah?.bobot}</Table.Cell>
								<Table.Cell>{item.peternakan?.bobot}</Table.Cell>
								<Table.Cell>{item.kendaraan?.bobot}</Table.Cell>
								<Table.Cell>{item.Pertanian?.bobot}</Table.Cell>
								<Table.Cell>{item.penghasilan?.bobot}</Table.Cell>
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={8} class="no-data text-center">Tidak ada data warga</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
		<!-- Pagination for Data Warga -->
		{#if totalItemsWarga > perPageWarga}
			<div class="pagination-wrapper">
				<Pagination.Root
					count={totalItemsWarga}
					{perPageWarga}
					{siblingCount}
					page={currentPageWarga}
					onPageChange={(page) => (currentPageWarga = page)}
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
										<Pagination.Link {page} isActive={currentPageWarga === page.value}>
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

	<!-- Hasil Clustering -->
	{#if filteredClusteringResults.length > 0}
		<div class="clustering-section">
			<!-- Centroid untuk Semua Iterasi -->
			<div class="card">
				<h3>Centroid</h3>
				<div class="iteration-stack">
					{#each data.iterations as iter, index (index)}
						<div class="table-container">
							<h4
								class="flex items-center rounded-t-lg border-b border-gray-200 bg-gray-100 px-4 py-2 text-lg font-semibold text-gray-800"
							>
								<span
									class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-sm text-white"
								>
									{index + 1}
								</span>
								Iterasi {index + 1}
							</h4>
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head class="header-cell">Kriteria</Table.Head>
										<Table.Head class="header">Cluster 1</Table.Head>
										<Table.Head class="header">Cluster 2</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each criteriaNames as name, i}
										<Table.Row>
											<Table.Cell>{name}</Table.Cell>
											<Table.Cell>{iter.centroids[0][i].toFixed(2)}</Table.Cell>
											<Table.Cell>{iter.centroids[1][i].toFixed(2)}</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root>
						</div>
					{/each}
				</div>
			</div>

			<!-- Hasil Clustering untuk Per Iterasi -->
			<div class="card">
				<h3>Hasil Clustering</h3>
				<div class="iteration-stack">
					{#each data.iterations as iter, index (index)}
						<!-- Per-iteration Summary -->
						{@const eligibleCount = iter.assignments.reduce(
							(count, assignment) => count + (assignment === 0 ? 1 : 0),
							0
						)}
						{@const ineligibleCount = iter.assignments.length - eligibleCount}
						<div class="summary-card iteration-summary">
							<div class="summary-item eligible">
								<h4>Layak</h4>
								<p class="count">{eligibleCount}</p>
								<p>Warga</p>
							</div>
							<div class="summary-item not-eligible">
								<h4>Tidak Layak</h4>
								<p class="count">{ineligibleCount}</p>
								<p>Warga</p>
							</div>
						</div>

						<div class="table-container">
							<h4
								class="flex items-center rounded-t-lg border-b border-gray-200 bg-gray-100 px-4 py-2 text-lg font-semibold text-gray-800"
							>
								<span
									class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-sm text-white"
								>
									{index + 1}
								</span>
								Iterasi {index + 1}
							</h4>
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head>No</Table.Head>
										<Table.Head>Nama</Table.Head>
										<Table.Head>Jarak ke C1</Table.Head>
										<Table.Head>Jarak ke C2</Table.Head>
										<Table.Head>Cluster</Table.Head>
										<Table.Head>Kelayakan</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each paginatedClusteringResults as result, i}
										{@const iterIndex = data.clusteringResults.findIndex((r) => r.id === result.id)}
										{#if iterIndex !== -1}
											<Table.Row
												class={iter.assignments[iterIndex] === 0 ? 'cluster-1' : 'cluster-2'}
											>
												<Table.Cell>
													{i + 1 + (currentPageClustering - 1) * perPageClustering}
												</Table.Cell>
												<Table.Cell>{result.nama}</Table.Cell>
												<Table.Cell>{iter.distances[iterIndex].c1.toFixed(2)}</Table.Cell>
												<Table.Cell>{iter.distances[iterIndex].c2.toFixed(2)}</Table.Cell>
												<Table.Cell>Cluster {iter.assignments[iterIndex] + 1}</Table.Cell>
												<Table.Cell>
													<span
														class="status-badge {iter.assignments[iterIndex] === 0
															? 'eligible'
															: 'not-eligible'}"
													>
														{iter.assignments[iterIndex] === 0 ? 'Layak' : 'Tidak Layak'}
													</span>
												</Table.Cell>
											</Table.Row>
										{/if}
									{:else}
										<Table.Row>
											<Table.Cell colspan={6} class="no-data text-center">
												Tidak ada data clustering
											</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root>
						</div>
						<!-- Pagination for Clustering Results -->
						{#if totalItemsClustering > perPageClustering}
							<div class="pagination-wrapper">
								<Pagination.Root
									count={totalItemsClustering}
									{perPageClustering}
									{siblingCount}
									page={currentPageClustering}
									onPageChange={(page) => (currentPageClustering = page)}
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
														<Pagination.Link {page} isActive={currentPageClustering === page.value}>
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
					{/each}
				</div>
			</div>

			<!-- Tabel Data yang Layak Saja -->
			<div class="card">
				<h3>Warga yang Layak Menerima Bantuan</h3>
				<div class="table-container">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>No</Table.Head>
								<Table.Head>Nama</Table.Head>
								<Table.Head>Jarak ke Centroid</Table.Head>
								<Table.Head>Prioritas</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each eligibleData as result, i}
								<Table.Row class="cluster-1">
									<Table.Cell>{i + 1}</Table.Cell>
									<Table.Cell>{result.nama}</Table.Cell>
									<Table.Cell>{result.distanceToC1.toFixed(2)}</Table.Cell>
									<Table.Cell>
										<span class="priority-badge">{i + 1}</span>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</div>

			<!-- Summary -->
			<div class="summary-card">
				<div class="summary-item eligible">
					<h4>Layak Menerima Bantuan</h4>
					<p class="count">{eligibleData.length}</p>
					<p>Warga</p>
				</div>
				<div class="summary-item not-eligible">
					<h4>Tidak Layak Menerima Bantuan</h4>
					<p class="count">{data.clusteringResults.length - eligibleData.length}</p>
					<p>Warga</p>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

	:global(:root) {
		--color-primary: #4f46e5;
		--color-success: #10b981;
		--color-danger: #ef4444;
		--color-text: #334155;
		--color-light: #f8fafc;
		--color-border: #e2e8f0;
	}

	.container {
		font-family: 'Poppins', sans-serif;
		color: var(--color-text);
		max-width: 100%;
		padding: 1.5rem;
	}

	.title {
		font-size: 1.75rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: var(--color-primary);
	}

	.search-box {
		margin-bottom: 1.5rem;
		max-width: 400px;
	}

	.card {
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.card h3 {
		font-size: 1.25rem;
		font-weight: 500;
		margin-bottom: 1rem;
		color: var(--color-primary);
	}

	.table-container {
		overflow-x: auto;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		margin-bottom: 1rem;
	}

	.iteration-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.iteration-summary {
		margin-bottom: 1rem;
	}

	/* Status Badge */
	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.status-badge.eligible {
		background-color: var(--color-success);
		color: white;
	}

	.status-badge.not-eligible {
		background-color: var(--color-danger);
		color: white;
	}

	/* Priority Badge */
	.priority-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background-color: var(--color-success);
		color: white;
		font-size: 0.75rem;
		font-weight: bold;
	}

	/* Summary Card */
	.summary-card {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.summary-item {
		padding: 1.5rem;
		border-radius: 0.5rem;
		text-align: center;
	}

	.summary-item h4 {
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 0.5rem;
	}

	.summary-item .count {
		font-size: 2rem;
		font-weight: 600;
		margin: 0.5rem 0;
	}

	.summary-item.eligible {
		background-color: rgba(16, 185, 129, 0.1);
		color: var(--color-success);
	}

	.summary-item.not-eligible {
		background-color: rgba(239, 68, 68, 0.1);
		color: var(--color-danger);
	}

	.error {
		color: var(--color-danger);
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.pagination-wrapper {
		margin-top: 1rem;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.summary-card,
		.iteration-summary {
			grid-template-columns: 1fr;
		}

		.container {
			padding: 1rem;
		}

		.card {
			padding: 1rem;
		}
	}
</style>
