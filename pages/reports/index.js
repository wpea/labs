import Head from "next/head";
import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import axios from "axios";
import { apiAddress, get } from "../../lib/api";
import Spin from "./../../components/Spin";
import toast from "react-hot-toast";

export default function IndexReports() {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState("");
  const [client_id, setClientId] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState({
    file: false,
    client_id: false,
    file_type: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
    setFileSize(event.target.files[0].size);
    setFileType(event.target.files[0].type);
  };

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + "";
    } else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else {
      return (bytes / 1048576).toFixed(2) + " MB";
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!file) {
      setError({ ...error, file: true });
      return;
    }

    if (!client_id) {
      setError({ ...error, client_id: true });
      return;
    }

    if (fileType !== "text/csv") {
      setError({ ...error, file_type: true });
      return;
    }

    setError({ ...error, file: false, client_id: false, file_type: false });

    const formData = new FormData();
    formData.append("csv_file", file);
    formData.append("client_id", client_id);

    const config = {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axios.post(
      `${apiAddress}/labs/upload/report`,
      formData,
      config
    );

    if (res?.status === 200) {
      toast.success(res?.data?.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    const res = await axios.get(`${apiAddress}/labs/client/accounts`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });

    setAccounts(res.data);
  };

  return (
    <>
      <Head>
        <title>Reports - Upload csv investment reports</title>
      </Head>

      <>
        <div class="relative">
          <div class="absolute top-0 right-0">{loading && <Spin />}</div>

          <div className="min-h-screen grid place-items-center">
            <form
              onSubmit={handleUpload}
              type="multipart/form-data"
              className="space-y-6 border w-1/5 p-4"
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  {(error.file || error.client_id || error.file_type) && (
                    <div className="text-xs text-red-500 w-">
                      An error occured, check that you have selected an account
                      and have uploaded the right file format.
                    </div>
                  )}
                  <div className="text-xs">Select account</div>
                  <select
                    onChange={(e) => setClientId(e.target.value)}
                    className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                  >
                    <option value="">Choose</option>
                    {accounts.map((account) => (
                      <option key={account?.id} value={account?.id}>
                        {`${account?.contact_info?.firstname} ${account?.contact_info?.lastname}`}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="file"
                  onChange={handleChange}
                  className="file-input border p-3 text-sm rounded-md file-input-bordered overflow-hidden file-input-md w-full max-w-xs"
                />
              </div>

              <div className="text-xs space-y-1">
                <div>
                  <b>Filename:</b> {fileName}
                </div>
                <div>
                  <b>Filesize:</b> {formatFileSize(fileSize)}
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 border bg-black text-white text-sm font-bold hover:opacity-80 rounded-md"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      </>
    </>
  );
}
