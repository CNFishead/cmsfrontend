"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Divider, Form, Input, Row, Select, message } from "antd";
import { useParams, useRouter } from "next/navigation";
import slugify from "slugify";

// Components
import PhotoUpload from "@/components/photoUpload/PhotoUpload.component";
import UserItem from "@/components/userItem/UserItem.component";
import LeaderSelectionModal from "../components/LeaderSelectionModal.component";

// Hooks and State
import useApiHook from "@/state/useApi";
import { useUser } from "@/state/auth";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";

// Types and Data
import MemberType from "@/types/MemberType";
import MinistryType from "@/types/Ministry";
import selectableMinistryTypes from "@/data/selectableMinistryTypes";

// Styles
import formStyles from "@/styles/Form.module.scss";
import styles from "../MinistryDetails.module.scss";

const MinistryInfo = () => {
  // Form and navigation
  const [form] = Form.useForm();
  const { id } = useParams();
  const router = useRouter();

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);

  // Hooks
  const { data: loggedInUser } = useUser();
  const { selectedProfile } = useSelectedProfile();

  // Data
  const selectableOptions = selectableMinistryTypes();
  const isEditMode = !!id;

  // API Hooks
  const { data: ministryData, isLoading: isLoadingMinistry } = useApiHook({
    url: `/ministry/${id}`,
    key: ["ministry", id as string],
    enabled: isEditMode,
    method: "GET",
  }) as { data: { payload: MinistryType }; isLoading: boolean };

  // Removed membersListData API hook - now handled in LeaderSelectionModal

  const { mutate: createMinistry } = useApiHook({
    successMessage: "Ministry created successfully",
    queriesToInvalidate: ["ministryList", "ministry", "membersList"],
    key: "ministryCreate",
    method: "POST",
  }) as any;

  const { mutate: updateMinistry } = useApiHook({
    successMessage: "Ministry updated successfully",
    queriesToInvalidate: ["ministryList", "ministry", "membersList"],
    key: "ministryUpdate",
    method: "PUT",
  }) as any;

  // Derived state
  const ministry = ministryData?.payload;
  const isLoading = isLoadingMinistry || isSubmitting;

  // Force re-render when ministry data loads
  const [dataLoaded, setDataLoaded] = useState(false);

  // Initialize form with ministry data
  useEffect(() => {
    if (ministry && isEditMode) {
      const formData = {
        ...ministry,
        leader: ministry.leader
          ? {
              _id: ministry.leader._id,
              fullName: ministry.leader.fullName,
              firstName: ministry.leader.firstName,
              lastName: ministry.leader.lastName,
              profileImageUrl: ministry.leader.profileImageUrl || "",
              email: ministry.leader.email || "",
              phoneNumber: ministry.leader.phoneNumber || "",
              role: ministry.leader.role || "",
              dateLastVisited: ministry.leader.dateLastVisited || null,
            }
          : undefined,
      };
      form.setFieldsValue(formData);
      setDataLoaded(true); // Force re-render of components
    }
  }, [ministry, isEditMode, form]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [form]);

  // Get current leader for display
  const getCurrentLeader = useCallback(() => {
    const currentLeader = form.getFieldValue("leader");
    if (!currentLeader || !currentLeader._id) return null;
    return currentLeader;
  }, [form]);

  // Handle leader selection from modal
  const handleLeaderSelect = useCallback(
    (selectedLeader: MemberType) => {
      form.setFieldsValue({
        leader: {
          _id: selectedLeader._id,
          fullName: selectedLeader.fullName || `${selectedLeader.firstName} ${selectedLeader.lastName}`,
          firstName: selectedLeader.firstName,
          lastName: selectedLeader.lastName,
          profileImageUrl: selectedLeader.profileImageUrl || "",
        },
      });
    },
    [form]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: any) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        if (isEditMode) {
          await updateMinistry({
            url: `/ministry/${id}`,
            formData: { ...values, _id: id },
          });
        } else {
          await createMinistry({
            url: `/ministry/${selectedProfile?._id}`,
            formData: values,
          });
          router.push("/ministries");
          form.resetFields();
        }
      } catch (error) {
        message.error("An error occurred while saving the ministry");
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, isEditMode, updateMinistry, createMinistry, id, selectedProfile, router, form]
  );

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        className={formStyles.form}
        onFinish={handleSubmit}
        initialValues={{
          ministryType: "Small Group",
        }}
      >
        <div className={`${formStyles.group} ${styles.formSection}`}>
          <div className={formStyles.editContainer}>
            <Divider orientation="left">Ministry Banner Image</Divider>
            <div className={styles.imageUploadContainer}>
              <div className={styles.imageContainer}>
                <PhotoUpload
                  listType="picture-circle"
                  isAvatar={false}
                  imgStyle={{}}
                  label=""
                  name="ministryImageUrl"
                  form={form}
                  action={`${process.env.API_URL}/upload/cloudinary`}
                  default={(ministry as any)?.ministryImageUrl || form.getFieldsValue().ministryImageUrl}
                  bodyData={{
                    username: loggedInUser?.accessKey,
                    folder: slugify(`${selectedProfile?.name}`),
                  }}
                  aspectRatio={14 / 10}
                  key={`photo-upload-${dataLoaded}-${(ministry as any)?.ministryImageUrl || "no-image"}`}
                />
              </div>
            </div>
            <div className={styles.helperText}>
              <p>Upload a banner image for your ministry</p>
              <p>This will be used as an image placeholder when members sign-in</p>
            </div>
            <Divider orientation="left">Ministry Details</Divider>

            <Form.Item
              name="name"
              label="Ministry Name"
              rules={[
                { required: true, message: "Please enter a ministry name" },
                { min: 2, message: "Ministry name must be at least 2 characters" },
                { max: 100, message: "Ministry name cannot exceed 100 characters" },
              ]}
            >
              <Input placeholder="Enter ministry name" className={formStyles.input} />
            </Form.Item>

            <Form.Item
              name="description"
              label="Ministry Description"
              className={styles.inputParent}
              rules={[
                { required: true, message: "Please provide a ministry description" },
                { min: 10, message: "Description must be at least 10 characters" },
                { max: 1000, message: "Description cannot exceed 1000 characters" },
              ]}
            >
              <Input.TextArea
                rows={4}
                className={formStyles.input}
                placeholder="Describe your ministry's mission and purpose..."
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item
              name="ministryType"
              className={styles.inputParent}
              label="Ministry Type"
              rules={[{ required: true, message: "Please select a ministry type" }]}
            >
              <Select placeholder="Select Ministry Type" className={formStyles.input}>
                {selectableOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {/* Leader Selection */}
            <div className={styles.leaderSelection}>
              <label className={styles.leaderLabel}>Ministry Leader</label>
              {getCurrentLeader() ? (
                <div className={styles.selectedLeader}>
                  <UserItem user={getCurrentLeader() as any} key={`leader-${getCurrentLeader()?._id}-${dataLoaded}`}/>
                  <Button type="link" onClick={() => setIsLeaderModalOpen(true)} className={styles.changeLeaderBtn}>
                    Change Leader
                  </Button>
                </div>
              ) : (
                <Button
                  type="dashed"
                  onClick={() => setIsLeaderModalOpen(true)}
                  className={styles.selectLeaderBtn}
                  block
                >
                  Select Ministry Leader
                </Button>
              )}
            </div>
            <div className={styles.submitContainer}>
              <Row justify={"center"}>
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  className={formStyles.submitButton}
                  loading={isSubmitting}
                  disabled={isLoading}
                >
                  {isEditMode ? "Update Ministry" : "Create Ministry"}
                </Button>
              </Row>
            </div>
          </div>
        </div>
      </Form>

      {/* Leader Selection Modal */}
      <LeaderSelectionModal
        open={isLeaderModalOpen}
        onClose={() => setIsLeaderModalOpen(false)}
        currentLeader={getCurrentLeader()}
        onLeaderSelect={handleLeaderSelect}
        ministryId={id as string}
      />
    </div>
  );
};

export default MinistryInfo;
