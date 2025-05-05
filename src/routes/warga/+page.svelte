<script>
	import { Button } from '$lib/components/ui/button'
</script>

<main>
	<div class="container">
		<h1 class="title">SELAMAT DATANG</h1>

		<div class="cards-container">
			<Button href="/warga/data-warga-bantuan" class="menu-button hover:bg-white">
				<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M16 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V8L16 3ZM20 19H4V5H15V9H20V19Z"
						fill="currentColor"
					/>
					<path d="M8 11H16V13H8V11Z" fill="currentColor" />
					<path d="M8 15H12V17H8V15Z" fill="currentColor" />
				</svg>
				<span class="button-text">DATA BANTUAN</span>
			</Button>
		</div>
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Poppins', sans-serif;
	}

	main {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding: 1rem 2rem 2rem; /* Atas 1rem, kanan-kiri 2rem, bawah 2rem */
		display: flex;
		justify-content: center;
		align-items: center; /* Kembali ke center untuk vertikal */
	}

	.container {
		width: 100%;
		max-width: 1200px;
		text-align: center;
		margin-top: -1rem; /* Geser sedikit ke atas */
	}

	.title {
		font-size: 2.5rem; /* Sedikit lebih kecil */
		font-weight: 700;
		color: #333;
		margin-bottom: 1.5rem; /* Jarak ke button dikurangi */
		text-transform: uppercase;
	}

	.cards-container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1.5rem; /* Jarak antar card dikurangi */
	}

	:global(.menu-button) {
		background: white;
		border-radius: 0.75rem; /* Border radius lebih kecil */
		padding: 1.5rem; /* Padding dikurangi */
		width: 280px; /* Lebar sedikit dikurangi */
		height: 180px; /* Tinggi fixed */
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center; /* Konten di tengah vertikal */
		border: none;
		text-decoration: none;
	}

	:global(.menu-button:hover) {
		transform: translateY(-3px); /* Efek hover lebih subtle */
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}

	.icon {
		width: 50px; /* Ikon lebih kecil */
		height: 50px;
		color: #4f46e5;
		margin-bottom: 1rem; /* Jarak ke text dikurangi */
	}

	.button-text {
		font-size: 1.5rem; /* Text lebih kecil */
		color: #333;
		font-weight: 600;
		margin-top: 0.5rem;
	}
</style>
