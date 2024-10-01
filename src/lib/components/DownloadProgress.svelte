<script>
	import { Progress } from '$lib/components/ui/progress/index';
	import downloadStore from '../../store/downloadStore';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Badge } from '$lib/components/ui/badge/index';
</script>

<div class=" m-4">
	{#if $downloadStore.downloads.length < 1}
		<p>You dont have any downloads so far in this session</p>
	{:else}
		<Badge class="text-primary bg-yellow-500  "
			>Dont close this browser tab until downloads finish</Badge
		>
	{/if}
	{#each $downloadStore.downloads as download}
		<div>
			<p class=" my-2 font-bold">{download.title.replace(/\d{5,}/g, '')}</p>
			<p class=" my-2 text-slate-400">{download.authors}</p>
			{#if download.total === 0}
				<Badge variant="outline">
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					Please wait</Badge
				>
			{:else if download.total === download.loaded}
				<Badge>Finished</Badge>
			{:else}
				<Progress value={(download.loaded / download.total) * 100} max={100} class="w-full " />
				<p>
					{Math.round((download.loaded / (1024 * 1024) + Number.EPSILON) * 100) / 100} mb / {Math.round(
						(download.total / (1024 * 1024) + Number.EPSILON) * 100
					) / 100} mb
				</p>
			{/if}
		</div>
	{/each}
</div>
