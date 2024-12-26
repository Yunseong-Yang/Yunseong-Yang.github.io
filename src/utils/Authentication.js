const tryLogin = (email, password, success, fail) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((user) => user.id === email && user.password === password);

    if (user) {
        localStorage.setItem("isAuthenticated", "true"); // 로그인 상태 저장
        localStorage.setItem("currentUser", email); // 현재 사용자 저장
        localStorage.setItem("apiKey", password); // 비밀번호를 API 키로 저장
        success();
    } else {
        fail();
    }
};

const tryRegister = (email, password, success, fail) => {
    try {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.some((existingUser) => existingUser.id === email);

        if (userExists) {
            throw new Error("이미 존재하는 사용자입니다.");
        }

        const newUser = { id: email, password: password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        success();
    } catch (err) {
        fail(err);
    }
};

const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true";
};

const logout = () => {
    localStorage.removeItem("isAuthenticated"); // 로그인 상태 제거
    localStorage.removeItem("currentUser"); // 현재 사용자 제거
    localStorage.removeItem("apiKey"); // API 키 제거
};

const getKakaoAuthURL = () => {
    const REST_API_KEY = "9e057164ac20489a8fa57bc3e527e3a0";
    const REDIRECT_URI = "http://localhost:3000/redirect";
    return `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
};

const handleKakaoRedirect = async (code, success, fail) => {
    const REST_API_KEY = "9e057164ac20489a8fa57bc3e527e3a0";
    const REDIRECT_URI = "http://localhost:3000/redirect";
    const url = `https://kauth.kakao.com/oauth/token`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
        });

        if (!response.ok) {
            throw new Error("카카오 로그인에 실패했습니다.");
        }

        const data = await response.json();
        const accessToken = data.access_token;

        // 로그인 상태 저장
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("kakaoAccessToken", accessToken);
        success();
    } catch (err) {
        fail(err);
    }
};

export { tryLogin, tryRegister, isAuthenticated, logout, getKakaoAuthURL, handleKakaoRedirect };