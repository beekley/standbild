<template>
    <div>
        <!-- New Game Button -->
        <button @click="newGame">New Game</button>
        <!-- Saved games -->
        <div v-if="savedGamesArray.length > 0">
            <p>Load Game:</p>
            <ul>
                <li v-for="savedGame in savedGamesArray" :key="savedGame.id">
                    <button @click="loadGame(savedGame.id, $event)">
                        {{ savedGame.id }}
                    </button>
                </li>
            </ul>
        </div>
        <!-- Chapters -->
        <!-- TODO: Dynamically populate this list with available chapters. -->
        <div v-if="selectedSaveGame">
            <button @click="openChapter('goldenidol')">goldenidol</button>
        </div>
    </div>
</template>

<script lang="ts">
import {
    loadAll,
    type SavedChapter,
    type SavedGame,
    save,
} from "@/SavedGame.js";
import router from "@/router";
import { defineComponent } from "vue";

export default defineComponent({
    name: "MenuView",
    data() {
        return {
            selectedSavedGameId: "",
        };
    },
    computed: {
        // TODO: This only runs on start. Fix that.
        savedGamesArray(): Array<SavedGame> {
            return loadAll();
        },
        savedGames(): Map<string, SavedGame> {
            const map = new Map<string, SavedGame>();
            this.savedGamesArray.forEach((g) => map.set(g.id, g));
            return map;
        },
        selectedSaveGame(): SavedGame | undefined {
            if (this.selectedSavedGameId == "") return undefined;
            return this.savedGames.get(this.selectedSavedGameId);
        },
    },
    methods: {
        newGame() {
            const newGame: SavedGame = {
                id: new Date().toLocaleString("en-US"),
                chapters: new Map<string, SavedChapter>(),
            };
            save(newGame);
        },
        loadGame(savedGameId: string, event: MouseEvent) {
            const button = event.target as HTMLButtonElement;
            this.selectedSavedGameId = savedGameId;
            console.log(this.savedGames.get(savedGameId));
        },
        openChapter(chapterId: string) {
            // TODO: Point to the implicit first scene in the chapter.
            router.replace({
                path: `/scene/${chapterId}/outside`,
                query: { savedGameId: this.selectedSavedGameId },
            });
        },
    },
});
</script>
