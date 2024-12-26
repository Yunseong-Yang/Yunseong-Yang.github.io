import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Header.css";

interface HeaderProps {
    onLogout: () => void; // 로그아웃 콜백 함수
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    const [user, setUser] = useState<{ nickname: string } | null>(null);

    // localStorage에서 사용자 정보 가져오기
    useEffect(() => {
        const userData = localStorage.getItem("currentUser");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // 카카오 SDK 초기화
    useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY);
            console.log("카카오 SDK 초기화 완료");
        }
    }, []);

    // 회원 정보 조회 함수
    const handleProfileView = async () => {
        try {
            if (!window.Kakao || !window.Kakao.isInitialized()) {
                console.error("카카오 인증 객체가 초기화되지 않았습니다.");
                return;
            }

            const response = await window.Kakao.API.request({
                url: "/v2/user/me",
            });

            console.log("회원 정보:", response);
            console.log(
                `닉네임: ${response.properties?.nickname || "없음"}\n이메일: ${
                    response.kakao_account?.email || "없음"
                }`
            );
        } catch (error) {
            console.error("회원 정보 조회 실패:", error);
            alert("회원 정보를 조회할 수 없습니다.");
        }
    };

    const handleLogout = () => {
        // 카카오 세션 로그아웃 처리
        if (window.Kakao.Auth) {
            window.Kakao.Auth.logout(() => {
                console.log("카카오 로그아웃 완료");
            });
        }

        // 로컬 스토리지 데이터 제거
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("currentUser");

        // 카카오 세션 키 삭제
        Object.keys(localStorage)
            .filter((key) => key.startsWith("kakao_"))
            .forEach((key) => localStorage.removeItem(key));

        // 상태 초기화 및 페이지 리로드 또는 리다이렉트
        setUser(null); // 헤더에 표시된 사용자 정보 초기화
        alert("로그아웃 되었습니다.");
        window.location.href = "/signin"; // 로그인 페이지로 이동
    };

    return (
        <header className="header">
            <div className="header__left">
                <Link to="/" className="header__logo">
                    Netflix
                </Link>
            </div>
            <nav className="header__nav">
                <Link to="/" className="header__link">
                    홈
                </Link>
                <Link to="/popular" className="header__link">
                    인기
                </Link>
                <Link to="/search" className="header__link">
                    찾아보기
                </Link>
                <Link to="/wishlist" className="header__link">
                    찜 목록
                </Link>
            </nav>
            <div className="header__right">
                {user ? (
                    <>
                        <span className="header__user">안녕하세요, {user.nickname}님</span>
                        <button className="header__profile" onClick={handleProfileView}>
                            회원 정보
                        </button>
                        <button className="header__logout" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <Link to="/signin" className="header__link">
                        로그인
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
