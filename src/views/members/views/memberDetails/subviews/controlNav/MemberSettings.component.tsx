"use client";
import React from "react";
import styles from "./ControlNav.module.scss";
import formStyles from "@/styles/Form.module.scss";
import useApiHook from "@/state/useApi";
import { Button, Form, Modal, Radio, Select } from "antd";
import { useParams } from "next/navigation";

const MemberSettings = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const { data: memberInformation } = useApiHook({
    url: `/ministry/member/${id}`,
    key: ["memberInformation", id as any],
    enabled: !!id,
    method: "GET",
  }) as any;
  const { mutate: updateMember } = useApiHook({
    successMessage: "Member updated successfully",
    queriesToInvalidate: [`memberInformation,${id}`],
    key: "updateMember",
    method: "PUT",
  }) as any;
  const { mutate: removeMember } = useApiHook({
    successMessage: "Member removed successfully",
    queriesToInvalidate: [`memberInformation,${id}`],
    key: "removeMember",
    method: "DELETE",
  }) as any;

  const onRemoveHandler = () => {
    Modal.confirm({
      title: "Are you sure you want to remove this member?",
      content:
        "This action cannot be undone. This member will be removed from the church and all their data will be deleted. including attendance records, and they'll be removed from any ministry that they've participated in.",
      onOk: () => {
        removeMember({ url: `/ministry/member/${id}` });
      },
    });
  };
  return (
    <div className={styles.container}>
      <Form
        form={form}
        onFinish={(values) => updateMember({ url: `/ministry/member/${id}`, formData: { member: { ...values } } })}
        initialValues={memberInformation?.payload}
        className={`${formStyles.form} ${styles.formContainer}`}
        style={{ position: "relative" }}
        layout="vertical"
      >
        <div className={formStyles.group}>
          <div className={formStyles.group}>
            <Form.Item name="role" label="Role in The Church">
              <Select placeholder="Role" className={formStyles.input}>
                <Select.Option value="member">Member</Select.Option>
                <Select.Option value="leader">Leader</Select.Option>
                <Select.Option value="staff">Staff</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="isActive" label="Active Member">
            <Radio.Group>
              <Radio value={true}>Active</Radio>
              <Radio value={false}>Inactive</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </Form>
      <div className={styles.actionContainer}>
        <Button className={styles.actionButton} onClick={() => form.submit()}>
          Save Changes
        </Button>
        <Button type="link" className={`${styles.actionButton} `} danger onClick={onRemoveHandler}>
          Delete Member
        </Button>
      </div>
    </div>
  );
};

export default MemberSettings;
