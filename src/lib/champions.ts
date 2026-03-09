export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

const LATEST_VERSION = '14.5.1'; // Use a recent valid standard version, or dynamic fetch

// For this app, we will use Data Dragon URL directly for image
export const getChampionImageUrl = (championId: string) => {
  return `https://ddragon.leagueoflegends.com/cdn/${LATEST_VERSION}/img/champion/${championId}.png`;
};

// Fetch champion data from DataDragon
export const fetchChampions = async (): Promise<Champion[]> => {
  try {
    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${LATEST_VERSION}/data/ja_JP/champion.json`);
    const data = await response.json();
    return Object.values(data.data);
  } catch (error) {
    console.error("Failed to fetch champions:", error);
    return [];
  }
};
