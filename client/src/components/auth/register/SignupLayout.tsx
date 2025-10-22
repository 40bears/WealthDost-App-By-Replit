import React from "react";
import { Link } from "wouter";

export function SignupLayout({ children }: { children: React.ReactElement | React.ReactElement[] }) {

    const childrenArr = React.Children.toArray(children)

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4 relative overflow-hidden">

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center relative z-10">
                {/* Header */}
                <div className="flex justify-center mb-12">
                    <div className="header p-2 inline-block w-3/4 h-32 flex flex-col-reverse">
                        <img src="/logo.png" alt="WealthDost Logo" className="h-16 mx-auto mb-2" />
                    </div>
                </div>

                <div className="mt-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                    {/* Glass shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 rounded-2xl"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                    <div className="relative z-10">
                        {childrenArr}
                        
                    </div>
                </div>

                {/* Links */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-white/70">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" className="text-white/90 hover:text-white relative inline-block group transition-colors duration-300">
                            <span className="relative z-10">Terms of Service</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-white/90 hover:text-white relative inline-block group transition-colors duration-300">
                            <span className="relative z-10">Privacy Policy</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}