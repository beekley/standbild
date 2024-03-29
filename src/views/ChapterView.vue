<template>
    <div>
        <div class="columns is-centered">
            <div class="column">
                <Library :library="library" />
            </div>
            <div class="column is-three-quarters has-text-centered">
                <Scene
                    @clicked-word="addTolibrary"
                    @clicked-link="followLink"
                    :scene-id="sceneId"
                    :chapter-id="chapterId"
                />
            </div>
            <div class="column"></div>
        </div>

        <div class="columns is-centered">
            <div class="column is-three-quarters">
                <!-- TODO: figure out how to save selected answers. -->
                <StoryTemplate
                    :story="story"
                    :library="library"
                    :selected-answers="selectedAnswers"
                    @on-selected-answers-change="onSelectedAnswersChange"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StoryTemplate from "@/components/StoryTemplate.vue";
import Library from "@/components/Library.vue";
import Scene from "@/components/Scene.vue";
import type { LocationQueryValue } from "vue-router";
import { load, save } from "@/SavedGame";
import router from "@/router";

const MAIN_SCENE_ID = "main";

/**
 * Convert a parameter from the URL into a non-null string.
 * @param param
 */
const paramToString = (
    param: string | string[] | LocationQueryValue | LocationQueryValue[]
): string => {
    if (Array.isArray(param)) {
        if (param.length > 0)
            return typeof param[0] === "string" ? param[0] : "";
        else return "";
    }
    return typeof param === "string" ? param : "";
};

export default defineComponent({
    name: "ChapterView",
    components: { StoryTemplate, Library, Scene },
    data() {
        const chapterId = paramToString(this.$route.params.chapterId);
        const savedGameId = paramToString(this.$route.query["savedGameId"]);

        // If no saved game, re-route to home.
        const unassertedSavedGame = load(savedGameId);
        if (!unassertedSavedGame) router.replace({ path: "/" });
        const savedGame = unassertedSavedGame!; // Since we know this exists now.

        // Initialize the current chapter to the saved game, if not present.
        if (!savedGame.chapters.get(chapterId)) {
            savedGame.chapters.set(chapterId, {
                library: new Set<string>(),
                selectedAnswers: [],
            });
            save(savedGame);
        }

        // If there's no scene ID, route to the main scene in the chapter.
        const sceneId = paramToString(
            this.$route.params.sceneId || MAIN_SCENE_ID
        );

        return {
            savedGameId,
            sceneId,
            chapterId,
            sceneHtml: "",
            story: "",
            savedGame,
        };
    },
    computed: {
        // These properties are a pain to reference, so this simplifies it.
        library(): Set<string> {
            return this.savedGame.chapters.get(this.chapterId)!.library;
        },
        selectedAnswers: {
            get(): Array<string> {
                return this.savedGame.chapters.get(this.chapterId)!
                    .selectedAnswers;
            },
            set(a: Array<string>) {
                this.savedGame.chapters.get(this.chapterId)!.selectedAnswers =
                    a;
            },
        },
    },
    async created() {
        console.log("Opening scene:", this.chapterId, this.sceneId);
        // Get scene story.
        const storyRes = await fetch(`/chapters/${this.chapterId}/story.txt`);
        const story = await storyRes.text();
        this.story = story;
    },
    methods: {
        addTolibrary(word: string): void {
            console.log("Adding word to word set:", word);
            this.library.add(word);
            save(this.savedGame);
        },
        onSelectedAnswersChange(...selectedAnswers: string[]) {
            this.selectedAnswers = selectedAnswers;
            save(this.savedGame);
        },
        followLink(sceneId: string): void {
            console.log("Following link to new scene:", sceneId);
            this.$router.push({
                path: `/chapter/${this.chapterId}/${sceneId}`,
                query: { savedGameId: this.savedGameId },
            });
        },
    },
});
</script>
