"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Button, Space, Typography, Avatar, Divider } from "antd";
import { UserOutlined, SaveOutlined } from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import { TeamMember } from "@/types/Ministry";
import formStyles from "@/styles/Form.module.scss";
import styles from "./UserManagement.module.scss";

const { Option } = Select;
const { Text, Title } = Typography;

interface ManageUserRoleModalProps {
  open: boolean;
  onClose: () => void;
  user: TeamMember | null;
  teamId: string;
  onUpdateSuccess: () => void;
}

const ManageUserRoleModal: React.FC<ManageUserRoleModalProps> = ({ open, onClose, user, teamId, onUpdateSuccess }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addAlert } = useInterfaceStore();

  // API hook for updating user role
  const { mutate: updateUserRole } = useApiHook({
    method: "PUT",
    key: "update-team-user-role",
  }) as any;

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        role: user.role || "Member",
      });
    }
  }, [user, form]);

  const handleUpdateRole = async (values: { role: string }) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      updateUserRole(
        {
          url: `/team/${teamId}/user/${user.user._id}/role`,
          payload: {
            role: values.role,
          },
        },
        {
          onSuccess: () => {
            addAlert({
              type: "success",
              message: `${user.user.fullName || user.user.firstName}'s role has been updated successfully`,
              duration: 5000,
            });
            setIsSubmitting(false);
            onUpdateSuccess();
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || "Failed to update user role";
            addAlert({
              type: "error",
              message: errorMessage,
              duration: 5000,
            });
            setIsSubmitting(false);
            console.error("Update role error:", error);
          },
        }
      );
    } catch (error) {
      addAlert({
        type: "error",
        message: "An error occurred while updating the role",
        duration: 5000,
      });
      setIsSubmitting(false);
      console.error("Update role error:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  if (!user) return null;

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          <span>Manage User Role</span>
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <div style={{ marginBottom: 24 }}>
        <Space size={12}>
          <Avatar size={64} src={user.user.profileImageUrl} icon={<UserOutlined />} />
          <div>
            <Title level={5} style={{ margin: 0 }}>
              {user.user.fullName || `${user.user.firstName} ${user.user.lastName}`}
            </Title>
            <Text type="secondary">{user.user.email}</Text>
          </div>
        </Space>
      </div>

      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateRole}
        className={formStyles.form}
        initialValues={{
          role: user.role || "Member",
        }}
      >
        <Form.Item
          name="role"
          label="Role / Permission Level"
          rules={[{ required: true, message: "Please select a role" }]}
          help="Select the permission level for this user"
        >
          <Select size="large" placeholder="Select a role">
            <Option value="Owner">Owner - Full access and control</Option>
            <Option value="Admin">Admin - Can manage most settings and users</Option>
            <Option value="Leader">Leader - Can manage content and members</Option>
            <Option value="Member">Member - Basic access</Option>
            <Option value="Viewer">Viewer - Read-only access</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSubmitting}>
              Update Role
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ManageUserRoleModal;
