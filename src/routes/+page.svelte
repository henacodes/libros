<script lang="ts">
	// svelte core

	// third party

	// shadcdn components

	// custom components

	// custom types
	// stores
	import SearchBar from '$lib/components/SearchBar.svelte';
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
</script>

<div class="  flex h-[100vh] w-full flex-col">
	<div>
		<ThemeSwitch className="m-6" />
	</div>
	<div class=" mx-2 flex h-full justify-center">
		<SearchBar />
	</div>
</div>
