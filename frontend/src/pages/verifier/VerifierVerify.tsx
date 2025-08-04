import React, { useState, useRef, useEffect } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle, Download, FileText, Camera } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library'; // Import ZXing library
import Alert from '../../components/UI/Alert';
import axios from 'axios';
import { VerificationMessage } from '../../components/UI/Message';
import { useVerification } from '../../context/VerificationContext';


const VerifierVerify: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { verificationResult, setVerificationResult } = useVerification();
  const [showAlert, setShowAlert] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false); // For QR scanning
  const videoRef = useRef<HTMLVideoElement>(null); // Reference for video element

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result;
        if (imageData && typeof imageData === 'string') {
          const img = new Image();
          img.src = imageData;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, img.width, img.height);
              const codeReader = new BrowserMultiFormatReader();
              codeReader.decodeFromImage(img).then((result) => {
                setSearchQuery(result.getText());
                handleSearch({ preventDefault: () => {} } as React.FormEvent);
              }).catch(() => {
                alert('No QR code found in the uploaded image.');
              });
            }
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startQrScanner = () => {
    setIsScanning(true);
    const codeReader = new BrowserMultiFormatReader();
    codeReader.decodeFromVideoDevice(null, videoRef.current!, (result, error) => {
      if (result) {
        setSearchQuery(result.getText());
        setIsScanning(false);
        codeReader.reset();
        handleSearch({ preventDefault: () => {} } as React.FormEvent);
      }
      if (error) {
        console.error(error);
      }
    });
  };

  useEffect(() => {
    console.log('Updated verificationResult:', verificationResult);
  }, [verificationResult]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Add to search history
    if (!searchHistory.includes(searchQuery)) {
      setSearchHistory((prev) => [searchQuery, ...prev.slice(0, 4)]);
    }

    try {
      // Construct the verify link
      const verifyLink = `${import.meta.env.VITE_BACKEND_URL}/verify?certificateId=${searchQuery}`;

      // Make a GET request to the verify link using axios
      const response = await axios.get(verifyLink);
      if (response.status === 200) {
        setVerificationResult({
          id: response.data.data.certificateId,
          studentId: 'tmp',
          studentName: response.data.data.fullName,
          certificateType: response.data.data.degree,
          issueDate: response.data.data.issuedAt,
          institutionName: response.data.data.institution,
          verificationCode: searchQuery,
          status: "verified",
        });
      } else {
        setVerificationResult({
          id: 'not-found',
          studentId: 'unknown',
          studentName: 'Not Found',
          institutionName: 'Certificate not found or invalid',
          certificateType: 'Unknown',
          issueDate: '',
          verificationCode: '',
          status: 'rejected',
        });
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setVerificationResult({
        id: 'error',
        studentId: 'unknown',
        studentName: 'Error',
        institutionName: 'An error occurred while verifying the certificate',
        certificateType: 'Unknown',
        issueDate: '',
        verificationCode: '',
        status: 'pending',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {showAlert && (
            <Alert
              type="info"
              message="This is a demo feature. In a real application, this would download a verification report."
              onClose={() => setShowAlert(false)}
              className="mb-6"
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Verify Certificate
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a verification code, scan a QR code, or upload an image to verify certificate authenticity.
            </p>
          </div>

          <div className="grid grid-cols-1  gap-8">
            {/* Main Verification Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Search Form */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Certificate Verification
                </h2>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Verification Code
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter verification code"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSearching}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Search className="h-5 w-5" />
                        <span>{isSearching ? 'Verifying...' : 'Verify'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                      <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1" />
                      <span className="text-sm">OR</span>
                      <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1" />
                    </div>
                  </div>

                  {/* QR Code Scanner */}
                  <div className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {isScanning ? (
                      <video ref={videoRef} className="w-full h-auto" />
                    ) : (
                      <button
                        onClick={startQrScanner}
                        className="flex items-center space-x-2"
                      >
                        <Camera className="h-6 w-6" />
                        <span>Scan QR Code</span>
                      </button>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex items-center space-x-2"
                    >
                      <FileText className="h-6 w-6" />
                      <span>Upload Image</span>
                    </label>
                  </div>
                </form>
                  <VerificationMessage/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifierVerify;