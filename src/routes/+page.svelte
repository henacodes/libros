<script lang="ts">
	import { goto } from '$app/navigation';

	import { Input } from '$lib/components/ui/input/index';

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { toggleLoading } from '../store/globalStore';

	let searchQuery = '';
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		toggleLoading();
		goto(`/search?query=${searchQuery}`, { replaceState: true });
	};
</script>

<div class="  flex h-[100vh] w-full justify-center">
	<form class="m-2 flex w-full max-w-sm items-center space-x-2" on:submit={handleSubmit}>
		<Input bind:value={searchQuery} type="search" placeholder="Search books" />
		<Button type="submit">Search</Button>
	</form>
</div>
