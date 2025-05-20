<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import DataWargaSchema from '$lib/schemas/data-warga-schema'
	import type {
		JumlahKeluarga,
		BangunanRumah,
		Pertanian,
		Kendaraan,
		Penghasilan,
		Peternakan
	} from '@prisma/client'
	import { toast } from 'svelte-sonner'
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import * as Select from '$lib/components/ui/select'

	let loading = false

	interface PropsInterface {
		data: SuperValidated<Infer<typeof DataWargaSchema>>
		jumlahkeluarga: JumlahKeluarga[]
		bangunanRumah: BangunanRumah[]
		peternakan: Peternakan[]
		pertanian: Pertanian[]
		kendaraan: Kendaraan[]
		penghasilan: Penghasilan[]
		message: string | undefined
	}

	let {
		data,
		jumlahkeluarga,
		bangunanRumah,
		peternakan,
		pertanian,
		kendaraan,
		penghasilan,
		message
	}: PropsInterface = $props()

	const form = superForm(data, {
		validators: zodClient(DataWargaSchema),
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
	<Form.Field {form} name="nama_warga">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Masukan Nama Kepala</Form.Label>
				<Input {...props} bind:value={$formData.nama_warga} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="nik">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Masukan NIK</Form.Label>
				<Input {...props} bind:value={$formData.nik} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="jumlahKeluargaId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Pilih Jumlah Keluarga</Form.Label>
				<Select.Root type="single" bind:value={$formData.jumlahKeluargaId} name={props.name}>
					<Select.Trigger {...props}>
						{$formData.jumlahKeluargaId
							? jumlahkeluarga.find((n) => n.id === $formData.jumlahKeluargaId)?.jumlahKeluarga
							: 'Pilih Jumlah Keluarga...'}
					</Select.Trigger>
					<Select.Content>
						{#each jumlahkeluarga as jumlahKeluarga}
							<Select.Item value={jumlahKeluarga.id} label={jumlahKeluarga.jumlahKeluarga} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="bangunanRumahId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Pilih Tipe Bangunan</Form.Label>
				<Select.Root type="single" bind:value={$formData.bangunanRumahId} name={props.name}>
					<Select.Trigger {...props}>
						{$formData.bangunanRumahId
							? bangunanRumah.find((n) => n.id === $formData.bangunanRumahId)?.bangunan
							: 'Pilih Tipe Bangunan...'}
					</Select.Trigger>
					<Select.Content>
						{#each bangunanRumah as bangunanRumah}
							<Select.Item value={bangunanRumah.id} label={bangunanRumah.bangunan} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="peternakanId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Pilih Tipe Peternakan</Form.Label>
				<Select.Root type="single" bind:value={$formData.peternakanId} name={props.name}>
					<Select.Trigger {...props}>
						{$formData.peternakanId
							? peternakan.find((n) => n.id === $formData.peternakanId)?.peternakan
							: 'Pilih Tipe Peternakan...'}
					</Select.Trigger>
					<Select.Content>
						{#each peternakan as peternakan}
							<Select.Item value={peternakan.id} label={peternakan.peternakan} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="PertanianId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Pilih Pertanian</Form.Label>
				<Select.Root type="single" bind:value={$formData.PertanianId} name={props.name}>
					<Select.Trigger {...props}>
						{$formData.PertanianId
							? pertanian.find((n) => n.id === $formData.PertanianId)?.lahanSawah
							: 'Pilih Pertanian...'}
					</Select.Trigger>
					<Select.Content>
						{#each pertanian as pertanian}
							<Select.Item value={pertanian.id} label={pertanian.lahanSawah} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="kendaraanId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Pilih Tipe Kriteria Kendaraan</Form.Label>
				<Select.Root type="single" bind:value={$formData.kendaraanId} name={props.name}>
					<Select.Trigger {...props}>
						{$formData.kendaraanId
							? kendaraan.find((n) => n.id === $formData.kendaraanId)?.kendaraan
							: 'Pilih Tipe Kriteria Kendaraan...'}
					</Select.Trigger>
					<Select.Content>
						{#each kendaraan as kendaraan}
							<Select.Item value={kendaraan.id} label={kendaraan.kendaraan} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="penghasilanId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Pilih Penghasilan</Form.Label>
				<Select.Root type="single" bind:value={$formData.penghasilanId} name={props.name}>
					<Select.Trigger {...props}>
						{$formData.penghasilanId
							? penghasilan.find((n) => n.id === $formData.penghasilanId)?.penghasilan
							: 'Pilih Penghasilan...'}
					</Select.Trigger>
					<Select.Content>
						{#each penghasilan as penghasilan}
							<Select.Item value={penghasilan.id} label={penghasilan.penghasilan} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	{#if message}
		<p class="text-red-600">{message}</p>
	{/if}

	<div class="space-x-2 self-end pt-4">
		<a href="/admin/data-warga-2025" class={buttonVariants({ variant: 'secondary' })}>Back</a>
		<Form.Button disabled={loading}>Submit</Form.Button>
	</div>
</form>
