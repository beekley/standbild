<template>
    <div>
        <img :src="imgSrc" usemap="#image-map" />
        <div v-html="sceneHtml"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Scene",
    props: {
        sceneId: {
            type: String,
            required: true,
        },
        chapterId: {
            type: String,
            required: true,
        },
    },
    emits: {
        clickedWord: String,
        clickedLink: String,
    },
    data() {
        return {
            sceneHtml: "",
            imgSrc: "",
        };
    },
    async created() {
        // Get scene HTML.
        const htmlRes = await fetch(
            `/chapters/${this.chapterId}/${this.sceneId}.html`
        );
        const html = await htmlRes.text();
        this.sceneHtml = html;

        // Get scene image with an unknown file extension.
        const exts = ["png", "gif", "jpeg", "jpg"];
        for (const ext of exts) {
            console.log("Trying to get scene image with extension:", ext);
            const src = `/chapters/${this.chapterId}/${this.sceneId}.${ext}`;
            const res = await fetch(src);
            if (res.status === 200) {
                console.log("Found image for scene:", src);
                this.imgSrc = src;
                break;
            }
        }

        // Listen for clicks no image map areas.
        this.$el.addEventListener("click", (event: MouseEvent) => {
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area
            const t = event.target as HTMLAreaElement;
            if (t.tagName === "AREA") {
                event.preventDefault();
                // Add word to library.
                if (t.title) this.$emit("clickedWord", t.title);
                // Follow link to next scene.
                else {
                    // Only get the last part of the URL.
                    const urlParts = t.href.split("/");
                    this.$emit("clickedLink", urlParts[urlParts.length - 1]);
                }
            }
        });
    },
    // methods: {
    //     async getImgSrc(): Promise<string | undefined> {

    //         return undefined;
    //     },
    // },
});
</script>
