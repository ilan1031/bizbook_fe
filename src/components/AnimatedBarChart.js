import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnimatedBarChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const animationRef = useRef(null);
  
  // Animation effect - grow from bottom with smoother animation
  useEffect(() => {
    if (data && data.length > 0) {
      // Start with zero heights
      const initialData = data.map(item => ({
        ...item,
        animatedValue: 0
      }));
      
      setChartData(initialData);
      
      // Using requestAnimationFrame for smoother animation
      let startTime = null;
      const duration = 500; // Animation duration in ms
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for smoother animation
        const easedProgress = easeOutCubic(progress);
        
        setChartData(data.map(item => ({
          ...item,
          animatedValue: item.value * easedProgress
        })));
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      // Start animation after a short delay
      const timer = setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, 300);
      
      return () => {
        clearTimeout(timer);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [data]);
  
  // Easing function for smoother motion
  const easeOutCubic = (x) => {
    return 1 - Math.pow(1 - x, 3);
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#757575' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#757575' }}
          tickFormatter={(value) => `${value / 1000} K`}
        />
        <Tooltip
          formatter={(value) => [`₹${value.toFixed(2)}`, 'Income']}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar 
          dataKey="animatedValue" 
          fill="#2196f3" 
          radius={[4, 4, 0, 0]}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AnimatedBarChart;