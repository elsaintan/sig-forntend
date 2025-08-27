import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import LoginWrapper from "@/components/wrappers/LoginWrapper";
//以CMP來跟 Register function 做區別
import RegisterCMP from "@/components/registration/Register";
import PhoneValidation from "@/components/registration/PhoneValidation";
import RegistrationCompleted from "@/components/registration/RegistrationCompleted";
import SettingPassword from "@/components/registration/SettingPassword";

import useModals from "@/hooks/useModals";
import ModalWrapper from "@/components/wrappers/ModalWrapper";
import PopUp from "@/components/utils/PopUp";

import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";

export default function Register() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { step,sale_point_id } = router.query;
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();
  const [modalIcon,setModalIcon] = useState('success');
  const [modalTitle,setModalTitle] = useState('通知');
  const [modalDescribe,setModalDescribe] = useState('');
  const [confirmOnClick,setConfirmOnClick] = useState(() => () => {});
  const [countryCode,setCountryCode] = useState({country:'台灣',code:'+886'});
  const [mobile,setMobile] = useState('');
  const { t } = useTranslation();
  const [spCode, setSpCode] = useState('SP00');
  
  const [currentStep, setCurrentStep] = useState({
    title: "註冊會員",
    helperText: "",
  });

  useEffect(() => {
    if(status === "authenticated"){
      router.push("/member");
    }
  }, [status]); 

  useEffect(() => {
    if (router.isReady) {
      setSpCode(router.query.code || 'SP00');
    }
  }, [router.isReady]);

  const handleSuccess = (res) => {
    console.log('Register handleSuccess res: ', res);

    setModalTitle(res.title);
    setModalDescribe(res.msg);

    switch(res.data.step){
      case 'send-sms':
        setMobile(res.data.mobile);
        setConfirmOnClick(() => () => {
          // console.log('close')
          router.push("/register?step=phone-validation");
        });
        break;

      case 'resend-sms':
        setMobile(res.data.mobile);
        setConfirmOnClick(() => () => {
          router.push("/register?step=phone-validation");
        });
        break;

      case 'phone-validation':
        setModalTitle(t('check_success'));
        setModalDescribe(t('check_success_msg'));
        setConfirmOnClick(() => () => {
          router.push("/register?step=setting-password");
        });
        break;

      case 'setting-password':
        router.push("/register?step=completed");
        
        return;
        break;
    }


    setModalIcon('success');
    handleShowModal("popup");
    
  };

  const handleError = (res) => {
    console.log('Register handleError res: ', res);
    
    setModalIcon('error');
    handleShowModal("popup");

    if(res.code === 500){
      setModalTitle(t('system_error')); //系統異常
      setModalDescribe(t('system_error_msg'));
      return;
    }
  
    setModalTitle(res.title);
    setModalDescribe(res.msg);
   
  };

  useEffect(() => {
    switch (step) {
      case "phone-validation":
        setCurrentStep({
          title: t('check_phone'), //驗證手機號碼
          helperText: t('check_phone_msg')+countryCode.code+mobile, //已發送驗證碼至 ${mobile}
        });
        break;
      case "setting-password":
        setCurrentStep({
          title: "設定密碼",
          helperText: "請設定您的密碼",
        });
        break;
      case "completed":
        setCurrentStep({
          title: t('completed'), //完成
          helperText:
            t('completed_msg'), //感謝您的註冊，請重新登入！
        });
        break;
      default:
        setCurrentStep({ title: "註冊會員", helperText: "" });
    }
  }, [step]);

  const renderStepContent = () => {
    switch (step) {
      case "phone-validation":
        return <PhoneValidation countryCode={countryCode} mobile={mobile} onSuccess={handleSuccess} onError={handleError} />;
      case "setting-password":
        return <SettingPassword countryCode={countryCode} mobile={mobile} spCode={spCode} onSuccess={handleSuccess} onError={handleError} />;
      case "completed":
        return <RegistrationCompleted onSuccess={handleSuccess} onError={handleError} />;
      default:
        return <RegisterCMP onSuccess={handleSuccess} onError={handleError} />;
    }
  };

  return (
    <LoginWrapper title={currentStep.title} helperText={currentStep.helperText}>
      {renderStepContent()}

      <ModalWrapper
        key="popup"
        show={isModalOpen("popup")}
        size="lg"
        onHide={() => handleCloseModal("popup")}
      >
        <PopUp
          imageSrc={modalIcon}
          title={modalTitle}
          describe={modalDescribe}
          confirmOnClick={() => {
            confirmOnClick();
            if(step !== 'completed'){
              handleCloseModal("popup");
            }
          }}
        />
      </ModalWrapper>
      
    </LoginWrapper>
  );
}