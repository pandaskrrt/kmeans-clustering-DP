<script>
	import { Button } from '$lib/components/ui/button'
</script>

<main>
	<div class="container">
		<h1 class="title">SELAMAT DATANG</h1>
		<p class="subtitle">Sistem Bantuan Desa Kempleng</p>

		<div class="cards-container">
			<Button href="/warga/data-bantuan-2025" class="menu-button hover:bg-white">
				<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M16 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V8L16 3ZM20 19H4V5H15V9H20V19Z"
						fill="currentColor"
					/>
					<path d="M8 11H16V13H8V11Z" fill="currentColor" />
					<path d="M8 15H12V17H8V15Z" fill="currentColor" />
				</svg>
				<span class="button-text">DATA BANTUAN 2025</span>
			</Button>
			<Button href="/warga/data-bantuan-2026" class="menu-button hover:bg-white">
				<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M16 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V8L16 3ZM20 19H4V5H15V9H20V19Z"
						fill="currentColor"
					/>
					<path d="M8 11H16V13H8V11Z" fill="currentColor" />
					<path d="M8 15H12V17H8V15Z" fill="currentColor" />
				</svg>
				<span class="button-text">DATA BANTUAN 2026</span>
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
		padding: 1rem 2rem 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.container {
		width: 100%;
		max-width: 1200px;
		text-align: center;
		margin-top: -1rem;
	}

	.title {
		font-size: 3.5rem; /* Increased from 2.5rem */
		font-weight: 700;
		color: #333;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
	}

	.subtitle {
		font-size: 2rem; /* Increased from 1.25rem */
		font-weight: 400;
		color: #555;
		margin-bottom: 1.5rem;
	}

	.cards-container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	:global(.menu-button) {
		background: white;
		border-radius: 0.75rem;
		padding: 1.5rem;
		width: 280px;
		height: 180px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: none;
		text-decoration: none;
	}

	:global(.menu-button:hover) {
		transform: translateY(-3px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}

	.icon {
		width: 50px;
		height: 50px;
		color: #4f46e5;
		margin-bottom: 1rem;
	}

	.button-text {
		font-size: 1.5rem;
		color: #333;
		font-weight: 600;
		margin-top: 0.5rem;
	}
</style>
