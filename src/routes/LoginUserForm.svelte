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

<div
	class="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<!-- Left side with background image -->
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div
			class="absolute inset-0 bg-cover"
			style="background-image: url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
		/>
		<div class="relative z-20 flex items-center text-lg font-medium">Acme Inc</div>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					&ldquo;This library has saved me countless hours of work and helped me deliver stunning
					designs to my clients faster than ever before. Highly recommended!&rdquo;
				</p>
				<footer class="text-sm">Sofia Davis</footer>
			</blockquote>
		</div>
	</div>

	<!-- Right side with login form -->
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Login to your account</h1>
				<p class="text-sm text-muted-foreground">Enter your credentials below to login</p>
			</div>

			<form method="POST" use:enhance class="space-y-4">
				<Form.Field {form} name="username">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Username</Form.Label>
							<Input {...props} bind:value={$formData.username} placeholder="Enter your username" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<Input
								{...props}
								type="password"
								bind:value={$formData.password}
								placeholder="Enter your password"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button class="w-full" disabled={loading}>
					{loading ? 'Logging in...' : 'Login'}
				</Form.Button>
			</form>

			<p class="px-8 text-center text-sm text-muted-foreground">
				By logging in, you agree to our
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>
				and
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>
