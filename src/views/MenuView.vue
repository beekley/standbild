<template>
    <div class="container has-text-centered">
        <p class="title is-1 is-italic has-text-danger">Burning Ambition</p>
        <p class="subtitle is-4 has-text-danger-dark">A mystery game</p>
        <div class="columns is-centered">
            <div class="column is-one-quarter">
                <!-- Main Menu -->
                <div v-if="state == State.Main">
                    <!-- New Game Button -->
                    <button
                        @click="newGame"
                        class="button is-fullwidth is-large is-dark m-2"
                    >
                        New Game
                    </button>
                    <!-- Saved games -->
                    <button
                        @click="state = State.LoadGame"
                        class="button is-fullwidth is-large is-dark m-2"
                        v-if="savedGamesArray.length > 0"
                    >
                        Load Game
                    </button>
                </div>
                <!-- Load Game Menu -->
                <ul v-if="state == State.LoadGame">
                    <li
                        v-for="savedGame in savedGamesArray"
                        :key="savedGame.id"
                    >
                        <button
                            @click="loadGame(savedGame.id)"
                            class="button is-text is-inverted"
                        >
                            {{ savedGame.id }}</button
                        ><br />
                        <span class="">{{ savedGameDetails(savedGame) }}</span>
                    </li>
                </ul>
                <!-- Select Chapter Menu -->
                <div v-if="state == State.SelectChapter">
                    <button
                        v-for="c in chapters"
                        @click="openChapter(c.id)"
                        class="button is-fullwidth is-large is-dark m-2"
                    >
                        {{ c.name }}
                    </button>
                </div>
            </div>
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

// TODO: use the router so the back button works.
enum State {
    Main,
    LoadGame,
    SelectChapter,
}

type Chapter = {
    id: string;
    name: string;
};

// TODO: make this list dynamic.
const chapters: Chapter[] = [
    // {
    //     id: "goldenidol",
    //     name: "test chapter"
    // }
    {
        id: "hotel",
        name: "Hotel",
    },
];

export default defineComponent({
    name: "MenuView",
    data() {
        return {
            chapters,
            selectedSavedGameId: "",
            savedGamesArray: loadAll(),
            state: State.Main,
            // Add the enum as a variable so the template can use it.
            State,
        };
    },
    computed: {
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
        newGame(): void {
            const newGame: SavedGame = {
                id: new Date().toLocaleString("en-US"),
                chapters: new Map<string, SavedChapter>(),
            };
            save(newGame);
            // Vue caches the saved games even with a computed prop, so force refresh it.
            this.reloadSavedGames();
            this.loadGame(newGame.id);
        },
        loadGame(savedGameId: string): void {
            this.selectedSavedGameId = savedGameId;
            // Skip chapter select if there is only one chapter.
            if (this.chapters.length === 1) {
                this.openChapter(this.chapters[0].id);
            }
            this.state = State.SelectChapter;
        },
        openChapter(chapterId: string): void {
            router.push({
                path: `/chapter/${chapterId}`,
                query: { savedGameId: this.selectedSavedGameId },
            });
        },
        reloadSavedGames(): void {
            this.savedGamesArray = loadAll();
        },
        savedGameDetails(savedGame: SavedGame): string {
            // No chapter started.
            if (savedGame.chapters.size == 0) return "Not yet started";
            // List the number of words found across each chapter.
            return (
                Array.from(savedGame.chapters)
                    .map(([id, chapter]): string => {
                        return chapter.library.size.toString();
                    })
                    .join(", ") + " words found"
            );
        },
    },
});
</script>
