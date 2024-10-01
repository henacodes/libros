<script>
	// svelte core

	// third party

	// shadcdn components
	import { Toaster } from '$lib/components/ui/sonner';

	// custom components
	import GlobalLoading from '$lib/components/GlobalLoading.svelte';
	import '../app.css';

	// custom types

	// stores
	import globalStore from '../store/globalStore';
</script>

<div class="bg-primary-white">
	<slot />
</div>

<Toaster />
{#if $globalStore.loading}
	<GlobalLoading />
{/if}
