import React from "react";

interface CustomDayProps {
  className: string;
  value: any;
  children: any;
}

const CustomDay = ({ className, value, children, ...props }: CustomDayProps) => {
  return (
    <div {...props} className={`${className} custom-day`}>
      {children}
    </div>
  );
};

export default CustomDay;
