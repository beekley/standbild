<template>
    <div>
        <div v-if="allSelectedAnswers">
            <p v-if="allCorrectAnswers">✅ All answers are correct!</p>
            <p v-else-if="correctAnswerCount >= 3">
                🟨 Three or more answers are correct.
            </p>
        </div>
        <span v-for="(part, i) in storyParts">
            <!-- TODO: Check correctness against answers -->
            <StoryDropdown
                :word-set="wordSet"
                :answer="answers[i - 1]"
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
        wordSet: Set<string>,
        story: String,
    },
    data() {
        const selectedAnswers: Array<string> = JSON.parse(
            localStorage.getItem(`selectedAnswers`) || "[]"
        );
        return {
            answers: new Array<string>(),
            selectedAnswers,
            storyParts: new Array<string>(),
        };
    },
    methods: {
        onSelectedAnswerChange(selectedAnswer: string, i: number) {
            // Store the data for the selected answer.
            this.selectedAnswers[i] = selectedAnswer;
            console.log(
                `${this.correctAnswerCount} / ${this.answers.length} answers correct.`
            );
            // TODO: Add some ID to this, so we can save different answers per chapter.
            localStorage.setItem(
                `selectedAnswers`,
                JSON.stringify(this.selectedAnswers)
            );
        },
    },
    computed: {
        correctAnswerCount(): number {
            return this.selectedAnswers.filter(
                (a: string, i: number): boolean => a === this.answers[i]
            ).length;
        },
        allCorrectAnswers(): boolean {
            return this.correctAnswerCount === this.answers.length;
        },
        // Whether the player has filled something in for all answers.
        allSelectedAnswers(): boolean {
            return (
                this.selectedAnswers.filter(
                    (a: string | null): boolean => a != null && a.length > 0
                ).length === this.answers.length
            );
        },
    },
    watch: {
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
                    this.answers.push(currentPhrase);
                    currentPhrase = "";
                    isStory = true;
                    continue;
                }
                currentPhrase += this.story[i];
            }
            if (currentPhrase.length > 0) this.storyParts.push(currentPhrase);
        },
    },
});
</script>
