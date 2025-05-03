<script lang="ts">
	import { Input } from '$lib/components/ui/input'
	import * as Table from '$lib/components/ui/table'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let search = $state<string>('')

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

	<!-- Hasil Clustering -->
	{#if data.clusteringResults && data.clusteringResults.length > 0}
		<div class="clustering-section">
			<div class="card">
				<h3>Hasil Data</h3>
				<div class="table-container single-iteration">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>No</Table.Head>
								<Table.Head>Nama</Table.Head>
								<Table.Head>NIK</Table.Head>
								<Table.Head>Cluster</Table.Head>
								<Table.Head>Kelayakan</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each data.clusteringResults as result, i}
								{#if result.nama.toLowerCase().includes(search.toLowerCase())}
									<Table.Row
										class={data.iterations[0].assignments[i] === 0 ? 'cluster-1' : 'cluster-2'}
									>
										<Table.Cell>{i + 1}</Table.Cell>
										<Table.Cell>{result.nama}</Table.Cell>
										<Table.Cell>{result.nik}</Table.Cell>
										<Table.Cell>Cluster {data.iterations[0].assignments[i] + 1}</Table.Cell>
										<Table.Cell>
											<span
												class="status-badge {data.iterations[0].assignments[i] === 0
													? 'eligible'
													: 'not-eligible'}"
											>
												{data.iterations[0].assignments[i] === 0
													? 'Mendapatkan Bantuan'
													: 'Tidak Mendapatkan Bantuan'}
											</span>
										</Table.Cell>
									</Table.Row>
								{/if}
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

	/* Modified for single table layout */
	.single-iteration {
		width: 100%;
		max-width: 100%;
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
