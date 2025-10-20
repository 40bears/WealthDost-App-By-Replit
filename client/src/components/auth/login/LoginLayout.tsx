import React from "react";

export const LoginLayout = ({ children }: { children: React.ReactElement | React.ReactElement[] }) => {

    const childrenArr = React.Children.toArray(children)
    return (<div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center relative z-10">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Welcome Back</h1>
                <p className="text-white/90 text-lg">Sign in with your mobile number</p>
                <div className="mt-6">
                    <p className="text-white/80 text-sm">
                        New here?{" "}
                        <a href="/signup" className="text-white font-semibold relative inline-block group">
                            <span className="relative z-10">Create Account</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </p>
                </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 rounded-2xl"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                <div className="relative z-10">
                    {childrenArr}

                    <div className="mt-8 text-center">
                        <p className="text-xs text-white/70">
                            By continuing, you agree to our{" "}
                            <a href="/terms" className="text-white/90 hover:text-white relative inline-block group transition-colors duration-300">
                                <span className="relative z-10">Terms of Service</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className="text-white/90 hover:text-white relative inline-block group transition-colors duration-300">
                                <span className="relative z-10">Privacy Policy</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-center mt-8">
                <a href="/" className="inline-flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-2 transition-all duration-300 transform hover:scale-105">
                    ← Back to Home
                </a>
            </div>
        </div>
    </div>
    )
}