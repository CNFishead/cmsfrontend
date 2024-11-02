"use client";
import { Avatar, Button, Card, Col, Form, Input, Modal, Row, Tooltip } from "antd";
import React from "react";
import styles from "./FamilyEdit.module.scss";
import { FaEdit, FaTimes } from "react-icons/fa";
import FloatingActionButton from "@/components/floatingActionButton/FloatingActionButton.component";
import MemberType from "@/types/MemberType";
import { BsPlus } from "react-icons/bs";
import { SettingFilled } from "@ant-design/icons";
import useFetchData from "@/state/useFetchData";
import useUpdateData from "@/state/useUpdateData";
import { useUser } from "@/state/auth";
import Error from "@/components/error/Error.component";
import { useParams } from "next/navigation";

/**
 * @description - FamilyEditScreen component, renders the family edit screen, this is the screen that is shown when a user clicks on a family item
 * @returns {JSX.Element} - FamilyEditScreen
 */
const FamilyEdit = () => {
  // get the id from params
  const { id } = useParams();
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = React.useState(false);
  const [actionButtons, setActionButtons] = React.useState([
    {
      tooltip: "Add Member",
      color: "#1890ff",
      icon: <BsPlus />,
      action: () => setOpenModal(true),
    },
    {
      tooltip: "Delete Family",
      color: "#ff4d4f",
      icon: <FaEdit />,
      action: () => console.log("delete family"),
    },
  ]);
  const { data: loggedInData } = useUser();
  const {
    data: selectedFamily,
    isLoading,
    isError,
    error,
  } = useFetchData({
    url: `/family/${id}`,
    key: "selectedFamily",
    enabled: !!id,
  });
  const { mutate: updateFamily } = useUpdateData({ queriesToInvalidate: ["selectedFamily"] });
  const { data: selectedProfile, isLoading: profileIsLoading } = useFetchData({
    url: `/ministry/${loggedInData.user?.ministry?._id}`,
    key: "selectedProfile",
    enabled: !!loggedInData?.user?.ministry?._id,
  });
  const { data: membersListData, isLoading: loading } = useFetchData({
    url: `/member/${selectedProfile?.ministry?._id}`,
    key: "members",
    enabled: !!selectedProfile?.ministry?._id,
  });

  React.useEffect(() => {
    if (!loggedInData) return;
    form.setFieldsValue({
      name: selectedFamily?.family?.name,
    });
  }, [selectedFamily]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <Error error={error.message} />;
  return (
    <Row className={styles.container} justify={"space-between"}>
      {/* <AddMemberModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        // ministryId={ministry?._id ?? mainMinistry?._id}
        members={membersListData?.members ?? []}
        loading={loading}
      /> */}
      <FloatingActionButton buttons={actionButtons} icon={<SettingFilled />} />
      <Col className={styles.formContainer} span={19}>
        <div className={styles.detailsContainer}>
          <div className={styles.nameContainer}>
            <p className={styles.name}>
              You are viewing information for the <span>{selectedFamily?.family?.name}</span> family
            </p>
          </div>
        </div>
        <Form form={form} layout={"vertical"}>
          <Col span={4}>
            <Form.Item name="name">
              <Input addonBefore="Family Name" className={styles.nameInput} />
            </Form.Item>
          </Col>
        </Form>
      </Col>
      <Col span={5} className={styles.familyMemberContainer}>
        {/* add members button, creates a modal popup that allows searching of different members */}

        {selectedFamily?.family?.members.map((member: MemberType) => {
          return (
            <Card
              bodyStyle={{ width: "100%", padding: "5%" }}
              key={member._id}
              className={styles.familyMember}
              hoverable
            >
              <div className={styles.familyMemberDetailsContainer}>
                <Avatar size={32} src={member.profileImageUrl} className={styles.profileImage} />
                <p className={styles.familyMemberName}> {member.fullName}</p>
                <div className={styles.actionContainer}>
                  <Button
                    // type="ghost"
                    className={styles.actionButton}
                    onClick={() =>
                      Modal.confirm({
                        title: "Remove Member",
                        content: `Are you sure you want to remove ${member.fullName} from the family?`,
                        onOk: () => {
                          // dispatch(removeFamilyMember(family?._id, member._id) as any);
                          // dispatch(getFamilyAction(family?._id) as any);
                        },
                      })
                    }
                  >
                    <Tooltip title="Remove Member">
                      <FaTimes className={styles.deleteIcon} />
                    </Tooltip>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </Col>
    </Row>
  );
};

export default FamilyEdit;
