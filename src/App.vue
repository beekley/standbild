<template>
    <main class="section is-medium">
        <RouterView :key="$route.path" />
    </main>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style>
html,
body,
#app {
    height: 100%;
    margin: 0;
}
</style>
