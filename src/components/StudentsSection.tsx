
import React from 'react';
import { Users, Settings, Eye, MoreVertical, AlertCircle } from 'lucide-react';

const StudentsSection = ({ students, onViewTransactions, onSetLimits }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-green-100 rounded-xl">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Linked Students</h3>
            <p className="text-sm text-gray-500">{students.length} student{students.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {students.map((student) => {
          const spendingPercentage = Math.min((student.todaySpent / student.dailyLimit) * 100, 100);
          const isOverLimit = student.todaySpent > student.dailyLimit;
          
          return (
            <div key={student.id} className="p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={student.photo || '/api/placeholder/48/48'}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {isOverLimit && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{student.name}</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewTransactions(student)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSetLimits(student)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{student.studentId} • {student.grade}</span>
                    <span className={isOverLimit ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {formatCurrency(student.todaySpent)} / {formatCurrency(student.dailyLimit)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
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
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No students linked yet</p>
            <p className="text-sm text-gray-400">Add your first student to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsSection;
