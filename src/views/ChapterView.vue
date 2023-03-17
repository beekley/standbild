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

        // Add the current chapter to the saved game, if not present.
        if (!savedGame.chapters.get(CHAPTER_ID)) {
            savedGame.chapters.set(CHAPTER_ID, {
                wordSet: new Set<string>(),
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
        wordSet(): Set<string> {
            return this.savedGame.chapters.get(CHAPTER_ID)!.wordSet;
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
        addToWordSet(word: string): void {
            console.log("Adding word to word set:", word);
            this.wordSet.add(word);
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
