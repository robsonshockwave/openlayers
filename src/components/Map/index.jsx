import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import LayerGroup from "ol/layer/Group";
import LayerSwitcher from "ol-layerswitcher";
import { useMapConfig } from "../../contexts/MapConfig";
import { MapWrapper } from "./styles";

export const MapComponent = () => {
  const {
    layerOSM,
    layerWater,
    layerXYZBase,
    layerXYZStreets,
    layerXYZSatellite,
    layerCMHome,
    layerPointCMHome,
  } = useMapConfig();

  const mapRef = useRef(null);

  useEffect(() => {
    const layerGroupOne = new LayerGroup({
      title: "Base maps",
      layers: [
        layerOSM,
        layerXYZBase,
        // layerWater,
        layerXYZSatellite,
        layerXYZStreets,
      ],
    });

    const layerGroupOverlayMap = new LayerGroup({
      title: "Overlay map",
      layers: [layerCMHome, layerPointCMHome],
    });

    const layerSwitcher = new LayerSwitcher({
      // reverse: true,
      // groupSelectStyle: "group",
      // className: "layer-switcher",
      target: document.querySelector(".ol-control"),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [layerGroupOne, layerGroupOverlayMap],
      view: new View({
        center: fromLonLat([-45.1304, -22.125]),
        // center: fromLonLat([-44.929, -21.9755]),
        zoom: 17,
      }),
    });

    map.addControl(layerSwitcher, "top-right");

    const currentLayer = map.getLayers().item(0);
    const layers = map.getLayers().item(0);
    currentLayer.on("change", () => {
      const teste = layers.getLayerStatesArray();
      let teste2 = [];

      teste.forEach((layer) => {
        if (layer.visible) {
          const layerProps = layer.layer.getProperties();
          teste2.push(layerProps?.title);
        }
      });

      if (
        !teste2.includes("Google satellite") &&
        teste2.includes("Google streets")
      ) {
        teste.forEach((layer) => {
          let teste3 = layer.layer.getProperties();

          if (teste3?.title === "Google streets") {
            layer.layer.setVisible(false);
          }
        });
      }
    });

    return () => {
      map.setTarget(null);
      map.removeControl(layerSwitcher);
    };
  }, []);

  return (
    <MapWrapper>
      <div className="ol-control">
        <div ref={mapRef} style={{ width: "100%", height: "98vh" }} />{" "}
      </div>
    </MapWrapper>
  );
};
