import React from "react";
import { useNavigate } from 'react-router-dom';




const LabelPrint = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Label Print</h1>
        <button
          onClick={() => navigate("/mainTable")}
         className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded">
          Back to List
        </button>
      </div>

      {/* Master Form Card */}
      <div className="bg-white rounded shadow">
        <div className="bg-red-700 text-white px-6 py-3 rounded-t">
          <h2 className="text-lg font-semibold">Master Form</h2>
        </div>

        <form className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Serial Number */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                placeholder="Enter Your Serial Number..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
              />
            </div>

            {/* Tag Number */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag Number
              </label>
              <input
                type="text"
                placeholder="Enter Your Tag Number..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
              />
            </div>

            {/* Label Type */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label Type
              </label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300">
                <option>Select</option>
              </select>
            </div>

            {/* Basic Code */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Basic Code
              </label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300">
                <option>Select</option>
              </select>
            </div>

            {/* Manufacturing Date */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturing Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
              />
            </div>

            {/* Status */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabelPrint;
