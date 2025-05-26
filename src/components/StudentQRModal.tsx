
import React from 'react';
import { X, QrCode, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const StudentQRModal = ({ student, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  // Generate QR code data (in real app, this would be a proper QR library)
  const qrData = `STUDENT_PAYMENT:${student.studentId}:${student.name}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-sm w-full shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Payment QR Code</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 text-center">
          <div className="mb-4">
            <img
              src={student.photo || '/api/placeholder/60/60'}
              alt={student.name}
              className="w-15 h-15 rounded-full object-cover mx-auto mb-2"
            />
            <h3 className="font-medium text-gray-900 text-sm">{student.name}</h3>
            <p className="text-xs text-gray-500">{student.studentId} • {student.grade}</p>
          </div>
          
          {/* QR Code Placeholder - In production, use a proper QR library */}
          <div className="w-40 h-40 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <QrCode className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">QR Code</p>
              <p className="text-xs text-gray-400 mt-1">for {student.name}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Scan this QR code to make payments for {student.name}
            </p>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono break-all">{qrData}</span>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Daily Limit: {new Intl.NumberFormat('rw-RW', {
                style: 'currency',
                currency: 'RWF',
                minimumFractionDigits: 0
              }).format(student.dailyLimit)}</p>
              <p>• Today Spent: {new Intl.NumberFormat('rw-RW', {
                style: 'currency',
                currency: 'RWF',
                minimumFractionDigits: 0
              }).format(student.todaySpent)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQRModal;
