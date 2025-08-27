import { Button, Row, Col, Form } from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { register } from "@/api/member";
import SpinnerButton from "@/components/utils/SpinnerButton";


export default function SettingPassword({countryCode, mobile, spCode, onSuccess, onError}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading,setIsLoading] = useState(false);
  const step = 'setting-password';
  const [email, setEmail] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!mobile){
    router.push('/register');
  }

  const onSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!emailRegex.test(email)) {
      onError({
        code: 400,
        title: t('invalid_email'),
        msg: t('invalid_email_format'),
        data: { step: step, customMsg: true }
      });
      setIsLoading(false);
      return;
    }

    if(password !== confirmPassword) {
      onError({
        code: 400,
        title: t('setting_password_fail'),
        msg: t('setting_password_confirm_fail_msg'),
        data: { step: step, customMsg: true }
      });
      setIsLoading(false);
      return;
    }

    try {
      const name = mobile;
      const params = {
        mobile,
        password,
        name,
        email,
        is_enable: 0,
        sp_code: spCode,
      };

      const res = await register(params);
      if(!res.status) throw new Error(res.msg);
      onSuccess({
        code: 200,
        title: t('register_success'),
        msg: t('register_success_msg'),
        data: { step: step }
      });
      setIsLoading(false);
    } catch(err) {
      let code, msg;
      if(err.response) {
        code = err.response.status;
        msg = err.response.msg ?? t('register_fail_msg');
      } else {
        code = 400;
        msg = err.message ?? t('register_fail_msg');
      }
      
      onError({
        code: code,
        title: t('register_fail'),
        msg: msg,
        data: { step: step }
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form className="d-flex flex-column gap-4" onSubmit={onSubmit}>
        <div className="d-flex flex-column gap-2">
          <Form.Control 
            placeholder={t('email_placeholder')}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Form.Control placeholder={t('setting_password_placeholder')} type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}/>

          <Form.Control placeholder={t('setting_password_confirm_placeholder')} type="password" required value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
        </div>

        <SpinnerButton type="submit" className="btn-secondary w-100" isLoading={isLoading}>
          {t('next_step')}
        </SpinnerButton>
        
      </Form>

      <Row className="mt-4 text-center">
        <Col>
          {/* 返回上一步 */}
          <Link href={"/register?step=phone-validation"}>{t('return_previous_step')}</Link>
        </Col>
      </Row>
    </>
  );
}
