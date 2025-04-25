import BookOpen from 'lucide-svelte/icons/book-open'
import Bot from 'lucide-svelte/icons/bot'
import SquareTerminal from 'lucide-svelte/icons/square-terminal'
import Users from 'lucide-svelte/icons/users'

export type AdminNavMenutype = {
	title: string
	url: string
	icon: typeof SquareTerminal | typeof BookOpen | typeof Bot
	isActive?: boolean
	items: {
		title: string
		url: string
	}[]
}[]

export const adminNavMenu: AdminNavMenutype = [
	{
		title: 'User',
		url: '/admin/user',
		icon: SquareTerminal,
		items: [
			{
				title: 'Semua User',
				url: '/admin/user'
			},
			{
				title: 'Perlu Verifikasi',
				url: '/admin/user?verified=false'
			}
		]
	},
	{
		title: 'Data',
		url: '/admin/data',
		icon: Users,
		items: [
			{
				title: 'Data Warga',
				url: '/admin/data-warga'
			}
		]
	},
	{
		title: 'Clustering',
		url: '/admin/clustering',
		icon: Users,
		items: [
			{
				title: 'Pilih Clustering',
				url: '/admin/data-warga'
			}
		]
	}
]

export const userNavMenu: AdminNavMenutype = [
	{
		title: 'Pembayaran',
		url: '/dashboard/pembayaran',
		icon: SquareTerminal,
		items: [
			{
				title: 'Belum Dibayar',
				url: '/dashboard/pembayaran/perlu-dibayar'
			},
			{
				title: 'Sudah Dibayar',
				url: '/dashboard/pembayaran/sudah-dibayar'
			},
			{
				title: 'Histori Pembayaran',
				url: '/dashboard/pembayaran/histori-pembayaran'
			}
		]
	}
]
