<template>
    <div>
        <StoryTemplate :story="story" :word-set="wordSet" />
        <Library :word-set="wordSet" />
        <Scene
            @clicked-word="addToWordSet"
            @clicked-link="(newSceneId: string) => $router.push(newSceneId)"
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

const paramToString = (param: string | string[]): string => {
    if (Array.isArray(param)) {
        if (param.length > 0) return param[0];
        else return "";
    }
    return param;
};

export default defineComponent({
    name: "ChapterView",
    components: { StoryTemplate, Library, Scene },
    data() {
        const chapterId = paramToString(this.$route.params.chapterId);
        const wordSet: Set<string> = new Set<string>();
        // TODO: Store the localstorage key in a constant or something.
        if (localStorage.getItem(`wordList-${chapterId}`)) {
            const wordList: string[] = JSON.parse(
                localStorage.getItem(`wordList-${chapterId}`) || "[]"
            );
            wordList.forEach((word: string) => wordSet.add(word));
        }

        return {
            sceneId: paramToString(this.$route.params.sceneId),
            chapterId,
            sceneHtml: "",
            story: "",
            wordSet,
        };
    },
    async created() {
        // Get scene story.
        const storyRes = await fetch(`/scenes/${this.chapterId}/story.txt`);
        const story = await storyRes.text();
        this.story = story;
    },
    methods: {
        addToWordSet(word: string) {
            this.wordSet.add(word);
            localStorage.setItem(
                `wordList-${this.chapterId}`,
                JSON.stringify(Array.from(this.wordSet))
            );
        },
    },
});
</script>
