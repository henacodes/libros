<script lang="ts">
	import { goto } from '$app/navigation';

	import { Input } from '$lib/components/ui/input/index';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select';

	import { toggleLoading } from '$store/globalStore';
	import { toast } from 'svelte-sonner';

	let searchQuery = '';
	let filterBy: string;

	type OnSubmitType = () => void;

	export let onSubmit: OnSubmitType | null = null;
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		if (onSubmit) {
			onSubmit();
		}

		if (!searchQuery || searchQuery.length < 3) {
			toast('Invalid input ');
			return;
		}
		toggleLoading();
		goto(`/search?query=${searchQuery}&filterBy=${filterBy || 'title'}&page=${1}`, {
			replaceState: true
		});
	};

	let options = ['title', 'author', 'series', 'publisher', 'identifier', 'tags'];
</script>

<div class="my-4 flex w-full items-center justify-center">
	<form class="m-2 flex w-full items-center space-x-2 md:w-1/2" on:submit={handleSubmit}>
		<Select.Root
			onSelectedChange={(option) => {
				filterBy = String(option?.value);
			}}
		>
			<Select.Trigger class="w-[180px]">
				<Select.Value placeholder="Filter By " />
			</Select.Trigger>
			<Select.Content>
				{#each options as option}
					<Select.Item value={option}>{option}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Input bind:value={searchQuery} type="search" placeholder="Search books" />
		<Button type="submit">Search</Button>
	</form>
</div>
