import React from "react";
import { Eye, EyeOff, GraduationCap, User } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
      
var username = localStorage.getItem("full_name_x990_0");
var parentId = "verified account";
var phoneNumber =  localStorage.getItem("phone_x990_0");

const StudentCard = ({ balance, isVisible, onToggleVisibility, 
  studentName = username,
  studentId = parentId, 

   university = "University Name" }) => {
  const { t } = useLanguage();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full mx-auto">
      {/* Card Container */}
      <div className="relative group perspective-1000">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
        
        {/* Main Card */}
        <div className="relative bg-zinc-900 dark:from-slate-800 dark:via-blue-800 dark:to-indigo-800 rounded-2xl p-6 text-white shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500 overflow-hidden">
          
          {/* Background Pattern */}
          {/* <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
          </div>
           */}
          {/* Header Section */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wide">Kaascan Card</h3>
                <p className="text-xs text-gray-300">Virtual Card</p>
              </div>
            </div>
            
            {/* Balance Toggle */}
            <button
              onClick={onToggleVisibility}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm border border-white/20"
            >
              {isVisible ? (
                <EyeOff className="w-4 h-4 text-gray-300" />
              ) : (
                <Eye className="w-4 h-4 text-gray-300" />
              )}
            </button>
          </div>

          {/* Student Info Section */}
          <div className="relative z-10 flex items-center space-x-4 mb-6">
            {/* Avatar */}
           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5 shadow-lg">
  <div className="w-full h-full rounded-full 
              bg-gradient-to-br from-gray-200 to-gray-300 flex items-center
              justify-center overflow-hidden">
    <img 
      src="/assets/young-boy.png" 
      alt="User Avatar"
      className="w-50 h-50 object-cover"
    />
  </div>
</div>

            
            {/* Student Details */}
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-1">{studentName}</h2>
              <p className="text-sm text-blue-200 font-mono">{studentId}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300 font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Balance Section */}
          

          {/* Card Number */}
          <div className="relative z-10 mt-4">
            <p className="text-lg font-mono tracking-[0.2em] text-gray-300 text-center">
              {/* •••• •••• •••• 1234 */}
             {/* •••• 250 {phoneNumber.split("0")||  ""} */}
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex justify-between items-center mt-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Valid Thru</p>
              <p className="text-sm font-semibold text-white">12/27</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Type</p>
              <p className="text-sm font-semibold text-white">Virtual Card</p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-tr from-white/5 to-transparent"></div>
          
          {/* Subtle Lines */}
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;