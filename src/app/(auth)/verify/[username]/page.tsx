'use client';

import { useState, useEffect, useRef } from 'react';
import { BarChart3, ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function VerifyCodePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    const username = searchParams.get('username') || params.username || '';

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);



    const handleChange = (index, value) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Clear any existing form errors when user starts typing
        if (formErrors) {
            setFormErrors('');
        }

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');

        // Only show error if user actually tried to submit with incomplete code
        if (code.length !== 6) {
            setFormErrors('Please enter the complete 6-digit code.');
            return;
        }

        setIsSubmitting(true);
        setFormErrors('');

        try {
            const response = await fetch('/api/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, code }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Account verified successfully!');
                signIn(undefined, { callbackUrl: "/ask" });
            } else {
                throw new Error(data.message || 'Verification failed');
            }
        } catch (error) {
            setFormErrors(error.message);
            setOtp(new Array(6).fill(''));
            inputRefs.current[0]?.focus();
        } finally {
            setIsSubmitting(false);
        }
    };

    const isCodeComplete = otp.join('').length === 6;

    return (
        <div className="min-h-screen bg-gray-950 flex justify-center items-center p-6">
            <div className="max-w-4xl w-full bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-8">
                <div className="mb-6 flex justify-between items-center">
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-orange-500 flex items-center">
                        <ArrowLeft size={16} className="mr-2" /> Back
                    </button>
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <BarChart3 size={20} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white ml-3">
                            <span className="text-orange-500">True</span>Feedback
                        </h2>
                    </div>
                </div>

                <h1 className="text-white text-3xl font-semibold mb-4">Verify Your Email</h1>
                <p className="text-gray-400 mb-6">Enter the 6-digit code sent to your email address.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-3">
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={value}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="w-12 h-12 text-center text-xl font-bold bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        ))}
                    </div>

                    {formErrors && <p className="text-red-500 text-center text-sm">{formErrors}</p>}

                    <button
                        type="submit"
                        disabled={!isCodeComplete || isSubmitting}
                        className={`w-full h-12 rounded-lg font-semibold text-lg transition-all duration-200 ${
                            !isCodeComplete || isSubmitting
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Verifying...
                            </span>
                        ) : (
                            'Verify Account'
                        )}
                    </button>
                </form>

                <div className="mt-4 text-sm text-gray-500 text-center">
                    Having trouble? Check your spam folder or{' '}
                    <button className="text-orange-500 hover:text-orange-400">contact support</button>
                </div>
            </div>
        </div>
    );
}