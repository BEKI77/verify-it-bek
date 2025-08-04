import type React from "react";
import { useState } from "react";
import { User, Calendar, Save } from "lucide-react";
import axios from "axios";
import FileUpload from "../../components/UI/FileUpload"
import Alert from "../../components/UI/Alert"
import { useInstitution } from "../../context/InstitutionContext"

const InstitutionUpload: React.FC = () => {
  const [selectedFile, setSelectedFile ] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { institution } = useInstitution();
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    degree: "",
    fieldOfStudy: "",
    issuedAt: "",
    cgpa: 0
  });

  const token = localStorage.getItem('auth_token');

  const degreeTypes = [
    "Bachelor of Science",
    "Bachelor of Arts",
    "Bachelor of Engineering",
    "Bachelor of Technology",
    "Master of Science",
    "Master of Arts",
    "Master of Engineering",
    "Master of Technology",
    "Doctor of Philosophy",
    "Diploma",
    "Certificate",
  ]

  const fieldOfStudyOptions = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Data Science",
    "Artificial Intelligence",
    "Cybersecurity",
    "Business Administration",
    "Marketing",
    "Finance",
    "Accounting",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Medicine",
    "Nursing",
    "Psychology",
    "Education",
    "Law",
    "Other",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(name,value);
    setFormData({...formData,[name]: value,
    })
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const showAlertMessage = (message: string, type: "success" | "error" = "success") => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!token) {
    showAlertMessage("Authentication token not found. Please login again.", "error");
    return;
  }

  // Validation for issuedAt
  if (!formData.issuedAt || isNaN(new Date(formData.issuedAt).getTime())) {
    showAlertMessage("Please provide a valid issue date.", "error");
    return;
  }

  // Validation for CGPA
  if (formData.cgpa === null || formData.cgpa === undefined || formData.cgpa === 0) {
    showAlertMessage("CGPA cannot be empty.", "error");
    return;
  }

  if (isNaN(Number(formData.cgpa)) ) {
    showAlertMessage("CGPA must be a number between 0 and 10.", "error");
    return;
  }

  setIsLoading(true);

  try {
    if (!institution || !institution.id) {
      showAlertMessage("Institution information is missing. Please try again later.", "error");
      setIsLoading(false);
      return;
    }

    const certificateData = {
      fullName: formData.fullName,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy,
      issuedAt: new Date(formData.issuedAt).toISOString(),
      cgpa: Number(formData.cgpa),
      institutionId: institution.id,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/institutions/issue`,
      certificateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    showAlertMessage(
      `Certificate for ${formData.fullName} issued successfully! Certificate ID: ${response.data.data.certificateId || "Generated"}`,
      "success"
    );

    // Reset form
    setFormData({
      fullName: "",
      degree: "",
      fieldOfStudy: "",
      issuedAt: "",
      cgpa: 0,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);

    const errorMessage =
      error.response?.data?.message || error.response?.data?.error || "Failed to upload file. Please try again.";

    showAlertMessage(errorMessage, "error");
  } finally {
    setIsLoading(false);
  }
};

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      showAlertMessage("Please select a file to upload.", "error");
      return;
    }

    if (!token) {
      showAlertMessage("Authentication token not found. Please login again.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/institutions/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      showAlertMessage(response.data.message || "Bulk upload successful!", "success");
      setSelectedFile(null); // Reset file input
    } catch (error: any) {
      console.error("Error during bulk upload:", error);
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to upload file. Please try again.";
      showAlertMessage(errorMessage, "error");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {showAlert && (
            <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} className="mb-6" />
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Issue Certificate</h1>
                <p className="text-gray-600 dark:text-gray-400">Issue new certificates for graduates</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Certificate Details</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Graduate Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter graduate's full name"
                      />
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Degree *
                      </label>
                      <select
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select degree type</option>
                        {degreeTypes.map((degree) => (
                          <option key={degree} value={degree}>
                            {degree}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Field of Study *
                      </label>
                      <select
                        name="fieldOfStudy"
                        value={formData.fieldOfStudy}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select field of study</option>
                        {fieldOfStudyOptions.map((field) => (
                          <option key={field} value={field}>
                            {field}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CGPA *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter CGPA (e.g., 3.5)"
                    />
                  </div>
                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Issue Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="issuedAt"
                        value={formData.issuedAt}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Save className="h-5 w-5" />
                    <span>{isLoading ? "Issuing Certificate..." : "Issue Certificate"}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* File Upload Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certificate File</h3>
                <FileUpload onFileSelect={handleFileSelect} />
                {selectedFile && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">✓ File selected: {selectedFile.name}</p>
                  </div>
                )}
                <button
                 onClick={handleBulkUpload}
                 disabled={isUploading}
                 className="mt-4 w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {isUploading ? "Uploading..." : "Upload File"}
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Guidelines</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• PDF files only (max 5MB)</li>
                  <li>• Ensure certificate is clear and readable</li>
                  <li>• Include all official seals and signatures</li>
                  <li>• Verify graduate information is accurate</li>
                  <li>• Certificate will be blockchain-verified</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                  Contact our support team for assistance with certificate uploads.
                </p>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View Upload Guide →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstitutionUpload
