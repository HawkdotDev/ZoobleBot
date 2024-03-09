class LootSystem {
    constructor() {

    this.tiers = [
      { name: "Common", unlockLevel: 5 },
      { name: "Uncommon", unlockLevel: 10 },
      { name: "Rare", unlockLevel: 15 },
      { name: "Epic", unlockLevel: 20 },
      { name: "Mythic", unlockLevel: 25 },
      { name: "Legendary", unlockLevel: 30 },
      { name: "Fabled", unlockLevel: 35 },
    ];  
      this.lootTables = {
        Scrap: {
            items: [
              { item: "Rough Gem", probability: 0.8 },
              { item: "Rusty Dagger", probability: 0.15 },
              { item: "Rusty Armor", probability: 0.05 },
            ],
            probability: 0,
        },
        Common: {
          items: [
            { item: "Potion", probability: 0.5 },
            { item: "Basic Sword", probability: 0.15 },
            { item: "Leather Armor", probability: 0.05 },
          ],
          probability: 0.45,
        },
        Uncommon: {
          items: [
            { item: "Iron Sword", probability: 0.7 },
            { item: "Chainmail Armor", probability: 0.2 },
            { item: "Minor Mana Potion", probability: 0.1 },
          ],
          probability: 0.3,
        },
        Rare: {
          items: [
            { item: "Steel Sword", probability: 0.6 },
            { item: "Plate Armor", probability: 0.3 },
            { item: "Major Healing Potion", probability: 0.1 },
          ],
          probability: 0.15,
        },
        Epic: {
          items: [
            { item: "Enchanted Sword", probability: 0.7 },
            { item: "Dragonhide Armor", probability: 0.2 },
            { item: "Elixir of Power", probability: 0.1 },
          ],
          probability: 0.05, // Adjust probabilities based on desired rarity
        },
        Mythic: {
          items: [
            { item: "GodSlayer Sword", probability: 0.6 },
            { item: "Titanforged Armor", probability: 0.3 },
            { item: "Phoenix Down", probability: 0.1 },
          ],
          probability: 0.01, // Even lower probability for Mythic tier
        },
        Legendary: {
          items: [
            { item: "Mjolnir", probability: 0.5 }, // Adjust probabilities within tiers as needed
            { item: "Infinity Gauntlet", probability: 0.5 },
          ],
          probability: 0.005, // Very low probability for Legendary tier
        },
        Fabled: {
          items: [
            { item: "One Ring", probability: 1.0 }, // Fabled tier can have guaranteed drop
          ],
          probability: 0.001, // Extremely low probability for Fabled tier (optional)
        },
      };
      
      this.unlockedTiers = []; // Initially empty unlocked tiers
    }
  
    getLoot(playerLevel, luck) {
      // Determine the rarity of the loot based on weights and player level
      const unlockedTiers = this.tiers.filter(
        (tier) => playerLevel >= tier.unlockLevel
      );

          // Check if there are unlocked tiers
    if (playerLevel < 5 && unlockedTiers.length === 0) {
        // Use the default tier (Common) if no tiers unlocked
        const lootTable = this.lootTables.Scrap;
        return this.weightedRandomSelection(lootTable.items);
      } else {
        // Adjust probabilities based on luck (0 to 10)
        const adjustedProbabilities = this.adjustTierProbabilities(luck);

        for (const key in adjustedProbabilities) {
            if (adjustedProbabilities.hasOwnProperty(key)) {
              const value = adjustedProbabilities[key];
              this.lootTables[key]["probability"] = value;
              console.log(`${key}: ${value}`);
              // Perform any other operations with the key and value as needed
            }
        }

        // console.log("adjusted: ", adjustedProbabilities, "\nunlocked: ", unlockedTiers)
  
        // Choose a loot tier from unlocked tiers with adjusted probabilities
        const lootTierIndex = this.weightedRandomSelection(adjustedProbabilities);
        const lootTier = unlockedTiers[lootTierIndex];
  
        // Use the chosen loot table (probability based)
        const lootTable = this.lootTables[lootTier.name];
  
        // Utilize the modified weightedRandomSelection for probabilities
        const chosenItem = this.weightedRandomSelection(lootTable.items);
  
        const dropMessage = `You obtained a ${lootTier.name} item: ${chosenItem}!`;
  
        // Log and return the message
        console.log(dropMessage);
        return dropMessage;
      }
    }
  
    weightedRandomSelection(items) {
      const randomValue = Math.random();
      let cumulativeProbability = 0;

    //   console.log(items, typeof(items));
  
      for (const { item, probability } of items) {
        cumulativeProbability += probability;
        if (randomValue <= cumulativeProbability) {
          return item;
        }
      }
  
      // Handle potential errors (optional): Throw an error if probabilities don't sum to 1
      throw new Error("Invalid probabilities in loot table");
    }
  
    adjustTierProbabilities(luck) {
      const luckFactor = luck / 10; // Normalize luck value (0 to 1)
      const adjustedProbabilities = {};
  
      for (const [tierName, lootTable] of Object.entries(this.lootTables)) {
        const baseProbability = lootTable.probability;
        // console.log("this", tierName, lootTable, baseProbability);
        let adjustedProbability = baseProbability;
  
        // Increase probability based on rarity and luck factor
        switch (tierName) {
            case "Scrap":
            adjustedProbability += baseProbability * luckFactor * 0; // scrap stays constant
            break;
            case "Common":
            adjustedProbability += baseProbability * luckFactor * 0.05; // 5% increase for Common
            break;
            case "Uncommon":
            adjustedProbability += baseProbability * luckFactor * 0.075; // 7% increase for Uncommon
            break;
            case "Rare":
            adjustedProbability += baseProbability * luckFactor * 0.1125; // 10% increase for Rare
            break;
            case "Epic":
            adjustedProbability += baseProbability * luckFactor * 0.16875; // 15% increase for Epic
            break;
            case "Mythic":
            adjustedProbability += baseProbability * luckFactor * 0.253125; // 20% increase for Mythic
            break;
            case "Legendary":
            adjustedProbability += baseProbability * luckFactor * 0.3796875; // 25% increase for Legendary
            break;
            case "Fabled":
            adjustedProbability += baseProbability * luckFactor * 0.56953125; // 0.1% increase for Fabled (adjust as needed)
            break;
            default:
            adjustedProbability = baseProbability; // No adjustment for unknown tiers
        }
        // console.log("new", adjustedProbability)
        adjustedProbabilities[tierName] = adjustedProbability;
      }

    //   console.log("adjustedProbabilities", adjustedProbabilities)
  
      // Normalize adjusted probabilities to ensure they sum to 1
      const totalProbability = Object.values(adjustedProbabilities).reduce((acc, p) => acc + p, 0);
      for (const tierName in adjustedProbabilities) {
        adjustedProbabilities[tierName] /= totalProbability;
      }
  
      return adjustedProbabilities;
    }
  
    simulateLootDrops(numDrops, playerLevel, luck) {
      const lootDrops = [];
      for (let i = 0; i < numDrops; i++) {
        lootDrops.push(`\n${this.getLoot(playerLevel, luck)}`); // Use existing LootSystem instance
      }
      return lootDrops;
    }
}

  
//   // Export the LootSystem class instance (optional, can be instantiated as needed)
module.exports = new LootSystem();
  