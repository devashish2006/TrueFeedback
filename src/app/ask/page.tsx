'use client';

import { useRouter } from "next/navigation";

const UserTypeSelection = () => {
  const router = useRouter();

  const handleSelection = (type: string) => {
    if (type === "individual") {
      router.push("/dashboard");
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
            className="px-6 py-3 bg-gray-600 cursor-not-allowed rounded-lg text-lg opacity-50 relative"
            disabled
          >
            Organization (Beta)
            <span className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full transform translate-x-1/2 -translate-y-1/2">Beta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
