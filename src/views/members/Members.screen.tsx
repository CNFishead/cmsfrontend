"use client";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import styles from "./Members.module.scss";
import React from "react";
import { AiOutlinePlus, AiOutlineUser } from "react-icons/ai";
import MemberType from "@/types/MemberType";
import { Avatar, Button, Skeleton, Table } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useFetchData from "@/state/useFetchData";
import useRemoveData from "@/state/useRemoveData";
import { useUser } from "@/state/auth";
import useApiHook from "@/state/useApi";

const Members = () => {
  const router = useRouter();

  const { data: loggedInData } = useUser();
  const { data: selectedProfile } = useFetchData({
    url: `/ministry/${loggedInData.user?.ministry?._id}`,
    key: "selectedProfile",
    enabled: !!loggedInData?.user?.ministry?._id,
  });

  const { data: membersListData, isLoading: loading } = useApiHook({
    url: `/member/${selectedProfile?.ministry?._id}`,
    key: "members",
    enabled: !!selectedProfile?.ministry?._id,
    method: "GET",
    filter: `user;${loggedInData.user?._id}`,
  }) as any;

  const { mutate: deleteMember } = useRemoveData({
    queriesToInvalidate: ["members"],
  });
  return (
    <div className={styles.container}>
      <SearchWrapper
        buttons={[
          {
            toolTip: "Add Member",
            icon: (
              <div className={styles.iconContainer}>
                <AiOutlinePlus /> <AiOutlineUser className={styles.icon} />
              </div>
            ),
            // set onClick to return nothing
            onClick: () => {
              router.push("/members/new");
            },
            type: "primary",
          },
        ]}
        filters={[
          {
            label: "All",
            key: "",
          },
          {
            label: "Staff Only",
            key: `role;{"$eq":"staff"}`,
          },
        ]}
        sort={[
          {
            label: "None",
            key: "",
          },
          {
            label: "Name (A-Z)",
            key: "firstName;1",
          },
        ]}
        placeholder="Search Members"
        queryKey="members"
        total={membersListData?.totalCount}
        isFetching={loading}
      >
        <div className={styles.contentContainer}>
          <Table
            className={styles.table}
            dataSource={membersListData?.members}
            loading={loading}
            size="small"
            rowKey={(record: MemberType) => record._id}
            columns={[
              {
                title: "Member",
                dataIndex: "profileImageUrl",
                key: "profileImageUrl",
                render: (text: string, record: MemberType) => {
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <Avatar src={text} size={64} /> <span>{record.fullName}</span>
                    </div>
                  );
                },
              },
              // {
              //   title: "Family",
              //   // we want the family name, family is an object containing the family id and name
              //   dataIndex: ["family", "name"],
              //   key: "family",
              // },
              {
                title: "Email",
                dataIndex: "email",
                key: "email",
              },
              {
                title: "Phone",
                dataIndex: "phoneNumber",
                key: "phone",
                render: (text: string) => {
                  // format the phone number
                  if (!text) return null;
                  // if the string has an 11th character, it is a country code
                  if (text.length === 11) {
                    return text.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "+$1 ($2) $3-$4");
                  }
                  // otherwise, it is a US number
                  return text.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
                },
              },
              {
                title: "Address",
                dataIndex: "location",
                key: "address",
                render: (text: {
                  address: string;
                  address2: string;
                  city: string;
                  state: string;
                  country: string;
                  zipCode: string;
                }) => {
                  // location is an object containing the address city and state of the member
                  // return as a string with the city and state
                  // return all information that is not null or undefined
                  return `${text?.address ?? ""} ${text?.address2 ?? ""} ${text?.city ? `${text?.city},` : ""} ${
                    text?.state ?? ""
                  } ${text?.zipCode ?? ""}`.trim();
                },
              },
              {
                title: "Sex",
                dataIndex: "sex",
                key: "sex",
              },
              {
                title: "Marital Status",
                dataIndex: "maritalStatus",
                key: "maritalStatus",
              },
              {
                title: "# Ministries part of",
                dataIndex: "ministriesMemberOf",
                key: "ministriesMemberOf",
                render: (text: any) => {
                  return text?.length;
                },
              },
              {
                title: "Leader of Ministries",
                dataIndex: "numberOfLeaderMinistries",
                key: "numberOfLeaderMinistries",
                render: (text: any) => {
                  return text?.length;
                },
              },
              {
                title: "Role",
                dataIndex: "role",
                key: "role",
              },
              {
                title: "Birthday",
                dataIndex: "birthday",
                key: "birthday",
                render: (text: string) => {
                  // check if exists, if not return n/a
                  if (!text) return "N/A";
                  return new Date(text).toLocaleDateString();
                },
              },
              {
                title: "Child",
                dataIndex: "isChild",
                key: "isChild",
                render: (text: boolean) => {
                  return text ? "Yes" : "No";
                },
              },
              {
                title: "Actions",
                dataIndex: "actions",
                key: "actions",
                render: (text: string, record: MemberType) => {
                  return (
                    <div className={styles.actions}>
                      <Link href={`/members/${record._id}`}>
                        <Button>
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button onClick={() => deleteMember({ url: `/member/${record._id}` })}>
                        <FaTrash />
                      </Button>
                    </div>
                  );
                },
              },
            ]}
            pagination={false}
          />
        </div>
      </SearchWrapper>
    </div>
  );
};

export default Members;