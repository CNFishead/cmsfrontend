"use client";
import React from "react";
import styles from "./Ministry.module.scss";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import { AiOutlinePlus } from "react-icons/ai";
import useFetchData from "@/state/useFetchData";
import { Avatar, Button, Table, Modal, Tooltip, QRCode } from "antd";
import { default as MinistryType } from "@/types/Ministry";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import useRemoveData from "@/state/useRemoveData";
import { useRouter } from "next/navigation";
import { useUser } from "@/state/auth";
import useApiHook from "@/state/useApi";
import { IoQrCode } from "react-icons/io5";

const Ministry = () => {
  const router = useRouter();
  const { data: loggedInData } = useUser();
  const { data: selectedProfile, isLoading: profileIsLoading } = useFetchData({
    url: `/ministry/${loggedInData.user?.ministry?._id}`,
    key: "selectedProfile",
    enabled: !!loggedInData?.user?.ministry?._id,
  });

  const {
    data: ministryData,
    isFetching,
    isLoading: loading,
  } = useApiHook({
    url: `/ministry/${selectedProfile?.ministry?._id}/subministries`,
    key: "ministryList",
    enabled: !!selectedProfile?.ministry?._id,
    method: "GET",
    filter: `user;${loggedInData?.user?._id}`,
  }) as any;

  const { mutate: deleteMinistry } = useApiHook({
    method: "DELETE",
    successMessage: "Ministry deleted successfully",
    queriesToInvalidate: ["ministryList"],
    key: "deleteMinistry",
  }) as any;
  function doDownload(url: string, fileName: string) {
    const a = document.createElement("a");
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  const downloadSvgQRCode = () => {
    const svg = document.getElementById("myqrcode")?.querySelector<SVGElement>("svg");
    const svgData = new XMLSerializer().serializeToString(svg!);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    doDownload(url, "QRCode.svg");
  };
  return (
    <div className={styles.container}>
      <SearchWrapper
        buttons={[
          {
            toolTip: "Create new Ministry",
            icon: <AiOutlinePlus className={styles.icon} />,
            onClick: () => {
              router.push("/ministries/new");
            },
            type: "primary",
          },
        ]}
        placeholder="Search for ministries"
        total={ministryData?.totalCount}
        queryKey={"ministryList"}
        isFetching={isFetching}
      >
        <div className={styles.contentContainer}>
          <Table
            className={styles.table}
            dataSource={ministryData?.ministries}
            loading={loading}
            size="small"
            rowKey={(record: MinistryType) => record._id}
            columns={[
              {
                title: "Ministry Name",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "# of Members",
                dataIndex: "members",
                key: "members",
                render: (text: string, record: MinistryType) => {
                  return <span>{record.members?.length}</span>;
                },
              },
              {
                title: "Ministry Leader",
                dataIndex: "leader",
                key: "leader",
                render: (text: string, record: MinistryType) => {
                  return (
                    <Link href={`/members/${record.leader?._id}`}>
                      <div className={styles.leader}>
                        <Avatar src={record.leader?.profileImageUrl} />
                        <span>{record.leader?.fullName}</span>
                      </div>
                    </Link>
                  );
                },
              },
              {
                title: "Actions",
                dataIndex: "actions",
                key: "actions",
                render: (text: string, record: MinistryType) => {
                  return (
                    <div className={styles.actions}>
                      <Link href={`/ministries/${record._id}`}>
                        <Button>
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        onClick={() =>
                          Modal.confirm({
                            title: "Are you sure you want to delete this ministry?",
                            content: "This action cannot be undone",
                            style: { pointerEvents: "auto" },
                            onOk: () => {
                              deleteMinistry({
                                url: `/ministry/${selectedProfile?.ministry?._id}/subministries/${record._id}`,
                              });
                            },
                          })
                        }
                        disabled={record._id === selectedProfile?.ministry?._id}
                      >
                        <FaTrash />
                      </Button>
                      <Tooltip title="Generate QR Code">
                        <Button
                          onClick={() =>
                            Modal.confirm({
                              title: "Ministry QR Code",
                              content: (
                                <QRCode
                                  value={`${process.env.NEXT_PUBLIC_CHECKINAPP_URL}/${record._id}`}
                                  type="svg"
                                  id="myqrcode"
                                />
                              ),
                              onOk: () => {
                                downloadSvgQRCode();
                              },
                              // change ok button text to download
                              okText: "Download",
                            })
                          }
                        >
                          <IoQrCode />
                        </Button>
                      </Tooltip>
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

export default Ministry;
