import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ChapterView from "@/views/ChapterView.vue";
import SceneView from "@/views/SceneView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // {
        //     path: "/",
        //     name: "home",
        //     component: HomeView,
        // },
        {
            path: "/scene/:chapterId/:sceneId",
            name: "scene",
            component: ChapterView,
            // children: {
            //     path: ":sceneId",
            //     component: SceneView,
            // },
        },
    ],
});

export default router;
