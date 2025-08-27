import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import Icon from "@/components/Icon";
import SpinnerButton from "@/components/utils/SpinnerButton";
import { sendSMS } from "@/api/sms";

export default function Register({onSuccess,onError}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [countryCode, setCountryCode] = useState({country:'台灣',code:'+886'});
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const step = 'send-sms';

  const onSubmit = async (e) => {
    e.preventDefault();
    try{
      setIsLoading(true);
      const res = await sendSMS(countryCode.code,mobile);
      console.log('sendSMS rs:',res);
      setIsLoading(false);

      if(!res.status){
        throw new Error(res.msg);
      }
      
      onSuccess({
        code: 200,
        title: t('send_success'),
        msg: t('send_success_msg')+countryCode.code+mobile,
        data: {
          step: step,
          countryCode: countryCode.code,
          mobile: mobile,
          redirectUrl: `/register?step=phone-validation`
        }
      });
    } catch(err) {
      // console.log('Register error: ', err);
      setIsLoading(false);
      let code,msg;
      if(err.response){
        code = err.response.status;
        msg = err.response.msg ?? t('send_fail');
      }else{
        code = 400;
        msg = err.message ?? t('send_fail');
      }

      // 驗證失敗
      onError({code:code,title:t('send_fail'),msg:msg,data:{step:step,countryCode:countryCode.code,mobile:mobile}});

    }
  };
  return (
    <>
      <Row className="">
        <Col>
          <Form className="d-flex flex-column gap-4" onSubmit={onSubmit}>
            <div className="d-flex flex-column gap-2">
              <Form.Select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value={{country:'台灣',code:'+886'}}>台灣 +886</option>
                {/* <option value={{country:'美國',code:'+1'}}>美國 +1</option>
                <option value={{country:'日本',code:'+81'}}>日本 +81</option> */}
              </Form.Select>
              <Form.Control
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="請輸入手機號碼"
                type="tel"
                pattern="[\d\s]*"
                maxLength={17}
                minLength={7}
                required
                name="mobile"
              />
            </div>

            <SpinnerButton className="btn-secondary" isLoading={isLoading} type="submit" >
              {t('next_step')}
            </SpinnerButton>
          </Form>
        </Col>
      </Row>

      <Row className="mt-4 text-center">
          <Col>
              <Link href={'/login'}>{t('return_to_login')}</Link>
          </Col>
      </Row>

      <Row className="mt-4">
        <Col xs="1">
          <Icon name="redBell"></Icon>{" "}
        </Col>
        <Col className="ps-3 fs-small" style={{ color: "#8D8681" }}>
          註冊會員將視為同意輸入的資料將依照SIG使用者條款與隱私權政策進行使用
        </Col>
      </Row>

    </>
  );
}
