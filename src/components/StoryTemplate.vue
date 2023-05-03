<template>
    <div class="content has-text-centered">
        <div v-if="allSelectedAnswers">
            <p v-if="allCorrectAnswers">All answers are correct!</p>
            <p v-else-if="correctAnswerCount >= 3">
                Three or more answers are correct.
            </p>
        </div>
        <span v-for="(part, i) in storyParts">
            <!-- TODO: Check correctness against answers -->
            <StoryDropdown
                :word-set="library"
                :answer="correctAnswers[i - 1]"
                :stored-word="selectedAnswers[i - 1]"
                @onChange="onSelectedAnswerChange($event, i - 1)"
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
        library: {
            type: Set<string>,
            required: true,
        },
        story: {
            type: String,
            required: true,
        },
        // The player-selected words.
        selectedAnswers: {
            type: Array<string>,
            required: true,
        },
    },
    emits: {
        // For two-way data binding (https://vuejs.org/guide/components/v-model.html).
        onSelectedAnswersChange: Array<string>,
    },
    data() {
        return {
            // The "correct" words in the story.
            correctAnswers: new Array<string>(),
            storyParts: new Array<string>(),
        };
    },
    methods: {
        onSelectedAnswerChange(selectedAnswer: string, i: number) {
            console.log(`Selected answer "${selectedAnswer} in spot ${i}.`);
            // Store the data for the selected answer.
            this.selectedAnswers[i] = selectedAnswer;
            this.$emit("onSelectedAnswersChange", ...this.selectedAnswers);
            console.log(
                `${this.correctAnswerCount} / ${this.correctAnswers.length} answers correct.`
            );
        },
    },
    computed: {
        correctAnswerCount(): number {
            return this.$props.selectedAnswers.filter(
                (a: string, i: number): boolean => a === this.correctAnswers[i]
            ).length;
        },
        allCorrectAnswers(): boolean {
            return this.correctAnswerCount === this.correctAnswers.length;
        },
        // Whether the player has filled something in for all answers.
        allSelectedAnswers(): boolean {
            return (
                this.$props.selectedAnswers.filter(
                    (a: string | null): boolean => a != null && a.length > 0
                ).length === this.correctAnswers.length
            );
        },
    },
    watch: {
        // Story is "watch"ed because this element might be created before the story is loaded.
        story(story) {
            if (!this.story) return;

            // Extract answers from the story.
            let isStory = true;
            let currentPhrase = "";
            for (let i = 0; i < this.story?.length; i += 1) {
                if (this.story[i] == "{") {
                    if (!isStory)
                        throw new Error(
                            "Malformed story. Expected '}', got '{'."
                        );
                    this.storyParts.push(currentPhrase);
                    currentPhrase = "";
                    isStory = false;
                    continue;
                }
                if (this.story[i] == "}") {
                    if (isStory)
                        throw new Error(
                            "Malformed story. Expected '{', got '}'."
                        );
                    this.correctAnswers.push(currentPhrase);
                    currentPhrase = "";
                    isStory = true;
                    continue;
                }
                currentPhrase += this.story[i];
                if (story[i] == "\n") console.log(story[i], currentPhrase);
            }
            if (currentPhrase.length > 0) this.storyParts.push(currentPhrase);
        },
    },
});
</script>
