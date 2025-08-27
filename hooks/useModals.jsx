import { useState } from 'react';

function useModals() {
  const [modals, setModals] = useState({});

  const handleShowModal = (id) => {
    setModals((prevModals) => ({ ...prevModals, [id]: true }));
  };

  const handleCloseModal = (id) => {
    setModals((prevModals) => ({ ...prevModals, [id]: false }));
  };

  const isModalOpen = (id) => modals[id];

  return { handleShowModal, handleCloseModal, isModalOpen };
}

export default useModals;