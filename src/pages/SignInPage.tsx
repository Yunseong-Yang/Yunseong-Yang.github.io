import React, { useState, useEffect, useCallback } from "react";
import { tryLogin, tryRegister } from "../utils/Authentication";
import { useNavigate } from "react-router-dom";
import "./SignInPage.css";

const SignInPage: React.FC = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [visibleFields, setVisibleFields] = useState<number>(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // 카카오 JavaScript 키
    const KAKAO_JS_KEY = process.env.REACT_APP_KAKAO_JS_KEY; // 실제 JavaScript Key로 변경
    //const REDIRECT_URI = "http://localhost:8080/redirect"; // 리다이렉트 URI
    // 초기화 및 인증 상태 확인
    const checkAuthentication = useCallback(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        if (isAuthenticated) {
            navigate("/"); // 사용자가 이미 인증되었으면 메인 페이지로 이동
        }
    }, [navigate]);

    useEffect(() => {
        if (KAKAO_JS_KEY) {
            if (typeof window.Kakao !== "undefined" && !window.Kakao.isInitialized()) {
                window.Kakao.init(KAKAO_JS_KEY);
                console.log("카카오 SDK 초기화 성공");
            } else {
                console.error("카카오 SDK 로드 실패 또는 이미 초기화됨");
            }
        } else {
            console.error("KAKAO_JS_KEY가 정의되지 않음");
        }
        checkAuthentication();
        showFieldsSequentially(3);
    }, [KAKAO_JS_KEY, checkAuthentication]);

    const handleTabChange = (signIn: boolean) => {
        if (isSignIn !== signIn) {
            setIsSignIn(signIn);
            setError(""); // 탭 전환 시 에러 메시지 초기화
            setVisibleFields(0);
            setTimeout(() => showFieldsSequentially(3), 200);
        }
    };

    const showFieldsSequentially = (count: number) => {
        for (let i = 1; i <= count; i++) {
            setTimeout(() => setVisibleFields(i), i * 200);
        }
    };

    const handleLogin = () => {
        tryLogin(
            email,
            password,
            () => {
                alert("로그인 성공!");
                window.location.href = "/"; // 메인 페이지로 이동
            },
            () => setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.")
        );
    };

    const handleRegister = () => {
        tryRegister(
            email,
            password,
            () => {
                alert("회원가입 성공! 이제 로그인하세요.");
                setPassword("");
                setIsSignIn(true); // 회원가입 후 로그인 탭으로 이동
            },
            (err: Error) => setError(err.message || "회원가입에 실패했습니다.")
        );
    };

    const kakaoLogin = () => {
        window.Kakao.Auth.login({
            scope: "profile_nickname",
            success: function (authObj: { access_token: string }) {
                console.log("카카오 로그인 성공:", authObj);

                window.Kakao.API.request({
                    url: "/v2/user/me",
                    success: function (res: any) { 
                        console.log("사용자 프로필:", res);

                        const nickname = res.properties?.nickname || "사용자";
                        const user = { nickname, email };

                        localStorage.setItem("isAuthenticated", "true");
                        localStorage.setItem("currentUser", JSON.stringify(user));
                        alert(`${nickname}님, 카카오 로그인 성공!`);
                        window.location.href = "/"; // 메인 페이지로 이동
                    },
                    fail: function (error: any) {
                        console.error("사용자 프로필 가져오기 실패:", error);
                        alert("사용자 정보를 가져오는 데 실패했습니다.");
                    },
                });
            },
            fail: function (err: any) {
                console.error("카카오 로그인 실패:", err);
                alert("카카오 로그인에 실패했습니다.");
            },
        });
    };

    return (
        <div className="centered-container">
            <div className="container">
                <div className="tabs">
                    <button
                        className={`tab ${isSignIn ? "active" : ""}`}
                        onClick={() => handleTabChange(true)}
                    >
                        Sign In
                    </button>
                    <button
                        className={`tab ${!isSignIn ? "active" : ""}`}
                        onClick={() => handleTabChange(false)}
                    >
                        Register
                    </button>
                </div>
                <div className="pages">
                    <div className="page">
                        {isSignIn ? (
                            <>
                                <div className={`input ${visibleFields >= 1 ? "visible" : ""}`}>
                                    <label>EMAIL</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className={`input ${visibleFields >= 2 ? "visible" : ""}`}>
                                    <label>PASSWORD</label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        className="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {error && <p className="error">{error}</p>}
                                <div className={`input ${visibleFields >= 3 ? "visible" : ""}`}>
                                    <button className="submit" onClick={handleLogin}>
                                        SIGN IN
                                    </button>
                                </div>
                                <div className={`input ${visibleFields >= 3 ? "visible" : ""}`}>
                                    <button className="kakao-login" onClick={kakaoLogin}>
                                        카카오 로그인
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`input ${visibleFields >= 1 ? "visible" : ""}`}>
                                    <label>EMAIL</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className={`input ${visibleFields >= 2 ? "visible" : ""}`}>
                                    <label>PASSWORD</label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        className="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {error && <p className="error">{error}</p>}
                                <div className={`input ${visibleFields >= 3 ? "visible" : ""}`}>
                                    <button className="submit" onClick={handleRegister}>
                                        SIGN UP
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
