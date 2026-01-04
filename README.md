# NexusFlow 

Syncing your city and its people, one journey at a time.

NexusFlow is a next-generation smart mobility web application designed to optimize urban travel, it provides multi-modal route suggestions, facilitates social travel connections for fare splitting, and gamifies the commuting experience to encourage eco-friendly habits.


##  Key Features

### 🗺️ AI-Optimized Routing
*   **Smart Multi-Mode Paths:** Intelligent combinations of Walking, Metro, Bus, Auto, and Cab to find the most efficient route.
*   **Personalized Preferences:** Optimize for **Speed**, **Cost Efficiency**, or **Comfort**.
*   **Dynamic Mapping:** Integrated Google Maps visualization that updates based on your selected route and transport mode.

### 🤝 Social Sync & Fare Splitting
*   **Real-Time Matchmaking:** Find travelers heading your way to split costs for Cabs and Autos.
*   **Safety First:** Simulated QR Code verification system to ensure trust between co-travelers.
*   **Reputation System:** Trust scores and ratings for a safer community.

### 📅 Plan Ahead
*   **Schedule Trips:** Book future journeys to increase the probability of finding a match (Early Bird Advantage).
*   **Trip Management:** View and manage upcoming syncs in your profile.

### 🏆 Gamified Profile
*   **Impact Tracking:** Real-time calculation of **CO2 Saved** and **Rupees Saved**.
*   **Leveling System:** Earn badges ,Such NightOwl and level up based on your travel habits.
*   **Visual Stats:** Beautiful bento-grid layout for profile statistics.

---

##  Tech Stack

*   **Frontend:** [React 19](https://react.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **AI Engine:** [Google Gemini API](https://ai.google.dev/) (`@google/genai` SDK)
*   **Language:** TypeScript
*   **Icons:** Lucide React
*   **Maps:** Google Maps Embed API

---

##  Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   A Google Cloud Project with the **Gemini API** enabled.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Ridu123456/NexusFlow.git
    cd nexusflow
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```

---

##  AI Integration Details


1.  **Route Generation:** The AI analyzes origin and destination points to construct realistic, multi-segment urban routes with cost and duration estimates.
2.  **User Matching:** It generates context-aware synthetic user profiles for the "Find Nearby Matches" feature to demonstrate the social syncing capabilities.

> **Note:** If no API key is provided, the app gracefully falls back to mock data for demonstration purposes.

---

## Usage

1.  **Dashboard:** The central hub showing your stats and quick actions.
2.  **Smart Routes:** Enter "Current Location"  and a destination to see AI-generated paths.
3.  **Connect:** Search for a destination to find nearby travelers, form a group, and simulate a QR verification.
4.  **Profile:** Track your savings and view your unlocked badges.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ and ☕ by the NexusFlow Team
</p>
