<script>
	import GlobalLoading from '$lib/components/GlobalLoading.svelte';
	import '../app.css';
	import globalStore from '../store/globalStore';
</script>

<slot></slot>

{#if $globalStore.loading}
	<GlobalLoading />
{/if}
