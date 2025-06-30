# Matchview

A simple OP.GG clone that shows a League of Legends player's recent matches, built with Next.js and the Riot Games API.

## 🔍 Features

- Search for a summoner by name
- View their **recent match history**
- Each match is displayed as a **match card** with:
  - Champion, summoner spells, runes, KDA, and items
  - Hover tooltips for detailed descriptions of runes/spells/items
- Expand the card to reveal full match data:
  - All players, champions, KDA, CS, gold, vision score, and items
- Clean, modern UI built with Tailwind CSS and Shadcn components

## 🛠️ Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, Shadcn
- **APIs:** Riot Games API, [CommunityDragon](https://communitydragon.org/)
- **Tooling:** Prettier, ESLint
- **Design:** Figma

## 🚀 Live Demo

👉 [Visit Matchview on Vercel](https://match-view.vercel.app)

## 🧪 Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/matchview.git
   cd matchview
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root and add your Riot API key:

   ```env
   RIOT_API_KEY=your_api_key_here
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

➡️ To get a Riot API key, visit: [developer.riotgames.com](https://developer.riotgames.com)

## 💡 Motivation

Matchview is a personal project created to:

- Practice working with APIs (Riot + CommunityDragon)
- Improve my frontend skills using modern tools
- Add a polished, real-world project to my portfolio

## ❗ Notes

This is a hobby project with no ongoing development planned. There's still room for polish and improvement, but I'm focusing on new challenges in upcoming projects.

---

> Built by **Samuel Rendl**
