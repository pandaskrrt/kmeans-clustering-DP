<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import PeternakanSchema from '$lib/schemas/peternakan-schema'
	import { toast } from 'svelte-sonner'
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'

	export let data: SuperValidated<Infer<typeof PeternakanSchema>>
	export let message: string | undefined

	let loading = false

	const form = superForm(data, {
		validators: zodClient(PeternakanSchema),
		onSubmit() {
			loading = true
		},
		onResult({ result }) {
			loading = false

			if (result.type === 'failure') {
				toast.error(result.data?.message || 'Terjadi kesalahan validasi.')
			} else if (result.type === 'redirect') {
				toast.success('Berhasil menambahkan data!')
			}
		},
		onError() {
			loading = false
			toast.error('Terjadi kesalahan internal.')
		}
	})

	const { form: formData, enhance } = form
</script>

<form
	class="flex w-[600px] flex-col rounded-lg bg-slate-100 p-4 dark:bg-slate-900"
	method="POST"
	use:enhance
>
	<Form.Field {form} name="peternakan">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Masukan Data Peternakan</Form.Label>
				<Input {...props} bind:value={$formData.peternakan} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="bobot">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Masukan Nilai Bobot</Form.Label>
				<Input {...props} type="number" bind:value={$formData.bobot} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	{#if message}
		<p class="text-red-600">{message}</p>
	{/if}

	<div class="space-x-2 self-end pt-4">
		<a href="/admin/peternakan" class={buttonVariants({ variant: 'secondary' })}>Back</a>
		<Form.Button disabled={loading}>Submit</Form.Button>
	</div>
</form>
