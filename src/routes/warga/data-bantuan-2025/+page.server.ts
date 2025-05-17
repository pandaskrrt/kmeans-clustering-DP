import db from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

// Fungsi untuk menghitung jarak Euclidean
function euclideanDistance(a: number[], b: number[]): number {
	if (a.length !== b.length) return 0
	let sum = 0
	for (let i = 0; i < a.length; i++) {
		sum += Math.pow(a[i] - b[i], 2)
	}
	return Math.sqrt(sum)
}

// Fungsi untuk menghasilkan angka random yang konsisten
function seededRandom(seed: number) {
	let x = Math.sin(seed) * 10000
	return x - Math.floor(x)
}

// Fungsi untuk inisialisasi centroid dengan K-Means++ yang konsisten
function consistentKMeansPlusPlus(data: number[][], k: number, seed: number): number[][] {
	const centroids: number[][] = []

	// Pilih centroid pertama berdasarkan seed
	const firstIdx = Math.floor(seededRandom(seed) * data.length)
	centroids.push([...data[firstIdx]])

	// Pilih centroid berikutnya
	for (let c = 1; c < k; c++) {
		const distances: number[] = []
		let totalDistance = 0

		// Hitung jarak setiap titik ke centroid terdekat
		for (const point of data) {
			let minDistance = Infinity
			for (const centroid of centroids) {
				const dist = euclideanDistance(point, centroid)
				if (dist < minDistance) minDistance = dist
			}
			distances.push(minDistance)
			totalDistance += minDistance
		}

		// Pilih titik berikutnya berdasarkan probabilitas dengan seed yang konsisten
		const probabilities = distances.map((d) => d / totalDistance)
		let cumulativeProb = 0
		const randomValue = seededRandom(seed + c)
		let selectedIdx = 0

		for (let i = 0; i < probabilities.length; i++) {
			cumulativeProb += probabilities[i]
			if (randomValue <= cumulativeProb) {
				selectedIdx = i
				break
			}
		}

		centroids.push([...data[selectedIdx]])
	}

	return centroids
}

// Fungsi untuk menghitung centroid baru berdasarkan anggota cluster
function calculateNewCentroids(data: number[][], assignments: number[], k: number): number[][] {
	const newCentroids: number[][] = []
	const clusterSums: { [key: number]: { sum: number[]; count: number } } = {}

	// Inisialisasi
	for (let i = 0; i < k; i++) {
		clusterSums[i] = { sum: new Array(data[0].length).fill(0), count: 0 }
	}

	// Hitung jumlah dan count untuk setiap cluster
	for (let i = 0; i < data.length; i++) {
		const cluster = assignments[i]
		for (let j = 0; j < data[i].length; j++) {
			clusterSums[cluster].sum[j] += data[i][j]
		}
		clusterSums[cluster].count++
	}

	// Hitung rata-rata untuk setiap cluster
	for (let i = 0; i < k; i++) {
		const centroid = clusterSums[i].sum.map((val) =>
			clusterSums[i].count > 0 ? val / clusterSums[i].count : 0
		)
		newCentroids.push(centroid)
	}

	return newCentroids
}

export const load: PageServerLoad = async () => {
	// 1. Ambil data warga dengan semua relasinya, hanya untuk tahun 2025
	const dataWarga = await db.dataWarga.findMany({
		where: {
			createdAt: {
				gte: new Date('2025-01-01'),
				lte: new Date('2025-12-31')
			}
		},
		include: {
			jumlahKeluarga: true,
			bangunanRumah: true,
			peternakan: true,
			Pertanian: true,
			kendaraan: true,
			penghasilan: true
		}
	})

	// 2. Format data untuk clustering (array of numbers)
	const features = dataWarga.map((warga) => [
		warga.jumlahKeluarga?.bobot || 0,
		warga.bangunanRumah?.bobot || 0,
		warga.peternakan?.bobot || 0,
		warga.Pertanian?.bobot || 0,
		warga.kendaraan?.bobot || 0,
		warga.penghasilan?.bobot || 0
	])

	// 3. Gunakan seed tetap untuk konsistensi
	const seed = 12345

	// 4. Inisialisasi centroid dengan K-Means++
	let centroids = consistentKMeansPlusPlus(features, 2, seed)
	let assignments: number[] = []
	let iterations = []
	let converged = false
	let iterationCount = 0

	// 5. Lakukan iterasi sampai konvergen atau maksimal 10 iterasi
	while (!converged && iterationCount < 10) {
		iterationCount++
		const newAssignments: number[] = []
		const distancesToCentroids: { c1: number; c2: number }[] = []

		// Hitung jarak dan tentukan cluster untuk setiap data
		for (const point of features) {
			const distC1 = euclideanDistance(point, centroids[0])
			const distC2 = euclideanDistance(point, centroids[1])
			const assignedCluster = distC1 < distC2 ? 0 : 1
			newAssignments.push(assignedCluster)
			distancesToCentroids.push({ c1: distC1, c2: distC2 })
		}

		// Simpan hasil iterasi
		iterations.push({
			iteration: iterationCount,
			centroids: [...centroids],
			assignments: [...newAssignments],
			distances: [...distancesToCentroids]
		})

		// Hitung centroid baru
		const newCentroids = calculateNewCentroids(features, newAssignments, 2)

		// Cek konvergensi
		converged =
			assignments.length > 0 && newAssignments.every((val, idx) => val === assignments[idx])

		// Update centroid dan assignments
		centroids = newCentroids
		assignments = newAssignments
	}

	// 6. Format hasil akhir untuk ditampilkan
	const clusteringResults = dataWarga.map((warga, idx) => ({
		id: warga.id,
		nama: warga.nama_warga,
		nik: warga.nik,
		features: features[idx],
		cluster: assignments[idx],
		distanceToC1: iterations[iterations.length - 1].distances[idx].c1,
		distanceToC2: iterations[iterations.length - 1].distances[idx].c2
	}))

	return {
		dataWarga,
		clusteringResults,
		iterations,
		finalCentroids: centroids,
		converged,
		iterationCount
	}
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const id = Number(formData.get('id'))

		try {
			await db.dataWarga.delete({ where: { id } })
			return { success: 'Data berhasil dihapus!' }
		} catch {
			return { error: 'Gagal menghapus data!' }
		}
	}
}
