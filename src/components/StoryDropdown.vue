<template>
    <span>
        <select v-model="selectedWord">
            <option v-for="word in wordArray" :value="word">
                {{ word }}
            </option>
        </select>
        <span v-if="selectedWord === answer">✅</span>
    </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        wordSet: Set<string>,
        answer: String,
    },
    data() {
        return {
            selectedWord: "",
        };
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
