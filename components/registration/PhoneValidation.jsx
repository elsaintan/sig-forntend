import { Button, Row, Col, Form } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { sendSMS,checkSMSCode } from "@/api/sms";
import { useTranslation } from "react-i18next";
import SpinnerButton from "@/components/utils/SpinnerButton";

export default function PhoneValidation({countryCode,mobile,onSuccess,onError}) {
    const router=useRouter()
    const [smsCode,setSmsCode] = useState('');
    const { t } = useTranslation();
    const [isResendLoading,setIsResendLoading] = useState(false);
    const [countdown,setCountdown] = useState(0);
    const [isLoading,setIsLoading] = useState(false);
    const countDownTimer = 60;

    const step = 'phone-validation';

    if(!mobile){
        router.push('/register');
    }

    const onSubmit = async(e)=>{
        e.preventDefault();

        try{
            setIsLoading(true);
            const res = await checkSMSCode(countryCode.code+mobile,smsCode);
            // console.log('res: ', res);
            setIsLoading(false);
            if(!res.status)throw new Error(res.msg);
            // console.log('123');
            // 驗證成功
            onSuccess({code:200,title:t('check_success'),msg:t('check_success_msg'),data:{step:step}});

        }catch(err){
            console.log('onSubmit error: ', err);
            setIsLoading(false);

            let code,msg;
            if(err.response){
                code = err.response.status;
                msg = err.response.msg ?? t('check_fail');
            }else{
                code = 400;
                msg = err.message ?? t('check_fail');
            }

            if(code===500)msg = t('system_error_msg');

            onError({code:code,title:t('check_fail'),msg:msg,data:{step:step,mobile:mobile,code:smsCode}});
        }
    }

    const onResend = async () => {
        console.log('onResend');

        try {
            setIsResendLoading(true);
            const res = await sendSMS(countryCode.code+mobile);
            if(!res.status)throw new Error(res.msg);

            // 重發成功
            onSuccess({code:200,title:t('resend_success'),msg:t('resend_success_msg')+countryCode.code+mobile,data:{step:'resend-sms',countryCode:countryCode.code,mobile:mobile,code:res.data.code??''}});
            setIsResendLoading(false);
            setCountdown(countDownTimer);
            const interval = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        } catch(err) {
            console.log('onResend error: ', err);

            let code,msg;
            if(err.response){
                code = err.response.status;
                msg = err.response.msg ?? t('resend_fail');
            }else{
                code = 400;
                msg = err.message ?? t('resend_fail');
            }

            // 重發失敗
            onError({code:code,title:t('resend_fail'),msg:msg,data:{step:'resend-sms',mobile:mobile}});
            setIsResendLoading(false);
        }
    }
  return (
    <>
        <Form className="d-flex flex-column gap-4" onSubmit={onSubmit} >
            <Form.Control type="tel" placeholder="請輸入驗證碼" required value={smsCode} onChange={(e)=>setSmsCode(e.target.value)} />

            <Row>
                <Col className="d-flex justify-content-center gap-1">
                    <div className="fs-small">
                        沒收到？
                    </div>
                    {isResendLoading ? <div className="fs-small">重新發送中...</div> : 
                        countdown > 0 ? (
                            <span className="fs-small">{countdown}秒後可重新發送</span>
                        ) : (
                            <Link href="#" onClick={onResend} className="fs-small">立即重發驗證碼</Link>
                        )
                    }
                </Col>
            </Row>

            <SpinnerButton className="btn-secondary" isLoading={isLoading} type="submit">
              {t('next_step')}
            </SpinnerButton>
        </Form>

        <Row className="mt-4 text-center">
            <Col>
                <Link href={'/register'}>{t('return_previous_step')}</Link>
            </Col>
        </Row>
    </>
  )
}
