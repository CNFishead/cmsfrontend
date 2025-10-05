"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Modal, Input, List, Avatar, Button, Empty, Spin, message } from "antd";
import { SearchOutlined, UserOutlined, CheckOutlined } from "@ant-design/icons";

// Hooks and State
import useApiHook from "@/state/useApi";
import { useUser } from "@/state/auth";
import { useSearchStore } from "@/state/search/search";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";
import { useQueryClient } from "@tanstack/react-query";

// Types
import MemberType from "@/types/MemberType";

// Styles
import styles from "./LeaderSelectionModal.module.scss";

interface LeaderSelectionModalProps {
  open: boolean;
  onClose: () => void;
  currentLeader?: MemberType | null;
  onLeaderSelect: (leader: MemberType) => void;
  ministryId?: string;
}

const LeaderSelectionModal: React.FC<LeaderSelectionModalProps> = ({
  open,
  onClose,
  currentLeader,
  onLeaderSelect,
  ministryId,
}) => {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeader, setSelectedLeader] = useState<MemberType | null>(currentLeader || null);

  // Hooks
  const { data: loggedInUser } = useUser();
  const { selectedProfile } = useSelectedProfile();
  const { setSearch } = useSearchStore();
  const queryClient = useQueryClient();

  // API Hook for members
  const { data: membersListData, isLoading: isLoadingMembers } = useApiHook({
    url: `/ministry/member`,
    key: ["membersList", searchTerm],
    enabled: !!selectedProfile?._id && open,
    method: "GET",
    filter: `ministry;{"$in": "${selectedProfile?._id}"}`,
    keyword: searchTerm.trim() ? searchTerm.trim() : undefined,
  }) as { data: { payload: MemberType[] }; isLoading: boolean };

  const members = membersListData?.payload || [];

  // API Hook for updating ministry leader
  const { mutate: updateMinistryLeader, isLoading: isUpdating } = useApiHook({
    successMessage: "Ministry leader updated successfully",
    queriesToInvalidate: ["ministry", "ministryList"],
    key: "updateMinistryLeader",
    method: "PUT",
  }) as any;

  // Filter members based on search term
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;

    const search = searchTerm.toLowerCase();
    return members.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const email = member.email?.toLowerCase() || "";
      return fullName.includes(search) || email.includes(search);
    });
  }, [members, searchTerm]);

  // Update search when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim()) {
      setSearch(searchTerm);
      queryClient.invalidateQueries(["membersList"] as any);
    }
  }, [searchTerm, setSearch, queryClient]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setSelectedLeader(currentLeader || null);
      setSearchTerm("");
    } else {
      setSearchTerm("");
      setSearch("");
    }
  }, [open, currentLeader, setSearch]);

  // Handle member selection
  const handleMemberSelect = (member: MemberType) => {
    setSelectedLeader(member);
  };

  // Handle confirm selection
  const handleConfirm = async () => {
    if (selectedLeader) {
      // Update form state immediately
      onLeaderSelect(selectedLeader);

      // If we have a ministryId, update the ministry on the server
      if (ministryId) {
        try {
          await updateMinistryLeader({
            url: `/ministry/${ministryId}`,
            formData: {
              leader: {
                _id: selectedLeader._id,
                fullName: selectedLeader.fullName || `${selectedLeader.firstName} ${selectedLeader.lastName}`,
                firstName: selectedLeader.firstName,
                lastName: selectedLeader.lastName,
              },
            },
          });
        } catch (error) {
          message.error("Failed to update ministry leader. Please try again.");
          console.error("Error updating ministry leader:", error);
          return; // Don't close modal on error
        }
      }

      onClose();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedLeader(currentLeader || null);
    onClose();
  };

  // Get display name for member
  const getMemberDisplayName = (member: MemberType) => {
    if (member.fullName) return member.fullName;
    return `${member.firstName} ${member.lastName}`;
  };

  return (
    <Modal
      title="Select Ministry Leader"
      open={open}
      onCancel={handleCancel}
      width={600}
      className={styles.modal}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm} disabled={!selectedLeader} loading={isUpdating}>
          {isUpdating ? "Updating..." : "Select Leader"}
        </Button>,
      ]}
    >
      <div className={styles.modalContent}>
        {/* Search Input */}
        <div className={styles.searchContainer}>
          <Input
            placeholder="Search by name or email..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            allowClear
          />
        </div>

        {/* Current Leader Display */}
        {currentLeader && (
          <div className={styles.currentLeader}>
            <h4 className={styles.currentLeaderTitle}>Current Leader:</h4>
            <div className={styles.leaderCard}>
              <Avatar src={currentLeader.profileImageUrl} icon={<UserOutlined />} size={40} />
              <div className={styles.leaderInfo}>
                <span className={styles.leaderName}>{getMemberDisplayName(currentLeader)}</span>
                {currentLeader.email && <span className={styles.leaderEmail}>{currentLeader.email}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Members List */}
        <div className={styles.membersList}>
          <h4 className={styles.membersListTitle}>Available Members:</h4>
          {isLoadingMembers ? (
            <div className={styles.loading}>
              <Spin size="large" />
              <p className={styles.loadingText}>Loading members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className={styles.empty}>
              {searchTerm.trim() ? "No members found matching your search" : "No members available"}
            </div>
          ) : (
            <List
              className={styles.list}
              dataSource={filteredMembers}
              renderItem={(member) => (
                <List.Item
                  className={`${styles.memberItem} ${selectedLeader?._id === member._id ? styles.selected : ""}`}
                  onClick={() => handleMemberSelect(member)}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={member.profileImageUrl} icon={<UserOutlined />} size={40} />}
                    title={
                      <div className={styles.memberTitle}>
                        <span>{getMemberDisplayName(member)}</span>
                        {selectedLeader?._id === member._id && <CheckOutlined className={styles.checkIcon} />}
                      </div>
                    }
                    description={
                      <div className={styles.memberDescription}>
                        {member.email && <span className={styles.memberEmail}>{member.email}</span>}
                        {member.phoneNumber && <span className={styles.memberPhone}>{member.phoneNumber}</span>}
                        {member.role && <span className={styles.memberRole}>Role: {member.role}</span>}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LeaderSelectionModal;
