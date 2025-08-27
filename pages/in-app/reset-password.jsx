import { Form, Row, Col, FormGroup, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import axios from 'axios';

import DefaultLayout from "@/components/layout/DefaultLayout";
import Icon from "@/components/Icon";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (router.query.token && router.query.email) {
            setToken(router.query.token);
            setEmail(router.query.email);
        }
    }, [router.query]);

    const handleValidatePassword = async (event) => {
        event.preventDefault();

        if (password.trim() === '' || confirmPassword.trim() === '') {
            setError('請輸入密碼')
            return false
        }

        if (password.length < 8) {
            setError("密碼長度至少需要8個字元");
            return;
        }

        if (password !== confirmPassword) {
            setError("兩次輸入的密碼不相符，請重新輸入。");
            return;
        }

        try {
            const response = await axios({
                method: 'POST',
                url: `${process.env.NEXT_PUBLIC_BACKENDURL}/api/password-reset`,
                data: {
                    email,
                    password,
                    password_confirmation: confirmPassword,
                    token,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (response.data.status === 'success') {
                setError("");
                setIsEmailSent(true);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            
            const errorTranslations = {
                'passwords.token': '密碼重設連結已失效，請重新申請',
                'passwords.user': '找不到使用該電子郵件的用戶',
                'passwords.password': '密碼必須至少為8個字符',
            };
            setError(errorTranslations[errorMessage] || '重設密碼時發生錯誤，請稍後再試');
        }
    };

    return (
        <DefaultLayout title="重設密碼" close>
            {isEmailSent ? (
                <>
                    <Row className="text-center pt-15 px-2">
                        <Col className="d-flex flex-column gap-4 align-items-center">
                            <Icon name="success"></Icon>
                            <h2 className="text-success">密碼變更成功</h2>
                            <p>請返回登入頁面，並使用新密碼登入</p>
                        </Col>

                        <Link
                            href={"/login"}
                            className="btn btn-bottom text-white btn-primary"
                        >
                            返回登入
                        </Link>
                    </Row>
                </>
            ) : (
                <>
                    <Form className="px-2 pt-4">
                        <Row className="flex-column gap-4">
                            <FormGroup as={Col}>
                                <Form.Label className="text-green">輸入新密碼</Form.Label>
                                <Form.Control
                                    value={password}
                                    type="password"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />
                            </FormGroup>
                            <FormGroup as={Col}>
                                <Form.Label className="text-green">再次輸入新密碼</Form.Label>
                                <Form.Control
                                    value={confirmPassword}
                                    type="password"
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                />
                            </FormGroup>
                        </Row>

                        {/* 顯示錯誤訊息 */}
                        {error && <p className="text-danger">{error}</p>}

                        <Button
                            className="btn-bottom"
                            onClick={(e) => handleValidatePassword(e)}
                        >
                            立即重設密碼
                        </Button>
                    </Form>
                </>
            )}
        </DefaultLayout>
    );
}
