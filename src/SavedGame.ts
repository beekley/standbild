export const SAVED_GAMES_KEY = "savedGames";

export type SavedChapter = {
    wordSet: Set<string>;
};

export type SavedGame = {
    id: string;
    chapters: Map<string, SavedChapter>;
};

type SerializedChapter = {
    id: string;
    wordArray: Array<string>;
};

type SerializedSavedGame = {
    id: string;
    serializedChapters: Array<SerializedChapter>;
};

export function loadAll(): Array<SavedGame> {
    // Load the saved games string from local storage.
    const stringifiedSavedGames = localStorage.getItem(SAVED_GAMES_KEY);
    if (!stringifiedSavedGames || stringifiedSavedGames.length == 0) return [];

    // Convert to an array of serialized saved games.
    const serializedSavedGames: Array<SerializedSavedGame> = JSON.parse(
        stringifiedSavedGames
    );
    if (!serializedSavedGames || serializedSavedGames.length == 0) return [];

    return serializedSavedGames.map((g) => deserialize(g));
}

export function load(savedGameId: string): SavedGame | undefined {
    // Load the saved games string from local storage.
    const stringifiedSavedGames = localStorage.getItem(SAVED_GAMES_KEY);
    if (!stringifiedSavedGames || stringifiedSavedGames.length == 0)
        return undefined;

    // Convert to an array of serialized saved games.
    const serializedSavedGames: Array<SerializedSavedGame> = JSON.parse(
        stringifiedSavedGames
    );
    if (!serializedSavedGames || serializedSavedGames.length == 0)
        return undefined;

    // Find the requested saved game.
    const serializedSavedGame = serializedSavedGames.find(
        (g) => g.id === savedGameId
    );
    if (!serializedSavedGame) return undefined;

    // Deserialize into the saved game format we want to use.
    const savedGame = deserialize(serializedSavedGame);

    return savedGame;
}

export function save(savedGame: SavedGame): void {
    // Serialize as something that can be stringified as JSON.
    const serializedSavedGame = serialize(savedGame);
    console.log(serializedSavedGame);

    // Open the existing saved games array in local storage.
    const stringifiedSavedGames = localStorage.getItem(SAVED_GAMES_KEY) || "[]";
    const serializedSavedGames: Array<SerializedSavedGame> =
        JSON.parse(stringifiedSavedGames) || [];

    // Either replace the existing saved game with this ID...
    const existingSavedGameIndex = serializedSavedGames.findIndex(
        (g) => g.id === savedGame.id
    );
    if (existingSavedGameIndex >= 0)
        serializedSavedGames[existingSavedGameIndex] = serializedSavedGame;
    // ... or add it as a new agme.
    else serializedSavedGames.push(serializedSavedGame);
    console.log(serializedSavedGames);

    // Save in local storage.
    localStorage.setItem(SAVED_GAMES_KEY, JSON.stringify(serializedSavedGames));
}

function serialize(savedGame: SavedGame): SerializedSavedGame {
    const serializedChapters: Array<SerializedChapter> = [];
    // Maps are not JSON, so convert to array.
    savedGame.chapters.forEach((c, id) => {
        serializedChapters.push({
            id,
            // Sets are not JSON, so convert to array.
            wordArray: Array.from(c.wordSet),
        });
    });
    const serializedSavedGame: SerializedSavedGame = {
        id: savedGame.id,
        serializedChapters,
    };
    return serializedSavedGame;
}

function deserialize(serializedSavedGame: SerializedSavedGame): SavedGame {
    const chapters = new Map<string, SavedChapter>();
    // IIRC, JSON ignores empty arrays, so create an emtpty array if its missing.
    if (!serializedSavedGame.serializedChapters)
        serializedSavedGame.serializedChapters = [];
    serializedSavedGame.serializedChapters.forEach((c) => {
        const wordSet = new Set<string>();
        c.wordArray.forEach((w) => wordSet.add(w));
        chapters.set(c.id, { wordSet });
    });
    const savedGame: SavedGame = {
        id: serializedSavedGame.id,
        chapters,
    };
    return savedGame;
}
