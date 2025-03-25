'use client';

import { useRouter } from "next/navigation";

const UserTypeSelection = () => {
  const router = useRouter();

  const handleSelection = (type: string) => {
    if (type === "individual") {
      router.push("/dashboard");
    } else if (type === "organization") {
      router.push("/organisationDetails");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Select Your User Type</h1>
        <div className="flex gap-6">
          <button
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-lg transition"
            onClick={() => handleSelection("individual")}
          >
            Individual
          </button>
          <button
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-lg transition"
            onClick={() => handleSelection("organization")}
          >
            Organization
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
