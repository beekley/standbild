<template>
    <div>
        <span v-for="(part, i) in story?.split(placeholder)">
            <StoryDropdown :word-set="wordSet" v-if="i > 0" />
            {{ part }}
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StoryDropdown from "./StoryDropdown.vue";

export default defineComponent({
    components: { StoryDropdown },
    props: {
        wordSet: Set<string>,
        story: String,
    },
    data() {
        return {
            placeholder: "{{}}",
        };
    },
});
</script>
