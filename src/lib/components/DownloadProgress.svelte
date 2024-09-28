<script>
	import { Progress } from '$lib/components/ui/progress/index';
	import downloadStore from '../../store/downloadStore';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Badge } from '$lib/components/ui/badge/index';
</script>

{#each $downloadStore.downloads as download}
	<div>
		<p class=" my-2">{download.title}</p>
		{#if download.total === 0}
			<Badge variant="outline">
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				Please wait</Badge
			>
		{:else}
			{download.total}
			<Progress value={(download.loaded / download.total) * 100} max={100} class="w-full " />
		{/if}
	</div>
{/each}
