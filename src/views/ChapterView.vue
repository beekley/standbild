<template>
    <div>
        <StoryTemplate :story="story" :word-set="wordSet" />
        <Library :word-set="wordSet" />
        <SceneView @clicked-word="(word) => wordSet.add(word)" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StoryTemplate from "@/components/StoryTemplate.vue";
import Library from "@/components/Library.vue";
import SceneView from "@/views/SceneView.vue";

export default defineComponent({
    name: "ChapterView",
    components: { StoryTemplate, Library, SceneView },
    data() {
        return {
            sceneId: this.$route.params.sceneId,
            chapterId: this.$route.params.chapterId,
            sceneHtml: "",
            story: "",
            wordSet: new Set<string>(),
        };
    },

    async created() {
        // Get scene story.
        const storyRes = await fetch(`/scenes/${this.chapterId}/story.txt`);
        const story = await storyRes.text();
        this.story = story;
    },
});
</script>
