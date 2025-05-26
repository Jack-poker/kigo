
import React from 'react';
import { Users, Settings, Eye, QrCode, AlertCircle } from 'lucide-react';

const StudentsSection = ({ students, onViewTransactions, onSetLimits, onShowQR }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm">Linked Students</h3>
            <p className="text-xs text-gray-500">{students.length} student{students.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {students.map((student) => {
          const spendingPercentage = Math.min((student.todaySpent / student.dailyLimit) * 100, 100);
          const isOverLimit = student.todaySpent > student.dailyLimit;
          
          return (
            <div key={student.id} className="p-3 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={student.photo || '/api/placeholder/40/40'}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {isOverLimit && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 truncate text-sm">{student.name}</h4>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onShowQR(student)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                        title="Show Payment QR"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onViewTransactions(student)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                        title="View Transactions"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSetLimits(student)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        title="Set Limits"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{student.studentId} • {student.grade}</span>
                    <span className={isOverLimit ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {formatCurrency(student.todaySpent)} / {formatCurrency(student.dailyLimit)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isOverLimit ? 'bg-red-500' : spendingPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                    ></div>
                  </div>
                  
                  {isOverLimit && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      Daily limit exceeded
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {students.length === 0 && (
          <div className="text-center py-6">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No students linked yet</p>
            <p className="text-xs text-gray-400">Add your first student to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsSection;
