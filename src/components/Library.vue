<template>
    <!-- TODO: make this look good with a large number of words -->
    <div class="has-text-right">
        <p class="is-size-3">Library</p>
        <p v-for="word in wordSet">{{ word }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        wordSet: Set<string>,
    },
});
</script>
