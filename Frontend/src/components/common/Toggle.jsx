import { useId } from 'react';

function Toggle({ 
  checked, 
  onChange, 
  label, 
  disabled = false, 
  id: propId, 
  labelPosition = 'right',
  size = 'md'
}) {
  const generatedId = useId();
  const id = propId || `toggle-${generatedId}`;
  
  const sizeClasses = {
    sm: {
      container: "w-9 h-5",
      circle: "h-4 w-4",
      translate: "translate-x-4",
    },
    md: {
      container: "w-11 h-6",
      circle: "h-5 w-5",
      translate: "translate-x-5",
    },
    lg: {
      container: "w-14 h-7",
      circle: "h-6 w-6",
      translate: "translate-x-7",
    }
  };
  
  return (
    <label 
      htmlFor={id} 
      className={`inline-flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {labelPosition === 'left' && label && (
        <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <div 
          className={`
            ${sizeClasses[size].container} 
            bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 
            dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 
            peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
            after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
            ${sizeClasses[size].circle} after:transition-all dark:border-gray-600 peer-checked:bg-primary-600
          `}
        ></div>
      </div>
      
      {labelPosition === 'right' && label && (
        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
}

export default Toggle;
