import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Dimensions, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { DNK } from '../data/mobileData';

interface GujaratVisualMapProps {
  dnks: DNK[];
  selectedDnk: DNK;
  onSelectDnk: (dnk: DNK) => void;
  selectedDistrict: string;
}

const MAP_WIDTH = Dimensions.get('window').width - 32;
const MAP_HEIGHT = 320;

const DISTRICT_PRESETS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'All': { lat: 22.5000, lng: 71.5000, zoom: 7 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, zoom: 12 },
  'Surat': { lat: 21.1702, lng: 72.8311, zoom: 12 },
  'Bhuj': { lat: 23.2420, lng: 69.6669, zoom: 11 },
  'Vadodara': { lat: 22.3072, lng: 73.1812, zoom: 12 },
  'Rajkot': { lat: 22.3039, lng: 70.8022, zoom: 12 },
  'Gandhinagar': { lat: 23.2156, lng: 72.6369, zoom: 12 },
  'Jamnagar': { lat: 22.4707, lng: 70.0577, zoom: 12 },
  'Bhavnagar': { lat: 21.7645, lng: 72.1519, zoom: 12 },
  'Anand': { lat: 22.5645, lng: 72.9289, zoom: 12 },
  'Junagadh': { lat: 21.5222, lng: 70.4579, zoom: 12 },
  'Mehsana': { lat: 23.5880, lng: 72.3693, zoom: 12 },
  'Bharuch': { lat: 21.7051, lng: 72.9959, zoom: 12 },
};

export default function GujaratVisualMap({
  dnks,
  selectedDnk,
  onSelectDnk,
  selectedDistrict,
}: GujaratVisualMapProps) {
  const webViewRef = useRef<any>(null);
  const iframeRef = useRef<any>(null);

  const preset = DISTRICT_PRESETS[selectedDistrict] || DISTRICT_PRESETS['All'];

  // Generate Leaflet HTML with CartoDB Voyager tiles and custom SVG pins
  const generateLeafletHtml = () => {
    const dnkJson = JSON.stringify(dnks);
    const selectedId = selectedDnk.id;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: #0f172a;
          }
          .custom-pin {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 16px;
            background-color: #102A43;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            color: #ffffff;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s ease;
          }
          .custom-pin-active {
            background-color: #C62828 !important;
            transform: scale(1.25);
            border-color: #ffcdd2;
            box-shadow: 0 0 16px rgba(198, 40, 40, 0.6);
            z-index: 1000 !important;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var dnks = ${dnkJson};
          var selectedId = "${selectedId}";

          var map = L.map('map', {
            center: [${preset.lat}, ${preset.lng}],
            zoom: ${preset.zoom},
            zoomControl: true,
            attributionControl: false
          });

          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
          }).addTo(map);

          var markers = {};

          dnks.forEach(function(dnk) {
            var isSel = dnk.id === selectedId;
            var iconHtml = '<div class="custom-pin ' + (isSel ? 'custom-pin-active' : '') + '">' +
                           (dnk.code ? dnk.code.slice(-2) : '📮') + '</div>';

            var icon = L.divIcon({
              html: iconHtml,
              className: 'leaflet-custom-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -18]
            });

            var marker = L.marker([dnk.lat, dnk.lng], { icon: icon }).addTo(map);
            marker.bindPopup('<b>' + dnk.name + '</b><br>' + dnk.address + '<br><b>PIN:</b> ' + dnk.pinCode);

            marker.on('click', function() {
              var payload = JSON.stringify({ type: 'SELECT_DNK', id: dnk.id });
              if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                window.ReactNativeWebView.postMessage(payload);
              } else if (window.parent) {
                window.parent.postMessage(payload, '*');
              }
            });

            markers[dnk.id] = marker;
          });

          window.addEventListener('message', function(event) {
            try {
              var data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
              if (data.type === 'FLY_TO') {
                map.flyTo([data.lat, data.lng], data.zoom, { duration: 0.8 });
              }
            } catch(e) {}
          });
        </script>
      </body>
      </html>
    `;
  };

  // Listen for messages on web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebMsg = (e: any) => {
        try {
          const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
          if (data && data.type === 'SELECT_DNK') {
            const found = dnks.find(d => d.id === data.id);
            if (found) {
              onSelectDnk(found);
            }
          }
        } catch (err) {}
      };
      window.addEventListener('message', handleWebMsg);
      return () => window.removeEventListener('message', handleWebMsg);
    }
  }, [dnks, onSelectDnk]);

  // Fly to district when selectedDistrict or selectedDnk changes
  useEffect(() => {
    const targetLat = selectedDnk.lat || preset.lat;
    const targetLng = selectedDnk.lng || preset.lng;
    const targetZoom = selectedDistrict === 'All' ? 7 : 12;

    const payload = JSON.stringify({
      type: 'FLY_TO',
      lat: targetLat,
      lng: targetLng,
      zoom: targetZoom,
    });

    if (Platform.OS === 'web' && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(payload, '*');
    } else if (webViewRef.current) {
      webViewRef.current.postMessage(payload);
    }
  }, [selectedDistrict, selectedDnk]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SELECT_DNK') {
        const found = dnks.find(d => d.id === data.id);
        if (found) {
          onSelectDnk(found);
        }
      }
    } catch (e) {}
  };

  const openInGoogleMaps = (dnk: DNK) => {
    const geoUrl = `geo:${dnk.lat},${dnk.lng}?q=${dnk.lat},${dnk.lng}(${encodeURIComponent(dnk.name)})`;
    const webUrl = `https://www.google.com/maps/search/?api=1&query=${dnk.lat},${dnk.lng}`;

    Linking.canOpenURL(geoUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(geoUrl);
        } else {
          return Linking.openURL(webUrl);
        }
      })
      .catch(() => {
        Linking.openURL(webUrl).catch(() => {
          Alert.alert('Map Error', 'Could not open Google Maps application.');
        });
      });
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Call Error', 'Could not open phone dialer.');
    });
  };

  return (
    <View style={styles.container}>
      {/* Real Interactive Leaflet / OpenStreetMap Container */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            ref={iframeRef}
            srcDoc={generateLeafletHtml()}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Gujarat DNK Map"
          />
        ) : (
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: generateLeafletHtml() }}
            style={styles.webView}
            onMessage={handleMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Selected Center Live Inspector Card */}
      <View style={styles.inspectCard}>
        <View style={styles.inspectHeader}>
          <View style={styles.inspectTitleCol}>
            <Text style={styles.inspectDistrict}>📍 {selectedDnk.district} Export Hub</Text>
            <Text style={styles.inspectName}>{selectedDnk.name}</Text>
          </View>
          <View style={styles.openBadge}>
            <Text style={styles.openText}>● Open 9 AM–6 PM</Text>
          </View>
        </View>

        <Text style={styles.inspectAddress}>{selectedDnk.address}</Text>

        <View style={styles.coordsRow}>
          <Text style={styles.coordsText}>GPS: {selectedDnk.lat.toFixed(4)}° N, {selectedDnk.lng.toFixed(4)}° E</Text>
          <Text style={styles.pinCodeText}>PIN: {selectedDnk.pinCode}</Text>
        </View>

        <View style={styles.servicesGrid}>
          {selectedDnk.services.map((s, idx) => (
            <View key={idx} style={styles.serviceChip}>
              <Text style={styles.serviceChipText}>✓ {s}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons: 1-Tap Google Maps & Phone */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.googleMapsBtn}
            onPress={() => openInGoogleMaps(selectedDnk)}
            activeOpacity={0.8}
          >
            <Text style={styles.googleMapsBtnText}>🗺️ Open in Google Maps</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => handleCall(selectedDnk.contactPhone)}
            activeOpacity={0.8}
          >
            <Text style={styles.callBtnText}>📞 Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  mapContainer: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#1E3A5F',
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  webView: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  inspectCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  inspectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  inspectTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  inspectDistrict: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C62828',
  },
  inspectName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 2,
  },
  openBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  openText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  inspectAddress: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 8,
  },
  coordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  coordsText: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  pinCodeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  serviceChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  serviceChipText: {
    fontSize: 10,
    color: '#1E40AF',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  googleMapsBtn: {
    flex: 2,
    backgroundColor: '#102A43',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  googleMapsBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  callBtn: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtnText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
