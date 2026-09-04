export const changeDataByScene = {
  scene_001: {
    change_type: "Construction",
    confidence: 0.91,
    change_area: "1,240 m\u00b2",
    location: {
      lat: 30.7046,
      lng: 76.7179,
      aoi_name: "Chandigarh Region"
    },
    before: {
      date: "12 JUN 2024",
      sensor: "Sentinel-2",
      resolution: "10 m",
      image: "/demo/satellite/before_001.png"
    },
    after: {
      date: "10 MAY 2026",
      sensor: "Sentinel-2",
      resolution: "10 m",
      image: "/demo/satellite/after_001.png"
    },
    change_mask: "/demo/satellite/change_mask_001.png",
    metadata: {
      image_id: "scene_001",
      sensor: "Sentinel-2",
      resolution: "10 m",
      crs: "EPSG:4326",
      source: "Sentinel-2 L2A \u2014 Chandigarh Region",
      status: "COMPLETE"
    }
  },

  scene_002: {
    change_type: "Dock Expansion",
    confidence: 0.95,
    change_area: "3,450 m\u00b2",
    location: {
      lat: 17.6868,
      lng: 83.2185,
      aoi_name: "Visakhapatnam Port"
    },
    before: {
      date: "15 APR 2024",
      sensor: "Sentinel-2",
      resolution: "10 m",
      image: "/demo/satellite/before_002.png"
    },
    after: {
      date: "18 APR 2026",
      sensor: "Sentinel-2",
      resolution: "10 m",
      image: "/demo/satellite/after_002.png"
    },
    change_mask: "/demo/satellite/change_mask_002.png",
    metadata: {
      image_id: "scene_002",
      sensor: "Sentinel-2",
      resolution: "10 m",
      crs: "EPSG:4326",
      source: "Sentinel-2 L2A \u2014 Visakhapatnam Port",
      status: "COMPLETE"
    }
  },

  scene_003: {
    change_type: "Highway Expansion",
    confidence: 0.88,
    change_area: "2,890 m\u00b2",
    location: {
      lat: 28.5562,
      lng: 77.1000,
      aoi_name: "New Delhi Aerocity"
    },
    before: {
      date: "10 JAN 2024",
      sensor: "Sentinel-2",
      resolution: "10 m",
      image: "/demo/satellite/before_003.png"
    },
    after: {
      date: "22 MAR 2026",
      sensor: "Sentinel-2",
      resolution: "10 m",
      image: "/demo/satellite/after_003.png"
    },
    change_mask: "/demo/satellite/change_mask_003.png",
    metadata: {
      image_id: "scene_003",
      sensor: "Sentinel-2",
      resolution: "10 m",
      crs: "EPSG:4326",
      source: "Sentinel-2 L2A \u2014 New Delhi Aerocity",
      status: "COMPLETE"
    }
  },

  scene_004: {
    change_type: "Land Excavation",
    confidence: 0.92,
    change_area: "4,120 m\u00b2",
    location: {
      lat: 12.9352,
      lng: 77.6946,
      aoi_name: "Bangalore IT Corridor"
    },
    before: {
      date: "20 NOV 2023",
      sensor: "Sentinel-2",
      resolution: "10 m",
      image: "/demo/satellite/before_004.png"
    },
    after: {
      date: "05 FEB 2026",
      sensor: "Sentinel-2",
      resolution: "10 m",
      image: "/demo/satellite/after_004.png"
    },
    change_mask: "/demo/satellite/change_mask_004.png",
    metadata: {
      image_id: "scene_004",
      sensor: "Sentinel-2",
      resolution: "10 m",
      crs: "EPSG:4326",
      source: "Sentinel-2 L2A \u2014 Bangalore IT Corridor",
      status: "COMPLETE"
    }
  }
};

export const changeData = changeDataByScene.scene_001;
