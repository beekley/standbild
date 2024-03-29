<template>
    <div class="content has-text-centered">
        <div v-if="allSelectedAnswers">
            <p v-if="allCorrectAnswers">All answers are correct!</p>
            <p v-else-if="correctAnswerCount >= 3">
                Three or more answers are correct.
            </p>
        </div>
        <p v-for="(paragraph, i) in storyParts">
            <span v-for="(part, j) in paragraph">
                <!-- TODO: Check correctness against answers -->
                <StoryDropdown
                    :word-set="library"
                    :answer="correctAnswers[answerIndex(i, j)]"
                    :stored-word="selectedAnswers[answerIndex(i, j)]"
                    @onChange="
                        onSelectedAnswerChange($event, answerIndex(i, j))
                    "
                    v-if="j > 0"
                />
                {{ part }}
            </span>
        </p>
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
            // A list of paragraphs, which are a list of strings that represent the section of the story between the answers.
            storyParts: new Array<Array<string>>(),
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
        answerIndex(paragraphIndex: number, partIndex: number): number {
            let i = partIndex - 1;
            for (let j = 0; j < paragraphIndex; j++) {
                i += this.storyParts[j].length;
            }
            return i;
        },
    },
    computed: {
        correctAnswerCount(): number {
            console.log(this.selectedAnswers, this.correctAnswers);
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
            let currentPart = "";
            let paragaph = 0;
            this.storyParts[paragaph] = [];
            for (let i = 0; i < this.story?.length; i += 1) {
                if (this.story[i] == "{") {
                    if (!isStory)
                        throw new Error(
                            "Malformed story. Expected '}', got '{'."
                        );
                    this.storyParts[paragaph].push(currentPart);
                    currentPart = "";
                    isStory = false;
                    continue;
                }
                if (this.story[i] == "}") {
                    if (isStory)
                        throw new Error(
                            "Malformed story. Expected '{', got '}'."
                        );
                    this.correctAnswers.push(currentPart);
                    currentPart = "";
                    isStory = true;
                    continue;
                }

                // Start a new paragraph if the character is a newline.
                if (story[i] == "\n") {
                    this.storyParts[paragaph].push(currentPart);
                    currentPart = "";
                    paragaph++;
                    this.storyParts[paragaph] = [];
                }
                // Else add it to the part.
                else currentPart += this.story[i];
            }
            if (currentPart.length > 0)
                this.storyParts[paragaph].push(currentPart);
        },
    },
});
</script>
