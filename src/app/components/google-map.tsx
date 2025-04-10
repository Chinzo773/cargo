"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type AddressInputProps = {
  setAddress: (address: string) => void; 
  selectedId: string | null;
  selectedNum: string | null
};

const AddressInput: React.FC<AddressInputProps> = ({ setAddress, selectedId, selectedNum }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [address, setAddressState] = useState<string>("");
  const [address2, setAddress2] = useState<string>("")
  const [loading, setLoading] = useState<string>("-г Хүргүүлэх")


  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null); // useRef for the search box


  const handleSelect = useCallback(
    (places: google.maps.places.PlaceResult[]) => {
      const place = places[0];
      if (place.geometry) {
        const selectedAddress = place.formatted_address || "";
        setAddressState(selectedAddress);
        setAddress(selectedAddress);
      }
    },
    [setAddress]
  );

    const deliverence = async () => {
      setLoading("-г Хүргүүлж байна ...")
      await fetch("api/package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deliveryLocation: [address, address2],
          packageId: selectedId,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res != "Done") {
            toast("Алдаа гарлаа");
          }
        })
        .catch((err) => console.error("Error fetching packages:", err));
      toast("Амжилттай илгээгдлээ");
    };

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat && lng) {
        setLocation({ lat, lng });

        // Use the lat/lng to get the address via reverse geocoding
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
            const selectedAddress = results[0].formatted_address || "";
            setAddressState(selectedAddress); // Update local address state
            setAddress(selectedAddress); // Pass address to parent
          }
        });
      }
    },
    [setAddress]
  );

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places"]}
    >
      <div className="w-[100%]  lg:w-[600px] h-[400px]">
        <GoogleMap
          id="address-map"
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={location || { lat: 47.91935461654484, lng: 106.91749590887291 }} // Default to San Francisco
          zoom={16}
          onClick={handleMapClick} 
        >
          {location && <Marker position={location} />}{" "}
        </GoogleMap>
        <StandaloneSearchBox
          onLoad={(ref) => {
            searchBoxRef.current = ref; 
          }}
          onPlacesChanged={() =>
            handleSelect(searchBoxRef.current?.getPlaces() || [])
          } 
        >
          <div>
            <Input
              type="text"
              placeholder="Enter your delivery address"
              value={address}
              onChange={(e) => {
                setAddressState(e.target.value);
                setAddress(e.target.value); 
                console.log(address)
              }}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
              }}
              className="mt-4"
            />
            <div className="mt-4">
              <label className="text-sm font-medium">Хотхон/Байр/Тэмдэгт газар</label>
              <Input
                type="text"
                placeholder="Сувдан Сондор, ##-байр, Пльеханов"
                value={address2}
                onChange={(e) => {
                  setAddress2(e.target.value); 
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "16px",
                }}
              />
            </div>

            
            <Button
              className="cursor-pointer mt-4 bg-blue-600 hover:bg-blue-400 w-[100%] lg:w-[600px]"
              onClick={() => deliverence()}
            >
              {selectedNum}{loading}
            </Button>
          </div>
        </StandaloneSearchBox>
      </div>
    </LoadScript>
  );
};

export default AddressInput;
