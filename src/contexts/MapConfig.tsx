import React, { createContext, useCallback, useContext, useState } from "react";
import XYZ from "ol/source/XYZ";
import LayerTile from "ol/layer/Tile";
import SourceOSM from "ol/source/OSM";
import SourceStamen from "ol/source/Stamen";
import TileWMS from "ol/source/TileWMS";
import { BaseLayerOptions } from "ol-layerswitcher";

export const MapConfigContext = createContext({});

export const MapConfigProvider = ({ children }) => {
  const layerOSM = new LayerTile({
    title: "OSM",
    type: "base",
    visible: false,
    source: new SourceOSM(),
  } as BaseLayerOptions);

  const layerWater = new LayerTile({
    title: "Water color",
    type: "base",
    visible: false,
    source: new SourceStamen({
      layer: "watercolor",
    }),
  } as BaseLayerOptions);

  const layerXYZSatellite = new LayerTile({
    title: "Google satellite",
    type: "base",
    visible: true,
    source: new XYZ({
      url: "http://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    }),
  } as BaseLayerOptions);

  const layerXYZStreets = new LayerTile({
    title: "Google streets",
    visible: false,
    source: new XYZ({
      url: "http://mt1.google.com/vt/lyrs=h@159000000&hl=en&x={x}&y={y}&z={z}&s=Ga",
    }),
    zIndex: 1,
  } as BaseLayerOptions);

  const layerXYZBase = new LayerTile({
    title: "Google base",
    type: "base",
    visible: false,
    source: new XYZ({
      url: "https://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    }),
  } as BaseLayerOptions);

  const layerCMHome = new LayerTile({
    title: "Home",
    visible: false,
    source: new TileWMS({
      url: "http://localhost:8080/geoserver/wms",
      params: {
        VERSION: "1.1.1",
        FORMAT: "image/png",
        TRANSPARENT: true,
        LAYERS: "homehome:Home_test",
        STYLES: "Home_style",
      },
    }),
    zIndex: 2,
  } as BaseLayerOptions);

  const layerPointCMHome = new LayerTile({
    title: "Ponto Home",
    visible: false,
    source: new TileWMS({
      url: "http://localhost:8080/geoserver/wms",
      params: {
        VERSION: "1.1.1",
        FORMAT: "image/png",
        TRANSPARENT: true,
        LAYERS: "homehome:point",
        STYLES: "ponto",
      },
    }),
    zIndex: 2,
  } as BaseLayerOptions);

  const [layer, setLayer] = useState(layerOSM);
  const onLayerChange = useCallback((layerSet) => {
    setLayer(layerSet);
  }, []);

  return (
    <MapConfigContext.Provider
      value={{
        layerOSM,
        layerXYZBase,
        layerXYZStreets,
        layerXYZSatellite,
        layerWater,
        onLayerChange,
        layer,
        layerCMHome,
        layerPointCMHome,
      }}
    >
      {children}
    </MapConfigContext.Provider>
  );
};

export const useMapConfig = () => {
  const context = useContext(MapConfigContext);
  return context;
};
