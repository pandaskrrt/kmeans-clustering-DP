<script lang="ts">
	import { Button } from '$lib/components/ui/button'
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<nav class="navbar">
	<div class="navbar-container">
		<div class="logo">
			<span>Desa</span>
			<span>Digital</span>
		</div>
		<Button class="hover:bg-blue-600X bg-white text-black" href="/">Login Admin</Button>
	</div>
</nav>

<slot />

<style>
	/* Navbar Container */
	.navbar {
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		padding: 16px 20px; /* Lebarkan jarak atas & bawah */
		font-family: 'Poppins', sans-serif;
	}

	/* Navbar Content Wrapper */
	.navbar-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	/* Desa Digital Logo */
	.logo {
		color: white;
		font-weight: 700;
		font-size: 1.5rem;
		display: flex;
		flex-direction: column;
		line-height: 1.3;
		gap: 2px;
	}

	/* Login Button */
</style>
