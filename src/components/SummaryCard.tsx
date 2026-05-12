import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = "#fbbf24" 
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#18181b] border border-[#27272a] p-4 rounded-lg relative overflow-hidden"
    >
      <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</div>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
        {trend && (
          <span className={`text-[11px] font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-[#fbbf24]'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="text-zinc-600 text-[10px] font-medium uppercase">{subtitle}</div>
      
      <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: trend?.isPositive ? '65%' : '40%' }}
          className="h-full rounded-full transition-all duration-500"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
};
