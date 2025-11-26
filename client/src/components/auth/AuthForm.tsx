import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Building, UserCheck, Landmark } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';
import { motion } from 'framer-motion';

interface AuthFormProps {
  type: 'login' | 'register';
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData extends LoginFormData {
  name: string;
  role: UserRole;
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const { login, register: registerUser, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | RegisterFormData>();
  
  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    if (type === 'login') {
      await login(data.email, data.password);
      navigate('/');
    } else {
      const registerData = data as RegisterFormData;
      await registerUser(registerData.name, registerData.email, registerData.password, selectedRole);
      navigate('/');
    }
  };
  
  const roleOptions: { id: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
    { 
      id: 'citizen', 
      label: 'Citizen', 
      icon: <UserCheck size={20} />,
      description: 'Report issues, vote, and track progress'
    },
    { 
      id: 'ngo', 
      label: 'NGO/RWA', 
      icon: <Building size={20} />,
      description: 'Represent community interests, coordinate efforts'
    },
    { 
      id: 'authority', 
      label: 'Authority', 
      icon: <Landmark size={20} />,
      description: 'Manage reported issues, provide updates'
    },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {type === 'register' && (
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            leftIcon={<User size={18} />}
            error={errors.name?.message}
            fullWidth
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />
        )}
        
        <Input
          label="Email Address"
          placeholder="Enter your email"
          type="email"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          fullWidth
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        
        <Input
          label="Password"
          placeholder={type === 'login' ? 'Enter your password' : 'Create a password'}
          type="password"
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          fullWidth
          {...register('password', {
            required: 'Password is required',
            minLength: type === 'register'
              ? {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                }
              : undefined,
          })}
        />
        
        {type === 'register' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select your role</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {roleOptions.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                    selectedRole === role.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className={`p-2 rounded-full mb-2 ${
                    selectedRole === role.id
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {role.icon}
                  </div>
                  <span className="font-medium">{role.label}</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">
                    {role.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-error-600 text-sm bg-error-50 p-2 rounded">
            {error}
          </div>
        )}
        
        <Button
          type="submit"
          variant="default"
          size="lg"
          isLoading={isLoading}
          fullWidth
          className="mt-6"
        >
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </motion.div>
  );
};

export default AuthForm;