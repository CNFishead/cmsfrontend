import User from "@/types/User";
import { ColumnsType } from "antd/es/table";
import { Button, Space, Tag, Avatar, Typography, Popconfirm } from "antd";
import { UserOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { TeamMember } from "@/types/Ministry";

const { Text } = Typography;

interface ColumnProps {
  onRemoveUser: (userId: string, userName: string) => void;
}

const columns = ({ onRemoveUser }: ColumnProps): ColumnsType<TeamMember> => {
  return [
    {
      title: "User",
      key: "user",
      ellipsis: true,
      render: (record: any) => {
        return (
          <Space>
            <Avatar src={record?.profileImageUrl} icon={<UserOutlined />} />
            <div>
              <div style={{ fontWeight: 500 }}>
                {record?.fullName || `${record?.firstName} ${record?.lastName}` || "Unknown User"}
              </div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {record?.email}
              </Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string[]) => {
        return role.map((r: string) => (<Tag key={r}>{r}</Tag>));
      },
    },
    {
      title: "Status",
      key: "status",
      render: (record: any) => (
        <Tag color={record?.isActive ? "green" : "orange"}>
          {record?.isActive ? "Active" : record?.isEmailVerified ? "Inactive" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "user",
      key: "createdAt",
      render: (user: User) => (
        <Text type="secondary">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_: any, record: TeamMember) => (
        <Space>
          <Link href={`/users/${record?.user?._id}`} passHref>
            <Button type="link" icon={<UserOutlined />} size="small">
              View
            </Button>
          </Link>
          <Popconfirm
            title="Remove User"
            description={`Are you sure you want to remove ${
              record?.user?.fullName || record?.user?.firstName
            } from the team?`}
            onConfirm={() => onRemoveUser(record?.user?._id, record?.user?.fullName || record?.user?.firstName)}
            okText="Yes, Remove"
            cancelText="Cancel"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small">
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
};

export default columns;
