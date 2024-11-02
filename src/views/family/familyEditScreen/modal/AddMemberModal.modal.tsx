import MemberType from "@/types/MemberType";
import { Form, Input, Modal, Select } from "antd";
import React from "react";
import styles from "./AddMemberModal.module.scss";
import UserItem from "@/components/userItem/UserItem.component";

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  ministryId: string;
  members: MemberType[];
  loading?: boolean;
}
/**
 * @description - AddMemberModal component, renders a modal that allows a user to add a member to a family
 * @returns {JSX.Element} - AddMemberModal
 */
const AddMemberModal = (props: AddMemberModalProps) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} onFinish={() => {}}>
      <Modal
        className={styles.container}
        open={props.open}
        closeIcon={true}
        onCancel={() => {
          form.resetFields();
          // close the modal
          props.onClose();
        }}
        // make the modal large
        width="50%"
        onOk={() => {
          // submit the form
          form.submit();
          // close the modal
          props.onClose();
        }}
      >
        <Form.Item
          label="Search"
          // for the form the name is members, which is an array of object id's
          name="members"
        >
          <Select
            placeholder="Search for a member"
            allowClear
            showSearch
            onSearch={(value) => {
              if (!value || value === "") return;
            }}
            options={props.members?.map((member) => {
              // return the MemberItem as an option
              return {
                value: member._id,
                label: `${member.firstName} ${member.lastName}`,
              };
            })}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) && option?.value !== undefined
            }
          />
        </Form.Item>
      </Modal>
    </Form>
  );
};

export default AddMemberModal;
