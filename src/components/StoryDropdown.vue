<template>
    <span>
        <select v-model="selectedWord">
            <option v-for="word in wordArray" :value="word">
                {{ word }}
            </option>
        </select>
        <!-- Do not show whether the individual answer is correct. -->
        <!-- <span v-if="selectedWord === answer">✅</span> -->
    </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        wordSet: Set<string>,
        answer: String,
        storedWord: String,
    },
    data() {
        return {
            selectedWord: this.$props.storedWord || "",
        };
    },
    computed: {
        wordArray(): Array<string> {
            const a = [""];
            if (!this.wordSet) return a;
            return a.concat(...Array.from(this.wordSet)); //.sort()
        },
    },
    watch: {
        selectedWord(selectedWord: string) {
            this.$emit("onChange", selectedWord);
        },
    },
});
</script>
