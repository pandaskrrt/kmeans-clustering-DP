<script lang="ts">
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	// Process clustering data
	const eligibleData = $derived(
		data.clusteringResults
			?.filter((result) => result.cluster === 0)
			?.sort((a, b) => a.distanceToC1 - b.distanceToC1) || []
	)

	const nonEligibleData = $derived(
		data.clusteringResults
			?.filter((result) => result.cluster === 1)
			?.sort((a, b) => a.distanceToC2 - b.distanceToC2) || []
	)

	// Get latest 7 data entries
	const recentData = $derived(
		data.recentData
			.toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 7)
	)

	// Get latest 7 clustering results
	const recentClusteringResults = $derived(data.clusteringResults?.slice(0, 7) || [])

	const cards = [
		{
			title: 'Total Warga',
			value: data.totalWarga.toLocaleString('id-ID'),
			icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      `
		},
		{
			title: 'Data Layak',
			value: eligibleData.length.toLocaleString('id-ID'),
			detail: 'Mendapatkan bantuan',
			icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `
		},
		{
			title: 'Data Tidak Layak',
			value: nonEligibleData.length.toLocaleString('id-ID'),
			detail: 'Tidak mendapatkan bantuan',
			icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `
		},
		{
			title: 'DS. KEMPLENG PURWOASRI KEDIRI',
			value: '',
			icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      `
		}
	]
</script>

<div class="min-h-screen bg-gray-50">
	<main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
		<!-- Card Grid -->
		<div class="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
			{#each cards as card}
				<div class="overflow-hidden rounded-lg bg-white shadow">
					<div class="px-4 py-5 sm:p-6">
						<div class="flex items-center">
							<div class="mr-4 text-gray-400" style="width: 24px; height: 24px;">
								{@html card.icon}
							</div>

							<div>
								<dt
									class="text-sm font-medium leading-snug text-gray-500"
									style="font-family: 'Inter', sans-serif"
								>
									{@html card.title.replace('KEDIRI', '<br>KEDIRI')}
								</dt>

								{#if card.value}
									<dd
										class="mt-1 text-3xl font-semibold text-gray-900"
										style="font-family: 'Inter', sans-serif"
									>
										{card.value}
									</dd>
								{/if}
							</div>
						</div>
						{#if card.detail}
							<div class="mt-1">
								<span class="text-xs text-gray-500" style="font-family: 'Inter', sans-serif"
									>{card.detail}</span
								>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- Two Column Layout for Tables -->
		<div class="mt-8 grid grid-cols-1 gap-8 px-4 lg:grid-cols-2 lg:px-0">
			<!-- Program Bantuan Section -->
			<div>
				<div class="overflow-hidden bg-white shadow sm:rounded-lg">
					<div class="border-b border-gray-200 px-4 py-5 sm:px-6">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="text-lg font-medium leading-6 text-gray-900">Program Bantuan</h3>
								<p class="mt-1 text-sm text-gray-500">
									7 data terbaru hasil clustering kelayakan bantuan.
								</p>
							</div>
							<a href="/kepala-desa/data-hasil" class="text-sm text-blue-600 hover:underline">
								Lihat selengkapnya →
							</a>
						</div>
					</div>
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<!-- Table Head -->
							<thead class="bg-gray-50">
								<tr>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>No</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>Nama</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>NIK</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>Kelayakan</th
									>
								</tr>
							</thead>
							<!-- Table Body -->
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each recentClusteringResults as result, i}
									<tr class={result.cluster === 0 ? 'bg-green-50' : 'bg-red-50'}>
										<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
											>{i + 1}</td
										>
										<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
											>{result.nama}</td
										>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{result.nik}</td>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
											{#if result.cluster === 0}
												<span
													class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
												>
													Layak Bantuan
												</span>
											{:else}
												<span
													class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
												>
													Tidak Layak
												</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
							<!-- Table Footer -->
							<tfoot>
								<tr>
									<td colspan="3" class="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
									<td class="px-6 py-4 text-sm text-gray-500">
										<span class="font-medium text-green-600">{eligibleData.length} Layak</span>
										{' / '}
										<span class="font-medium text-red-600"
											>{nonEligibleData.length} Tidak Layak</span
										>
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			</div>

			<!-- Recent Data Section -->
			<div>
				<div class="overflow-hidden bg-white shadow sm:rounded-lg">
					<div class="border-b border-gray-200 px-4 py-5 sm:px-6">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="text-lg font-medium leading-6 text-gray-900">Data Terbaru</h3>
								<p class="mt-1 text-sm text-gray-500">
									Total {recentData.length} data terbaru ditambahkan.
								</p>
							</div>
							<a href="/kepala-desa/data-warga" class="text-sm text-blue-600 hover:underline">
								Lihat selengkapnya →
							</a>
						</div>
					</div>

					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>Nama</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>NIK</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>Tanggal</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each recentData as item}
									<tr>
										<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
											>{item.nama_warga}</td
										>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{item.nik}</td>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
											{new Date(item.createdAt).toLocaleDateString('id-ID', {
												day: 'numeric',
												month: 'long',
												year: 'numeric'
											})}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	.bg-green-50 {
		background-color: #f0fdf4;
	}
	.bg-red-50 {
		background-color: #fef2f2;
	}
</style>
