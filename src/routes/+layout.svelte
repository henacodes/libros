<script>
	import GlobalLoading from '$lib/components/GlobalLoading.svelte';
	import '../app.css';
	import globalStore from '../store/globalStore';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<slot></slot>

<Toaster />
{#if $globalStore.loading}
	<GlobalLoading />
{/if}
