import { Row, Col, Button, Form } from "react-bootstrap";
import Image from "next/image";
import md5 from 'md5';
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { useAuth } from '@/hooks/useAuth';
import useModals from "@/hooks/useModals";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Icon from "@/components/Icon";
import ModalWrapper from "@/components/wrappers/ModalWrapper";
import PopUp from "@/components/utils/PopUp";
import SpinnerButton from "@/components/utils/SpinnerButton";
import { getMemberInfo, updateMemberInfo,uploadFile } from "@/api/member";

export default function EditInfo() {
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();
  const [modalIcon,setModalIcon] = useState('success');
  const [modalTitle,setModalTitle] = useState('通知');
  const [modalDescribe,setModalDescribe] = useState('');
  const [confirmOnClick,setConfirmOnClick] = useState(() => () => {});

  const { t } = useTranslation();
  const {session, status} = useAuth();
  const [isLoading,setIsLoading] = useState(false);
  const [systemError,setSystemError] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthdate: '',
    mobile: '',
    contact_address: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if(systemError){
      router.push('/systemError');
      return;
    }

    if(status === "authenticated" && session.user.memberId){
      
      setIsLoading(true);
      getMemberInfo(session.user.memberId).then((res) => {
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          birthdate: res.data.birthdate || '',
          mobile: res.data.mobile || '',
          contact_address: res.data.contact_address || ''
        });
        setAvatarPreview(res.data.avatar ?? '/image/memberThumbnail.png');

        setIsLoading(false);

      }).catch((error) => {
        console.log('error: ', error);
        if(error?.response?.status === 500){
          setSystemError(true);
        }
        setIsLoading(false);

      }).finally(() => {
        setIsLoading(false);
      });

    }
    
  }, [status, session, router, systemError]);

  const handleUpload = (e) => {
    console.log('handleUpload');
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('formData: ', formData);

    try {
      setIsLoading(true);
      
      let avatarPath = null;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('img_file_name', avatarFile);
        formData.append('is_need_md5', '1');
        const uploadResult = await uploadFile(session.user.memberId, formData);
        // console.log('edit-inffo@uploadResult: ', uploadResult);
        if(!uploadResult.status){
          throw new Error(uploadResult.msg);
        }
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        // if(key==='mobile')return;
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append('user_id', session.user.userId);
      formDataToSend.append('account', session.user.account);
      
      if (avatarFile) {
        formDataToSend.append('file_name[]', md5(avatarFile.name.split('.')[0])+'.'+avatarFile.name.split('.')[1]);
        formDataToSend.append('file_org_name[]', avatarFile.name);
        formDataToSend.append('file_media_type[]', 'avatar');
        formDataToSend.append('file_size[]', avatarFile.size);
      }

      const res = await updateMemberInfo(session.user.memberId, formDataToSend);
      // console.log('edit-info@updateMemberInfo res: ', res);
      if(!res.status){
        throw new Error(res.msg);
      }

      setModalIcon('success');
      setModalTitle(t('update_success'));
      setModalDescribe(t('update_member_info_success'));
      handleShowModal('popup');

      setConfirmOnClick(() => () => {
        router.push('/member');
      });
    

      setIsLoading(false);
    } catch(error) {
      console.log('edit-info error: ', error);
      let title = t('update_fail');
      let code,msg;
      if(error.response){
        code = error.response.status;
        msg = error.response.message ?? t('update_member_info_fail');
      }else{
        code = 400;
        msg = error.message ?? t('update_member_info_fail');
      }

      if(code===500){
        title = t('system_error');
        msg = t('system_error_msg');
      }
      
      setModalIcon('error');
      setModalTitle(title);
      setModalDescribe(msg);
      handleShowModal('popup');

      setIsLoading(false);
    }
  }

  return (
    <DefaultLayout close goBack title="個人資料" className="p-4" previousPath={"/member"} isLoading={isLoading}>

      <Form className="" onSubmit={handleSubmit}>
        <Row className="gap-4">
          <Form.Group as={Col} md="4" controlId="user" className="d-flex flex-column align-items-center gap-4"> 
            <Image
              height={80}
              width={80}
              className="rounded-circle object-fit-cover"
              src={avatarPreview}
              alt="會員頭貼"
            />

            <div className="d-flex gap-1">
              <Form.Control
                type="file"
                name="avatar"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleUpload}
              />
              <Icon name="upload"></Icon>
              <Button 
                className="text-gray p-0 bg-transparent border-0" 
                onClick={() => fileInputRef.current.click()}
              >
                變更頭像
              </Button>
            </div>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="user">
            <Form.Label className="text-green">姓名</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="email">
            <Form.Label className="text-green">電子郵件</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="date-of-birth">
            <Form.Label className="text-green">生日</Form.Label>
            <Form.Control
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="phone">
            <Form.Label className="text-green">手機號碼 (登入帳號)</Form.Label>
            <Form.Control
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              disabled
            />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="address">
            <Form.Label className="text-green">地址</Form.Label>
            <Form.Control
              type="text"
              name="contact_address"
              value={formData.contact_address}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Row>

        <SpinnerButton className="btn-bottom" isLoading={false} type="submit">
          {t('save_changes')}
        </SpinnerButton>
      </Form>

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
            handleCloseModal("popup");
          }}
        />
      </ModalWrapper>

    </DefaultLayout>
  );
}