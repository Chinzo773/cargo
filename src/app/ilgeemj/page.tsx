"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddressInput from "../components/google-map";
import { toast } from "sonner";
import { Map } from "lucide-react";
import { useUser } from "@clerk/nextjs";

type PackageDetailsProps = {
  id: string;
  packageNumber: string;
  senderName: string;
  senderPhoneNumber: string;
  receiverName: string;
  receiverPhoneNumber: string;
  quantity: number;
  cost: number;
  createdAt: string;
};

const Page = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [data, setData] = useState<PackageDetailsProps[]>([]);
  const [selected, setSelected] = useState<PackageDetailsProps>();
  const [loading, setLoading] = useState<String>('Уншиж байна...')
  const [address, setAddress] = useState("");

  const packages = async () => {
    await fetch("api/user/package?userId=" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.packages !== undefined) {
          setData(res.packages);
          setLoading('Ачаа байхгүй байна')
        } else {
          toast("Дугаар бүртгүүлэх хэрэгтэй");
        }
      })
      .catch((err) => console.error("Error fetching packages:", err));
  };

  useEffect(() => {
    if (userId !== undefined) {
      packages();
    }
  }, [user]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }} className="overflow-auto lg:overflow-visible mb-4">
      <h2 className=" text-3xl font-semibold pb-[50px]">Илгээмж/Хүргэлт</h2>
      <div
        className="flex justify-between flex-col"
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:justify-center gap-[50px] mt-5">
          <div
            className="font-semibold flex flex-col gap-4"
            style={{
              padding: "15px",
              borderRadius: "5px",
              border: "gray  1px solid",
            }}
          >
            {data.length == 0 ? (
              <div key={"Null"} className="text-black w-[]">
                {loading}
              </div>
            ) : (
              data?.map((props) => {
                return (
                  <div key={props.id} className="w-[100%] flex justify-between">
                    <details className="p-2" key={props.id}>
                      <summary>
                        Ачааны дугаар:&nbsp;
                        <span className="font-normal">
                          {props.packageNumber}
                        </span>
                      </summary>
                      <li>
                        Илгээгчийн нэр:&nbsp;
                        <span className="font-normal">{props.senderName}</span>
                      </li>
                      <li>
                        Илгээгчийн утасны дугаар:&nbsp;
                        <span className="font-normal">
                          {props.senderPhoneNumber}
                        </span>
                      </li>
                      <li>
                        Хүлээн авагчийн нэр:&nbsp;
                        <span className="font-normal">
                          {props.receiverName}
                        </span>
                      </li>
                      <li>
                        Хүлээн авагчийн утасны дугаар:&nbsp;
                        <span className="font-normal">
                          {props.receiverPhoneNumber}
                        </span>
                      </li>
                      <li>
                        Ачааны тоо:&nbsp;
                        <span className="font-normal">{props.quantity}</span>
                      </li>
                      <li>
                        Төлбөр:&nbsp;
                        <span className="font-normal">{props.cost}₮</span>
                      </li>
                      <li className="text-gray-300 text-xs">
                        Хүлээгдсэн огноо:&nbsp;
                        <span className="font-normal">{props.createdAt}</span>
                      </li>
                    </details>
                    <Button
                      className="cursor-pointer bg-blue-600 hover:bg-blue-400"
                      onClick={() => setSelected(props)}
                    >
                      <span className="hidden sm:inline">Газрын Зураг</span>{" "}
                      <Map />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
          {selected && (
            <div className="gap-[10px]">
              <AddressInput selectedId = {selected.id} selectedNum={selected.packageNumber}  setAddress={setAddress}></AddressInput>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
