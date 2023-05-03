<template>
    <main class="section is-medium">
        <RouterView :key="$route.path" />
    </main>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style lang="scss">
// Make the main elements full height so background color fills the window.
html,
body,
#app {
    min-height: 100%;
    margin: 0;
    background-color: black !important;
}
</style>
