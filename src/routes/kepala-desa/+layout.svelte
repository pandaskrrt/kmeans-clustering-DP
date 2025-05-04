<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/stores'
	import * as Avatar from '$lib/components/ui/avatar/index.js'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down'
	import LogOut from 'lucide-svelte/icons/log-out'

	// Data user contoh - ganti dengan data user sebenarnya
	const user = {
		name: 'Kepaladesa',
		username: 'Kepaladesa@bisa',
		avatar: '/path/to/avatar.jpg'
	}

	// Fungsi untuk menentukan nav item aktif
	$: activeNav = {
		overview: $page.url.pathname === '/' || $page.url.pathname === '/kepala-desa',
		dataWarga: $page.url.pathname.startsWith('/kepala-desa/data-warga'),
		dataHasil: $page.url.pathname.startsWith('/kepala-desa/data-hasil')
	}
</script>

<header class="bg-white shadow">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
		<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>

		<!-- User Dropdown -->
		<div class="flex items-center">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<button class="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100">
						<Avatar.Root class="h-8 w-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{user.name}</span>
							<span class="truncate text-xs text-gray-500">{user.username}</span>
						</div>
						<ChevronsUpDown class="ml-1 size-4 text-gray-500" />
					</button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56 min-w-56 rounded-lg" align="end" sideOffset={8}>
					<DropdownMenu.Label class="p-0 font-normal">
						<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
							<Avatar.Root class="h-8 w-8 rounded-lg">
								<Avatar.Image src={user.avatar} alt={user.name} />
								<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
							</Avatar.Root>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">{user.name}</span>
								<span class="truncate text-xs">{user.username}</span>
							</div>
						</div>
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<a href="/logout">
						<DropdownMenu.Item>
							<LogOut class="mr-2 size-4" />
							Log out
						</DropdownMenu.Item>
					</a>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</header>

<nav class="bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex space-x-8">
			<a
				href="/kepala-desa"
				class={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
					activeNav.overview
						? 'border-indigo-500 text-indigo-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
				}`}
			>
				Overview
			</a>
			<a
				href="/kepala-desa/data-warga"
				class={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
					activeNav.dataWarga
						? 'border-indigo-500 text-indigo-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
				}`}
			>
				Data Warga
			</a>
			<a
				href="/kepala-desa/data-hasil"
				class={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
					activeNav.dataHasil
						? 'border-indigo-500 text-indigo-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
				}`}
			>
				Data Hasil
			</a>
		</div>
	</div>
</nav>

<slot />
