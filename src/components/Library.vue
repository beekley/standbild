<template>
    <div>
        <span v-for="word in wordSet">{{ " " + word + " " }}</span>
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
