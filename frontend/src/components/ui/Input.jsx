import { useState } from 'react';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';

const Input = ({
    label,
    type = 'text',
    error,
    helper,
    icon: Icon,
    className = '',
    id,
    required,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const isPassword = type === 'password';

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-semibold text-white/90 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" aria-hidden="true">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    id={inputId}
                    type={isPassword && showPassword ? 'text' : type}
                    className={`
            input-field
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}
          `}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
                    required={required}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && (
                <p id={`${inputId}-error`} className="text-sm text-red-500 flex items-center gap-1" role="alert">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    {error}
                </p>
            )}
            {helper && !error && (
                <p id={`${inputId}-helper`} className="text-sm text-surface-400">{helper}</p>
            )}
        </div>
    );
};

export default Input;
