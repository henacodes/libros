<script lang="ts">
	import { goto } from '$app/navigation';

	import { Input } from '$lib/components/ui/input/index';

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let searchQuery = '';
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		goto(`/search?query=${searchQuery}`);
	};
</script>

<div class=" bg-primary-white flex h-[100vh] w-full justify-center" on:submit={handleSubmit}>
	<form class="m-2 flex w-full max-w-sm items-center space-x-2" action="GET">
		<Input bind:value={searchQuery} type="search" placeholder="Search books" />
		<Button type="submit">Search</Button>
	</form>
</div>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Edit Profile</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit profile</Dialog.Title>
			<Dialog.Description>
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Input id="name" value="Pedro Duarte" class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Input id="username" value="@peduarte" class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
