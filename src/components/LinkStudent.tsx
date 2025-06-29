import React, { useState, useRef, useEffect } from "react";
import { Camera, UserPlus, QrCode, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModalLinkFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isLoading: boolean;
}

const ModalLinkForm: React.FC<ModalLinkFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    grade: "",
    class: "",
    pin: "",
  });
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form
      if (
        !formData.studentId ||
        !formData.name ||
        !formData.grade ||
        !formData.class ||
        !formData.pin
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.pin.length !== 4) {
        throw new Error("PIN must be exactly 4 digits");
      }

      await onSubmit(formData);

      // Reset form on success
      setFormData({
        studentId: "",
        name: "",
        grade: "",
        class: "",
        pin: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to link student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setShowQRScanner(true);
        setIsScanning(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowQRScanner(false);
    setIsScanning(false);
    setScanResult(null);
  };

  const simulateQRScan = () => {
    // Simulate QR code detection for demo
    setTimeout(() => {
      const mockStudentId =
        "STU" +
        Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");
      setScanResult(mockStudentId);
      handleQRSubmit(mockStudentId);
    }, 2000);
  };

  const handleQRSubmit = async (studentId: string) => {
    try {
      const qrFormData = {
        studentId,
        name: `Student ${studentId}`,
        grade: "Grade 10",
        class: "10A",
        pin: "1234",
      };

      await onSubmit(qrFormData);
      stopCamera();
    } catch (error) {
      toast({
        title: "Linking Failed",
        description: "Unable to link student. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" data-oid="dwsqk-j">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
        data-oid="qcvsy8z"
      >
        <TabsList
          className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl"
          data-oid="ff0gkvu"
        >
          <TabsTrigger
            value="manual"
            className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            data-oid="v.p:gp0"
          >
            <UserPlus className="h-4 w-4" data-oid="_e5cy:-" />
            <span className="hidden sm:inline" data-oid="3m3fbpu">
              Manual Entry
            </span>
            <span className="sm:hidden" data-oid="r27scid">
              Manual
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="qr"
            className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            data-oid="yrpeh70"
          >
            <QrCode className="h-4 w-4" data-oid="sfq2njs" />
            <span className="hidden sm:inline" data-oid="pt9fj75">
              QR Scan
            </span>
            <span className="sm:hidden" data-oid="px2n-u8">
              QR
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6" data-oid="xxxlywa">
          <div className="text-center mb-6" data-oid="h45kgpk">
            <div
              className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-2xl"
              data-oid="e9_pk-f"
            >
              <UserPlus
                className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-3"
                data-oid="0q-x9g7"
              />

              <h3
                className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                data-oid="js1z-jq"
              >
                Add Student Details
              </h3>
              <p
                className="text-gray-600 dark:text-gray-300 text-sm"
                data-oid="9j:aogl"
              >
                Enter your student's information manually
              </p>
            </div>
          </div>

          <form
            onSubmit={handleManualSubmit}
            className="space-y-4"
            data-oid="97v-ir:"
          >
            <div data-oid="x4kw:y0">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                data-oid="wkpt0ll"
              >
                Student ID
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="STU003"
                data-oid="i3u0wxw"
              />
            </div>

            <div data-oid="s-vgj:_">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                data-oid="awpd.c6"
              >
                Student Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Full Name"
                data-oid="6ztd-7u"
              />
            </div>

            <div className="grid grid-cols-2 gap-4" data-oid="n7j5qox">
              <div data-oid="yliwv6:">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="a9ee9kp"
                >
                  Grade
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={(e) => handleInputChange("grade", e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Grade 10"
                  data-oid="xi5.:92"
                />
              </div>
              <div data-oid="3pthn3i">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  data-oid="_0ddb1b"
                >
                  Class
                </label>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={(e) => handleInputChange("class", e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="10A"
                  data-oid="u2oh81x"
                />
              </div>
            </div>

            <div data-oid="0lbv0i2">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                data-oid="x5g2xj0"
              >
                PIN for Purchases
              </label>
              <input
                type="password"
                name="pin"
                value={formData.pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleInputChange("pin", value);
                }}
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="****"
                data-oid="q8qxggq"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              data-oid="x78llo2"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2" data-oid="b7orerm">
                  <div
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                    data-oid="gl.5n.p"
                  ></div>
                  <span data-oid="_h6xg4b">Linking Student...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2" data-oid="p-_y816">
                  <UserPlus className="h-5 w-5" data-oid="p6wjn.m" />
                  <span data-oid="iccq49r">Link Student</span>
                </div>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="qr" className="space-y-6" data-oid="w4p18lm">
          <div className="text-center mb-6" data-oid="mou149a">
            <div
              className="bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 p-6 rounded-2xl"
              data-oid="9o:0t78"
            >
              <QrCode
                className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-3"
                data-oid="2w9d63u"
              />

              <h3
                className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                data-oid="jh5:z.n"
              >
                Scan QR Code
              </h3>
              <p
                className="text-gray-600 dark:text-gray-300 text-sm"
                data-oid="oo7mjje"
              >
                Point your camera at the student's QR code
              </p>
            </div>
          </div>

          {!showQRScanner ? (
            <div className="text-center" data-oid="lbreinb">
              <Button
                onClick={startCamera}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-3 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                data-oid="hl8kqet"
              >
                <Camera className="h-5 w-5 mr-2" data-oid="uu03ut5" />
                Start Camera
              </Button>
            </div>
          ) : (
            <div className="space-y-4" data-oid="mmo7715">
              {!scanResult ? (
                <>
                  <div
                    className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden aspect-square"
                    data-oid=":m-wf1e"
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      data-oid="8aknik_"
                    />

                    {/* Scanning overlay */}
                    <div
                      className="absolute inset-0 border-2 border-blue-500"
                      data-oid="w.kskla"
                    >
                      <div
                        className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"
                        data-oid="xhrd4ri"
                      ></div>
                      <div
                        className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"
                        data-oid="x4i358x"
                      ></div>
                      <div
                        className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"
                        data-oid="b2xtwm."
                      ></div>
                      <div
                        className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"
                        data-oid="bw0lp2:"
                      ></div>

                      {/* Scanning line animation */}
                      <div
                        className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-500 animate-pulse"
                        data-oid=".s3_4s7"
                      ></div>
                    </div>

                    <Button
                      onClick={stopCamera}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                      data-oid=":e-ds0h"
                    >
                      <X className="h-4 w-4" data-oid="8hjsy4n" />
                    </Button>
                  </div>

                  <div className="text-center space-y-4" data-oid="y12mmqs">
                    <p
                      className="text-gray-600 dark:text-gray-300 text-sm"
                      data-oid="201k66g"
                    >
                      Position the QR code within the frame
                    </p>
                    <Button
                      onClick={simulateQRScan}
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      data-oid="xwthvs-"
                    >
                      Simulate QR Scan (Demo)
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4" data-oid="q7hcb:3">
                  <div
                    className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl"
                    data-oid="s4tevm1"
                  >
                    <CheckCircle
                      className="h-16 w-16 text-green-500 mx-auto mb-4"
                      data-oid=":903du5"
                    />

                    <h3
                      className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                      data-oid="pwhrzxf"
                    >
                      QR Code Detected!
                    </h3>
                    <p
                      className="text-gray-600 dark:text-gray-300"
                      data-oid="a0mypg9"
                    >
                      Student ID: {scanResult}
                    </p>
                    <div className="mt-4" data-oid="qyizw2v">
                      {isLoading ? (
                        <div
                          className="flex items-center justify-center space-x-2"
                          data-oid="xtd60.1"
                        >
                          <div
                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"
                            data-oid="0hrsubh"
                          ></div>
                          <span
                            className="text-green-600 dark:text-green-400"
                            data-oid="s2sep7h"
                          >
                            Linking student...
                          </span>
                        </div>
                      ) : (
                        <p
                          className="text-green-600 dark:text-green-400 font-medium"
                          data-oid="xoam1cy"
                        >
                          Student linked successfully!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModalLinkForm;
