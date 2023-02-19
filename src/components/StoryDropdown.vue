<template>
    <select>
        <option v-for="word in wordArray" :value="word">
            {{ word }}
        </option>
    </select>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        wordSet: Set<string>,
    },
    computed: {
        wordArray(): Array<string> {
            const a = [""];
            if (!this.wordSet) return a;
            return a.concat(...Array.from(this.wordSet)); //.sort()
        },
    },
});
</script>
