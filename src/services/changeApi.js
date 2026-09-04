import { changeDataByScene, changeData } from "../mock/changeData";

export async function analyzeChange(sceneId) {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Extract scene_001, scene_002, scene_003, scene_004 from sceneId if object or string passed
  const id = typeof sceneId === 'string' 
    ? (sceneId.includes('scene_') ? sceneId : 'scene_001')
    : (sceneId?.image_id || 'scene_001');

  return changeDataByScene[id] || changeData;
}
