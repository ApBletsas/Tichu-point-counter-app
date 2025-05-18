# Tichu Point Counter App

A React Native app for tracking scores in the card game Tichu.

## Features

### Game Screen
- Display current scores for Team A and Team B
- Manual input of points for each round
- Track Tichu and Grand Tichu calls (successful or failed)
- Automatically calculate cumulative scores
- Show round history with the ability to undo
- Display a banner when a team reaches the winning point limit

### Settings Screen
- Set names for all four players (2 per team)
- Configure the winning point limit (default 1000)
- Reset the game and clear history

## Technical Details

This app was built using:
- React Native with Expo
- TypeScript
- React Navigation for screen transitions
- Zustand for state management
- AsyncStorage for data persistence
- Custom UI components

## How to Play Tichu

Tichu is a partnership card game for 4 players in which each round:
- Teams earn points by winning tricks and getting rid of cards
- Players can call "Tichu" (worth 100 pts) or "Grand Tichu" (worth 200 pts)
- Points from both teams should add up to 100 in each round
- First team to reach 1000 points wins

## How to Use This App

1. Enter player names in Settings
2. For each round:
   - Enter the points for each team (should total 100)
   - Mark any Tichu or Grand Tichu calls and whether they were successful
   - Submit the round to update scores
3. Track your progress in the Round History
4. When a team reaches the winning score, a banner will appear

## Development

### Running the App

```bash
# Install dependencies
npm install

# Start the app
npm start

# Run on specific platforms
npm run ios
npm run android
npm run web
```

## License

This project is open source. Feel free to use and modify as needed.
