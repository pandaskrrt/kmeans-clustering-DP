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
	const firstIdx = Math.floor(seededRandom(seed) * data.length)
	centroids.push([...data[firstIdx]])

	for (let c = 1; c < k; c++) {
		const distances: number[] = []
		let totalDistance = 0

		for (const point of data) {
			let minDistance = Infinity
			for (const centroid of centroids) {
				const dist = euclideanDistance(point, centroid)
				if (dist < minDistance) minDistance = dist
			}
			distances.push(minDistance)
			totalDistance += minDistance
		}

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

// Fungsi untuk menghitung centroid baru
function calculateNewCentroids(data: number[][], assignments: number[], k: number): number[][] {
	const newCentroids: number[][] = []
	const clusterSums: { [key: number]: { sum: number[]; count: number } } = {}

	for (let i = 0; i < k; i++) {
		clusterSums[i] = { sum: new Array(data[0].length).fill(0), count: 0 }
	}

	for (let i = 0; i < data.length; i++) {
		const cluster = assignments[i]
		for (let j = 0; j < data[i].length; j++) {
			clusterSums[cluster].sum[j] += data[i][j]
		}
		clusterSums[cluster].count++
	}

	for (let i = 0; i < k; i++) {
		const centroid = clusterSums[i].sum.map((val) =>
			clusterSums[i].count > 0 ? val / clusterSums[i].count : 0
		)
		newCentroids.push(centroid)
	}

	return newCentroids
}

export const load: PageServerLoad = async () => {
	// 1. Data Dashboard
	const now = new Date()
	const currentYear = now.getFullYear()
	const currentMonth = now.getMonth()

	// Hitung data untuk dashboard
	const totalWarga = await db.dataWarga.count()
	const firstDayThisMonth = new Date(currentYear, currentMonth, 1)
	const lastDayThisMonth = new Date(currentYear, currentMonth + 1, 0)
	const firstDayLastMonth = new Date(currentYear, currentMonth - 1, 1)
	const lastDayLastMonth = new Date(currentYear, currentMonth, 0)

	const currentMonthCount = await db.dataWarga.count({
		where: {
			createdAt: {
				gte: firstDayThisMonth,
				lte: lastDayThisMonth
			}
		}
	})

	const previousMonthCount = await db.dataWarga.count({
		where: {
			createdAt: {
				gte: firstDayLastMonth,
				lte: lastDayLastMonth
			}
		}
	})

	let growthPercentage = 0
	if (previousMonthCount > 0) {
		growthPercentage = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
	} else if (currentMonthCount > 0) {
		growthPercentage = 100
	}

	const recentData = await db.dataWarga.findMany({
		select: {
			id: true,
			nama_warga: true,
			nik: true,
			createdAt: true,
			updatedAt: true
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 7
	})

	// 2. Data Clustering
	const dataWarga = await db.dataWarga.findMany({
		include: {
			jumlahKeluarga: true,
			bangunanRumah: true,
			peternakan: true,
			Pertanian: true,
			kendaraan: true,
			penghasilan: true
		}
	})

	const features = dataWarga.map((warga) => [
		warga.jumlahKeluarga?.bobot || 0,
		warga.bangunanRumah?.bobot || 0,
		warga.peternakan?.bobot || 0,
		warga.Pertanian?.bobot || 0,
		warga.kendaraan?.bobot || 0,
		warga.penghasilan?.bobot || 0
	])

	const seed = 12345
	let centroids = consistentKMeansPlusPlus(features, 2, seed)
	let assignments: number[] = []
	let iterations = []
	let converged = false
	let iterationCount = 0

	while (!converged && iterationCount < 10) {
		iterationCount++
		const newAssignments: number[] = []
		const distancesToCentroids: { c1: number; c2: number }[] = []

		for (const point of features) {
			const distC1 = euclideanDistance(point, centroids[0])
			const distC2 = euclideanDistance(point, centroids[1])
			const assignedCluster = distC1 < distC2 ? 0 : 1
			newAssignments.push(assignedCluster)
			distancesToCentroids.push({ c1: distC1, c2: distC2 })
		}

		iterations.push({
			iteration: iterationCount,
			centroids: [...centroids],
			assignments: [...newAssignments],
			distances: [...distancesToCentroids]
		})

		const newCentroids = calculateNewCentroids(features, newAssignments, 2)
		converged =
			assignments.length > 0 && newAssignments.every((val, idx) => val === assignments[idx])
		centroids = newCentroids
		assignments = newAssignments
	}

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
		// Data Dashboard
		totalWarga,
		recentData,
		growthData: {
			currentMonthCount,
			previousMonthCount,
			growthPercentage: growthPercentage.toFixed(1)
		},

		// Data Clustering
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
