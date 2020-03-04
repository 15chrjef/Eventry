import React, { useState, useEffect } from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { Label3 } from 'baseui/typography';
import ReactMapGL, { Marker, Layer, WebMercatorViewport } from 'react-map-gl';

function MarkerIcon({ hovered }) {
  return (
    <svg viewport="0 0 32 32" width="48" height="48" aria-labelledby="title"
    aria-describedby="desc" role="img">
      <path strokeWidth="2"
      fill={hovered ? "#FFBE2E" : "#2EFFB5"}
      strokeMiterlimit="10" stroke="#202020" d="M24,5 L14,18 L24,48 L34,18 L24,5"
      data-name="layer2" strokeLinejoin="round" strokeLinecap="round"></path>
    </svg>
  );
}
function VenuePoint({ venue, hoveredVenueId, setHoveredVenueId }) {
  const [css] = useStyletron();
  return (
    <Marker
      className={
        venue.id === hoveredVenueId &&
        css({
          zIndex: 1
        })
      }
      latitude={venue.location.latitude}
      longitude={venue.location.longitude}
    >
      <Block
        marginTop="-48px"
        marginLeft="-24px"
        onMouseLeave={() => { if (setHoveredVenueId) setHoveredVenueId(null) }}
        onMouseEnter={() => { if (setHoveredVenueId) setHoveredVenueId(venue.id) }}
      >
        <MarkerIcon hovered={venue.id === hoveredVenueId} />
        {
          venue.id === hoveredVenueId &&
          <Block backgroundColor="#f4f4f4" overrides={{ Block: { style: { border: '2px solid #202020' } } }} padding="4px">
            <Label3>{venue.name}</Label3>
          </Block>
        }
      </Block>
    </Marker>
  );
}

function venuesToLocations(venues) {
  return venues.map((venue) => {
    return [venue.location.longitude, venue.location.latitude];
  });
}

export default function DiscoveryMap({ venues, hoveredVenueId, disableScrollZoom, setHoveredVenueId }) {
  const [ viewport, setViewport ] = useState(getViewport());

  useEffect(() => {
    setViewport(getViewport());
  }, [venues]);

  function getViewport() {
    if (venues.length === 0) {
      return {
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 12,
      };
    }
    if (venues.length === 1) {
      return {
        latitude: venues[0].location.latitude,
        longitude: venues[0].location.longitude,
        zoom: 12,
      };
    }
    let minLat = venues[0].location.latitude;
    let minLong = venues[0].location.longitude;
    let maxLat = venues[0].location.latitude;
    let maxLong = venues[0].location.longitude;
    venues.forEach((venue) => {
      if (minLat > venue.location.latitude) {
        minLat = venue.location.latitude;
      }
      if (minLong > venue.location.longitude) {
        minLong = venue.location.longitude;
      }
      if (maxLat < venue.location.latitude) {
        maxLat = venue.location.latitude;
      }
      if (maxLong < venue.location.longitude) {
        maxLong = venue.location.longitude;
      }
    });

    const vp = new WebMercatorViewport({ width: 300, height: 300 })
      .fitBounds([[maxLong, minLat], [minLong, maxLat]], { padding: 10 });

    return vp;
  }
  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      onViewportChange={(vp) => setViewport(vp)}
      scrollZoom={disableScrollZoom ? false : true}
      mapboxApiAccessToken="pk.eyJ1IjoianVuc3VobGVlOTQiLCJhIjoiY2pzbDk3aHI5MXQycDQzazZxNXc5cG52ayJ9.bMXJRfKZO38TdR7szbu4xw"
    >
      {venues.map((venue, index) => <VenuePoint setHoveredVenueId={setHoveredVenueId} venue={venue} hoveredVenueId={hoveredVenueId} id={venue.id} key={index} />)}
    </ReactMapGL>
  );
}
