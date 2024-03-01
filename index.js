"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
class Player {
    constructor(name) {
        this.hand = [];
        this.name = name;
    }
}
let players = [];
let gameRunning = false;
// Genererer og bland kortstokk
function createAndShuffleDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push(`${value} of ${suit}`);
        }
    }
    // Bland kortstokken
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Bytt plass på kortene
    }
    return deck;
}
// Registrer en spiller
app.post('/addplayer', (req, res) => {
    if (players.length >= 4) {
        return res.status(400).send('Allerede 4 spillere registrert.');
    }
    const player = new Player(req.body.name);
    players.push(player);
    res.status(200).send(`${player.name} er lagt til i spillet.`);
});
// Start spillet
app.post('/start', (req, res) => {
    if (players.length != 4) {
        return res.status(400).send('Spillet krever nøyaktig 4 spillere for å starte.');
    }
    const deck = createAndShuffleDeck();
    // Fordel kortene jevnt mellom spillerne
    for (let i = 0; i < deck.length; i++) {
        players[i % 4].hand.push(deck[i]);
    }
    gameRunning = true;
    res.status(200).send('Spillet er startet, og kortene er delt ut.');
});
// Spill et kort
app.post('/play', (req, res) => {
    if (!gameRunning) {
        return res.status(400).send('Spillet er ikke startet.');
    }
    const { playerName, card } = req.body;
    const player = players.find(player => player.name === playerName);
    if (!player) {
        return res.status(404).send('Spiller ikke funnet.');
    }
    if (!player.hand.includes(card)) {
        return res.status(400).send('Kortet er ikke i din hånd.');
    }
    // Fjern kortet fra spillerens hånd og håndter logikken for spillets gang her
    // For enkelhetens skyld, fjerner vi bare kortet og antar det er spilt
    player.hand = player.hand.filter(c => c !== card);
    res.status(200).send(`${playerName} spilte ${card}.`);
});
app.post('/bid', (req, res) => {
    if (!gameRunning) {
        return res.status(400).send('Spillet er ikke startet.');
    }
    const { player, bid } = req.body;
    const playerObj = players.find(p => p.name === player);
    if (!playerObj) {
        return res.status(404).send('Spiller ikke funnet.');
    }
    // Anta at bid er en array med [suit, rank]
    const [suit, rank] = bid;
    // Implementer logikk for å validere og håndtere budet her
    // For demonstrasjon, antar vi at alle bud er gyldige
    console.log(`${player} bød ${rank} av ${suit}.`);
    // Oppdater spilltilstanden basert på budet
    // Dette er et eksempel og må utvides basert på dine spilleregler
    res.status(200).send(`${player} bød ${rank} av ${suit}.`);
});
// Restart funksjon for å teste nye endringer
app.post('/restart', (req, res) => {
    // Tilbakestill spilltilstanden
    players = [];
    gameRunning = false;
    // Legg til eventuelle andre variabler som trenger å bli tilbakestilt her
    res.status(200).send('Spillet har blitt restartet.');
});
// For get players REST requesten
app.get('/players', (req, res) => {
    if (!gameRunning) {
        return res.status(400).send('Spillet er ikke startet.');
    }
    // Formater spillernes informasjon for responsen
    const playersInfo = players.map(player => ({
        name: player.name,
        hand: player.hand
    }));
    res.status(200).json(playersInfo);
});
// For get teams REST requesten
app.get('/teams', (req, res) => {
    if (!gameRunning) {
        return res.status(400).send('Spillet er ikke startet.');
    }
    // Anta en enkel lagdeling basert på spillernes rekkefølge
    const team1 = [players[0], players[2]];
    const team2 = [players[1], players[3]];
    const teams = {
        team1: team1.map(player => player.name),
        team2: team2.map(player => player.name)
    };
    res.status(200).json(teams);
});
app.listen(port, () => {
    console.log(`Serveren kjører på http://localhost:${port}`);
});
