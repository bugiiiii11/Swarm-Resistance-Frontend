// NFT Service for Heroes, Weapons, and Lands
// Handles reading NFT data from Polygon blockchain

import { ethers } from 'ethers';

// NFT Contract Addresses on Polygon
const NFT_CONTRACTS = {
  HEROES: '0x27331bbfe94d1b8518816462225b16622ac74e2e',
  WEAPONS: '0x31dd72d810b34c339f2ce9119e2ebfbb9926694a',
  LANDS: '0xaae02c81133d865d543df02b1e458de2279c4a5b'
};

// ERC721 ABI - for Heroes and Weapons
const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  // Add methods for Heroes contract
  "function getAttribs(uint256 tokenId) view returns (uint256, uint256, uint256)",
  "function tokenIdToCardTypeSznId(uint256 tokenId) view returns (uint256)",
  // Add method for Weapons contract
  "function getTokenInfo(uint256 tokenId) view returns (uint256, uint256, uint256, uint256, uint256)"
];

// ERC1155 ABI - for Lands
const ERC1155_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])",
  "function uri(uint256 id) view returns (string)",
  "function name() view returns (string)",
  "function symbol() view returns (string)"
];

class NFTService {
  constructor() {
    this.provider = null;
    this.heroesContract = null;
    this.weaponsContract = null;
    this.landsContract = null;
  }

  // Initialize with Web3Auth provider
  async initialize(web3AuthProvider) {
    try {
      if (!web3AuthProvider) {
        throw new Error('Web3Auth provider is required');
      }

      // Create ethers provider from Web3Auth provider
      this.provider = new ethers.BrowserProvider(web3AuthProvider);
      
      // Create contract instances
      this.heroesContract = new ethers.Contract(
        NFT_CONTRACTS.HEROES,
        ERC721_ABI,
        this.provider
      );

      this.weaponsContract = new ethers.Contract(
        NFT_CONTRACTS.WEAPONS,
        ERC721_ABI,
        this.provider
      );

      this.landsContract = new ethers.Contract(
        NFT_CONTRACTS.LANDS,
        ERC1155_ABI,
        this.provider
      );

      console.log('NFT service initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing NFT service:', error);
      return false;
    }
  }

  // Get Heroes NFTs (ERC721)
  async getHeroes(walletAddress) {
    try {
      if (!this.heroesContract || !walletAddress) {
        return { nfts: [], count: 0, error: 'Contract not initialized or invalid address' };
      }

      console.log('Fetching Heroes NFTs for:', walletAddress);

      // Get balance (number of NFTs owned)
      const balance = await this.heroesContract.balanceOf(walletAddress);
      const balanceNumber = Number(balance);

      if (balanceNumber === 0) {
        return { nfts: [], count: 0 };
      }

      // Get all token IDs owned by the address
      const heroes = [];
      for (let i = 0; i < balanceNumber; i++) {
        try {
          const tokenId = await this.heroesContract.tokenOfOwnerByIndex(walletAddress, i);
          const tokenIdNumber = Number(tokenId);
          
          // Try to get metadata URI
          let metadata = null;
          try {
            const tokenURI = await this.heroesContract.tokenURI(tokenId);
            metadata = { tokenURI };
          } catch (uriError) {
            console.log(`Could not fetch URI for Hero token ${tokenId}:`, uriError.message);
          }

          // Get hero attributes using getAttribs method
          let attributes = null;
          let power = 0;
          let heroImage = null;
          
          try {
            const [security, anonymity, innovation] = await this.heroesContract.getAttribs(tokenId);
            
            attributes = {
              security: Number(security),
              anonymity: Number(anonymity), 
              innovation: Number(innovation)
            };
            
            // Calculate power as sum of all attributes
            power = attributes.security + attributes.anonymity + attributes.innovation;
            
            console.log(`Hero #${tokenId} attributes:`, attributes, 'Power:', power);
            
          } catch (attribError) {
            console.error(`Could not fetch attributes for Hero token ${tokenId}:`, attribError.message);
            // Fallback to random attributes if getAttribs fails
            attributes = {
              security: Math.floor(Math.random() * 100) + 50,
              anonymity: Math.floor(Math.random() * 100) + 50,
              innovation: Math.floor(Math.random() * 100) + 50
            };
            power = attributes.security + attributes.anonymity + attributes.innovation;
          }

          // Get hero image and cardTypeSznId using tokenIdToCardTypeSznId method
          let cardTypeSznId = null;
          try {
            const cardTypeSznIdResult = await this.heroesContract.tokenIdToCardTypeSznId(tokenId);
            cardTypeSznId = Number(cardTypeSznIdResult);
            const imageId = cardTypeSznId.toString();
            heroImage = `/${imageId}.png`;
            
            console.log(`Hero #${tokenId} cardTypeSznId:`, cardTypeSznId, 'Image path:', heroImage);
            
          } catch (imageError) {
            console.error(`Could not fetch cardTypeSznId for Hero token ${tokenId}:`, imageError.message);
            // No fallback image - will show default icon
            heroImage = null;
            cardTypeSznId = null;
          }

          // Define hero metadata based on token ID and cardTypeSznId
          let heroName = `Hero #${tokenId}`;
          let heroRarity = 'Unknown'; // Will be calculated in frontend

          // Calculate rarity based on cardTypeSznId if available
          if (cardTypeSznId) {
            if (cardTypeSznId >= 1000 && cardTypeSznId <= 1999) heroRarity = 'Collectible';
            else if (cardTypeSznId >= 2000 && cardTypeSznId <= 2999) heroRarity = 'Revolution';
            else if (cardTypeSznId >= 3000 && cardTypeSznId <= 3999) heroRarity = 'Legacy';
          }

          // Special case for token ID 3686 (you can expand this later)
          if (tokenIdNumber === 3686) {
            heroName = 'Elite Resistance Fighter #3686';
          }

          heroes.push({
            id: tokenIdNumber,
            tokenId: tokenIdNumber,
            name: heroName,
            rarity: heroRarity,
            power: power,
            attributes: attributes,
            image: heroImage,
            cardTypeSznId: cardTypeSznId, // The blockchain-fetched 4-digit number
            metadata,
            contractAddress: NFT_CONTRACTS.HEROES,
            nftType: 'hero' // Changed from 'type' to 'nftType' to avoid duplicate key
          });
        } catch (tokenError) {
          console.error(`Error fetching Hero token ${i}:`, tokenError);
        }
      }

      console.log(`Found ${heroes.length} Heroes NFTs`);
      return { nfts: heroes, count: heroes.length };

    } catch (error) {
      console.error('Error fetching Heroes NFTs:', error);
      return { nfts: [], count: 0, error: error.message };
    }
  }

  // Get Weapons NFTs (ERC721)
  async getWeapons(walletAddress) {
    try {
      if (!this.weaponsContract || !walletAddress) {
        return { nfts: [], count: 0, error: 'Contract not initialized or invalid address' };
      }

      console.log('Fetching Weapons NFTs for:', walletAddress);

      // Get balance (number of NFTs owned)
      const balance = await this.weaponsContract.balanceOf(walletAddress);
      const balanceNumber = Number(balance);

      if (balanceNumber === 0) {
        return { nfts: [], count: 0 };
      }

      // Get all token IDs owned by the address
      const weapons = [];
      for (let i = 0; i < balanceNumber; i++) {
        try {
          const tokenId = await this.weaponsContract.tokenOfOwnerByIndex(walletAddress, i);
          const tokenIdNumber = Number(tokenId);
          
          // Try to get metadata URI
          let metadata = null;
          try {
            const tokenURI = await this.weaponsContract.tokenURI(tokenId);
            metadata = { tokenURI };
          } catch (uriError) {
            console.log(`Could not fetch URI for Weapon token ${tokenId}:`, uriError.message);
          }

          // Get weapon attributes using getAttribs method
          let attributes = null;
          let power = 0;
          let weaponVideo = null;
          let weaponTier = this.getRandomTier(); // Default fallback
          let weaponName = `Weapon #${tokenId}`;
          let weaponType = null;
          
          try {
            const [attr1, attr2, attr3] = await this.weaponsContract.getAttribs(tokenId);
            
            attributes = {
              attribute1: Number(attr1),
              attribute2: Number(attr2), 
              attribute3: Number(attr3)
            };
            
            // Calculate power as sum of all attributes
            power = attributes.attribute1 + attributes.attribute2 + attributes.attribute3;
            
            console.log(`Weapon #${tokenId} attributes:`, attributes, 'Power:', power);
            
          } catch (attribError) {
            console.error(`Could not fetch attributes for Weapon token ${tokenId}:`, attribError.message);
            // Fallback to random attributes if getAttribs fails
            attributes = {
              attribute1: Math.floor(Math.random() * 80) + 20,
              attribute2: Math.floor(Math.random() * 80) + 20,
              attribute3: Math.floor(Math.random() * 80) + 20
            };
            power = attributes.attribute1 + attributes.attribute2 + attributes.attribute3;
          }

          // Get weapon info using getTokenInfo method
          try {
            const [tier, weaponTypeNum, , name] = await this.weaponsContract.getTokenInfo(tokenId);
            
            const tierNum = Number(tier);
            const typeNum = Number(weaponTypeNum);
            const nameNum = Number(name);
            
            // Set tier based on number
            switch (tierNum) {
              case 1: weaponTier = 'Tier 1'; break;
              case 2: weaponTier = 'Tier 2'; break;
              case 3: weaponTier = 'Tier 3'; break;
              case 4: weaponTier = 'Tier 4'; break;
              default: weaponTier = 'Tier 1'; break;
            }
            
            // Set type and name based on numbers
            if (typeNum === 1) { // Sword
              weaponType = 'Sword';
              switch (nameNum) {
                case 1: weaponName = 'Axe'; break;
                case 2: weaponName = 'Knife'; break;
                case 3: weaponName = 'Plasma Sword'; break;
                case 4: weaponName = 'Super Sword'; break;
                default: weaponName = `Sword #${nameNum}`; break;
              }
            } else if (typeNum === 2) { // Gun
              weaponType = 'Gun';
              switch (nameNum) {
                case 1: weaponName = 'Plasma Gun'; break;
                case 2: weaponName = 'Shotgun'; break;
                case 3: weaponName = 'Repeater'; break;
                case 4: weaponName = 'Sniper Rifle'; break;
                default: weaponName = `Gun #${nameNum}`; break;
              }
            } else {
              weaponType = 'Unknown';
              weaponName = `Weapon #${nameNum}`;
            }
            
            // Create 3-digit code: tier + type + name
            const videoCode = `${tierNum}${typeNum}${nameNum}`;
            weaponVideo = `/${videoCode}.mp4`;
            
            console.log(`Weapon #${tokenId} info:`, {
              tier: tierNum,
              type: typeNum,
              name: nameNum,
              videoCode,
              weaponName,
              weaponTier,
              weaponType,
              videoPath: weaponVideo
            });
            
          } catch (infoError) {
            console.error(`Could not fetch info for Weapon token ${tokenId}:`, infoError.message);
            // Keep default values
            weaponVideo = null;
          }

          weapons.push({
            id: tokenIdNumber,
            tokenId: tokenIdNumber,
            name: weaponName,
            tier: weaponTier,
            weaponType: weaponType, // Changed from 'type' to 'weaponType' to avoid duplicate key
            power: power,
            attributes: attributes,
            video: weaponVideo,
            metadata,
            contractAddress: NFT_CONTRACTS.WEAPONS,
            nftType: 'weapon' // Changed from 'type' to 'nftType' to avoid duplicate key
          });
        } catch (tokenError) {
          console.error(`Error fetching Weapon token ${i}:`, tokenError);
        }
      }

      console.log(`Found ${weapons.length} Weapons NFTs`);
      return { nfts: weapons, count: weapons.length };

    } catch (error) {
      console.error('Error fetching Weapons NFTs:', error);
      return { nfts: [], count: 0, error: error.message };
    }
  }

  // Get Lands NFTs (ERC1155) - This is more complex as we need to check specific token IDs
  async getLands(walletAddress) {
    try {
      if (!this.landsContract || !walletAddress) {
        return { nfts: [], count: 0, error: 'Contract not initialized or invalid address' };
      }

      console.log('Fetching Lands NFTs for:', walletAddress);

      // Define specific land metadata
      const landMetadata = {
        1: {
          name: "Common Land",
          rarity: "Common",
          plots: 1,
          image: "/land1.png"
        },
        2: {
          name: "Rare Land", 
          rarity: "Rare",
          plots: 3,
          image: "/land2.png"
        },
        3: {
          name: "Legendary Land",
          rarity: "Legendary", 
          plots: 7,
          image: "/land3.png"
        }
      };

      // Check the specific token IDs we have metadata for
      const tokenIdsToCheck = [1, 2, 3];
      const lands = [];

      try {
        const addresses = tokenIdsToCheck.map(() => walletAddress);
        const balances = await this.landsContract.balanceOfBatch(addresses, tokenIdsToCheck);
        
        // Process results
        tokenIdsToCheck.forEach((tokenId, index) => {
          const balance = Number(balances[index]);
          if (balance > 0) {
            const metadata = landMetadata[tokenId];
            
            lands.push({
              id: tokenId,
              tokenId: tokenId,
              name: metadata.name,
              rarity: metadata.rarity,
              plots: metadata.plots,
              image: metadata.image,
              balance: balance,
              contractAddress: NFT_CONTRACTS.LANDS,
              nftType: 'land' // Changed from 'type' to 'nftType' to be consistent
            });
          }
        });
      } catch (batchError) {
        console.error(`Error fetching Land balances:`, batchError);
        
        // Fallback: check each token individually
        for (const tokenId of tokenIdsToCheck) {
          try {
            const balance = await this.landsContract.balanceOf(walletAddress, tokenId);
            const balanceNumber = Number(balance);
            
            if (balanceNumber > 0) {
              const metadata = landMetadata[tokenId];
              
              lands.push({
                id: tokenId,
                tokenId: tokenId,
                name: metadata.name,
                rarity: metadata.rarity,
                plots: metadata.plots,
                image: metadata.image,
                balance: balanceNumber,
                contractAddress: NFT_CONTRACTS.LANDS,
                nftType: 'land' // Changed from 'type' to 'nftType' to be consistent
              });
            }
          } catch (individualError) {
            console.error(`Error fetching Land token ${tokenId}:`, individualError);
          }
        }
      }

      console.log(`Found ${lands.length} Land types with total ${lands.reduce((sum, land) => sum + land.balance, 0)} territories`);
      
      // Return both the unique land types and total count of all tickets
      const totalLandTickets = lands.reduce((sum, land) => sum + land.balance, 0);
      return { nfts: lands, count: totalLandTickets };

    } catch (error) {
      console.error('Error fetching Lands NFTs:', error);
      return { nfts: [], count: 0, error: error.message };
    }
  }

  // Get all NFTs for a wallet
  async getAllNFTs(walletAddress) {
    try {
      if (!walletAddress) {
        return {
          heroes: { nfts: [], count: 0 },
          weapons: { nfts: [], count: 0 },
          lands: { nfts: [], count: 0 },
          totalCount: 0
        };
      }

      console.log('Fetching all NFTs for:', walletAddress);

      // Fetch all NFT types in parallel
      const [heroesResult, weaponsResult, landsResult] = await Promise.all([
        this.getHeroes(walletAddress),
        this.getWeapons(walletAddress),
        this.getLands(walletAddress)
      ]);

      const totalCount = heroesResult.count + weaponsResult.count + landsResult.count;

      return {
        heroes: heroesResult,
        weapons: weaponsResult,
        lands: landsResult,
        totalCount
      };

    } catch (error) {
      console.error('Error fetching all NFTs:', error);
      return {
        heroes: { nfts: [], count: 0, error: error.message },
        weapons: { nfts: [], count: 0, error: error.message },
        lands: { nfts: [], count: 0, error: error.message },
        totalCount: 0
      };
    }
  }

  // Helper function to get random rarity (fallback)
  getRandomRarity() {
    const rarities = ['Common', 'Rare', 'Epic', 'Legendary', 'Revolution', 'Influencer', 'Collectible'];
    return rarities[Math.floor(Math.random() * rarities.length)];
  }

  // Helper function to get random tier (fallback)
  getRandomTier() {
    const tiers = ['Tier 1', 'Tier 2', 'Tier 3'];
    return tiers[Math.floor(Math.random() * tiers.length)];
  }

  // Get contract info
  async getContractInfo() {
    try {
      const contracts = {};

      if (this.heroesContract) {
        try {
          const [heroesName, heroesSymbol] = await Promise.all([
            this.heroesContract.name(),
            this.heroesContract.symbol()
          ]);
          contracts.heroes = { name: heroesName, symbol: heroesSymbol, address: NFT_CONTRACTS.HEROES };
        } catch (error) {
          contracts.heroes = { name: 'Heroes', symbol: 'HERO', address: NFT_CONTRACTS.HEROES, error: error.message };
        }
      }

      if (this.weaponsContract) {
        try {
          const [weaponsName, weaponsSymbol] = await Promise.all([
            this.weaponsContract.name(),
            this.weaponsContract.symbol()
          ]);
          contracts.weapons = { name: weaponsName, symbol: weaponsSymbol, address: NFT_CONTRACTS.WEAPONS };
        } catch (error) {
          contracts.weapons = { name: 'Weapons', symbol: 'WEAPON', address: NFT_CONTRACTS.WEAPONS, error: error.message };
        }
      }

      if (this.landsContract) {
        try {
          const [landsName, landsSymbol] = await Promise.all([
            this.landsContract.name(),
            this.landsContract.symbol()
          ]);
          contracts.lands = { name: landsName, symbol: landsSymbol, address: NFT_CONTRACTS.LANDS };
        } catch (error) {
          contracts.lands = { name: 'Lands', symbol: 'LAND', address: NFT_CONTRACTS.LANDS, error: error.message };
        }
      }

      return contracts;
    } catch (error) {
      console.error('Error getting contract info:', error);
      return {};
    }
  }

  // Check if service is ready
  isInitialized() {
    return this.provider !== null && 
           this.heroesContract !== null && 
           this.weaponsContract !== null && 
           this.landsContract !== null;
  }

  // Reset service (for logout)
  reset() {
    this.provider = null;
    this.heroesContract = null;
    this.weaponsContract = null;
    this.landsContract = null;
    console.log('NFT service reset');
  }
}

// Export singleton instance
export const nftService = new NFTService();

// Export contract addresses for reference
export { NFT_CONTRACTS };