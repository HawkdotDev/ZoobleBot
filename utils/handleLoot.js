//handleLoot.js
class LootSystem {
  constructor() {
    // Define loot tiers with unlock levels
    this.tiers = [
      { name: "Common", unlockLevel: 5 },
      { name: "Uncommon", unlockLevel: 10 },
      { name: "Rare", unlockLevel: 15 },
      { name: "Epic", unlockLevel: 20 },
      { name: "Mythic", unlockLevel: 25 },
      { name: "Legendary", unlockLevel: 30 },
      { name: "Fabled", unlockLevel: 35 },
    ];

    // Create initial loot tables for each tier with default weights and items
    this.lootTables = {
      Common: {
        weight: 45.0,
        items: [
          { item: "Potion", weight: 8.0 },
          { item: "Basic Sword", weight: 6.0 },
          { item: "Leather Armor", weight: 4.0 },
        ],
      },
      Uncommon: {
        weight: 23.0,
        items: [
          { item: "Greater Potion", weight: 5.0 },
          { item: "Chainmail Armor", weight: 4.0 },
          { item: "Steel Sword", weight: 3.0 },
          { item: "Uncommon Gem", weight: 2.0 },
        ],
      },
      Rare: {
        weight: 11.0,
        items: [
          { item: "Elixir", weight: 2.0 },
          { item: "Enchanted Dagger", weight: 1.0 },
          { item: "Plate Armor", weight: 1.0 },
        ],
      },
      Epic: {
        weight: 5.0,
        items: [
          { item: "Legendary Potion", weight: 1.0 },
          { item: "Excalibur", weight: 1.0 },
          { item: "Dragonhide Armor", weight: 1.0 },
        ],
      },
      Mythic: {
        weight: 2.0,
        items: [
          { item: "Mythic Elixir", weight: 1.0 },
          { item: "Mythic Sword", weight: 1.0 },
          { item: "Mythic Shield", weight: 1.0 },
        ],
      },
      Legendary: {
        weight: 0.1,
        items: [
          { item: "Artifact", weight: 1.0 },
          { item: "Infinity Blade", weight: 1.0 },
          { item: "Godly Armor", weight: 1.0 },
        ],
      },
      Fabled: {
        weight: 0.005,
        items: [
          { item: "Fabled Potion", weight: 2.0 },
          { item: "Fabled Sword", weight: 0.5 },
          { item: "Fabled Shield", weight: 0.5 },
        ],
      },
    };

    // Keep track of unlocked tiers
    this.unlockedTiers = [];
  }

  getLoot(playerLevel) {
    // Determine the rarity of the loot based on weights and player level
    const unlockedTiers = this.tiers.filter(
      (tier) => playerLevel >= tier.unlockLevel
    );

    // Check if there are unlocked tiers
    if (unlockedTiers.length > 0) {
      // Choose a loot tier from unlocked tiers with a preference for lower rarities
      const lootTierIndex = Math.floor(Math.random() * unlockedTiers.length);
      const lootTier = unlockedTiers[lootTierIndex];

      // Use the chosen loot table
      const lootTable = this.lootTables[lootTier.name];

      // Utilize a corrected weighted random selection algorithm for items
      const chosenItem = this.weightedRandomSelection(lootTable.items);

      const dropMessage = `You obtained a ${lootTier.name} item: ${chosenItem.item}!`

      // Log the obtained item and its rarity
      console.log(dropMessage);
      return dropMessage;
    } else {
      // If no tiers are unlocked, use the default tier (Common)
      const lootTable = this.lootTables.Common;
      const chosenItem = this.weightedRandomSelection(lootTable.items);

      const dropMessage = `You obtained a ${lootTable.name} item: ${chosenItem.item}!`

      // Log the obtained item and its rarity
      console.log(dropMessage);
      return dropMessage;
    }
  }

  weightedRandomSelection(items) {
    const totalWeight = items.reduce((acc, { weight }) => acc + weight, 0);
    let randomValue = Math.random() * totalWeight;

    // The previous code
    for (const { item, weight } of items) {
      randomValue -= weight;
      if (randomValue <= 0) {
        return { item, weight };
      }
    }

    // Fallback, in case weights are not defined correctly
    return items[items.length - 1];
  }

  simulateLootDrops = (numDrops, playerLevel) => {
    const Loot = []
    for (let i = 0; i < numDrops; i++) {
      const lootSystem = new LootSystem();
      Loot.push(`\n${lootSystem.getLoot(playerLevel)}`);
    }
    return JSON.parse(JSON.stringify(Loot))
  };
}

// Export the LootSystem class instance
module.exports = new LootSystem();