<script>
	// svelte core

	// third party

	// shadcdn components
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

	// custom components
	import GlobalLoading from '$lib/components/GlobalLoading.svelte';
	import '../app.css';

	// custom types

	// stores
	import globalStore from '../store/globalStore';
</script>

<ModeWatcher />

<div class="bg-background">
	<slot />
</div>

<Toaster />
{#if $globalStore.loading}
	<GlobalLoading />
{/if}
