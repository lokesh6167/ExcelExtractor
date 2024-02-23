"use client";
import React, { useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Checkbox } from "primereact/checkbox";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function Form() {
  const [file, setFile] = useState(null);
  const [separator, setSeparator] = useState(",");
  const [data, setData] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
    } else {
      alert("Please select a CSV file.");
    }
  };

  const handleSeparatorChange = (event) => {
    setSeparator(event.target.checked ? ";" : ",");
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sep", separator);

    try {
      const response = await axios.post(
        "https://promepy.pythonanywhere.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("upload failed with some error");
    }
  };

  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <h2 className="text-center sm:text-3xl font-bold text-black mt-4 mb-2 dark:text-neutral-200">
          Excel Extractor
        </h2>
        <form>
          <label className="block">
            <span className="sr-only">Choose file</span>
            <input
              type="file"
              className="block text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100"
              onChange={handleFileChange}
              accept=".csv"
            />
          </label>
          <br />
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-md bg-black p-1">
              <Checkbox
                onChange={handleSeparatorChange}
                checked={separator === ";"}
                id="semi-colon-checkbox"
                inputId="semi-colon-checkbox"
                className="form-checkbox h-5 w-5 text-white bg-black transition duration-150 ease-in-out"
              />
            </div>
            <label
              htmlFor="semi-colon-checkbox"
              className="text-sm text-neutral-600 dark:text-neutral-400"
            >
              Use semicolon (;) as separator
            </label>
          </div>
        </form>
        <button
          onClick={handleUpload}
          className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          Upload
        </button>
      </BackgroundGradient>
      {data && (
          <DataTable value={data.preview_rows}>
            {data.header.map((header) => (
              <Column
                key={header}
                field={header}
                header={header}
                sortable
                filter
              />
            ))}
          </DataTable>
        )}
    </div>
  );
}

export default Form;
