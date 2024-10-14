import React from 'react'

interface InputFieldProps {
  label: string
  type: string
  name: string
  id: string
  required?: boolean
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  id,
  required = false,
  placeholder = '',
  value,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300 ease-in-out"
          type={type}
          name={name}
          id={id}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {type === 'password' && (
          <span className="absolute right-3 top-3 text-gray-400">
            {/* You can add an icon here, e.g., eye icon for password visibility toggle */}
          </span>
        )}
      </div>
      {required && (
        <p className="mt-1 text-xs text-gray-500">This field is required</p>
      )}
    </div>
  )
}

export default InputField