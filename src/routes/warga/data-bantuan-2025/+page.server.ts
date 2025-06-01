import db from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

// Euclidean distance function
function euclideanDistance(a: number[], b: number[]): number {
	if (a.length !== b.length) return 0
	let sum = 0
	for (let i = 0; i < a.length; i++) {
		sum += Math.pow(a[i] - b[i], 2)
	}
	return Math.sqrt(sum)
}

// Calculate new centroids
function calculateNewCentroids(data: number[][], assignments: number[], k: number): number[][] {
	const newCentroids: number[][] = Array(k)
		.fill(0)
		.map(() => Array(data[0].length).fill(0))
	const clusterCounts: number[] = Array(k).fill(0)

	for (let i = 0; i < data.length; i++) {
		const cluster = assignments[i]
		clusterCounts[cluster]++
		for (let j = 0; j < data[i].length; j++) {
			newCentroids[cluster][j] += data[i][j]
		}
	}

	for (let i = 0; i < k; i++) {
		if (clusterCounts[i] > 0) {
			for (let j = 0; j < newCentroids[i].length; j++) {
				newCentroids[i][j] /= clusterCounts[i]
			}
		} else {
			newCentroids[i] = [...data[Math.floor(Math.random() * data.length)]]
		}
	}

	return newCentroids
}

export const load: PageServerLoad = async () => {
	// Fetch data
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

	// Log total residents
	console.log(`Total residents processed: ${dataWarga.length}`)
	if (dataWarga.length !== 1345) {
		console.warn(`Expected 1345 residents, got ${dataWarga.length}`)
	}

	// Format data for clustering
	const features = dataWarga.map((warga) => [
		warga.jumlahKeluarga?.bobot || 0,
		warga.bangunanRumah?.bobot || 0,
		warga.peternakan?.bobot || 0,
		warga.kendaraan?.bobot || 0,
		warga.Pertanian?.bobot || 0,
		warga.penghasilan?.bobot || 0
	])

	// Initial centroids
	let centroids: number[][] = [
		[1, 1, 1, 2, 2, 2], // C1: Layak
		[3, 2, 5, 4, 2, 4] // C2: Tidak Layak
	]

	// Log initial centroids
	console.log('Initial centroids:', { C1: centroids[0], C2: centroids[1] })

	let assignments: number[] = []
	let iterations: {
		iteration: number
		centroids: number[][]
		assignments: number[]
		distances: { c1: number; c2: number }[]
	}[] = []
	let converged = false
	let iterationCount = 0
	const maxIterations = 10

	// K-Means iterations
	while (!converged && iterationCount < maxIterations) {
		iterationCount++
		const newAssignments: number[] = []
		const distancesToCentroids: { c1: number; c2: number }[] = []

		// Assign points to nearest centroid
		for (const point of features) {
			const distC1 = euclideanDistance(point, centroids[0])
			const distC2 = euclideanDistance(point, centroids[1])
			const assignedCluster = distC1 < distC2 ? 0 : 1
			newAssignments.push(assignedCluster)
			distancesToCentroids.push({ c1: distC1, c2: distC2 })
		}

		// Log for Iteration 1
		if (iterationCount === 1) {
			// Calculate bangunanRumah total bobot for Cluster 1
			let bangunanRumahSumC1 = 0
			for (let i = 0; i < features.length; i++) {
				if (newAssignments[i] === 0) {
					bangunanRumahSumC1 += features[i][1]
				}
			}
			console.log(
				`Iteration 1, Cluster 1 bangunanRumah total bobot: ${bangunanRumahSumC1.toFixed(2)}`
			)

			// Calculate Layak and Tidak Layak counts
			const layakCount = newAssignments.reduce(
				(count, assignment) => count + (assignment === 0 ? 1 : 0),
				0
			)
			const tidakLayakCount = newAssignments.length - layakCount
			console.log(
				`Iteration 1, Clustering Summary: { Layak: ${layakCount}, Tidak Layak: ${tidakLayakCount} }`
			)

			// Log sample residents (first 10 per cluster)
			const layakSample = []
			const tidakLayakSample = []
			for (
				let i = 0;
				i < features.length && (layakSample.length < 10 || tidakLayakSample.length < 10);
				i++
			) {
				if (newAssignments[i] === 0 && layakSample.length < 10) {
					layakSample.push({
						nama: dataWarga[i].nama_warga,
						features: features[i],
						distanceToC1: distancesToCentroids[i].c1.toFixed(2),
						distanceToC2: distancesToCentroids[i].c2.toFixed(2),
						cluster: 'C1 (Layak)'
					})
				} else if (newAssignments[i] === 1 && tidakLayakSample.length < 10) {
					tidakLayakSample.push({
						nama: dataWarga[i].nama_warga,
						features: features[i],
						distanceToC1: distancesToCentroids[i].c1.toFixed(2),
						distanceToC2: distancesToCentroids[i].c2.toFixed(2),
						cluster: 'C2 (Tidak Layak)'
					})
				}
			}
			console.log('Iteration 1, Layak Sample (up to 10):', layakSample)
			console.log('Iteration 1, Tidak Layak Sample (up to 10):', tidakLayakSample)

			// Output assignments in Excel-like format for first 10 residents
			const assignmentTable = dataWarga.slice(0, 10).map((warga, idx) => ({
				nama: warga.nama_warga,
				features: features[idx],
				C1: newAssignments[idx] === 0 ? 1 : '',
				C2: newAssignments[idx] === 1 ? 1 : '',
				distanceToC1: distancesToCentroids[idx].c1.toFixed(4),
				distanceToC2: distancesToCentroids[idx].c2.toFixed(4)
			}))
			console.log('Iteration 1, Assignment Table (first 10):', assignmentTable)
		}

		// Calculate new centroids
		const newCentroids = calculateNewCentroids(features, newAssignments, 2)

		// Save iteration results
		iterations.push({
			iteration: iterationCount,
			centroids: centroids.map((c) => [...c]),
			assignments: [...newAssignments],
			distances: [...distancesToCentroids]
		})

		// Check convergence
		const assignmentsUnchanged =
			assignments.length > 0 && newAssignments.every((val, idx) => val === assignments[idx])
		converged = assignmentsUnchanged

		// Update centroids and assignments
		centroids = newCentroids.map((c) => [...c])
		assignments = [...newAssignments]
	}

	// Format results
	const clusteringResults = dataWarga.map((warga, idx) => ({
		id: warga.id,
		nama: warga.nama_warga,
		nik: warga.nik, // Add nik
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
