"use client";
import { useState, useEffect } from "react";
import { DropdownMenuRadioGroupDemo } from "../components/dropdown";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Delivery = {
  id: string;
  packageNumber: string;
  senderName: string;
  senderPhoneNumber: string;
  receiverName: string;
  receiverPhoneNumber: string;
  quantity: number;
  weight: number;
  status: "In Transit" | "Delivered" | "Pending" | "Shipped";
  delivery: boolean
  deliveryLocation: ['','']
  arrivedAt: Date
};

export default function Home() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchDeliveries = async () => {
    try {
      const response = await fetch("api/admin/package", {
        method: "GET",
      });

      const data = await response.json();
      setDeliveries(data.packages);
      setIsLoading(false);
    } catch {
      setError("Failed to load deliveries.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">
          Loading deliveries...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  const updateDeliveryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("api/admin/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: id,
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update delivery status");
      }

      const data = await response.json();
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.id === id ? { ...delivery, status: data.status } : delivery
        )
      );
      fetchDeliveries();
    } catch (error) {
      toast("Error updating delivery status:" + error);
    }
  };

  const filteredDeliveries = deliveries.filter((d) => {
    return (
      d.delivery == true ||
      d.packageNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.senderPhoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalDeliveries = filteredDeliveries.length;
  const inTransit = filteredDeliveries.filter(
    (d) => d.status === "In Transit"
  ).length;
  const delivered = filteredDeliveries.filter(
    (d) => d.status === "Delivered"
  ).length;
  const pending = filteredDeliveries.filter(
    (d) => d.status === "Pending"
  ).length;
  const shipped = filteredDeliveries.filter(
    (d) => d.status === "Shipped"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 over">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Cargo Admin</h1>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
          onClick={() => router.push("/admin/package-add")}
        >
          New Delivery
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search deliveries..."
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-6">
        <StatCard
          title="Total Deliveries"
          value={totalDeliveries}
          change="+2.5% from last month"
        />
        <StatCard
          title="In Transit"
          value={inTransit}
          change="Currently on the road"
        />
        <StatCard
          title="Delivered"
          value={delivered}
          change="Completed successfully"
        />
        <StatCard title="Pending" value={pending} change="Order Processing" />
        <StatCard
          title="Shipped"
          value={shipped}
          change="Available for pick up"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Delivery List
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left text-gray-600">Ачааны дугаар</th>
              <th className="p-4 text-left text-gray-600">Илгээгчийн нэр</th>
              <th className="p-4 text-left text-gray-600">
                Илгээгчийн утасны дугаар
              </th>
              <th className="p-4 text-left text-gray-600">
                Хүлээн авагчийн нэр
              </th>
              <th className="p-4 text-left text-gray-600">
                Х/а утасны дугаар
              </th>
              <th className="p-4 text-left text-gray-600">ширхэг</th>
              <th className="p-4 text-left text-gray-600">байдал</th>
              <th className="p-4 text-left text-gray-600">Кг/эзэлхүүн</th>
              <th className="p-4 text-left text-gray-600">статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.map((d) => (
              <tr
                key={d.id}
                className="border-b hover:bg-gray-50 transition-all duration-300"
              >
                <td className="p-4">{d.packageNumber}</td>
                <td className="p-4">{d.senderName}</td>
                <td className="p-4">{d.senderPhoneNumber}</td>
                <td className="p-4">{d.receiverName}</td>
                <td className="p-4">{d.receiverPhoneNumber}</td>
                <td className="p-4">{d.quantity}ш</td>
                <td className={`p-4 ${getStatusColor(d.status)}`}>
                  {d.status}
                </td>
                <td className="p-4">{d.weight}Кг</td>
                <td className="p-4">
                  <DropdownMenuRadioGroupDemo
                    id={d.id}
                    currentStatus={d.status}
                    onStatusChange={updateDeliveryStatus}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: number;
  change: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-gray-600 text-lg">{title}</h3>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{change}</p>
    </div>
  );
}
function getStatusColor(status: string) {
  switch (status) {
    case "In Transit":
      return "text-blue-600";
    case "Pending":
      return "text-yellow-600";
    case "Delivered":
      return "text-green-600";
    case "Shipped":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
}
