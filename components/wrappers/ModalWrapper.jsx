
import { Modal } from 'react-bootstrap';

const ModalWrapper = (props) => {
  const { show, onHide, size=null,  headerTitle=null, footerTitle=null, children, isTranslated }=props
  
  return (
    <Modal 
      {...props}
      show={show} 
      onHide={onHide}
      // backdrop={props.disableBackdropClose ? 'static' : true}
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      className="scroll"
      centered
    >
      {/* 有headerTitle才顯示這塊 */}
      { headerTitle && (
        <Modal.Header closeButton>
          <Modal.Title>{headerTitle}</Modal.Title>
        </Modal.Header>
      )}

      {/* 關閉按鈕
      {!isTranslated&&<Close fill="#EA3C7D" className="position-absolute pointer" style={{ top:"0", right:"-50px" }} onClick={onHide} />} */}

      {/* Modal內容 */}
      <Modal.Body className="p-md-20 overflow-hidden p-10">
        {children}
      </Modal.Body>

      {/* 有footerTitle才顯示這塊 */}
      { footerTitle && (
        <Modal.Footer>
          {footerTitle}
        </Modal.Footer>
      )}
      
    </Modal>
  );
};

export default ModalWrapper;