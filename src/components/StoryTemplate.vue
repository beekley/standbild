<template>
    <div>
        <span v-for="(part, i) in storyParts">
            <!-- TODO: Check correctness against answers -->
            <StoryDropdown
                :word-set="wordSet"
                :answer="answers[i - 1]"
                v-if="i > 0"
            />
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
            storyParts: new Array<string>(),
            answers: new Array<string>(),
        };
    },
    watch: {
        story(story) {
            if (!this.story) return;

            // Extract answers from the story.
            const storyParts = new Array<string>();
            const answers = new Array<string>();
            let isStory = true;
            let currentPhrase = "";
            for (let i = 0; i < this.story?.length; i += 1) {
                if (this.story[i] == "{") {
                    if (!isStory)
                        throw new Error(
                            "Malformed story. Expected '}', got '{'."
                        );
                    storyParts.push(currentPhrase);
                    currentPhrase = "";
                    isStory = false;
                    continue;
                }
                if (this.story[i] == "}") {
                    if (isStory)
                        throw new Error(
                            "Malformed story. Expected '{', got '}'."
                        );
                    answers.push(currentPhrase);
                    currentPhrase = "";
                    isStory = true;
                    continue;
                }
                currentPhrase += this.story[i];
            }
            if (currentPhrase.length > 0) storyParts.push(currentPhrase);

            this.storyParts = storyParts;
            this.answers = answers;
        },
    },
});
</script>
