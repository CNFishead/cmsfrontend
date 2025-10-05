import React from "react";
import styles from "./CalendarTable.module.scss";
import { Button, Modal, Table } from "antd";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import { useUser } from "@/state/auth";
import useApiHook from "@/state/useApi";

const CalendarTable = () => {
  const { data: loggedInUser } = useUser();
  const { data, isLoading: loading } = useApiHook({
    url: "/event",
    key: ["events"],
    enabled: !!loggedInUser?._id,
    filter: `user;${loggedInUser?._id}`,
    method: "GET",
  }) as any;

  const { mutate: deleteEvent } = useApiHook({
    key: "eventDelete",
    queriesToInvalidate: ["events"],
    method: "DELETE",
    successMessage: "Event deleted successfully",
  }) as any;

  return (
    <div className={styles.container}>
      <SearchWrapper
        buttons={[]}
        filters={[
          {
            label: "All",
            key: "",
          },
        ]}
        sort={[
          {
            label: "None",
            key: "",
          },
          {
            label: "Name (A-Z)",
            key: "name;1",
          },
        ]}
        placeholder="Search events"
        queryKey="events"
        total={data?.metadata?.totalCount}
        isFetching={loading}
      >
        <div className={styles.contentContainer}>
          <Table
            className={styles.table}
            dataSource={data?.payload}
            loading={loading}
            size="small"
            rowKey={(record: any) => record._id}
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "Hosting Ministry",
                dataIndex: "ministry.name",
                key: "ministry.name",
                render: (text: string, record: any) => {
                  return record?.ministry?.name;
                },
              },
              {
                title: "Past event",
                dataIndex: "isPastEvent",
                key: "isPastEvent",
                render: (text: string, record: any) => {
                  const currentDate = new Date();
                  const isPastEvent = new Date(record.endDate) < currentDate;
                  return isPastEvent ? "Yes" : "No";
                },
              },
              {
                title: "Start Date",
                dataIndex: "startDate",
                key: "startDate",
                render: (text: string, record: any) => {
                  return new Date(record.startDate).toLocaleDateString();
                },
              },
              {
                title: "End Date",
                dataIndex: "endDate",
                key: "endDate",
                render: (text: string, record: any) => {
                  return new Date(record.endDate).toLocaleDateString();
                },
              },
              {
                title: "Actions",
                dataIndex: "actions",
                key: "actions",
                render: (text: string, record: any) => {
                  return (
                    <div className={styles.actions}>
                      <Link href={`/events/${record._id}`}>
                        <Button>
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        onClick={() =>
                          Modal.confirm({
                            title: "Are you sure you want to delete this event?",
                            content: `Deleting the event ${record.name} will remove it from the database. Anyone who has already registered for this event will *not* be notified. And will no longer
                            receive reminders for this event.`,
                            onOk: () => {
                              deleteEvent({ url: `/event/${record._id}` });
                            },
                            okType: "danger",
                            okText: "Delete",
                          })
                        }
                      >
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

export default CalendarTable;
