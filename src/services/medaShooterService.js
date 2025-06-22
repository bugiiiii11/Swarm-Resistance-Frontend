// MedaShooter Service for backend API calls
// Handles score submission and leaderboard fetching

const BACKEND_BASE_URL = 'https://swarm-resistance-backend-production.up.railway.app';

class MedaShooterService {
  constructor() {
    this.baseUrl = BACKEND_BASE_URL;
  }

  /**
   * Submit game score to backend
   * Note: This is called by Unity WebGL, not directly by React
   * Unity handles the encryption and sends encrypted data
   */
  async submitScore(encryptedScoreData) {
    try {
      console.log('📤 Submitting score to backend...');
      
      const response = await fetch(`${this.baseUrl}/api/v1/minigames/medashooter/score/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encryptedScoreData)
      });

      if (!response.ok) {
        throw new Error(`Score submission failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Score submitted successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ Error submitting score:', error);
      throw error;
    }
  }

  /**
   * Get leaderboard/scoreboard data
   */
  async getLeaderboard(limit = 10, playerAddress = null) {
    try {
      console.log('📊 Fetching leaderboard...');
      
      let url = `${this.baseUrl}/api/game/medashooter/scoreboard?limit=${limit}`;
      if (playerAddress) {
        url += `&player_address=${playerAddress}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Leaderboard fetch failed: ${response.status} ${response.statusText}`);
      }

      const leaderboard = await response.json();
      console.log('✅ Leaderboard fetched successfully:', leaderboard);
      return leaderboard;

    } catch (error) {
      console.error('❌ Error fetching leaderboard:', error);
      // Return empty leaderboard on error to avoid breaking UI
      return {
        scoreboard: [],
        total_players: 0,
        user_score: null
      };
    }
  }

  /**
   * Get player's personal best score
   */
  async getPlayerScore(playerAddress) {
    try {
      const leaderboard = await this.getLeaderboard(1, playerAddress);
      return leaderboard.user_score;
    } catch (error) {
      console.error('❌ Error fetching player score:', error);
      return null;
    }
  }

  /**
   * Check if player is blacklisted
   */
  async checkBlacklist(playerAddress) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/minigames/medashooter/blacklist/?address=${encodeURIComponent(playerAddress)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        // If check fails, assume not blacklisted (fail open)
        return { blacklisted: false };
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('❌ Error checking blacklist:', error);
      // If check fails, assume not blacklisted (fail open)
      return { blacklisted: false };
    }
  }

  /**
   * Get server timestamp for Unity
   */
  async getServerTimestamp() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/minigames/medashooter/timestamp/`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Timestamp fetch failed: ${response.status}`);
      }

      const timestamp = await response.text(); // Returns plain text, not JSON
      return parseInt(timestamp);

    } catch (error) {
      console.error('❌ Error fetching timestamp:', error);
      // Fallback to local timestamp
      return Math.floor(Date.now() / 1000);
    }
  }

  /**
   * Validate game environment and player
   */
  async validatePlayer(playerAddress) {
    try {
      // Check if player is blacklisted
      const blacklistStatus = await this.checkBlacklist(playerAddress);
      
      if (blacklistStatus.blacklisted) {
        throw new Error(`Player is blacklisted: ${blacklistStatus.reason}`);
      }

      return {
        valid: true,
        address: playerAddress,
        timestamp: await this.getServerTimestamp()
      };

    } catch (error) {
      console.error('❌ Player validation failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const medaShooterService = new MedaShooterService();

// Export for direct import
export default medaShooterService;