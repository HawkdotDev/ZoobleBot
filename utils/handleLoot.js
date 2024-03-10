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
          { item: "Basic Sword", probability: 0.35 },
          { item: "Leather Armor", probability: 0.1 },
          { item: "Basic Shield", probability: 0.05 },
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
        probability: 0.05,
      },
      Mythic: {
        items: [
          { item: "GodSlayer Sword", probability: 0.6 },
          { item: "Titanforged Armor", probability: 0.3 },
          { item: "Phoenix Down", probability: 0.1 },
        ],
        probability: 0.01,
      },
      Legendary: {
        items: [
          { item: "Mjolnir", probability: 0.5 },
          { item: "Infinity Gauntlet", probability: 0.5 },
        ],
        probability: 0.005,
      },
      Fabled: {
        items: [{ item: "One Ring", probability: 1.0 }],
        probability: 0.001,
      },
    };

    this.unlockedTiers = [];
  }

  getDrop(playerLevel, luck) {
    // Determine the probable rarities of the loot based on player level
    const unlockedTiers = this.tiers.filter(
      (tier) => playerLevel >= tier.unlockLevel
    );

    if (playerLevel < 5 ) {
      const lootTable = this.lootTables.Scrap;
      const dropItem = {"Rarity" : "Scrap", "Item" : this.weightedRandomSelection(lootTable["items"])};
      return dropItem;
    } else {
      const adjustedProbabilities = this.adjustTierProbabilities(luck); // Adjust probabilities based on luck (0 to 10)
      const raritySelectionPool = this.filterLootProbabilities(
        adjustedProbabilities,
        unlockedTiers
      );

      console.log(raritySelectionPool);

      // Choose a loot tier from unlocked tiers with adjusted probabilities
      const lootTierIndex = this.weightedRandomSelection(raritySelectionPool);
      const lootTable = this.lootTables[lootTierIndex];

      const dropItem = {"Rarity" : lootTierIndex, "Item" : this.weightedRandomSelection(lootTable["items"])};
      return dropItem;
    }
  }

  weightedRandomSelection(items) {
    const randomValue = Math.random();
    let cumulativeProbability = 0;

    try {
      for (const { item, probability } of items) {
        // console.log(items, item, probability)

        cumulativeProbability += probability;
        if (randomValue <= cumulativeProbability) {
          return item;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  adjustTierProbabilities(luck) {
    const luckFactor = luck / 10; // Normalize luck value (0 to 1)
    const adjustedProbabilities = {};

    for (const [tierName, lootTable] of Object.entries(this.lootTables)) {
      const baseProbability = lootTable.probability;
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

      adjustedProbabilities[tierName] = adjustedProbability;
    }

    // Normalize adjusted probabilities to ensure they sum to 1
    const totalProbability = Object.values(adjustedProbabilities).reduce(
      (acc, p) => acc + p,
      0
    );
    for (const tierName in adjustedProbabilities) {
      adjustedProbabilities[tierName] /= totalProbability;
    }

    return adjustedProbabilities;
  }

  filterLootProbabilities(rarityProbabilities, unlockedRarities) {
    const filteredLootTables = [];

    // Calculate the total probability of unlocked rarities
    const totalProbability = unlockedRarities.reduce((acc, rarity) => {
      const rarityName = rarity.name;
      if (rarityProbabilities.hasOwnProperty(rarityName)) {
        acc += rarityProbabilities[rarityName];
      }
      return acc;
    }, 0);

    // Normalize probabilities for each unlocked rarity
    for (const unlockedRarity of unlockedRarities) {
      const rarityName = unlockedRarity.name;
      if (rarityProbabilities.hasOwnProperty(rarityName)) {
        const normalizedProbability =
          rarityProbabilities[rarityName] / totalProbability;
        filteredLootTables.push({
          item: rarityName,
          probability: normalizedProbability,
        });
      }
    }

    return filteredLootTables;
  }

  getLoot(numDrops, playerLevel, luck) {
    const lootDrops = [];
    for (let i = 0; i < numDrops; i++) {
      const foundItem = this.getDrop(playerLevel, luck);
      lootDrops.push(`you found a ${foundItem.Rarity} item : ${foundItem.Item}`); // Use existing LootSystem instance
    }
    return lootDrops;
  }
}

// Export the LootSystem class instance (can be instantiated as needed)
module.exports = new LootSystem();

// const lootSystem = new LootSystem();
// console.log(
//   lootSystem.getLoot(
//     7, // number of drops
//     3, // player level
//     10 // luck level
//   )
// );
