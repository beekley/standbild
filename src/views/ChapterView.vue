<template>
    <div>
        <StoryTemplate :story="story" :word-set="wordSet" />
        <Library :word-set="wordSet" />
        <Scene
            @clicked-word="addToWordSet"
            @clicked-link="followLink"
            :scene-id="sceneId"
            :chapter-id="chapterId"
        />
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

const CHAPTER_ID = "goldenidol";

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

        // Add the current chapter to the saved game, if not present.
        if (!savedGame.chapters.get(CHAPTER_ID)) {
            savedGame.chapters.set(CHAPTER_ID, {
                wordSet: new Set<string>(),
            });
            save(savedGame);
        }

        return {
            savedGameId,
            sceneId: paramToString(this.$route.params.sceneId),
            chapterId,
            sceneHtml: "",
            story: "",
            savedGame,
        };
    },
    computed: {
        wordSet(): Set<string> {
            return this.savedGame.chapters.get(CHAPTER_ID)!.wordSet;
        },
    },
    async created() {
        // Get scene story.
        const storyRes = await fetch(`/scenes/${this.chapterId}/story.txt`);
        const story = await storyRes.text();
        this.story = story;
    },
    methods: {
        addToWordSet(word: string): void {
            this.wordSet.add(word);
            save(this.savedGame);
        },
        followLink(newUrl: string): void {
            this.$router.push({
                path: newUrl,
                query: { savedGameId: this.savedGameId },
            });
        },
    },
});
</script>
