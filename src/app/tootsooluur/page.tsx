"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { MapPinned } from "lucide-react";
import Footer from "../components/footer";

export default function HomePage() {
  const [length, setLength] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  const [cargoPrice, setCargoPrice] = useState<number | null>(null);

  useEffect(() => {
    const calculateCargoPrice = () => {
      if (
        length === null ||
        height === null ||
        width === null ||
        weight === null
      ) {
        return;
      }

      let price = 0;

      if (length <= 50 && height <= 50 && width <= 50 && weight <= 5) {
        price = 1000;
      } else if (weight <= 10) {
        price = 3000;
      } else {
        price = 5000;
      }

      if (length > 50 || height > 50 || width > 50 || weight > 10) {
        if (weight > 10) {
          price = Math.max(price, weight * 2000);
        }
        if (length * height * width > 5000) {
          price = Math.max(price, ((length * height * width) / 1000) * 750);
        }
      }

      setCargoPrice(price);
    };

    calculateCargoPrice();
  }, [length, height, width, weight]);

  const handleNumericChange = (setter: React.Dispatch<React.SetStateAction<number | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty or numeric values only
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value === "" ? null : Number(value));
    }
  };

  return (
    <div className="flex space-x-6 justify-center items-center h-[70vh]">
      <div className="flex flex-col p-6 bg-white rounded-lg w-lg">
        <div className="w-full space-y-4 mt-4">
          <div>
            <label className="block font-medium">Урт (см):</label>
            <Input
              type="text"
              value={length === null ? "" : length}
              onInput={handleNumericChange(setLength)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Өндөр (см):</label>
            <Input
              type="text"
              value={height === null ? "" : height}
              onInput={handleNumericChange(setHeight)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Өргөн (см):</label>
            <Input
              type="text"
              value={width === null ? "" : width}
              onInput={handleNumericChange(setWidth)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Жин (кг):</label>
            <Input
              type="text"
              value={weight === null ? "" : weight}
              onInput={handleNumericChange(setWeight)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm">
          <p className="font-semibold">Заавар:</p>
          <p>Зардлыг үнэн зөв тооцоолохын тулд утга зөв эсэхийг шалгаарай.</p>
          <p>Зардлыг тооцоолохын тулд хэмжээс, жинг оруулна уу.</p>
        </div>
        <div className="mt-3 p-4 bg-gray-100 rounded-lg text-sm h-[80px] space-y-4 w-[465px]">
          <p className="font-semibold flex-col items-center">Карго үнэ:</p>
          {cargoPrice !== null && <p>Тооцоолсон үнэ: {cargoPrice}₮</p>}
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-[-10px]">
        <div className="p-4 bg-gray-100 rounded-lg text-sm h-[200px]">
          <p className="font-semibold">Карго үнэ тооцох:</p>
          <p>
            <strong>Жижиг оврын ачаа:</strong>
            <br /> - Жижиг бараа (кейс, чихэвч г.м) 1000₮-2000₮
            <br /> - Хөнгөн жижиг оврын бараа 3000₮-ээс дээш хэмжээнээс хамааран
            тооцогдоно.
            <br /> - Хайрцагтай бараа 5000₮-өөс эхлэн овроор тооцогдоно.
          </p>
          <p>
            <strong>Том оврын ачаа:</strong>
            <br /> - Хөнгөн овортой ачаа м³ нь 750¥ буюу 375,000₮
            <br /> - Овор багатай хүнд ачаа 1кг нь 2000₮
          </p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg text-sm h-[225px] space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="border border-[rgba(54,58,93,var(--tw-border-opacity))] rounded-3xl h-[50px] w-[50px] p-2.5" />
            <div>Утас: 99355233</div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPinned className="border border-[rgba(54,58,93,var(--tw-border-opacity))] rounded-3xl h-[50px] w-[50px] p-2.5" />
            <div>Хаяг: Орхон аймаг, Баян-Өндөр сум, Их хаадын цуваа</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
