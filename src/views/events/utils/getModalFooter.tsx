import { Button, ModalProps } from "antd";
import { FaTrash } from "react-icons/fa";
interface IForm {
  form: any;
  Modal: ModalProps;
  createEvent: (values: any) => void;
  updateEvent: (values: any) => void;
  deleteEvent: (values: any) => void;
}
export default ({ form, Modal, createEvent, updateEvent, deleteEvent }: IForm) => {
  const isEditing = form.getFieldValue("_id");

  return isEditing
    ? [
        <Button
          key="delete"
          danger
          onClick={() => {
            deleteEvent({ url: `/event/${form.getFieldValue("_id")}` });
            Modal.close();
          }}
        >
          <FaTrash />
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            updateEvent({
              url: `/event/${form.getFieldValue("_id")}`,
              formData: form.getFieldsValue(),
            });
            setModalVisible(false);
          }}
        >
          Update
        </Button>,
      ]
    : [
        <Button key="cancel" onClick={() => setModalVisible(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            createEvent(form.getFieldsValue());
            setModalVisible(false);
          }}
        >
          Create
        </Button>,
      ];
};
