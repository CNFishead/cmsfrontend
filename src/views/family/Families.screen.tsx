"use client";
import React from "react";
import styles from "./Families.module.scss";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import { AiOutlinePlus } from "react-icons/ai";
import CreateFamilyModal from "./modal/CreateFamilyModal.modal";
import FamilyType from "@/types/FamilyType";
import { Avatar, Button, Col, Modal, Row, Table } from "antd";
import Loader from "@/components/loader/Loader.component";
import Error from "@/components/error/Error.component";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import useApiHook from "@/state/useApi";
import { useUser } from "@/state/auth";

const Families = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = React.useState(false);
  const { data: loggedInData } = useUser();
  const { mutate: deleteFamily } = useApiHook({
    method: "DELETE",
    key: "deleteFamily",
    queriesToInvalidate: ["families"],
  }) as any;

  const {
    data: familyList,
    isLoading,
    isError,
    error,
  } = useApiHook({
    url: "/family",
    key: "families",
    method: "GET",
    filter: `user;${loggedInData?.user._id}`,
    enabled: !!loggedInData?.user._id,
  }) as any;

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this family?",
      content:
        "This action cannot be undone, This will not remove members, but it may interfere with member association",
      onOk: async () => {
        await deleteFamily({ url: `/family/${id}` });
      },
    });
  };
  if (isLoading) return <Loader />;
  if (isError) return <Error error={error} />;

  return (
    <div className={styles.container}>
      <SearchWrapper
        buttons={[
          {
            toolTip: "Create new Family",
            icon: <AiOutlinePlus className={styles.icon} />,
            onClick: () => {
              setModalOpen(true);
            },
            type: "primary",
          },
        ]}
        placeholder="Search for Families"
        total={familyList?.total}
        isFetching={isLoading}
        queryKey="families"
      >
        <CreateFamilyModal
          open={modalOpen}
          onClose={(form) => {
            setModalOpen(false);
            form.resetFields();
          }}
        />
        <Table
          dataSource={familyList?.payload}
          pagination={false}
          rowKey={(record: FamilyType) => record._id}
          columns={[
            {
              title: "Family",
              dataIndex: "name",
              key: "name",
              render: (text, record) => {
                // return up to 2 avatars from the available members array, and the family name
                return (
                  <Row align="middle" gutter={10}>
                    {record.members.slice(0, 2).map((member) => (
                      <Col key={member._id}>
                        <Avatar src={member.profileImageUrl} alt={member.fullName} size={"large"} />
                      </Col>
                    ))}
                    <Col>{text}</Col>
                  </Row>
                );
              },
            },
            {
              title: "# of Members.",
              dataIndex: "members",
              key: "members",
              render: (text, record) => {
                return text.length;
              },
            },
            {
              title: "Actions",
              key: "actions",
              render: (text, record) => (
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    onClick={() => router.push(`/families/${record._id}`)}
                    //  disabled
                  >
                    <FaEdit />
                  </Button>
                  <Button onClick={() => handleDelete(record._id)}>
                    <FaTrash style={{ color: "red" }} />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </SearchWrapper>
    </div>
  );
};

export default Families;
