<script lang="ts">
	import { Input } from '$lib/components/ui/input'
	import * as Table from '$lib/components/ui/table'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let search = $state<string>('')

	let currentIteration = $state(0)

	// Nama kriteria untuk tampilan
	const criteriaNames = [
		'Jumlah Keluarga',
		'Bangunan Rumah',
		'Peternakan',
		'Pertanian',
		'Kendaraan',
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

	<!-- Tabel Data Utama -->
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
					{#if data.dataWarga.length > 0}
						{#each data.dataWarga.filter((item) => item.nama_warga
								.toString()
								.toLowerCase()
								.includes(search.toLowerCase())) as item, index (item.id)}
							<Table.Row>
								<Table.Cell class="text-center">{index + 1}</Table.Cell>
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
	</div>

	<!-- Hasil Clustering -->
	{#if data.clusteringResults && data.clusteringResults.length > 0}
		<div class="clustering-section">
			<!-- Centroid untuk Iterasi 1 dan 2 -->
			<div class="card">
				<h3>Centroid</h3>
				<div class="iteration-grid">
					{#each [0, 1, 2] as iter}
						{#if data.iterations[iter]}
							<div class="table-container">
								<h4
									class="flex items-center rounded-t-lg border-b border-gray-200 bg-gray-100 px-4 py-2 text-lg font-semibold text-gray-800"
								>
									<span
										class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-sm text-white"
									>
										{iter + 1}
									</span>
									Iterasi {iter + 1}
								</h4>
								<Table.Root>
									<Table.Header>
										<Table.Row>
											<Table.Head>Kriteria</Table.Head>
											<Table.Head>Cluster 1</Table.Head>
											<Table.Head>Cluster 2</Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each criteriaNames as name, i}
											<Table.Row>
												<Table.Cell>{name}</Table.Cell>
												<Table.Cell>{data.iterations[iter].centroids[0][i].toFixed(2)}</Table.Cell>
												<Table.Cell>{data.iterations[iter].centroids[1][i].toFixed(2)}</Table.Cell>
											</Table.Row>
										{/each}
									</Table.Body>
								</Table.Root>
							</div>
						{/if}
					{/each}
				</div>
			</div>

			<!-- Hasil Clustering untuk Iterasi 1 dan 2 -->
			<div class="card">
				<h3>Hasil Clustering</h3>
				<div class="iteration-grid">
					{#each [0, 1, 2] as iter}
						{#if data.iterations[iter]}
							<div class="table-container">
								<h4
									class="flex items-center rounded-t-lg border-b border-gray-200 bg-gray-100 px-4 py-2 text-lg font-semibold text-gray-800"
								>
									<span
										class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-sm text-white"
									>
										{iter + 1}
									</span>
									Iterasi {iter + 1}
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
										{#each data.clusteringResults as result, i}
											{#if result.nama.toLowerCase().includes(search.toLowerCase())}
												<Table.Row
													class={data.iterations[iter].assignments[i] === 0
														? 'cluster-1'
														: 'cluster-2'}
												>
													<Table.Cell>{i + 1}</Table.Cell>
													<Table.Cell>{result.nama}</Table.Cell>
													<Table.Cell>{data.iterations[iter].distances[i].c1.toFixed(2)}</Table.Cell
													>
													<Table.Cell>{data.iterations[iter].distances[i].c2.toFixed(2)}</Table.Cell
													>
													<Table.Cell>Cluster {data.iterations[iter].assignments[i] + 1}</Table.Cell
													>
													<Table.Cell>
														<span
															class="status-badge {data.iterations[iter].assignments[i] === 0
																? 'eligible'
																: 'not-eligible'}"
														>
															{data.iterations[iter].assignments[i] === 0 ? 'Layak' : 'Tidak Layak'}
														</span>
													</Table.Cell>
												</Table.Row>
											{/if}
										{/each}
									</Table.Body>
								</Table.Root>
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

	.iteration-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
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

	/* Responsive */
	@media (max-width: 768px) {
		.iteration-grid,
		.summary-card {
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
