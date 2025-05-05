<script lang="ts">
	import * as Form from '$lib/components/ui/form/'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$lib/components/ui/button'
	import LoginUserSchema from '$lib/schemas/login-user'
	import { toast } from 'svelte-sonner'
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'

	let { data }: { data: SuperValidated<Infer<typeof LoginUserSchema>> } = $props()
	let loading = $state(false)

	const form = superForm(data, {
		validators: zodClient(LoginUserSchema),
		onSubmit() {
			loading = true
		},
		onResult({ result }) {
			loading = false

			if (result.type === 'failure') {
				return toast.error(result.data?.message || 'Something went wrong!')
			}

			if (result.type === 'redirect') {
				return toast.success('Berhasil login!')
			}
		},
		onError() {
			loading = false
			return toast.error('Internal error!')
		}
	})

	const { form: formData, enhance } = form
</script>

<div class="min-h-screen w-full bg-background">
	<div class="mx-auto flex min-h-screen w-full max-w-[100vw] flex-col overflow-hidden md:flex-row">
		<!-- Left side with background image -->
		<div class="relative hidden w-full flex-col bg-muted p-10 text-white md:flex md:w-1/2">
			<div
				class="absolute inset-0 bg-cover bg-center"
				style="background-image: url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
			></div>
			<div class="relative z-20 flex items-center text-lg font-medium">Desa Digital</div>
			<div class="relative z-20 mt-auto">
				<blockquote class="space-y-2">
					<p class="text-lg">
						&ldquo;Sistem informasi desa yang memudahkan administrasi dan pelayanan warga.&rdquo;
					</p>
					<footer class="text-sm">Kepala Desa</footer>
				</blockquote>
			</div>
		</div>

		<!-- Right side with login form -->
		<div class="flex w-full items-center justify-center p-4 md:w-1/2 md:p-8">
			<div class="w-full max-w-md space-y-6">
				<div class="flex flex-col space-y-2 text-center">
					<h1 class="text-2xl font-semibold tracking-tight">Login Admin</h1>
					<p class="text-sm text-muted-foreground">Masukkan username dan password admin</p>
				</div>

				<form method="POST" use:enhance class="space-y-4">
					<Form.Field {form} name="username">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Username</Form.Label>
								<Input {...props} bind:value={$formData.username} placeholder="Username admin" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors></Form.FieldErrors>
					</Form.Field>

					<Form.Field {form} name="password">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Password</Form.Label>
								<Input
									{...props}
									type="password"
									bind:value={$formData.password}
									placeholder="Masukkan password"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors></Form.FieldErrors>
					</Form.Field>

					<Form.Button class="w-full" disabled={loading}>
						{loading ? 'Memproses...' : 'Login'}
					</Form.Button>
				</form>

				<div class="flex flex-col space-y-4 pt-4">
					<a href="/warga">
						<Button variant="outline" class="w-full">Masuk sebagai Warga</Button>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
