import React from 'react';
import { Users, Activity, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Student {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  class: string;
  photo: string;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
  todaySpent: number;
  allowedDays: string[];
  allowedHours: { from: string; to: string };
}

interface LinkedStudentsProps {
  students: Student[];
  onViewTransactions: (student: Student) => void;
  onSetLimits: (student: Student) => void;
}

const LinkedStudents: React.FC<LinkedStudentsProps> = ({ students, onViewTransactions, onSetLimits }) => {
  const { t } = useLanguage();

  const formatCurrency = (amount: number | undefined): string => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount ?? 0);
  };

  const formatLimitDisplay = (spent: number | undefined, limit: number | undefined): string => {
    const spentFormatted = formatCurrency(spent);
    const limitFormatted = formatCurrency(limit);
    return `${spentFormatted} / ${limitFormatted}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-white-950 dark:text-white text-2xl font-semibold">{t('linkedStudents')}</h2>
        </div>
        <button
          onClick={() => onSetLimits({} as Student)} // Trigger link student modal in parent
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-200 font-medium"
        >
          <Users className="w-5 h-5" />
          <span>{t('linkStudent')}</span>
        </button>
      </div>

      {students.length === 0 ? (
        <div className="bg-white dark:bg-white-950 border border-brand dark:border-green-700 rounded-xl p-8 text-center">
         
          <div className="flex flex-col items-center justify-center text-center text-sm text-emerald-600 dark:text-emerald-200">
            <div className="w-82 h-82 mx-auto mb-2">
              <img
                src="/assets/kids wearing masks at school-bro.svg"
                alt={t('noStudentsLinked')}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
            <p className="text-lg font-medium mb-1">{t('noStudentsLinked')}</p>
            {/* <p className="text-gray-400 dark:text-gray-500 text-sm">{t('linkStudentPrompt')}</p> */}
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">{t('linkStudentPrompt')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white dark:bg-white-950 border border-brand dark:border-green-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-300 dark:border-green-600"
                />
                <div>
                  <h3 className="text-white-950 dark:text-white font-semibold text-lg">{student.name}</h3>
                  <p className="text-green-500 dark:text-green-400 text-sm">{student.studentId}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{t('grade')}</span>
                  <span className="text-white-950 dark:text-white font-medium">
                    {student.grade || t('notSpecified')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{t('class')}</span>
                  <span className="text-white-950 dark:text-white font-medium">
                    {student.class || t('notSpecified')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{t('todaySpent')}</span>
                  <span className="text-white-950 dark:text-white font-medium">
                    {formatLimitDisplay(student.todaySpent, student.dailyLimit)}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => onViewTransactions(student)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 py-3 rounded-xl hover:bg-green-100 dark:hover:bg-green-800/30 transition-all duration-200 font-medium"
                >
                  <Activity className="w-5 h-5" />
                  <span>{t('transactions')}</span>
                </button>
                <button
                  onClick={() => onSetLimits(student)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-all duration-200 font-medium"
                >
                  <Settings className="w-5 h-5" />
                  <span>{t('setLimits')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkedStudents;